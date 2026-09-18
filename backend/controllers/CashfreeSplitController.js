const crypto = require("crypto");
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Coach = require("../models/CoachModel");
const PersonalTrainer = require("../models/PersonalTrainingModel");
const CashfreeSplit = require("../models/CashfreeSplitModel");

const API_VERSION = process.env.CASHFREE_EASY_SPLIT_API_VERSION || "2026-01-01";
const baseUrl = () => process.env.CASHFREE_BASE_URL || (process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg");
const headers = (idempotencyKey) => ({
  "Content-Type": "application/json",
  "x-api-version": API_VERSION,
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  "x-request-id": crypto.randomUUID(),
  ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
});

const modelFor = (type) => ({ venue: User, coach: Coach, trainer: PersonalTrainer }[String(type || "").toLowerCase()]);
const validProvider = (type, account) => type !== "venue" || account.role === "Venue Admin";
const nameOf = (account) => account.full_name || `${account.first_name || ""} ${account.last_name || ""}`.trim() || "Khelo Indore provider";
const vendorIdFor = (type, id) => `KI_${String(type).toUpperCase()}_${String(id).slice(-18)}`;

const configured = () => process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY;

exports.onboardCashfreeVendor = async (req, res) => {
  try {
    const providerType = String(req.params.providerType || "").toLowerCase();
    const Account = modelFor(providerType);
    if (!Account || !mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: "Invalid provider." });
    if (!configured()) return res.status(503).json({ success: false, message: "Cashfree credentials are not configured." });
    const account = await Account.findById(req.params.id);
    if (!account || !validProvider(providerType, account)) return res.status(404).json({ success: false, message: "Provider not found." });

    const { bank, upi, kyc_details, schedule_option = 1, dashboard_access = false } = req.body || {};
    if (!kyc_details || (!bank && !upi)) return res.status(400).json({ success: false, message: "KYC details and either bank or UPI details are required." });
    const vendorId = account.cashfree_vendor_id || vendorIdFor(providerType, account._id);
    const payload = {
      vendor_id: vendorId,
      status: "ACTIVE",
      name: nameOf(account).replace(/[^a-zA-Z0-9 .\/&-]/g, "").trim(),
      email: account.email,
      phone: String(account.mobile || "").replace(/\D/g, ""),
      verify_account: true,
      dashboard_access: Boolean(dashboard_access),
      schedule_option: Number(schedule_option) || 1,
      kyc_details,
      ...(bank ? { bank } : { upi }),
    };
    const response = await axios.post(`${baseUrl()}/easy-split/vendors`, payload, { headers: headers(crypto.randomUUID()), timeout: 30000 });
    account.cashfree_vendor_id = response.data.vendor_id || vendorId;
    account.cashfree_vendor_status = response.data.status || "PENDING";
    account.cashfree_vendor_updated_at = new Date();
    await account.save();
    return res.status(200).json({ success: true, data: { vendor_id: account.cashfree_vendor_id, status: account.cashfree_vendor_status } });
  } catch (error) {
    console.error("Cashfree vendor onboarding failed:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ success: false, message: error.response?.data?.message || "Unable to onboard Cashfree vendor." });
  }
};

// Called by payment-success handlers only. Cashfree requires this call after a
// successful order; the payment flow records it as pending before it is sent.
exports.requestSplit = async ({ orderId, bookingId, providerType, providerId, grossAmount, platformPercentage = 15 }) => {
  const Account = modelFor(providerType);
  if (!configured() || !Account || !providerId) return null;
  const account = await Account.findById(providerId).lean();
  if (!account?.cashfree_vendor_id || account.cashfree_vendor_status !== "ACTIVE") return null;
  const vendorPercentage = 100 - Number(platformPercentage || 0);
  if (vendorPercentage <= 0 || vendorPercentage > 100) throw new Error("Invalid Cashfree split percentage.");
  const split = await CashfreeSplit.findOneAndUpdate(
    { order_id: orderId },
    { $setOnInsert: { order_id: orderId, booking_id: bookingId, provider_type: providerType, provider_id: providerId, cashfree_vendor_id: account.cashfree_vendor_id, gross_amount: grossAmount, vendor_percentage: vendorPercentage, platform_percentage: 100 - vendorPercentage } },
    { upsert: true, new: true }
  );
  if (split.split_status === "SUCCESS") return split;
  const response = await axios.post(`${baseUrl()}/easy-split/orders/${encodeURIComponent(orderId)}/split`, {
    split: [{ vendor_id: account.cashfree_vendor_id, percentage: vendorPercentage, tags: { booking_id: String(bookingId || "") } }],
    disable_split: true,
  }, { headers: headers(crypto.randomUUID()), timeout: 30000 });
  split.split_status = response.data?.status === "OK" ? "SUCCESS" : "REQUESTED";
  split.split_requested_at = new Date();
  split.split_completed_at = split.split_status === "SUCCESS" ? new Date() : null;
  await split.save();
  return split;
};

exports.cashfreeSplitWebhook = async (req, res) => {
  try {
    const timestamp = req.get("x-webhook-timestamp");
    const signature = req.get("x-webhook-signature");
    const expectedSignature = timestamp && process.env.CASHFREE_SECRET_KEY
      ? crypto.createHmac("sha256", process.env.CASHFREE_SECRET_KEY).update(`${timestamp}${req.rawBody || ""}`).digest("base64")
      : "";
    if (!timestamp || !signature || !expectedSignature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ success: false, message: "Invalid webhook signature." });
    }
    const event = req.body || {};
    const orderId = event.order_id || event.data?.order_id || event.merchant_order_id;
    const vendorId = event.vendor_id || event.data?.vendor_id;
    const vendorStatus = event.vendor_status || event.data?.vendor_status || event.status || event.data?.status;
    if (vendorId && vendorStatus) {
      await Promise.all([User, Coach, PersonalTrainer].map((Model) => Model.updateMany(
        { cashfree_vendor_id: vendorId },
        { cashfree_vendor_status: vendorStatus, cashfree_vendor_updated_at: new Date() }
      )));
    }
    if (orderId) {
      await CashfreeSplit.findOneAndUpdate({ order_id: orderId }, {
        $set: {
          settlement_status: event.settlement_status || event.data?.settlement_status || "UPDATED",
          settlement_reference: event.settlement_id || event.data?.settlement_id || "",
          last_event: event,
        },
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Cashfree split webhook failed:", error.message);
    return res.status(500).json({ success: false });
  }
};

exports.getCashfreeSplits = async (req, res) => {
  if (req.user.role !== "Super Admin") return res.status(403).json({ success: false, message: "Only Super Admins can view split settlements." });
  const data = await CashfreeSplit.find().sort({ updatedAt: -1 }).limit(200).lean();
  return res.status(200).json({ success: true, data });
};
