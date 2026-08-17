const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Coach = require("../models/CoachModel");
const mail = require("../helper/sendMail");
const mailContent = require("../middlewares/mail-content");
const User = require("../models/UserModel");
const { sendCustomMessage } = require("../helper/bhashMessaging");
const crypto = require("crypto");

// Never expose provider contact or exact address details through public or shared APIs.
const withoutPrivateCoachDetails = (coach) => {
  const publicCoach = coach.toObject ? coach.toObject() : { ...coach };
  [
    "mobile", "other_mobile", "other_contact_number", "email", "address", "city", "state", "zipcode",
    "location", "google_location", "password", "demo_password", "otp", "identity_Proof", "other_document",
    "verification_documents", "profile_completion_token",
  ].forEach((field) => delete publicCoach[field]);
  return publicCoach;
};
exports.createCoach = async (req, res) => {
  try {
    let { first_name, last_name, email, mobile,password } = req.body;
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    if(req.user.role == "Super Admin"){
      const nameRegex = /^[a-zA-Z ]+$/;
      if (!first_name || !first_name.trim() || !nameRegex.test(first_name)) {
  
        return res
          .status(400)
          .json({
            message:
              "First name must be provided and must contain only characters.",
          });
      }
      if (!last_name || !last_name.trim() || !nameRegex.test(last_name)) {
        return res
          .status(400)
          .json({
            message:
              "Last name must be provided and must contain only characters.",
          });
      }
  
      if (!mobile || mobile.toString().length !== 10) {
        return res
          .status(400)
          .json({ message: "Mobile number must be exactly 10 digits." });
      }
  
      if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res
          .status(400)
          .json({ message: "Email must contain an '@' symbol." });
      }
      const existingMobile = await Coach.findOne({ mobile: mobile });
      if (existingMobile) {
        return res.status(400).json({ message: "Coach already exits" });
      }
      const newCoach = new Coach(req.body);
      await newCoach.save();
      const completionToken = crypto.randomBytes(12).toString("hex");
      newCoach.profile_completion_token = completionToken;
      await newCoach.save();
      const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
      const completeLink = `${baseUrl}/coaches/complete-profile/${newCoach._id}?token=${completionToken}`;
      await Promise.allSettled([
        newCoach.email ? mail.superAdminAddUsersendEmail(
          newCoach.email,
          mailContent.onboarding_profile_link(`${newCoach.first_name} ${newCoach.last_name || ""}`.trim(), completeLink)
        ) : Promise.resolve(),
        newCoach.mobile ? sendCustomMessage({
          mobile: String(newCoach.mobile),
          message: `Khelo Indore: complete your coach profile: ${completeLink}`,
        }) : Promise.resolve(),
      ]);
      newCoach.onboard_email_sent = Boolean(newCoach.email);
      await newCoach.save();
      mail.superAdminAddUsersendEmail(
        req.body.email,
        mailContent.super_admin_add_booked_mail(
          first_name,
          req.body.mobile,
          req.body.email,
          password,
          role
        )
      )
      return res
        .status(200)
        .json({ message: "Coach profile created successfully", data: newCoach });
    }
    return res.json({
      status:400,
      success:false,
      message:"You can not add coach"
    })
    
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to create coach profile" });
  }
};
exports.deleteCoach = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you're passing the coach's ID as a URL parameter
    const updatedCoach = await Coach.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!updatedCoach) {
      return res.status(400).json({ message: "Coach not found" });
    }

    return res.json({
      message: "Coach marked as inactive successfully",
      coach: updatedCoach,
    });
  } catch (error) {
    
    return res
      .status(500)
      .json({ message: "Failed to mark coach as inactive" });
  }
};

exports.updateCoachSuperAdmin = async (req, res) => {
  try {
    if (req.user?.role !== "Super Admin") {
      return res.status(403).json({ success: false, message: "Only Super Admin can edit coach profiles." });
    }
    const detail = req.body;
    if (!detail) {
      return res.status(400).json({
        success: false,
        message: "Empty Body",
      });
    }
    const id = req.params.id;

    const coachData = await Coach.findById(id);
    if (!coachData) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    const nextEmail = detail.email !== undefined ? String(detail.email).trim().toLowerCase() : coachData.email;
    const nextMobile = detail.mobile !== undefined ? String(detail.mobile) : String(coachData.mobile || "");
    if (detail.email !== undefined && !/^\S+@\S+\.\S+$/.test(nextEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (detail.mobile !== undefined && !/^\d{10}$/.test(nextMobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be exactly 10 digits." });
    }
    const linkedUser = await User.findOne({ role: "Coach", $or: [{ email: coachData.email }, { mobile: coachData.mobile }] });
    const duplicateCoach = await Coach.findOne({ _id: { $ne: id }, $or: [{ email: nextEmail }, { mobile: Number(nextMobile) }] });
    const duplicateUser = await User.findOne({
      _id: { $ne: linkedUser?._id },
      $or: [{ email: nextEmail }, { mobile: Number(nextMobile) }],
    });
    if (duplicateCoach || duplicateUser) {
      return res.status(400).json({ success: false, message: "This email address or mobile number is already in use." });
    }

    const updatePayload = { isUpdated: true };

    // Scalar fields the admin form can send. Empty values are skipped so we
    // never accidentally wipe existing data.
    const scalarFields = [
      "first_name",
      "last_name",
      "email",
      "mobile",
      "gender",
      "age",
      "price",
      "category",
      "near_by_location",
      "experience",
      "availability",
      "specializations",
      "bio",
      "qualifications",
      "skills",
      "trainer_type",
      "venue_name",
      "policiesAndRules",
      "languages",
      "address",
      "city",
      "state",
      "zipcode",
      "status",
      // ---- Extended profile fields ----
      "coaching_levels",
      "own_level",
      "response_time",
      "class_location",
      "training_mode",
      "students_trained",
      "profile_views",
      "rating",
      "reviews_count",
      "daily_availability",
      "gallery_videos",
      "gallery",
      "social_media",
      "categories",
      "videos",
      "package",
    ];

    // Handle array-type fields that arrive as JSON strings from the admin form
    ["coaching_levels", "daily_availability", "categories", "videos", "gallery"].forEach((field) => {
      const value = detail[field];
      if (value === undefined || value === null || value === "") return;
      if (typeof value === "string") {
        try {
          updatePayload[field] = JSON.parse(value);
        } catch (e) {
          // keep as-is if not valid JSON
          updatePayload[field] = value;
        }
      } else {
        updatePayload[field] = value;
      }
    });

    // social_media is a nested object - merge instead of replace
    if (
      detail.social_media &&
      typeof detail.social_media === "object" &&
      !Array.isArray(detail.social_media)
    ) {
      const mergedSocial = { ...(coachData.social_media || {}), ...detail.social_media };
      const hasValue = Object.values(mergedSocial).some(
        (v) => v !== undefined && v !== null && v !== ""
      );
      if (hasValue) updatePayload.social_media = mergedSocial;
    }
    scalarFields.forEach((field) => {
      const value = detail[field];
      if (value !== undefined && value !== null && value !== "") {
        updatePayload[field] = value;
      }
    });

    // google_location lives inside the location sub-document.
    if (
      detail.google_location !== undefined &&
      detail.google_location !== null &&
      detail.google_location !== ""
    ) {
      updatePayload["location.google_location"] = detail.google_location;
    }

    // Merge location sub-document fields instead of replacing the whole
    // object, so partial payloads (or the admin form's default empty object)
    // never wipe the coach's saved address.
    if (
      detail.location &&
      typeof detail.location === "object" &&
      !Array.isArray(detail.location)
    ) {
      const mergedLocation = { ...coachData.location, ...detail.location };
      if (
        Object.values(mergedLocation).some(
          (v) => v !== undefined && v !== null && v !== ""
        )
      ) {
        updatePayload.location = mergedLocation;
      }
    }

    const updatedCoach = await Coach.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoach) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong In Update" });
    }
    if (linkedUser && (detail.email !== undefined || detail.mobile !== undefined)) {
      await User.findByIdAndUpdate(linkedUser._id, {
        ...(detail.email !== undefined ? { email: nextEmail } : {}),
        ...(detail.mobile !== undefined ? { mobile: Number(nextMobile) } : {}),
      }, { runValidators: true });
    }
    return res
      .status(200)
      .json({ message: "Coach updated successfully", coach: updatedCoach });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    const detail = req.body;
    if (!detail) {
      return res.status(400).json({
        success: false,
        message: "Empty Body",
      });
    }
    const { experience, availability, specializations, bio } = detail;
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = await jwt.verify(token, process.env.JWT_AUTH, { algorithms: ["HS256"] });

    const id = decoded.userID;
    const updatedCoach = await Coach.findByIdAndUpdate(
      id,
      {
        experience: experience,
        availability: availability ? JSON.stringify(availability) : null,
        specializations: specializations ? specializations : [],
        bio: bio || "",
      },
      { new: true }
    );

    if (!updatedCoach) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong In Update" });
    }
    return res
      .status(200)
      .json({ message: "Coach updated successfully", coach: updatedCoach });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


exports.fetchAllCoachesNew = async (req, res) => {
  try {
    let user = req.user.userID;

    if (!user) {
      return res.json({
        status: 500,
        success: false,
        message: "User Id not found",
      });
    }

    if (req.user.role === "Super Admin") {
      const { search } = req.query;
      let queryConditions = {};
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      // Column-specific search conditions
      const searchFields = [
        "first_name",
        "last_name",
        "location",
        "specializations",
        "status",
        "mobile",
      ];

      searchFields.forEach((field) => {
        if (req.query[field]) {
          if (field === "status") {
            queryConditions[field] = req.query[field] === "true";
          } else if (field === "location") {
            queryConditions["$or"] = [
              { "location.address": new RegExp(req.query[field], "i") },
              { "location.city": new RegExp(req.query[field], "i") },
              { "location.state": new RegExp(req.query[field], "i") },
              { "location.zipcode": new RegExp(req.query[field], "i") },
            ];
          } else {
            queryConditions[field] = new RegExp(req.query[field], "i");
          }
        }
      });

      // Add search condition for numeric fields (e.g., experience)
      if (req.query.experience) {
        queryConditions.experience = parseInt(req.query.experience);
      }

      // Global search condition (search across multiple fields)
      if (search) {
        const searchRegex = new RegExp(search, "i");
        queryConditions["$or"] = queryConditions["$or"] || [];
        queryConditions["$or"].push(
          { first_name: searchRegex },
          { last_name: searchRegex },
          { "location.address": searchRegex },
          { "location.city": searchRegex },
          { "location.state": searchRegex },
          { "location.zipcode": searchRegex },
          { specializations: searchRegex }
        );
        if (search === "true" || search === "false") {
          queryConditions["$or"].push({ status: search === "true" });
        }
      }

      // Fetch coaches with pagination and filters applied
      const coaches = await Coach.find(queryConditions)
        .sort({ createdAt: -1 })

      // Count total coaches to help with pagination if needed
      const totalCoaches = await Coach.countDocuments(queryConditions);

      return res.json({
        status: 200,
        success: true,
        data: coaches,
        totalCoaches, // Return total number of coaches
        currentPage: page, // Current page number
        totalPages: Math.ceil(totalCoaches / limit), // Calculate total pages
      });
    } else if (req.user.role === "Coach") {
      // Authentication uses the User document, while the service listing is in
      // Coach. Match the linked account instead of assuming both _ids are equal.
      const account = await User.findById(user).select("mobile email");
      const coach = account
        ? await Coach.findOne({ $or: [{ mobile: account.mobile }, { email: account.email }] })
        : await Coach.findById(user);

      if (!coach) {
        return res.status(404).json({ success: false, message: "Coach service profile not found." });
      }

      return res.json({
        status: 200,
        success: true,
        data: [coach],
      });
    } else {
      return res.json({
        success: false,
        message: "No data found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.fetchCoachById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid coach ID provided" });
    }

    // Fetch coach by ID
    const coach = await Coach.findById(id);

    // Check if the coach exists
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    // This is an authenticated management endpoint. A Coach may view their own
    // pending profile; approval is required only by the public endpoints.
    const isSuperAdmin = req.user?.role === "Super Admin";
    const account = await User.findById(req.user?.userID).select("mobile email");
    const ownsProfile = req.user?.role === "Coach" && account &&
      (String(account.mobile) === String(coach.mobile) || String(account.email || "").toLowerCase() === String(coach.email || "").toLowerCase());
    if (!isSuperAdmin && !ownsProfile) {
      return res.status(403).json({ success: false, message: "You can view only your own coach service." });
    }

    // Authenticated owner/Super Admin management response.
    return res.status(200).json({ success: true, coach });
  } catch (error) {
    

    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid coach ID format" });
    }

    // Internal server error for unexpected issues
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};





// web 
exports.fetchAllCoaches = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions = {
      status: true,
      is_admin_access: 1,
      verification_status: 1
    };

    const searchFields = [
      "first_name",
      "last_name",
      "location",
      "specializations",
      "status",
    ];
    searchFields.forEach((field) => {
      if (req.query[field]) {
        if (field === "status") {
          queryConditions[field] = req.query[field] === "true";
        } else if (field === "location") {
          queryConditions["$or"] = [
            { "location.address": new RegExp(req.query[field], "i") },
            { "location.city": new RegExp(req.query[field], "i") },
            { "location.state": new RegExp(req.query[field], "i") },
            { "location.zipcode": new RegExp(req.query[field], "i") },
          ];
        } else {
          queryConditions[field] = new RegExp(req.query[field], "i");
        }
      }
    });
    // Add search condition for numeric fields
    if (req.query.experience) {
      queryConditions.experience = parseInt(req.query.experience);
    }
    // Global search condition
    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryConditions["$or"] = queryConditions["$or"] || [];
      queryConditions["$or"].push(
        { first_name: searchRegex },
        { last_name: searchRegex },
        { "location.address": searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
        { "location.zipcode": searchRegex },
        { specializations: searchRegex }
      );
      if (search === "true" || search === "false") {
        queryConditions["$or"].push({ status: search === "true" });
      }
    }
    
    const coaches = await Coach.find(queryConditions).sort({ createdAt: -1 });

    const { attachRatings } = require("../helper/reviewRatings");
    const ratedCoaches = await attachRatings(coaches, "coach");
    return res.status(200).json({
      success: true,
      data: ratedCoaches.map(withoutPrivateCoachDetails),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// for super admin
exports.coachVerifyBySuperAdmin = async(req,res)=>{
  try {
    const id = req.params.coachId
    const verifyStatus = parseInt(req.params.verifyStatus, 10);
    const user = req.user.userID
    if(req.user.role =='Super Admin'){
      const updateObj = {
        verification_status: verifyStatus
      };
      if (verifyStatus === 1) {
        updateObj.status = true;
        updateObj.is_admin_access = 1;
      } else if (verifyStatus === 2) {
        updateObj.status = false;
        updateObj.is_admin_access = 2;
      } else {
        updateObj.status = true;
        updateObj.is_admin_access = 1;
      }

      const verifyCoach = await Coach.findByIdAndUpdate(id, updateObj, { new: true });
        if(!verifyCoach){
          return res.json({
            status:400,
            success:false,
            message:"Coach id not found"
            }) 
        }

        // Sync is_admin_access with the User record
        await User.findOneAndUpdate(
          { mobile: verifyCoach.mobile },
          { is_admin_access: verifyStatus === 2 ? 2 : 1, status: verifyStatus === 2 ? false : true }
        );

        return res.json({
          status:200,
          success:true,
          message:"Coach verified successfully"
          }) 
    }
    else{
      return res.json({
        status:400,
        success:false,
        message:"You have no rigths to verify status"
        })  
    }

  } catch (error) {
    return res.json({
    status:500,
    success:false,
    message:"Internal server error"
    })
  }
}

// Public coach detail fetch - increments profile views (used by the website)
exports.fetchPublicCoach = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid coach ID provided" });
    }
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    if (coach.status !== true || coach.is_admin_access !== 1 || coach.verification_status !== 1) {
      return res.status(403).json({ success: false, message: "Coach is not active" });
    }
    // Increment profile view counter
    coach.profile_views = (coach.profile_views || 0) + 1;
    await coach.save();
    return res.status(200).json({ success: true, coach: withoutPrivateCoachDetails(coach) });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Generate a shareable profile link (hides contact + address when shared)
exports.generateCoachShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    if (!coach.share_token) {
      coach.share_token = require("crypto").randomBytes(16).toString("hex");
      await coach.save();
    }
    const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
    return res.status(200).json({
      success: true,
      shareLink: `${baseUrl}/coaches/shared/${coach.share_token}`,
      share_token: coach.share_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a shared coach profile by token - contact number and address are hidden
exports.fetchSharedCoach = async (req, res) => {
  try {
    const { token } = req.params;
    const coach = await Coach.findOne({ share_token: token });
    if (!coach) {
      return res.status(404).json({ success: false, message: "Invalid or expired share link" });
    }
    return res.status(200).json({ success: true, coach: withoutPrivateCoachDetails(coach) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Complete coach profile (from the onboarding email/SMS link) - also sets new extended fields
exports.completeCoachProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = req.body;
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    if (!req.query.token || req.query.token !== coach.profile_completion_token) {
      return res.status(403).json({ success: false, message: "Invalid or expired profile completion link" });
    }
    const allowed = [
      "gender", "age", "date_of_birth", "price", "category", "trainer_type",
      "near_by_location", "experience", "availability", "specializations", "bio",
      "qualifications", "skills", "languages", "address", "city", "state", "zipcode",
      "coaching_levels", "own_level", "response_time", "class_location", "training_mode",
      "students_trained", "daily_availability", "social_media", "gallery_videos", "gallery", "videos",
      "profile_picture", "package",
    ];
    allowed.forEach((field) => {
      if (detail[field] !== undefined && detail[field] !== null) {
        coach[field] = detail[field];
      }
    });
    coach.is_profile_completed = true;
    await coach.save();
    return res.status(200).json({ success: true, message: "Profile completed successfully", coach });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send onboarding email + SMS with a link to complete the profile (after registration)
exports.sendOnboardingProfileLink = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await Coach.findById(id);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    if (!coach.profile_completion_token) {
      coach.profile_completion_token = require("crypto").randomBytes(12).toString("hex");
      await coach.save();
    }
    const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
    const completeLink = `${baseUrl}/coaches/complete-profile/${coach._id}?token=${coach.profile_completion_token}`;

    // Email
    if (coach.email) {
      try {
        await mail.superAdminAddUsersendEmail(
          coach.email,
          mailContent.onboarding_profile_link(
            `${coach.first_name} ${coach.last_name || ""}`.trim(),
            completeLink
          )
        );
      } catch (e) {
        
      }
    }
    // SMS (Bhash SMS)
    if (coach.mobile) {
      try {
        const { sendCustomMessage } = require("../helper/bhashMessaging");
        const msg = `Khelo Indore: complete your coach profile: ${completeLink}`;
        await sendCustomMessage({ mobile: String(coach.mobile), message: msg });
      } catch (e) {
        
      }
    }
    coach.onboard_email_sent = true;
    await coach.save();
    return res.status(200).json({ success: true, message: "Onboarding link sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Coach API
exports.updatecoach = async (req, res) => {
  try {
    const { coachId } = req.params; // Coach ID from URL parameters
    const updateData = req.body; // Update data from request body

    // Find the service profile, then ensure a coach can update only their own profile.
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }
    if (req.user?.role !== "Super Admin") {
      if (req.user?.role !== "Coach") {
        return res.status(403).json({ success: false, message: "You are not authorized to update this coach profile." });
      }
      const account = await User.findById(req.user.userID).select("mobile email");
      const ownsProfile = account && (String(account.mobile) === String(coach.mobile) || String(account.email || "").toLowerCase() === String(coach.email || "").toLowerCase());
      if (!ownsProfile) {
        return res.status(403).json({ success: false, message: "You can update only your own coach service." });
      }
    }

    // Update the coach details with the data from the request body
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        coach[key] = updateData[key]; // Update the coach's field
      }
    });

    // If update is NOT made by Super Admin (i.e. by coach themselves)
    if (req.user?.role !== "Super Admin") {
      coach.status = true;
      coach.is_admin_access = 1;
      coach.verification_status = 0; // pending approval for service listing

      // Send email & notification to Super Admin
      try {
        const superAdmins = await User.find({ role: "Super Admin" });
        const { sendMailHelper } = require("./NodeMailerController");
        const Notification = require("../models/NotificationModel");

        for (const admin of superAdmins) {
          if (admin.email) {
            await sendMailHelper(
              admin.email,
              `Coach Profile Verification Request`,
              `
              <h3>Coach Service Update</h3>
              <p>Coach <strong>${coach.first_name} ${coach.last_name}</strong> (Mobile: ${coach.mobile}) has updated their profile details/services and requested verification.</p>
              <p>Please log in to the admin panel to review and approve their profile.</p>
              `
            );
          }
          await Notification.create({
            user_id: admin._id,
            title: "Coach Approval Required",
            message: `Coach ${coach.first_name} ${coach.last_name} has updated their details and is awaiting verification.`,
            type: "info",
            entity_id: coach._id
          });
        }
      } catch (err) {
        console.error("Failed to send admin notification for coach update:", err);
      }
    }

    // Save the updated coach details
    await coach.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Coach details updated successfully",
      coach,
    });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
