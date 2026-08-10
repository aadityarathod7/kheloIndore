// controllers/locationController.js
const messages = require("../config/message");
const NearbyLocation = require("../models/NearByLocationModel");

exports.addLoaction = async (req, res) => {
  try {
    const { area_name, status } = req.body;

    const newLoc = new NearbyLocation({
      area_name,
      status,
    });
    await newLoc.save();
    res.status(200).json({
      success: true,
      msg: "Loaction successfully Added",
      loc: newLoc,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLoaction = async (req, res) => {
  try {
    const loc = await NearbyLocation.find();
    if (!loc) {
      return res.status(400).json({
        success: false,
        message: "Location not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Location found",
      loc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
