// controllers/PersonalTrainerController.js
const PersonalTrainer = require("../models/PersonalTrainingModel");
const User = require("../models/UserModel");

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
    ];
    extendedFields.forEach((field) => {
      if (detail[field] !== undefined && detail[field] !== null && detail[field] !== "") {
        if (field === "coaching_levels" || field === "daily_availability" || field === "categories" || field === "videos") {
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
      // Personal Trainer can only see their own data
      const personalTrainer = await PersonalTrainer.findOne({ _id: userId });

      if (!personalTrainer) {
        return res.status(404).json({
          success: false,
          message: "Personal Trainer not found.",
        });
      }

      // Wrap the single object in an array
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
    return res.status(200).json({ success: true, personalTrainer });
  } catch (error) {
    

    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid personal trainer ID format" });
    }

    // Internal server error for unexpected issues
    return res.status(500).json({ success: false, message: "An unexpected error occurred" });
  }
};

// web 
exports.fetchAllPersonalTrainersForWeb = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions =  {
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
    if (trainer.status !== true || trainer.is_admin_access !== 1) {
      return res.status(403).json({ success: false, message: "Trainer is not active or approved" });
    }
    trainer.profile_views = (trainer.profile_views || 0) + 1;
    await trainer.save();
    return res.status(200).json({ success: true, personalTrainer: trainer });
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
    const shared = trainer.toObject();
    delete shared.mobile;
    delete shared.other_contact_number;
    delete shared.email;
    delete shared.address;
    delete shared.zipcode;
    if (shared.location) {
      delete shared.location.address;
      delete shared.location.zipcode;
    }
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
    const allowed = [
      "gender", "age", "date_of_birth", "price", "category", "trainer_type",
      "near_by_location", "experience", "availability", "specializations", "bio",
      "qualifications", "skills", "languages", "address", "city", "state", "zipcode",
      "coaching_levels", "own_level", "response_time", "class_location",
      "students_trained", "daily_availability", "social_media", "gallery_videos",
      "profile_picture", "gallery", "package",
    ];
    allowed.forEach((field) => {
      if (detail[field] !== undefined && detail[field] !== null) {
        trainer[field] = detail[field];
      }
    });
    trainer.is_profile_completed = true;
    await trainer.save();
    return res.status(200).json({ success: true, message: "Profile completed successfully", personalTrainer: trainer });
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
        const msg =
          `Dear ${trainer.first_name}, welcome to Khelo Indore! Complete your trainer profile here: ${completeLink}`.slice(0, 160);
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

    // Find the trainer by ID
    const trainer = await PersonalTrainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: "Personal Trainer not found" });
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

    // Save the updated trainer details
    await trainer.save();

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
