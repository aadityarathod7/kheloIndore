const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Venue = require('../models/VenueModel')

exports.auth = async (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_AUTH);

      req.user = decode;

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired.",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }
};
exports.isUser = async(req,res,next)=>{
 try {
   try {
     const allowedRoles = ["User", "Venue Admin", "Coach", "Personal Trainer"];
     if (!allowedRoles.includes(req.user.role)) {
       return res.status(400).json({
         success: false,
         message:
           "This route is private Route for User. You are not a User",
       });
     }
     next();
   } catch (err) {
     return res.status(500).json({
       success: false,
       message: `This is IsUser middleware err ${err.message}`,
     });
   }
 } catch (err) {
   return res.status(500).json({
     success: false,
     message: err.message,
   });
 }
}
exports.isVenueAdmin = async (req, res, next) => {
  try {
    try {
      if (req.user.role != "Venue Admin") {
        return res.status(400).json({
          success: false,
          message:
            "This route is private Route for Venue Admin. You are not a Venue Admin",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: `This is Is Venue Admin middleware err ${err.message}`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
};

exports.updateAuth = async (req, res, next) => {
  try {
    const id = req.params.id;
    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_AUTH);

    if (decoded.userID != venue.ownerID) {
      return res.status(400).json({
        success: false,
        message: "You don't have permission to update this venue",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "This is Update Auth middleware error",
    });
  }
};


 exports.isAuthenticated = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized: Please log in" });
  }
};

