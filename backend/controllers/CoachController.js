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
    ];
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