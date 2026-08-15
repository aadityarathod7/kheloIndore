const mongoose = require ("mongoose");

const userDetailsAtPaymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date:{
      type: Date,
      // required:true
    },
    venue_id: {
      type: String,
    },
    coachId:{
      type: String,  
    },
    trainerId:{
      type: String,
    },
    packageType: {
      type: String,
      default: "",
      
    },
    start_date: { type: Date },
    end_date: { type: Date},
    start_time: { type: String }, 
    end_time: { type: String },   
    pt_id: {
      type: String,
    
    },
    batch_id: {
      type:String,
    },
    vendor_id: {type:String},
    total_price: { type: Number },
    payable_amount: { type: Number },
    payment_type: { type: String, enum: ["full", "partial"], default: "full" },
    payment_order_id: { type: String, index: true },
    payment_provider: { type: String, default: "cashfree" },
    slotsBooked: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    slotsBook: {
      type: [String], // Change to accept an array of strings (dates)
      required: true
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("UserDetailsAtPayment", userDetailsAtPaymentSchema);
