const Enquiry = require("../models/EnquiryModel");

const validateMobile = function (mobile) {
  return /^\d{10}$/.test(mobile); // Checks if the mobile number is exactly 10 digits.
};

const validateName = function (name) {
  return /^[a-zA-Z ]+$/.test(name); // Checks if the name contains only letters and spaces.
};

exports.createEnquiry = async (req, res) => {
  const { full_name, mobile } = req.body;
  let errors = {};

  // Check for presence and validate first name
  if (!full_name) {
    errors.full_name = "Full name is required";
  } else if (!validateName(full_name)) {
    errors.full_name = "Full name must contain only characters";
  }

  // Validate mobile number
  if (!mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!validateMobile(mobile)) {
    errors.mobile = "Mobile number must be exactly 10 digits";
  }

  // If there are any validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: errors,
    });
  }

  // If all validations pass, proceed to create the contact
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    return res
      .status(200)
      .json({ message: "Your response is recorded successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    return res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
