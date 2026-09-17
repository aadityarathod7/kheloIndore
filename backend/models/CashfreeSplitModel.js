const mongoose = require("mongoose");

// Stores only reconciliation data. Bank/KYC values are sent directly to
// Cashfree during onboarding and are deliberately never persisted here.
const cashfreeSplitSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true, index: true },
  booking_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  provider_type: { type: String, enum: ["venue", "coach", "trainer"], required: true },
  provider_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  cashfree_vendor_id: { type: String, required: true },
  gross_amount: { type: Number, required: true },
  vendor_percentage: { type: Number, required: true },
  platform_percentage: { type: Number, required: true },
  split_status: { type: String, default: "PENDING" },
  split_requested_at: { type: Date, default: null },
  split_completed_at: { type: Date, default: null },
  settlement_status: { type: String, default: "PENDING" },
  settlement_reference: { type: String, default: "" },
  last_event: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

module.exports = mongoose.model("CashfreeSplit", cashfreeSplitSchema);
