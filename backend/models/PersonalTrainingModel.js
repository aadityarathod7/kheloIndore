const mongoose = require("mongoose");

const PersonalTrainerSchema = new mongoose.Schema(
  {
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
    languages: {
      type: String,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("PersonalTrainer", PersonalTrainerSchema);
