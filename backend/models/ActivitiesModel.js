const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activity_name: {
      type: String,
      required: [true, "Please enter the activity name"],
      unique: true,
    },
    status: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
