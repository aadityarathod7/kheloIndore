const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    VenueID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("SuperAdmin",superAdminSchema);