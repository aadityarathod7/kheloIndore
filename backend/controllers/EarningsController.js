const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const User = require("../models/UserModel");

// Helper function to query bookings based on role and userID
const getBookingsQuery = async (role, userID) => {
  let query = {};
  let model = null;
  let userField = "user_id";

  if (role === "Venue Admin") {
    query = { vendor_id: userID, paymentStatus: "PAYMENT_SUCCESS" };
    model = Booking;
  } else if (role === "Coach") {
    query = { coachId: userID, paymentStatus: "PAYMENT_SUCCESS" };
    model = CoachBooking;
    userField = "userId";
  } else if (role === "Personal Trainer") {
    query = { pt_id: userID, paymentStatus: "PAYMENT_SUCCESS" };
    model = PersonalTrainerBooking;
  } else if (role === "Super Admin") {
    // For Super Admin, we query everything without userID filter
    query = { paymentStatus: "PAYMENT_SUCCESS" };
  }

  return { query, model, userField };
};

// GET /api/earnings/summary
exports.getEarningsSummary = async (req, res) => {
  try {
    const userID = req.user.userID;
    const role = req.user.role;

    if (role === "Super Admin") {
      // Aggregate stats across all models for Super Admin
      const [venueBookings, coachBookings, trainerBookings] = await Promise.all([
        Booking.find({ paymentStatus: "PAYMENT_SUCCESS" }),
        CoachBooking.find({ paymentStatus: "PAYMENT_SUCCESS" }),
        PersonalTrainerBooking.find({ paymentStatus: "PAYMENT_SUCCESS" })
      ]);

      const allBookings = [
        ...venueBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt })),
        ...coachBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt })),
        ...trainerBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt }))
      ];

      const totalEarnings = allBookings.reduce((sum, b) => sum + (b.cancelled ? 0 : b.price), 0);
      const activeCount = allBookings.filter(b => !b.cancelled).length;
      const cancelledCount = allBookings.filter(b => b.cancelled).length;

      // Current month calculation
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthEarnings = allBookings
        .filter(b => !b.cancelled && new Date(b.date).getMonth() === currentMonth && new Date(b.date).getFullYear() === currentYear)
        .reduce((sum, b) => sum + b.price, 0);

      return res.status(200).json({
        success: true,
        data: {
          totalEarnings,
          thisMonthEarnings,
          totalBookings: allBookings.length,
          activeBookings: activeCount,
          cancelledBookings: cancelledCount,
          avgBookingValue: activeCount > 0 ? parseFloat((totalEarnings / activeCount).toFixed(2)) : 0
        }
      });
    }

    const { query, model } = await getBookingsQuery(role, userID);
    if (!model) {
      return res.status(400).json({ success: false, message: "Invalid provider role" });
    }

    const bookings = await model.find(query);
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.cancellation_status === 1 ? 0 : (b.total_price || 0)), 0);
    const activeCount = bookings.filter(b => b.cancellation_status !== 1).length;
    const cancelledCount = bookings.filter(b => b.cancellation_status === 1).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthEarnings = bookings
      .filter(b => b.cancellation_status !== 1 && new Date(b.createdAt).getMonth() === currentMonth && new Date(b.createdAt).getFullYear() === currentYear)
      .reduce((sum, b) => sum + (b.total_price || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        thisMonthEarnings,
        totalBookings: bookings.length,
        activeBookings: activeCount,
        cancelledBookings: cancelledCount,
        avgBookingValue: activeCount > 0 ? parseFloat((totalEarnings / activeCount).toFixed(2)) : 0
      }
    });

  } catch (error) {
    console.error("Error in getEarningsSummary:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/earnings/monthly
exports.getMonthlyEarnings = async (req, res) => {
  try {
    const userID = req.user.userID;
    const role = req.user.role;

    let allBookings = [];

    if (role === "Super Admin") {
      const [venueBookings, coachBookings, trainerBookings] = await Promise.all([
        Booking.find({ paymentStatus: "PAYMENT_SUCCESS" }),
        CoachBooking.find({ paymentStatus: "PAYMENT_SUCCESS" }),
        PersonalTrainerBooking.find({ paymentStatus: "PAYMENT_SUCCESS" })
      ]);
      allBookings = [
        ...venueBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt })),
        ...coachBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt })),
        ...trainerBookings.map(b => ({ price: b.total_price || 0, cancelled: b.cancellation_status === 1, date: b.createdAt }))
      ];
    } else {
      const { query, model } = await getBookingsQuery(role, userID);
      if (!model) {
        return res.status(400).json({ success: false, message: "Invalid provider role" });
      }
      const bookings = await model.find(query);
      allBookings = bookings.map(b => ({
        price: b.total_price || 0,
        cancelled: b.cancellation_status === 1,
        date: b.createdAt
      }));
    }

    // Generate monthly bins for the last 6 months (chronological order)
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthsData.push({
        monthName: d.toLocaleString("default", { month: "short" }),
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        earnings: 0,
        bookingsCount: 0
      });
    }

    allBookings.forEach(b => {
      if (b.cancelled) return;
      const bDate = new Date(b.date);
      const bMonth = bDate.getMonth();
      const bYear = bDate.getFullYear();

      const bin = monthsData.find(m => m.monthIndex === bMonth && m.year === bYear);
      if (bin) {
        bin.earnings += b.price;
        bin.bookingsCount += 1;
      }
    });

    return res.status(200).json({
      success: true,
      data: monthsData.map(m => ({
        month: `${m.monthName} ${m.year}`,
        earnings: m.earnings,
        bookings: m.bookingsCount
      }))
    });

  } catch (error) {
    console.error("Error in getMonthlyEarnings:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/earnings/recent-bookings
exports.getRecentBookings = async (req, res) => {
  try {
    const userID = req.user.userID;
    const role = req.user.role;

    let rawBookings = [];

    if (role === "Super Admin") {
      const [venueBookings, coachBookings, trainerBookings] = await Promise.all([
        Booking.find({ paymentStatus: "PAYMENT_SUCCESS" }).populate("user_id venue_id").sort({ createdAt: -1 }).limit(10),
        CoachBooking.find({ paymentStatus: "PAYMENT_SUCCESS" }).populate("userId coachId").sort({ createdAt: -1 }).limit(10),
        PersonalTrainerBooking.find({ paymentStatus: "PAYMENT_SUCCESS" }).populate("user_id pt_id").sort({ createdAt: -1 }).limit(10)
      ]);

      rawBookings = [
        ...venueBookings.map(b => ({
          id: b._id,
          user: b.user_id ? `${b.user_id.first_name || ""} ${b.user_id.last_name || ""}`.trim() : "Walk-in User",
          service: b.venue_id ? b.venue_id.name : "Venue Booking",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: "Venue",
          date: b.createdAt
        })),
        ...coachBookings.map(b => ({
          id: b._id,
          user: b.userId ? `${b.userId.first_name || ""} ${b.userId.last_name || ""}`.trim() : "Walk-in User",
          service: b.coachId ? `${b.coachId.first_name || ""} ${b.coachId.last_name || ""}`.trim() : "Coach Booking",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: "Coach",
          date: b.createdAt
        })),
        ...trainerBookings.map(b => ({
          id: b._id,
          user: b.user_id ? `${b.user_id.first_name || ""} ${b.user_id.last_name || ""}`.trim() : "Walk-in User",
          service: b.pt_id ? `${b.pt_id.first_name || ""} ${b.pt_id.last_name || ""}`.trim() : "Trainer Booking",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: "Personal Trainer",
          date: b.createdAt
        }))
      ];
    } else {
      const { query, model, userField } = await getBookingsQuery(role, userID);
      if (!model) {
        return res.status(400).json({ success: false, message: "Invalid provider role" });
      }

      let populateQuery = userField;
      if (role === "Venue Admin") {
        populateQuery = "user_id venue_id";
      } else if (role === "Coach") {
        populateQuery = "userId coachId";
      } else if (role === "Personal Trainer") {
        populateQuery = "user_id pt_id";
      }

      const bookings = await model.find(query).populate(populateQuery).sort({ createdAt: -1 }).limit(10);
      rawBookings = bookings.map(b => {
        let userDoc = b[userField];
        let serviceName = role;
        
        if (role === "Venue Admin") {
          userDoc = b.user_id;
          serviceName = b.venue_id ? b.venue_id.name : "Venue Booking";
        } else if (role === "Coach") {
          userDoc = b.userId;
          serviceName = b.coachId ? `${b.coachId.first_name || ""} ${b.coachId.last_name || ""}`.trim() : "Coach Booking";
        } else if (role === "Personal Trainer") {
          userDoc = b.user_id;
          serviceName = b.pt_id ? `${b.pt_id.first_name || ""} ${b.pt_id.last_name || ""}`.trim() : "Trainer Booking";
        }

        return {
          id: b._id,
          user: userDoc ? `${userDoc.first_name || ""} ${userDoc.last_name || ""}`.trim() : "Walk-in User",
          service: serviceName,
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: role,
          date: b.createdAt
        };
      });
    }

    // Sort by date descending
    rawBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      data: rawBookings.slice(0, 10)
    });

  } catch (error) {
    console.error("Error in getRecentBookings:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
