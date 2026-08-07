const mongoose = require("mongoose");

/**
 * Conversation between exactly two participants.
 * Each participant is polymorphic: { role, ref } where
 *   role = "User" | "Coach" | "Personal Trainer" | "Venue Admin"
 *   ref  = _id in the matching collection (User / Coach / PersonalTrainer / User)
 */
const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          role: { type: String, required: true },
          ref: { type: mongoose.Schema.Types.ObjectId, required: true },
          // Mobile bridge: lets a provider's collection record (Coach /
          // PersonalTrainer / Venue1) be matched to their User login.
          mobile: { type: Number, default: null },
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 2,
        message: "A conversation must have exactly two participants",
      },
    },
    // Unique key = sorted concatenation of `role:ref` (computed in pre-validate).
    key: { type: String, unique: true, index: true },
    // Denormalised last message for the contact list (avoids a lookup per row)
    lastMessage: {
      text: { type: String, default: "" },
      senderRole: { type: String },
      senderRef: { type: mongoose.Schema.Types.ObjectId },
      sentAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

conversationSchema.pre("validate", function (next) {
  const keys = this.participants
    .map((p) => `${p.role}:${p.ref.toString()}`)
    .sort();
  this.key = keys.join("|");
  next();
});

module.exports = mongoose.model("Conversation", conversationSchema);
