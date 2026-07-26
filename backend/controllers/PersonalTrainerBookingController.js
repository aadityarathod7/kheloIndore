 const PersonalTrainerBookingModel = require('../models/PersonalTrainerBookingModel');
const PersonalTrainerBooking = require('../models/PersonalTrainerBookingModel');
 const PersonalTrainerSlot = require('../models/PersonalTrainerSlotModel')

exports.createPTBooking = async (req, res) => {
  try {
    const {
      pt_id,
      user_id,
      batch_id,
      slot_id,
      batch_name,
      package_type,
      start_date,
    } = req.body;

    const batch = await PersonalTrainerSlot.findById(batch_id);
    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }

    const BatchSlots = batch.slots;
    let index = -1;
    let BookedSlot;
    const flag = BatchSlots.some((slot, idx) => {
      if (slot.id == slot_id) {
        index = idx;
        BookedSlot = slot;
        return slot.isBooked;
      }
      return false;
    });

    if (flag) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // Determine end date based on package type
    let end_date;
    switch (package_type.toLowerCase()) {
      case "monthly":
        end_date = new Date(start_date);
        end_date.setMonth(end_date.getMonth() + 1);
        break;
      case "quarterly":
        end_date = new Date(start_date);
        end_date.setMonth(end_date.getMonth() + 3);
        break;
      case "yearly":
        end_date = new Date(start_date);
        end_date.setFullYear(end_date.getFullYear() + 1);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid package type",
        });
    }

    batch.slots[index].isBooked = true;
    await batch.save();

    const newBooking = await PersonalTrainerBookingModel.create({
      user_id,
      pt_id,
      slot_id,
      batch_id,
      batch_name,
      package_type,
      start_date,
      end_date,
    });

    return res.status(200).json({
      success: true,
      message: "Slot booked successfully",
      data: newBooking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error booking slot",
      error: err.message,
    });
  }
};

exports.wgetPTBooking = async (req, res) => {
  try {
    const userId = req.user.userID; // Logged-in user's ID
    const userRole = req.user.role; // Logged-in user's role

    if (!userId) {
      return res.status(500).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Check if the logged-in user is a Personal Trainer
    let query = {};
    if (userRole === "Personal Trainer") {
      query = { pt_id: userId }; // Filter bookings for this personal trainer
    }

    const searchQuery = req.query.search || ''; // Search term
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex for search

    // Fetch data based on the role and search term
    const BookingData = await PersonalTrainerBookingModel.find(query)
      .populate('user_id pt_id')
      .sort({ createdAt: -1 }) // Populate user and PT details
      .lean();

    // Filter bookings based on the search query
    const filteredBookingData = BookingData.filter((booking) => {
      const user = booking.user_id;
      return (
        (user &&
          (user.first_name.match(regex) ||
            user.last_name.match(regex) ||
            (user.mobile && user.mobile.toString().match(regex)))) ||
        (booking.pt_id &&
          booking.pt_id.name &&
          booking.pt_id.name.match(regex)) || // Assuming PT has a name field
        booking.slot_id
      );
    });

    // Populate slot details for filtered bookings
    const populatedBooking = await Promise.all(
      filteredBookingData.map(async (slot) => {
        const startDate = slot.start_date;
        const pt_id = slot.pt_id;
        const ptSlotBooked = await PersonalTrainerSlot.findOne({
          batch_date: startDate,
          Personal_trainer_id: pt_id,
        }).lean();
        if (ptSlotBooked) {
          const slotInfo = ptSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slot_id.toString();
          });
          if (slotInfo) {
            slot.slot_id = slotInfo;
          }
        }
        return slot;
      })
    );

    return res.status(200).json({
      success: true,
      message: "Personal Trainer booking fetched successfully",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Error fetching PT booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch personal trainer bookings",
      error: error.message,
    });
  }
};
exports.getPTBooking = async (req, res) => {
  try {
    const userId = req.user.userID; // Logged-in user's ID
    const userRole = req.user.role; // Logged-in user's role

    if (!userId) {
      return res.status(500).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Base query
    let query = {};
    if (userRole === "Personal Trainer") {
      query = { pt_id: userId }; // Filter bookings for this personal trainer
    }

    const searchQuery = req.query.search || ''; // Search term
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex

    const statusFilter = req.query.status || ''; // Booking status filter
    const paymentStatusFilter = req.query.paymentStatus || ''; // Payment status filter
    const startDateFilter = req.query.startDate; // Start date filter
    const endDateFilter = req.query.endDate; // End date filter

    // Date range filter
    if (startDateFilter && endDateFilter) {
      query.start_date = {
        $gte: new Date(startDateFilter),
        $lte: new Date(endDateFilter),
      };
    }

    // Fetch data based on query
    const BookingData = await PersonalTrainerBookingModel.find(query)
      .populate('user_id pt_id')
      .sort({ createdAt: -1 })
      .lean();

    // Filter bookings based on search, status, and payment status
    const filteredBookingData = BookingData.filter((booking) => {
      const user = booking.user_id;
      const pt = booking.pt_id;

      return (
        (user &&
          (user.first_name.match(regex) ||
            user.last_name.match(regex) ||
            (user.mobile && user.mobile.toString().match(regex)))) ||
        (pt && pt.name && pt.name.match(regex)) || // Assuming PT has a name field
        (booking.slot_id && booking.slot_id.toString().match(regex))
      ) &&
      (statusFilter ? booking.status === statusFilter : true) &&
      (paymentStatusFilter ? booking.paymentStatus === paymentStatusFilter : true);
    });

    // Populate slot details for filtered bookings
    const populatedBooking = await Promise.all(
      filteredBookingData.map(async (slot) => {
        const startDate = slot.start_date;
        const pt_id = slot.pt_id;
        const ptSlotBooked = await PersonalTrainerSlot.findOne({
          batch_date: startDate,
          Personal_trainer_id: pt_id,
        }).lean();

        if (ptSlotBooked) {
          const slotInfo = ptSlotBooked.slots.find((slotData) => {
            return slotData._id.toString() === slot.slot_id.toString();
          });

          if (slotInfo) {
            slot.slot_id = slotInfo;
          }
        }

        return slot;
      })
    );

    return res.status(200).json({
      success: true,
      message: "Personal Trainer booking fetched successfully",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Error fetching PT booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch personal trainer bookings",
      error: error.message,
    });
  }
};

exports.cancelPtSlotBooking = async (req, res) => {
  try {
    const { start_date, end_date, start_time, end_time } = req.body;
    const ptId = req.params.id;

    // Validate the request body
    if (!start_date || !end_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Please provide start_date, end_date, start_time, and end_time",
      });
    }

    // Convert start_date and end_date to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Ensure start_date is before end_date
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    // Fetch the coach to ensure they exist
    const coach = await PersonalTrainerSlot.findById(ptId);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    // Loop through the date range to update slots
    let currentDate = new Date(startDate);
    const updatedSlots = [];

    while (currentDate <= endDate) {
      // Find the coach slot for the current date and time
      const PersonalTrainerSlot = await PersonalTrainerSlot.findOne({
        ptId: ptId,
        start_date: currentDate,
        "slots.start_time": start_time,
        "slots.end_time": end_time,
      });

      if (!PersonalTrainerSlot) {
        return res.status(404).json({
          success: false,
          message: `No slot found for the time ${start_time} to ${end_time} on ${currentDate.toISOString().split("T")[0]}`,
        });
      }

      // Find and update the specific slot's isBooked status
      const slotToUpdate = PersonalTrainerSlot.slots.find(
        (slot) => slot.start_time === start_time && slot.end_time === end_time
      );

      if (!slotToUpdate) {
        return res.status(404).json({
          success: false,
          message: `No slot found for the time ${start_time} to ${end_time} on ${currentDate.toISOString().split("T")[0]}`,
        });
      }

      // If slot is already booked, return an error
      if (slotToUpdate.isBooked) {
        return res.status(400).json({
          success: false,
          message: `Slot from ${start_time} to ${end_time} on ${currentDate.toISOString().split("T")[0]} is already booked.`,
        });
      }

      // Update the isBooked status to true
      slotToUpdate.isBooked = false;
      await PersonalTrainerSlot.save();

      // Add the updated slot to the response array
      updatedSlots.push({
        trainerId: PersonalTrainerSlot._id,
        date: currentDate.toISOString().split("T")[0],
        start_time: start_time,
        end_time: end_time,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Respond with the successfully updated slots
    res.status(200).json({
      success: true,
      message: "Slots booked successfully for the selected period",
      data: updatedSlots,
    });
  } catch (error) {
    console.error("Error updating coach slot booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coach slot booking",
      error: error.message,
    });
  }
};