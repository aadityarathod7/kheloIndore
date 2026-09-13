const mongoose = require("mongoose");

const keyValueSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const venueSchema = new mongoose.Schema(
  {
    vendor_type: String,
    provider_public_id: { type: String, unique: true, sparse: true, index: true },
    name: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    images: [String],
    amenities: [String],
    near_by_location: String,
    google_location: String,
    contact_number: String,
    category: String,
    price_per_hr: Number,
    is_featured_paid: { type: Boolean, default: false },
    venue_setting: { type: String, enum: ["open", "covered", ""] },
    venue_level: { type: String, enum: ["ground-floor", "terrace", ""] },
    venue_condition: { type: String, enum: ["new", "old", ""] },
    opening_date: { type: Date, default: null },
    has_sound_system: { type: Boolean, default: null },
    air_conditioning: { type: String, enum: ["ac", "non-ac", ""] },
    has_cafeteria: { type: Boolean, default: null },
    venue_size: { type: String, default: "" },
    description: String,
    status: {
      type: Boolean,
      default: true,
    },
    open_at: {
      type: Date,
      default: () => {
        const defaultOpenTime = new Date();
        defaultOpenTime.setHours(6, 0, 0, 0); // Set to 6:00 AM
        return defaultOpenTime;
      },
    },
    close_at: {
      type: Date,
      default: () => {
        const defaultCloseTime = new Date();
        defaultCloseTime.setHours(5, 0, 0, 0); // Set to 5:00 AM
        return defaultCloseTime;
      },
    },
    data: {
      type: Map,
      of: [keyValueSchema],
    },
  },
  { timestamps: true }
);

const { nextProviderPublicId } = require("../helper/providerPublicId");
venueSchema.pre("save", async function assignProviderPublicId(next) {
  if (!this.provider_public_id) this.provider_public_id = await nextProviderPublicId("venue");
  next();
});

// Check if the model already exists before defining it
const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);

module.exports = Venue; 
