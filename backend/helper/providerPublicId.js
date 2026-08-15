const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.models.ProviderPublicIdCounter || mongoose.model("ProviderPublicIdCounter", counterSchema);

const PREFIXES = {
  venue: "KI-VENUE",
  coach: "KI-COACH",
  trainer: "KI-TRAINER",
};

async function nextProviderPublicId(type) {
  const prefix = PREFIXES[type];
  if (!prefix) throw new Error("Unsupported provider ID type");
  const counter = await Counter.findOneAndUpdate(
    { key: type },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return `${prefix}-${counter.value}`;
}

module.exports = { nextProviderPublicId, PREFIXES };