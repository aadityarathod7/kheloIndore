const mongoose = require("mongoose");

const keyValueSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const venueSchema = new mongoose.Schema(
  {
    vendor_type: String,
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

// Check if the model already exists before defining it
const Venue1 = mongoose.model("Venue1", venueSchema);

module.exports = Venue1;
