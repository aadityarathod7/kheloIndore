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
    console.error("Error creating Personal Trainer profile:", error);
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
    console.error("Error marking Personal Trainer as inactive:", error);
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

    const updatedPersonalTrainer = await PersonalTrainer.findByIdAndUpdate(
      id,
      {
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
      },
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
      console.log("Query Params:", req.query); // Log query parameters to check
      const personalTrainers = await PersonalTrainer.find({ role: "Personal Trainer" })
        .sort({ createdAt: -1 });  // Sort by created date

      console.log("Found Trainers:", personalTrainers); // Log the result to check

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
    console.error("Error fetching personal trainer by ID:", error);

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
    console.error("Error updating personal trainer:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};