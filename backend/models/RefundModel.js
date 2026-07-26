const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true }, // Original transaction ID
    user_id: { type: String, required: true }, // Original transaction ID
    merchantTransaction_id: { type: String, required: true }, // Merchant's transaction ID
    refund_id: { type: String, required: true, unique: true }, // Unique refund transaction ID
    refundAmount: { type: Number, required: true },
    slotsBook: {type: [String]},
    refundStatus: { type: String, required: true }, // Refund status (Pending, Success, Failed)
    refundReason: { type: String }, // Refund reason
    associated_entity_name: { type: String }, // Refund reason
    user_name: { type: String }, // Refund reason
    providerReferenceId: { type: String }, // Refund reason
    booking_id: { type: String }, // Refund reason
    createdAt: { type: Date, default: Date.now }, // Timestamp when refund is created
  },
  { timestamps: true }
);

module.exports = mongoose.model("Refund", RefundSchema);
