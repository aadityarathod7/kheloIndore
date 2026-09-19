const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  provider_type: { type: String, enum: ["venue", "coach", "trainer"], required: true, index: true },
  provider_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  provider_name: { type: String, trim: true, default: "" },
  plan: {
    name: String,
    months: Number,
    price: Number,
    priority: String,
    discount: String,
    support: String,
    includes_coaching: Boolean,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true, index: true },
  status: { type: String, enum: ["PENDING_PAYMENT", "ACTIVE", "EXPIRED", "FAILED", "CANCELLED"], default: "PENDING_PAYMENT", index: true },
  payment: {
    order_id: { type: String, required: true, unique: true },
    cashfree_order_id: String,
    status: { type: String, default: "PENDING" },
    amount: Number,
    paid_at: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("Membership", membershipSchema);
