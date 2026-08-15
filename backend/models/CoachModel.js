const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema(
  {
    provider_public_id: { type: String, unique: true, sparse: true, index: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    full_name:{ type: String,trim: true },
    venue_name:{ type: String,trim: true },
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
    demo_password: { type: String },
    other_contact_number: {
      type: String,
    },
    trainer_type: {
      type: String,
    },
    age: {
      type: Number,
    },
    date_of_birth: { 
      type: String, 
    },
    price: {
      type: Number,
      default:1,
    },
    gender: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    skills: {
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
    otp: { type: String },
    role: {
      type: String,
      default: "Coach",
    },
    is_admin_access:{
      type:Number,
      default:0
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
    specializations: { type: String },
    category: { type: String },
    bio: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
    isUpdated: {
      type: Boolean,
      default: false,
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
    read_seen: {
      type: Number, // 1 for open, 0 for close
      default: 1,  // Default to open
    },
    price: {
      type: Number,
      default: 1, // Default value set to 1
    },
    verification_status: {
      type: Number,
      default:0
    },
    // ---- Extended profile fields ----
    // Levels of people this coach wants to coach (Beginner/Intermediate/Advanced)
    coaching_levels: {
      type: [String],
      default: [],
    },
    // Coach's own level (Beginner/Intermediate/Advanced)
    own_level: {
      type: String,
      default: "",
    },
    // How quickly the coach responds to enquiries
    response_time: {
      type: String,
      default: "",
    },
    // Where classes are conducted
    class_location: {
      type: String,
      default: "",
    },
    training_mode: {
      type: String,
      enum: ["Online", "Offline", "Both", ""],
      default: "",
    },
    // Number of students trained by the coach
    students_trained: {
      type: Number,
      default: 0,
    },
    // Profile view counter (incremented on public profile visits)
    profile_views: {
      type: Number,
      default: 0,
    },
    // Social media profile links
    social_media: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    // Images used on the public coach profile.
    gallery: {
      type: Array,
      default: [],
    },
    // Video gallery on the profile
    gallery_videos: {
      type: Array,
      default: null,
    },
    // Daily availability timings e.g. [{day:"Monday",startTime:"06:00",endTime:"20:00"}]
    daily_availability: {
      type: Array,
      default: [],
    },
    // Rating + review count used for sorting/filtering
    rating: {
      type: Number,
      default: 0,
    },
    reviews_count: {
      type: Number,
      default: 0,
    },
    // Profile sharing (share link hides contact + address)
    share_token: {
      type: String,
      default: "",
    },
    // Token used in the "complete your profile" email/SMS link
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
coachSchema.pre("save", async function assignProviderPublicId(next) {
  if (!this.provider_public_id) this.provider_public_id = await nextProviderPublicId("coach");
  next();
});
module.exports = mongoose.model("Coach", coachSchema);
