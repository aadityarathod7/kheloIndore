const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const message = require("../config/message");
const Admin = require("../models/AdminModel");
const Venue1 = require("../models/Venue1");
const Category = require("../models/CategoryModel");
const signupVerifyOTP = require("../models/SignUpVerifyOTPModel");
require("dotenv").config();
const Coach = require("../models/CoachModel");
const mongoose = require("mongoose");
const path = require("path");

//signup By SuperADmin
exports.signupBySuperAdmin = async (req, res) => {
  try {
    const { first_name, last_name, role, mobile, email, status } = req.body;

    let validationErrors = [];

    if (!first_name) {
      validationErrors.push("first name is required");
    } else if (!/^[a-zA-Z ]+$/.test(first_name)) {
      validationErrors.push("first name should contain only characters");
    }

    if (!last_name) {
      validationErrors.push("last name is required");
    } else if (!/^[a-zA-Z ]+$/.test(last_name)) {
      validationErrors.push("last name should contain only characters");
    }

    if (!mobile || mobile.toString().length !== 10) {
      validationErrors.push("mobile number must be 10 digits");
    }

    if (validationErrors.length > 0) {
      let message = validationErrors
        .join(", ")
        .replace(/, ([^,]*)$/, ", and $1");
      return res.status(400).json({
        success: false,
        message: message,
      });
    }

    const userExists = await User.findOne({ mobile: mobile });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "The user already exists. Try to login",
      });
    }
    if (role === "Coach") {
      await Coach.create(req.body);
    } else {
      await User.create({
        first_name,
        last_name,
        email,
        mobile,
        role,
        status,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User registered successfully by Super Admin",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { first_name, last_name, role, mobile, email } = req.body;

    // Collecting validation errors
    let validationErrors = [];

    if (!first_name) {
      validationErrors.push("first name is required");
    } else if (!/^[a-zA-Z ]+$/.test(first_name)) {
      validationErrors.push("first name should contain only characters");
    }

    if (!last_name) {
      validationErrors.push("last name is required");
    } else if (!/^[a-zA-Z ]+$/.test(last_name)) {
      validationErrors.push("last name should contain only characters");
    }

    if (!mobile || mobile.toString().length !== 10) {
      validationErrors.push("mobile number must be 10 digits");
    }

    if (!email) {
      validationErrors.push("email is required");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      validationErrors.push("invalid email format");
    }

    // Check for any validation errors
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please fill the ${validationErrors.join(", ")}.`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ mobile: mobile }, { email: email }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "The User already exists. Try to login",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const localCheck = await signupVerifyOTP.findOne({
      $or: [{ mobile: mobile }, { email: email }],
    });

    const userData = {
      mobile: mobile,
      email: email,
      first_name: first_name,
      last_name: last_name,
      role: role,
      otp: otp,
    };

    if (localCheck) {
  await signupVerifyOTP.findOneAndUpdate(
    { $or: [{ mobile: mobile }, { email: email }] },
    userData,
    { new: true, upsert: true }
  );
    } else {
      await signupVerifyOTP.create(userData);
    }

    const payload = { mobile: mobile, email: email };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "5m" });

    req.body.mail = {
      senderEmail: "mailto:sanjay2795744@gmail.com",
      senderName: "Admin KheloIndore",
      recipientEmail: email,
      subject: "OTP Verification",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="text-align: center;">
              <img src="cid:logo" alt="KheloIndore" style="max-width: 200px;">
          </div>
          <h2 style="color: #4CAF50; text-align: center;">KheloIndore OTP Verification</h2>
          <p>Dear user,</p>
          <p>Thank you for registering with KheloIndore. To complete your registration, please verify your email address by using the OTP below:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd; text-align: center;">
              ${otp}
          </div>
          <p style="text-align: center;">This OTP is valid for the next 5 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p style="text-align: center;">Best regards,<br>Support<br>KheloIndore Team</p>
      </div>`,
      resData: {
        message: "OTP Sent Successfully",
        token: token,
      },
      attachments: [
        {
          filename: "logo.png",
          // path: logoImagePath,
          cid: "logo", // This is used to link the image with its cid in the HTML
        },
      ],
    };

    next();
  } catch (err) {
    if (err.code === 11000) {
      const duplicateKey = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `The User with this ${duplicateKey} already exists. Try to login`,
      });
    }
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in storing data of signup!",
      error: err.message,
    });
  }
};

exports.signupVerifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_AUTH);
    const mobile = decoded.mobile;

    // Find the user details from signupVerifyOTP collection
    const user = await signupVerifyOTP.findOne({ mobile });

    // If user is not found, return error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    // Hash password if role is not "User"
    let hashedPassword = "";
    if (user.role !== "User") {
      hashedPassword = await bcrypt.hash(user.password, 10);
    }

    // Create user in the appropriate collection (User or Coach)
    let newUser;
    if (user.role === "Coach") {
      newUser = await Coach.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: hashedPassword,
        role: user.role,
        email: user.email,
      });
    } else {
      newUser = await User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: hashedPassword,
        role: user.role,
        email: user.email,
      });
    }

    // Delete OTP verification entry from database
    await signupVerifyOTP.findByIdAndDelete(user._id);

    // Prepare and send welcome email
    req.body.mail = {
      senderEmail: "mailto:sanjay2795744@gmail.com",
      senderName: "Admin KheloIndore",
      recipientEmail: user.email, // Use user.email to get recipientEmail
      subject: "Welcome to KheloIndore", // Adjust subject as needed
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Welcome to KheloIndore</h2>
          <p>Dear ${user.first_name} ${user.last_name},</p>
          <p>Welcome to KheloIndore! Your registration is successful.</p>
          <p>Thank you for joining us.</p>
          <p>Best regards,<br>Support<br>KheloIndore Team</p>
        </div>`,
      resData: { message: "Resistration Successfully" },
    };

    // Call sendMail function to send the welcome email
    next();

    // Return success response
  } catch (err) {
    console.error("Error in signup verification:", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginWithPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    const data1 = await User.findOne({ mobile });
    const data2 = await Coach.findOne({ mobile });
    const user = data1 ? data1 : data2;

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "User") {
      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect password" });
      }

      const payload = {
        userID: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_AUTH, {
        expiresIn: "5h",
      });

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token: token,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "User Can't Access this Route" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

exports.loginUserWithMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Mobile Number ",
      });
    }
    if (mobile.toString().length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Mobile Number in 10 digits",
      });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const checkUser = await User.findOne({ mobile });
    const checkCoach = await Coach.findOne({ mobile });

    if (!checkUser && !checkCoach) {
      return res.status(400).json({
        success: false,
        message: "This user is not found in database",
      });
    }
    if (checkCoach) {
      const data = await Coach.findOneAndUpdate(
        { mobile },
        {
          last_login: Date.now(),
          otp: 123456,
        },
        { new: true }
      );
    } else {
      const data = await User.findOneAndUpdate(
        { mobile },
        {
          last_login: Date.now(),
          otp: 123456,
        },
        { new: true }
      );
    }

    const payload = {
      mobile: mobile,
    };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "5m" });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Error in login",
      error: err.message,
    });
  }
};

exports.loginCheckOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const tokenOTP = req.header("Authorization").replace("Bearer ", "");

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please Enter OTP",
      });
    }
    if (!tokenOTP) {
      return res.status(400).json({
        success: false,
        message: "Please Send Token",
      });
    }
    const decoded = await jwt.verify(tokenOTP, process.env.JWT_AUTH);

    const mobile = decoded.mobile;

    if (mobile.toString().length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Mobile Number in 10 digits",
      });
    }
    const checkUser = await User.findOne({ mobile });
    const checkCoach = await Coach.findOne({ mobile });

    if (!checkUser && !checkCoach) {
      return res.status(400).json({
        success: false,
        message: "This account is not found",
      });
    }

    if (
      (checkCoach && checkCoach.otp !== otp) ||
      (checkUser && checkUser.otp !== otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Otp not matched",
      });
    }
    let check;
    if (checkUser) {
      check = checkUser;
      await User.findByIdAndUpdate(check._id, {
        otp: "",
      });
    }
    if (checkCoach) {
      check = checkCoach;
      await Coach.findByIdAndUpdate(check._id, {
        otp: "",
      });
    }
    const payload = {
      userID: check._id,
      first_name: check.first_name,
      last_name: check.last_name,
      role: check.role,
    };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "5h" });

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      token,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Error in login-otp",
      error: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions = { role: { $in: ["User", "Venue Admin"] } };

    // Add column-specific search conditions dynamically
    const searchFields = ["first_name", "last_name", "email", "role", "status"];
    searchFields.forEach((field) => {
      if (req.query[field]) {
        if (field === "status") {
          queryConditions[field] = req.query[field] === "true";
        } else {
          queryConditions[field] = new RegExp(req.query[field], "i");
        }
      }
    });

    // Add global search condition
    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryConditions["$or"] = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { email: searchRegex },
      ];
    }

    const users = await User.find(queryConditions).sort({ createdAt: -1 });
    const totalUsers = await User.countDocuments(queryConditions);

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json({
      success: true,
      data: users,
      totalUsers: totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { first_name, last_name, role, email, mobile, password, status } =
      req.body;

    if (!first_name) {
      return res.status(400).json({
        success: false,
        message: "Please Fill the first name",
      });
    }

    if (!last_name) {
      return res.status(400).json({
        success: false,
        message: "Please Fill the last name",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Fill the email",
      });
    }

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Please Fill the mobile number",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please Fil the password",
      });
    }

    const check = await Admin.findOne({ mobile: mobile });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "The User already Exist. Try to login ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const databaseEntry = await Admin.create({
      first_name,
      last_name,
      email,
      mobile,
      password: hashedPassword,
      role,
      status,
    });

    return res.status(200).json({
      success: true,
      message: `saved in database successfully`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `error in storing data of signup! please select the valid role`,
      error: err.message,
    });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });

    if (!admins || admins.length === 0) {
      return res.status(400).json({ message: "No admins found." });
    }

    return res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not found." });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error while fetching admin details." });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty please provide data.",
      });
    }

    const { first_name, last_name, email, mobile, status } = req.body;

    // Validate first name and last name
    const nameRegex = /^[A-Za-z\s]+$/;
    if (first_name && !nameRegex.test(first_name)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "First name must contain characters only.",
        });
    }
    if (last_name && !nameRegex.test(last_name)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Last name must contain characters only.",
        });
    }

    // Validate mobile number to be exactly 10 digits
    if (mobile && mobile.toString().length !== 10) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Mobile number must be exactly 10 digits.",
        });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with the given ID.",
      });
    }

    const updated_first_name = first_name ? first_name : user.first_name;
    const updated_last_name = last_name ? last_name : user.last_name;
    const updated_email = email ? email : user.email;
    const updated_mobile = mobile ? mobile : user.mobile;

    const updated_user = await User.findOneAndUpdate(
      { _id: id },
      {
        first_name: updated_first_name,
        last_name: updated_last_name,
        email: updated_email,
        mobile: updated_mobile,
        status: status,
      },
      { new: true }
    ).exec();

    return res.status(200).json({
      success: true,
      message: `The data of ${user.role} ${first_name} has been updated successfully.`,
      data: updated_user,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};

exports.dashboardCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const venueCount = await Venue1.countDocuments();
    const eventCount = await Category.countDocuments();

    return res.status(200).json({
      userCount: userCount,
      venueCount: venueCount,
      eventCount: eventCount,
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({ message: "Failed to fetch user count" });
  }
};

exports.getUsersCountPerMonth = async (req, res) => {
  try {
    const usersPerMonth = await User.aggregate([
      {
        $project: {
          month: { $month: "$registrationDate" },
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const response = {};
    usersPerMonth.forEach((monthData) => {
      const monthName = new Date(0, monthData._id - 1).toLocaleString(
        "default",
        { month: "long" }
      );
      response[monthName] = monthData.count;
    });

    return res.json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Failed to fetch data" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const checkUser = await User.findByIdAndUpdate(id, {
      status: false,
    });
    const checkCoach = await Coach.findByIdAndUpdate(id, {
      status: false,
    });
    if (!checkUser && !checkCoach) {
      return res.status(400).json({
        success: false,
        message: "The user is not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "The user is deactivated now",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const checkUser = await User.findById(id);
    const checkCoach = await Coach.findById(id);

    if (!checkUser && !checkCoach) {
      return res.status(400).json({
        success: false,
        message: "User Does Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: checkCoach || checkUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    let uploadedFiles;
    if (
      Array.isArray(req.files.uploadFile) &&
      req.files.uploadFile.length > 0
    ) {
      uploadedFiles = req.files.uploadFile.map((file) => {
        const modifiedSrc = `/uploads/${req.body.types}/${path.basename(
          file.path
        )}`;
        return {
          src: modifiedSrc.replace(/\\/g, "/"),
          fileName: file.mimetype,
          orgname: file.originalname,
        };
      });
    }

    res.status(200).json({
      file_data: uploadedFiles || [],
      status: true,
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ msg: "Please provide a search term" });
    }

    const searchRegex = new RegExp(search, "i");
    const queryConditions = [
      { first_name: searchRegex },
      { last_name: searchRegex },
      { email: searchRegex },
    ];

    // Only add mobile search if search is numeric
    if (!isNaN(search)) {
      queryConditions.push({ mobile: search });
    }

    // Validate and add _id search if search is a valid ObjectId
    if (mongoose.isValidObjectId(search)) {
      queryConditions.push({ _id: search });
    }

    const users = await User.find({ $or: queryConditions });

    if (users.length === 0) {
      return res.status(404).json({ msg: "No matching records found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error searching for users", error: error.message });
  }
};
