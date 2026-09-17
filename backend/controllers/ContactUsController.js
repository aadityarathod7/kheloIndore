const Contact = require("../models/ContactUsModel");

const validateMobile = function (mobile) {
  return /^\d{10}$/.test(mobile); // Checks if the mobile number is exactly 10 digits.
};

const validateName = function (name) {
  return /^[a-zA-Z ]+$/.test(name); // Checks if the name contains only letters and spaces.
};

exports.createContactUs = async (req, res) => {
  const { first_name, mobile } = req.body;
  let errors = {};

  // Check for presence and validate first name
  if (!first_name) {
    errors.first_name = "First name is required";
  } else if (!validateName(first_name)) {
    errors.first_name = "First name must contain only characters";
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
    const contact = new Contact(req.body);
    await contact.save();
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

exports.fetchContactUs = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions = {};

    // Add column-specific search conditions dynamically
    const searchFields = ["first_name", "email", "subject"];
    searchFields.forEach((field) => {
      if (req.query[field]) {
        queryConditions[field] = new RegExp(req.query[field], "i");
      }
    });

    // Add global search condition
    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryConditions["$or"] = [
        { first_name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
      ];
    }

    const contacts = await Contact.find(queryConditions).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

