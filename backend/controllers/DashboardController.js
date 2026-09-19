const User = require('../models/UserModel');
const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
// Loading the provider models here also makes booking population reliable
// when this controller is loaded independently.
const Venue = require("../models/Venue1");
const Coach = require("../models/CoachModel");
const PersonalTrainer = require("../models/PersonalTrainingModel");

exports.DateFilter = async(req,res)=>{
    try{
      const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
        const { fromDate, toDate } = req.body;
const userData = await User.find({
  createdAt: {
    $gte: fromDate,
    $lte: toDate,
  },
});
        if (!userData) return res.status(400).json("No data found!");
        res.status(200).json({
            success:true,
            data:userData
        })


    }catch(err){
   res.status(500).json({
     success: false,
     message:err.message
   });
    }
}

exports.fetchVisitors = async (req, res) => {
  try {
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
    const visitorsCount = await User.find({ status: true }).sort({ createdAt: -1 }).exec();
    return res.status(200).json({
      success: true,
      data: visitorsCount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.bookingDetailCount = async(req,res)=>{
  try{
    const user = req.user.userID
    if(!user){
  return res.json({
  status:500,
  success:false,
   message: "User Id not found" })
    }
const BookingDetails = await Booking.find()
//   {
//   // path: "user_id",
//   // select: "booking_count",
// });
let MonthlyUserBookingDetail = Array.from({ length: 12 }, (_, index) => ({
  month: new Date(0, index).toLocaleString("default", { month: "long" }),
  newUsers: 0,
  oldUsers: 0,
}));

for (let booking of BookingDetails) {

  // if(booking.user_id.role==='User'){
  const bookingMonth = new Date(booking.date).getMonth();
  const userBookingCount = booking.user_id.booking_count;
  if (userBookingCount === 1) {
    MonthlyUserBookingDetail[bookingMonth].newUsers += 1;
  } else if (userBookingCount > 1) {
    MonthlyUserBookingDetail[bookingMonth].oldUsers += 1;
  }
// }

}

     
     return res.status(200).json({
       success: true,
       data: MonthlyUserBookingDetail,
     });

  }catch(err){
return res.status(500).json({
  success:false,
  message:err.message
})
  }
}

exports.userGrowthGraph = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      { $match: { role: "User" } }, // Only fetch users with role "User"
      { 
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format data
    const formattedData = userGrowth.map(entry => ({
      month: `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}`,
      count: entry.count,
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.totalrevenue = async (req, res) => {
  try {
    

    // Fetch total revenue from all collections where status is approved
    const [venueRevenue, coachRevenue, trainerRevenue] = await Promise.all([
      Booking.aggregate([
        { $group: { _id: null, total: { $sum: "$total_price" } } },
      ]),
      CoachBooking.aggregate([
        { $group: { _id: null, total: { $sum: "$total_price" } } },
      ]),
      PersonalTrainerBooking.aggregate([
        { $group: { _id: null, total: { $sum: "$total_price" } } },
      ]),
    ]);

    // Calculate final revenue
    const totalRevenue = parseFloat(
      ((venueRevenue[0]?.total || 0) +
        (coachRevenue[0]?.total || 0) +
        (trainerRevenue[0]?.total || 0)).toFixed(2)
    );

    res.json({
      success: true,
      totalRevenue,
      revenueBreakdown: {
        venueRevenue: venueRevenue[0]?.total || 0,
        coachRevenue: coachRevenue[0]?.total || 0,
        trainerRevenue: trainerRevenue[0]?.total || 0,
      },
    });

  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Helper to compute date-range boundaries for Day / Week / Month / Custom filters
exports.analyticsRange = (filter) => {
  const now = new Date();
  let from, to = new Date(now);
  switch (filter) {
    case "day":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case "week":
      const day = (now.getDay() + 6) % 7; // Monday start
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day, 0, 0, 0, 0);
      break;
    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;
    case "custom":
      return { from: null, to: null, isCustom: true };
    default:
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }
  return { from, to, isCustom: false };
};

// Combined booking + revenue analytics for dashboards, with Day/Week/Month/Custom filters
// and downloadable report (CSV) support.
exports.bookingRevenueAnalytics = async (req, res) => {
  try {
    const user = req.user.userID;
    if (!user) {
      return res.status(500).json({ success: false, message: "User Id not found" });
    }

    const { filter = "day", fromDate, toDate } = req.query;
    const range = exports.analyticsRange(filter);
    let match = {};
    if (filter === "custom" && fromDate && toDate) {
      match = {
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1),
        },
      };
    } else if (!range.isCustom) {
      match = { createdAt: { $gte: range.from, $lte: range.to } };
    }

    const [venueAgg, coachAgg, trainerAgg] = await Promise.all([
      Booking.aggregate([
        { $match: match },
        { $group: { _id: null, bookings: { $sum: 1 }, revenue: { $sum: "$total_price" } } },
      ]),
      CoachBooking.aggregate([
        { $match: match },
        { $group: { _id: null, bookings: { $sum: 1 }, revenue: { $sum: "$total_price" } } },
      ]),
      PersonalTrainerBooking.aggregate([
        { $match: match },
        { $group: { _id: null, bookings: { $sum: 1 }, revenue: { $sum: "$total_price" } } },
      ]),
    ]);

    const venue = venueAgg[0] || { bookings: 0, revenue: 0 };
    const coach = coachAgg[0] || { bookings: 0, revenue: 0 };
    const trainer = trainerAgg[0] || { bookings: 0, revenue: 0 };

    const totalBookings = venue.bookings + coach.bookings + trainer.bookings;
    const totalRevenue = parseFloat(
      ((venue.revenue || 0) + (coach.revenue || 0) + (trainer.revenue || 0)).toFixed(2)
    );

    // Breakdown for pie charts
    const bookingBreakdown = [
      { name: "Venue", value: venue.bookings },
      { name: "Coach", value: coach.bookings },
      { name: "Personal Trainer", value: trainer.bookings },
    ];
    const revenueBreakdown = [
      { name: "Venue", value: Math.round((venue.revenue || 0) * 100) / 100 },
      { name: "Coach", value: Math.round((coach.revenue || 0) * 100) / 100 },
      { name: "Personal Trainer", value: Math.round((trainer.revenue || 0) * 100) / 100 },
    ];

    return res.status(200).json({
      success: true,
      filter,
      totalBookings,
      totalRevenue,
      bookingBreakdown,
      revenueBreakdown,
      summary: { venue, coach, trainer },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Download a complete CSV report for the selected filter.
exports.downloadAnalyticsReport = async (req, res) => {
  try {
    const user = req.user.userID;
    if (!user) {
      return res.status(500).json({ success: false, message: "User Id not found" });
    }
    const { filter = "day", fromDate, toDate } = req.query;
    const range = exports.analyticsRange(filter);
    let match = {};
    if (filter === "custom" && fromDate && toDate) {
      match = {
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1),
        },
      };
    } else if (!range.isCustom) {
      match = { createdAt: { $gte: range.from, $lte: range.to } };
    }

    const [venues, coaches, trainers, customerCount, venueCount, coachCount, trainerCount] = await Promise.all([
      Booking.find(match)
        .populate("user_id", "first_name last_name email mobile")
        .populate("venue_id", "name provider_public_id category address city")
        .populate("vendor_id", "first_name last_name email mobile")
        .lean(),
      CoachBooking.find(match)
        .populate("userId", "first_name last_name email mobile")
        .populate("coachId", "first_name last_name full_name provider_public_id category city email mobile")
        .lean(),
      PersonalTrainerBooking.find(match)
        .populate("user_id", "first_name last_name email mobile")
        .populate("pt_id", "first_name last_name provider_public_id category city email mobile")
        .lean(),
      User.countDocuments({ role: "User" }),
      Venue.countDocuments(),
      Coach.countDocuments(),
      PersonalTrainer.countDocuments(),
    ]);

    const formatDate = (value) => {
      if (!value) return "";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
    };
    const personName = (person) => {
      if (!person) return "";
      return [person.full_name, `${person.first_name || ""} ${person.last_name || ""}`.trim()]
        .find(Boolean) || "";
    };
    const providerId = (provider) => provider?.provider_public_id || provider?._id || "";
    const bookingState = (booking) => booking.cancellation_status === 1
      ? "Cancelled"
      : booking.paymentState || booking.paymentStatus || "Pending";
    const money = (value) => Number(value || 0).toFixed(2);
    const summary = (bookings) => ({
      count: bookings.length,
      gross: bookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0),
      cancelled: bookings.filter((booking) => booking.cancellation_status === 1).length,
    });
    const venueSummary = summary(venues);
    const coachSummary = summary(coaches);
    const trainerSummary = summary(trainers);
    const dateRangeLabel = filter === "custom" && fromDate && toDate
      ? `${fromDate} to ${toDate}`
      : !range.isCustom ? `${formatDate(range.from)} to ${formatDate(range.to)}` : "All available records";

    const reportRows = [
      ["KHELO INDORE PLATFORM REPORT"],
      ["Generated at", formatDate(new Date())],
      ["Report period", dateRangeLabel],
      ["Filter", filter],
      [],
      ["PLATFORM SNAPSHOT"],
      ["Registered customers", customerCount],
      ["Venues", venueCount],
      ["Coaches", coachCount],
      ["Personal trainers", trainerCount],
      [],
      ["BOOKING & REVENUE SUMMARY"],
      ["Service", "Bookings", "Gross amount (INR)", "Cancelled bookings"],
      ["Venue", venueSummary.count, money(venueSummary.gross), venueSummary.cancelled],
      ["Coach", coachSummary.count, money(coachSummary.gross), coachSummary.cancelled],
      ["Personal Trainer", trainerSummary.count, money(trainerSummary.gross), trainerSummary.cancelled],
      ["Total", venueSummary.count + coachSummary.count + trainerSummary.count, money(venueSummary.gross + coachSummary.gross + trainerSummary.gross), venueSummary.cancelled + coachSummary.cancelled + trainerSummary.cancelled],
      [],
      ["BOOKING DETAILS"],
      ["Service", "Booking ID", "Created at", "Service date / start", "Service end", "Customer", "Customer email", "Customer mobile", "Provider", "Provider ID", "Category", "Location", "Booked slots / sessions", "List amount (INR)", "Payable amount (INR)", "Payment status", "Payment state", "Payment type", "Booking status", "Transaction ID", "Manual booking"],
    ];

    const detailRows = [
      ...venues.map((booking) => {
        const venue = booking.venue_id;
        const customer = booking.user_id;
        const slots = (booking.slot_time || []).map((slot) => `${slot.startTime || ""}-${slot.endTime || ""}`).join(" | ") || (booking.slotsBooked || []).join(" | ");
        return ["Venue", booking._id, formatDate(booking.createdAt), formatDate(booking.date), "", personName(customer), customer?.email || "", customer?.mobile || "", venue?.name || "", providerId(venue), venue?.category || "", [venue?.address, venue?.city].filter(Boolean).join(", "), slots, money(booking.total_price), money(booking.payable_amount ?? booking.total_price), booking.paymentStatus || "", booking.paymentState || "", booking.payment_type || "", bookingState(booking), booking.transaction_id || booking.merchantTransaction_id || "", booking.manual_booking ? "Yes" : "No"];
      }),
      ...coaches.map((booking) => {
        const coach = booking.coachId;
        const customer = booking.userId;
        return ["Coach", booking._id, formatDate(booking.createdAt), formatDate(booking.startDate), formatDate(booking.endDate), personName(customer), customer?.email || "", customer?.mobile || "", personName(coach), providerId(coach), coach?.category || "", coach?.city || "", (booking.slotsBook || []).join(" | "), money(booking.total_price), money(booking.payable_amount ?? booking.total_price), booking.paymentStatus || "", booking.paymentState || "", booking.payment_type || "", bookingState(booking), booking.transaction_id || booking.merchantTransaction_id || "", "No"];
      }),
      ...trainers.map((booking) => {
        const trainer = booking.pt_id;
        const customer = booking.user_id;
        return ["Personal Trainer", booking._id, formatDate(booking.createdAt), formatDate(booking.startDate), formatDate(booking.endDate), personName(customer), customer?.email || "", customer?.mobile || "", personName(trainer), providerId(trainer), trainer?.category || "", trainer?.city || "", (booking.slotsBook || []).join(" | "), money(booking.total_price), money(booking.payable_amount ?? booking.total_price), booking.paymentStatus || "", booking.paymentState || "", booking.payment_type || "", bookingState(booking), booking.transaction_id || booking.merchantTransaction_id || "", "No"];
      }),
    ];

    const rows = [...reportRows, ...detailRows];

    const csvCell = (cell) => {
      let value = String(cell ?? "");
      // Avoid formula execution when the CSV is opened in Excel or Sheets.
      if (/^[=+\-@]/.test(value)) value = `'${value}`;
      return `"${value.replace(/"/g, '""')}"`;
    };
    const csv = rows
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const filename = `khelo-indore-analytics-${filter}-${Date.now()}.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMoneyReviews = async (req, res) => {
  try {
    // Fetch bookings data (You can filter by user or date range if necessary)
    const bookingData = await Booking.find().select("total_price createdAt");
    const coachBookingData = await CoachBooking.find().select("total_price createdAt");
    const personalTrainerBookingData = await PersonalTrainerBooking.find().select("total_price createdAt");

    // Combine all booking data into a single array
    const allBookingData = [
      ...bookingData.map(item => ({ amount: item.total_price, date: item.createdAt })),
      ...coachBookingData.map(item => ({ amount: item.total_price, date: item.createdAt })),
      ...personalTrainerBookingData.map(item => ({ amount: item.total_price, date: item.createdAt }))
    ];

    // Filter out any invalid dates
    const validBookingData = allBookingData.filter(item => {
      const date = new Date(item.date);
      return !isNaN(date.getTime()); // Check if the date is valid
    });

    // Sort valid data by createdAt (in ascending order)
    validBookingData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Map data to x (createdAt) and y (amount)
    const formattedData = validBookingData.map(item => ({
      x: new Date(item.date).toISOString().split('T')[0], // Convert to date string format (YYYY-MM-DD)
      y: item.amount
    }));

    // Return the data as JSON response
    return res.json({ data: formattedData });
  } catch (error) {
    
    return res.status(500).json({ error: "Failed to fetch booking data" });
  }
};
