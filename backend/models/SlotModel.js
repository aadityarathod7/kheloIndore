const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue1",
  },
  date: { type: Date, required: true },
  slots: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      price: { type: Number, required: true },
      isBooked: { type: Boolean, default: false },
      isOfflineBlocked: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Slot", SlotSchema);
