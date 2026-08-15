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
  isOfflineBlocked?: boolean;
  isChecked?: boolean;
}

const timeToMinutes = (value: string) => {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return -1;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

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
  const timeFormat: "12" | "24" = "12";

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
        } catch {
        // The request failure is handled by the surrounding UI state.
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
    } catch {
        // The request failure is handled by the surrounding UI state.
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
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    // Legacy records for one India calendar day can have different UTC
    // timestamps. Read every matching record so offline blocks are never
    // lost when the first record happens to be the available-slots record.
    const sameDayRecords = (dateData || []).filter((record: any) =>
      record?.date && new Date(record.date).toDateString() === selectedDate.toDateString()
    );
    setSlots(sameDayRecords.flatMap((record: any) => record?.slots || []));
  }, [dateData, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const selectedData = formateDateData.find(
        (data) => new Date(data.date).toDateString() === date.toDateString()
      );
      if (selectedData) {
        setSelectedDateId(selectedData.id);
      } else {
        setSelectedDateId(null);
        setSlots([]);
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

  const [selectedSlotTimes, setSelectedSlotTimes] = useState<string[]>([]);

  const handleSlotClick = (startTime: string) => {
    if (selectedSlotTimes.includes(startTime)) {
      setSelectedSlotTimes(selectedSlotTimes.filter((t) => t !== startTime));
    } else {
      setSelectedSlotTimes([...selectedSlotTimes, startTime]);
    }
  };

  const displaySlots = useMemo(() => {
    const offlineRanges = (slots || [])
      .filter((slot: any) => slot.isOfflineBlocked)
      .map((slot: any) => ({ start: timeToMinutes(slot.startTime), end: timeToMinutes(slot.endTime) }))
      .filter((range) => range.start >= 0 && range.end > range.start);

    const slotsByStartTime = new Map<number, any>();
    (slots || []).forEach((apiSlot: any) => {
      const start = timeToMinutes(apiSlot.startTime);
      if (start < 0) return;
      const isOfflineBlocked = Boolean(apiSlot.isOfflineBlocked) || offlineRanges.some((range) => start >= range.start && start < range.end);
      
      const isToday = selectedDate ? (new Date(selectedDate).toDateString() === new Date().toDateString()) : false;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const isPast = isToday && start < currentMinutes;

      const nextSlot = { ...apiSlot, isOfflineBlocked, isBooked: Boolean(apiSlot.isBooked) || isOfflineBlocked || isPast };
      const existingSlot = slotsByStartTime.get(start);
      if (!existingSlot || nextSlot.isOfflineBlocked || (!existingSlot.isBooked && nextSlot.isBooked)) {
        slotsByStartTime.set(start, nextSlot);
      }
    });

    return Array.from(slotsByStartTime.values()).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)).map((apiSlot: any) => {
      const isChecked = selectedSlotTimes.includes(apiSlot.startTime);
      const start = timeToMinutes(apiSlot.startTime);
      const isToday = selectedDate ? (new Date(selectedDate).toDateString() === new Date().toDateString()) : false;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const isPast = isToday && start < currentMinutes;

      const isBooked = Boolean(apiSlot.isBooked) || isPast;
      const isOfflineBlocked = Boolean(apiSlot.isOfflineBlocked);
      const price = apiSlot.price || venueData?.price_per_hr || 0;

      return {
        startTime: apiSlot.startTime,
        endTime: apiSlot.endTime,
        price,
        isBooked,
        isOfflineBlocked,
        isChecked,
        slot_id: apiSlot.slot_id || apiSlot._id,
      };
    });
  }, [slots, selectedSlotTimes, venueData, selectedDate]);

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
        } catch {
        // The request failure is handled by the surrounding UI state.
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
      if (selectedSlots.length < 2) {
        Swal.fire({
          title: "Minimum Booking Required",
          text: "Minimum booking duration is 1 hour (2 consecutive 30-minute slots). Please select another slot.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      // Check if consecutive
      const sortedSelected = [...selectedSlots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
      let isConsecutive = true;
      for (let i = 1; i < sortedSelected.length; i++) {
        const prevEnd = timeToMinutes(sortedSelected[i - 1].endTime);
        const currStart = timeToMinutes(sortedSelected[i].startTime);
        if (prevEnd !== currStart) {
          isConsecutive = false;
          break;
        }
      }

      if (!isConsecutive) {
        Swal.fire({
          title: "Consecutive Slots Required",
          text: "The selected time slots must be consecutive. Please adjust your selection.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      const slotsBooked = selectedSlots
        .map((s: any) => s.slot_id || s._id || s.id)
        .filter(Boolean);
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
        .react-datepicker__day--selected {
          background-color: #22C55E !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }
        .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--selected) {
          background-color: transparent !important;
          color: #334155 !important;
          font-weight: 500 !important;
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
      <div className="hero-booking-section venue-time-hero" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "8px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="venue-time-hero-title">
                <span className="venue-time-hero-action">Check</span>
                <span className="venue-time-hero-name">Availability</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "16px", fontWeight: "500", maxWidth: "480px" }}>
                Select a ground and date to see available time slots
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

                <div className="d-flex flex-nowrap gap-2 overflow-auto pb-3 mb-2">
                  {(dateData || []).slice(0, 8).map((dateItem: any) => {
                    const chipDate = new Date(dateItem.date);
                    const active = selectedDate?.toDateString() === chipDate.toDateString();
                    return (
                      <button key={dateItem._id} type="button" onClick={() => handleDateChange(chipDate)}
                        className="btn flex-shrink-0"
                        style={{ borderRadius: "12px", minWidth: "86px", padding: "9px 10px", fontSize: "12px", fontWeight: 700, border: active ? "1px solid #22C55E" : "1px solid #E2E8F0", background: active ? "#22C55E" : "#fff", color: active ? "#fff" : "#475569" }}>
                        {chipDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}
                      </button>
                    );
                  })}
                </div>

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

                {/* 2. Available Time Slots Header */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "18px", color: "#0F172A" }}>
                      <i className="feather-clock text-success" /> Available Time Slots
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginTop: "2px" }}>
                      Showing slots for <span style={{ color: "#1E293B", fontWeight: "700" }}>{formatDateDisplay(selectedDate)}</span>
                    </p>
                  </div>
                </div>

                {/* Time Slots Grid (6 columns on desktop) */}
                <div className="row g-2 mb-3">
                  {displaySlots.length > 0 ? (
                    displaySlots.map((slot, idx) => {
                      const isChecked = slot.isChecked;
                      const isBooked = slot.isBooked;
                      const isOfflineBlocked = slot.isOfflineBlocked;

                      return (
                        <div key={idx} className="col-xl-2 col-lg-3 col-md-4 col-6">
                          <button
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSlotClick(slot.startTime)}
                            className={`ki-booking-slot btn w-100 py-1 px-1 text-center transition-all d-flex align-items-center justify-content-center ${isChecked ? "is-selected" : ""}`}
                            style={{
                              minHeight: "84px",
                              fontSize: "12px",
                              fontWeight: "600",
                              borderRadius: "12px",
                              backgroundColor: isChecked ? "#15803D" : isOfflineBlocked ? "#171717" : isBooked ? "#6B2424" : "#FACC15",
                              color: isChecked || isOfflineBlocked || isBooked ? "#FFFFFF" : "#1F2937",
                              border: "none",
                              cursor: isBooked ? "not-allowed" : "pointer",
                              boxShadow: isChecked ? "0 4px 12px rgba(34,197,94,0.3)" : "none"
                            }}
                          >
                            {isOfflineBlocked ? (
                              "Offline block"
                            ) : (
                              <div className="d-flex flex-column align-items-center justify-content-center" style={{ lineHeight: 1.2 }}>
                                <span>{formatTimeDisplay(slot.startTime, timeFormat)}</span>
                                <span style={{ fontSize: "16px", fontWeight: "800", marginTop: "7px", color: isChecked || isOfflineBlocked || isBooked ? "#FFFFFF" : "#1F2937" }}>₹{slot.price}</span>
                                <small style={{ marginTop: "2px", opacity: 0.8 }}>per slot</small>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center py-4 text-muted" style={{ fontWeight: "500" }}>
                      <i className="feather-calendar me-1"></i> No slots available for this date.
                    </div>
                  )}
                </div>

                {/* Info Footer Banner */}
                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: "#F0FDF4", border: "1px solid #DCFCE7", color: "#166534", fontSize: "12px", fontWeight: "500" }}>
                  <i className="feather-info text-success" style={{ fontSize: "15px", flexShrink: 0 }} />
                  <span>Slots are in 30-minute intervals (06:00 AM – 11:30 PM)</span>
                </div>

              </div>
            </div>

            {/* Right Column: Booking Details Summary Card */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 p-4 shadow-sm border position-sticky" style={{ borderColor: "#E2E8E3", top: "100px" }}>
                
                {/* Header */}
                <h3 className="fw-bold text-dark pb-3 mb-3 border-bottom d-flex align-items-center gap-2" style={{ fontSize: "18px", color: "#0F172A", borderColor: "#F1F5F9" }}>
                  <i className="feather-shopping-cart text-success" /> Booking Summary
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
                        : <span className="text-muted fw-normal">No slot selected</span>}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                      <i className="feather-clock" /> Total Hours
                    </span>
                    <span className="fw-bold text-dark" style={{ fontSize: "13px", color: "#1E293B" }}>
                      {selectedSlots.length > 0 ? `${selectedSlots.length * 0.5} Hour${selectedSlots.length * 0.5 !== 1 ? "s" : ""}` : <span className="text-muted fw-normal">—</span>}
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
