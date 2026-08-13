const mongoose = require("mongoose");
module.exports = mongoose.model("Review", new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  target_type: { type: String, enum: ["venue", "coach", "trainer"], required: true },
  target_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000, default: "" },
}, { timestamps: true }));
