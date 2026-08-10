import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

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
  contact_number: string;
}

const VenueOrderConfirm = () => {
  const routes = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const {
    selectedDate,
    selectedSlots,
    timeSlots,
    bookData,
    newSelectedTimeId,
    formatSeletedDate,
    data,
  } = state || {};
  const { id } = useParams<{ id: string }>();
  // Derive these values directly from route state. Keeping the derived array
  // in component state caused a new array on every render and an infinite
  // setState/useEffect loop.
  const selectedTimeSlots = useMemo(
    () => (selectedSlots ? selectedSlots.filter((slot: any) => slot.isChecked) : []),
    [selectedSlots]
  );
  const slotIds = useMemo(
    () => selectedTimeSlots.map((slot: any) => slot.slot_id || slot._id),
    [selectedTimeSlots]
  );
  const formattedDate = useMemo(() => {
    if (!selectedDate) return "";
    const localDate = new Date(selectedDate);
    return Number.isNaN(localDate.getTime()) ? "" : localDate.toLocaleDateString("en-CA");
  }, [selectedDate]);
  const totalPrice = selectedTimeSlots.reduce(
    (total: number, slot: any) => total + (slot.price || 0),
    0
  );

  // Decode user ID from token as a fallback
  const token = localStorage.getItem("token");
  let userIdFromToken = "";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userIdFromToken = decoded?.userID || decoded?.id || "";
    } catch {
        // The request failure is handled by the surrounding UI state.
      }
  }

  const bookingData = data || {};
  const venueId = bookingData?.venue_id || id;
  const userId = bookingData?.user_id || userIdFromToken;
  // The previous page may pass pre-calculated slot ids. Prefer those values so
  // the confirmation screen also works after navigation/HMR reloads.
  const slotId = useMemo(() => {
    const suppliedSlots = Array.isArray(bookingData?.slotsBooked)
      ? bookingData.slotsBooked
      : [];
    // Selected slots contain database IDs. Prefer them over legacy route
    // state, which previously stored only the displayed start time.
    const sourceSlots = slotIds.length > 0 ? slotIds : suppliedSlots;

    return sourceSlots
      .map((slot: any) =>
        typeof slot === "string" ? slot : slot?.slot_id || slot?._id || slot?.id
      )
      .filter(Boolean);
  }, [bookingData?.slotsBooked, slotIds]);
  const date = bookingData?.date || formattedDate;
  const total_Price = useMemo(() => {
    const suppliedTotal = Number(bookingData?.totalPrice ?? bookingData?.total_price);
    return Number.isFinite(suppliedTotal) && suppliedTotal > 0
      ? suppliedTotal
      : totalPrice;
  }, [bookingData?.totalPrice, bookingData?.total_price, totalPrice]);

  // Payment type selection (Partial 50% advance / Full payment)
  const [paymentType, setPaymentType] = useState<"partial" | "full">("full");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const payableAmount =
    paymentType === "partial" ? Math.round((total_Price || 0) * 0.5) : total_Price || 0;

  //   const openNewWindow = () => {
  //     window.open('https://mercury-uat.phonepe.com/transact/simulator?token=3GobA5RNrRCwUWUccUBeyTBSCransuCxvBXLOIZMWZVrgKGdyyuZJ', '_blank');
  // };

  useEffect(() => {
    const fetchVenueId = async () => {
      try {
        const response = await axios.get(`${API_URL}/venue/individual/${id}`);
        const venueData = response.data.venue;
        setVenueData(venueData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };
    fetchVenueId();
  }, [id]);

  const handleSubmit = async () => {
    if (!slotId.length || total_Price <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Select a valid slot",
        text: "Please return to the venue page and select an available time slot before paying.",
      });
      return;
    }

    if (!acceptedPolicy) {
      Swal.fire({
        icon: "warning",
        title: "Please accept the terms",
        text: "You must accept the booking & refund policy before proceeding to payment.",
        confirmButtonColor: "#22C55E"
      });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/venue/payment`, {
        user_id: userId,
        venue_id: venueId,
        date: date,
        slotsBooked: slotId,
        total_price: total_Price,
        payment_type: paymentType,
      });

      if (response && response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        // No alternative action is needed here.
      }
    } catch (error: any) {
      
      const errMsg = error?.response?.data?.message || "An error occurred while processing the payment";
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: errMsg,
        confirmButtonColor: "#22C55E"
      });
    }

    // Uncomment if you want to show a success message and then navigate
    // Swal.fire({
    //   title: 'Order Confirmed',
    //   text: 'Your order is confirmed.',
    //   icon: 'success',
    //   confirmButtonText: 'OK'
    // }).then(() => {
    //   navigate(`/sportsvenue/venue-payment/${id}`, {
    //     state: { selectedDate, timeSlots, bookData, newSelectedTimeId, responseData },
    //   });
    // });
  };

  const bookingId = useMemo(() => {
    return `KI-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVenueImgUrl = (images: any, index = 0): string => {
    const fallback = "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80";
    if (!images || !Array.isArray(images) || images.length === 0) return fallback;
    const item = images[index] !== undefined ? images[index] : images[0];
    if (!item) return fallback;
    const str = typeof item === "string" ? item : (item.src || item.url || "");
    if (!str) return fallback;
    if (str.startsWith("http://") || str.startsWith("https://")) return str;
    return `${IMG_URL}${str}`;
  };

  const totalDuration = selectedTimeSlots.length;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .info-pill-container {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }
        .info-pill-container:hover {
          background: #F1F5F9;
          border-color: #CBD5E1;
        }
        .card-redesigned {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
          padding: 24px;
        }
        .btn-pay-now, .btn-pay-now * {
          color: #FFFFFF !important;
        }
      `}} />

      {/* ═══ Standard Hero Header Banner ═══ */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "120px", paddingBottom: "36px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "8px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "44px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "12px" }}>
                Confirm <span style={{ color: "#22C55E", marginLeft: "10px" }}>Booking</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "16px", fontWeight: "500", maxWidth: "480px" }}>
                Please review your booking details and proceed to payment
              </p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <Link to="/sports-venue" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Sports Venues</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Order Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main Content Area ═══ */}
      <div className="content py-4" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container px-lg-4 px-3">
          
          {/* Centered Step Wizard Indicator */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            <div className="d-flex align-items-center">
              
              {/* Step 1 (Completed) */}
              <div className="d-flex align-items-center gap-2">
                <span className="d-flex align-items-center justify-content-center fw-bold text-white rounded-circle shadow-sm" style={{ width: "28px", height: "28px", backgroundColor: "#22C55E", fontSize: "13px" }}>
                  <i className="feather-check" style={{ fontSize: "14px" }} />
                </span>
                <span className="fw-bold pb-1 text-muted" style={{ fontSize: "14px" }}>
                  Time & Date
                </span>
              </div>

              {/* Connecting Line */}
              <div className="mx-3" style={{ borderTop: "2px solid #22C55E", width: "60px" }} />

              {/* Step 2 (Active) */}
              <div className="d-flex align-items-center gap-2">
                <span className="d-flex align-items-center justify-content-center fw-bold text-white rounded-circle shadow-sm" style={{ width: "28px", height: "28px", backgroundColor: "#22C55E", fontSize: "13px" }}>
                  2
                </span>
                <span className="fw-bold pb-1 text-dark" style={{ fontSize: "14px", borderBottom: "2.5px solid #22C55E" }}>
                  Order Confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Almost Done Alert Box */}
          <div className="p-3 mb-4 rounded-4 d-flex align-items-center gap-3 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" }}>
            <span className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: "36px", height: "36px" }}>
              <i className="feather-check-circle text-success" style={{ fontSize: "18px" }} />
            </span>
            <div>
              <h6 className="fw-extrabold mb-0.5 text-dark" style={{ fontSize: "14px", fontWeight: "800" }}>Almost Done!</h6>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Please review your booking details and proceed to payment.</p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="row g-4">
            
            {/* Left Column (Booking Details & Payment Info) */}
            <div className="col-lg-8">
              
              {/* Booking Details Card */}
              <div className="card-redesigned mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="feather-calendar text-success" style={{ fontSize: "18px" }} />
                  <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "16px" }}>Booking Details</h5>
                </div>

                <div className="row g-3 align-items-center">
                  
                  {/* Venue Image */}
                  <div className="col-md-4">
                    <div className="rounded-4 overflow-hidden shadow-xs border" style={{ height: "130px", borderColor: "#E2E8E3" }}>
                      <img
                        src={getVenueImgUrl(venueData?.images, 0)}
                        alt="Venue preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="col-md-8">
                    <span className="badge rounded-pill mb-1.5" style={{ backgroundColor: "#F0FDF4", color: "#166534", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>
                      {venueData?.category ? venueData.category.replace("_", " ") : "Sports Venue"}
                    </span>
                    <h4 className="fw-extrabold text-dark mb-1" style={{ fontSize: "18px", fontWeight: "800", lineHeight: "1.2" }}>
                      {venueData?.name}
                    </h4>
                    <p className="text-muted mb-2 text-truncate" style={{ fontSize: "12px" }}>
                      <i className="feather-map-pin me-1 text-success" />
                      {venueData?.address || "Indore"}, Indore
                    </p>
                    {venueData?.address && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(venueData.name + " " + venueData.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-1 mb-3"
                        style={{ fontSize: "11px" }}
                      >
                        View on Map <i className="feather-external-link" style={{ fontSize: "10px" }} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Pills Row */}
                <div className="row g-2.5 mt-2">
                  
                  {/* Booking Date Pill */}
                  <div className="col-md-4">
                    <div className="info-pill-container d-flex align-items-center gap-2">
                      <span className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-xs" style={{ width: "30px", height: "30px" }}>
                        <i className="feather-calendar text-success" style={{ fontSize: "14px" }} />
                      </span>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "600" }}>Booking Date</span>
                        <span className="fw-bold text-dark d-block" style={{ fontSize: "12px" }}>
                          {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "Select Date"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots Pill */}
                  <div className="col-md-4">
                    <div className="info-pill-container d-flex align-items-center gap-2">
                      <span className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-xs" style={{ width: "30px", height: "30px" }}>
                        <i className="feather-clock text-success" style={{ fontSize: "14px" }} />
                      </span>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "600" }}>Time Slots</span>
                        <span className="fw-bold text-dark d-block text-truncate" style={{ fontSize: "12px", maxWidth: "130px" }}>
                          {selectedTimeSlots.length > 0 ? `${selectedTimeSlots[0].startTime} - ${selectedTimeSlots[0].endTime}` : "No Slots"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking ID Pill */}
                  <div className="col-md-4">
                    <div className="info-pill-container d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-xs" style={{ width: "30px", height: "30px" }}>
                          <i className="feather-tag text-success" style={{ fontSize: "14px" }} />
                        </span>
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "600" }}>Booking ID</span>
                          <span className="fw-bold text-dark d-block" style={{ fontSize: "12px" }}>{bookingId}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="btn btn-link p-0 text-muted"
                        style={{ border: "none" }}
                        title="Copy Booking ID"
                      >
                        <i className={copied ? "feather-check text-success" : "feather-copy"} style={{ fontSize: "13px" }} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Payment Information Card */}
              <div className="card-redesigned mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="feather-credit-card text-success" style={{ fontSize: "18px" }} />
                  <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "16px" }}>Payment Information</h5>
                </div>

                {/* Payment Type Selection */}
                <div className="mb-4">
                  <span className="text-muted d-block mb-2" style={{ fontSize: "12px", fontWeight: "600" }}>Select Payment Option</span>
                  <div className="d-flex flex-column gap-2">
                    <label
                      className={`d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 border cursor-pointer ${paymentType === "full" ? "border-success bg-success-subtle" : "border-secondary-subtle bg-white"}`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "full"}
                          onChange={() => setPaymentType("full")}
                          style={{ accentColor: "#22C55E" }}
                        />
                        <div>
                          <span className="fw-bold text-dark d-block" style={{ fontSize: "13px" }}>Full Payment</span>
                          <span className="text-muted" style={{ fontSize: "11px" }}>Pay the full amount now. Refundable (75%) if cancelled at least 4 hours before the booking.</span>
                        </div>
                      </div>
                      <strong className="text-success" style={{ fontSize: "15px" }}>₹{total_Price || "0"}</strong>
                    </label>

                    <label
                      className={`d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 border ${paymentType === "partial" ? "border-success bg-success-subtle" : "border-secondary-subtle bg-white"}`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "partial"}
                          onChange={() => setPaymentType("partial")}
                          style={{ accentColor: "#22C55E" }}
                        />
                        <div>
                          <span className="fw-bold text-dark d-block" style={{ fontSize: "13px" }}>Partial Payment (50% advance)</span>
                          <span className="text-muted" style={{ fontSize: "11px" }}>Pay 50% now to confirm your booking. <strong>Non-refundable.</strong></span>
                        </div>
                      </div>
                      <strong className="text-success" style={{ fontSize: "15px" }}>₹{Math.round((total_Price || 0) * 0.5)}</strong>
                    </label>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <span className="text-muted d-block mb-0.5" style={{ fontSize: "12px" }}>Amount Payable</span>
                    <span className="fw-extrabold text-dark" style={{ fontSize: "28px", fontWeight: "800" }}>₹{payableAmount || "0"}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ border: "1px solid #DCFCE7", backgroundColor: "#F0FDF4" }}>
                    <i className="feather-shield text-success" style={{ fontSize: "16px" }} />
                    <div style={{ fontSize: "11px" }}>
                      <span className="fw-bold text-dark d-block">Secure Booking</span>
                      <span className="text-muted">Your payment details are safe with us.</span>
                    </div>
                  </div>
                </div>

                {/* Policy Acceptance */}
                <div className="mt-3 p-3 rounded-3 d-flex align-items-start gap-2" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <input
                    type="checkbox"
                    id="acceptPolicy"
                    checked={acceptedPolicy}
                    onChange={(e) => setAcceptedPolicy(e.target.checked)}
                    style={{ accentColor: "#22C55E", marginTop: "2px" }}
                  />
                  <label htmlFor="acceptPolicy" className="text-muted" style={{ fontSize: "11px", lineHeight: "1.5", cursor: "pointer" }}>
                    I understand that <strong>partial payments are non-refundable</strong>, and full payments cancelled at least 4 hours before the booking time are refunded after a <strong>25% deduction</strong>. If this booking is made directly or through any platform other than Khelo Indore, Khelo Indore will not be responsible.
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column (Booking Summary & Policy Widgets) */}
            <div className="col-lg-4">
              
              {/* Booking Summary Card */}
              <div className="card-redesigned mb-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="feather-file-text text-success" style={{ fontSize: "18px" }} />
                  <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "16px" }}>Booking Summary</h5>
                </div>

                <div className="d-flex flex-column gap-2 mb-2" style={{ fontSize: "13px" }}>
                  
                  <div className="d-flex align-items-start justify-content-between py-1.2 border-bottom" style={{ borderColor: "#F1F5F9" }}>
                    <span className="text-muted">Venue Name</span>
                    <span className="fw-bold text-dark text-end" style={{ maxWidth: "160px" }}>{venueData?.name || "Venue"}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-1.2 border-bottom" style={{ borderColor: "#F1F5F9" }}>
                    <span className="text-muted">Booking Date</span>
                    <span className="fw-bold text-dark">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "Select Date"}
                    </span>
                  </div>

                  <div className="d-flex align-items-start justify-content-between py-1.2 border-bottom" style={{ borderColor: "#F1F5F9" }}>
                    <span className="text-muted">Time Slots</span>
                    <span className="fw-bold text-dark text-end" style={{ maxWidth: "160px" }}>
                      {selectedTimeSlots.length > 0 ? (
                        selectedTimeSlots.map((slot: any) => `${slot.startTime} - ${slot.endTime}`).join(", ")
                      ) : "No Slots Selected"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-1.2 border-bottom" style={{ borderColor: "#F1F5F9" }}>
                    <span className="text-muted">Total Duration</span>
                    <span className="fw-bold text-dark">{totalDuration} Hour{totalDuration !== 1 ? "s" : ""}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>Total Price</span>
                    <span className="fw-extrabold text-success" style={{ fontSize: "18px", fontWeight: "800" }}>₹{total_Price || "0"}</span>
                  </div>

                </div>
              </div>

              {/* Navigation Actions below Booking Summary */}
              <div className="d-flex align-items-center gap-2 mt-3">
                <Link
                  className="btn btn-outline-secondary rounded-pill px-3 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-xs"
                  to={`/sports-venue/venue-timedate/${id}`}
                  style={{ border: "1px solid #CBD5E1", fontSize: "13px", flex: "1" }}
                >
                  <i className="feather-arrow-left" /> Back
                </Link>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-success btn-pay-now rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ backgroundColor: "#22C55E", borderColor: "#22C55E", fontSize: "13px", flex: "1.5" }}
                >
                  Pay Now <i className="feather-arrow-right" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default VenueOrderConfirm;
