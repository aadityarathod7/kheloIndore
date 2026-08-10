const mongoose = require("mongoose");

const vendorPayoutSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: "Venue1", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    payout_date: { type: Date, required: true },
    reference: { type: String, required: true, trim: true, maxlength: 120 },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.VendorPayout || mongoose.model("VendorPayout", vendorPayoutSchema);
