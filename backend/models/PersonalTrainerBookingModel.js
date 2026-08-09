const mongoose = require("mongoose");

const PtBookingSchema = mongoose.Schema({
  pt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalTrainer",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalTrainerSlot",
  },
  slotsBook: {
    type: [String], // Change to accept an array of strings (dates)
    
  },
  cancellation_expired: {
    type: Number,
    default:0
  },
  slot_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"PersonalTrainerSlot"
  },
  total_price: {
    type: Number,
    // required: true,
  },
  cancellation_status: {
    type: Number, // 0: Active, 1: Canceled
    default: 0,
  },
  verification_status: {
    type: Number,
    default:0
  },
  transaction_id: {
    type: String,
},
isMailSent: { type: Boolean, default: false },
merchantTransaction_id: {
    type: String,
},
paymentStatus: {
  type: String,
},
paymentState: {
  type: String,
},
pdf_url: {
  type: String,
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
payment_type: {
  type: String,
  default: "full", // "full" or "partial"
},
payable_amount: {
  type: Number,
  default: null,
},
total_amount: {
  type: Number,
  default: null,
},
},
{ timestamps: true },
);

module.exports = mongoose.model("PersonalTrainerBooking",PtBookingSchema)
 