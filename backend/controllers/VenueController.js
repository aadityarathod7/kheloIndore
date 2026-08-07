const express = require("express");
const route = express.Router();
// const Venue = require("../models/VenueModel");
const Venue1 = require('../models/Venue1')
const SuperAdmin = require("../models/SuperAdminModel");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Vendor = require("../models/VendorTypeModel");
const mail = require("../helper/sendMail");

const mailContent = require("../middlewares/mail-content");
require('dotenv').config();

const resolveRedirect = (url) => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      return resolve(url);
    }
    
    const isShortUrl = url.includes("maps.app.goo.gl") || url.includes("share.google");
    if (!isShortUrl) {
      return resolve(url);
    }

    const https = require('https');
    
    const follow = (currentUrl, depth = 0) => {
      if (depth > 5) {
        return resolve(currentUrl);
      }
      
      try {
        https.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            follow(res.headers.location, depth + 1);
          } else {
            resolve(currentUrl);
          }
        }).on('error', () => {
          resolve(currentUrl);
        });
      } catch (err) {
        resolve(currentUrl);
      }
    };

    follow(url);
  });
};

// Save data to the database


exports.createVenue = async (req, res) => {
  try {
    const newVenue = req.body;

    if (!newVenue) {
      return res.status(400).json({
        success: true,
        message: "No Data found ",
      });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) return res.status(400).json({ error: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_AUTH);
    const ownerID = decoded.userID;

    newVenue.ownerID = ownerID;
    const newVenueDB = await Venue.create(newVenue);
    

const superAdminDatabase = await SuperAdmin.create({
  userID: decoded.userID,
  VenueID: newVenueDB._id,
});

   return res.status(200).json({ message: "New Venue successfully saved", venue: newVenueDB2 });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all categories from the database
exports.fetchVenue = async (req, res) => {
  try {
    const venues = await Venue1.find({}).sort({ createdAt: -1 });
    if (venues) {
      res.status(200).json({ venues });
    } else {
      return res.status(400).json({
        success: false,
        message: "The Venue is Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
// Get a single category by ID
exports.SingleVenue = async (req, res) => {
  try {
    const id = req.params.id;
    const venue = await Venue1.findById(id);
    if (venue ) {
      res.status(200).json({ venue });
    } else {
      return res.status(400).json({
        success: false,
        message: "The Venue is Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to find the Venue" });
  }
};

// Update a category
exports.updateVenue = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    if (update.google_location) {
      update.google_location = await resolveRedirect(update.google_location);
    }

    // Check if the name is provided and not empty
    if (!update.name || update.name.trim() === "") {
      return res.status(400).json({ message: "Please enter the venue name" });
    }

    // Check if a venue with the same name already exists (excluding the current venue)
    const existingVenue = await Venue1.findOne({
      name: update.name,
      _id: { $ne: id },
    });
    if (existingVenue) {
      return res.status(400).json({ message: "Venue name already exists" });
    }

    // Proceed with the update if validations pass
    const venue = await Venue1.findByIdAndUpdate(id, update, { new: true });
    if (!venue) {
      return res.status(400).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue successfully updated", data:venue });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update the venue" });
  }
};


// Delete a category
exports.deleteVenue = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedVenue = await Venue1.findByIdAndUpdate(id,{
      status:false
    },{new:true});
    if (!deletedVenue) {
      return res.status(400).json({ message: "Venue not found" });
    }
    res
      .status(200)
      .json({ message: "Venue successfully Deactivated", venue: deletedVenue });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to delete the Venue" });
  }
};

exports.addVenue = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty. Please provide the required venue details.",
      });
    }

    const {
      name,
      address,
      city,
      state,
      zipcode,
      images,
      category,
      amenities,
      near_by_location,
      google_location,
      googleCoordinates,
      emailId,
      facilities,
      policiesAndRules,
      gameType,
      additionalNotes,
      capacity,
      contact_number,
      other_contact_number,
      price_per_hr,
      description,
      open_at,
      close_at,
      package_type,
      vendor_type,
      vendor_details,
    } = req.body;

    const user = req.user?.userID;
    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User ID not found. Please authenticate before adding a venue.",
      });
    }

    let vendor_id;
    let verification_status = 0; // Default to 0 for Venue Admin

    if (req.user.role === "Venue Admin") {
      vendor_id = req.user.userID;
    } else if (req.user.role === "Super Admin") {
      vendor_id = req.body.vendor_id;
      if (!vendor_id) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "vendor_id is required for Super Admin.",
        });
      }
      verification_status = 1; // Set verification_status to 1 for Super Admin
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "You do not have permission to add a venue.",
      });
    }

    if (!name) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "The 'name' field is required.",
      });
    }

    if (!contact_number || !/^\d{10}$/.test(contact_number)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid contact number. It should be a 10-digit number.",
      });
    }

    const existingVenue = await Venue1.findOne({ name });
    if (existingVenue) {
      return res.status(409).json({
        success: false,
        message: "Venue with this name already exists.",
      });
    }

    const transformedVendorDetails = Object.entries(vendor_details || {}).map(
      ([key, value]) => ({ key, value })
    );

    const data = { vendor_data: transformedVendorDetails };

    const resolvedGoogleLocation = google_location ? await resolveRedirect(google_location) : google_location;

    // Create new venue
    const newVenueDB = await Venue1.create({
      name,
      address,
      city,
      state,
      zipcode,
      images,
      category,
      vendor_id,
      amenities,
      near_by_location,
      google_location: resolvedGoogleLocation,
      googleCoordinates,
      emailId,
      facilities,
      policiesAndRules,
      gameType,
      additionalNotes,
      capacity,
      contact_number,
      other_contact_number,
      price_per_hr,
      description,
      open_at,
      close_at,
      package_type,
      vendor_type,
      data,
      created_by: user,
      verification_status, // Use verification_status based on the role
      read_seen: 1, // Optional: Include if required
    });

    const vendor = await User.findOne({ _id: vendor_id });
    const vendorEmail = vendor ? vendor.email : null;
    const vendorName = vendor.first_name + ' ' + vendor.last_name;

    if (req.user.role === "Super Admin") {
      // Send confirmation email to venue admin when added by Super Admin
      const emailTemplate = mailContent.super_admin_add_venue_to_venue_admin(
        vendorName,
        name,
        address,
        contact_number
      );

      await mail.sendVenueAddBySuperadmin({
        senderEmail: process.env.SMTP_USER, // Use configured email as sender
        senderName: "Admin KheloIndore",
        recipientEmail: vendorEmail,
        subject: 'Your Venue Has Been Added to KheloIndore',
        html: emailTemplate,
      });
      emailResponseMessage = `Confirmation email sent to ${vendorName} at ${vendorEmail} regarding the venue addition.`;
    } else if (req.user.role === "Venue Admin") {
      // Send approval email to venue admin when added by Venue Admin
      const emailTemplate1 = mailContent.super_admin_approval_for_venue(
        vendorName,
        name,
        address,
        contact_number,
        new Date()
      );

      await mail.sendVenueAddBySuperadmin({
        senderEmail: process.env.SMTP_USER, // Use configured email as sender
        senderName: "Admin KheloIndore",
        recipientEmail: process.env.SUPER_ADMIN_EMAIL,
        subject: 'Venue Approval Pending for KheloIndore',
        html: emailTemplate1,
      });
      emailResponseMessage = `Approval email sent to the Super Admin about venue pending approval.`;
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Venue added successfully.",
      emailMessage: emailResponseMessage,
      venue: newVenueDB,      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while adding the venue.",
      error: error.message,
    });
  }
};
// new by sunil
exports.getVenueNew = async (req, res) => {
  try {
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    if(req.user.role == "Super Admin"){
      const { search } = req.query;
      let queryConditions = {};
  
      // Add column-specific search conditions dynamically
      const searchFields = ["name", "category", "address", "status"];
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
          { name: searchRegex },
          { category: searchRegex },
          { address: searchRegex },
          { status: search === "true" },
        ];
      }
  
      const newVenueDB = await Venue1.find(queryConditions).sort({
        created_at: -1,
      });
  
      return res
        .status(200)
        .json({ message: "New Venue successfully retrieved", venue: newVenueDB });
    }
    else{
      const adminId=user;
      const data = await Venue1.find({ vendor_id: adminId});
      res.status(200).json({
        success:true,
        message:"Venue Data by Vendor Id",
        venue:data
      })
    }
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const id = req.params.id;
    const venue = await Venue1.findById(id);
    if (venue) {
      res.status(200).json({ data:venue });
    } else {
      return res.status(400).json({ // Change the status code to 400 for "Not Found"
        success: false,
        message: "The Venue is Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to find the Venue" });
  }
};

exports.getVenuesByVendorType = async (req, res) => {
  try {
    const { vendorType } = req.body;
    const query = {};

    switch (vendorType) {
      case "turf":
        query["turfs"] = { $exists: true };
        break;
      case "swimming_pool":
        query["swimming_pools"] = { $exists: true };
        break;
      case "snooker":
        query["snookers"] = { $exists: true };
        break;
      case "gym":
        query["gyms"] = { $exists: true };
        break;
      case "basketball":
        query["basketballs"] = { $exists: true };
        break;
      case "playstation":
        query["playstations"] = { $exists: true };
        break;
      case "yoga":
        query["yogas"] = { $exists: true };
        break;
      case "golf_club":
        query["golf_clubs"] = { $exists: true };
        break;
      case "kabaddi":
        query["kabaddis"] = { $exists: true };
        break;
      case "badminton":
        query["badmintons"] = { $exists: true };
        break;
      case "archery":
        query["archery"] = { $exists: true };
        break;
      case "zumba":
        query["zumba_classes"] = { $exists: true };
        break;
      case "shooting":
        query["shootings"] = { $exists: true };
        break;
      case "hockey":
        query["hockeys"] = { $exists: true };
        break;
      case "squash":
        query["squashs"] = { $exists: true };
        break;
      case "skating":
        query["skatings"] = { $exists: true };
        break;
      case "tennis":
        query["tennises"] = { $exists: true };
        break;
      case "soccer":
        query["soccers"] = { $exists: true };
        break;
      case "baseball":
        query["baseballs"] = { $exists: true };
        break;
      case "volleyball":
        query["volleyballs"] = { $exists: true };
        break;
      default:
        return res.status(400).json({ message: "Unknown vendor type" });
    }

    const venues = await Venue1.find(query);
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getVenueByAdminId = async(req,res)=>{
  try{
    
    const adminId=req.params.id;
    const data = await Venue1.find({ vendor_id: adminId });
    res.status(200).json({
      success:true,
      message:"Venue Data by Vendor Id",
      venue:data
    })
  }catch(error){
 console.log(error);
 return res.status(500).json({ success: false, message: error.message });
  }
}

// Vendor Type
exports.createVendor = async (req, res) => {
  try {
      const vendor_type = req.body;
      if (!vendor_type) {
          return res.status(400).json({
              success: false,
              message: "Vendor type not found"
          });
      }

      const newVendor = new Vendor(vendor_type); 
      await newVendor.save(); 
      return res.status(200).json({
          success: true,
          message: "Vendor added successfully",
          newVendor
      })

  } catch (error) {
      return res.status(500).json({
          success: false,
          message: error.message
      });
  }
};

// Get all Vendors
exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        return res.status(200).json({
           success: true,
            vendors 
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
           success: false,
            message: error.message
      });
    }
};

 

exports.getVenueRoleList = async(req,res)=>{
  try {
    // let user = req.user.userID
    // if(!user){
    //   return res.json({
    //   status:500,
    //   success:false,
    //    message: "User Id not found" })
    //     }
    const venueRole = await User.find({role:"Venue Admin"}).sort({createdAt:-1})
    console.log(venueRole.length,"venueRole");
    if(venueRole.length > 0){
      return res.json({
        status:200,
        success:false,
        data:venueRole
      })
    }
    return res.json({
      status:400,
      success:false,
      data:"No data found"
    })
    
    
    
  } catch (error) {
    console.log(error);
    return res.json({
      status:500,
      success:false,
      message:error.message
    })
    
  }
}
// web 
exports.getVenue = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions = { status: true,verification_status: 1, };

    // Add column-specific search conditions dynamically
    const searchFields = ["name", "category", "address", "status"];
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
        { name: searchRegex },
        { category: searchRegex },
        { address: searchRegex },
        { status: search === "true" },
      ];
    }

    const newVenueDB = await Venue1.find(queryConditions).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json({ message: "New Venue successfully retrieved", venue: newVenueDB });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// for super admin
exports.actualvenueVerifyBySuperAdmin = async(req,res)=>{
  try {
   
    const id = req.params.venueId
    const verifyStatus = req.params.verifyStatus
    const user = req.user.userID
    console.log(id,verifyStatus,user)
    if(req.user.role =='Super Admin'){
      const verifyVenue = await Venue1.findByIdAndUpdate(id, {
      verification_status: verifyStatus,
        });
        if(!verifyVenue){
          return res.json({
            status:400,
            success:false,
            message:"Venue id not found"
            }) 
        }
        return res.json({
          status:200,
          success:true,
          message:"Venue verified successfully",
          verification_status:verification_status
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

exports.venueVerifyBySuperAdmin = async (req, res) => {
  try {
    const id = req.params.venueId;
    const verifyStatus = parseInt(req.params.verifyStatus, 10); // Convert verifyStatus to an integer

    // Basic input validation
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Venue ID is required and must be a valid string",
      });
    }

    // Validate MongoDB ObjectId
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid Venue ID",
      });
    }

    if (req.user.role !== "Super Admin") {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You have no rights to verify the venue",
      });
    }

    // Find the venue by ID and update its verification status
    const verifyVenue = await Venue1.findByIdAndUpdate(
      id,
      { verification_status: verifyStatus },
      { new: true }
    );

    if (!verifyVenue) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Venue ID not found",
      });
    }

    // Fetch vendor email using vendor_id from User table
    const vendor = await User.findById(verifyVenue.vendor_id);
    if (!vendor) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Vendor not found",
      });
    }

    // Prepare email content based on verifyStatus
    const subject =
      verifyStatus === 1
        ? "Your Venue Has Been Approved"
        : "Your Venue Has Been Rejected";

    const htmlContent =
      verifyStatus === 1
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${vendor.first_name} ${vendor.last_name},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            Congratulations! Your venue has been successfully approved.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            You can now access the venue management features on the platform.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions, feel free to reach out to us.
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
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Section -->
        <div style="text-align: center; background-color: #ff5f15; padding: 20px;">
          <img src="https://kheloindore.in/uploads/coach/1736171446480.png" alt="KheloIndore Logo" style="max-width: 100px; margin-bottom: 10px;">
          <h1 style="font-size: 24px; color: #fff; margin: 0;">KheloIndore</h1>
        </div>
      
        <!-- Content Section -->
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Dear ${vendor.first_name} ${vendor.last_name},</p>
          <p style="font-size: 14px; margin: 15px 0;">
            We regret to inform you that your venue has not been approved.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            Please review our submission guidelines and try again.
          </p>
          <p style="font-size: 14px; margin: 15px 0;">
            If you have any questions, feel free to contact us.
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
        `;

    // Send email notification
    await mail.sendVenueConfirnation({
      senderEmail: process.env.SMTP_USER, // Use configured email as sender
      senderName: "Admin KheloIndore",
      recipientEmail: vendor.email,
      subject,
      html: htmlContent,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Venue verification status updated successfully",
      verification_status: verifyVenue.verification_status,
    });
  } catch (error) {
    console.error("Error in venueVerifyBySuperAdmin:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.toggleVenueStatus = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the venue by ID
    const venue = await Venue1.findById(id);
    if (!venue) {
      return res.status(404).json({ 
        success: false, 
        message: "Venue not found" 
      });
    }
      // Set the status to true
      if (!venue.status) {
        venue.status = true;
        await venue.save();
      }

    res.status(200).json({
      success: true,
      message: `Venue status updated to ${venue.status ? "active" : "inactive"}`,
      data: venue,
    });
  } catch (error) {
    console.error("Error toggling venue status:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Unable to toggle venue status", 
      error: error.message 
    });
  }
};
