// controllers/PersonalTrainerController.js
const PersonalTrainer = require("../models/PersonalTrainingModel");
const User = require("../models/UserModel");
const mail = require("../helper/sendMail");
const mailContent = require("../middlewares/mail-content");
const { sendCustomMessage } = require("../helper/bhashMessaging");
const crypto = require("crypto");

const withoutPrivateTrainerDetails = (trainer) => {
  const publicTrainer = trainer.toObject ? trainer.toObject() : { ...trainer };
  ["mobile", "other_mobile", "other_contact_number", "email", "address", "zipcode", "password", "demo_password", "otp", "identity_Proof", "other_document", "verification_documents", "profile_completion_token"].forEach((field) => delete publicTrainer[field]);
  if (publicTrainer.location) {
    delete publicTrainer.location;
  }
  return publicTrainer;
};

exports.createPersonalTrainer = async (req, res) => {
  try {

    let { first_name, last_name, email, mobile } = req.body;
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
      return res.status(400).json({
        message:
          "First name must be provided and must contain only characters.",
      });
    }
    if (!last_name || !last_name.trim() || !nameRegex.test(last_name)) {
      return res.status(400).json({
        message: "Last name must be provided and must contain only characters.",
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

    const existingMobile = await PersonalTrainer.findOne({ mobile: mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: "Personal Trainer already exists" });
    }

    const newPersonalTrainer = new PersonalTrainer(req.body);
    await newPersonalTrainer.save();
    const completionToken = crypto.randomBytes(12).toString("hex");
    newPersonalTrainer.profile_completion_token = completionToken;
    await newPersonalTrainer.save();
    const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
    const completeLink = `${baseUrl}/personal-training/complete-profile/${newPersonalTrainer._id}?token=${completionToken}`;
    await Promise.allSettled([
      newPersonalTrainer.email ? mail.superAdminAddUsersendEmail(
        newPersonalTrainer.email,
        mailContent.onboarding_profile_link(`${newPersonalTrainer.first_name} ${newPersonalTrainer.last_name || ""}`.trim(), completeLink)
      ) : Promise.resolve(),
      newPersonalTrainer.mobile ? sendCustomMessage({
        mobile: String(newPersonalTrainer.mobile),
        message: `Khelo Indore: complete your trainer profile: ${completeLink}`,
      }) : Promise.resolve(),
    ]);
    newPersonalTrainer.onboard_email_sent = Boolean(newPersonalTrainer.email);
    await newPersonalTrainer.save();

    return res
      .json({
        status:200,
        message: "Personal Trainer profile created successfully",
        data: newPersonalTrainer,
      });
    }
    else{
      return res.json({
        status:400,
        success:false,
        data:"You have no right to add this"
      })
    }
  } catch (error) {
    
    return res
      .status(500)
      .json({ message: "Failed to create Personal Trainer profile" });
  }
};

exports.deletePersonalTrainer = async (req, res) => {
  try {
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    const { id } = req.params;
    const updatedPersonalTrainer = await PersonalTrainer.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!updatedPersonalTrainer) {
      return res.status(400).json({ message: "Personal Trainer not found" });
    }

    return res.json({
      message: "Personal Trainer marked as inactive successfully",
      personalTrainer: updatedPersonalTrainer,
    });
  } catch (error) {
    
    return res
      .status(500)
      .json({ message: "Failed to mark Personal Trainer as inactive" });
  }
};

exports.updatePersonalTrainer = async (req, res) => {
  try {
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    const { id } = req.params;
    const detail = req.body;

    const personalTrainerData = await PersonalTrainer.findById(id);

    const updatePayload = {
      first_name: detail.first_name || personalTrainerData.first_name,
      last_name: detail.last_name || personalTrainerData.last_name,
      email: detail.email || personalTrainerData.email,
      experience: detail.experience || personalTrainerData.experience,
      availability: detail.availability || personalTrainerData.availability,
      specializations:
        detail.specializations || personalTrainerData.specializations,
      location: detail.location || personalTrainerData.location,
      bio: detail.bio || personalTrainerData.bio,
      status: detail.status,
      isUpdated: true,
    };

    // Extended profile fields (levels, response time, class location, students, views, socials, etc.)
    const extendedFields = [
      "gender", "age", "price", "category", "trainer_type", "near_by_location",
      "qualifications", "skills", "languages", "address", "city", "state", "zipcode",
      "own_level", "response_time", "class_location", "students_trained",
      "profile_views", "rating", "reviews_count", "gallery_videos", "gallery",
      "coaching_levels", "daily_availability", "social_media", "categories", "videos",
      "sports", "training_mode", "training_levels", "age_groups", "certifications",
      "achievements_awards", "training_formats", "group_size_max", "session_durations",
      "availability_options", "pricing", "professional_experiences", "verification_documents",
      "training_photos", "certificate_achievement_photos",
    ];
    extendedFields.forEach((field) => {
      if (detail[field] !== undefined && detail[field] !== null && detail[field] !== "") {
        if (["coaching_levels", "daily_availability", "categories", "videos", "sports", "training_levels", "age_groups", "certifications", "achievements_awards", "training_formats", "session_durations", "availability_options", "professional_experiences", "training_photos", "certificate_achievement_photos"].includes(field)) {
          if (typeof detail[field] === "string") {
            try {
              updatePayload[field] = JSON.parse(detail[field]);
            } catch (e) {
              updatePayload[field] = detail[field];
            }
          } else {
            updatePayload[field] = detail[field];
          }
        } else if (field === "social_media" && typeof detail[field] === "object" && !Array.isArray(detail[field])) {
          updatePayload.social_media = { ...(personalTrainerData.social_media || {}), ...detail[field] };
        } else {
          updatePayload[field] = detail[field];
        }
      }
    });

    const updatedPersonalTrainer = await PersonalTrainer.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );

    if (!updatedPersonalTrainer) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong In Update" });
    }

    return res
      .status(200)
      .json({
        message: "Personal Trainer updated successfully",
        personalTrainer: updatedPersonalTrainer,
      });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.actfetchAllPersonalTrainers = async (req, res) => {
  try {
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    if( req.user.role == "Super Admin"){
    const { search } = req.query;
    let queryConditions = {role: "Personal Trainer" };

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

    if (req.query.experience) {
      queryConditions.experience = parseInt(req.query.experience);
    }

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

    const personalTrainers = await PersonalTrainer.find(queryConditions).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: personalTrainers,
    });
  }
  else{
    return res.json({
      status:400,
      success: false,
      data: "You can not see personal trainer details",
    });
  }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.workingfetchAllPersonalTrainers = async (req, res) => {
  try {
    let user = req.user.userID;
    if (!user) {
      return res.json({
        status: 500,
        success: false,
        message: "User Id not found"
      });
    }

    if (req.user.role == "Super Admin") {
       // Log query parameters to check
      const personalTrainers = await PersonalTrainer.find({ role: "Personal Trainer" })
        .sort({ createdAt: -1 });  // Sort by created date

       // Log the result to check

      return res.status(200).json({
        success: true,
        data: personalTrainers
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "You cannot see personal trainer details",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.fetchAllPersonalTrainers = async (req, res) => {
  try {
    const userId = req.user.userID;

    // Check if user ID exists
    if (!userId) {
      return res.status(500).json({
        success: false,
        message: "User ID not found.",
      });
    }

    let data = [];

    // Check the user's role
    if (req.user.role === "Super Admin") {
      // Super Admin can see all personal trainers
      data = await PersonalTrainer.find({ role: "Personal Trainer" }).sort({
        createdAt: -1,
      });
    } else if (req.user.role === "Personal Trainer") {
      // Authentication uses User; locate the linked pending service profile.
      const account = await User.findById(userId).select("mobile email");
      const personalTrainer = account
        ? await PersonalTrainer.findOne({ $or: [{ mobile: account.mobile }, { email: account.email }] })
        : await PersonalTrainer.findById(userId);

      if (!personalTrainer) {
        return res.status(404).json({
          success: false,
          message: "Personal Trainer service profile not found.",
        });
      }

      data = [personalTrainer];
    } else {
      // Other roles are not authorized
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view personal trainer details.",
      });
    }

    // Return data as an array of objects
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.accfetchPersonalTrainerById = async (req, res) => {
//   let user = req.user.userID
//   if(!user){
// return res.json({
// status:500,
// success:false,
//  message: "User Id not found" })
//   }
  const id = req.params.id;
  const personalTrainer = await PersonalTrainer.findById(id);

  if (!personalTrainer) {
    return res
      .status(400)
      .json({ message: "Personal Trainer not found or inactive" });
  }

  return res.json({ personalTrainer });
};

exports.fetchPersonalTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || id.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid personal trainer ID provided" });
    }

    // Fetch personal trainer by ID
    const personalTrainer = await PersonalTrainer.findById(id);

    // Check if the personal trainer exists
    if (!personalTrainer) {
      return res.status(404).json({ success: false, message: "Personal trainer not found" });
    }

    // Check if is_admin_access is 1 (if applicable for personal trainer)
    if (personalTrainer.is_admin_access !== 1) {
      return res.status(403).json({ success: false, message: "Access denied. Admin access required." });
    }

    // Respond with the personal trainer data
    return res.status(200).json({ success: true, personalTrainer: withoutPrivateTrainerDetails(personalTrainer) });
  } catch (error) {
    

    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid personal trainer ID format" });
    }

    // Internal server error for unexpected issues
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// Private trainer record for Super Admin management only.
exports.fetchPersonalTrainerForAdmin = async (req, res) => {
  try {
    const trainer = await PersonalTrainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ success: false, message: "Personal trainer not found" });
    const isSuperAdmin = req.user?.role === "Super Admin";
    const account = await User.findById(req.user?.userID).select("mobile email");
    const ownsProfile = req.user?.role === "Personal Trainer" && (
      (String(req.user?.userID) === String(trainer._id)) ||
      (account && (String(account.mobile) === String(trainer.mobile) || String(account.email || "").toLowerCase() === String(trainer.email || "").toLowerCase()))
    );
    console.log("DEBUG fetchPersonalTrainerForAdmin:", {
      user: req.user,
      trainerId: req.params.id,
      trainerMobile: trainer.mobile,
      trainerEmail: trainer.email,
      accountExists: !!account,
      ownsProfile
    });
    if (!isSuperAdmin && !ownsProfile) {
      return res.status(403).json({ success: false, message: "You can view only your own trainer service." });
    }
    return res.status(200).json({ success: true, personalTrainer: trainer });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid personal trainer ID format" });
  }
};

// web 
exports.fetchAllPersonalTrainersForWeb = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions =  {
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

    if (req.query.experience) {
      queryConditions.experience = parseInt(req.query.experience);
    }

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

    const personalTrainers = await PersonalTrainer.find(queryConditions).sort({
      createdAt: -1,
    });

    const { attachRatings } = require("../helper/reviewRatings");
    return res.status(200).json({
      success: true,
      data: await attachRatings(personalTrainers.map(withoutPrivateTrainerDetails), "trainer"),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Public trainer detail fetch - increments profile views (used by the website)
exports.fetchPublicTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid trainer ID provided" });
    }
    const trainer = await PersonalTrainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    if (trainer.status !== true || trainer.is_admin_access !== 1 || trainer.verification_status !== 1) {
      return res.status(403).json({ success: false, message: "Trainer is not active or approved" });
    }
    trainer.profile_views = (trainer.profile_views || 0) + 1;
    await trainer.save();
    return res.status(200).json({ success: true, personalTrainer: withoutPrivateTrainerDetails(trainer) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate a shareable profile link (hides contact + address when shared)
exports.generateTrainerShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await PersonalTrainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    if (!trainer.share_token) {
      trainer.share_token = require("crypto").randomBytes(16).toString("hex");
      await trainer.save();
    }
    const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
    return res.status(200).json({
      success: true,
      shareLink: `${baseUrl}/personal-training/shared/${trainer.share_token}`,
      share_token: trainer.share_token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a shared trainer profile by token - contact + address hidden
exports.fetchSharedTrainer = async (req, res) => {
  try {
    const { token } = req.params;
    const trainer = await PersonalTrainer.findOne({ share_token: token });
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Invalid or expired share link" });
    }
    const shared = withoutPrivateTrainerDetails(trainer);
    return res.status(200).json({ success: true, personalTrainer: shared });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Complete trainer profile from the onboarding link
exports.completeTrainerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = req.body;
    const trainer = await PersonalTrainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    if (!req.query.token || req.query.token !== trainer.profile_completion_token) {
      return res.status(403).json({ success: false, message: "Invalid or expired profile completion link" });
    }
    const allowed = [
      "gender", "age", "date_of_birth", "price", "category", "trainer_type",
      "near_by_location", "experience", "availability", "specializations", "bio",
      "qualifications", "skills", "languages", "address", "city", "state", "zipcode",
      "coaching_levels", "own_level", "response_time", "class_location",
      "students_trained", "daily_availability", "social_media", "gallery_videos", "videos",
      "profile_picture", "gallery", "package", "sports", "training_mode", "training_levels",
      "age_groups", "certifications", "achievements_awards", "training_formats", "group_size_max",
      "session_durations", "availability_options", "pricing", "professional_experiences",
      "verification_documents", "training_photos", "certificate_achievement_photos",
    ];
    allowed.forEach((field) => {
      if (detail[field] !== undefined && detail[field] !== null) {
        trainer[field] = detail[field];
      }
    });
    trainer.is_profile_completed = true;
    await trainer.save();
    return res.status(200).json({ success: true, message: "Profile completed successfully", personalTrainer: withoutPrivateTrainerDetails(trainer) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send onboarding email + SMS with a link to complete the profile
exports.sendTrainerOnboardingProfileLink = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await PersonalTrainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }
    if (!trainer.profile_completion_token) {
      trainer.profile_completion_token = require("crypto").randomBytes(12).toString("hex");
      await trainer.save();
    }
    const baseUrl = process.env.WEBSITE_URL || "https://kheloindore.in";
    const completeLink = `${baseUrl}/personal-training/complete-profile/${trainer._id}?token=${trainer.profile_completion_token}`;

    const mail = require("../helper/sendMail");
    const mailContent = require("../middlewares/mail-content");
    if (trainer.email) {
      try {
        await mail.superAdminAddUsersendEmail(
          trainer.email,
          mailContent.onboarding_profile_link(
            `${trainer.first_name} ${trainer.last_name || ""}`.trim(),
            completeLink
          )
        );
      } catch (e) {
        
      }
    }
    if (trainer.mobile) {
      try {
        const { sendCustomMessage } = require("../helper/bhashMessaging");
        const msg = `Khelo Indore: complete your trainer profile: ${completeLink}`;
        await sendCustomMessage({ mobile: String(trainer.mobile), message: msg });
      } catch (e) {
        
      }
    }
    trainer.onboard_email_sent = true;
    await trainer.save();
    return res.status(200).json({ success: true, message: "Onboarding link sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePersonalTrainers = async (req, res) => {
  try {
    const { trainerId } = req.params; // Trainer ID from URL parameters
    const updateData = req.body; // Update data from request body

    const isSuperAdmin = req.user?.role === "Super Admin";

    if (Array.isArray(updateData.training_formats) && updateData.training_formats.includes("Group Training")) {
      const groupSize = Number(updateData.group_size_max);
      if (!Number.isInteger(groupSize) || groupSize < 10 || groupSize > 15) {
        return res.status(400).json({ success: false, message: "Group training size must be between 10 and 15." });
      }
    }
    if (Array.isArray(updateData.session_durations) && updateData.session_durations.some((duration) => ![1, 2, 3].includes(Number(duration)))) {
      return res.status(400).json({ success: false, message: "Session duration must be 1, 2, or 3 hours." });
    }

    // Find the service profile and verify ownership for a trainer self-update.
    const trainer = await PersonalTrainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Personal Trainer not found" });
    }
    if (!isSuperAdmin) {
      if (req.user?.role !== "Personal Trainer") {
        return res.status(403).json({ success: false, message: "You are not authorized to update this trainer profile." });
      }
      const account = await User.findById(req.user.userID).select("mobile email");
      const ownsProfile = (String(req.user.userID) === String(trainer._id)) || (account && (String(account.mobile) === String(trainer.mobile) || String(account.email || "").toLowerCase() === String(trainer.email || "").toLowerCase()));
      if (!ownsProfile) {
        return res.status(403).json({ success: false, message: "You can update only your own trainer service." });
      }
    }

    const nextEmail = updateData.email !== undefined ? String(updateData.email).trim().toLowerCase() : trainer.email;
    const nextMobile = updateData.mobile !== undefined ? String(updateData.mobile) : String(trainer.mobile || "");
    if (updateData.email !== undefined && !/^\S+@\S+\.\S+$/.test(nextEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (updateData.mobile !== undefined && !/^\d{10}$/.test(nextMobile)) {
      return res.status(400).json({ success: false, message: "Mobile number must be exactly 10 digits." });
    }
    const linkedUser = await User.findOne({ role: "Personal Trainer", $or: [{ email: trainer.email }, { mobile: trainer.mobile }] });
    const duplicateTrainer = await PersonalTrainer.findOne({ _id: { $ne: trainerId }, $or: [{ email: nextEmail }, { mobile: Number(nextMobile) }] });
    const duplicateUser = await User.findOne({
      _id: { $ne: linkedUser?._id },
      $or: [{ email: nextEmail }, { mobile: Number(nextMobile) }],
    });
    if (duplicateTrainer || duplicateUser) {
      return res.status(400).json({ success: false, message: "This email address or mobile number is already in use." });
    }

    // Loop through each field in the updateData and update the trainer's data if the field exists in the request
    Object.keys(updateData).forEach((key) => {
      // Only update the field if it's defined in the request body
      if (updateData[key] !== undefined) {
        // For complex fields, we can also add logic to handle nested objects, arrays, etc.
        trainer[key] = updateData[key];
      }
    });

    // Ensure that 'isUpdated' is set to true when the data is updated
    trainer.isUpdated = true;

    // If update is NOT made by Super Admin (i.e. by trainer themselves)
    if (!isSuperAdmin) {
      trainer.status = true;
      trainer.is_admin_access = 1;
      trainer.verification_status = 0; // pending approval for service listing

      // Send email & notification to Super Admin
      try {
        const superAdmins = await User.find({ role: "Super Admin" });
        const { sendMailHelper } = require("./NodeMailerController");
        const Notification = require("../models/NotificationModel");

        for (const admin of superAdmins) {
          if (admin.email) {
            await sendMailHelper(
              admin.email,
              `Personal Trainer Profile Verification Request`,
              `
              <h3>Trainer Service Update</h3>
              <p>Personal Trainer <strong>${trainer.first_name} ${trainer.last_name}</strong> (Mobile: ${trainer.mobile}) has updated their profile details/services and requested verification.</p>
              <p>Please log in to the admin panel to review and approve their profile.</p>
              `
            );
          }
          await Notification.create({
            user_id: admin._id,
            title: "Trainer Approval Required",
            message: `Personal Trainer ${trainer.first_name} ${trainer.last_name} has updated their details and is awaiting verification.`,
            type: "info",
            entity_id: trainer._id
          });
        }
      } catch (err) {
        console.error("Failed to send admin notification for trainer update:", err);
      }
    }

    // Save the updated trainer details
    await trainer.save();

    if (linkedUser && (updateData.email !== undefined || updateData.mobile !== undefined)) {
      await User.findByIdAndUpdate(linkedUser._id, {
        ...(updateData.email !== undefined ? { email: nextEmail } : {}),
        ...(updateData.mobile !== undefined ? { mobile: Number(nextMobile) } : {}),
      }, { runValidators: true });
    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Personal Trainer details updated successfully",
      trainer,
    });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
