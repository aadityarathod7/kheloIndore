const crypto = require("crypto");
const axios = require("axios");
const UserDetailsAtPayments = require("../models/userDetailsAtPayment");
const Transaction = require("../models/TransactionModel");
const Slot = require("../models/SlotModel");
const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const PersonalTrainerSlot = require("../models/PersonalTrainerSlotModel");
const CoachSlot = require("../models/CoachSlotsModel");
const User = require("../models/UserModel");
const PersonalTrainerBookingModel = require("../models/PersonalTrainerBookingModel");
const mail = require("../helper/sendMail");
const mailContent = require("../middlewares/mail-content");
const venuePdfContent = require("../middlewares/venue_pdf_invoice");
const coachPdfContent = require("../middlewares/coach_pdf_invoice");
const ptPdfContent = require("../middlewares/pt_pdf_invoice");
var pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Venue1 = require("../models/Venue1");
const CoachModel = require("../models/CoachModel");
const ptModel = require("../models/PersonalTrainingModel")
// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { ObjectId } = require("mongoose").Types;
const personalTrainer = require("../models/PersonalTrainingModel")
const Refund = require("../models/RefundModel");

const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";
const getCashfreeBaseUrl = () => process.env.CASHFREE_BASE_URL || (process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg");

const getCashfreeHeaders = () => ({
  accept: "application/json",
  "Content-Type": "application/json",
  "x-api-version": CASHFREE_API_VERSION,
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
});

const getCashfreeCustomerDetails = async (userId) => {
  const user = await User.findById(userId).lean();
  const phone = String(user?.mobile || user?.phone || "9999999999").replace(/\D/g, "").slice(-10) || "9999999999";
  return {
    customer_id: `ki_${String(userId)}`,
    customer_name: [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Khelo Indore User",
    customer_email: user?.email || undefined,
    customer_phone: phone,
  };
};

const createCashfreeOrder = async ({ orderId, amount, userId, service }) => {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error("Cashfree credentials are not configured on the server");
  }
  const baseRedirectUrl = process.env.REDIRECT_API_URL;
  if (!baseRedirectUrl) throw new Error("REDIRECT_API_URL is required for Cashfree payment returns");

  const response = await axios.post(`${getCashfreeBaseUrl()}/orders`, {
    order_id: orderId,
    order_amount: Number(amount),
    order_currency: "INR",
    customer_details: await getCashfreeCustomerDetails(userId),
    order_meta: {
      return_url: `${baseRedirectUrl}/api/get/${service}/payment/status/${orderId}`,
    },
    order_note: `Khelo Indore ${service} booking`,
  }, {
    headers: getCashfreeHeaders(),
    timeout: 30000,
  });
  return response.data;
};

const getCashfreePaymentStatus = async (orderId) => {
  const response = await axios.get(`${getCashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}`, {
    headers: getCashfreeHeaders(),
    timeout: 30000,
  });
  const order = response.data;
  const paid = order?.order_status === "PAID";
  return {
    data: {
      success: paid,
      data: {
        merchantTransactionId: orderId,
        transactionId: order?.cf_order_id || orderId,
        amount: Math.round(Number(order?.order_amount || 0) * 100),
        state: paid ? "COMPLETED" : (order?.order_status || "FAILED"),
        responseCode: paid ? "PAYMENT_SUCCESS" : "PAYMENT_PENDING",
      },
    },
  };
};

const createCashfreeRefund = async ({ orderId, amount, reason }) => {
  const refundId = `KIREF${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const response = await axios.post(`${getCashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}/refunds`, {
    refund_amount: Number(amount),
    refund_id: refundId,
    refund_note: String(reason || "Booking cancellation refund").slice(0, 100),
    refund_speed: "STANDARD",
  }, { headers: getCashfreeHeaders(), timeout: 30000 });
  return Array.isArray(response.data) ? response.data[0] : response.data;
};
const getDateRange = (date) => {
  let startOfTargetDay, endOfTargetDay;
  if (typeof date === "string" && date.includes("-") && date.split("-").length === 3) {
    const parts = date.split("T")[0].split("-");
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1;
    const d = parseInt(parts[2]);
    startOfTargetDay = new Date(y, m, d, 0, 0, 0, 0);
    endOfTargetDay = new Date(y, m, d, 23, 59, 59, 999);
  } else {
    const dateObj = new Date(date);
    if (isNaN(dateObj)) {
      return null;
    }
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const d = dateObj.getDate();
    startOfTargetDay = new Date(y, m, d, 0, 0, 0, 0);
    endOfTargetDay = new Date(y, m, d, 23, 59, 59, 999);
  }
  return { start: startOfTargetDay, end: endOfTargetDay };
};

const getPuppeteerLaunchOptions = () => {
  const options = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: "new",
  };
  if (fs.existsSync('/usr/bin/chromium-browser')) {
    options.executablePath = '/usr/bin/chromium-browser';
  }
  return options;
};

const venuePayment = async (req, res) => {
  try {
    const { user_id, venue_id, date, slotsBooked, total_price, payment_type } = req.body;
    const paymentType = payment_type === "partial" ? "partial" : "full";
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    // Validate required fields
    if (!user_id || !isValidObjectId(user_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user_id" });
    }
    if (!venue_id || !isValidObjectId(venue_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing venue_id" });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }
    if (!slotsBooked || !Array.isArray(slotsBooked) || slotsBooked.length === 0) {
      return res.status(400).json({ success: false, message: "Booking slots are empty or invalid" });
    }
    const normalizedSlotsBooked = slotsBooked
      .map((slot) => {
        if (typeof slot === "string") return slot;
        return slot?.slot_id || slot?._id || slot?.id || "";
      })
      .filter(Boolean)
      .map(String);

    if (normalizedSlotsBooked.length === 0) {
      return res.status(400).json({ success: false, message: "Booking slots are empty or invalid" });
    }

    // Slot ids are authoritative. Looking up the date supplied by the browser
    // first can miss a valid MongoDB date after a timezone conversion.
    const slots1 = await Slot.find({
      venue_id: venue_id,
      "slots._id": { $in: normalizedSlotsBooked },
    });
    if (!slots1 || slots1.length === 0) {
      return res.status(400).json({ success: false, message: "No selected slots were found for this venue" });
    }

    // Fetch venue details
    const venueDetails = await Venue1.findById(venue_id);
    if (!venueDetails) {
      return res.status(400).json({ success: false, message: "Venue not found" });
    }
    const vendor_id = venueDetails.vendor_id;

    // Calculate total booked price and check slot availability
    let totalBookedPrice = 0;
    let matchedSlotCount = 0;
    const matchingDates = new Set();
    for (const slotDocument of slots1) {
      matchingDates.add(new Date(slotDocument.date).toISOString().slice(0, 10));
      for (const slot of slotDocument.slots) {
        const slotID = slot._id.toString();
        if (!normalizedSlotsBooked.includes(slotID)) continue;
        if (slot.isBooked) {
          return res.status(400).json({
            success: false,
            message: `Slot ${slot.startTime} to ${slot.endTime} is already booked. Please select another slot.`,
          });
        }
        matchedSlotCount += 1;
        totalBookedPrice += Number(slot.price || 0);
      }
    }

    if (matchedSlotCount !== normalizedSlotsBooked.length || matchingDates.size !== 1) {
      return res.status(400).json({
        success: false,
        message: "Please select available slots from one booking date.",
      });
    }
    const bookingDate = slots1[0].date;

    // Log calculated total price
    

    if (!Number.isFinite(totalBookedPrice) || totalBookedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "The selected slots could not be priced. Please return to the venue page and select available slots again.",
      });
    }

    // Payment integration
  
    const merchantTransactionId = `${user_id}-${Date.now()}`;

    
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;
    // Partial payment = 50% advance; full payment = 100%
    const payableAmount =
      paymentType === "partial"
        ? Math.round(totalBookedPrice * PARTIAL_PAYMENT_PERCENT)
        : totalBookedPrice;
    const cashfreeOrder = await createCashfreeOrder({
      orderId: merchantTransactionId,
      amount: payableAmount,
      userId: user_id,
      service: "venue",
    });

    // Update user booking details
    await UserDetailsAtPayments.deleteOne({ user_id: user_id });
    await UserDetailsAtPayments.create({
      user_id,
      venue_id,
      date: bookingDate,
      slotsBooked: normalizedSlotsBooked,
      vendor_id,
      total_price: totalBookedPrice,
      payment_type: paymentType,
      payable_amount: payableAmount,
      payment_order_id: merchantTransactionId,
      payment_provider: "cashfree",
    });

    // Send success response
    return res.status(200).json({
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      orderId: cashfreeOrder.order_id,
      expirationTime: expirationTime,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Unable to initialize payment. Please try again."
    });
  }
};

const actualvenuePaymentStatus = async (req, res) => {
  const merchantTransactionId = req.params["txnId"];
  
  const string =
    `/pg/v1/status/${process.env.MERCHANT_ID}/${merchantTransactionId}` +
    `${process.env.SALT_KEY}`;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + process.env.KEY_INDEX;
  const options = {
    method: "GET",
    url: `${process.env.REDIRECT_STATUS_URL}/${process.env.MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${process.env.MERCHANT_ID}`,
    },
  };
  // CHECK PAYMENT STATUS
  const result = await axios(options);
  if (!result.data || !result.data.data) {
    throw new Error("Invalid payment response");
  }
  
  let { merchantTransactionId: txnId, transactionId, amount, state, responseCode } = result.data.data;
  
  const user = await UserDetailsAtPayments.find({ user_id: txnId }).sort({ createdAt: -1 });

  if (!user || user.length === 0) {
    throw new Error("User not found for the transaction");
  }
  let { user_id, date, venue_id, slotsBooked } = user[0];
  const venueData = await Venue1.findById(venue_id);
  if (!venueData) {
    throw new Error("Venue not found");
  }
  const venueName = venueData.name;
  const venueLocation = venueData.address;
  const vendorid = venueData.vendor_id;
  const vendor_id = vendorid || user[0].vendor_id;
  
  let dateObj = new Date(date);
  const emaildata = (await User.findById(vendorid)) || (await User.findOne({ role: "Super Admin" })) || (await User.findOne({})) || { email: "superadmin@yopmail.com" };
  const venueadminemail = emaildata.email
  
  const userData = await User.findById(user_id);
  if (!userData) {
    throw new Error("User data not found");
  }
  const { email, first_name, last_name, mobile } = userData;
  const date1 = new Date();
  const newDate = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date1.toLocaleDateString("en-US", newDate);
  const formattedSlotsBooked = slotsBooked.map(id => {
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    } else {
        
        return null;
    }
}).filter(id => id !== null);
 // Ensure it's correctly formatted
  
  // Fetch the document and slot details
  const slotsDetails = await Slot.aggregate([
    {
      $match: {
        "slots._id": { $in: formattedSlotsBooked } // Check that slots._id is being filtered
      }
    },
    {
      $project: {
        venue_id: 1,
        date: 1,
        slots: {
          $filter: {
            input: "$slots",
            as: "slot",
            cond: { $in: ["$$slot._id", formattedSlotsBooked] } // Ensure you're filtering based on the right condition
          }
        }
      }
    }
  ]);
  
  
  // Check if you have the details
  if (slotsDetails.length > 0 && slotsDetails[0].slots.length > 0) {
    const slot = slotsDetails[0].slots[0];
    
} else {
    
}



  
  const allSlotDetails = slotsDetails.flatMap(document => 
    document.slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime
    }))
  );

  const pdfData = {
    entityType: "Venue",  // Dynamically set based on entity type (this could be "Venue" or "Personal Trainer")
    entityName: `${first_name} ${last_name}`,
    email: email,
    first_name: first_name,
    last_name: last_name,
    mobile: mobile,
    total_price: amount,
    bookDate: formattedDate,
    transactionId: transactionId,
    merchantTransaction_id: txnId,
    slotsBooked: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
    status: state,
    venueName: venueName,
  };
  if (result.data.success == true) {
    if (result.data.code == "PAYMENT_SUCCESS") {
      const transaction = await Transaction.create({
        user_id,
        venue_id,
        date,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        amount: amount,
        paymentStatus: responseCode,
        slotsBooked,
        paymentState: state,
      });
      // var html = venuePdfContent.venue_pdf_invoice(pdfData);
      const html = mailContent.generateUnifiedPdfInvoice(pdfData);
      var option = { format: "A3" };
      var filename = `${uuidv4()}.pdf`;
      var invoicePath = path.join(__dirname, `../public/pdf/${filename}`);
            const pdfDir = path.join(__dirname, '../public/pdf');

      // Create the directory if it doesn't exist
      if (!fs.existsSync(pdfDir)){
          fs.mkdirSync(pdfDir, { recursive: true });
      }

      var invoicePath = path.join(pdfDir, filename);
            var pdfUrl = `/pdf/${filename}`;

            const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.pdf({
          path: invoicePath,
          formate: "A3",
          printBackground: true,
        });
        await browser.close();
        const attachmentInvoices = [
          {
            filename: filename,
            path: invoicePath,
          },
        ];

        // mail.sendEmail(
        //   email,
        //   mailContent.user_booked_mail(
        //     first_name,
        //     "This is for Venue Booking",
        //     "Your turf has been booked!"
        //   ),
        //   attachmentInvoices
        // );

      const newBooking = await Booking.create({
        user_id,
        venue_id,
        date,
        slotsBooked,
        total_price: amount,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        paymentStatus: responseCode,
        paymentState: state,
        vendor_id,
        pdf_url: pdfUrl,
      });

      const updatedSlots = await Slot.updateMany(
        {
          venue_id: venue_id,
          "slots._id": { $in: slotsBooked },
        },
        {
          $set: { "slots.$[slot].isBooked": true },
        },
        {
          arrayFilters: [{ "slot._id": { $in: slotsBooked } }],
        }
      );

      const data = await UserDetailsAtPayments.deleteOne({
        user_id: merchantTransaction_id,
      });
    
    
      const emailData = {
        entityType:"Venue",
        adminName: "Admin",
        user: `${first_name} ${last_name}`,
        venue_Name:venueName,
        venue_Location:venueLocation,
        slotDate: date,
        slotTime: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
        totalPrice: amount,
        recipientEmail: email,
      };
      
      
      
      // Destructure emailData before passing to sendBookingRequestEmail
      const {entityType, adminName, user, venue_Name, venue_Location, slotDate, slotTime, totalPrice, recipientEmail } = emailData;
      
      // Now pass the destructured values to sendBookingRequestEmail
      const mailcontent = mailContent.sendBookingRequestEmail(
        entityType,
        adminName, 
        user, 
        venue_Name, 
        venue_Location, 
        slotDate, 
        slotTime, 
        totalPrice, 
        recipientEmail
      );
      const mailcontentuser = mailContent.sendBookingEmailToApprovalToAdmin(
        adminName,       // Admin name
        user,            // User name
        "Venue",         // Entity type ("Venue", "Coach", or "Personal Trainer")
        venue_Name,      // Entity name (Venue Name)
        venue_Location,  // Entity location (Venue Location)
        slotDate,        // Slot date
        slotTime,        // Slot time
        totalPrice,      // Total price
        recipientEmail   // Recipient email
      );
      
      
      // Send the email with the necessary parameters
      await mail.sendBookingRequestEmail({     
        mailcontentuser,
        recipientEmail, 
        venueName,
        attachmentInvoices    
      });
      await mail.sendBookingEmailToApprovalToVenueAdmin({     
        mailcontent,
        venueadminemail, 
        venueName,    
      });
      await mail.sendBookingEmailToApprovalToSuperAdmin({     
        mailcontent, 
        subject: `Booking Approval Required for ${venueName}`
      });
      
      res.redirect(process.env.REDIRECT_URL);
    } else {
      const transaction = await Transaction.create({
        user_id,
        venue_id,
        date,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        amount: amount,
        paymentStatus: responseCode,
        slotsBooked,
        paymentState: state,
      });
      var html = venuePdfContent.venue_pdf_invoice(pdfData);
      var option = { format: "A3" };
      var filename = `${uuidv4()}.pdf`;
      var invoicePath = path.join(__dirname, `../public/pdf/${filename}`);
      var pdfUrl = `/pdf/${filename}`;
      const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({
        path: invoicePath,
        formate: "A3",
        printBackground: true,
      });
      await browser.close();
      const attachmentInvoices = [
        {
          filename: filename,
          path: invoicePath,
        },
      ];

    //  await mail.sendEmail(
    //     email,
    //     mailContent.user_booked_mail(
    //       first_name,
    //       "This is for Venue Booking",
    //       "Your turf has been booked!"
    //     ),
    //     attachmentInvoices
    //   );

      const newBooking = await Booking.create({
        user_id,
        venue_id,
        date,
        slotsBooked,
        total_price: amount,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        paymentStatus: responseCode,
        paymentState: state,
        vendor_id,
        pdf_url: pdfUrl,
      });

      const updatedSlots = await Slot.updateMany(
        {
          venue_id: venue_id,
          "slots._id": { $in: slotsBooked },
        },
        {
          $set: { "slots.$[slot].isBooked": true },
        },
        {
          arrayFilters: [{ "slot._id": { $in: slotsBooked } }],
        }
      );
      const data = await UserDetailsAtPayments.deleteOne({
        user_id: merchantTransaction_id,
      });
      res.redirect(process.env.REDIRECT_URL);
    }
  } else {
    const newBooking = await Booking.create({
      user_id,
      venue_id,
      date,
      slotsBooked,
      total_price: amount,
      transaction_id: transactionId,
      merchantTransaction_id: txnId,
      paymentStatus: responseCode,
      paymentState: state,
      vendor_id,
    });
    const data = await UserDetailsAtPayments.deleteOne({
      user_id: merchantTransaction_id,
    });
    res.redirect(process.env.FAIL_URl); // failed
  }
};

const workingvenuePaymentStatus = async (req, res) => {
  const { txnId } = req.params;
  

  try {
    const string =
      `/pg/v1/status/${process.env.MERCHANT_ID}/${txnId}${process.env.SALT_KEY}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + process.env.KEY_INDEX;

    const options = {
      method: "GET",
      url: `${process.env.REDIRECT_STATUS_URL}/${process.env.MERCHANT_ID}/${txnId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.MERCHANT_ID,
      },
    };

    const result = await axios(options);
    if (!result.data || !result.data.data) {
      return res.status(400).json({ error: "Invalid payment response" });
    }

    const { transactionId, amount, state, responseCode, merchantTransactionId } = result.data.data;
    
    
    const userId = merchantTransactionId.split('-')[0];
    
    // Fetch user
    const user = await UserDetailsAtPayments.findOne({ user_id: userId  }).sort({ createdAt: -1 });
    if (!user) return res.status(404).json({ error: "User not found for the transaction" });

    const { user_id, date, venue_id, slotsBooked, vendor_id } = user;
    const venueData = await Venue1.findById(venue_id);
    if (!venueData) return res.status(404).json({ error: "Venue not found" });

    const venueName = venueData.name;
    const venueLocation = venueData.address;
    const vendorid = venueData.vendor_id;

    const emaildata = (await User.findById(vendorid)) || (await User.findOne({ role: "Super Admin" })) || (await User.findOne({})) || { email: "superadmin@yopmail.com" };
    const venueadminemail = emaildata.email;
    const userData = await User.findById(user_id);
    if (!userData) return res.status(404).json({ error: "User data not found" });

    const { email, first_name, last_name, mobile } = userData;
    const formattedDate = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

    const formattedSlotsBooked = slotsBooked.map(id => ObjectId.isValid(id) ? new ObjectId(id) : null).filter(Boolean);

    // Fetch slot details
    const slotsDetails = await Slot.aggregate([
      { $match: { "slots._id": { $in: formattedSlotsBooked } } },
      { $project: { venue_id: 1, date: 1, slots: { $filter: { input: "$slots", as: "slot", cond: { $in: ["$$slot._id", formattedSlotsBooked] } } } } },
    ]);

    const allSlotDetails = slotsDetails.flatMap(document =>
      document.slots.map(slot => ({ startTime: slot.startTime, endTime: slot.endTime }))
    );

    const pdfData = {
      entityType: "Venue",
      entityName: `${first_name} ${last_name}`,
      email,
      first_name,
      last_name,
      mobile,
      total_price: amount / 100,
      bookDate: formattedDate,
      transactionId,
      merchantTransaction_id: txnId,
      slotsBooked: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
      status: state,
      venueName,
    };

    const newTransaction = await Transaction.create({
      user_id,
      venue_id,
      date,
      transaction_id: transactionId,
      merchantTransaction_id: txnId,
      amount:amount / 100,
      paymentStatus: responseCode,
      slotsBooked,
      paymentState: state,
    });

    const html = mailContent.generateUnifiedPdfInvoice(pdfData);
    const filename = `${uuidv4()}.pdf`;
    const pdfDir = path.join(__dirname, '../public/pdf');
    const invoicePath = path.join(pdfDir, filename);
    const pdfUrl = `/pdf/${filename}`;

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: invoicePath, format: "A3", printBackground: true });
    await browser.close();

    const newBooking = await Booking.create({
      user_id,
      venue_id,
      date,
      slotsBooked,
      total_price: amount / 100,
      transaction_id: transactionId,
      merchantTransaction_id: txnId,
      paymentStatus: responseCode,
      paymentState: state,
      vendor_id,
      pdf_url: pdfUrl,
    });

    // Update Slots
    await Slot.updateMany(
      { venue_id, "slots._id": { $in: slotsBooked } },
      { $set: { "slots.$[slot].isBooked": true } },
      { arrayFilters: [{ "slot._id": { $in: slotsBooked } }] }
    );

    // Delete UserDetailsAtPayment
    await UserDetailsAtPayments.deleteOne({ user_id: userId });

    const emailData = {
      entityType: "Venue",
      adminName: "Admin",
      user: `${first_name} ${last_name}`,
      venue_Name: venueName,
      venue_Location: venueLocation,
      slotDate: date,
      slotTime: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
      totalPrice: amount / 100,
      recipientEmail: email,
    };

    const mailcontent = mailContent.sendBookingRequestEmail(
      emailData.entityType,
      emailData.adminName,
      emailData.user,
      emailData.venue_Name,
      emailData.venue_Location,
      emailData.slotDate,
      emailData.slotTime,
      emailData.totalPrice,
      emailData.recipientEmail
    );

    const mailcontentuser = mailContent.sendBookingEmailToApprovalToAdmin(
      emailData.adminName,
      emailData.user,
      "Venue",
      emailData.venue_Name,
      emailData.venue_Location,
      emailData.slotDate,
      emailData.slotTime,
      emailData.totalPrice,
      emailData.recipientEmail
    );

    // Send emails
    await mail.sendBookingRequestEmail({
      mailcontentuser,
      recipientEmail: email,
      venueName,
      attachmentInvoices: [{ filename, path: invoicePath }],
    });

    await mail.sendBookingEmailToApprovalToVenueAdmin({
      mailcontent,
      venueadminemail,
      venueName,
    });

    await mail.sendBookingEmailToApprovalToSuperAdmin({
      mailcontent,
      subject: `Booking Approval Required for ${venueName}`,
    });
    res.redirect(process.env.REDIRECT_URL);
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};

const venuePaymentStatus = async (req, res) => {
  const { txnId } = req.params;
  

  try {
    const result = await getCashfreePaymentStatus(txnId);

    if (!result.data || !result.data.data) {
      return res.status(400).json({ error: "Invalid payment response" });
    }

    const { transactionId, amount, state, responseCode, merchantTransactionId } = result.data.data;
    
    

    const userId = merchantTransactionId.split('-')[0];

    const user = await UserDetailsAtPayments.findOne({ payment_order_id: txnId }).sort({ createdAt: -1 }) || await UserDetailsAtPayments.findOne({ user_id: userId }).sort({ createdAt: -1 });
    if (!user) return res.status(404).json({ error: "User not found for the transaction" });

    const { user_id, date, venue_id, slotsBooked, vendor_id, payment_type } = user;
    const venueData = await Venue1.findById(venue_id);
    if (!venueData) return res.status(404).json({ error: "Venue not found" });

    const venueName = venueData.name;
    const venueLocation = venueData.address;
    const vendorid = venueData.vendor_id;

    const emaildata = (await User.findById(vendorid)) || (await User.findOne({ role: "Super Admin" })) || (await User.findOne({})) || { email: "superadmin@yopmail.com" };
    const venueadminemail = emaildata.email;
    const userData = await User.findById(user_id);
    if (!userData) return res.status(404).json({ error: "User data not found" });

    const { email, first_name, last_name, mobile } = userData;
    const formattedDate = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

    const formattedSlotsBooked = slotsBooked.map(id => ObjectId.isValid(id) ? new ObjectId(id) : null).filter(Boolean);

    const slotsDetails = await Slot.aggregate([
      { $match: { "slots._id": { $in: formattedSlotsBooked } } },
      { $project: { venue_id: 1, date: 1, slots: { $filter: { input: "$slots", as: "slot", cond: { $in: ["$$slot._id", formattedSlotsBooked] } } } } },
    ]);

    const allSlotDetails = slotsDetails.flatMap(document =>
      document.slots.map(slot => ({ startTime: slot.startTime, endTime: slot.endTime }))
    );

    const pdfData = {
      entityType: "Venue",
      entityName: venueName,
      email,
      first_name,
      last_name,
      mobile,
      total_price: amount / 100,
      bookDate: formattedDate,
      transactionId,
      merchantTransaction_id: txnId,
      slotsBooked: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
      status: state,
      venueName,
      date:new Date(date).toLocaleDateString(),
    };

    const html = mailContent.generateUnifiedPdfInvoice(pdfData);
    const filename = `${uuidv4()}.pdf`;
    const pdfDir = path.join(__dirname, '../public/pdf');
    const invoicePath = path.join(pdfDir, filename);
    const pdfUrl = `/pdf/${filename}`;

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    let hasPdf = false;
    try {
      const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({ path: invoicePath, format: "A3", printBackground: true });
      await browser.close();
      hasPdf = true;
    } catch (pdfError) {
      console.error("PDF Generation failed in venuePaymentStatus:", pdfError);
    }

 
    // Payment Success Logic
    if (result.data.success == true) {

      if (result.data.code == "PAYMENT_SUCCESS") {
        const existing = await Booking.findOne({ merchantTransaction_id: txnId })
        if (existing) {
          return res.redirect(process.env.REDIRECT_URL);
        }

      const newTransaction = await Transaction.create({
        user_id,
        venue_id,
        date,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        amount: amount / 100,
        paymentStatus: responseCode,
        slotsBooked,
        paymentState: state,
      });

      // Update Slots
      await Slot.updateMany(
        { venue_id, "slots._id": { $in: slotsBooked } },
        { $set: { "slots.$[slot].isBooked": true } },
        { arrayFilters: [{ "slot._id": { $in: slotsBooked } }] }
      );
      const newBooking = await Booking.create({
        user_id,
        venue_id,
        date,
        slotsBooked,
        total_price: amount / 100,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        paymentStatus: responseCode,
        paymentState: state,
        vendor_id,
        pdf_url: pdfUrl,
        slot_time:allSlotDetails,
        payment_type: payment_type || "full",
        payable_amount: payment_type === "partial" ? amount/100 : null,
      });
      // Delete UserDetailsAtPayment
      await UserDetailsAtPayments.deleteOne({ user_id: userId });

      // Send success email
      const emailData = {
        entityType: "Venue",
        adminName: "Admin",
        user: `${first_name} ${last_name}`,
        venue_Name: venueName,
        venue_Location: venueLocation,
        slotDate:new Date(date).toLocaleDateString(),
        slotTime: allSlotDetails.map(slot => `${slot.startTime} - ${slot.endTime}`).join(", "),
        totalPrice: amount / 100,
        recipientEmail: email,
      };

      const mailcontent = mailContent.sendBookingRequestEmail(
        emailData.entityType,
        emailData.adminName,
        emailData.user,
        emailData.venue_Name,
        emailData.venue_Location,
        emailData.slotDate,
        emailData.slotTime,
        emailData.totalPrice,
        emailData.recipientEmail
      );

      const mailcontentuser = mailContent.sendBookingEmailToApprovalToAdmin(
        emailData.adminName,
        emailData.user,
        "Venue",
        emailData.venue_Name,
        emailData.venue_Location,
        emailData.slotDate,
        emailData.slotTime,
        emailData.totalPrice,
        emailData.recipientEmail
      );

      // Send emails
      try {
        const attachmentInvoices = hasPdf ? [{ filename, path: invoicePath }] : [];
        await mail.sendBookingRequestEmail({
          mailcontentuser,
          recipientEmail: email,
          venueName,
          attachmentInvoices,
        });

        await mail.sendBookingEmailToApprovalToVenueAdmin({
          mailcontent,
          venueadminemail,
          venueName,
        });

        await mail.sendBookingEmailToApprovalToSuperAdmin({
          mailcontent,
          subject: `Booking Approval Required for ${venueName}`,
        });
      } catch (emailError) {
        console.error("Email sending failed in venuePaymentStatus:", emailError);
      }
      res.redirect(process.env.REDIRECT_URL);
  } 
  }else {
      await Transaction.create({
        user_id,
        venue_id,
        date,
        transaction_id: transactionId,
        merchantTransaction_id: txnId,
        amount: amount / 100,
        paymentStatus: responseCode,
        slotsBooked,
        paymentState: state,
      });

      // Send failure email or other actions
      const categorySlug = (venueData.vendor_type || "venue").replace(/\s+/g, "-").toLowerCase();
      const nameSlug = (venueData.name || "").replace(/\s+/g, "-").toLowerCase();
      const idStr = venueData._id.toString();
      const failedRedirectUrl = `${process.env.REDIRECT_URL}/sports-venue/${categorySlug}/${nameSlug}/${idStr}?payment=failed`;
      res.redirect(failedRedirectUrl);
    }
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};

const getVenueBookingByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const paymentState = req.query.paymentState || "COMPLETED";
    const bookings = await Booking.find({
      user_id: userId,
      paymentState: paymentState,
    }).populate("user_id venue_id");
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No bookings found" });
    }
    const bookingData = [];
    for (let booking of bookings) {
      const {
        venue_id,
        date,
        slotsBooked,
        total_price,
        transaction_id,
        paymentStatus,
        paymentState,
      } = booking;
      const slots = await Slot.find({ venue_id: venue_id, "slots._id": { $in: slotsBooked } });
      if (slots.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No slots found for this venue",
          data: [],
        });
      }

      const slotsArray = slots[0].slots;
      const slotPopulatedData = slotsArray.filter((slot) =>
        slotsBooked.includes(slot._id.toString())
      );

      bookingData.push({
        date,
        venue_id,
        slots: slotPopulatedData,
        total_price,
        transaction_id,
        paymentStatus,
        paymentState,
      });
    }

    res.status(200).json({ success: true, data: bookingData });
  } catch (error) {
    e.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Payment types: partial = 25% advance (non-refundable), full = 100% (cancellation refund rules apply)
const PARTIAL_PAYMENT_PERCENT = 0.25;

// Refund policy:
//  - Partial payment: non-refundable
//  - Full payment cancelled at least 4 hours before booking time: 25% deducted, 75% refunded
//  - Full payment cancelled less than 4 hours before: non-refundable
const REFUND_WINDOW_HOURS = 4;
const FULL_PAYMENT_REFUND_PERCENT = 0.75;

const getBookingStartTime = (booking) => {
  const bookingDate = booking?.startDate || booking?.date;
  if (!bookingDate) return null;

  const rawTime = booking?.slot_time?.[0]?.startTime || booking?.start_time;
  const startTime = new Date(bookingDate);
  if (Number.isNaN(startTime.getTime()) || !rawTime) return null;

  const timeMatch = String(rawTime).trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!timeMatch) return null;

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();
  if (minutes > 59 || hours > 23 || (meridiem && hours > 12)) return null;
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  startTime.setHours(hours, minutes, 0, 0);
  return startTime;
};

// Computes how much (if any) is refundable for a cancelled booking.
const computeRefundAmount = (booking) => {
  if (!booking) return 0;
  if (String(booking.payment_type || "full").toLowerCase() === "partial") return 0;

  const paidAmount = Number(booking.payable_amount || booking.total_price || 0);
  const startTime = getBookingStartTime(booking);
  if (!startTime || paidAmount <= 0) return 0;

  const hoursUntilBooking = (startTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilBooking >= REFUND_WINDOW_HOURS) {
    return Math.round(paidAmount * FULL_PAYMENT_REFUND_PERCENT); // 25% deduction
  }
  return 0; // cancelled too late - no refund
};

// Processes a Cashfree refund for a cancelled booking.
const processBookingRefund = async ({ booking, reason }) => {
  const refundAmount = computeRefundAmount(booking);
  if (refundAmount <= 0) {
    return { success: false, refundAmount: 0, message: "No refund applicable (partial payment or cancellation too late)" };
  }
  const txnId = booking.merchantTransaction_id;
  if (!txnId) {
    return { success: false, refundAmount: 0, message: "No transaction id - cannot refund" };
  }

  const cashfreeRefund = await createCashfreeRefund({
    orderId: txnId,
    amount: refundAmount,
    reason,
  });
  const refundTransactionId = cashfreeRefund.refund_id;
  const refundStatus = cashfreeRefund.refund_status || "PENDING";
  const providerReferenceId = cashfreeRefund.cf_refund_id || refundTransactionId;
  const userId = booking.user_id || booking.userId;
  const entityName =
    (booking.venue_id && booking.venue_id.name) ||
    (booking.coachId && `${booking.coachId.first_name || ""} ${booking.coachId.last_name || ""}`.trim()) ||
    (booking.pt_id && `${booking.pt_id.first_name || ""} ${booking.pt_id.last_name || ""}`.trim()) ||
    "N/A";

  const newRefund = new Refund({
    transaction_id: booking.transaction_id,
    user_id: userId ? userId._id || userId : null,
    merchantTransaction_id: txnId,
    booking_id: booking._id,
    user_name: userId ? `${userId.first_name || ""} ${userId.last_name || ""}`.trim() : "Unknown User",
    associated_entity_name: entityName,
    slotsBook: booking.slotsBook || booking.slotsBooked,
    refund_id: refundTransactionId,
    refundAmount,
    refundStatus,
    refundReason: reason || "Booking cancellation refund",
    providerReferenceId,
  });
  await newRefund.save();

  return { success: true, refundAmount, refundId: refundTransactionId, refundStatus };
};

const coachPayment = async (req, res) => {
  try {
    const { user_id, coachId, start_date, end_date, start_time, end_time, payment_type } = req.body;

    // Validate the request body
    if (!user_id || !coachId || !start_date || !end_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing (user_id, coachId, start_date, end_date, start_time, end_time)",
      });
    }
    const paymentType = payment_type === "partial" ? "partial" : "full";

    // Convert start_date and end_date to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ensure start_date is before end_date
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    const startTimes = Array.isArray(start_time) ? start_time : String(start_time).split(",").map(s => s.trim());
    const endTimes = Array.isArray(end_time) ? end_time : String(end_time).split(",").map(s => s.trim());

    let totalBookedPrice = 0;
    const slotsBookedDetails = [];

    // Loop through each day in the date range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const coachSlot = await CoachSlot.findOne({
        coachId: coachId,
        start_date: currentDate,
      });

      if (!coachSlot) {
        return res.status(404).json({
          success: false,
          message: `Slots not found for ${currentDate.toISOString().split("T")[0]}`,
        });
      }

      // Check availability of the requested time slots for the current date
      let dailyPrice = 0;
      const availableSlots = coachSlot.slots.filter((slot) => {
        for (let i = 0; i < startTimes.length; i++) {
          if (slot.start_time === startTimes[i] && slot.end_time === endTimes[i] && !slot.isBooked) {
            return true;
          }
        }
        return false;
      });

      if (availableSlots.length < startTimes.length) {
        return res.status(400).json({
          success: false,
          message: `Some of the selected slots on ${currentDate.toISOString().split("T")[0]} are already booked.`,
        });
      }

      availableSlots.forEach((slot) => {
        dailyPrice += slot.price;
      });

      totalBookedPrice += dailyPrice;

      // Save the available slots for payment validation
      slotsBookedDetails.push({
        date: currentDate.toISOString().split("T")[0],
        slots: availableSlots,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;
    // Proceed to payment if all slots are available
    const merchantTransactionId = `${user_id}-${Date.now()}`;
    // Partial payment = 50% advance; full payment = 100%
    const payableAmount =
      paymentType === "partial"
        ? Math.round(totalBookedPrice * PARTIAL_PAYMENT_PERCENT)
        : totalBookedPrice;
    const cashfreeOrder = await createCashfreeOrder({
      orderId: merchantTransactionId,
      amount: payableAmount,
      userId: user_id,
      service: "coach",
    });
    

    // Handle user payment and update the booking details
    const user = await UserDetailsAtPayments.find({ user_id: user_id });
    
    if (user.length > 0) {
      await UserDetailsAtPayments.deleteOne({ user_id: user_id });
    }

    
    const newBooking = await UserDetailsAtPayments.create({
      user_id,
      coachId,
      start_date,
      end_date,
      start_time,
      end_time,
      slotsBook: slotsBookedDetails.flatMap((detail) =>
        detail.slots.map((slot) => slot._id.toString())
      ), // Store the slot IDs
      packageType: "monthly", // Assuming the packageType is fixed or passed in the request
      total_price: totalBookedPrice,
      payment_type: paymentType,
      payable_amount: payableAmount,
      payment_order_id: merchantTransactionId,
      payment_provider: "cashfree",
    });

    // Respond with the payment URL
    return res.json({
      status: 200,
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      orderId: cashfreeOrder.order_id,
    });
  } catch (error) {
    
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const coachPaymentStatus = async (req, res) => {
  try {
    const { txnId: merchantTransactionId } = req.params;

    // Validate merchant transaction ID format
    if (!merchantTransactionId) {
      return res.status(400).json({ success: false, message: "Invalid merchant transaction ID" });
    }

    const result = await getCashfreePaymentStatus(merchantTransactionId);

    if (!result.data || !result.data.data) {
      return res.status(400).json({ success: false, message: "Invalid payment response" });
    }

    const { merchantTransactionId: merchantTransaction_id, transactionId, amount, state, responseCode } = result.data.data;
    const userId = merchantTransactionId.split('-')[0];

    // Validate user ID format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Fetch user details
    const user = await UserDetailsAtPayments.findOne({ payment_order_id: merchantTransactionId }).sort({ createdAt: -1 }) || await UserDetailsAtPayments.findOne({ user_id: userId }).sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ success: false, message: "No payment details found for user" });
    }

    // Destructure necessary details
    const { user_id, date, coachId, slotsBook, start_date, end_date,start_time,end_time,createdAt, payment_type } = user;

    // Fetch coach data
    const coachData = await CoachModel.findById(coachId);
    if (!coachData) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    const coachName = `${coachData.first_name} ${coachData.last_name}`;

    // Fetch user data
    const userData = await User.findById(user_id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { email, first_name, last_name, mobile } = userData;

    // Calculate the total booked price
    const totalBookedPrice = slotsBook.reduce((total, slot) => total + (slot.price || 0), 0);

    // Create the transaction record
 

 

  const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

// Example usage
const formattedStartDate = formatDate(start_date); // 21-01-25
const formattedEndDate = formatDate(end_date);

const formattedBookDate = formatDate(createdAt);

const slotDates = `${formattedStartDate} to ${formattedEndDate}`;


    const pdfData = {
      entityType: "Coach",  // Dynamically set based on entity type (this could be "Venue" or "Personal Trainer")
      entityName: coachName,  // Combine first name and last name with a space in between
      slotsBooked:  `${start_time} to ${end_time}`|| "N/A",  // Default to "N/A" if times are not available
      date: slotDates || "N/A",  // Use formattedDate or default to "N/A"
      bookDate: formattedBookDate || "N/A",  // Book date
      transactionId: transactionId || "N/A",  // Handle potential missing transactionId
      merchantTransaction_id:merchantTransaction_id,  // Handle missing txnId
      total_price: amount/100,  // Format total_price to two decimal places
      status: state || "N/A",  // Default to "N/A" if state is missing
      startDate:start_date || "N/A",  // Default to "N/A" if start date is missing
      endDate: end_date || "N/A",  // Default to "N/A" if end date is missing
      first_name,
      last_name,
      mobile: mobile || "N/A",  // Ensure mobile number is handled properly
      email: email || "N/A",  // Handle empty email fields
    };
    const html = mailContent.generateUnifiedPdfInvoice(pdfData);
    var option = { format: "A3" };
    var filename = `${uuidv4()}.pdf`;
    var invoicePath = path.join(__dirname, `../public/pdf/${filename}`);
    var pdfUrl = `/pdf/${filename}`;
    let hasPdf = false;
    try {
      const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({
        path: invoicePath,
        formate: "A3",
        printBackground: true,
      });
      await browser.close();
      hasPdf = true;
    } catch (pdfError) {
      console.error("PDF Generation failed in coachPaymentStatus:", pdfError);
    }
    const attachedFiles = hasPdf ? [{ filename, path: invoicePath }] : [];
          // Create the booking record

         
          if (result.data.success == true) {

            if (result.data.code == "PAYMENT_SUCCESS") {

              const existing = await CoachBooking.findOne({  merchantTransaction_id: merchantTransactionId })
        if (existing) {
          return res.redirect(process.env.REDIRECT_URL);
        }
              const newBooking = await CoachBooking.create({
                userId: user_id,
                coachId,
                slotsBook,
                startDate: start_date,
                endDate: end_date,
                start_time:start_time,
                end_time:end_time,
                total_price: amount/100,
                transaction_id: transactionId,
                merchantTransaction_id: merchantTransaction_id,
                paymentStatus: responseCode,
                paymentState: state,
                pdf_url:pdfUrl,
                payment_type: payment_type || "full",
                payable_amount: payment_type === "partial" ? amount/100 : null,
              });
              const transaction = await Transaction.create({
                user_id,
                coachId,
                date,
                transaction_id: transactionId,
                merchantTransaction_id: merchantTransaction_id,
                amount:amount/100,
                paymentStatus: responseCode,
                slotsBook,
                paymentState: state,
              });
    // After successful payment, update slots to booked
    for (const slotId of slotsBook) {
      const coachSlot = await CoachSlot.findOne({ coachId: coachId, start_date: new Date(start_date) });

      if (!coachSlot) continue;

      const slotToUpdate = coachSlot.slots.find((s) => s._id.toString() === slotId);
      if (slotToUpdate) {
        slotToUpdate.isBooked = true;
        await coachSlot.save();
      }
    }
       const emailData = {
        adminName: "Admin",
        entityType:"Coach", // Replace with the admin's actual name if available
        users: `${first_name} ${last_name}`,
        venue_Name: coachName, // Replace "venue" terminology with "coach"
        venue_Location:coachData.address,
        slotDate:slotDates,
        slotTime:`${start_time} to ${end_time}`,
        totalPrice: amount/100,
        recipientEmail: email,
      };
     
  // Destructure emailData for email generation
  const {
    entityType,
    adminName,
    users,
    venue_Name,
    venue_Location,
    slotDate,
    slotTime,
    totalPrice,
    recipientEmail,
  } = emailData;

  // Generate email content
  const mailcontent = mailContent.sendBookingRequestEmail(
    entityType,
    adminName,
    users,
    venue_Name,
    venue_Location,
    slotDates,
    slotTime,
    totalPrice,
    recipientEmail
  );
  const mailcontentuser = mailContent.sendBookingEmailToApprovalToAdmin(
    adminName,
    users,
    "Coach", // Entity type
    venue_Name, // Coach Name
    venue_Location, // Coach Location
    slotDates, // Slot Date
    slotTime, // Slot Time
    totalPrice, // Total Price
    recipientEmail // Recipient Email
  );

  // Send emails
  try {
    await mail.sendBookingRequestEmail({
      mailcontentuser,
      recipientEmail,
      venueName: coachName,
      attachmentInvoices: attachedFiles,
    });

    await mail.sendBookingEmailToApprovalToVenueAdmin({
      mailcontent,
      venueadminemail: coachData.email, // Coach Admin's email
      venueName: coachName,
      attachmentInvoices:[],
    });
    await mail.sendBookingEmailToApprovalToSuperAdmin({
      mailcontent,
      subject: `Booking Approval Required for ${coachName}`,
    });
  } catch (emailError) {
    console.error("Email sending failed in coachPaymentStatus:", emailError);
  }
    // Increment user's booking count
    await User.findByIdAndUpdate(user_id, { $inc: { booking_count: 1 } }, { new: true });

    // Delete temporary user payment record
    await UserDetailsAtPayments.deleteOne({ user_id });
   
    const redirectUrl=process.env.REDIRECT_URL;
   
    res.redirect(redirectUrl);
  } 
  }
   else {
    const transaction = await Transaction.create({
      user_id,
      coachId,
      date,
      transaction_id: transactionId,
      merchantTransaction_id: merchantTransaction_id,
      amount:amount/100,
      paymentStatus: responseCode,
      slotsBook,
      paymentState: state,
    });
    res.redirect(process.env.FAIL_URL); // Redirect to failure page 
  }
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to process payment status",
      error: error.message,
    });
  }
};

const getCoachBookingByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const paymentState = req.query.paymentState || "COMPLETED";
    const BookingData = await CoachBooking.find({
      userId: userId,
      paymentState: paymentState,
    })
      .populate("userId coachId")
      .lean(); // .lean() for better performance with Mongoose
    const populatedBooking = await Promise.all(
      BookingData.map(async (slot) => {
        const startDate = slot.startDate;
        const coachID = slot.coachId;
        const CoachSlotBooked = await CoachSlot.findOne({
          batchDate: startDate,
          coachId: coachID,
        }).lean();

        if (CoachSlotBooked) {
          const slotInfo = CoachSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slotBooked.toString();
          });

          if (slotInfo) {
            slot.slotBooked = slotInfo;
          }
        }

        return slot;
      })
    );

    res.status(200).json({
      success: true,
      message: "Coach booking fetched successfully",
      data: populatedBooking,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch coach booking",
      error: err.message,
    });
  }
};

const personalTrainerPayment = async (req, res) => {
  try {
    const { user_id, trainerId, start_date, end_date, start_time, end_time, payment_type } = req.body;
// Personal_trainer_id
    // Validate the request body
    if (!user_id || !trainerId || !start_date || !end_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing (user_id, trainerId, start_date, end_date, start_time, end_time)",
      });
    }
    const paymentType = payment_type === "partial" ? "partial" : "full";

    // Convert start_date and end_date to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ensure start_date is before end_date
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    const startTimes = Array.isArray(start_time) ? start_time : String(start_time).split(",").map(s => s.trim());
    const endTimes = Array.isArray(end_time) ? end_time : String(end_time).split(",").map(s => s.trim());

    let totalBookedPrice = 0;
    const slotsBookedDetails = [];

    // Loop through each day in the date range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const trainerSlot = await PersonalTrainerSlot.findOne({
        trainerId: trainerId,
        start_date: currentDate,
      });

      if (!trainerSlot) {
        return res.status(404).json({
          success: false,
          message: `Slots not found for ${currentDate.toISOString().split("T")[0]}`,
        });
      }

      // Check availability of the requested time slots for the current date
      let dailyPrice = 0;
      const availableSlots = trainerSlot.slots.filter((slot) => {
        for (let i = 0; i < startTimes.length; i++) {
          if (slot.start_time === startTimes[i] && slot.end_time === endTimes[i] && !slot.isBooked) {
            return true;
          }
        }
        return false;
      });

      if (availableSlots.length < startTimes.length) {
        return res.status(400).json({
          success: false,
          message: `Some of the selected slots on ${currentDate.toISOString().split("T")[0]} are already booked.`,
        });
      }

      availableSlots.forEach((slot) => {
        dailyPrice += slot.price;
      });

      totalBookedPrice += dailyPrice;

      // Save the available slots for payment validation
      slotsBookedDetails.push({
        date: currentDate.toISOString().split("T")[0],
        slots: availableSlots,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;
    // Proceed to payment if all slots are available
    const merchantTransactionId = `${user_id}-${Date.now()}`;
    // Partial payment = 50% advance; full payment = 100%
    const payableAmount =
      paymentType === "partial"
        ? Math.round(totalBookedPrice * PARTIAL_PAYMENT_PERCENT)
        : totalBookedPrice;
    const cashfreeOrder = await createCashfreeOrder({
      orderId: merchantTransactionId,
      amount: payableAmount,
      userId: user_id,
      service: "personalTrainer",
    });
    

    // Handle user payment and update the booking details
    const user = await UserDetailsAtPayments.find({ user_id: user_id });
    if (user.length > 0) {
      await UserDetailsAtPayments.deleteOne({ user_id: user_id });
    }

    const newBooking = await UserDetailsAtPayments.create({
      user_id,
      trainerId,
      start_date,
      end_date,
      start_time,
      end_time,
      slotsBook: slotsBookedDetails.flatMap((detail) =>
        detail.slots.map((slot) => slot._id.toString())
      ), // Store the slot IDs
      packageType: "monthly", // Assuming the packageType is fixed or passed in the request
      total_price: totalBookedPrice,
      payment_type: paymentType,
      payable_amount: payableAmount,
      payment_order_id: merchantTransactionId,
      payment_provider: "cashfree",
    });

   

    // Respond with the payment URL
    return res.json({
      status: 200,
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      orderId: cashfreeOrder.order_id,
    });
  } catch (error) {
    
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const personalTrainerPaymentStatus = async (req, res) => {
  try {
    const { txnId: merchantTransactionId } = req.params;
  
    if (!merchantTransactionId) {
      return res.status(400).json({ success: false, message: "Invalid merchant transaction ID" });
    }

    const result = await getCashfreePaymentStatus(merchantTransactionId);

    if (!result.data || !result.data.data) {
      return res.status(400).json({ success: false, message: "Invalid payment response" });
    }

    const { merchantTransactionId: merchantTransaction_id, transactionId, amount, state, responseCode } = result.data.data;
   
    const userId = merchantTransactionId.split('-')[0];

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await UserDetailsAtPayments.findOne({ payment_order_id: merchantTransactionId }).sort({ createdAt: -1 }) || await UserDetailsAtPayments.findOne({ user_id: userId }).sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ success: false, message: "No payment details found for user" });
    }

    const { user_id, date, trainerId, slotsBook, start_date, end_date,start_time,end_time,createdAt, payment_type } = user;

    const trainerData = await personalTrainer.findById(trainerId);

    if (!trainerData) {
      return res.status(404).json({ success: false, message: "personal trainer not found" });
    }
    const trainerName = `${trainerData.first_name} ${trainerData.last_name}`;
  
    const userData = await User.findById(user_id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { email, first_name, last_name, mobile } = userData;

    const totalBookedPrice = slotsBook.reduce((total, slot) => total + (slot.price || 0), 0);

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0'); // Add leading zero
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${day}-${month}-${year}`;
};

const formattedStartDate = formatDate(start_date); // 21-01-25
const formattedEndDate = formatDate(end_date); // 31-01-25
const formattedBookDate = formatDate(createdAt);

const slotDates = `${formattedStartDate} to ${formattedEndDate}`;

    const pdfData = {
      entityType: "Personal Trainer",  // Dynamically set based on entity type (this could be "Venue" or "Personal Trainer")
      entityName: trainerName,  // Combine first name and last name with a space in between
      slotsBooked:  `${start_time} to ${end_time}` || "N/A",  // Default to "N/A" if times are not available
      date: slotDates || "N/A",  // Use formattedDate or default to "N/A"
      bookDate: formattedBookDate || "N/A",  // Book date
      transactionId: transactionId || "N/A",  // Handle potential missing transactionId
      merchantTransaction_id:merchantTransaction_id,  // Handle missing txnId
      total_price: amount/100,  // Format total_price to two decimal places
      status: state || "N/A",  // Default to "N/A" if state is missing
      startDate:start_date || "N/A",  // Default to "N/A" if start date is missing
      endDate: end_date || "N/A",  // Default to "N/A" if end date is missing
      first_name,
      last_name,
      mobile: mobile || "N/A",  // Ensure mobile number is handled properly
      email: email || "N/A",  // Handle empty email fields
    };
    const html = mailContent.generateUnifiedPdfInvoice(pdfData);
    var option = { format: "A3" };
    var filename = `${uuidv4()}.pdf`;
    var invoicePath = path.join(__dirname, `../public/pdf/${filename}`);
    var pdfUrl = `/pdf/${filename}`;
    let hasPdf = false;
    try {
      const browser = await puppeteer.launch(getPuppeteerLaunchOptions());
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({
        path: invoicePath,
        formate: "A3",
        printBackground: true,
      });
      await browser.close();
      hasPdf = true;
    } catch (pdfError) {
      console.error("PDF Generation failed in personalTrainerPaymentStatus:", pdfError);
    }
    const attachedFiles = hasPdf ? [{ filename, path: invoicePath }] : [];
          
        if (result.data.success == true) {
         if (result.data.code == "PAYMENT_SUCCESS") {
   
          const existing = await PersonalTrainerBooking.findOne({ merchantTransaction_id: merchantTransactionId  })
        if (existing) {
          return res.redirect(process.env.REDIRECT_URL);
        }

          const newBooking = await PersonalTrainerBooking.create({
            user_id: user_id,
            pt_id:trainerId,
            slotsBook,
            startDate: start_date,
            endDate: end_date,
            start_time:start_time,
            end_time:end_time,
            total_price: amount/100,
            transaction_id: transactionId,
            merchantTransaction_id: merchantTransaction_id,
            paymentStatus: responseCode,
            paymentState: state,
            pdf_url:pdfUrl,
            payment_type: payment_type || "full",
            payable_amount: payment_type === "partial" ? amount/100 : null,
          });

           for (const slotId of slotsBook) {
            const ptSlot = await PersonalTrainerSlot.findOne({
              trainerId: trainerId,
              start_date: new Date(start_date),
            });
      
            if (!ptSlot) continue;
      
            const slotToUpdate = ptSlot.slots.find(
              (s) => s._id.toString() == slotId
            );
      
            if (slotToUpdate) {
              slotToUpdate.isBooked = true;
              await ptSlot.save();
            }
          }

       const emailData = {
        adminName: "Admin",
        entityType:"Personal Trainer", // Replace with the admin's actual name if available
        users: `${first_name} ${last_name}`,
        venue_Name: trainerName, // Replace "venue" terminology with "coach"
        venue_Location:trainerData.address,
        slotDate: slotDates,
        slotTime:`${start_time} to ${end_time}`,
        totalPrice: amount/100,
        recipientEmail: email,
      };
     
  const {
    entityType,
    adminName,
    users,
    venue_Name,
    venue_Location,
    slotDate,
    slotTime,
    totalPrice,
    recipientEmail,
  } = emailData;

 
  const mailcontent = mailContent.sendBookingRequestEmail(
    entityType,
    adminName,
    users,
    venue_Name,
    venue_Location,
    slotDates,
    slotTime,
    totalPrice,
    recipientEmail
  );
  const mailcontentuser = mailContent.sendBookingEmailToApprovalToAdmin(
    adminName,
    users,
    "Personal Trainer", // Entity type
    venue_Name, // Coach Name
    venue_Location, // Coach Location
    slotDates, // Slot Date
    slotTime, // Slot Time
    totalPrice, // Total Price
    recipientEmail // Recipient Email
  );

  // Send emails
  try {
    await mail.sendBookingRequestEmail({
      mailcontentuser,
      recipientEmail,
      venueName: trainerName,
      attachmentInvoices: attachedFiles,
    });

    await mail.sendBookingEmailToApprovalToVenueAdmin({
      mailcontent,
      venueadminemail: trainerData.email, // Coach Admin's email
      venueName: trainerName,
      attachmentInvoices:[],
    });
    await mail.sendBookingEmailToApprovalToSuperAdmin({
      mailcontent,
      subject: `Booking Approval Required for ${trainerName}`,
    });
  } catch (emailError) {
    console.error("Email sending failed in personalTrainerPaymentStatus:", emailError);
  }
    await User.findByIdAndUpdate(user_id, { $inc: { booking_count: 1 } }, { new: true });

    await UserDetailsAtPayments.deleteOne({ user_id });
const redirectUrl=`https://kheloindore.in/payment-success`;
res.redirect(redirectUrl);

}
}
 else {

  res.redirect(process.env.FAIL_URL); // Redirect to failure page 
}
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to process payment status",
      error: error.message,
    });
  }
};

const getPersonalTrainerBookingByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const paymentState = req.query.paymentState || "COMPLETED";
    const BookingData = await PersonalTrainerBookingModel.find({
      user_id: userId,
      paymentState: paymentState,
    })
      .populate("user_id pt_id")
      .lean();
    const populatedBooking = await Promise.all(
      BookingData.map(async (slot) => {
        const startDate = slot.start_date;
        const pt_id = slot.pt_id;
        const ptSlotBooked = await PersonalTrainerSlot.findOne({
          batch_date: startDate,
          Personal_trainer_id: pt_id,
        }).lean();
        if (ptSlotBooked) {
          const slotInfo = ptSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slot_id.toString();
          });
          if (slotInfo) {
            slot.slot_id = slotInfo;
          }
        }
        return slot;
      })
    );
    res.status(200).json({
      success: true,
      message: "Personal Trainer booking fetched successfully",
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch personal booking",
      error: err.message,
    });
  }
};

const actualgetVenueCoachPTBookingByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    let paymentState = req.query.paymentState || "COMPLETED";
    const bookings = await Booking.find({
      user_id: userId,
      paymentState: paymentState,
    }).populate("user_id venue_id")
    .sort({ createdAt: -1 });
    if (bookings.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No bookings found" });
    }
    const bookingData = [];
    for (let booking of bookings) {
      const {
        venue_id,
        date,
        slotsBooked,
        total_price,
        transaction_id,
        paymentStatus,
        paymentState,
        pdf_url,
        verification_status,
        _id
      } = booking;
      const slots = await Slot.find({ venue_id: venue_id, "slots._id": { $in: slotsBooked } });
      if (slots.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No slots found for this venue",
          data: [],
        });
      }
      const slotsArray = slots[0].slots;
      const slotPopulatedData = slotsArray.filter((slot) =>
        slotsBooked.includes(slot._id.toString())
      );
      bookingData.push({
        date,
        venue_id,
        slots: slotPopulatedData,
        total_price,
        transaction_id,
        pdf_url,
        paymentStatus,
        paymentState,
        verification_status,
        _id
      });
    }
    const BookingData = await CoachBooking.find({
      userId: userId,
      paymentState: paymentState,
    })
      .populate("userId coachId")
      .lean(); // .lean() for better performance with Mongoose
    const populatedBooking = await Promise.all(
      BookingData.map(async (slot) => {
        const startDate = slot.startDate;
        const coachID = slot.coachId;
        const CoachSlotBooked = await CoachSlot.findOne({
          batchDate: startDate,
          coachId: coachID,
        }).lean();
        if (CoachSlotBooked) {
          const slotInfo = CoachSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slotBooked.toString();
          });

          if (slotInfo) {
            slot.slotBooked = slotInfo;
          }
        }

        return slot;
      })
    );
    const ptBookingData = await PersonalTrainerBookingModel.find({
      user_id: userId,
      paymentState: paymentState,
    })
      .populate("user_id pt_id")
      .lean();
    const ptPopulatedBooking = await Promise.all(
      ptBookingData.map(async (slot) => {
        const startDate = slot.start_date;
        const pt_id = slot.pt_id;
        const ptSlotBooked = await PersonalTrainerSlot.findOne({
          batch_date: startDate,
          Personal_trainer_id: pt_id,
        }).lean();
        if (ptSlotBooked) {
          const slotInfo = ptSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slot_id.toString();
          });
          if (slotInfo) {
            slot.slot_id = slotInfo;
          }
        }
        return slot;
      })
    );

    res.json({
      status: 200,
      success: true,
      message: "Coach booking fetched successfully",
      venue: bookingData,
      coach: populatedBooking,
      PT: ptPopulatedBooking,
    });
  } catch (error) {}
};

const getVenueCoachPTBookingByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'user_id is required' });
  }

  try {
    // Fetch records for personal trainer and populate pt_id (Personal Trainer)
    const personalTrainerRecords = await PersonalTrainerBookingModel.find({ user_id: userId })
      .populate('pt_id', 'first_name trainer_type last_name',)  // Populating PT details (first_name, last_name)
      .sort({ createdAt: -1 });

    // Fetch records for coach and populate coachId (Coach)
    const coachRecords = await CoachBooking.find({ userId })
      .populate('coachId', 'first_name last_name')  // Populating Coach details (first_name, last_name)
      .sort({ createdAt: -1 });

    // Fetch records for venue admin and populate venue_id (Venue Admin)
    const venueAdminRecords = await Booking.find({ user_id: userId })
      .populate('venue_id', 'name vendor_type')  // Populating Venue details (name)
      .sort({ createdAt: -1 });

    const bookingIds = [
      ...personalTrainerRecords,
      ...coachRecords,
      ...venueAdminRecords,
    ].map((record) => record._id.toString());
    const refunds = await Refund.find({ booking_id: { $in: bookingIds } })
      .sort({ createdAt: -1 })
      .lean();
    const refundByBookingId = new Map();
    refunds.forEach((refund) => {
      const key = String(refund.booking_id);
      if (!refundByBookingId.has(key)) refundByBookingId.set(key, refund);
    });

      const ist = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
const formattedIST = new Date(ist).toISOString().replace("T", " ").split(".")[0];
    // Combine all records and add names to the data
    const allRecords = {
      formattedIST: formattedIST,
      personalTrainer: personalTrainerRecords.map((record) => ({
        ...record.toObject(),
        refund: refundByBookingId.get(record._id.toString()) || null,
        pt_name: record.pt_id ? `${record.pt_id.first_name || ''} ${record.pt_id.last_name || ''}`.trim() : "N/A",
      })),
      coach: coachRecords.map((record) => ({
        ...record.toObject(),
        refund: refundByBookingId.get(record._id.toString()) || null,
        coach_name: record.coachId ? `${record.coachId.first_name || ''} ${record.coachId.last_name || ''}`.trim() : "N/A",
      })),
      venueAdmin: venueAdminRecords.map((record) => ({
        ...record.toObject(),
        refund: refundByBookingId.get(record._id.toString()) || null,
        venue_name: record.venue_id?.name || "N/A",
        vendor_type: record.venue_id?.vendor_type || "N/A",
      })),
    };

    res.status(200).json({ success: true, data: allRecords });
  } catch (error) {
    
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const checkCashfreeOrderExpiration = async (txnId) => {
  try {
    // Legacy helper retained for pending payment expiry checks.
    // You can store the URL expiration time when generating the URL and compare it here
    const userDetails = await UserDetailsAtPayments.findOne({ user_id: txnId });

    if (!userDetails) {
      throw new Error("Transaction details not found");
    }

    // Assuming the expiration time is stored in the UserDetailsAtPayments model
    const expirationTime = userDetails.expirationTime; // Replace with your field name
    const currentTime = Date.now();

    // Return true if the URL is expired, otherwise false
    return expirationTime && currentTime > expirationTime;
  } catch (error) {
    
    throw error;
  }
};

const venueRefund = async (req, res) => {
  const { BookingId } = req.params;
  const { refundAmount, reason } = req.body;

  

  try {

    let booking = await Booking.findById(BookingId)
    .populate("user_id", "first_name last_name email mobile")
    .populate("venue_id", "name role address")
    

  if (!booking) {
    booking = await CoachBooking.findById(BookingId)
      .populate("userId", "first_name last_name email mobile role")
      .populate("coachId", "first_name last_name email role")
      
  }

  if (!booking) {
    booking = await PersonalTrainerBooking.findById(BookingId)
      .populate("user_id", "first_name last_name email mobile role")
      .populate("pt_id", "first_name last_name email role")
      
  }

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const requesterId = String(req.user?.userID || "");
  const requesterRole = req.user?.role;
  const bookingProviderId = booking.vendor_id || booking.coachId?._id || booking.coachId || booking.pt_id?._id || booking.pt_id;
  const canRefund = requesterRole === "Super Admin" ||
    ((requesterRole === "Venue Admin" || requesterRole === "Coach" || requesterRole === "Personal Trainer") &&
      requesterId && String(bookingProviderId) === requesterId);

  if (!canRefund) {
    return res.status(403).json({ success: false, message: "You are not allowed to refund this booking" });
  }

  const existingRefund = await Refund.findOne({ booking_id: String(booking._id), refundStatus: { $in: ["SUCCESS", "COMPLETED"] } });
  if (existingRefund) {
    return res.status(400).json({ success: false, message: "A successful refund already exists for this booking" });
  }

  const policyRefundAmount = computeRefundAmount(booking);
  if (policyRefundAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "This booking is not eligible for a refund. Partial payments are non-refundable and full payments must be cancelled at least 4 hours before the booking time.",
    });
  }
  if (Number(refundAmount) !== policyRefundAmount) {
    return res.status(400).json({
      success: false,
      message: `Refund amount must be 75% of the full payment (₹${policyRefundAmount}) according to the cancellation policy.`,
    });
  }

  const txnId = booking.merchantTransaction_id;

    if (!txnId || !refundAmount || isNaN(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    const paidAmount = Number(booking.payable_amount ?? booking.total_price ?? 0);
    if (Number(refundAmount) > paidAmount) {
      return res.status(400).json({ success: false, message: "Refund amount cannot exceed the amount paid" });
    }

    const cashfreeRefund = await createCashfreeRefund({
    orderId: txnId,
    amount: refundAmount,
    reason,
  });
  const refundTransactionId = cashfreeRefund.refund_id;
  const refundStatus = cashfreeRefund.refund_status || "PENDING";
  const providerReferenceId = cashfreeRefund.cf_refund_id || refundTransactionId;
    const user = booking.user_id || booking.userId;
    const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "Unknown User";
    let associatedEntityName = "N/A";
    if (booking.venue_id && booking.venue_id.name) {
      associatedEntityName = booking.venue_id.name;
    } else if (booking.vendor_id) {
      associatedEntityName = `${booking.vendor_id.first_name || ''} ${booking.vendor_id.last_name || ''}`.trim();
    } else if (booking.coachId) {
      associatedEntityName = `${booking.coachId.first_name || ''} ${booking.coachId.last_name || ''}`.trim();
    } else if (booking.pt_id) {
      associatedEntityName = `${booking.pt_id.first_name || ''} ${booking.pt_id.last_name || ''}`.trim();
    }

    // Save refund record in Refunds collection
    const newRefund = new Refund({
      transaction_id: booking.transaction_id,
      user_id: user ? user._id : null,
      merchantTransaction_id: booking.merchantTransaction_id,
      booking_id: BookingId,
      user_name: userName,
      associated_entity_name: associatedEntityName,
      slotsBook: booking.slotsBook || booking.slotsBooked,
      refund_id: refundTransactionId,
      refundAmount,
      refundStatus,
      refundReason: reason,
      providerReferenceId,
    });

    await newRefund.save();

    // Mark booking cancellation status
    booking.cancellation_status = 1;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      refundId: refundTransactionId,
      refundStatus,
    });

  } catch (error) {
    
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing the refund",
      details: error.response ? error.response.data : error.message,
    });
  }
};

const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ createdAt: -1 }); // Fetch all refunds, sorted by latest
    const totalRefunds = await Refund.countDocuments(); // Count total refunds

    return res.status(200).json({
      success: true,
      count: totalRefunds,
      data: refunds,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch refunds",
      error: error.message,
    });
  }
};


module.exports = {
  computeRefundAmount,
  processBookingRefund,
  venuePayment,
  venuePaymentStatus,
  coachPayment,
  coachPaymentStatus,
  personalTrainerPayment,
  personalTrainerPaymentStatus,
  getVenueBookingByUserId,
  getCoachBookingByUserId,
  getPersonalTrainerBookingByUserId,
  getVenueCoachPTBookingByUserId,
  venueRefund,
  getAllRefunds,
};
