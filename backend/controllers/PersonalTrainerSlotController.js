const PersonalTrainerSlot = require("../models/PersonalTrainerSlotModel");
const PersonalTrainer =require("../models/PersonalTrainingModel")
const ptslot = require("../models/PersonalTrainerSlotModel")

const timeToMinutes = (time) => {
  const match = String(time || "").match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};
const formatMinutes = (minutes) => `${String(Math.floor((minutes % 1440) / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
exports.addSlotPT = async (req, res) => {
  try {
    const { batch_date,batch_name, slots,package_type } = req.body;
    const Personal_trainer_id = req.params.PTId;

    const batchDateObj = new Date(batch_date);
    for (const slot of slots) {
      const existingSlot = await PersonalTrainerSlot.findOne({
        Personal_trainer_id: Personal_trainer_id,
        batch_date: batchDateObj,
        'slots.startTime': slot.startTime
      });
       
      if (existingSlot) {
        return res.json({
          status:400,
          success: false,
          message: `A slot with start time ${slot.startTime} on ${batch_date} already exists.`,
        });
      }
    }
    const newCoachSlot = await PersonalTrainerSlot.create({
      Personal_trainer_id: Personal_trainer_id,
      batch_date: new Date(batch_date),
      slots,
      batch_name,
      package_type,
      created_by:Personal_trainer_id
    });
    res.json({
      status:200,
      success: true,
      message: "Personal trainer slot created successfully",
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

exports.addSlotPTOld = async (req, res) => {
  try {
    const { Personal_trainer_id, batch_date,batch_name, slots,package_type } = req.body;

    const newSlot = await PersonalTrainerSlot.create({
      Personal_trainer_id,
      batch_date,
      slots,
      batch_name,
      package_type,
    });

    return res.status(200).json({ 
      success: true,
      message: "Slot created Successfuly",
      data: newSlot,
    });
  } catch (err) {
    
    res.status(500).json({
      message: "Error adding slot to personal trainer",
      error: err.message,
    });
  }
};
exports.getPtBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is not found",
      });
    }
    const PtBatch = await PersonalTrainerSlot.find({ Personal_trainer_id: id });
    if (!PtBatch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }
    
    const data =[];
    PtBatch.map((PT)=> {
      data.push({
      batch_name: PT.batch_name,
      batch_date: PT.batch_date,
      id:PT._id,
      package_type:PT.package_type
    })
  }
  );

    return res.status(200).json({
      success: true,
      message: "PT batches data",
      data: data,
    });
  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPtSlots = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is not found",
      });
    }

    const batch = await PersonalTrainerSlot.findById(id);
    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }
    
        return res.status(200).json({
            success:true,
            message:"Slot Found ",
            data:batch.slots
        })


  } catch (err) {
     
     return res.status(500).json({
       success: false,
       message: err.message,
     });
  }
};

exports.deleteCoachBatch = async (req, res) => {
  try {
    const PTSlotId = req.params.PTSlotId;

    // Find the slot by ID
    const slot = await PersonalTrainerSlot.findByIdAndDelete(PTSlotId);

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

exports.updatePTSlotById = async (req, res) => {
  try {
const { batch_date,isBooked,price } = req.body;
const Personal_trainer_id = req.params.PTId
const slotId = req.params.slotId
    const updatedSlot = await PersonalTrainerSlot.updateOne(
      {
        Personal_trainer_id:Personal_trainer_id,
        batch_date: new Date(batch_date),
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
// All in one json
exports.updatePTSlotByIdNew = async (req, res) => {
  try {
    const { coachId, batchName, batchDate, slots, batchSize, package_type } = req.body;
    const PTSlotId = req.params.PTSlotId;

    // Find the slot by ID
    const slot = await PersonalTrainerSlot.findById(PTSlotId);

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



exports.createPersonalTrainerSlot = async (req, res) => {
  try {
    const { start_date, end_date, start_time, end_time, price, offlineBlocked = false, fullDay = false } = req.body;
    const personalTrainerId = req.params.id;

    // Validate the request body
    if (!start_date || !end_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Please provide start_date, end_date, start_time, and end_time",
      });
    }
    const startMinutes = timeToMinutes(start_time);
    const endMinutes = timeToMinutes(end_time);
    if (startMinutes === null || endMinutes === null || (startMinutes === endMinutes && !fullDay)) {
      return res.status(400).json({ success: false, message: "Use valid HH:mm times with different start and end times. 00:00 is supported as midnight." });
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

    // Fetch the personal trainer to get the price per hour
    const personalTrainer = await PersonalTrainer.findById(personalTrainerId);
    if (!personalTrainer) {
      return res.status(404).json({
        success: false,
        message: "Personal Trainer not found",
      });
    }

    const pricePerHour = Number.isFinite(Number(price)) && Number(price) >= 0 ? Number(price) : (personalTrainer.price || 0);

    // Helper function to generate slots for a single day
    const generateSlotsForDay = (date) => {
      const slots = [];
      const overnightEnd = endMinutes <= startMinutes ? endMinutes + 1440 : endMinutes;
      for (let currentMinute = startMinutes; currentMinute < overnightEnd; currentMinute += 30) {
        const nextMinute = Math.min(currentMinute + 30, overnightEnd);
        slots.push({
          start_time: formatMinutes(currentMinute),
          end_time: formatMinutes(nextMinute),
          price: pricePerHour,
          isBooked: Boolean(offlineBlocked),
          isOfflineBlocked: Boolean(offlineBlocked),
        });
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
      const existingSlot = await PersonalTrainerSlot.findOne({
        trainerId: personalTrainerId,
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
      const newSlot = await PersonalTrainerSlot.create({
        trainerId: personalTrainerId,
        start_date: day.batchDate,
        end_date: day.batchDate,
        slots: day.slots,
        created_by: req.user?._id || personalTrainerId, // Assuming logged-in user creates the slot
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
      message: "Failed to create personal trainer slots",
      error: error.message,
    });
  }
};


exports.getAllPersonalTrainerSlotsByTrainerId = async (req, res) => {
  try {
    const personalTrainerId = req.params.id;

    // Validate the personalTrainerId
    if (!personalTrainerId) {
      return res.status(400).json({
        success: false,
        message: "Personal Trainer ID is required",
      });
    }

    // Find all slots for the given personalTrainerId
    const personalTrainerSlots = await PersonalTrainerSlot.find({ trainerId: personalTrainerId }).sort({ start_date: 1 });

    // An empty calendar is valid for a newly registered trainer.
    if (!personalTrainerSlots || personalTrainerSlots.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No slots have been added yet.",
        data: [],
      });
    }

    // Format the response with relevant data
    const formattedSlots = personalTrainerSlots.map(slot => ({
      id: slot._id,
      personalTrainerId: slot.Personal_trainer_id, // Ensure the field name matches
      start_date: slot.start_date,
      end_date: slot.end_date,
      slots: slot.slots.map(s => ({
        start_time: s.start_time, // Ensure field names are consistent
        end_time: s.end_time,
        price: s.price,
        isBooked: s.isBooked,
      })),
      created_by: slot.created_by,
      created_at: slot.created_at,
    }));

    res.status(200).json({
      success: true,
      message: "Personal trainer slots retrieved successfully",
      data: formattedSlots,
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to retrieve personal trainer slots",
      error: error.message,
    });
  }
};

exports.fetchPersonalTrainerSlotByDateId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming `_id` is passed as a route parameter

    // Validate ID
    if (!id || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing slot ID",
      });
    }

    // Fetch the personal trainer slot document by `_id`
    const personalTrainerSlot = await PersonalTrainerSlot.findById(id);

    // Check if the slot exists
    if (!personalTrainerSlot) {
      return res.status(404).json({
        success: false,
        message: "Personal Trainer Slot not found",
      });
    }

    // Respond with the slot data
    return res.status(200).json({
      success: true,
      data: personalTrainerSlot,
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
      message: "Failed to fetch personal trainer slot",
      error: error.message,
    });
  }
};


 exports.adeleteSlotsByDateRangePt = async (req, res) => {
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
exports.deleteSlotsByDateRangept = async (req, res) => {
  try {
    const { trainerId,start_date, end_date, start_time, end_time } = req.body; // Destructure the request body

    // Convert start and end date to ISODate format for comparison
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Find the personal trainer's slots based on trainerId or personalTrainerId and date range
    const personalTrainerSlots = await ptslot.find({ 
        trainerId: trainerId,   
      start_date: { $gte: startDate, $lte: endDate },
      "slots.start_time": { $gte: start_time, $lte: end_time }
    });

    if (!personalTrainerSlots || personalTrainerSlots.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching slots found"
      });
    }

    // Loop through the found personal trainer slots and delete matching slots
    let deletedCount = 0;

    for (let personalTrainerSlot of personalTrainerSlots) {
      // Filter out the slots based on start_time and end_time, and only delete if not booked
      const filteredSlots = personalTrainerSlot.slots.filter(slot => {
        return (
          slot.start_time >= start_time &&
          slot.end_time <= end_time &&
          !slot.isBooked // Ensure the slot is not booked
        );
      });

      if (filteredSlots.length > 0) {
        // Remove the slots that are not booked
        personalTrainerSlot.slots = personalTrainerSlot.slots.filter(slot => 
          !(slot.start_time >= start_time && slot.end_time <= end_time && !slot.isBooked)
        );
        await personalTrainerSlot.save(); // Save the updated slots
        deletedCount += filteredSlots.length;
      } else {
        // Check for booked slots and send an error message if any are found
        const bookedSlots = personalTrainerSlot.slots.filter(slot => 
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

exports.carryForwardPersonalTrainerSlots = async (req, res) => {
  try {
    const { sourceDate, targetDateFrom, targetDateTo } = req.body;
    const trainerId = req.params.trainerId;
    if (!sourceDate || !targetDateFrom || !targetDateTo || targetDateFrom > targetDateTo) return res.status(400).json({ success: false, message: "Choose a valid source date and target date range." });
    const sourceStart = new Date(`${sourceDate}T00:00:00`);
    const sourceEnd = new Date(sourceStart); sourceEnd.setDate(sourceEnd.getDate() + 1);
    const source = await PersonalTrainerSlot.findOne({ trainerId, start_date: { $gte: sourceStart, $lt: sourceEnd } });
    if (!source) return res.status(404).json({ success: false, message: "No slots found on the source date." });
    const targets = [];
    for (let date = new Date(`${targetDateFrom}T00:00:00`); date <= new Date(`${targetDateTo}T00:00:00`); date.setDate(date.getDate() + 1)) targets.push(new Date(date));
    const conflicts = await PersonalTrainerSlot.find({ trainerId, start_date: { $gte: targets[0], $lt: new Date(targets[targets.length - 1].getTime() + 86400000) } }).select("start_date");
    if (conflicts.length) return res.status(409).json({ success: false, message: "One or more target dates already have slots. No slots were copied." });
    await PersonalTrainerSlot.insertMany(targets.map((date) => ({ trainerId, start_date: date, end_date: date, created_by: req.user?._id || trainerId, slots: source.slots.map((slot) => ({ start_time: slot.start_time, end_time: slot.end_time, price: slot.price, isBooked: false, isOfflineBlocked: false })) })));
    return res.json({ success: true, message: "Slots carried forward successfully." });
  } catch (error) { return res.status(500).json({ success: false, message: "Could not carry forward slots.", error: error.message }); }
};
