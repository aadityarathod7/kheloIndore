// models/NearbyLocation.js
const mongoose = require("mongoose");

const nearbyLocationSchema = new mongoose.Schema(
  {
    area_name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: "true",
    },
  },
  { timestamps: true }
);

const NearbyLocation = mongoose.model("NearbyLocation", nearbyLocationSchema);

module.exports = NearbyLocation;
