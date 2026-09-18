const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
    },
    last_name: {
      type: String,
      // required: [true, "Last name is required"],
    },
    email: {
      type: String,
    
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    mobile: {
      type: Number,
      required: [true, "Mobile number is required"],
    },
    subject: {
      type: String,
    
    },
    comments: {
      type: String,
    
    },
    ticket_number: { type: String, unique: true, sparse: true, index: true },
    status: { type: String, enum: ["Open", "Resolved"], default: "Open" },
    resolved_at: { type: Date, default: null },
    resolved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
