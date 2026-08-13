const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["credit", "debit", "refund"], required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, default: "" },
  reference: { type: String, trim: true, default: "" },
  booking_id: { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
