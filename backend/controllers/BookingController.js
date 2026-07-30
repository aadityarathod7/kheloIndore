const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const PersonalTrainerSlot = require("../models/PersonalTrainerSlotModel");
const Slot = require("../models/SlotModel");
const Venue1 = require("../models/Venue1")
const User = require('../models/UserModel');
const PersonalTrainer = require("../models/PersonalTrainingModel");
const Coach = require("../models/CoachModel");
const CoachSlot = require("../models/CoachSlotsModel");
const venuePdfContent = require("../middlewares/venue_pdf_invoice");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { mail } = require("./NodeMailerController");
const mailContent = require("../middlewares/mail-content");
const nodeSendMail = require("../helper/sendMail")
require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = require("mongoose").Types;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
exports.addBooking = async (req, res) => {
  try {
    const { user_id, venue_id,date, slotsBooked } = req.body;
    let total_price=0;
    const dateObj = new Date(date);
    if(!user_id){
      return res.status(400).json({
        success:false,
        message:"User Id is required"
      })
    }
if (!venue_id) {
  return res.status(400).json({
    success: false,
    message: "Venue Id is required",
  });
}
if(!date){
    return res.status(400).json({
      success: false,
      message: "Date is required",
    });
}
if(slotsBooked.length==0){
  return res.status(400).json({
    success: false,
    message: "Booking Slot is Empty",
  });
}
const slots1 = await Slot.find({ venue_id: venue_id, date: dateObj });
if(slots1.length===0){
  return res.status(400).json({
    success:false,
    message:"Slots is not found"
  })
}
 const slotsArray1 = slots1[0].slots;
 for (let slot of slotsArray1) {
   const slotID = slot._id.toString();


   if (slotsBooked.includes(slotID)) {
    total_price+=slot.price;
     if (slot.isBooked) {
       return res.status(400).json({
         success: false,
         message: `The Slot ${slot.startTime} to ${slot.endTime} is Already Booked, Book another Slot->>>`,
       });
     }
     
 }
 }
    const venueData = await Venue1.findById(venue_id);
    const vendor_id = venueData ? venueData.vendor_id : null;

    const newBooking = await Booking.create({
      user_id,
      venue_id,
      vendor_id,
      date,
      slotsBooked,
      total_price,
    });

    let populatedBooking = await Booking.findById(newBooking._id)
      .populate("user_id")
      .populate("venue_id");
      
 
    let slotPopulatedData=[];
    const slots = await Slot.find({ venue_id: venue_id, date: dateObj });

   const slotsArray = slots[0].slots;
    for (let slot of slotsArray) {
      const slotID = slot._id.toString();
      if (slotsBooked.includes(slotID)) {
        if (slot.isBooked) {
          return res.status(400).json({
            success: false,
            message: `The Slot ${slot.startTime} to ${slot.endTime} is Already Booked, Book another Slot`,
          });
        }
        slotPopulatedData.push(slot);

      }
    }
    const updatedSlots = await Slot.updateMany(
      {
        venue_id: venue_id,
        date: dateObj,
        "slots._id": { $in: slotsBooked }, // Match slots with IDs in slotsBooked
      },
      {
        $set: { "slots.$[slot].isBooked": true }, // Set isBooked to true for matched slots
      },
      {
        arrayFilters: [{ "slot._id": { $in: slotsBooked } }], // Define array filter to match slot IDs
      }
    );
 await User.findByIdAndUpdate(
  user_id,
  { $inc: { booking_count: 1 } },
  { new: true } 
);
    res.status(200).json({
      success: true,
      message: "Booking added successfully",
      data: populatedBooking,
      slots: slotPopulatedData, 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add booking",
      error: error.message,
    });
  }
};


// Fetch all bookings
exports.actualgetBookings = async (req, res) => {
  try {
    const user = req.user.userID

    if(!user){
  return res.json({
  status:400,
  success:false,
   message: "User Id not found" })
    }
    if(req.user.role == "Super Admin"){
    const bookings = await Booking.find().populate("user_id venue_id").sort({createdAt:-1})
    const bookingData =[];
    if (bookings.length==0){
      return res
        .status(400)
        .json({ success: false, message: "No bookings found" });
    }
 
for(let booking of bookings){
  
 let slotPopulatedData = [];

const { venue_id, date, slotsBooked } = booking;

const dateObj = new Date(date);


const slots = await Slot.find({ venue_id: venue_id, date: dateObj });
if(slots.length==0){
  return res.status(400).json({
    success: false,
    message: "No slots found for this venue",
     data:[]
  })
}
const slotsArray = slots[0].slots;
 for (let slot of slotsArray) {
   const slotID = slot._id.toString();

   if (slotsBooked.includes(slotID)) {
     slotPopulatedData.push(slot); 
    }
  }
  bookingData.push({info:booking,slots:slotPopulatedData})
}
return res.json({ 
  status:200,
  success: true, 
  data: bookingData 
});
  }
  else if(req.user.role == "Venue Admin"){
    const bookings = await Booking.find({vendor_id:user}).populate("user_id venue_id").sort({createdAt:-1});

    const bookingData =[];
    if (bookings.length==0){
      return res
        .status(400)
        .json({ success: false, message: "No bookings found" });
    }
 
for(let booking of bookings){
  
 let slotPopulatedData = [];

const { venue_id, date, slotsBooked } = booking;
const dateObj = new Date(date);

const slots = await Slot.find({ venue_id: venue_id, date: dateObj });
if(slots.length==0){
  return res.status(400).json({
    success: false,
    message: "No slots found for this venue",
     data:[]
  })
}
const slotsArray = slots[0].slots;
 for (let slot of slotsArray) {
   const slotID = slot._id.toString();
   if (slotsBooked.includes(slotID)) {
     slotPopulatedData.push(slot); 
    }
  }
  bookingData.push({info:booking,slots:slotPopulatedData})
}
    return res.json({ 
      status:200,
      success: true, 
      data: bookingData 
    });

  }
  else{
    return res.json({ 
      status:400,
      success: false, 
      message:"No data found"
    });
  }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch bookings",
        error: error.message,
      });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const user = req.user.userID;

    if (!user) {
      return res.json({
        status: 400,
        success: false,
        message: "User Id not found",
      });
    }

    // Get search query from request
    const searchQuery = req.query.search || '';
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search

    if (req.user.role == "Super Admin") {
      // Fetch bookings
      const bookings = await Booking.find()
        .populate("user_id venue_id")
        .sort({ createdAt: -1 });

      const bookingData = [];
      if (bookings.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "No bookings found" });
      }

      // Filter the bookings based on the search query
      const filteredBookings = bookings.filter((booking) => {
        const user = booking.user_id;
        const venue = booking.venue_id;

        // Check if any of the fields match the search query
        return (
          (user.first_name && user.first_name.match(regex)) ||
          (user.last_name && user.last_name.match(regex)) ||
          (user.mobile && user.mobile.toString().match(regex)) ||
          (venue.name && venue.name.match(regex)) ||
          (venue._id && venue._id.toString().match(regex))
        );
      });

      // Populate slot details for each filtered booking
      for (let booking of filteredBookings) {
        let slotPopulatedData = [];

        const { venue_id, date, slotsBooked } = booking;
        const dateObj = new Date(date);

        // Find available slots for the given venue and date
        const slots = await Slot.find({ venue_id: venue_id, date: dateObj });
        if (slots.length > 0 && slots[0].slots) {
          const slotsArray = slots[0].slots;
          for (let slot of slotsArray) {
            const slotID = slot._id.toString();
            if (slotsBooked.includes(slotID)) {
              slotPopulatedData.push(slot);
            }
          }
        } else if (booking.slot_time && booking.slot_time.length > 0) {
          slotPopulatedData = booking.slot_time;
        }
        bookingData.push({ info: booking, slots: slotPopulatedData });
      }

      return res.json({
        status: 200,
        success: true,
        data: bookingData,
      });
    } else if (req.user.role == "Venue Admin") {
      // If the user is a Venue Admin, fetch bookings for the specific venue
      const bookings = await Booking.find({ vendor_id: user })
        .populate("user_id venue_id")
        .sort({ createdAt: -1 });

      const bookingData = [];
      if (bookings.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "No bookings found" });
      }

      // Filter the bookings based on the search query
      const filteredBookings = bookings.filter((booking) => {
        const user = booking.user_id;
        const venue = booking.venue_id;

        return (
          (user && user.first_name && user.first_name.match(regex)) ||
          (user && user.last_name && user.last_name.match(regex)) ||
          (user && user.mobile && user.mobile.toString().match(regex)) ||
          (venue && venue.name && venue.name.match(regex)) ||
          (venue && venue._id && venue._id.toString().match(regex))
        );
      });

      // Populate slot details for each filtered booking
      for (let booking of filteredBookings) {
        let slotPopulatedData = [];

        const { venue_id, date, slotsBooked } = booking;
        const dateObj = new Date(date);

        const slots = await Slot.find({ venue_id: venue_id, date: dateObj });
        if (slots.length > 0 && slots[0].slots) {
          const slotsArray = slots[0].slots;
          for (let slot of slotsArray) {
            const slotID = slot._id.toString();
            if (slotsBooked.includes(slotID)) {
              slotPopulatedData.push(slot);
            }
          }
        } else if (booking.slot_time && booking.slot_time.length > 0) {
          slotPopulatedData = booking.slot_time;
        }
        bookingData.push({ info: booking, slots: slotPopulatedData });
      }

      return res.json({
        status: 200,
        success: true,
        data: bookingData,
      });
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

exports.getBookingByVendorId = async(req,res)=>{
  try {
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    const bookings = await Booking.find({vendor_id:user}).populate("user_id venue_id");

    const bookingData =[];
    if (bookings.length==0){
      return res
        .status(400)
        .json({ success: false, message: "No bookings found" });
    }
 
for(let booking of bookings){
  
 let slotPopulatedData = [];

const { venue_id, date, slotsBooked } = booking;
const dateObj = new Date(date);

const slots = await Slot.find({ venue_id: venue_id, date: dateObj });
if(slots.length==0){
  return res.status(400).json({
    success: false,
    message: "No slots found for this venue",
     data:[]
  })
}
const slotsArray = slots[0].slots;


 for (let slot of slotsArray) {
   const slotID = slot._id.toString();

   if (slotsBooked.includes(slotID)) {
     slotPopulatedData.push(slot); 
    }
  }
  bookingData.push({info:booking,slots:slotPopulatedData})
}
    res.status(200).json({ success: true, data: bookingData });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch bookings",
        error: error.message,
      });
  }
}

exports.actualbookingVerifyStatusById = async(req,res)=>{
  try {
    const id = req.params.bookingId
    const verifyStatus = req.params.verifyStatus
    const user = req.user.userID
    if(req.user.role =='Super Admin' || req.user.role =='Venue Admin'){
      const updateBooking = await Booking.findByIdAndUpdate(id, {
      verification_status: verifyStatus,
        });
        if(!updateBooking){
          return res.json({
            status:400,
            success:false,
            message:"Booking Id not found"
            }) 
        }
        return res.json({
          status:200,
          success:true,
          message:"Booking status verified"
          }) 
    }
    else{
      return res.json({
        status:400,
        success:false,
        message:"You have no rigths to verify status"
        })  
    }

  } catch (error) {
    return res.json({
    status:500,
    success:false,
    message:"Internal server error"
    })
  }
}



exports.workingbookingVerifyStatusById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
      const verifyStatus = parseInt(req.params.verifyStatus);
    console.log(verifyStatus)
    const userRole = req.user.role;

    // Validate user role
    if (userRole !== "Super Admin" && userRole !== "Venue Admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to verify booking status.",
      });
    }

    // Find the booking and populate related fields
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("venue_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const user = booking.user_id; 
    console.log(user,"user")
    const venue = booking.venue_id; 
console.log(venue,"venue")
const slotsBooked = booking.slotsBooked
const formattedSlotsBooked = slotsBooked.map(id => {
    if (ObjectId.isValid(id)) {
      return new ObjectId(id);
    } else {
      console.log(`Invalid ObjectId: ${id}`);
      return null;
    }
  }).filter(id => id !== null); // Filter out invalid ObjectIds
  
  console.log(formattedSlotsBooked,"391"); // Ensure it's correctly formatted
  
  // Fetch the document and slot details
  const slotsDetails = await Slot.aggregate([
    {
      $match: {
        "slots._id": { $in: formattedSlotsBooked } // Filter documents that contain the specified slot
      }
    },
    {
      $project: {
        venue_id: 1,
        date: 1,
        slots: {
          $filter: {
            input: "$slots",
            as: "slot",
            cond: { $in: ["$$slot._id", formattedSlotsBooked] } // Filter out the slots with the matching _id
          }
        }
      }
    }
  ]);
  
  // Check if you have the details
  if (slotsDetails.length > 0 && slotsDetails[0].slots.length > 0) {
    const slot = slotsDetails[0].slots[0]; // Get the first matching slot
    console.log("Slot Details:", slot); // This will print the details of the slot
  } else {
    console.log("No slot found with the specified _id.");
  }
  
  const allSlotDetails = slotsDetails.flatMap(document => 
    document.slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime
    }))
  );
console.log(allSlotDetails,"allSlotDetails")
  
const formattedSlotTimes = allSlotDetails
.map(slot => `${slot.startTime} - ${slot.endTime}`)
.join(', '); // Join with a comma if multiple slots

    if (verifyStatus === 1) {
      // Approval logic
      const pdfData = {
        first_name: user.first_name,
        last_name: user.last_name || "",
        mobile: user.mobile || "",
        email: user.email,
        bookDate: booking.date.toLocaleDateString(),
        venueName: venue.name,
        venueLocation: venue.address,
        slotsBooked:formattedSlotTimes, // Assuming slotsBooked is an array
        total_price: booking.total_price,
        transactionId: booking.transaction_id,
        merchantTransaction_id: booking.merchantTransaction_id,
      };

      // Generate Invoice PDF
      //  var invoicePath = path.join(__dirname, `../public/pdf/${filename}`);
       const invoicePath = path.join(__dirname, `../public/pdf/${booking._id}.pdf`);
      const html = mailContent.venue_pdf_invoice(pdfData);

      const browser = await puppeteer.launch({ args: ["--no-sandbox"], headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.pdf({ path: invoicePath, format: "A4", printBackground: true });
      await browser.close();

      // Send confirmation email with invoice
      const htmlContent = mailContent.BookingConfirmedandEmailSentToUser(
        req.user.name,
        `${user.first_name} ${user.last_name}`,
        venue.name,
        venue.address,
        booking.date.toLocaleDateString(),
        allSlotDetails,
        booking.total_price,
        user.email
      );

      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Booking Confirmed - Invoice Attached",
        html: htmlContent,
        attachments: [{ filename: `invoice_${booking._id}.pdf`, path: invoicePath }],
      });
    
  await nodeSendMail.sendBookingEmailToApprovalToSuperAdmin({     
        mailcontent:htmlContent, 
        venueName,
        subject:  "Booking Confirmed By admin- Invoice Attached"
      });


      return res.status(200).json({
        success: true,
        message: "Booking confirmed and email sent with invoice.",
      });
    } else if (verifyStatus === 0) {
      // Rejection logic
      const rejectionMessage = "The booking does not meet our requirements.";
      const htmlContent = mailContent.bookingRejectionTemplate(user.first_name, venue.name, rejectionMessage);

      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Booking Rejected",
        html: htmlContent,
      });
      await nodeSendMail.sendBookingEmailToApprovalToSuperAdmin({     
        mailcontent:htmlContent, 
        venueName,
        subject:  "Booking rejected and email sent to the user by admin"
      });
      return res.status(200).json({
        success: true,
        message: "Booking rejected and email sent to the user.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status.",
      });
    }
  } catch (error) {
    console.error("Error in bookingVerifyStatusById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.actualbookingVerifyStatusById = async (req, res) => {
  try {
    let bookingId = req.params.bookingId;
    const verifyStatus = parseInt(req.params.verifyStatus);
    console.log(verifyStatus);
    const userRole = req.user.role;

    // Validate user role
    if (userRole !== "Super Admin" && userRole !== "Venue Admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to verify booking status.",
      });
    }

    // Find the booking and populate related fields
    const booking = await Booking.findById(bookingId)
      .populate("user_id")
      .populate("venue_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const user = booking.user_id;
    console.log(user, "user");
    const venue = booking.venue_id;
    console.log(venue, "venue");

    // Format the slots
    const slotsBooked = booking.slotsBooked;
    const formattedSlotsBooked = slotsBooked.map(id => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      } else {
        console.log(`Invalid ObjectId: ${id}`);
        return null;
      }
    }).filter(id => id !== null); // Filter out invalid ObjectIds

    console.log(formattedSlotsBooked, "391"); // Ensure it's correctly formatted

    // Fetch the document and slot details
    const slotsDetails = await Slot.aggregate([
      {
        $match: {
          "slots._id": { $in: formattedSlotsBooked } // Filter documents that contain the specified slot
        }
      },
      {
        $project: {
          venue_id: 1,
          date: 1,
          slots: {
            $filter: {
              input: "$slots",
              as: "slot",
              cond: { $in: ["$$slot._id", formattedSlotsBooked] } // Filter out the slots with the matching _id
            }
          }
        }
      }
    ]);

    // Check if you have the details
    if (slotsDetails.length > 0 && slotsDetails[0].slots.length > 0) {
      const slot = slotsDetails[0].slots[0]; // Get the first matching slot
      console.log("Slot Details:", slot); // This will print the details of the slot
    } else {
      console.log("No slot found with the specified _id.");
    }

    const allSlotDetails = slotsDetails.flatMap(document => 
      document.slots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    );
    console.log(allSlotDetails, "allSlotDetails");

    const formattedSlotTimes = allSlotDetails
      .map(slot => `${slot.startTime} - ${slot.endTime}`)
      .join(', '); // Join with a comma if multiple slots

    if (verifyStatus === 1) {
      // Approval logic
      // const pdfData = {
      //   first_name: user.first_name,
      //   last_name: user.last_name || "",
      //   mobile: user.mobile || "",
      //   email: user.email,
      //   bookDate: booking.date.toLocaleDateString(),
      //   venueName: venue.name,
      //   venueLocation: venue.address,
      //   slotsBooked: formattedSlotTimes, // Assuming slotsBooked is an array
      //   total_price: booking.total_price,
      //   transactionId: booking.transaction_id,
      //   merchantTransaction_id: booking.merchantTransaction_id,
      // };

      // Generate Invoice PDF
      // const invoicePath = path.join(__dirname, `../public/pdf/${booking._id}.pdf`);
      // const html = mailContent.venue_pdf_invoice(pdfData);

      // const browser = await puppeteer.launch({
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //   headless: true,
      // });
      // const browser = await puppeteer.launch({
      //   executablePath:'/usr/bin/chromium-browser',
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'] ,
      //   headless: true, 
      // });

      // const page = await browser.newPage();
      // await page.setContent(html, { waitUntil: "networkidle0" });
      // await page.pdf({ path: invoicePath, format: "A4", printBackground: true });
      // await browser.close();


     
      
      // Send confirmation email with invoice
      const htmlContent = mailContent.BookingConfirmedandEmailSentToUser(
        req.user.name,
        `${user.first_name} ${user.last_name}`,
        venue.name,
        venue.address,
        booking.date.toLocaleDateString(),
        allSlotDetails,
        booking.total_price,
        user.email
      );

      // await nodeSendMail.sendEmailConfirm({
      //   senderEmail: process.env.EMAIL_ID,
      //   senderName: "Admin KheloIndore",
      //   recipientEmail: user.email,
      //   subject: "Booking Confirmed - Invoice Attached",
      //   html: htmlContent,
      //   attachments: [{ filename: `invoice_${booking._id}.pdf`, path: invoicePath }],
      // });

      await nodeSendMail.sendBookingEmailToApprovalToSuperAdmin({     
        mailcontent:htmlContent, 
        subject:  "Booking Confirmed By admin- Invoice Attached"
      });

      return res.status(200).json({
        success: true,
        message: "Booking confirmed and email sent with invoice.",
      });
    } else if (verifyStatus === 2) {
      // Rejection logic
      const rejectionMessage = "The booking does not meet our requirements.";
      const htmlContent = mailContent.bookingRejectionTemplate(user.first_name, venue.name, rejectionMessage);

      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Booking Rejected",
        html: htmlContent,
      });

      await nodeSendMail.sendBookingEmailToApprovalToSuperAdmin({     
        mailcontent:htmlContent,
        subject:  "Booking rejected and email sent to the user by admin"
      });

      return res.status(200).json({
        success: true,
        message: "Booking rejected and email sent to the user.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status.",
      });
    }
  } catch (error) {
    console.error("Error in bookingVerifyStatusById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.shubhbookingVerifyStatusById = async (req, res) => {
  try {
    const { bookingId, verifyStatus } = req.params;
    const parsedVerifyStatus = parseInt(verifyStatus); // Ensure verifyStatus is an integer
    const userRole = req.user.role;

    // Validate user role
    if (!["Super Admin", "Venue Admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to verify booking status.",
      });
    }

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format.",
      });
    }

    // Fetch booking details
    const booking = await Booking.findById(bookingId)
      .populate("user_id", "first_name last_name email mobile") // Populate user fields
      .populate("venue_id", "name address"); // Populate venue fields

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const user = booking.user_id;
    const venue = booking.venue_id;

    // Validate `verifyStatus` and update the booking
    if (![0, 1, 2].includes(parsedVerifyStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status. Must be 0, 1, or 2.",
      });
    }

    booking.verification_status = parsedVerifyStatus;
    await booking.save();

    if (parsedVerifyStatus === 1) {
      // Approval Logic
      const formattedSlotTimes = booking.slotsBooked
      .map(slot => `${slot.startTime} - ${slot.endTime}`)
      .join(", ");
//  const pdfData = {
//         first_name: user.first_name,
//         last_name: user.last_name || "",
//         mobile: user.mobile || "",
//         email: user.email,
//         bookDate: booking.date.toLocaleDateString(),
//         venueName: venue.name,
//         venueLocation: venue.address,
//         slotsBooked: formattedSlotTimes, // Assuming slotsBooked is an array
//         total_price: booking.total_price,
//         transactionId: booking.transaction_id,
//         merchantTransaction_id: booking.merchantTransaction_id,
//       };

     
      // const invoicePath = path.join(__dirname, `../public/pdf/${booking._id}.pdf`);
      // const html = venuePdfContent.venue_pdf_invoice(pdfData);

   
      // const browser = await puppeteer.launch({
      //   // executablePath:'/usr/bin/chromium-browser',
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'] ,
      //   headless: true, 
      // });

      // const page = await browser.newPage();
      // await page.setContent(html, { waitUntil: "networkidle0" });
      // await page.pdf({ path: invoicePath, format: "A4", printBackground: true });
      // await browser.close();


   
 

      const htmlContent = mailContent.BookingConfirmedandEmailSentToUser(
        req.user.name,
        `${user.first_name} ${user.last_name}`,
        venue.name,
        venue.address,
        booking.date.toLocaleDateString(),
        formattedSlotTimes,
        booking.total_price,
        user.email
      );


      // await nodeSendMail.sendEmailConfirm({
      //   senderEmail: process.env.EMAIL_ID,
      //   senderName: "Admin KheloIndore",
      //   recipientEmail: user.email,
      //   subject: "Booking Confirmed - Invoice Attached",
      //   html: htmlContent,
      //   attachments: [{ filename: `invoice_${booking._id}.pdf`, path: invoicePath }],
      // });
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Booking Confirmed",
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        message: "Booking confirmed and email sent.",
      });
    } else if (parsedVerifyStatus === 2) {
      // Rejection Logic
      const rejectionMessage = "The booking does not meet our requirements.";
      const htmlContent = mailContent.bookingRejectionTemplate(
        user.first_name,
        venue.name,
        rejectionMessage
      );

      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: user.email,
        subject: "Booking Rejected",
        html: htmlContent,
      });

      return res.status(200).json({
        success: true,
        message: "Booking rejected and email sent.",
      });
    } else if (parsedVerifyStatus === 0) {
      return res.status(200).json({
        success: true,
        message: "Booking status reset to pending.",
      });
    }
  } catch (error) {
    console.error("Error in bookingVerifyStatusById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.bookingVerifyStatusById = async (req, res) => {
  try {
    const { bookingId, verifyStatus } = req.params; // Extract bookingId and verifyStatus
    const parsedVerifyStatus = parseInt(verifyStatus); // Ensure verifyStatus is an integer
    const userRole = req.user.role;
    const userId = req.user.userID; // Extract user ID
console.log(userRole,"userRole",userId ,"userId")
    // Validate user role
    if (!["Super Admin", "Venue Admin", "Coach", "Personal Trainer"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to verify booking status.",
      });
    }

    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format.",
      });
    }

    // Convert bookingId to ObjectId type (using 'new' keyword)
    const bookingObjectId = new mongoose.Types.ObjectId(bookingId);
    console.log("Booking ID to ObjectId:", bookingObjectId);

    // Fetch booking details based on user role
    let booking;
    if (userRole === "Super Admin") {
      console.log("Super Admin: Fetching all bookings");
      // Super Admin can query all bookings (from all models)
      booking = await Booking.findById(bookingObjectId)
        .populate("user_id", "first_name last_name email mobile")
        .populate("venue_id", "name role address")
        .populate("vendor_id" ,"first_name last_name email role");

      if (!booking) {
        // If not found in the Booking model, check in CoachBooking or PersonalTrainerBooking
        console.log("Booking not found in Booking, checking CoachBooking...");
        booking = await CoachBooking.findById(bookingObjectId)
          .populate("userId", "first_name role last_name email mobile")
          .populate("coachId", "first_name role email last_name")
          .select("startDate endDate start_time end_time total_price verification_status cancellation_status slotsBook pdf_url paymentStatus paymentState");;

        if (!booking) {
          console.log("Booking not found in CoachBooking, checking PersonalTrainerBooking...");
          booking = await PersonalTrainerBooking.findById(bookingObjectId)
            .populate("user_id", "first_name role last_name email mobile")
            .populate("pt_id", "first_name role email last_name")
            .select("startDate endDate start_time end_time total_price cancellation_status verification_status slotsBooked pdf_url"); ;
        }
      }
    } else if (userRole === "Venue Admin") {
      // Venue Admin can update bookings associated with their venue
      booking = await Booking.findOne({ _id: bookingObjectId, vendor_id: userId })
        .populate("user_id", "first_name last_name email role mobile")
        .populate("venue_id", "name role address")
        .populate("vendor_id" ,"first_name last_name email role");
    } else if (userRole === "Coach") {
      // Coach can update bookings where the coach is assigned
      booking = await CoachBooking.findOne({ _id: bookingObjectId, coachId: userId })
        .populate("userId", "first_name last_name email mobile")
        .populate("coachId", "first_name role email last_name")
        .select("startDate endDate start_time end_time total_price verification_status cancellation_status slotsBook pdf_url paymentStatus paymentState");;
    } else if (userRole === "Personal Trainer") {
      console.log("Personal Trainer: Checking booking for pt_id", userId);
      // Personal Trainer can update bookings where the personal trainer is assigned
      booking = await PersonalTrainerBooking.findOne({
        _id: bookingObjectId,
        pt_id: userId,  // Personal Trainer can only update bookings where pt_id matches userId
      })
        .populate("user_id", "first_name last_name role email mobile")
        .populate("pt_id", "first_name role email last_name")
        .select("startDate endDate start_time end_time total_price cancellation_status verification_status slotsBooked pdf_url"); // ;
    }
console.log(booking,"booking")
    // If the booking is not found or the user is not authorized to update, return an error
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you are not authorized to update it.",
      });
    }

    const user = booking.user_id || booking.userId;
    const venue = booking.venue_id || booking.coach_id || booking.pt_id;
console.log(booking,"booking")
    // Validate `verifyStatus` and update the booking
    if (![0, 1, 2].includes(parsedVerifyStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status. Must be 0, 1, or 2.",
      });
    }

    booking.verification_status = parsedVerifyStatus;
    await booking.save();
    // Ensure slotsBooked is an array (default to empty if undefined)
  // Determine the role dynamically based on booking
const role = 
booking.coachId?.role || 
booking.pt_id?.role || 
(booking.venue_id ? "Venue" : "N/A");  // Default to "Venue Admin" if no coach or PT exists

// Construct the user's full name dynamically based on the role
const userFirstName = user?.first_name || "N/A";
const userLastName = user?.last_name || "N/A";
const userEmail = user?.email || "N/A";
// const { startTime, endTime } = booking?.slot_time[0] || "N/A";


// Dynamically set the venue or trainer name based on the role
let venueName = "N/A";
let formattedSlotDate = "N/A"
let formattedSlotTimes  = "N/A"
let entity_Email = "N/A"
// Check for venue first

if (booking.venue_id?.name) {
  venueName = booking.venue_id.name
  entity_Email = booking.vendor_id.email
  formattedSlotDate = new Date(booking.date).toLocaleDateString()
  formattedSlotTimes = `${booking?.slot_time[0].startTime} - ${booking?.slot_time[0].endTime}`;
}
// If no venue, check for coach
else if (booking.coachId?.first_name && booking.coachId?.last_name) {
  entity_Email = booking.coachId.email
  venueName = `${booking.coachId.first_name} ${booking.coachId.last_name}`
  formattedSlotDate = new Date(booking.startDate).toLocaleDateString();
  formattedSlotTimes = `${booking.start_time} - ${booking.end_time}`
}
// If no coach, check for PT
else if (booking.pt_id?.first_name && booking.pt_id?.last_name) {
  entity_Email = booking.pt_id.email
  venueName = `${booking.pt_id.first_name} ${booking.pt_id.last_name}`
  formattedSlotDate = new Date(booking.startDate).toLocaleDateString()
  formattedSlotTimes = `${booking.start_time} - ${booking.end_time}`;
}
const venueAddress = venue?.address || "N/A";

// Ensure the slot time is formatted correctly
console.log(booking.date,"booking.date")
// const formattedSlotDate = new Date(booking.startDate).toLocaleDateString() ||new Date(booking.date).toLocaleDateString() ||"N/A";
// const formattedSlotTimes = `${booking.start_time} - ${booking.end_time}` || booking.slot_time || "N/A";
const formattedTotalPrice = `${booking.total_price || "N/A"}`;
console.log(formattedSlotDate,"formattedSlotDate")
    // Logic based on verifyStatus
    if (parsedVerifyStatus === 1) {
      // // Approval Logic
      const htmlContent = mailContent.BookingConfirmedandEmailSentToUser(
        req.user.name, // Admin name
        `${userFirstName} ${userLastName}`, // User's full name
        venueName,
        venueAddress,
        formattedSlotDate,
        formattedSlotTimes,
        formattedTotalPrice,
        userEmail,
        role  // Pass the dynamic role here
      );
      
      // Send email
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: userEmail,
        subject: "Booking Confirmed",
        html: htmlContent,
      });
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail: entity_Email,
        subject: "Booking Confirmed",
        html: htmlContent,
      });
      if (userRole !== "Super Admin" ) {
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail:superAdminEmail,
        subject: "Booking Confirmed",
        html: htmlContent,
      });
    }
      return res.status(200).json({
        success: true,
        message: "Booking confirmed and email sent.",
      });
    } else if (parsedVerifyStatus === 2) {
      // Rejection Logic
      const user = booking.userId || booking.user_id; // Use whichever field exists
      const userFirstName = user?.first_name || "User";
      const userEmail = user?.email || "N/A";
    
     
      const coachName = booking.coachId?.name || "N/A"; // Fallback to "N/A" if coachId doesn't exist
    
      const rejectionMessage = "The booking does not meet our requirements.";
      const htmlContent = mailContent.bookingRejectionTemplate(
        userFirstName,
        venueName,
        rejectionMessage,
        role,
      );
      const htmlContent1 = mailContent.bookingRejectionTemplate1(
        userFirstName,
        venueName,
        rejectionMessage,
        userRole
      );

      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail:userEmail,
        subject: "Booking Rejected",
        html: htmlContent,
      });
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail:entity_Email,
        subject: "Booking Rejected",
        html: htmlContent1,
      });
      if (userRole !== "Super Admin" ) {
      await nodeSendMail.sendEmailConfirm({
        senderEmail: process.env.SMTP_USER,
        senderName: "Admin KheloIndore",
        recipientEmail:superAdminEmail,
        subject: "Booking Rejected",
        html: htmlContent1,
      });
    }
      return res.status(200).json({
        success: true,
        message: "Booking rejected and email sent.",
      });
    } else if (parsedVerifyStatus === 0) {
      // Reset status to pending
      return res.status(200).json({
        success: true,
        message: "Booking status reset to pending.",
      });
    }
  } catch (error) {
    console.error("Error in bookingVerifyStatusById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getBookingsNotification = async (req, res) => {
  try {
    const user = req.user.userID;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Step 1: Fetch bookings and populate fields
    const bookings = await Booking.find()
      .populate("user_id venue_id")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Step 2: Prepare notification data for bookings
    const bookingNotifications = bookings.map((booking) => {
      const user = booking.user_id || {};
      const venue = booking.venue_id || {};

      return {
        type: "BookingUpdateNotification",
        bookingId: booking._id,
        userName: `${user.first_name || "Unknown"} ${user.last_name || ""}`.trim(),
        venueName: venue.name || "Unknown Venue",
        date: booking.date,
        totalPrice: booking.total_price,
        message: `Your booking at ${venue.name || "Unknown Venue"} on ${booking.date} has been successfully confirmed. Total Price: ${booking.total_price}.`,
        createdAt: booking.createdAt,
      };
    });

    // Step 3: Fetch recently added venues
    const recentlyAddedVenues = await Venue1.find({
      read_seen: 1,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Step 4: Prepare notification data for venues
    const venueNotifications = recentlyAddedVenues.map((venue) => ({
      type: "NewVenueNotification",
      venueId: venue._id,
      venueName: venue.name || "Unnamed Venue",
      message: `A new venue, ${venue.name || "Unnamed Venue"}, has been added to the platform. Explore it today!`,
      createdAt: venue.createdAt,
    }));

    // Step 5: Fetch recently added Personal Trainers and Coaches
    const recentlyAddedPersonalTrainers = await PersonalTrainer.find({
      read_seen: 1,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentlyAddedCoaches = await Coach.find({
      read_seen: 1,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Step 6: Prepare notification data for Personal Trainers
    const personalTrainerNotifications = recentlyAddedPersonalTrainers.map((trainer) => ({
      type: "NewTrainerNotification",
      trainerId: trainer._id,
      trainerName: `${trainer.first_name} ${trainer.last_name}`,
      message: `A new personal trainer, ${trainer.first_name} ${trainer.last_name}, has been added to the platform. Check out their profile!`,
      createdAt: trainer.createdAt,
    }));

    // Step 7: Prepare notification data for Coaches
    const coachNotifications = recentlyAddedCoaches.map((coach) => ({
      type: "NewCoachNotification",
      coachId: coach._id,
      coachName: `${coach.first_name} ${coach.last_name}`,
      message: `A new coach, ${coach.first_name} ${coach.last_name}, has been added to the platform. Check out their profile!`,
      createdAt: coach.createdAt,
    }));

    // Step 8: Combine all notifications into one list and sort by createdAt
    const allNotifications = [
      ...bookingNotifications,
      ...venueNotifications,
      ...personalTrainerNotifications,
      ...coachNotifications,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Step 9: Prepare and send response
    return res.status(200).json({
      success: true,
      data: allNotifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};


exports.updateNotificationStatus = async (req, res) => {
  try {
    const { type, id } = req.body;

    // Validate inputs
    if (!type || !id) {
      return res.status(400).json({
        success: false,
        message: "Type and ID are required to update the notification.",
      });
    }

    let updateResult;

    // Update logic based on type
    if (type === "Booking") {
      updateResult = await Booking.updateOne({ _id: id }, { $set: { read_seen: 0 } });
    } else if (type === "Venue") {
      updateResult = await Venue1.updateOne({ _id: id }, { $set: { read_seen: 0 } });
    } else if (type === "PersonalTrainer") {
      updateResult = await PersonalTrainer.updateOne({ _id: id }, { $set: { read_seen: 0 } });
    } else if (type === "Coach") {
      updateResult = await Coach.updateOne({ _id: id }, { $set: { read_seen: 0 } });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid notification type.",
      });
    }

    // Check if the update was successful
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Notification with ID ${id} not found in ${type}.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notification with ID ${id} in ${type} updated successfully.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update the notification.",
      error: error.message,
    });
  }
};

exports.cancelBookingForVenue = async (req, res) => {
  try {
    const { bookingId } = req.body; // Booking ID from request body
    const userId = req.user.userID; // Get user ID from JWT or auth middleware
    const userRole = req.user.role;
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the booking belongs to the user
    if (userRole !== "Super Admin" &&  userRole !== "User" && booking.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }

    // Check if the booking is already canceled
    if (booking.cancellation_status === 1) {
      return res.status(400).json({ success: false, message: "Booking is already canceled" });
    }

    // Update the cancellation status
    booking.cancellation_status = 1;
    await booking.save();

    // Update slot availability
    const slotsToUpdate = booking.slotsBooked;
    for (const slotId of slotsToUpdate) {
      const slot = await Slot.findOne({
        venue_id: booking.venue_id,
        "slots._id": slotId,
      });

      if (slot) {
        const slotIndex = slot.slots.findIndex(s => s._id.toString() === slotId.toString());
        if (slotIndex !== -1) {
          slot.slots[slotIndex].isBooked = false;
          await slot.save();
        }
      }
    }

    // Dynamically fetch related details
    const venueAdmin = await User.findOne({ _id: booking.vendor_id }); // Assuming `vendor_id` is the admin ID
    const user = await User.findOne({ _id: booking.user_id }); // Fetch user details
    const venue = await Venue1.findOne({ _id: booking.venue_id }); // Fetch venue details

    if (!venueAdmin || !user || !venue) {
      return res.status(404).json({ success: false, message: "Related details not found" });
    }
    const formattedSlotDate = new Date(booking.date).toLocaleDateString()
    const formattedSlotTimes = `${booking?.slot_time[0].startTime} - ${booking?.slot_time[0].endTime}`;
    const Bookingdate = new Date(booking.createdAt).toLocaleDateString()
      const role = "Venue"
 const coachName = venue.name
    const html = mailContent.cancellationEmailTemplate(
      coachName,
      { first_name: user.first_name, last_name: user.last_name },
      formattedSlotDate,
      formattedSlotTimes,
      role,
      Bookingdate
    );

    // Send email notifications
    await nodeSendMail.cancellationEmail({
      recipientEmail: venueAdmin.email,
      subject: 'Booking Cancellation Notification',
      html,
    });
    await nodeSendMail.cancellationEmail({
      recipientEmail: user.email,
      subject: 'Booking Cancellation Notification',
      html,
    });

    await nodeSendMail.cancellationEmail({
      recipientEmail: process.env.SUPER_ADMIN_EMAIL,
      subject: 'Booking Cancellation Notification',
      html,
    });

    console.log("Booking canceled, slots updated, and email sent successfully:", booking);

    return res.status(200).json({
      success: true,
      message: "Booking canceled, slots updated, and notification sent successfully",
      booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.cancelBookingForPersonalTrainer = async (req, res) => {
  try {
    const { bookingId } = req.body;  // Booking ID from request body
    const userId = req.user.userID;  // Get user ID from JWT or auth middleware (Personal Trainer's user ID)
    const userRole = req.user.role;  // User role to check permissions

    // Find the booking by ID
    const booking = await PersonalTrainerBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the Personal Trainer is authorized to cancel this booking
    if (userRole !== "Super Admin" && userRole !== "User" && booking.pt_id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }

    // Check if the booking is already canceled
    if (booking.cancellation_status === 1) {
      return res.status(400).json({ success: false, message: "Booking is already canceled" });
    }

    // Update the cancellation status
    booking.cancellation_status = 1;
    await booking.save();

    // Update slot availability using PersonalTrainerSlot model
    const slotsToUpdate = booking.slotsBook;  // Assuming slots are stored in slotsBook field
    for (const slotId of slotsToUpdate) {
      const slot = await PersonalTrainerSlot.findOne({ "slots._id": slotId });

      if (slot) {
        const slotIndex = slot.slots.findIndex(s => s._id.toString() === slotId.toString());
        if (slotIndex !== -1) {
          slot.slots[slotIndex].isBooked = false;  // Set slot to available
          await slot.save();
        }
      }
    }

    // Fetch related details for user, personal trainer, and personal trainer booking
    const user = await User.findById(booking.user_id);  // Fetch user details
    const personalTrainer = await PersonalTrainer.findById(booking.pt_id);  // Fetch personal trainer details
    const formattedSlotDate = `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`;
    const formattedSlotTimes = `${booking.start_time} - ${booking.end_time}`
    const role = "personal Trainer "
    const coachName = `${personalTrainer.first_name} - ${personalTrainer.last_name}`
    const Bookingdate = new Date(booking.createdAt).toLocaleDateString()
    // Ensure related details are found
    if (!user || !personalTrainer) {
      return res.status(404).json({ success: false, message: "Related details not found" });
    }

    // Generate cancellation email content
    const html = mailContent.cancellationEmailTemplate(
      coachName,
      { first_name: user.first_name, last_name: user.last_name },
      formattedSlotDate,
      formattedSlotTimes,
      role,
      Bookingdate
    );

    // Send email notifications
    await nodeSendMail.cancellationEmail({
      recipientEmail: user.email,  // Notify the user
      subject: 'Booking Cancellation Notification',
      html,
    });
    await nodeSendMail.cancellationEmail({
      recipientEmail: personalTrainer.email,  // Notify the user
      subject: 'Booking Cancellation Notification',
      html,
    });


    await nodeSendMail.cancellationEmail({
      recipientEmail: process.env.SUPER_ADMIN_EMAIL,  // Notify Super Admin as well
      subject: 'Booking Cancellation Notification',
      html,
    });

    console.log("Booking canceled, slots updated, and email sent successfully:", booking);

    return res.status(200).json({
      success: true,
      message: "Booking canceled, slots updated, and notification sent successfully",
      booking,
    });

  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.cancelBookingForCoach = async (req, res) => {
  try {
    const { bookingId } = req.body;  // Booking ID from request body
    const userId = req.user.userID;  // Get user ID from JWT or auth middleware (Coach's user ID)
    const userRole = req.user.role;  // User role to check permissions

    // Find the booking by ID
    const booking = await CoachBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the Coach is authorized to cancel this booking
    if (userRole !== "Super Admin" && userRole !== "User" && booking.coach_id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
    }

    // Check if the booking is already canceled
    if (booking.cancellation_status === 1) {
      return res.status(400).json({ success: false, message: "Booking is already canceled" });
    }

    // Update the cancellation status
    booking.cancellation_status = 1;
    await booking.save();

    // Update slot availability using CoachSlot model
    const slotsToUpdate = booking.slotsBook;  // Assuming slots are stored in slotsBook field
    for (const slotId of slotsToUpdate) {
      const slot = await CoachSlot.findOne({ "slots._id": slotId });

      if (slot) {
        const slotIndex = slot.slots.findIndex(s => s._id.toString() === slotId.toString());
        if (slotIndex !== -1) {
          slot.slots[slotIndex].isBooked = false;  // Set slot to available
          await slot.save();
        }
      }
    }

    // Fetch related details for user, coach, and coach booking
    const user = await User.findById(booking.userId);  // Fetch user details
    const coach = await Coach.findById(booking.coachId);  // Fetch coach details
  const formattedSlotDate = `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`;
  const formattedSlotTimes = `${booking.start_time} - ${booking.end_time}`
  const role = "Coach"
  const coachName = `${coach.first_name} - ${coach.last_name}`
  const Bookingdate = new Date(booking.createdAt).toLocaleDateString()
    // Ensure related details are found
    if (!user || !coach) {
      return res.status(404).json({ success: false, message: "Related details not found" });
    }

    // Generate cancellation email content
  //   const html = mailContent.cancellationEmailTemplate(
  //     { name: coach.name, email: coach.email, role: "Coach" },  // venueAdmin details
  // { first_name: user.first_name, last_name: user.last_name },  // user details
  // { _id: formattedSlotTimes, date: formattedSlotDate },                    // booking details
  // { name: coach.name } 
    // );
    const html = mailContent.cancellationEmailTemplate(
      coachName,
      { first_name: user.first_name, last_name: user.last_name },
      formattedSlotDate,
      formattedSlotTimes,
      role,
      Bookingdate
    );

    // Send email notifications
    await nodeSendMail.cancellationEmail({
      recipientEmail: user.email,  // Notify the user
      subject: 'Booking Cancellation Notification',
      html,
    });

    await nodeSendMail.cancellationEmail({
      recipientEmail: coach.email,  // Notify the user
      subject: 'Booking Cancellation Notification',
      html,
    });

    await nodeSendMail.cancellationEmail({
      recipientEmail: process.env.SUPER_ADMIN_EMAIL,  // Notify Super Admin as well
      subject: 'Booking Cancellation Notification',
      html,
    });

    console.log("Booking canceled, slots updated, and email sent successfully:", booking);

    return res.status(200).json({
      success: true,
      message: "Booking canceled, slots updated, and notification sent successfully",
      booking,
    });

  } catch (error) {
    console.error("Error canceling booking:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};












