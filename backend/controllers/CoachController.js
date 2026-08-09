const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Coach = require("../models/CoachModel");
const mail = require("../helper/sendMail");
const mailContent = require("../middlewares/mail-content");
const User = require("../models/UserModel");
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
    console.error("Error creating coach profile:", error);
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
    console.error("Error marking coach as inactive:", error);
    return res
      .status(500)
      .json({ message: "Failed to mark coach as inactive" });
  }
};

exports.updateCoachSuperAdmin = async (req, res) => {
  try {
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
      "students_trained",
      "profile_views",
      "rating",
      "reviews_count",
      "daily_availability",
      "gallery_videos",
      "social_media",
      "categories",
      "videos",
    ];

    // Handle array-type fields that arrive as JSON strings from the admin form
    ["coaching_levels", "daily_availability", "categories", "videos"].forEach((field) => {
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
    });

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

    const decoded = await jwt.verify(token, process.env.JWT_AUTH);

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
      const id = user;
    
      const coach = await Coach.findOne({ _id: id} );
      const coachData = [coach];

      if (!coach) {
        return res.status(400).json({ message: "Coach not found or inactive" });
      }

      return res.json({
        status: 200,
        success: true,
        data: coachData,
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

    // Check if is_admin_access is 1
    if (coach.is_admin_access !== 1) {
      return res.status(403).json({ success: false, message: "Access denied. Admin access required." });
    }

    // Respond with the coach data
    return res.status(200).json({ success: true, coach });
  } catch (error) {
    console.error("Error fetching coach by ID:", error);

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
      is_admin_access: 1 || '1'
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
    console.log("Query Conditions:", queryConditions);
    const coaches = await Coach.find(queryConditions).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: coaches,
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
    const verifyStatus = req.params.verifyStatus
    const user = req.user.userID
    if(req.user.role =='Super Admin'){
      const verifyCoach = await Coach.findByIdAndUpdate(id, {
      verification_status: verifyStatus,
        });
        if(!verifyCoach){
          return res.json({
            status:400,
            success:false,
            message:"Coach id not found"
            }) 
        }
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
    if (coach.status !== true) {
      return res.status(403).json({ success: false, message: "Coach is not active" });
    }
    // Increment profile view counter
    coach.profile_views = (coach.profile_views || 0) + 1;
    await coach.save();
    return res.status(200).json({ success: true, coach });
  } catch (error) {
    console.error("Error fetching public coach:", error);
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
    // Strip private information
    const shared = coach.toObject();
    delete shared.mobile;
    delete shared.other_contact_number;
    delete shared.email;
    delete shared.address;
    delete shared.zipcode;
    if (shared.location) {
      delete shared.location.address;
      delete shared.location.zipcode;
    }
    return res.status(200).json({ success: true, coach: shared });
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
    const allowed = [
      "gender", "age", "date_of_birth", "price", "category", "trainer_type",
      "near_by_location", "experience", "availability", "specializations", "bio",
      "qualifications", "skills", "languages", "address", "city", "state", "zipcode",
      "coaching_levels", "own_level", "response_time", "class_location",
      "students_trained", "daily_availability", "social_media", "gallery_videos",
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
        console.error("Onboarding email failed:", e.message);
      }
    }
    // SMS (Bhash SMS)
    if (coach.mobile) {
      try {
        const { sendCustomMessage } = require("../helper/bhashMessaging");
        const msg =
          `Dear ${coach.first_name}, welcome to Khelo Indore! Complete your coach profile here: ${completeLink}`.slice(0, 160);
        await sendCustomMessage({ mobile: String(coach.mobile), message: msg });
      } catch (e) {
        console.error("Onboarding SMS failed:", e.message);
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

    // Find the coach by ID
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ success: false, message: "Coach not found" });
    }

    // Update the coach details with the data from the request body
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        coach[key] = updateData[key]; // Update the coach's field
      }
    });

    // Save the updated coach details
    await coach.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "Coach details updated successfully",
      coach,
    });
  } catch (error) {
    console.error("Error updating coach:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};