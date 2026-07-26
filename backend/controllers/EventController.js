const Event = require("../models/EventModel");


exports.createEvent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty",
      });
    }

    let {
      event_name,
      description,
      start_date,
      end_date,
      location,
      images,
      price,
      organized_by,
      terms_and_conditions,
    } = req.body;
    let user = req.user.userID
    if(!user){
      return res.json({
      status:500,
      success:false,
       message: "User Id not found" })
        }
        if( req.user.role == "Super Admin"){ 
    if (
      !event_name ||
      typeof event_name !== "string" ||
      event_name.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Event name is required and must be a non-empty string",
        });
    }

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }

    if (!start_date) {
      return res
        .status(400)
        .json({ success: false, message: "Start date is required" });
    }

    if (!end_date) {
      return res
        .status(400)
        .json({ success: false, message: "End date is required" });
    }

    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location is required" });
    }

    // Check for event name uniqueness
    const existingEvent = await Event.findOne({
      event_name: event_name.trim(),
    });
    if (existingEvent) {
      return res
        .status(400)
        .json({
          success: false,
          message: "An event with this name already exists",
        });
    }

    const event = new Event({
      event_name: event_name.trim(),
      description,
      start_date,
      end_date,
      location,
      images: images || [],
      price: price !== undefined ? price : null,
      organized_by: organized_by || "",
      terms_and_conditions: terms_and_conditions || "",
    });

    await event.save();

    return res.json({
      status:200,
      success: true,
      message: "Event created successfully",
      data: event,
    });
  }
  else{
    return res.json({
      status:400,
      success: false,
      message: "You have no access to add events",
    });
  }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event ) {
      return res.status(400).send();
    }
    res.status(200).json({
      success:true,
      data:event
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { event_name} = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(400).json({
        success:false,
        message:"Data is not found"
      });
    }

    if (!event_name || typeof event_name !== "string" || event_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Event name is required and must be a non-empty string" });
    }

    res.status(200).json({
      success:true,
      data:event
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
};

exports.deactivateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    if (!event) {
      return res.status(400).send();
    }
    res.send({ message: "Event has been successfully deactivated." });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { search } = req.query;
    let queryConditions = {};

    // Add column-specific search conditions dynamically
    const searchFields = ["event_name", "location", "status"];
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
        { event_name: searchRegex },
        { location: searchRegex },
        { status: search === "true" },
      ];
    }

    const events = await Event.find(queryConditions).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
