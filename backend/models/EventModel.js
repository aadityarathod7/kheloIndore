const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true },
    description: { type: String, required: false },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false },
    location: { type: String, required: false },
    status: { type: Boolean, default: true },
    images: { type: Array, default: null },
    price: { type: Number, required: false },
    organized_by: { type: String, required: false },
    category: { type: String, default: "Sports" },
    near_by_location: {
      type: String,
    },
    terms_and_conditions: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
