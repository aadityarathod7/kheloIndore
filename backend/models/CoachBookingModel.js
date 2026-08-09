 const mongoose = require('mongoose');
 const CoachBookingSchema = mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coachId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        required: true

    },
    slotsBook: {
        type: [String], // Change to accept an array of strings (dates)
        required: true
      },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    start_time:{
        type: String,
    },
    end_time:{
        type: String,
    },
    transaction_id: {
        type: String,
        // required: true,
    },
    total_price: {
        type: Number,
        // required: true,
      },
      verification_status: {
        type: Number,
        default:0
      },
      cancellation_status: {
        type: Number, // 0: Active, 1: Canceled
        default: 0,
      },
      cancellation_expired: {
        type: Number,
        default:0
      },
      isMailSent: { type: Boolean, default: false },
    merchantTransaction_id: {
        type: String,
        // required: true,
    },
    paymentStatus: {
      type: String,
      // required: true,
  },
  pdf_url: {
      type: String,
  },
  paymentState: {
      type: String,
      // required: true,
  },
  payment_type: {
      type: String,
      default: "full", // "full" or "partial"
  },
  payable_amount: {
      type: Number,
      default: null, // amount actually paid when partial
  },
  total_amount: {
      type: Number,
      default: null, // full booking amount (before partial split)
  },
 },
 { timestamps: true }
)
 
 module.exports = mongoose.model('CoachBooking',CoachBookingSchema);