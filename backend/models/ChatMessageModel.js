const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      role: { type: String, required: true },
      ref: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    // read = the message has been seen by the *other* participant
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
