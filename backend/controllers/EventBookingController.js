const axios = require("axios");
const Event = require("../models/EventModel");
const EventBooking = require("../models/EventBookingModel");
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");

const cashfreeBaseUrl = () =>
  process.env.CASHFREE_BASE_URL ||
  (process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg");

const cashfreeHeaders = () => ({
  accept: "application/json",
  "Content-Type": "application/json",
  "x-api-version": process.env.CASHFREE_API_VERSION || "2023-08-01",
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
});

const getBaseUrl = () => {
  let baseUrl = process.env.WEBSITE_URL;
  if (!baseUrl && process.env.REDIRECT_URL) {
    try {
      const urlStr = process.env.REDIRECT_URL.startsWith("http")
        ? process.env.REDIRECT_URL
        : `https://${process.env.REDIRECT_URL}`;
      baseUrl = new URL(urlStr).origin;
    } catch {
      baseUrl = "https://kheloindore.in";
    }
  }
  return baseUrl || "https://kheloindore.in";
};

exports.createEventBooking = async (req, res) => {
  try {
    const {
      event_id,
      tickets = 1,
      attendee_name,
      attendee_email,
      attendee_phone,
    } = req.body;

    const userId = req.user?.userID || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please log in to continue." });
    }

    if (!event_id) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const user = await User.findById(userId).lean();
    const ticketCount = Math.max(1, Math.min(20, Number(tickets) || 1));
    const unitPrice = Math.max(0, Number(event.price) || 0);
    const totalAmount = unitPrice * ticketCount;

    const contactName =
      (attendee_name || "").trim() ||
      [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
      "Khelo Indore User";
    const contactEmail = (attendee_email || "").trim() || user?.email || "customer@kheloindore.in";
    const contactPhone =
      (attendee_phone || "").replace(/\D/g, "").slice(-10) ||
      String(user?.mobile || "9999999999").replace(/\D/g, "").slice(-10);

    const orderId = `KI_EVT_${Date.now()}_${String(userId).slice(-5)}`;

    // Free event handling (price = 0)
    if (totalAmount === 0) {
      const booking = await EventBooking.create({
        user_id: userId,
        event_id: event._id,
        event_name: event.event_name,
        event_date: event.start_date,
        location: event.location || "",
        tickets: ticketCount,
        ticket_price: 0,
        total_price: 0,
        attendee_name: contactName,
        attendee_email: contactEmail,
        attendee_phone: contactPhone,
        payment_order_id: orderId,
        payment_status: "FREE",
        payment_type: "free",
        transaction_id: `FREE_${Date.now()}`,
        paid_at: new Date(),
      });

      // Notify user
      try {
        await Notification.create({
          user_id: userId,
          title: "Event Registration Confirmed",
          message: `You have successfully registered ${ticketCount} ticket(s) for "${event.event_name}".`,
          type: "booking",
          entity_id: booking._id,
        });
      } catch (err) {
        // Notification failure is non-blocking
      }

      return res.status(201).json({
        success: true,
        is_free: true,
        booking_id: booking._id,
        order_id: orderId,
        message: "Event registration confirmed successfully!",
      });
    }

    // Paid event: create Cashfree order
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: "Payment gateway is currently unavailable. Please try again later.",
      });
    }

    const booking = await EventBooking.create({
      user_id: userId,
      event_id: event._id,
      event_name: event.event_name,
      event_date: event.start_date,
      location: event.location || "",
      tickets: ticketCount,
      ticket_price: unitPrice,
      total_price: totalAmount,
      attendee_name: contactName,
      attendee_email: contactEmail,
      attendee_phone: contactPhone,
      payment_order_id: orderId,
      payment_status: "PENDING",
      payment_type: "full",
    });

    const apiBase = process.env.REDIRECT_API_URL || process.env.WEBSITE_URL || "http://localhost:3037";
    const returnUrl = `${apiBase.replace(/\/$/, "")}/api/event/payment/status/${orderId}`;

    const cfPayload = {
      order_id: orderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: `ki_${userId}`,
        customer_name: contactName,
        customer_email: contactEmail,
        customer_phone: contactPhone,
      },
      order_meta: {
        return_url: returnUrl,
      },
      order_note: `Event: ${event.event_name} (${ticketCount} Ticket${ticketCount > 1 ? "s" : ""})`,
    };

    const response = await axios.post(`${cashfreeBaseUrl()}/orders`, cfPayload, {
      headers: cashfreeHeaders(),
      timeout: 30000,
    });

    booking.payment_session_id = response.data.payment_session_id;
    booking.transaction_id = response.data.cf_order_id || "";
    await booking.save();

    return res.status(201).json({
      success: true,
      is_free: false,
      booking_id: booking._id,
      order_id: orderId,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Failed to initiate event booking.",
    });
  }
};

exports.verifyEventPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const booking = await EventBooking.findOne({ payment_order_id: orderId });
    const baseUrl = getBaseUrl();

    if (!booking) {
      return res.redirect(`${baseUrl}/user/user-bookings?booking=failed`);
    }

    const payment = await axios.get(
      `${cashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}`,
      { headers: cashfreeHeaders(), timeout: 30000 }
    );

    const paid = payment.data?.order_status === "PAID";
    booking.payment_status = paid ? "PAID" : "FAILED";
    if (paid) {
      booking.paid_at = new Date();
      booking.transaction_id = payment.data.cf_order_id || booking.transaction_id || orderId;
    }
    await booking.save();

    if (paid) {
      try {
        await Notification.create({
          user_id: booking.user_id,
          title: "Event Booking Confirmed! 🎉",
          message: `Your booking for "${booking.event_name}" (${booking.tickets} ticket${booking.tickets > 1 ? "s" : ""}) is confirmed. Total paid: ₹${booking.total_price}.`,
          type: "booking",
          entity_id: booking._id,
        });
      } catch (err) {
        // Notification failure is non-blocking
      }

      const query = new URLSearchParams();
      query.set("status", "success");
      query.set("service", "event");
      query.set("bookingId", orderId);
      query.set("txnId", booking.transaction_id || orderId);
      query.set("amount", String(booking.total_price));
      query.set("name", `${booking.event_name} (${booking.tickets} Ticket${booking.tickets > 1 ? "s" : ""})`);
      const eventDateStr = booking.event_date
        ? new Date(booking.event_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
        : "Scheduled Event";
      query.set("date", eventDateStr);
      query.set("slots", `${booking.tickets} Ticket(s) - ${booking.location || "Indore"}`);

      return res.redirect(`${baseUrl}/payment-success?${query.toString()}`);
    } else {
      return res.redirect(`${baseUrl}/user/user-bookings?booking=failed`);
    }
  } catch (error) {
    const baseUrl = getBaseUrl();
    return res.redirect(`${baseUrl}/user/user-bookings?booking=failed`);
  }
};

exports.getMyEventBookings = async (req, res) => {
  try {
    const userId = req.user?.userID || req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please log in to view bookings." });
    }

    const bookings = await EventBooking.find({
      user_id: userId,
      payment_status: { $in: ["PAID", "FREE"] },
    })
      .populate("event_id")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch event bookings.",
    });
  }
};
