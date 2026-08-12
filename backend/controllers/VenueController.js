const express = require("express");
const route = express.Router();
// const Venue = require("../models/VenueModel");
const Venue1 = require('../models/Venue1')
const Slot = require("../models/SlotModel");
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
    
    res.status(500).json({ error: error.message });
  }
};
// Get a single category by ID
exports.SingleVenue = async (req, res) => {
  try {
    const id = req.params.id;
    const venue = await Venue1.findById(id);
    if (venue) {
      const vendor = await User.findById(venue.vendor_id);
      if (!vendor || vendor.status === false || vendor.is_admin_access !== 1) {
        return res.status(400).json({
          success: false,
          message: "The Venue is Not Found",
        });
      }
      res.status(200).json({ venue });
    } else {
      return res.status(400).json({
        success: false,
        message: "The Venue is Not Found",
      });
    }
  } catch (error) {
    
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
      categories,
      videos,
      sports_details,
      share_token,
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
      categories,
      videos,
      sports_details,
      share_token,
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
    
    return res.json({
      status:500,
      success:false,
      message:error.message
    })
    
  }
}
// ---- helpers for web venue filtering ----
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Slot time windows (minutes from midnight) aligned with the listing page filters
const SLOT_TIME_WINDOWS = {
  "all-full": { start: 360, end: 1380 }, // 06:00 AM - 11:00 PM
  morning: { start: 360, end: 720 }, // 06:00 AM - 12:00 PM
  afternoon: { start: 720, end: 1020 }, // 12:00 PM - 05:00 PM
  evening: { start: 1020, end: 1260 }, // 05:00 PM - 09:00 PM
  night: { start: 1260, end: 1380 }, // 09:00 PM - 11:00 PM
};

// Parses "06:00 AM", "04:00 PM" or 24h "06:00" into minutes from midnight (or null)
const parseSlotTime = (t) => {
  if (!t) return null;
  const str = String(t).trim();
  const m = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = (m[3] || "").toUpperCase();
  if (mer === "PM" && h < 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  if (mer === "" && h === 24) h = 0;
  return h * 60 + min;
};

// Computes [from, to) date range for a date filter value ("YYYY-MM-DD" or keyword)
const computeSlotDateRange = (dateKey) => {
  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };

  const dateMatch = String(dateKey).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const d = new Date(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]));
    d.setHours(0, 0, 0, 0);
    return { from: d, to: addDays(d, 1) };
  }

  const today = startOfDay(new Date());
  switch (String(dateKey)) {
    case "today":
      return { from: today, to: addDays(today, 1) };
    case "tomorrow":
      return { from: addDays(today, 1), to: addDays(today, 2) };
    case "next-7-days":
      return { from: today, to: addDays(today, 8) };
    case "this-weekend": {
      // upcoming Saturday -> end of Sunday (skips if today is a past day)
      const day = today.getDay(); // 0 = Sunday
      let satOffset = (6 - day + 7) % 7;
      if (satOffset === 0 && day === 0) satOffset = 6; // Sunday -> next Saturday
      const sat = addDays(today, satOffset);
      return { from: sat, to: addDays(sat, 2) };
    }
    default:
      return null;
  }
};

// web 
exports.getVenue = async (req, res) => {
  try {
    const { search, sport, location, grassType, amenities, date, time, sort } = req.query;

    // Filter out venues whose owners are deactivated or unapproved
    const activeVendors = await User.find({ status: { $ne: false }, is_admin_access: 1 }).select("_id");
    const activeVendorIds = activeVendors.map((v) => v._id);

    let queryConditions = { 
      status: true, 
      verification_status: 1,
      vendor_id: { $in: activeVendorIds }
    };

    // Add column-specific search conditions dynamically
    const searchFields = ["name", "category", "address", "status"];
    searchFields.forEach((field) => {
      if (req.query[field]) {
        if (field === "status") {
          queryConditions[field] = req.query[field] === "true";
        } else {
          queryConditions[field] = new RegExp(escapeRegex(req.query[field]), "i");
        }
      }
    });

    // Add global search condition
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      queryConditions["$or"] = [
        { name: searchRegex },
        { category: searchRegex },
        { address: searchRegex },
        { status: search === "true" },
      ];
    }

    // Web listing filters (all optional, backward compatible)
    const addAnd = (cond) => {
      if (!queryConditions["$and"]) queryConditions["$and"] = [];
      queryConditions["$and"].push(cond);
    };

    // 1. Sport filter: match vendor_type / category / name
    if (sport && sport !== "all") {
      const cleanSport = String(sport).replace(/&/g, "and").trim();
      const parts = cleanSport.split(/[\s-]+/).filter(Boolean).map(escapeRegex);
      if (parts.length > 0) {
        const flexibleRegex = new RegExp(parts.join("[\\s-]*"), "i");
        addAnd({
          $or: [
            { vendor_type: flexibleRegex },
            { category: flexibleRegex },
            { name: flexibleRegex },
          ],
        });
      }
    }

    // 2. Location filter: match near_by_location (case-insensitive substring)
    if (location && location !== "all") {
      queryConditions.near_by_location = new RegExp(escapeRegex(location), "i");
    }

    // 3. Grass type filter: derived from vendor_type / category / name keywords
    if (grassType && grassType !== "any") {
      const grassRegex = {
        box: /box/i,
        natural: /ground|natural/i,
        artificial: /turf|astro|artificial/i,
      }[grassType];
      if (grassRegex) {
        addAnd({
          $or: [
            { vendor_type: grassRegex },
            { category: grassRegex },
            { name: grassRegex },
          ],
        });
      }
    }

    // 4. Amenities filter: every selected amenity must appear in amenities OR facilities (case-insensitive)
    if (amenities) {
      const amenityList = String(amenities)
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
        .map((a) => new RegExp(escapeRegex(a), "i"));
      if (amenityList.length > 0) {
        const perAmenity = amenityList.map((regex) => ({
          $or: [{ amenities: regex }, { facilities: regex }],
        }));
        addAnd({ $and: perAmenity });
      }
    }

    let newVenueDB = await Venue1.find(queryConditions);

    // 5. Date / Time filter: keep only venues that have slots in the requested window
    if (date || time) {
      const slotQuery = {};
      if (date) {
        const range = computeSlotDateRange(date);
        if (range) slotQuery.date = { $gte: range.from, $lt: range.to };
      }
      const timeWindow = time ? SLOT_TIME_WINDOWS[time] : null;
      const slotDocs = await Slot.find(slotQuery).select("venue_id slots");
      const venueIds = new Set();
      slotDocs.forEach((doc) => {
        if (!doc.venue_id || !Array.isArray(doc.slots)) return;
        const matchesWindow = doc.slots.some((s) => {
          if (!timeWindow) return true;
          const startMin = parseSlotTime(s.startTime);
          return startMin !== null && startMin >= timeWindow.start && startMin < timeWindow.end;
        });
        if (matchesWindow) venueIds.add(doc.venue_id.toString());
      });
      newVenueDB = newVenueDB.filter((v) => venueIds.has(v._id.toString()));
    }

    // 6. Sort: price low -> high, price high -> low, otherwise newest first
    if (sort === "price-low") {
      newVenueDB.sort((a, b) => (a.price_per_hr || Infinity) - (b.price_per_hr || Infinity));
    } else if (sort === "price-high") {
      newVenueDB.sort((a, b) => (b.price_per_hr || 0) - (a.price_per_hr || 0));
    } else {
      newVenueDB.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res
      .status(200)
      .json({ message: "New Venue successfully retrieved", venue: newVenueDB });
  } catch (error) {
    
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

    // Send SMS notification
    try {
      const { sendCustomMessage } = require("../helper/bhashMessaging");
      const smsMessage = verifyStatus === 1
        ? `Dear ${vendor.first_name}, your venue "${verifyVenue.name}" has been approved on KheloIndore! You can now manage it from your panel.`
        : `Dear ${vendor.first_name}, your venue "${verifyVenue.name}" verification status has been updated. Please check your panel or contact support.`;
      await sendCustomMessage({ mobile: vendor.mobile, message: smsMessage });
    } catch (smsError) {
      console.error("SMS notification failed in venueVerifyBySuperAdmin:", smsError.message);
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Venue verification status updated successfully",
      verification_status: verifyVenue.verification_status,
    });
  } catch (error) {
    
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
    
    res.status(500).json({ 
      success: false, 
      message: "Unable to toggle venue status", 
      error: error.message 
    });
  }
};
