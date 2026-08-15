const mongoose = require("mongoose");

const PersonalTrainerSchema = new mongoose.Schema(
  {
    provider_public_id: { type: String, unique: true, sparse: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    mobile: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v.toString().length === 10;
        },
        message: (props) =>
          `${props.value} is not a valid mobile number! Mobile numbers must be exactly 10 digits.`,
      },
    },
    password: {
      type: String,
    },
    demo_password: { 
      type: String
     },
    venue_name:{ 
      type: String,
      trim: true },
    age: {
      type: Number,
    },
    is_admin_access:{
      type:Number,
      default:0
    },
    date_of_birth: {
      type: String,
    },
    category_type: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    skills: {
      type: String,
    },
    gender: {
      type: String,
    },
    policiesAndRules: {
      type: String
      },
   profile_picture: {
     type: Array,
     default: null,
   },
   identity_Proof: {
     type: Array,
     default: null,
   },
   other_document: {
     type: Array,
     default: null,
   },
    languages: { type: [String], default: [] },
    sports: { type: [String], default: [] },
    training_mode: { type: String, enum: ["Online", "Offline", "Both", ""], default: "" },
    training_levels: { type: [String], default: [] },
    age_groups: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    achievements_awards: { type: [String], default: [] },
    training_formats: { type: [String], default: [] },
    group_size_max: { type: Number, min: 1, max: 15, default: 15 },
    session_durations: { type: [Number], default: [] },
    availability_options: { type: [String], default: [] },
    pricing: {
      price_per_session: Number,
      price_per_hour: Number,
      monthly: Number,
      quarterly: Number,
      yearly: Number,
      trial_session_price: Number,
    },
    professional_experiences: [{
      previous_club_or_academy: { type: String, trim: true },
      notable_teams_or_players: { type: String, trim: true },
      tournaments_won: { type: String, trim: true },
      championships_or_awards: { type: String, trim: true },
      years_playing_experience: { type: Number, min: 0 },
      years_training_experience: { type: Number, min: 0 },
    }],
    verification_documents: {
      government_id: { type: Array, default: [] },
      coaching_certificates: { type: Array, default: [] },
      sports_qualifications: { type: Array, default: [] },
      experience_proofs: { type: Array, default: [] },
    },
    training_photos: { type: Array, default: [] },
    certificate_achievement_photos: { type: Array, default: [] },
    trainer_type: {
      type: String,
    },
    price: Number,
    gallery: {
      type: Array,
      default: null,
    },
    otp: { type: String },
    role: {
      type: String,
      default: "Personal Trainer",
    },
    price: {
      type: Number,
      default:1,
    },
    location: {
      google_location: String,
      address: String,
      city: String,
      state: String,
      zipcode: String,
    },
    near_by_location: { type: String },
    experience: { type: Number },
    availability: { type: String },
    specializations: [{ type: String }],
    category: { type: String },
    bio: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
    verification_status: {
      type: Number,
      default: 0
    },
    read_seen: {
      type: Number, // 1 for open, 0 for close
      default: 1,  // Default to open
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 1, // Default value set to 1
    },
    package: {
      monthly: Number,
      quarterly: Number,
      yearly: Number,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    // ---- Extended profile fields ----
    coaching_levels: {
      type: [String],
      default: [],
    },
    own_level: {
      type: String,
      default: "",
    },
    response_time: {
      type: String,
      default: "",
    },
    class_location: {
      type: String,
      default: "",
    },
    students_trained: {
      type: Number,
      default: 0,
    },
    profile_views: {
      type: Number,
      default: 0,
    },
    social_media: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    gallery_videos: {
      type: Array,
      default: null,
    },
    daily_availability: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews_count: {
      type: Number,
      default: 0,
    },
    share_token: {
      type: String,
      default: "",
    },
    profile_completion_token: {
      type: String,
      default: "",
    },
    is_profile_completed: {
      type: Boolean,
      default: false,
    },
    onboard_email_sent: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: [String],
      default: [],
    },
    videos: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);


const { nextProviderPublicId } = require("../helper/providerPublicId");
PersonalTrainerSchema.pre("save", async function assignProviderPublicId(next) {
  if (!this.provider_public_id) this.provider_public_id = await nextProviderPublicId("trainer");
  next();
});
module.exports = mongoose.model("PersonalTrainer", PersonalTrainerSchema);
