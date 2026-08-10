const cron = require("node-cron");
const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const mailContent = require("../middlewares/mail-content");
// const nodeSendMail = require("../helper/sendMail")
const nodeSendMail = require("../helper/sendMail")

require("dotenv").config();


const checkAndSendBookingEmail = async () => {
  try {
    

    // Fetch the latest booking from each collection and populate necessary fields
    const latestBooking = await Booking.findOne({
      cancellation_status: 0,
      verification_status: 0,
      isMailSent: { $ne: true }, // Ensure mail is not already sent
    })
      .populate("user_id", "first_name last_name email mobile")
      .populate("venue_id", "name")
      .sort({ createdAt: -1 });

    const latestCoachBooking = await CoachBooking.findOne({
      cancellation_status: 0,
      verification_status: 0,
      isMailSent: { $ne: true },
    })
      .populate("userId", "first_name last_name email mobile")
      .populate("coachId", "first_name last_name")
      .sort({ createdAt: -1 });

    const latestPTBooking = await PersonalTrainerBooking.findOne({
      cancellation_status: 0,
      verification_status: 0,
      isMailSent: { $ne: true },
    })
      .populate("user_id", "first_name last_name email mobile")
      .populate("pt_id", "first_name last_name")
      .sort({ createdAt: -1 });

    // Store all bookings in an array and filter out null values
    const allBookings = [latestBooking, latestCoachBooking, latestPTBooking].filter(Boolean);

    // If no bookings found, exit function
    if (allBookings.length === 0) {
      
      return;
    }

    // Check if any booking has exceeded 15 minutes
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    for (let booking of allBookings) {
      if (new Date(booking.createdAt) < fifteenMinutesAgo) {
        // Extract necessary details
        const user = booking.user_id || booking.userId;
        const venue = booking.venue_id || booking.coachId || booking.pt_id;

        // Log populated user and venue details
        
        

        const role = booking.coachId
          ? "Coach"
          : booking.pt_id
          ? "Personal Trainer"
          : "Venue";
        const userEmail = user?.email || "N/A";

        // Check for venue name based on the populated fields
        let venueName;
        if (booking.venue_id) {
          venueName = booking.venue_id.name || "Venue Name Not Available"; // Assuming venue_id has a 'name' field
        } else if (booking.coachId) {
          venueName = `${booking.coachId.first_name || ""} ${booking.coachId.last_name || ""}`.trim() || "Coach Name Not Available";
        } else if (booking.pt_id) {
          venueName = `${booking.pt_id.first_name || ""} ${booking.pt_id.last_name || ""}`.trim() || "PT Name Not Available";
        } else {
          venueName = "Venue/Coach/PT Not Found";
        }

        const formattedDate = new Date(booking.startDate || booking.date).toLocaleDateString();
        const formattedTime = `${booking.start_time || booking.slot_time?.[0]?.startTime || "N/A"} - ${
          booking.end_time || booking.slot_time?.[0]?.endTime || "N/A"
        }`;
        const totalPrice = booking.total_price || "N/A";

        // Email content
        const htmlContent = mailContent.BookingPendingReminder(
          user.first_name,
          venueName,
          formattedDate,
          formattedTime,
          totalPrice,
          userEmail,
          role
        );

        // Send email to Super Admin
        await nodeSendMail.sendEmailConfirm({
          senderEmail: process.env.SMTP_USER,
          senderName: "Admin KheloIndore",
          recipientEmail: process.env.SUPER_ADMIN_EMAIL,
          subject: "Pending Booking Reminder",
          html: htmlContent,
        });

        // Update the booking document to prevent duplicate emails
        await booking.updateOne({ isMailSent: true });

        
      }
    }
  } catch (error) {
    
  }
};

// Schedule the cron job to run every minute
cron.schedule("* * * * *", checkAndSendBookingEmail, {
  scheduled: true,
  timezone: "Asia/Kolkata", // Change as per your timezone
});


