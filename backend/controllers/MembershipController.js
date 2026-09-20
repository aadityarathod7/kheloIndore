const axios = require("axios");
const Membership = require("../models/MembershipModel");
const Venue = require("../models/Venue1");
const Coach = require("../models/CoachModel");
const Trainer = require("../models/PersonalTrainingModel");
const User = require("../models/UserModel");

const Notification = require("../models/NotificationModel");

const models = { venue: Venue, coach: Coach, trainer: Trainer };
const cashfreeBaseUrl = () => process.env.CASHFREE_BASE_URL || (process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg");
const cashfreeHeaders = () => ({ accept: "application/json", "Content-Type": "application/json", "x-api-version": process.env.CASHFREE_API_VERSION || "2023-08-01", "x-client-id": process.env.CASHFREE_APP_ID, "x-client-secret": process.env.CASHFREE_SECRET_KEY });
const providerName = (type, provider) => type === "venue" ? provider.name : `${provider.first_name || ""} ${provider.last_name || ""}`.trim();

const getBaseUrl = () => {
  let baseUrl = process.env.WEBSITE_URL;
  if (!baseUrl && process.env.REDIRECT_URL) {
    try {
      const urlStr = process.env.REDIRECT_URL.startsWith("http")
        ? process.env.REDIRECT_URL
        : `https://${process.env.REDIRECT_URL}`;
      baseUrl = new URL(urlStr).origin;
    } catch (e) {
      baseUrl = "https://kheloindore.in";
    }
  }
  if (!baseUrl) baseUrl = "https://kheloindore.in";
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`;
  }
  return baseUrl.replace(/\/$/, "");
};

exports.startMembershipCheckout = async (req, res) => {
  try {
    const { provider_type, provider_id, plan_index } = req.body;
    const Model = models[provider_type];
    if (!Model || !provider_id || !Number.isInteger(Number(plan_index))) return res.status(400).json({ success: false, message: "Choose a valid membership plan." });
    const provider = await Model.findById(provider_id).lean();
    const plan = provider?.membership_plans?.[Number(plan_index)];
    if (!plan || !plan.name || !Number(plan.months) || Number(plan.price) <= 0) return res.status(400).json({ success: false, message: "This membership plan is unavailable." });
    const user = await User.findById(req.user.userID).lean();
    if (!user) return res.status(401).json({ success: false, message: "Please sign in again." });

    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setMonth(end.getMonth() + Number(plan.months)); end.setDate(end.getDate() - 1); end.setHours(23, 59, 59, 999);
    const orderId = `KI_MEM_${Date.now()}_${String(req.user.userID).slice(-5)}`;
    const membership = await Membership.create({ user_id: req.user.userID, provider_type, provider_id, provider_name: providerName(provider_type, provider), plan: plan.toObject ? plan.toObject() : plan, start_date: start, end_date: end, payment: { order_id: orderId, amount: Number(plan.price) } });

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) return res.status(503).json({ success: false, message: "Payments are not configured.", membership_id: membership._id });
    const website = process.env.REDIRECT_API_URL || process.env.WEBSITE_URL || "http://localhost:3037";
    const returnUrl = `${website.replace(/\/$/, "")}/api/membership/payment/status/${orderId}`;
    const response = await axios.post(`${cashfreeBaseUrl()}/orders`, { order_id: orderId, order_amount: Number(plan.price), order_currency: "INR", customer_details: { customer_id: `ki_${user._id}`, customer_name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Khelo Indore User", customer_email: user.email || "customer@kheloindore.in", customer_phone: String(user.mobile || "9999999999").replace(/\D/g, "").slice(-10) }, order_meta: { return_url: returnUrl }, order_note: `${plan.name} membership` }, { headers: cashfreeHeaders(), timeout: 30000 });
    membership.payment.cashfree_order_id = response.data.cf_order_id;
    await membership.save();
    return res.status(201).json({ success: true, membership_id: membership._id, order_id: orderId, payment_session_id: response.data.payment_session_id });
  } catch (error) { return res.status(error.response?.status || 500).json({ success: false, message: error.response?.data?.message || error.message || "Could not start membership checkout." }); }
};

exports.verifyMembershipPayment = async (req, res) => {
  try {
    const membership = await Membership.findOne({ "payment.order_id": req.params.orderId });
    if (!membership) return res.status(404).json({ success: false, message: "Membership payment was not found." });
    const payment = await axios.get(`${cashfreeBaseUrl()}/orders/${encodeURIComponent(membership.payment.order_id)}`, { headers: cashfreeHeaders(), timeout: 30000 });
    const paid = payment.data?.order_status === "PAID";
    membership.payment.status = payment.data?.order_status || "FAILED";
    membership.status = paid ? "ACTIVE" : "FAILED";
    if (paid) membership.payment.paid_at = new Date();
    await membership.save();

    const baseUrl = getBaseUrl();

    if (paid) {
      try {
        const superAdmins = await User.find({ role: "Super Admin", status: true }).select("_id").lean();
        const recipientIds = new Set(superAdmins.map((admin) => String(admin._id)));
        const provider = await models[membership.provider_type]?.findById(membership.provider_id).lean();
        if (provider?.user_id) recipientIds.add(String(provider.user_id));

        if (recipientIds.size) {
          await Notification.insertMany([...recipientIds].map((user_id) => ({
            user_id,
            title: `New Membership Purchased`,
            message: `${membership.plan?.name || "Recurring"} membership purchased for ${membership.provider_name || "Provider"} (₹${membership.payment.amount}).`,
            type: "booking",
            entity_id: membership._id,
          })));
        }
      } catch (notifErr) {
        console.error("Membership notification creation error:", notifErr.message);
      }

      const query = new URLSearchParams();
      query.set("status", "success");
      query.set("service", "membership");
      query.set("bookingId", membership.payment.order_id);
      query.set("txnId", membership.payment.cashfree_order_id || membership.payment.order_id);
      query.set("amount", String(membership.payment.amount));
      query.set("name", `${membership.provider_name || "Sports Venue"} (${membership.plan?.name || "Membership"})`);
      const startStr = membership.start_date ? new Date(membership.start_date).toLocaleDateString("en-IN") : "";
      const endStr = membership.end_date ? new Date(membership.end_date).toLocaleDateString("en-IN") : "";
      query.set("date", `${startStr} to ${endStr}`);
      query.set("slots", `${membership.plan?.months || 1} Month${(membership.plan?.months || 1) > 1 ? "s" : ""} Access`);

      return res.redirect(`${baseUrl}/payment-success?${query.toString()}`);
    } else {
      return res.redirect(`${baseUrl}/user/user-bookings?booking=failed`);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to verify membership payment." });
  }
};

exports.getMyMemberships = async (req, res) => {
  await Membership.updateMany({ user_id: req.user.userID, status: "ACTIVE", end_date: { $lt: new Date() } }, { $set: { status: "EXPIRED" } });
  const data = await Membership.find({ user_id: req.user.userID }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
};
