const Venue1 = require("../models/Venue1");
const Slot = require("../models/SlotModel");
const mongoose = require('mongoose');

const { ObjectId } = require("mongodb");
// Controller to create slots
exports.actualcreateSlots = async (req, res) => {
  try {
    const { dateFrom, dateTo, slots } = req.body;
    const venue_id = req.params.id;
    

    for (
      let currentDate = new Date(dateFrom);
      currentDate <= new Date(dateTo);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      // Find existing slots for the given venue_id and date
      const existingSlots = await Slot.findOne({
        venue_id: venue_id,
        date: currentDate,
      });

      if (existingSlots) {
        

        // Iterate through the slots provided in the request body
        for (let slot of slots) {
          // Check if this slot already exists in the existing slot array
          const slotExists = existingSlots.slots.some(
            (existingSlot) =>
              existingSlot.startTime === slot.startTime && existingSlot.endTime === slot.endTime
          );

          // An offline block may target a slot that already exists. In that
          // case reserve the existing slot instead of silently skipping it.
          if (slotExists && slot.isOfflineBlocked) {
            const existingSlot = existingSlots.slots.find(
              (item) => item.startTime === slot.startTime && item.endTime === slot.endTime
            );
            existingSlot.isBooked = true;
            existingSlot.isOfflineBlocked = true;
          } else if (!slotExists) {
            existingSlots.slots.push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              price: slot.price,
              isBooked: Boolean(slot.isBooked),
              isOfflineBlocked: Boolean(slot.isOfflineBlocked),
            });
          }
        }

        // Save the updated slots back to the database
        await existingSlots.save();
        
      } else {
        // If no slots exist for the date, create new slots
        const slotArray = slots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isBooked: Boolean(slot.isBooked),
          isOfflineBlocked: Boolean(slot.isOfflineBlocked),
        }));

        const newSlots = await Slot.create({
          venue_id: venue_id,
          date: currentDate,
          slots: slotArray,
        });
        
      }
    }

    return res.status(200).json({ message: "Slots created/updated successfully" });
  } catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};
exports.createSlots = async (req, res) => {
  try {
    const { dateFrom, dateTo, slots } = req.body;
    const venue_id = req.params.id;
    

    for (
      let currentDate = new Date(dateFrom);
      currentDate <= new Date(dateTo);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      // Normalize the currentDate to midnight
      const normalizedDate = new Date(currentDate);
      normalizedDate.setUTCHours(0, 0, 0, 0);

      // Find existing slots for the given venue_id and date
      const existingSlots = await Slot.findOne({
        venue_id: venue_id,
        date: normalizedDate,
      });

      if (existingSlots) {
        

        // Iterate through the slots provided in the request body
        for (let slot of slots) {
          // Check if this slot already exists in the existing slot array
          const slotExists = existingSlots.slots.some(
            (existingSlot) =>
              existingSlot.startTime === slot.startTime && existingSlot.endTime === slot.endTime
          );

          // An offline block may target a slot that already exists. In that
          // case reserve the existing slot instead of silently skipping it.
          if (slotExists && slot.isOfflineBlocked) {
            const existingSlot = existingSlots.slots.find(
              (item) => item.startTime === slot.startTime && item.endTime === slot.endTime
            );
            existingSlot.isBooked = true;
            existingSlot.isOfflineBlocked = true;
          } else if (!slotExists) {
            existingSlots.slots.push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              price: slot.price,
              isBooked: Boolean(slot.isBooked),
              isOfflineBlocked: Boolean(slot.isOfflineBlocked),
            });
          }
        }

        // Save the updated slots back to the database
        await existingSlots.save();
        
      } else {
        // If no slots exist for the date, create new slots
        const slotArray = slots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isBooked: Boolean(slot.isBooked),
          isOfflineBlocked: Boolean(slot.isOfflineBlocked),
        }));

        const newSlots = await Slot.create({
          venue_id: venue_id,
          date: normalizedDate,
          slots: slotArray,
        });
        
      }
    }

    return res.status(200).json({ message: "Slots created/updated successfully" });
  } catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
};


// Controller to fetch slots and create if not found
exports.fetchSlots = async (req, res) => {
  try {
    const venueId = req.params.id;
    // const {date} = req.body;
    const date = req.query.date;
    const dateValue = new Date(date);

    let slotAvailable = await Slot.findOne({
      venue_id: venueId,
      date: dateValue,
    });

    if (!slotAvailable) {
      // Fetch venue's default pricing
      const venue = await Venue1.findById(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      const defaultPrice = venue.defaultPrice ?venue.defaultPrice:1250; // Assuming defaultPrice field exists in Venue1 model

      // Create 24 hourly slots for the date
      const slotsForDate = [];
      for (let hour = 0; hour < 24; hour++) {
        let startHour = hour < 10 ? `0${hour}` : hour;
        let endHour = hour + 1 < 10 ? `0${hour + 1}` : hour + 1;
        slotsForDate.push({
          startTime: `${startHour}:00`,
          endTime: `${endHour === 24 ? "00" : endHour}:00`,
          price: defaultPrice,
          isBooked: false,
        });
      }

      slotAvailable = await Slot.create({
        venue_id: venueId,
        date: dateValue,
        slots: slotsForDate,
      });
    }

    return res.status(200).json({
      data: slotAvailable,
    });
  } catch (err) {
    
    return res.status(500).json({ error:err.message });
  }
};

exports.actualgetAllSlotsByVenueId = async (req, res) => {
  try {
 
    const venueId = req.params.venueId;

    let slotAvailable = await Slot.find({
      venue_id: venueId,
    });
    // let today = new Date()
    // const filterData = slotAvailable.filter(slot=>{
    //   return today <= new Date(slot.date)
    // }) 
    return res.json({
      status:200,
      success:true,
      data: slotAvailable
        });
  } catch (err) {
    
    return res.status(500).json({ error:err.message });
  }
};

exports.getAllSlotsByVenueId = async (req, res) => {
  try {
    const venueId = req.params.venueId;

    // Fetch all slots for the given venueId
    let slotAvailable = await Slot.find({
      venue_id: venueId,
    });

    // Get today's date, set time to midnight to compare only the date part
    let today = new Date();
    today.setHours(0, 0, 0, 0);  // Set the time to the start of the day

    // Filter out slots where the date is in the past
    const filteredSlots = slotAvailable.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= today;  // Only keep slots with a date >= today
    });

    return res.json({
      status: 200,
      success: true,
      data: filteredSlots
    });
  } catch (err) {
    
    return res.status(500).json({ error: err.message });
  }
};


exports.getSlotsBySlotID = async (req, res) => {
  try {
 
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'slotID is required' });
  }
   // Validate ObjectId
   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid slotID format' });
}
    let slot = await Slot.findById(id);
    return res.status(200).json({
      data: slot,
        });
  } catch (err) {
    
    return res.status(500).json({ error:err.message });
  }
};

exports.updateSlotBySlotID= async (req, res) => {
  try {
    const { slotsToUpdate } = req.body;

    if (!slotsToUpdate || slotsToUpdate.length === 0) {
      return res.status(400).json({ message: "No slots provided for update" });
    }

    // Assuming you already have the slot record with venue_id, date, etc.
    const slot = await Slot.findById(req.params.id); // Getting the slot document

    if (!slot) {
      return res.status(400).json({ message: "Slot not found" });
    }

    // Loop through the array and update each slot inside the slots array
    for (const slotData of slotsToUpdate) {
      // Find the slot in the array and update it
      const slotIndex = slot.slots.findIndex(s => s._id.toString() === slotData._id);
      if (slotIndex !== -1) {
        // Update the embedded Mongoose document directly so newly added
        // fields such as isOfflineBlocked are reliably persisted.
        Object.assign(slot.slots[slotIndex], slotData);
      }
    }

    // Save the updated slot back to the database
    slot.markModified("slots");
    await slot.save();

    return res.status(200).json({
      success: true,
      message: "Slots updated successfully",
      data: slot
    });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getSlotById = async (req, res) => {
  try {
    const { slot_id } = req.params;

    // Validate slot_id
    if (!ObjectId.isValid(slot_id)) {
      return res.status(400).json({ message: "Invalid slot_id" });
    }

    // Fetch the slot details from the database
    const slotDetails = await Slot.aggregate([
      { $unwind: "$slots" },
      { $match: { "slots._id": new ObjectId(slot_id) } },
      {
        $project: {
          _id: 0,
          startTime: "$slots.startTime",
          endTime: "$slots.endTime",
          price: "$slots.price",
          isBooked: "$slots.isBooked",
          isOfflineBlocked: "$slots.isOfflineBlocked"
        }
      }
    ]);

    // Check if slot details are found
    if (slotDetails.length > 0) {
      return res.status(200).json({
        message: "Slot details found",
        data: { slot: slotDetails[0] }
      });
    } else {
      return res.status(404).json({
        message: "Slot not found for the given slot_id"
      });
    }
  } catch (error) {
    
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.deleteSlotBySlotID = async (req, res) => {
  try {
    const { id } = req.params; // Get slot ID from request params
     // Log slotId to see its format

    // Check if the slotId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Slot ID" });
    }

    // Find the slot document that contains this slot
    const slot = await Slot.findOne({ "slots._id": new mongoose.Types.ObjectId(id) });

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    // Find the specific slot inside the slots array
    const slotIndex = slot.slots.findIndex(s => s._id.toString() === id);

    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: "Slot not found in venue" });
    }

    // Check if the slot is booked
    if (slot.slots[slotIndex].isBooked) {
      return res.status(200).json({ success: true, message: "This slot cannot be deleted as it has already been booked." });
    }

    // Remove the slot from the array
    slot.slots.splice(slotIndex, 1);

    // Save the updated slot document
    await slot.save();

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: slot
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.carryForwardSlots = async (req, res) => {
  try {
    const venue_id = req.params.id;
    const { sourceDate, targetDateFrom, targetDateTo } = req.body;

    if (!sourceDate || !targetDateFrom || !targetDateTo) {
      return res.status(400).json({ success: false, message: "Missing source or target date fields" });
    }

    const srcDateObj = new Date(sourceDate);
    srcDateObj.setUTCHours(0, 0, 0, 0);

    const sourceSlotDoc = await Slot.findOne({
      venue_id,
      date: srcDateObj
    });

    if (!sourceSlotDoc || !sourceSlotDoc.slots || sourceSlotDoc.slots.length === 0) {
      return res.status(404).json({ success: false, message: "No slots found on source date to carry forward" });
    }

    const cleanSlots = sourceSlotDoc.slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      isBooked: false,
      isOfflineBlocked: false
    }));

    let datePointer = new Date(targetDateFrom);
    const dateEnd = new Date(targetDateTo);

    while (datePointer <= dateEnd) {
      const normalizedTargetDate = new Date(datePointer);
      normalizedTargetDate.setUTCHours(0, 0, 0, 0);

      const targetSlotDoc = await Slot.findOne({
        venue_id,
        date: normalizedTargetDate
      });

      if (targetSlotDoc) {
        for (let newSlot of cleanSlots) {
          const matchIndex = targetSlotDoc.slots.findIndex(
            s => s.startTime === newSlot.startTime && s.endTime === newSlot.endTime
          );
          if (matchIndex === -1) {
            targetSlotDoc.slots.push(newSlot);
          } else {
            if (!targetSlotDoc.slots[matchIndex].isBooked) {
              targetSlotDoc.slots[matchIndex].price = newSlot.price;
              targetSlotDoc.slots[matchIndex].isOfflineBlocked = false;
            }
          }
        }
        await targetSlotDoc.save();
      } else {
        await Slot.create({
          venue_id,
          date: normalizedTargetDate,
          slots: cleanSlots
        });
      }

      datePointer.setDate(datePointer.getDate() + 1);
    }

    return res.status(200).json({ success: true, message: "Slots carried forward successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
