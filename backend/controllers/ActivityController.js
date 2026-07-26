const express = require("express");
const route = express.Router();
const Activity = require("../models/ActivitiesModel");

// Save data to the database
exports.createActivity = async (req, res) => {
  try {
    const { activity_name, status } = req.body;
    if (!activity_name) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter activity name" });
    }
    const check = await Activity.findOne({
      activity_name: activity_name,
    });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "Data already exist",
      });
      
    }
    const newActivity = new Activity({
      activity_name,
      status,
    });
    await newActivity.save();
    res.status(200).json({
      success: true,
      msg: "Activity successfully saved",
      activity: newActivity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all activities from the database
exports.fetchActivity = async (req, res) => {
  try {
const activities = await Activity.find({ status: true }).sort({
  activity_name: 1,
});
    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Unable to find activities" });
  }
};


// Update an activity
exports.updateActivity = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    if (!update.activity_name || update.activity_name.trim() === '') {
      return res.status(400).json({ success: false, msg: "Please enter the activity name" });
    }

    const existingActivity = await Activity.findOne({ activity_name: update.activity_name, _id: { $ne: id } });
    if (existingActivity) {
      return res.status(400).json({ success: false, msg: "Activity name already exists" });
    }

    const updatedFields = { ...update, activity_name: update.activity_name.trim() }; 
    const activity = await Activity.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!activity) {
      return res.status(400).json({ success: false, msg: "Activity not found" });
    }
    res.status(200).json({ success: true, msg: "Activity successfully updated", activity });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Unable to update the activity" });
  }
};



// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedActivity = await Activity.findByIdAndUpdate(id,{
      status:false
    },{new:true});
    if (!deletedActivity) {
      return res
        .status(400)
        .json({ success: false, msg: "Activity not found" });
    }
    res.status(200).json({
      success: true,
      msg: "Activity successfully deleted",
      activity: deletedActivity,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to delete the activity" });
  }
};
