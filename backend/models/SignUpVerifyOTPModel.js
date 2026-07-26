const mongoose = require('mongoose');

const signupVerifyOTP = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      trim: true,
    },
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
      // required: true,
      default: "",
    },
    demo_password: {
      type: String,
    },
    otp: {
      type: String,
    },
    role: {
      type: String,
      enum: ["User", "Coach", "Venue Admin", "Super Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("signupOTP", signupVerifyOTP);