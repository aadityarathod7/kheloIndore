import React, { useState, useEffect, useMemo } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, useParams, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

interface BookData {
  _id: number;
  venue_id: number;
  date: string;
  slots: any;
}

type TimeSlot = {
  slot_id: any;
  time: string;
  isActive: boolean;
  isChecked: boolean;
  slots: any;
};

interface VenueData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  amenities: string;
  activities: string;
  category: string;
  images: any;
  src: string;
  _id: string;
  price_per_hr: number;
  vendor_type?: string;
}

interface JwtPayload {
  first_name: string;
  userID: string;
}

interface FormatedDate {
  id: any;
  date: any;
}

interface Slots {
  price: any;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isChecked?: boolean;
}

const VenueTimeDate = () => {
  const routes = all_routes;
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [bookData, setBookData] = useState<BookData[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [newSelectedTimeId, setNewSelectedTimeId] = useState<number>(0);

  const [dateData, setDateData] = useState([]);
  const [formateDateData, setFormateDateData] = useState<FormatedDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDateId, setSelectedDateId] = useState<any>();
  const [slots, setSlots] = useState<Slots[]>([]);
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchSlots = async () => {
    try {
      const venue_id = id;
      const response = await axios.get(
        `${API_URL}/venue/fetch-all-slot/${venue_id}`
      );
      setDateData(response.data.data);

      const fetchVenueId = async () => {
        try {
          const responseVenue = await axios.get(`${API_URL}/venue/individual/${id}`);
          setVenueData(responseVenue.data.venue);
        } catch (error) {
          console.error("Error fetching venue details:", error);
        }
      };
      await fetchVenueId();

      const bData = response.data.data;
      if (Array.isArray(bData)) {
        const mappedData = bData.map((book: any) => ({
          date: book.date,
          _id: book.id,
          venue_id: book.venue_id,
          slots: book.slots,
        }));
        setBookData(mappedData);
      } else {
        setBookData(bData);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    const formattedDate = dateData?.map((data: any) => ({
      id: data?._id,
      date: data?.date,
    }));
    setFormateDateData(formattedDate);

    // Auto-select initial date if available
    if (formattedDate && formattedDate.length > 0 && !selectedDateId) {
      setSelectedDateId(formattedDate[0].id);
      if (formattedDate[0].date) {
        setSelectedDate(new Date(formattedDate[0].date));
      }
    }
  }, [dateData]);

  const highlightDates = dateData.map((data: any) => new Date(data.date));

  useEffect(() => {
    if (!selectedDateId) return;
    const fetchSlotsData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/get/venue/fetch-slot/${selectedDateId}`
        );
        const fetchedSlots = response?.data?.data?.slots || [];
        setSlots(fetchedSlots);
      } catch (error) {
        console.error("Error fetching slot details:", error);
      }
    };
    fetchSlotsData();
  }, [selectedDateId]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const selectedData = formateDateData.find(
        (data) => new Date(data.date).toDateString() === date.toDateString()
      );
      if (selectedData) {
        setSelectedDateId(selectedData.id);
      }
    }
  };

  const handleQuickSelect = (type: "today" | "tomorrow" | "this-weekend" | "next-weekend") => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (type === "today") {
      handleDateChange(d);
    } else if (type === "tomorrow") {
      d.setDate(d.getDate() + 1);
      handleDateChange(d);
    } else if (type === "this-weekend") {
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      handleDateChange(d);
    } else if (type === "next-weekend") {
      const day = d.getDay();
      const diff = ((6 - day + 7) % 7 || 7) + 7;
      d.setDate(d.getDate() + diff);
      handleDateChange(d);
    }
  };

const ALL_STANDARD_SLOTS = [
  { startTime: "06:00 AM", endTime: "07:00 AM" },
  { startTime: "07:00 AM", endTime: "08:00 AM" },
  { startTime: "08:00 AM", endTime: "09:00 AM" },
  { startTime: "09:00 AM", endTime: "10:00 AM" },
  { startTime: "10:00 AM", endTime: "11:00 AM" },
  { startTime: "11:00 AM", endTime: "12:00 PM" },
  { startTime: "12:00 PM", endTime: "01:00 PM" },
  { startTime: "01:00 PM", endTime: "02:00 PM" },
  { startTime: "02:00 PM", endTime: "03:00 PM" },
  { startTime: "03:00 PM", endTime: "04:00 PM" },
  { startTime: "04:00 PM", endTime: "05:00 PM" },
  { startTime: "05:00 PM", endTime: "06:00 PM" },
  { startTime: "06:00 PM", endTime: "07:00 PM" },
  { startTime: "07:00 PM", endTime: "08:00 PM" },
  { startTime: "08:00 PM", endTime: "09:00 PM" },
  { startTime: "09:00 PM", endTime: "10:00 PM" },
  { startTime: "10:00 PM", endTime: "11:00 PM" },
  { startTime: "11:00 PM", endTime: "12:00 AM" },
];

  const [selectedSlotTimes, setSelectedSlotTimes] = useState<string[]>([]);

  const handleSlotClick = (startTime: string) => {
    if (selectedSlotTimes.includes(startTime)) {
      setSelectedSlotTimes(selectedSlotTimes.filter((t) => t !== startTime));
    } else {
      setSelectedSlotTimes([...selectedSlotTimes, startTime]);
    }
  };

  const displaySlots = useMemo(() => {
    return ALL_STANDARD_SLOTS.map((stdSlot) => {
      const foundApiSlot = slots?.find((s: any) => {
        const apiTime = (s.startTime || s.time || "").toLowerCase().trim();
        const stdTime = stdSlot.startTime.toLowerCase().trim();
        return apiTime === stdTime || apiTime.replace(/^0/, "") === stdTime.replace(/^0/, "");
      });

      const isChecked = selectedSlotTimes.includes(stdSlot.startTime);
      const isBooked = foundApiSlot ? Boolean(foundApiSlot.isBooked) : false;
      const price = foundApiSlot?.price || venueData?.price_per_hr || 750;

      return {
        ...stdSlot,
        price,
        isBooked,
        isChecked,
        slot_id: foundApiSlot?.slot_id || foundApiSlot?._id,
      };
    });
  }, [slots, selectedSlotTimes, venueData]);

  const selectedSlots = useMemo(() => {
    return displaySlots.filter((slot) => slot.isChecked);
  }, [displaySlots]);

  const subtotalPrice = useMemo(() => {
    return selectedSlots.reduce((total, slot) => total + Number(slot.price || 0), 0);
  }, [selectedSlots]);

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode<JwtPayload>(token);
          setUserData(decodedToken);
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    };
    getTokenFromStorage();
  }, []);

  const formatDateDisplay = (dateObj: Date | null) => {
    if (!dateObj) return "Select a date";
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeDisplay = (timeStr: string, format: "12" | "24") => {
    if (!timeStr) return "";
    if (format === "12") return timeStr;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return timeStr;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    const hStr = hours.toString().padStart(2, "0");
    return `${hStr}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) {
      Swal.fire({
        title: "Not Logged In",
        text: "You need to be logged in to book a venue. Click OK to login.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (selectedSlots.length > 0 && selectedDate) {
      const slotsBooked = selectedSlots.map((s: any) => s.startTime);
      const activeDateDoc = dateData?.find((d: any) => d._id === selectedDateId);
      const dbDateStr = activeDateDoc ? activeDateDoc.date : selectedDate;

      const dataPayload = {
        user_id: userData?.userID,
        venue_id: venueData?._id,
        slotsBooked,
        total_price: subtotalPrice,
        date: dbDateStr,
      };

      navigate(`/sports-venue/venue-confirm/${id}`, {
        state: {
          venueData,
          selectedDate,
          timeSlots: slots,
          bookData,
          newSelectedTimeId: subtotalPrice,
          data: dataPayload,
          selectedSlots,
        },
      });
    } else {
      Swal.fire({
        title: "No Slot Selected",
        text: "Please select at least one available time slot to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const minDate = new Date();

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* DatePicker Custom Styling Override */}
      <style dangerouslySetInnerHTML={{__html: `
        .react-datepicker {
          font-family: inherit !important;
          border: none !important;
          background-color: transparent !important;
          width: 100% !important;
        }
        .react-datepicker__header {
          background-color: transparent !important;
          border-bottom: none !important;
          padding-top: 0 !important;
        }
        .react-datepicker__current-month {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #0F172A !important;
          margin-bottom: 12px !important;
        }
        .react-datepicker__day-name {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #94A3B8 !important;
          width: 34px !important;
          line-height: 34px !important;
          margin: 2px !important;
        }
        .react-datepicker__day {
          width: 34px !important;
          line-height: 34px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          color: #334155 !important;
          border-radius: 8px !important;
          margin: 2px !important;
          transition: all 0.15s ease !important;
        }
        .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
          background-color: #F0FDF4 !important;
          color: #166534 !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #22C55E !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }
        .react-datepicker__day--disabled {
          color: #CBD5E1 !important;
          cursor: not-allowed !important;
          opacity: 0.5 !important;
        }
        .react-datepicker__navigation {
          top: 0 !important;
        }
        .btn-continue-step, .btn-continue-step span, .btn-continue-step i {
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }
      `}} />

      {/* Hero Header Banner */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "120px", paddingBottom: "36px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "8px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "44px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "12px" }}>
                Book <span style={{ color: "#22C55E", marginLeft: "10px" }}>{venueData?.name || "Venue"}</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "16px", fontWeight: "500", maxWidth: "480px" }}>
                Pick your date, time slot, and book the perfect sports venue
              </p>
              
              {/* Breadcrumb pill matching other pages */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <Link to="/sports-venue" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Sports Venues</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Time & Date</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content py-4" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container px-lg-4 px-3">
          
          {/* Centered Step Wizard Indicator */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            <div className="d-flex align-items-center">
              
              {/* Step 1 (Active) */}
              <div className="d-flex align-items-center gap-2">
                <span className="d-flex align-items-center justify-content-center fw-bold text-white rounded-circle shadow-sm" style={{ width: "28px", height: "28px", backgroundColor: "#22C55E", fontSize: "13px" }}>
                  1
                </span>
                <span className="fw-bold pb-1" style={{ color: "#0F172A", fontSize: "14px", borderBottom: "2.5px solid #22C55E" }}>
                  Time & Date
                </span>
              </div>

              {/* Dashed Connector Line */}
              <div className="mx-3" style={{ borderTop: "2px dashed #CBD5E1", width: "60px" }} />

              {/* Step 2 (Inactive) */}
              <div className="d-flex align-items-center gap-2" style={{ opacity: 0.6 }}>
                <span className="d-flex align-items-center justify-content-center fw-bold rounded-circle" style={{ width: "28px", height: "28px", backgroundColor: "#E2E8F0", color: "#64748B", fontSize: "13px" }}>
                  2
                </span>
                <span className="fw-medium" style={{ color: "#64748B", fontSize: "14px" }}>
                  Order Confirmation
                </span>
              </div>

            </div>
          </div>

          <div className="row g-4">
            
            {/* Left Column: Select Booking Date & Available Time Slots */}
            <div className="col-lg-8">
              <div className="bg-white rounded-4 p-4 shadow-sm border" style={{ borderColor: "#E2E8E3" }}>
                
                {/* 1. Date Picker Header */}
                <h3 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2" style={{ fontSize: "18px", color: "#0F172A" }}>
                  <i className="feather-calendar text-success" /> Select Booking Date
                </h3>

                {/* Calendar & Quick Select Grid */}
                <div className="row g-4 mb-4 align-items-center">
                  {/* Left Calendar Grid */}
                  <div className="col-md-7 pe-md-3">
                    <div className="p-3 rounded-4 bg-white border shadow-xs" style={{ borderColor: "#E2E8E3" }}>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        inline
                        minDate={minDate}
                        includeDates={highlightDates}
                      />
                    </div>
                  </div>

                  {/* Right Quick Select Stack */}
                  <div className="col-md-5 ps-md-3">
                    <label className="form-label fw-bold text-dark mb-3" style={{ fontSize: "14px", color: "#0F172A" }}>
                      Quick Select
                    </label>
                    <div className="d-flex flex-column gap-2.5">
                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-start px-3.5 bg-white shadow-xs"
                        onClick={() => handleQuickSelect("today")}
                        style={{ height: "46px", borderRadius: "14px", border: "1px solid #E2E8F0", color: "#334155", fontSize: "13px", fontWeight: "500", transition: "all 0.2s ease" }}
                      >
                        <i className="feather-calendar text-success me-2.5" style={{ fontSize: "16px" }} />
                        <span>Today</span>
                      </button>

                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-start px-3.5 bg-white shadow-xs"
                        onClick={() => handleQuickSelect("tomorrow")}
                        style={{ height: "46px", borderRadius: "14px", border: "1px solid #E2E8F0", color: "#334155", fontSize: "13px", fontWeight: "500", transition: "all 0.2s ease" }}
                      >
                        <i className="feather-sun text-success me-2.5" style={{ fontSize: "16px" }} />
                        <span>Tomorrow</span>
                      </button>

                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-start px-3.5 bg-white shadow-xs"
                        onClick={() => handleQuickSelect("this-weekend")}
                        style={{ height: "46px", borderRadius: "14px", border: "1px solid #E2E8F0", color: "#334155", fontSize: "13px", fontWeight: "500", transition: "all 0.2s ease" }}
                      >
                        <i className="feather-calendar text-success me-2.5" style={{ fontSize: "16px" }} />
                        <span>This Weekend</span>
                      </button>

                      <button
                        type="button"
                        className="btn w-100 d-flex align-items-center justify-content-start px-3.5 bg-white shadow-xs"
                        onClick={() => handleQuickSelect("next-weekend")}
                        style={{ height: "46px", borderRadius: "14px", border: "1px solid #E2E8F0", color: "#334155", fontSize: "13px", fontWeight: "500", transition: "all 0.2s ease" }}
                      >
                        <i className="feather-calendar text-success me-2.5" style={{ fontSize: "16px" }} />
                        <span>Next Weekend</span>
                      </button>
                    </div>
                  </div>
                </div>

                <hr style={{ borderColor: "#F1F5F9", margin: "24px 0" }} />

                {/* 2. Available Time Slots Header & Toggle */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "18px", color: "#0F172A" }}>
                      <i className="feather-clock text-success" /> Available Time Slots
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginTop: "2px" }}>
                      Showing slots for <span style={{ color: "#1E293B", fontWeight: "700" }}>{formatDateDisplay(selectedDate)}</span>
                    </p>
                  </div>

                  {/* 12 Hrs / 24 Hrs Toggle Pill */}
                  <div className="d-inline-flex bg-light p-1 rounded-pill border" style={{ borderColor: "#E2E8F0" }}>
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-bold"
                      onClick={() => setTimeFormat("12")}
                      style={{
                        fontSize: "11px",
                        border: "none",
                        backgroundColor: timeFormat === "12" ? "#22C55E" : "transparent",
                        color: timeFormat === "12" ? "#FFFFFF" : "#64748B",
                        boxShadow: timeFormat === "12" ? "0 2px 6px rgba(34, 197, 94, 0.3)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      12 Hrs
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill px-3 py-1 fw-bold"
                      onClick={() => setTimeFormat("24")}
                      style={{
                        fontSize: "11px",
                        border: "none",
                        backgroundColor: timeFormat === "24" ? "#22C55E" : "transparent",
                        color: timeFormat === "24" ? "#FFFFFF" : "#64748B",
                        boxShadow: timeFormat === "24" ? "0 2px 6px rgba(34, 197, 94, 0.3)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      24 Hrs
                    </button>
                  </div>
                </div>

                {/* Time Slots Grid (6 columns on desktop) */}
                <div className="row g-2 mb-3">
                  {displaySlots.map((slot, idx) => {
                    const isChecked = slot.isChecked;
                    const isBooked = slot.isBooked;

                    return (
                      <div key={idx} className="col-xl-2 col-lg-3 col-md-4 col-6">
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSlotClick(slot.startTime)}
                          className="btn w-100 py-2.5 px-2 text-center transition-all"
                          style={{
                            height: "40px",
                            fontSize: "12px",
                            fontWeight: "600",
                            borderRadius: "10px",
                            backgroundColor: isChecked ? "#22C55E" : isBooked ? "#F1F5F9" : "#FFFFFF",
                            color: isChecked ? "#FFFFFF" : isBooked ? "#CBD5E1" : "#15803D",
                            border: isChecked ? "none" : isBooked ? "1px solid #E2E8F0" : "1px solid #BBF7D0",
                            cursor: isBooked ? "not-allowed" : "pointer",
                            boxShadow: isChecked ? "0 4px 12px rgba(34,197,94,0.3)" : "none"
                          }}
                        >
                          {formatTimeDisplay(slot.startTime, timeFormat)}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Info Footer Banner */}
                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: "#F0FDF4", border: "1px solid #DCFCE7", color: "#166534", fontSize: "12px", fontWeight: "500" }}>
                  <i className="feather-info text-success" style={{ fontSize: "15px", flexShrink: 0 }} />
                  <span>All slots are of 1 hour duration</span>
                </div>

              </div>
            </div>

            {/* Right Column: Booking Details Summary Card */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 p-4 shadow-sm border position-sticky" style={{ borderColor: "#E2E8E3", top: "100px" }}>
                
                {/* Header */}
                <h3 className="fw-bold text-dark pb-3 mb-3 border-bottom d-flex align-items-center gap-2" style={{ fontSize: "18px", color: "#0F172A", borderColor: "#F1F5F9" }}>
                  <i className="feather-clipboard text-success" /> Booking Details
                </h3>

                {/* Detail Summary Rows */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                      <i className="feather-calendar" /> Date
                    </span>
                    <span className="fw-bold text-dark" style={{ fontSize: "13px", color: "#1E293B" }}>
                      {formatDateDisplay(selectedDate)}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                      <i className="feather-clock" /> Time Slot
                    </span>
                    <span className="fw-bold text-dark text-truncate ms-2" style={{ fontSize: "13px", color: "#1E293B", maxWidth: "160px" }}>
                      {selectedSlots.length > 0
                        ? selectedSlots.map((s) => `${s.startTime} - ${s.endTime}`).join(", ")
                        : "03:00 PM - 04:00 PM"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                      <i className="feather-clock" /> Total Hours
                    </span>
                    <span className="fw-bold text-dark" style={{ fontSize: "13px", color: "#1E293B" }}>
                      {selectedSlots.length > 0 ? `${selectedSlots.length} Hour${selectedSlots.length > 1 ? "s" : ""}` : "1 Hour"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: "#F1F5F9" }}>
                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                      ₹ Subtotal
                    </span>
                    <span className="fw-extrabold text-dark" style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>
                      ₹{subtotalPrice || "0"}
                    </span>
                  </div>
                </div>

                {/* Continue CTA Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-continue-step w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm mb-3"
                  style={{ backgroundColor: "#22C55E", borderColor: "#22C55E", color: "#FFFFFF", fontSize: "15px", borderRadius: "12px", height: "48px" }}
                >
                  <span style={{ color: "#FFFFFF", fontWeight: "700" }}>Continue to Next Step</span>
                  <i className="feather-chevron-right" style={{ fontSize: "16px", color: "#FFFFFF" }} />
                </button>

                {/* Security Guarantee */}
                <div className="text-center text-muted d-flex align-items-center justify-content-center gap-2" style={{ fontSize: "12px", color: "#64748B" }}>
                  <i className="feather-lock me-2" style={{ fontSize: "14px", color: "#64748B" }} />
                  <span>Secure booking. Your details are safe with us.</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default VenueTimeDate;
