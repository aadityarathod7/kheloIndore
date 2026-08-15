const mongoose = require("mongoose");
const CoachSlot = require("../models/CoachSlotsModel");
const Coach = require("../models/CoachModel");

// Create new coach slot

exports.actualcreateCoachSlot = async (req, res) => {
  try {
    const { batchName, batchDate, slots, batchSize, package_type } = req.body;
    const coachId = req.params.coachId;

    const batchDateObj = new Date(batchDate);
    for (const slot of slots) {
      const existingSlot = await CoachSlot.findOne({
        coachId: coachId,
        batchDate: batchDateObj,
        'slots.startTime': slot.startTime
      });
       
      if (existingSlot) {
        return res.json({
          status:400,
          success: false,
          message: `A slot with start time ${slot.startTime} on ${batchDate} already exists.`,
        });
      }
    }
    const newCoachSlot = await CoachSlot.create({
      coachId: coachId,
      batchDate: new Date(batchDate),
      slots,
      batchSize,
      batchName,
      package_type,
      created_by:coachId
    });
    res.json({
      status:200,
      success: true,
      message: "Coach slot created successfully",
      data: newCoachSlot,
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to create coach slot",
      error: error.message,
    });
  }
};

exports.createCoachSlot = async (req, res) => {
  try {
    const { start_date, end_date, start_time, end_time } = req.body;
    const coachId = req.params.coachId;

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

    // Fetch the coach to get the price per hour
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    const pricePerHour = coach.price || 0; // Assuming price is a field in the Coach model

    // Helper function to generate slots for a single day
    const generateSlotsForDay = (date) => {
      const slots = [];
      const startTimeParts = start_time.split(":");
      const endTimeParts = end_time.split(":");

      let currentHour = parseInt(startTimeParts[0], 10);
      const endHour = parseInt(endTimeParts[0], 10);

      while (currentHour < endHour) {
        const nextHour = currentHour + 1;
        slots.push({
          start_time: `${currentHour.toString().padStart(2, "0")}:00`,
          end_time: `${nextHour.toString().padStart(2, "0")}:00`,
          price: pricePerHour,
          isBooked: false,
        });
        currentHour = nextHour;
      }
      return slots;
    };

    // Generate slots for each day in the date range
    const allSlots = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const slotsForDay = generateSlotsForDay(currentDate);
      allSlots.push({
        batchDate: new Date(currentDate),
        slots: slotsForDay,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check for existing slots with overlapping times
    for (const day of allSlots) {
      const existingSlot = await CoachSlot.findOne({
        coachId: coachId,
        start_date: day.batchDate,
      });

      if (existingSlot) {
        return res.status(400).json({
          success: false,
          message: `Slots for the date ${day.batchDate.toISOString().split("T")[0]} already exist.`,
        });
      }
    }

    // Save slots to the database
    const savedSlots = [];
    for (const day of allSlots) {
      const newSlot = await CoachSlot.create({
        coachId: coachId,
        start_date: day.batchDate,
        end_date: day.batchDate,
        slots: day.slots,
        created_by: req.user?._id || coachId, // Assuming logged-in user creates the slot
      });
      savedSlots.push(newSlot);
    }

    res.status(201).json({
      success: true,
      message: "Slots created successfully",
      data: savedSlots,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to create coach slots",
      error: error.message,
    });
  }
};

exports.actualgetAllCoachesSlotsByCoachId = async(req,res)=>{
  try {
    const todayDate = new Date()
    const coachId = req.params.coachId
    let coachSlotData= await CoachSlot.find({coachId:coachId})
    const filterData =coachSlotData.filter(slot=>{
      const batchData = new Date(slot.batchDate)
      return todayDate<= batchData 
    }) 
    res.status(200).json({
      success: true,
      message: "Coach slot retireved successfully",
      data: filterData,
      // data: coachSlotData,
    });
  } catch (error) {
    
    
  }
}
exports.getAllCoachesSlotsByCoachId = async (req, res) => {
  try {
    const coachId = req.params.coachId;

    // Validate the coachId
    if (!coachId) {
      return res.status(400).json({
        success: false,
        message: "Coach ID is required",
      });
    }

    // Find all slots for the given coachId
    const coachSlots = await CoachSlot.find({ coachId }).sort({ start_date: 1 });

    // An empty calendar is a valid first-time state, not an API error.
    if (!coachSlots || coachSlots.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No slots have been added yet.",
        data: [],
      });
    }

    // Format the response with relevant data
    const formattedSlots = coachSlots.map(slot => ({
      id: slot._id,
      coachId: slot.coachId,
      start_date: slot.start_date,
      end_date: slot.end_date,
      slots: slot.slots.map(s => ({
        start_time: s.start_time,
        end_time: s.end_time,
        price: s.price,
        isBooked: s.isBooked,
      })),
      created_by: slot.created_by,
      created_at: slot.created_at,
    }));

    res.status(200).json({
      success: true,
      message: "Coach slots retrieved successfully",
      data: formattedSlots,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to retrieve coach slots",
      error: error.message,
    });
  }
};


exports.updateCoachSlotById = async (req, res) => {
  try {
const { batchDate,isBooked,price } = req.body;
const coachId = req.params.coachId
const slotId = req.params.slotId
    const updatedSlot = await CoachSlot.updateOne(
      {
        coachId: coachId,
        batchDate: new Date(batchDate),
        "slots._id": slotId,
      },
      {
        $set: {
          // "slots.$.personCount": personCount,
          "slots.$.isBooked": isBooked,
          "slots.$.price": price,
        },
      }
    );
    
    
// return
    if (updatedSlot.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or no changes made",
      });
    }

    res.status(200).json({
      success: true,
      message: "Slot updated successfully",
      data: updatedSlot,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update slot",
      error: error.message,
    });
  }
};
// All send in json
exports.updateCoachSlotByIdNew = async (req, res) => {
  try {
    const { coachId, batchName, batchDate, slots, batchSize, package_type } = req.body;
    const coachSlotId = req.params.coachSlotId;

    // Find the slot by ID
    const slot = await CoachSlot.findById(coachSlotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }
    if (coachId !== undefined) slot.coachId = coachId;
    if (batchName !== undefined) slot.batchName = batchName;
    if (batchDate !== undefined) slot.batchDate = batchDate;
    if (slots !== undefined) slot.slots = slots;
    if (batchSize !== undefined) slot.batchSize = batchSize;
    if (batchpackage_typeType !== undefined) slot.package_type = package_type;

    await slot.save();

    res.status(200).json({
      success: true,
      message: "Slot updated successfully",
      data: slot,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update slot",
      error: error.message,
    });
  }
};
exports.deleteCoachBatch = async (req, res) => {
  try {
    const coachSlotId = req.params.coachSlotId;

    // Find the slot by ID
    const slot = await CoachSlot.findByIdAndDelete(coachSlotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }
    res.json({
      status:200,
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update slot",
      error: error.message,
    });
  }
};

// Get coach slots by coachId and batchDate
exports.getCoachBatchSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const slots = await CoachSlot.findById(id);

    if (!slots) {
      return res.status(404).json({
        success: false,
        message: "No slots found for the specified coach and date",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coach slots retrieved successfully",
      data: slots,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to retrieve coach slots",
      error: error.message,
    });
  }
};

exports.fetchAllCoachBatches = async (req, res) => {
  try {
    const coachId = req.params.id;
    const coachSlot = await CoachSlot.find({ coachId: coachId });
    
    const filterData = coachSlot.filter(slot=>{
      const today= new Date()
      // return today <= new Date(slot.date)
      return today <= new Date(slot.batchDate)
    })
  
    const batchData = [];
    coachSlot.map((coachSloting) => {
      batchData.push({
        batchName: coachSloting.batchName,
        batchDate: coachSloting.batchDate,
        batchSize: coachSloting.batchSize,
        batchId:coachSloting._id
      });
    });
    res.status(200).json({
      success: true,
      message: "All coach slots fetched successfully",
      data: filterData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all coach slots",
      error: err.message,
    });
  }
};
// Update a specific slot's person count and booking status
exports.updateSlot = async (req, res) => {
  try {
    const { coachId, batchDate, slotId, personCount, isBooked } = req.body;

    const updatedSlot = await CoachSlot.updateOne(
      {
        coachId: mongoose.Types.ObjectId(coachId),
        batchDate: new Date(batchDate),
        "slots._id": mongoose.Types.ObjectId(slotId),
      },
      {
        $set: {
          "slots.$.personCount": personCount,
          "slots.$.isBooked": isBooked,
        },
      }
    );

    if (updatedSlot.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or no changes made",
      });
    }

    res.status(200).json({
      success: true,
      message: "Slot updated successfully",
      data: updatedSlot,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to update slot",
      error: error.message,
    });
  }
};

// Delete a specific coach slot
exports.deleteCoachSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSlot = await CoachSlot.findByIdAndDelete(id);

    if (!deletedSlot) {
      return res.status(404).json({
        success: false,
        message: "Coach slot not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coach slot deleted successfully",
      data: deletedSlot,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to delete coach slot",
      error: error.message,
    });
  }
};


// fetch one day slot by slotid 
exports.fetchCoachSlotByDateId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming `_id` is passed as a route parameter

    // Validate ID
    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing slot ID",
      });
    }

    // Fetch the slot document by `_id`
    const coachSlot = await CoachSlot.findById(id);

    // Check if the slot exists
    if (!coachSlot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    // Respond with the slot data
    return res.status(200).json({
      success: true,
      data: coachSlot,
    });
  } catch (error) {
    

    // Handle specific errors like invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid slot ID format",
      });
    }

    // Generic server-side error response
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coach slot",
      error: error.message,
    });
  }
};


exports.updateCoachSlotBooking = async (req, res) => {
  try {
    const { start_date, end_date, start_time, end_time } = req.body;
    const coachId = req.params.id;

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
    const coach = await Coach.findById(coachId);
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
      const coachSlot = await CoachSlot.findOne({
        coachId: coachId,
        start_date: currentDate,
        "slots.start_time": start_time,
        "slots.end_time": end_time,
      });

      if (!coachSlot) {
        return res.status(404).json({
          success: false,
          message: `No slot found for the time ${start_time} to ${end_time} on ${currentDate.toISOString().split("T")[0]}`,
        });
      }

      // Find and update the specific slot's isBooked status
      const slotToUpdate = coachSlot.slots.find(
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
      await coachSlot.save();

      // Add the updated slot to the response array
      updatedSlots.push({
        coachSlotId: coachSlot._id,
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
    
    res.status(500).json({
      success: false,
      message: "Failed to update coach slot booking",
      error: error.message,
    });
  }
};
 // Assuming you have the Slot model

 exports.deleteSlotsByDateRangeCoach = async (req, res) => {
  try {
    const { coachId, start_date, end_date, start_time, end_time } = req.body; // Destructure the request body

    // Convert start and end date to ISODate format for comparison
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Find the coach's slot based on coachId and date range
    const coachSlots = await CoachSlot.find({
      coachId: coachId,
      start_date: { $gte: startDate, $lte: endDate },
      "slots.start_time": { $gte: start_time, $lte: end_time }
    });

    if (!coachSlots || coachSlots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching slots found"
      });
    }

    // Loop through the found coach slots and delete matching slots
    let deletedCount = 0;

    for (let coachSlot of coachSlots) {
      // Filter out the slots based on start_time and end_time, and only delete if not booked
      const filteredSlots = coachSlot.slots.filter(slot => {
        return (
          slot.start_time >= start_time &&
          slot.end_time <= end_time &&
          !slot.isBooked // Ensure the slot is not booked
        );
      });

      if (filteredSlots.length > 0) {
        // Remove the slots that are not booked
        coachSlot.slots = coachSlot.slots.filter(slot => 
          !(slot.start_time >= start_time && slot.end_time <= end_time && !slot.isBooked)
        );
        await coachSlot.save(); // Save the updated slots
        deletedCount += filteredSlots.length;
      } else {
        // Check for booked slots and send an error message if any are found
        const bookedSlots = coachSlot.slots.filter(slot => 
          slot.start_time >= start_time && slot.end_time <= end_time && slot.isBooked
        );

        if (bookedSlots.length > 0) {
          return res.status(400).json({
            success: false,
            message: "One or more slots are already booked and cannot be deleted."
          });
        }
      }
    }

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No slots were deleted as all matching slots are booked"
      });
    }

    return res.status(200).json({
      success: true,
      message: `${deletedCount} slots deleted successfully`,
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

