const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendor_type: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
