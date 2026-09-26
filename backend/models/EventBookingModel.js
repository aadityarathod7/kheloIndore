const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    event_date: {
      type: Date,
    },
    location: {
      type: String,
      default: "",
    },
    tickets: {
      type: Number,
      default: 1,
      min: 1,
    },
    ticket_price: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    attendee_name: {
      type: String,
      default: "",
    },
    attendee_email: {
      type: String,
      default: "",
    },
    attendee_phone: {
      type: String,
      default: "",
    },
    payment_order_id: {
      type: String,
      index: true,
    },
    payment_session_id: {
      type: String,
    },
    payment_status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "FREE"],
      default: "PENDING",
    },
    payment_type: {
      type: String,
      default: "full",
    },
    transaction_id: {
      type: String,
      default: "",
    },
    paid_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventBooking", eventBookingSchema);
