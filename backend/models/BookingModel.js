const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date:{
      type: Date,
      required:true
    },
    venue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue1",
      required: true,
    },
    
    slotsBooked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
        required: true,
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    read_seen: {
      type: Number, // 1 for open, 0 for close
      default: 1,  // Default to open
    },
    transaction_id: {
      type: String,
      // required: true,
  },
  merchantTransaction_id: {
      type: String,
      // required: true,
  },
  paymentStatus: {
    type: String,
    // required: true,
},
paymentState: {
    type: String,
    // required: true,
},
vendor_id: {
  type: mongoose.Schema.Types.ObjectId, // Changed to reference Vendor model
      ref: "User",
},
isMailSent: { type: Boolean, default: false },
pdf_url: {
  type: String
},
cancellation_status: {
  type: Number, // 0: Active, 1: Canceled
  default: 0,
},
verification_status: {
  type: Number,
  default:0
},
cancellation_expired: {
  type: Number,
  default:0
},
slot_time: [{ startTime: String, endTime: String }],
read_seen: {
  type: Number, // 1 for open, 0 for close
  default: 1,  // Default to open
},
payment_type: {
  type: String,
  default: "full", // "full", "partial" or "manual"
},
payable_amount: {
  type: Number,
  default: null,
},
total_amount: {
  type: Number,
  default: null,
},
manual_booking: {
  type: Boolean,
  default: false,
},
manual_notes: {
  type: String,
  default: "",
},
payment_mode: {
  type: String,
  default: "cash",
},
  },
  { timestamps: true }
);


module.exports = mongoose.model("Booking", bookingSchema);
