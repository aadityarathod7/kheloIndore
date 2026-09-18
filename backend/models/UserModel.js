const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, trim: true, default: "" },
    last_name: { type: String, trim: true, default: "" },
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
    password: { type: String },
    demo_password: { type: String },
    password_reset_sent_at: { type: Date, default: null },
    otp: { type: String },
    stateId: { type: String },
    role: {
      type: String,
      enum: ["User", "Coach", "Venue Admin","Personal Trainer", "Super Admin"],
      default: "User",
    },
    is_admin_access:{
      type:Number,
      default:0
    },
    booking_count:{
      type:Number,
      default:0
    },
    user_info: {
      type: String,
      default: null,
    },
    favourite_sports: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
  },
    state: {
      type: String,
      default: null,
  },
    zipcode:{
      type:Number,
      default:0
    },    
    profile_image: [
      {
        fileType: { type: String },
        src: { type: String },
        fileName: { type: String },
      },
    ],
    status:{
      type:Boolean,
      default:true
    },
    cashfree_vendor_id: { type: String, trim: true, default: "" },
    cashfree_vendor_status: { type: String, trim: true, default: "NOT_ONBOARDED" },
    cashfree_vendor_updated_at: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
