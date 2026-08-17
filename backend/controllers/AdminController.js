const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../helper/bhashMessaging");
const jwt = require("jsonwebtoken");
const message = require("../config/message");
const Admin = require("../models/AdminModel");
const PersonalTrainer = require("../models/PersonalTrainingModel");
const Venue1 = require("../models/Venue1");
const Category = require("../models/CategoryModel");
const signupVerifyOTP = require("../models/SignUpVerifyOTPModel");
require("dotenv").config();
const Coach = require("../models/CoachModel");
const mongoose = require("mongoose");
const path = require("path");
const mail = require("../helper/sendMail");
const mailContent = require("../middlewares/mail-content");
const { find } = require("../models/BookingModel");
const JWT_SECRET = process.env.JWT_AUTH;
const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const blogModel = require('../models/BlogModel');
const Event = require('../models/EventModel');
//signup By SuperADmin
exports.signupBySuperAdmin = async (req, res) => {
  try {
    if (req.user?.role !== "Super Admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }
    const { first_name, last_name, role, mobile, email, password } = req.body;

    // Validation
    let validationErrors = [];
    if (!first_name) {
      validationErrors.push("First name is required");
    } else if (!/^[a-zA-Z ]+$/.test(first_name)) {
      validationErrors.push("First name should contain only characters");
    }

    if (!last_name) {
      validationErrors.push("Last name is required");
    } else if (!/^[a-zA-Z ]+$/.test(last_name)) {
      validationErrors.push("Last name should contain only characters");
    }

    if (!mobile || mobile.toString().length !== 10) {
      validationErrors.push("Mobile number must be 10 digits");
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      validationErrors.push("A valid email is required");
    }

    // Check for validation errors
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    // Check if email or mobile already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      const duplicateFields = [];
      if (existingUser.email === email) duplicateFields.push("Email");
      if (existingUser.mobile === mobile) duplicateFields.push("Mobile number");

      return res.status(400).json({
        success: false,
        message: `${duplicateFields.join(" and ")} already exists. Try to login.`,
      });
    }

    // Generate a hashed password
    const defaultPassword = password || "1234";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check roles for admin access
    const adminRoles = ["Venue Admin", "Coach", "Personal Trainer"];
    const isAdminAccess = adminRoles.includes(role) ? 1 : 0;

    // User creation
   // User data
   const userData = {
    first_name,
    last_name,
    email,
    mobile,
    role: role || "User",
    password: hashedPassword,
    is_admin_access: isAdminAccess,
  };

  // Save user in User collection
  const newUser = await User.create(userData)
 // Save in specific collections based on role
 if (role === "Coach") {
  const coachData = new Coach(userData);
  await coachData.save();
} else if (role === "Personal Trainer") {
  const personalTrainerData = new PersonalTrainer(userData);
  await personalTrainerData.save();
}
    // Send email notification
    const emailContent = mailContent.super_admin_add_user_venue_admin(
      first_name,
      last_name,
      mobile,
      email,
      defaultPassword,
      role || "User"
    );

    await mail.superAdminAddUsersendEmail(email, emailContent);

    // After registration, send coach/trainer an onboarding email + SMS with a link to complete their profile
    if (role === "Coach" || role === "Personal Trainer") {
      try {
        const completionToken = require("crypto").randomBytes(12).toString("hex");
        const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
        const completeLink =
          role === "Coach"
            ? `${baseUrl}/coaches/complete-profile/${newUser._id}?token=${completionToken}`
            : `${baseUrl}/personal-training/complete-profile/${newUser._id}?token=${completionToken}`;
        await mail.superAdminAddUsersendEmail(
          email,
          mailContent.onboarding_profile_link(`${first_name} ${last_name}`.trim(), completeLink)
        );
        try {
          const { sendCustomMessage } = require("../helper/bhashMessaging");
          const msg = `Dear ${first_name}, welcome to Khelo Indore! Complete your ${role === "Coach" ? "coach" : "trainer"} profile here: ${completeLink}`.slice(0, 160);
          await sendCustomMessage({ mobile: String(mobile), message: msg });
        } catch (smsErr) {
          
        }
        if (role === "Coach") {
          await Coach.findByIdAndUpdate(newUser._id, { profile_completion_token: completionToken });
        } else {
          await PersonalTrainer.findByIdAndUpdate(newUser._id, { profile_completion_token: completionToken });
        }
      } catch (onboardErr) {
        
      }
    }

    // Response
    return res.status(200).json({
      success: true,
      message: `User registered successfully by Super Admin as ${role || "User"}. An email has been sent to ${email}.`,
      data: {
        id: newUser._id,
        first_name,
        last_name,
        email,
        mobile,
        role,
      },
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { first_name, last_name, role, mobile, email, password, confirm_password } = req.body;

    // Validate required fields
    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required and cannot be empty.",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }

    if (!mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and email are required fields.",
      });
    }

    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Prepare user data
    const userData = {
      first_name,
      last_name,
      role,
      mobile,
      email,
      otp,
      password: hashedPassword,    
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ mobile }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "The user already exists. Try to log in.",
      });
    }

 
   
   

    // Save data in the respective role-specific table
    let roleSpecificId;
    const userDataWithAccess = { ...userData, is_admin_access: 1 };
    if (role === "Coach") {
      const newUser = new User(userDataWithAccess);
      const savedUser = await newUser.save();
      const coach = new Coach(userDataWithAccess);
      const savedCoach = await coach.save();
      roleSpecificId = savedCoach._id;
    } else if (role === "Personal Trainer") {
      const newUser = new User(userDataWithAccess);
      const savedUser = await newUser.save();
      const personalTrainer = new PersonalTrainer(userDataWithAccess);
      const savedTrainer = await personalTrainer.save();
      roleSpecificId = savedTrainer._id;
    } else if (role === "Venue Admin") {
      const newUser = new User(userDataWithAccess);
      const savedUser = await newUser.save();
      roleSpecificId = savedUser._id;
    } else if (role === "User") {     // Save or update user data for verification
    await signupVerifyOTP.findOneAndUpdate(
      { $or: [{ mobile }, { email }] },
      userData,
      { new: true, upsert: true }
    );
    }
    // Check for Venue Admin role
    if (["Venue Admin", "Coach", "Personal Trainer"].includes(role)) {
      // Notify Super Admin for approval (can send email, create a notification, etc.)  
      const superAdminEmail = process.env.SUPER_ADMIN_EMAIL; // Ensure SUPER_ADMIN_EMAIL is set in your environment
      const approvalLink = `https://kheloindore.in/admin/approve-coach-trainer/${roleSpecificId}`; // Approval link // Example approval link

      // Send email to super admin for approval (simplified email example)
      req.body.mail = {
        // senderEmail: process.env.EMAIL_ID,
        senderEmail: process.env.SMTP_USER, // Use configured email as sender
        senderName: "Admin KheloIndore",
        recipientEmail: superAdminEmail,
        subject: `${role} Approval Pending`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; padding: 20px; background-color: #ff5f15; color: #fff;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; margin: 0;">KheloIndore - Approval Request</h1>
        </div>
      
        <!-- Content Section -->
        <table style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
          <thead style="text-align: center;">
          </thead>
          <tbody>
            <tr>
              <td style="padding: 20px;">
                <p style="font-size: 16px;">Dear Super Admin,</p>
                <p style="font-size: 14px; line-height: 1.8;">
                  A new registration request has been submitted for the role of <strong>${role}</strong>. 
                  Please review the following details:
                </p>
                <ul style="font-size: 14px; margin: 15px 0; padding-left: 20px;">
                  <li><strong>Name:</strong> ${first_name} ${last_name}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Mobile:</strong> ${mobile}</li>
                </ul>
                <p style="font-size: 14px;">
                  To approve or deny this request, kindly <a href=${approvalLink} style="color: #ff5f15; text-decoration: none;">click here</a> or log in to your admin panel.
                </p>
                <p style="font-size: 14px;">For further assistance, feel free to contact the support team.</p>
                <p style="font-size: 16px; font-weight: bold;">Thank you,</p>
                <p style="font-size: 14px;">Team<br>KheloIndore</p>
              </td>
            </tr>
          </tbody>
          <tfoot style="background-color: #f9f9f9; text-align: center; padding: 15px;">
            <tr>
              <td style="font-size: 12px; color: #888;">
                This email was sent from KheloIndore. Please do not reply to this email. For support, contact us at 
                <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>`,
          resData: { message: `Registration successful! You can now log in to the admin panel to manage your profile and list your services.` },
      };

      // Send welcome email to newly registered partner
      try {
        const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px; color: #fff;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; margin: 0; color: #fff;">Welcome to KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${first_name} ${last_name},</p>
          <p style="font-size: 14px; line-height: 1.8;">
            Thank you for registering as a <strong>${role}</strong> on KheloIndore! We are thrilled to welcome you to our partner network.
          </p>
          <p style="font-size: 14px; line-height: 1.8;">
            Your registration request has been submitted and your account is active. You can now log in to the admin dashboard using the following link:
          </p>
          <p style="text-align: center; margin: 25px 0;">
            <a href="https://kheloindore.in/admin" style="background-color: #ff5f15; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;">Log In to Partner Dashboard</a>
          </p>
          <p style="font-size: 14px; line-height: 1.8;">
            Once logged in, you can complete your profile details and set up your listing so clients can find and book your services.
          </p>
          <p style="font-size: 14px; line-height: 1.8;">
            If you have any questions or need any assistance setting up your listing, please visit <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a> to reach our support team.
          </p>
          <br>
          <p style="font-size: 16px; font-weight: bold; margin: 0;">Best Regards,</p>
          <p style="font-size: 14px; margin: 0;">Team KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 15px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
        </div>
      </div>
        `;
        await mail.sendEmailConfirm({
          recipientEmail: email,
          subject: `Welcome to KheloIndore - ${role} Registration`,
          html: welcomeHtml,
        });
      } catch (emailErr) {
        console.error("Partner welcome email failed to send:", emailErr.message || emailErr);
      }

      // Call next() to send the email to Super Admin
      next();
      return;
    }

    // Generate JWT token for non-Venue Admin users
    const payload = { mobile, email, role };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "5m" });

    // Prepare OTP verification email for the user
    req.body.mail = {
      senderEmail: process.env.SMTP_USER,
      senderName: "Admin KheloIndore",
      recipientEmail: email,
      subject: "User Verification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${first_name} ${last_name},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            We have received a request to verify your email address for your KheloIndore account. Use the One-Time Password (OTP) below to complete the verification process:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 15px 30px; font-size: 18px; font-weight: bold; color: #ff5f15; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px;">
            This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            For any assistance, please contact-us 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>

`,
      resData: {
        message: "Your OTP has been sent successfully.",
        token,
      },
    };

    try {
      const delivery = await sendOtp({ mobile, otp });
      req.body.mail.resData.deliveryChannels = delivery.delivered;
    } catch (deliveryError) {
      
      return res.status(502).json({
        success: false,
        message: "Unable to send OTP right now. Please try again.",
      });
    }

    // Retain the existing email notification after BhashSMS delivery.
    next();
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Error in storing data of signup!",
      error: err.message,
    });
  }
};

exports.signupVerifyOTP = async (req, res, next) => {
  try {
    const { otp, password } = req.body;
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_AUTH);
    const { mobile } = decoded;

    // Find the user in the `signupVerifyOTP` collection
    const user = await signupVerifyOTP.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register again.",
      });
    }

    // Validate OTP if provided
    if (otp && user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    if (password && !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Password does not match. Please enter the correct password.",
      });
    }

    // Hash the password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Create new user in respective collection
    let newUser;
    if (user.role === "Coach") {
      newUser = await Coach.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        email: user.email,
        is_admin_access: 1,
        status: true,
        verification_status: 0,
      });
      await User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        email: user.email,
        is_admin_access: 1,
        status: true,
      });
    } else if (user.role === "Personal Trainer") {
      newUser = await PersonalTrainer.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        email: user.email,
        is_admin_access: 1,
        status: true,
        verification_status: 0,
      });
      await User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        email: user.email,
        is_admin_access: 1,
        status: true,
      });
    } else {
      newUser = await User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        password: user.password,
        role: user.role,
        email: user.email,
        is_admin_access: ["Venue Admin", "Coach", "Personal Trainer"].includes(user.role) ? 1 : 0,
        status: true,
      });
    }

    // Delete the OTP verification entry from the database
    await signupVerifyOTP.findByIdAndDelete(user._id);

    // Prepare email content
    if (user.role === "Venue Admin") {
      req.body.mail = {
        senderEmail: process.env.SMTP_USER, // Use configured email as sender
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Venue Admin Registration",
        html: `      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">Welcome to KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p>We are pleased to inform you that your registration as a Venue Admin has been successfully processed.</p>
          <p><strong>Mobile Number:</strong> ${user.mobile}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p>You can now log in to your admin dashboard using the following link:</p>
          <p>
            <a href="https://kheloindore.in/admin" style="color: #ff5f15; text-decoration: none;">Admin Dashboard</a>
          </p>
          <p>If you have any questions or need assistance, please feel free to reach out to our support team.</p>
          <p>Thank you for joining the KheloIndore team!</p>
          <br>
          <p style="color: "black"><strong>Best Regards,</strong><br></p>
          <p>Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
`,
        resData: { message: "Registration successful. A confirmation email has been sent to your registered email address." },

      };
    } else {
      req.body.mail = {
        senderEmail: process.env.SMTP_USER, // Use configured email as sender
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Welcome to KheloIndore",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">Welcome to KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px">Dear ${user.first_name} ${user.last_name}</p>
          <p style="font-size: 16px;">We are excited to have you as part of the KheloIndore community! Your registration has been successfully completed, and we look forward to providing you with an exceptional experience.</p>
          <p><strong>Mobile Number:</strong> ${user.mobile}</p>
          <p style="font-size: 16px;">To get started, please <a href="https://kheloindore.in" style="color: #ff5f15; text-decoration: none; font-weight: bold;">click here</a> to access your account on the KheloIndore portal.</p>
          
          <p style="font-size: 16px;">If you have any questions or need assistance, our support team is available to help. Please don't hesitate to reach out to us at <a href="https://kheloindore.in/contact-us" style="color: #ff5f15;">kheloindore.in</a>.</p>         
          <p style="font-size: 16px;">Thank you for choosing KheloIndore. We are thrilled to have you on board!</p>
          
          <br>
          <p style="color: "black"><strong>Best Regards,</strong><br></p>
          <p>Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
`,
      resData: { message: "Welcome! Your registration is successful, and a welcome email has been sent to your inbox." },
      };
    }

    // Call next middleware for email sending
    next();
  } catch (err) {
    
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginWithPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check if mobile and password are provided
    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide mobile number and password."
      });
    }

    const mobileNum = Number(mobile);

    // Find user in all roles
    let user = await PersonalTrainer.findOne({ mobile: mobileNum }) || 
               await Coach.findOne({ mobile: mobileNum }) || 
               await User.findOne({ mobile: mobileNum }) ||
               await PersonalTrainer.findOne({ mobile }) || 
               await Coach.findOne({ mobile }) || 
               await User.findOne({ mobile });

              //  let user = await User.findOne({ mobile }) || 
              //  await Coach.findOne({ mobile }) || 
              //  await PersonalTrainer.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The mobile number provided does not match any registered user."
      });
    }

    if (user.status === false && user.is_admin_access === 2) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated or rejected. Please contact the administrator."
      });
    }
    // Block only if explicitly deactivated/rejected by Super Admin (is_admin_access === 2)
    if (user.is_admin_access === 2) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Your account has been deactivated or rejected by the administrator."
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "No password set for this account. Please log in using OTP or set a password."
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
    }

    // Generate JWT token
    const payload = {
      userID: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "1d" });

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: token,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error trace:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login. Please try again later.",
      error: error.message,
    });
  }
};

exports.loginUserWithMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Mobile Number",
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

    let checkUser = await User.findOne({ mobile });
    let checkCoach = await Coach.findOne({ mobile });

    // If user does not exist, create new account automatically
    if (!checkUser && !checkCoach) {
      checkUser = await User.create({
        first_name: "User",
        last_name: "",
        mobile: mobile,
        role: "User",
        status: true,
        otp: otp,
      });
    }

    if (checkUser && checkUser.status === false && (checkUser.role === "User" || checkUser.is_admin_access === 2)) {
      return res.json({
        status: 400,
        success: false,
        message: "You are not active, please contact admin",
      });
    }

    if (checkCoach && checkCoach.status === false && checkCoach.is_admin_access === 2) {
      return res.json({
        status: 400,
        success: false,
        message: "You are not active, please contact admin",
      });
    }

    if (checkCoach) {
      await Coach.findOneAndUpdate(
        { mobile },
        {
          last_login: Date.now(),
          otp: otp,
        },
        { new: true }
      );
    } else {
      await User.findOneAndUpdate(
        { mobile },
        {
          last_login: Date.now(),
          otp: otp,
        },
        { new: true }
      );
    }

    const payload = {
      mobile: mobile,
      role: checkCoach ? checkCoach.role : (checkUser ? (checkUser.role === "Venue Admin" ? "User" : checkUser.role) : "User"),
    };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "5m" });

    let delivery;
    try {
      delivery = await sendOtp({ mobile, otp });
    } catch (deliveryError) {
      
      return res.status(502).json({
        success: false,
        message: "Unable to send OTP right now. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token,
      deliveryChannels: delivery.delivered,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Error in login",
      error: err.message,
    });
  }
};

exports.loginCheckOTP = async (req, res) => {
  try {
    const { otp, password, mobile } = req.body;
    const tokenOTP = req.header("Authorization")?.replace("Bearer ", "");

    if (!mobile || mobile.toString().length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number.",
      });
    }

    const checkUser = await User.findOne({ mobile });
    const checkCoach = await Coach.findOne({ mobile });

    if (!checkUser && !checkCoach) {
      return res.status(400).json({
        success: false,
        message: "Account not found.",
      });
    }

    let user = checkUser || checkCoach;

    // If OTP is provided, validate OTP
    if (otp) {
      if (!tokenOTP) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid token.",
        });
      }

      const decoded = await jwt.verify(tokenOTP, process.env.JWT_AUTH);

      if (decoded.mobile !== mobile) {
        return res.status(400).json({
          success: false,
          message: "Invalid token or mobile number mismatch.",
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP.",
        });
      }

      // Clear OTP after successful login
      user.otp = "";
      await user.save();
    }

    // If password is provided, validate password
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password.",
        });
      }
    }

    // If neither OTP nor password is provided
    if (!otp && !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide either OTP or password to log in.",
      });
    }

    // Check if profile is completed
    const isProfileCompleted = Boolean(user.first_name && user.last_name && user.email);

    // Generate JWT token
    const payload = {
      userID: user._id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role === "Venue Admin" ? "User" : (user.role || "User"),
      profileCompleted: isProfileCompleted,
    };
    const token = jwt.sign(payload, process.env.JWT_AUTH, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      profileCompleted: isProfileCompleted,
      user: {
        _id: user._id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        mobile: user.mobile,
      },
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Error during login.",
      error: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    let page = parseInt(req.query.page) ||1
    let limit = parseInt(req.query.limit) ||10
  
    if(req.user.role == "Venue Admin" || req.user.role == "Coach"){
      const id = user;
      const checkUser = await User.findById(id);
      const checkCoach = await Coach.findById(id);
  
      if (!checkUser && !checkCoach) {
        return res.status(400).json({
          success: false,
          message: "User Does Not Found",
        });
      }
      const userData = [checkCoach || checkUser];
      return res.status(200).json({
        success: true,
        data: userData,
      });
    }
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
        { role: searchRegex }
      ];
    }

    const users = await User.find(queryConditions).sort({ createdAt: -1 }).skip((page-1)*1).limit(limit);
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
        message: "Request body is empty. Please provide data.",
      });
    }

    const { first_name, last_name, email, mobile, status, zipcode, state,stateId, city, address,user_info,is_admin_access } = req.body;

    // Validate first name and last name
    const nameRegex = /^[A-Za-z\s]+$/;
    if (first_name && !nameRegex.test(first_name)) {
      return res.status(400).json({
        success: false,
        message: "First name must contain characters only.",
      });
    }
    if (last_name && !nameRegex.test(last_name)) {
      return res.status(400).json({
        success: false,
        message: "Last name must contain characters only.",
      });
    }

    // Validate mobile number to be exactly 10 digits
    if (mobile && mobile.toString().length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits.",
      });
    }

    // Validate zipcode (example validation for a 5-digit zipcode)
    if (zipcode && !/^\d{6}$/.test(zipcode)) {
      return res.status(400).json({
        success: false,
        message: "Zipcode must be exactly 6 digits.",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with the given ID.",
      });
    }

    // Update fields if provided, otherwise keep the existing user data
    const updated_first_name = first_name ? first_name : user.first_name;
    const updated_last_name = last_name ? last_name : user.last_name;
    const updated_email = email ? email : user.email;
    const updated_mobile = mobile ? mobile : user.mobile;
    const updated_status = status !== undefined ? status : user.status;
    const updated_zipcode = zipcode ? zipcode : user.zipcode;
    const updated_state = state ? state : user.state;
    const updated_city = city ? city : user.city;
    const updated_address = address ? address : user.address;
    const updated_user_info = user_info ? user_info : user.user_info;
    const updated_stateId =stateId ? stateId : user.stateId;
    const updated_user = await User.findOneAndUpdate(
      { _id: id },
      {
        first_name: updated_first_name,
        last_name: updated_last_name,
        status: updated_status,
        zipcode: updated_zipcode,
        state: updated_state,
        city: updated_city,
        address: updated_address,
        user_info: updated_user_info,
        stateId:updated_stateId,
      },
      { new: true }
    ).exec();

    return res.status(200).json({
      success: true,
      message: `The data of ${user.role} ${first_name} has been updated successfully.`,
      data: updated_user,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};

exports.aadashboardCount = async (req, res) => {
  try {
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    
    const userCount = await User.countDocuments();
    const venueCount = await Venue1.countDocuments();
    const eventCount = await Category.countDocuments();

    return res.status(200).json({
      userCount: userCount,
      venueCount: venueCount,
      eventCount: eventCount,
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to fetch user count" });
  }
};
exports.dashboardCount = async (req, res) => {
  try {
    const userId = req.user?.userID;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }
    const personalTrainerBookingCount = await PersonalTrainerBooking.countDocuments({
      pt_id: { $exists: true, $ne: null },
      user_id: { $exists: true, $ne: null },
    });
    const [userCount, coachCount, venueAdminCount, personalTrainerCount, venueCount,
      bookingCount, coachBookingCount, blogCount, eventCount] = await Promise.all([
      User.countDocuments({ role: "User" }), // Count users with role "User"
      Coach.countDocuments(), // Count coaches from Coach schema
      User.countDocuments({ role: "Venue Admin" }), // Count venue admins from User schema
      PersonalTrainer.countDocuments({ role: "Personal Trainer" }), // Count personal trainers from PersonalTrainer schema
      Venue1.countDocuments(), // Count venues from Venue1 schema
      Booking.countDocuments(), // Count all bookings
      CoachBooking.countDocuments(), // Count all coach bookings
      PersonalTrainerBooking.countDocuments(), // Count all personal trainer bookings
      blogModel.countDocuments({ blog_title: { $exists: true, $ne: null } }),
      Event.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
    data:{  userCount,
      coachCount,
      venueAdminCount,
      personalTrainerCount,
      venueCount,
      blogCount,
      eventCount,
      totalBookingCount: bookingCount + coachBookingCount + personalTrainerBookingCount,
      bookingDetails: {
        generalBookings: bookingCount,
        coachBookings: coachBookingCount,
        personalTrainerBookings: personalTrainerBookingCount,
      },
    },
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
      error: error.message,
    });
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
    const checkTrainer = await PersonalTrainer.findByIdAndUpdate(id, {
      status: false,
    });

    if (!checkUser && !checkCoach && !checkTrainer) {
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
      // Validate the ID format
      if (!id || id.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "User ID is required and cannot be empty.",
        });
      }
        // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }
    const checkUser = await User.findById(id);
    const checkCoach = await Coach.findById(id);
    const checkPersonalTrainer = await PersonalTrainer.findById(id);
    // If no user is found in either collection, return an error
    if (!checkUser && !checkCoach && !checkPersonalTrainer) {
      return res.status(400).json({
        success: false,
        message: "User not found in any collection (User, Coach, Personal Trainer).",
      });
    }
    return res.status(200).json({
      success: true,
      data: checkCoach || checkUser || checkPersonalTrainer,
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

 if (!req.files || !req.files.uploadFile) {
  return res.status(400).json({
    status: false,
    message: "No files were uploaded. Please attach files to upload.",
  });
}

if (!Array.isArray(req.files.uploadFile) || req.files.uploadFile.length === 0) {
  return res.status(400).json({
    status: false,
    message: "Invalid file format or no files provided.",
  });
}

    let uploadedFiles;
    
    if (
      Array.isArray(req.files.uploadFile) &&
      req.files.uploadFile.length > 0
    ) {
      uploadedFiles = req.files.uploadFile.map((file) => {
        const modifiedSrc = `/uploads/${req.query.types}/${path.basename(
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
    
    res
      .status(500)
      .json({ msg: "Error searching for users", error: error.message });
  }
};

exports.codeAndCocktailsEmail = async (req, res) => {
  if (!req.body.name) {
    return res.send({
      success: false,
      message: "Please enter your name.",
    });
  }
  if (!req.body.mobile) {
    return res.send({
      success: false,
      message: "Please enter your mobile number.",
    });
  }
  try {
    const AUTH_TOKEN = process.env.CODE_COCKTAILS_AUTH_TOKEN || "Swapac_Infotech_PVT_LTD";
    const token = req.headers.authorization;
    if (!token || token !== AUTH_TOKEN) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Unauthorized request.",
      });
    }
    const { name, mobile, noOfGuest } = req.body; 
    let subject = "Code and Cocktails Party: Guest Details Submission"; 
    let message = `
    <h3>Guest Details</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Mobile Number:</strong> ${mobile}</p>
    <p><strong>Total Number of Guests:</strong> ${noOfGuest}</p>`;

    const recipients = "chandan@swapinfotech.com, hr@swapacinfotech.com, hra@swapacinfotech.com, hrd@swapacinfotech.com";

    mail.sendEmailForSwap(
      recipients,
      subject, 
      message,
    ); 
    return res.status(200).json({
      success: true, 
      message: 'Thank you'
    })
  } catch (error) {
    
    return res.status(500).json({
      success: false, 
      message: error.message
    }); 
  }
}; 

exports.updateProfileSettting = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty. Please provide data to update.",
      });
    }

    const {
      first_name,
      last_name,
      email,
      address,
      city,
      state,
      zipcode,
      user_info,
      status,
      profile_image,
    } = req.body;

    // Validate zipcode (optional: must be a positive integer)
    if (zipcode && (isNaN(zipcode) || zipcode <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Zipcode must be a valid positive number.",
      });
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with the given ID.",
      });
    }

    // Define fields allowed for updates
    const updates = {
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      email: email || user.email,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      zipcode: zipcode || user.zipcode,
      user_info: user_info || user.user_info,
      status: status !== undefined ? status : user.status, // Preserve existing status if not explicitly updated
      profile_image:profile_image || user.profile_image
    };

    // Update the user
    const updated_user = await User.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
    }).exec();

    return res.status(200).json({
      success: true,
      message: "User information has been updated successfully.",
      data: updated_user,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};

exports.updateAdminStatus = async (req, res) => {
  try {
    const { id, is_admin_access, role } = req.body;

    if (!id || is_admin_access === undefined || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide id, is_admin_access, and role.",
      });
    }

    if (req.user.role !== "Super Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admins can update admin access.",
      });
    }

    // Variables to track the user being updated
    let updatedUser, userToSendCredentials;

    if (role === "Venue Admin") {
      updatedUser = await User.findById(id);
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "Venue Admin not found." });
      }
      updatedUser.is_admin_access = is_admin_access;
      await updatedUser.save();
      userToSendCredentials = updatedUser;
    } else if (role === "Coach") {
      const coach = await Coach.findById(id);
      if (!coach) {
        return res.status(404).json({ success: false, message: "Coach not found." });
      }
      coach.is_admin_access = is_admin_access;
      await coach.save();

      const user = await User.findOne({ mobile: coach.mobile });
      if (!user) {
        return res.status(404).json({ success: false, message: "Linked User not found for the Coach." });
      }
      user.is_admin_access = is_admin_access;
      await user.save();
      updatedUser = user;
      userToSendCredentials = user;
    } else if (role === "Personal Trainer") {
      const personalTrainer = await PersonalTrainer.findById(id);
      if (!personalTrainer) {
        return res.status(404).json({ success: false, message: "Personal Trainer not found." });
      }
      personalTrainer.is_admin_access = is_admin_access;
      await personalTrainer.save();

      const user = await User.findOne({ mobile: personalTrainer.mobile });
      if (!user) {
        return res.status(404).json({ success: false, message: "Linked User not found for the Personal Trainer." });
      }
      user.is_admin_access = is_admin_access;
      await user.save();
      updatedUser = user;
      userToSendCredentials = personalTrainer;
    } else {
      return res.status(400).json({ success: false, message: "Invalid role provided." });
    }

    // Email content for admin access approval or denial
    const subject =
      is_admin_access === 1 ? "Admin Access Approved" : "Admin Access Status Updated";
    const htmlContent =
      is_admin_access === 1
        ? `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${userToSendCredentials.first_name} ${userToSendCredentials.last_name},</p>
          <p style="font-size: 14px;">Congratulations! Your admin access request for the role of <strong>${role}</strong> has been approved.</p>
          <p style="font-size: 14px;">You now have full access to manage ${role} related tasks on the platform.</p>
          <p style="font-size: 14px;">
            You can log in at 
              <ul>
              <li style="font-size: 14px;"><strong>Mobile:</strong> ${userToSendCredentials.mobile}</li>
              <li style="font-size: 14px;"><strong>Password:</strong> ${userToSendCredentials.demo_password || "N/A"}</li>
            </ul>
            <a href="https://kheloindore.in/admin" target="_blank" style="color: #ff5f15; text-decoration: none;">kheloindore.in/admin</a> 
            to access your account.
          </p>
          <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
          <p style="font-size: 14px;">Team<br>KheloIndore</p>
        </div>
      
        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
          <p style="margin: 0;">
            For support, contact us at 
            <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
          </p>
        </div>
      </div>
`
      : `
        <div style="display: flex; justify-content: center; align-items: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background-color: #fff;">

      <!-- Header Section -->
      <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
        <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
        <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
      </div>

      <!-- Content Section -->
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Dear ${userToSendCredentials.first_name} ${userToSendCredentials.last_name},</p>
        <p style="font-size: 14px; margin: 15px 0;">
          Your admin access request for the role of <strong>${role}</strong> has been updated. Unfortunately, it has not been approved.
        </p>
        <p style="font-size: 14px; margin: 15px 0;">
          If you have any questions or need further assistance, feel free to reach out at 
          <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
        </p>
        <p style="font-size: 16px; font-weight: bold; margin: 20px 0;">Best Regards,</p>
        <p style="font-size: 14px;">Team<br>KheloIndore</p>
      </div>

      <!-- Footer Section -->
      <div style="background-color: #f9f9f9; padding: 10px 20px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">This email was sent by KheloIndore. Please do not reply to this email.</p>
        <p style="margin: 0;">
          For support, contact us at 
          <a href="https://kheloindore.in/contact-us" style="color: #ff5f15; text-decoration: none;">kheloindore.in</a>.
        </p>
      </div>
      
    </div>
  </div>
`;

    // Send the email
    
    await mail.sendVenuAdminConfirmation({
      senderEmail: process.env.SMTP_USER, // Use configured email as sender
      senderName: "Admin KheloIndore",
      recipientEmail: userToSendCredentials.email,
      subject,
      html: htmlContent,
    });

    // Set demo_password to null after sending credentials
    // if (is_admin_access === 1 && userToSendCredentials.demo_password) {
    //   userToSendCredentials.demo_password = null;
    //   await userToSendCredentials.save();
    // }

    res.status(200).json({
      success: true,
      message: `Admin access updated successfully to ${is_admin_access}.`,
      user: {
        id: updatedUser._id,
        name: `${updatedUser.first_name} ${updatedUser.last_name}`,
        is_admin_access: updatedUser.is_admin_access,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update admin access.",
      error: error.message,
    });
  }
};

exports.userlist = async (req, res) => {
  try {
    if (req.user.role !== "Super Admin") {
      return res.status(400).json({
        success: false,
        message: "Access denied. Only Super Admins can fetch list.",
      });
    }

    const { search } = req.query; 
    const searchFilter = {};

    if (search) {
      const isNumber = !isNaN(search); // Check if the search input is numeric

      searchFilter.$or = [
        { first_name: { $regex: search, $options: "i" } }, // Case-insensitive search
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

      if (isNumber) {
        searchFilter.$or.push({
          $expr: { 
            $regexMatch: { 
              input: { $toString: "$mobile" }, // Convert mobile to string
              regex: search, 
              options: "i" 
            }
          }
        });
      }
    }

    const users = await User.find({ role: 'User', ...searchFilter }).sort({ createdAt: -1 });
    const count = await User.countDocuments({ role: 'User', ...searchFilter });

    return res.status(200).json({
      success: true,
      message: 'User list fetched successfully',
      count: count, 
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user list',
      error: error.message,
    });
  }
};

exports.venueAdminlist = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.userID;
    let users;
    let count;

    const { search } = req.query; 
    const searchFilter = {};

    // If a search term is provided, construct search filter
    if (search) {
      const isNumber = !isNaN(search); 
      searchFilter.$or = [
        { first_name: { $regex: search, $options: "i" } }, 
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

      if (isNumber) {
        searchFilter.$or.push({
          $expr: { 
            $regexMatch: { 
              input: { $toString: "$mobile" }, 
              regex: search, 
              options: "i" 
            }
          }
        });
      }
    }

    // If user is Super Admin, fetch all Venue Admins
    if (userRole === "Super Admin") {
      users = await User.find({ role: 'Venue Admin', ...searchFilter }).sort({ createdAt: -1 });
      count = await User.countDocuments({ role: 'Venue Admin', ...searchFilter });
    }
    // If user is Venue Admin, fetch only their own data
    else if (userRole === "Venue Admin") {
      users = await User.find({ _id: userId, role: 'Venue Admin', ...searchFilter }).sort({ createdAt: -1 });
      count = await User.countDocuments({ _id: userId, role: 'Venue Admin', ...searchFilter });
    }
    // If role is neither Super Admin nor Venue Admin, return an error
    else {
      return res.status(400).json({
        success: false,
        message: "Access denied. Invalid role.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${userRole} fetched the list successfully.`,
      count: count,
      data: users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching venue admin list',
      error: error.message,
    });
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "Super Admin") {
      return res.status(400).json({
        success: false,
        message: "Access denied. Only Super Admins can fetch the list."
      });
    }
const {search} = req.query;
const searchFilter = {}
if(search){
  const isNumber = !isNaN(search)
  searchFilter.$or = [
    {first_name:{$regex:search,$options:"i"}},
    {last_name:{$regex:search,$options:"i"}},
    {email:{$regex:search,$options:"i"}},
  ]


  if (isNumber) {
    searchFilter.$or.push({
      $expr: { 
        $regexMatch: { 
          input: { $toString: "$mobile" }, // Convert mobile to string
          regex: search, 
          options: "i" 
        }
      }
    });
  }
}

    // Fetch all users and count
    const users = await User.find({...searchFilter}).sort({ createdAt: -1 });
    const count = await User.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'All user data fetched successfully',
      count: count, // Include total user count
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching all user data',
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    
    const { email } = req.body;

    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    user.otp = otp; // Store OTP in the user document
    await user.save(); 
    // Generate JWT token with email only (OTP stays server-side in the DB)
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10m" });

    // Generate email content
    const html = mailContent.generateResetPasswordMailContent(
      user.first_name,
      user.last_name,
      otp // Use the generated OTP
    );

    // Send the email
    await mail.generateResetPasswordMailContent(user.email, html);

    // Return success response
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      token, // Send the token to the client for further verification
    });
  } catch (error) {
    
    res.status(500).json({success: false, message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body; // OTP from the client

    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer token' format

    // Check if the token is provided
    if (!token || !otp) {
      return res.status(400).json({ message: "Token and OTP are required" });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    const { email } = decoded; // Extract email from the decoded token

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP provided by the user matches the stored OTP
    if (!user.otp || otp !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP validation success, you can proceed to reset password or any other operation
    res.status(200).json({success: true, message: "OTP verified successfully" });
  } catch (error) {
    
    res.status(500).json({success: false, message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const {  new_password, confirm_password } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer token' format
    // Check if all required fields are provided
    if (!token || !new_password || !confirm_password) {
      return res.status(400).json({ message: "Token, new password, and confirmation password are required." });
    }

    // Check if new passwords match
    if (new_password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { email } = decoded;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
 // Reset OTP and remove OTP field
 user.otp = null; // Reset OTP to null
 
    // Save the updated user
    await user.save();

    res.status(200).json({ success: true,message: "Password reset successfully" });
  } catch (error) {
    
    res.status(500).json({success: false, message: "Internal server error. Please try again later." });
  }
};
