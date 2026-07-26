const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Venue = require('../models/VenueModel')

exports.auth = async (req, res, next) => {
  try {
    const token = req.get("Authorization")?.split(" ")[1];
    console.log(token,"token");
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Provide token in header",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_AUTH);
      console.log(decode,"decodedecode");

      req.user = decode;

      next();
    } catch (err) {
      console.log(err,"errerr");
      
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
  } catch (err) {
    return res.json({
      status:500,
      success: false,
      message: "Provide token in header",
    });
  }
};
exports.isUser = async(req,res,next)=>{
 try {
   try {
     if (req.user.role != "User") {
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
    const token = req.header("Authorization").replace("Bearer ", "");
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
      message: `This is Update Auth middleware ${err.message}`,
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


