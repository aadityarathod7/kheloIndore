const Booking = require("../models/BookingModel");
const CoachBooking = require("../models/CoachBookingModel");
const PersonalTrainerBooking = require("../models/PersonalTrainerBookingModel");
const User = require("../models/UserModel");
// Register the Venue1 model before any booking population. BookingModel refers
// to it by name, so importing it here prevents settlement reports from failing
// when this controller is loaded independently.
require("../models/Venue1");
const Refund = require("../models/RefundModel");
const VendorPayout = require("../models/VendorPayoutModel");

const SUCCESSFUL_PAYMENT_STATUSES = ["PAYMENT_SUCCESS", "SUCCESS", "PAID"];

const paidAmount = (booking) => {
  const payableAmount = Number(booking.payable_amount || 0);
  const totalPrice = Number(booking.total_price || 0);
  // Legacy booking records may include a default payable_amount of 0 even
  // though the actual captured amount is stored in total_price.
  return payableAmount > 0 ? payableAmount : totalPrice;
};

const attachNetAmounts = async (bookings) => {
  const ids = bookings.map((booking) => String(booking._id));
  const refunds = ids.length
    ? await Refund.find({ booking_id: { $in: ids }, refundStatus: { $in: ["SUCCESS", "COMPLETED"] } }).lean()
    : [];
  const refundByBooking = new Map();
  refunds.forEach((refund) => {
    const id = String(refund.booking_id);
    refundByBooking.set(id, (refundByBooking.get(id) || 0) + Number(refund.refundAmount || 0));
  });

  return bookings.map((booking) => {
    const paid = paidAmount(booking);
    const refunded = refundByBooking.get(String(booking._id)) || 0;
    return { booking, paid, refunded, net: Math.max(0, paid - refunded) };
  });
};

// Helper function to query bookings based on role and userID
const getBookingsQuery = async (role, userID) => {
  let query = {};
  let model = null;
  let userField = "user_id";

  if (role === "Venue Admin") {
    query = { vendor_id: userID, paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } };
    model = Booking;
  } else if (role === "Coach") {
    query = { coachId: userID, paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } };
    model = CoachBooking;
    userField = "userId";
  } else if (role === "Personal Trainer") {
    query = { pt_id: userID, paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } };
    model = PersonalTrainerBooking;
  } else if (role === "Super Admin") {
    // For Super Admin, we query everything without userID filter
    query = { paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } };
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
        Booking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }),
        CoachBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }),
        PersonalTrainerBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } })
      ]);

      const allBookings = [...venueBookings, ...coachBookings, ...trainerBookings];
      const revenueBookings = await attachNetAmounts(allBookings);
      const grossRevenue = revenueBookings.reduce((sum, item) => sum + item.paid, 0);
      const totalRefunded = revenueBookings.reduce((sum, item) => sum + item.refunded, 0);
      const totalEarnings = revenueBookings.reduce((sum, item) => sum + item.net, 0);
      const activeCount = allBookings.filter(b => b.cancellation_status !== 1).length;
      const cancelledCount = allBookings.filter(b => b.cancellation_status === 1).length;

      // Current month calculation
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthEarnings = revenueBookings
        .filter(({ booking }) => new Date(booking.createdAt).getMonth() === currentMonth && new Date(booking.createdAt).getFullYear() === currentYear)
        .reduce((sum, item) => sum + item.net, 0);

      return res.status(200).json({
        success: true,
        data: {
          totalEarnings,
          grossRevenue,
          totalRefunded,
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
    const revenueBookings = await attachNetAmounts(bookings);
    const grossRevenue = revenueBookings.reduce((sum, item) => sum + item.paid, 0);
    const totalRefunded = revenueBookings.reduce((sum, item) => sum + item.refunded, 0);
    const totalEarnings = revenueBookings.reduce((sum, item) => sum + item.net, 0);
    const activeCount = bookings.filter(b => b.cancellation_status !== 1).length;
    const cancelledCount = bookings.filter(b => b.cancellation_status === 1).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthEarnings = revenueBookings
      .filter(({ booking }) => new Date(booking.createdAt).getMonth() === currentMonth && new Date(booking.createdAt).getFullYear() === currentYear)
      .reduce((sum, item) => sum + item.net, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        grossRevenue,
        totalRefunded,
        thisMonthEarnings,
        totalBookings: bookings.length,
        activeBookings: activeCount,
        cancelledBookings: cancelledCount,
        avgBookingValue: activeCount > 0 ? parseFloat((totalEarnings / activeCount).toFixed(2)) : 0
      }
    });

  } catch (error) {
    
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
        Booking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }),
        CoachBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }),
        PersonalTrainerBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } })
      ]);
      allBookings = [...venueBookings, ...coachBookings, ...trainerBookings];
    } else {
      const { query, model } = await getBookingsQuery(role, userID);
      if (!model) {
        return res.status(400).json({ success: false, message: "Invalid provider role" });
      }
      const bookings = await model.find(query);
      allBookings = bookings;
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
        grossRevenue: 0,
        refundedAmount: 0,
        bookingsCount: 0
      });
    }

    const revenueBookings = await attachNetAmounts(allBookings);
    revenueBookings.forEach(({ booking, paid, refunded, net }) => {
      const bDate = new Date(booking.createdAt);
      const bMonth = bDate.getMonth();
      const bYear = bDate.getFullYear();

      const bin = monthsData.find(m => m.monthIndex === bMonth && m.year === bYear);
      if (bin) {
        bin.earnings += net;
        bin.grossRevenue += paid;
        bin.refundedAmount += refunded;
        bin.bookingsCount += 1;
      }
    });

    return res.status(200).json({
      success: true,
      data: monthsData.map(m => ({
        month: `${m.monthName} ${m.year}`,
        earnings: m.earnings,
        grossRevenue: m.grossRevenue,
        refundedAmount: m.refundedAmount,
        bookings: m.bookingsCount
      }))
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// GET /api/earnings/vendor-settlements
// Super Admin settlement report for venue owners. A payout is calculated from
// successfully paid venue bookings only, after completed refunds.
exports.getVendorSettlements = async (req, res) => {
  try {
    if (req.user.role !== "Super Admin") {
      return res.status(403).json({
        success: false,
        message: "Only Super Admins can view vendor settlements.",
      });
    }

    const bookings = await Booking.find({
      paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES },
    })
      .populate("vendor_id", "first_name last_name mobile email")
      .populate("venue_id", "name city")
      .lean();

    const revenueBookings = await attachNetAmounts(bookings);
    const recordedPayouts = await VendorPayout.find({}).lean();
    const paidBySettlement = new Map();
    recordedPayouts.forEach((payout) => {
      const key = `${String(payout.vendor_id)}:${String(payout.venue_id)}`;
      paidBySettlement.set(key, (paidBySettlement.get(key) || 0) + Number(payout.amount || 0));
    });
    const settlements = new Map();

    revenueBookings.forEach(({ booking, paid, refunded, net }) => {
      const vendor = booking.vendor_id;
      const venue = booking.venue_id;
      const vendorId = vendor?._id ? String(vendor._id) : String(booking.vendor_id || "unassigned");
      const venueId = venue?._id ? String(venue._id) : String(booking.venue_id || "unknown");
      const key = `${vendorId}:${venueId}`;

      if (!settlements.has(key)) {
        const vendorName = vendor
          ? `${vendor.first_name || ""} ${vendor.last_name || ""}`.trim() || "Venue Admin"
          : "Vendor not assigned";
        settlements.set(key, {
          key,
          vendorId,
          vendorName,
          vendorMobile: vendor?.mobile ? String(vendor.mobile) : "—",
          vendorEmail: vendor?.email || "—",
          venueId,
          venueName: venue?.name || "Venue not available",
          city: venue?.city || "—",
          bookings: 0,
          grossCollections: 0,
          refundedAmount: 0,
          netCollections: 0,
          platformFee: 0,
          payableAmount: 0,
        });
      }

      const settlement = settlements.get(key);
      settlement.bookings += 1;
      settlement.grossCollections += paid;
      settlement.refundedAmount += refunded;
      settlement.netCollections += net;
      // No commission configuration exists yet, so the full net collection is
      // payable to the vendor. Keeping this as a separate field makes the
      // report ready for a future configurable platform fee.
      settlement.payableAmount += net;
    });

    const data = [...settlements.values()]
      .map((settlement) => ({
        ...settlement,
        grossCollections: Number(settlement.grossCollections.toFixed(2)),
        refundedAmount: Number(settlement.refundedAmount.toFixed(2)),
        netCollections: Number(settlement.netCollections.toFixed(2)),
        payableAmount: Number(settlement.payableAmount.toFixed(2)),
        paidAmount: 0,
        pendingPayout: 0,
        payoutStatus: "Pending payout",
      }))
      .map((settlement) => {
        const paidAmount = Math.min(settlement.payableAmount, paidBySettlement.get(settlement.key) || 0);
        const pendingPayout = Math.max(0, settlement.payableAmount - paidAmount);
        return { ...settlement, paidAmount, pendingPayout, payoutStatus: pendingPayout === 0 ? "Settled" : paidAmount > 0 ? "Partially paid" : "Pending payout" };
      })
      .sort((a, b) => b.payableAmount - a.payableAmount);

    return res.status(200).json({
      success: true,
      data,
      totals: {
        vendors: new Set(data.map((item) => item.vendorId)).size,
        venues: data.length,
        payableAmount: Number(data.reduce((sum, item) => sum + item.pendingPayout, 0).toFixed(2)),
      },
      note: "Vendor payable = successful paid venue collections − completed refunds. Platform fee is currently ₹0.",
    });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Unable to load vendor settlements." });
  }
};

// POST /api/earnings/vendor-payouts
exports.recordVendorPayout = async (req, res) => {
  try {
    if (req.user.role !== "Super Admin") return res.status(403).json({ success: false, message: "Only Super Admins can record payouts." });
    const { vendorId, venueId, amount, payoutDate, reference, note } = req.body;
    if (!vendorId || !venueId || !Number(amount) || Number(amount) <= 0 || !payoutDate || !String(reference || "").trim()) {
      return res.status(400).json({ success: false, message: "Vendor, venue, amount, payment date, and UTR/reference are required." });
    }
    const payout = await VendorPayout.create({ vendor_id: vendorId, venue_id: venueId, amount: Number(amount), payout_date: new Date(payoutDate), reference: String(reference).trim(), note: String(note || "").trim(), recorded_by: req.user.userID });
    return res.status(201).json({ success: true, data: payout, message: "Payout recorded successfully." });
  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Unable to record payout." });
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
        Booking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }).populate("user_id venue_id vendor_id").sort({ createdAt: -1 }).limit(10),
        CoachBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }).populate("userId coachId").sort({ createdAt: -1 }).limit(10),
        PersonalTrainerBooking.find({ paymentStatus: { $in: SUCCESSFUL_PAYMENT_STATUSES } }).populate("user_id pt_id").sort({ createdAt: -1 }).limit(10)
      ]);

      rawBookings = [
        ...venueBookings.map(b => ({
          id: b._id,
          user: b.user_id ? `${b.user_id.first_name || ""} ${b.user_id.last_name || ""}`.trim() : "Walk-in User",
          service: b.venue_id ? b.venue_id.name : "Venue Booking",
          owner: b.vendor_id
            ? `${b.vendor_id.first_name || ""} ${b.vendor_id.last_name || ""}`.trim() || "Venue Admin"
            : "Owner not assigned",
          ownerContact: b.vendor_id?.mobile ? String(b.vendor_id.mobile) : "",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: "Venue",
          date: b.createdAt
        })),
        ...coachBookings.map(b => ({
          id: b._id,
          user: b.userId ? `${b.userId.first_name || ""} ${b.userId.last_name || ""}`.trim() : "Walk-in User",
          service: b.coachId ? `${b.coachId.first_name || ""} ${b.coachId.last_name || ""}`.trim() : "Coach Booking",
          owner: b.coachId ? `${b.coachId.first_name || ""} ${b.coachId.last_name || ""}`.trim() : "Coach not assigned",
          ownerContact: b.coachId?.mobile ? String(b.coachId.mobile) : "",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: "Coach",
          date: b.createdAt
        })),
        ...trainerBookings.map(b => ({
          id: b._id,
          user: b.user_id ? `${b.user_id.first_name || ""} ${b.user_id.last_name || ""}`.trim() : "Walk-in User",
          service: b.pt_id ? `${b.pt_id.first_name || ""} ${b.pt_id.last_name || ""}`.trim() : "Trainer Booking",
          owner: b.pt_id ? `${b.pt_id.first_name || ""} ${b.pt_id.last_name || ""}`.trim() : "Trainer not assigned",
          ownerContact: b.pt_id?.mobile ? String(b.pt_id.mobile) : "",
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
          owner: role,
          ownerContact: "",
          amount: b.total_price,
          status: b.cancellation_status === 1 ? "Cancelled" : "Success",
          type: role,
          date: b.createdAt
        };
      });
    }

    // Sort by date descending
    rawBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    const bookingIds = rawBookings.map((booking) => String(booking.id));
    const refunds = bookingIds.length
      ? await Refund.find({ booking_id: { $in: bookingIds } }).lean()
      : [];
    const refundByBooking = new Map();
    refunds.forEach((refund) => {
      const id = String(refund.booking_id);
      const current = refundByBooking.get(id) || { amount: 0, status: "" };
      current.amount += Number(refund.refundAmount || 0);
      const status = String(refund.refundStatus || "").toUpperCase();
      if (["SUCCESS", "COMPLETED"].includes(status) || !current.status) current.status = status;
      refundByBooking.set(id, current);
    });

    rawBookings = rawBookings.map((booking) => {
      const refund = refundByBooking.get(String(booking.id));
      const isRefunded = ["SUCCESS", "COMPLETED"].includes(refund?.status);
      return {
        ...booking,
        refundAmount: refund?.amount || 0,
        refundStatus: refund?.status || null,
        netAmount: Math.max(0, Number(booking.amount || 0) - Number(refund?.amount || 0)),
        status: isRefunded ? "Refunded" : booking.status,
      };
    });

    return res.status(200).json({
      success: true,
      data: rawBookings.slice(0, 10)
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
