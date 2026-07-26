const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
    },
    mobile: {
      type: Number,
      required: [true, "Mobile number is required"],
    },
    email: {
      type: String,

      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", contactSchema);
