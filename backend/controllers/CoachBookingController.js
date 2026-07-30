const CoachBooking = require("../models/CoachBookingModel");
const Coach = require("../models/CoachModel");
const User = require("../models/UserModel");
const CoachSlot = require("../models/CoachSlotsModel");
const mongoose = require('mongoose')
exports.bookCoach = async (req, res) => {
  try {
    const { userId, coachId, slotBooked, date, packageType } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    if (!coachId) {
      return res.status(400).json({
        success: false,
        message: "CoachId is required",
      });
    }

    if (!slotBooked) {
      return res.status(400).json({
        success: false,
        message: "SlotBooked is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!packageType) {
      return res.status(400).json({
        success: false,
        message: "PackageType is required",
      });
    }

    const startDate = new Date(date);
    let endDate;

    // Determine end date based on package type
    switch (packageType.toLowerCase()) {
      case "monthly":
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "yearly":
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid package type",
        });
    }

    // Query to find available slots
    const slotsData = await CoachSlot.findOne({
      coachId: coachId,
      batchDate: startDate,
    });

    if (slotsData.length === 0) {
      return res.status(400).json({
        success: false,
      message:
    "Slots not found for the specified Batch. Register in Different batch",
  });
}
    let index = -1;
    let mySlot;
    const array = slotsData.slots;
    const slot = array.find((slot, idx) => {
       if (slot._id == slotBooked && slot.personCount < slotsData.batchSize) {
         // slot.personCount < slotsData.batchSize
         mySlot = slot;
         index = idx;
         return true;
       }
      return false;
    });

    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: "Slot is not found or already booked.", 
      });
    }
    
    slotsData.slots[index].personCount += 1;
    slotsData.slots[index].isBooked = true;

    // Save the updated document
    await slotsData.save();
   
    // Create a new coach booking
    const newBooking = await CoachBooking.create({ 
      userId: userId,
      coachId: coachId,
      slotBooked: slotBooked,
      startDate,
      endDate,
      packageType,
    });

    // Populate booking details
    let populatedBooking = await CoachBooking.findById(newBooking._id)
      .populate("userId")
      .populate("coachId")
    

    // Increment user's booking count
    await User.findByIdAndUpdate(
    userId,
      { $inc: { booking_count: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Coach booking added successfully",
      data: populatedBooking,
      slot:mySlot
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add coach booking",
      error: error.message,
    });
  }
};

 exports.actualfetchCoachBooking = async (req, res) => {
   try {
    let user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const searchQuery = req.query.search || ''; // Get search term from request
const regex = new RegExp(searchQuery, 'i');
    if(req.user.role == "Super Admin"){
  
     const BookingData = await CoachBooking.find().populate('userId coachId').lean().sort({createdAt:-1}).skip((page-1)*1).limit(limit)
     const filteredBookingData = BookingData.filter(slot => {
      const user = slot.userId;
      return (
        user.first_name.match(regex) ||
        user.last_name.match(regex) ||
        (user.mobile && user.mobile.toString().match(regex))
      );
    });
      let populatedBooking = await Promise.all(
        filteredBookingData.map(async (slot) => {
         const startDate = slot.startDate;
         const coachID = slot.coachId;
         const CoachSlotBooked = await CoachSlot.findOne({
           batchDate: startDate,
           coachId: coachID,
         }).lean();
         if (CoachSlotBooked) {
           const slotInfo = CoachSlotBooked.slots.find((slotData) => {
             return slotData._id.toString() === slot.slotBooked.toString();
           });

           if (slotInfo) {
             slot.slotBooked = slotInfo;
           }
         }
         return slot;
       })
     );
    return res.status(200).json({
       success: true,
       message: "Coach booking fetched successfully",
       data: populatedBooking,
     });
    }
    else if( req.user.role == "Coach"){
      const BookingData = await CoachBooking.find({coachId:user}).populate('userId coachId').lean().sort({createdAt:-1}).skip((page-1)*1).limit(limit)
      const filteredBookingData = BookingData.filter(slot => {
       const user = slot.userId;
       return (
         user.first_name.match(regex) ||
         user.last_name.match(regex) ||
         (user.mobile && user.mobile.toString().match(regex))
       );
     });

      let populatedBooking = await Promise.all(
       filteredBookingData.map(async (slot) => {
         const startDate = slot.startDate;
         const coachID = slot.coachId;
         const CoachSlotBooked = await CoachSlot.findOne({
           batchDate: startDate,
           coachId: coachID,
         }).lean();
         if (CoachSlotBooked) {
           const slotInfo = CoachSlotBooked.slots.find((slotData) => {
             return slotData._id.toString() === slot.slotBooked.toString();
           });
           if (slotInfo) {
             slot.slotBooked = slotInfo;
           }
         }
         return slot;
       })
     );
    return res.status(200).json({
       success: true,
       message: "Coach booking fetched successfully",
       data: populatedBooking,
     });
    }
    else{
      return res.json({
        status:400,
         success: false,
         message: "You have no access to get data",
       });
    }
   } catch (err) {
     console.error(err);
     return res.json({
      status:500,
       success: false,
       message: "Failed to fetch coach booking",
       error: err.message,
     });
   }
 };

 exports.workingfetchCoachBooking = async (req, res) => {
  try {
    const user = req.user.userID;

    if (!user) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "User ID not found",
      });
    }

    const searchQuery = req.query.search || ""; // Search term
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex for search

    // Variables for pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Check if search is provided; if so, disable pagination
    if (searchQuery) {
      page = limit = undefined; // Disable pagination if search query exists
    }

    let filter = {};

    // Role-based filtering
    if (req.user.role === "Coach") {
      filter["coachId"] = user;
    }

    // Fetching data
    const BookingData = await CoachBooking.find(filter)
      .populate("userId coachId")
      .lean()
      .sort({ createdAt: -1 })
      .skip(page && (page - 1) * limit) // Apply skip if page is present
      .limit(limit); // Apply limit only if provided

    // Search filter
    const filteredBookingData = BookingData.filter((slot) => {
      const user = slot.userId;
      const coach = slot.coachId;
      return (
        (user &&
          (user.first_name.match(regex) ||
            user.last_name.match(regex) ||
            (user.mobile && user.mobile.toString().match(regex)))) ||
        (coach && coach.name && coach.name.match(regex)) || // Assuming coach has a "name" field
        slot.slotBooked.toString().match(regex)
      );
    });

    // Populate slot data
    const populatedBooking = await Promise.all(
      filteredBookingData.map(async (slot) => {
        const startDate = slot.startDate;
        const coachID = slot.coachId;
        const CoachSlotBooked = await CoachSlot.findOne({
          batchDate: startDate,
          coachId: coachID,
        }).lean();
        if (CoachSlotBooked) {
          const slotInfo = CoachSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slotBooked.toString();
          });
          if (slotInfo) {
            slot.slotBooked = slotInfo;
          }
        }
        return slot;
      })
    );

    return res.status(200).json({
      success: true,
      message: "Coach bookings fetched successfully",
      data: populatedBooking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch coach bookings",
      error: err.message,
    });
  }
};

exports.fetchCoachBooking = async (req, res) => {
  try {
    const user = req.user.userID;

    if (!user) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "User ID not found",
      });
    }

    const searchQuery = (req.query.search || "").trim(); // Trim whitespaces
    const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex for search

    // Variables for pagination
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Check if search is provided; if so, disable pagination
    if (searchQuery) {
      page = limit = undefined; // Disable pagination if search query exists
    }

    let filter = {};

    // Role-based filtering
    if (req.user.role === "Coach") {
      filter["coachId"] = user;
    }

    // Fetching data
    const BookingData = await CoachBooking.find(filter)
      .populate("userId coachId")
      .lean()
      .sort({ createdAt: -1 })
      .skip(page && (page - 1) * limit) // Apply skip if page is present
      // .limit(limit); // Apply limit only if provided

    // Search filter
    const filteredBookingData = BookingData.filter((slot) => {
      const user = slot.userId || {};
      const coach = slot.coachId || {};

      return (
        (user.first_name && regex.test(user.first_name)) ||
        (user.last_name && regex.test(user.last_name)) ||
        (user.mobile && regex.test(user.mobile.toString())) ||
        (coach.first_name && regex.test(coach.first_name)) ||
        (coach.last_name && regex.test(coach.last_name)) ||
        (coach.mobile && regex.test(coach.mobile.toString())) ||
        (slot.slotBooked && regex.test(slot.slotBooked.toString()))
      );
    });

    // Populate slot data
    const populatedBooking = await Promise.all(
      filteredBookingData.map(async (slot) => {
        const startDate = slot.startDate;
        const coachID = slot.coachId;
        const CoachSlotBooked = await CoachSlot.findOne({
          batchDate: startDate,
          coachId: coachID,
        }).lean();
        if (CoachSlotBooked) {
          const slotInfo = CoachSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slotBooked.toString();
          });
          if (slotInfo) {
            slot.slotBooked = slotInfo;
          }
        }
        return slot;
      })
    );

    return res.status(200).json({
      success: true,
      message: "Coach bookings fetched successfully",
      data: populatedBooking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch coach bookings",
      error: err.message,
    });
  }
};

exports.fetchCoachBooking = exports.actualfetchCoachBooking;

