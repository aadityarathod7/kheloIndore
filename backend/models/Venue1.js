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
    images: Array,
    amenities: [String],
    near_by_location: String,
    google_location: String,
    contact_number: String,
    other_contact_number: String,
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
    stateId: String,
    googleCoordinates: {
      latitude: { type: Number},
      longitude: { type: Number}
    },
    emailId: { type: String,},
    facilities: { type: [String], default: [] },
    policiesAndRules: { type: String },
    gameType: { type: String }, 
    additionalNotes: { type: String, default: "" },
    capacity: { type: Number}, // Max people allowed
    package_type:[String],
    // Long-term memberships for recurring facilities such as Gym and Swimming Pool.
    membership_plans: {
      type: [{
        name: { type: String, trim: true },
        months: { type: Number, min: 1 },
        price: { type: Number, min: 0 },
        priority: { type: String, trim: true, default: "Standard Booking" },
        discount: { type: String, trim: true, default: "Flexible Plan" },
        support: { type: String, trim: true, default: "Basic Support" },
      }],
      default: [],
    },
    status: {
      type: Boolean,
      default: true,
    },
    vendor_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
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
    read_seen: {
      type: Number, // 1 for open, 0 for close
      default: 1,  // Default to open
    },
    data: {
      type: Map,
      of: [keyValueSchema],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
  },
  updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: null
  },
  verification_status: {
    type: Number,
    default:0
  },
  awaiting_approval: { type: Boolean, default: false },
  pending_update: { type: mongoose.Schema.Types.Mixed, default: null },
  categories: {
    type: [String],
    default: []
  },
  videos: {
    type: Array,
    default: []
  },
  sports_details: {
    type: Array,
    default: []
  },
  share_token: {
    type: String,
    default: ""
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
const Venue1 = mongoose.model("Venue1", venueSchema);

module.exports = Venue1;
