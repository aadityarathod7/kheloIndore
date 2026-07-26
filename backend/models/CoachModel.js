const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema(
  {
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
    languages: {
      type: String,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coach", coachSchema);
