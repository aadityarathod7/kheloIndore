import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { openCashfreeCheckout } from "../../utils/cashfreeCheckout";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import Swal from "sweetalert2";

interface EventData {
  _id?: string;
  id?: string;
  event_name: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  price?: number;
  organized_by?: string;
  category?: string;
  images?: { src?: string; alt?: string }[];
  terms_and_conditions?: string;
}

interface JwtPayload {
  userID?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
}

const imageUrl = (src?: string) =>
  src && /^https?:\/\//i.test(src) ? src : src ? `${IMG_URL}${src}` : "/assets/img/no-img.png";

const EventOrderConfirm = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // User & Attendee info
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");

  const storedConfirmation = useMemo(() => {
    try {
      const item =
        sessionStorage.getItem("activeEventBookingConfirmation") ||
        sessionStorage.getItem("pendingBooking");
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed?.state) return parsed.state;
        return parsed;
      }
    } catch {
      // Ignore parse error
    }
    return null;
  }, []);

  const effectiveState = location.state || storedConfirmation || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      sessionStorage.setItem("activeEventBookingConfirmation", JSON.stringify(location.state));
    }
  }, [location.state]);

  // Decode user from auth token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const name = [decoded.first_name, decoded.last_name].filter(Boolean).join(" ");
        if (name && !attendeeName) setAttendeeName(name);
        if (decoded.email && !attendeeEmail) setAttendeeEmail(decoded.email);
        if (decoded.mobile && !attendeePhone) setAttendeePhone(String(decoded.mobile));
      } catch {
        // Token parse error
      }
    }
  }, []);

  // Fetch Event details if not present in state
  useEffect(() => {
    if (effectiveState?.eventData) {
      setEventData(effectiveState.eventData);
      setLoadingEvent(false);
      return;
    }

    if (!id) return;

    axios
      .get(`${API_URL}/event/get/${id}`)
      .then(({ data }) => {
        setEventData(data?.data || null);
      })
      .catch(() => setEventData(null))
      .finally(() => setLoadingEvent(false));
  }, [id, effectiveState?.eventData]);

  const tickets = Math.max(1, Number(effectiveState?.tickets) || 1);
  const unitPrice = Math.max(0, Number(eventData?.price) || 0);
  const totalPrice = unitPrice * tickets;

  const start = eventData?.start_date ? new Date(eventData.start_date) : null;
  const end = eventData?.end_date ? new Date(eventData.end_date) : null;
  const eventDateStr = start
    ? start.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBD";
  const eventTimeStr = start
    ? start.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    : "TBD";
  const durationHours =
    start && end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000)) : 2;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms & Conditions",
        text: "Please accept the event terms, booking & cancellation policy to proceed.",
        confirmButtonColor: "#22C55E",
      });
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          targetUrl: `/events/event-confirm/${id}`,
          eventId: id,
          state: { ...effectiveState, attendeeName, attendeeEmail, attendeePhone },
          type: "event",
          timestamp: Date.now(),
        })
      );

      Swal.fire({
        title: "Login to continue",
        text: "Please log in to complete your event registration and payment.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login / Register",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#22C55E",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", {
            state: {
              URL: `/events/event-confirm/${id}`,
              bookingState: effectiveState,
              returnTo: `/events/event-confirm/${id}`,
            },
          });
        }
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/event/booking/create`,
        {
          event_id: id || eventData?._id || eventData?.id,
          tickets,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          attendee_phone: attendeePhone,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      sessionStorage.removeItem("pendingBooking");
      sessionStorage.removeItem("activeEventBookingConfirmation");

      if (response.data?.is_free) {
        // Free registration success
        Swal.fire({
          icon: "success",
          title: "Registration Confirmed! 🎉",
          text: `You have successfully registered ${tickets} ticket(s) for ${eventData?.event_name}.`,
          confirmButtonColor: "#22C55E",
          confirmButtonText: "View My Bookings",
        }).then(() => {
          sessionStorage.setItem("lastBookingType", "events");
          navigate("/user/user-bookings?booking=success&type=events");
        });
      } else if (response.data?.payment_session_id) {
        // Paid event Cashfree checkout
        sessionStorage.setItem("lastBookingType", "events");
        await openCashfreeCheckout(response.data.payment_session_id);
      } else {
        throw new Error(response.data?.message || "Failed to initiate payment.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Booking Failed",
        text: error.response?.data?.message || error.message || "An error occurred during booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#22C55E",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* High contrast text and layout standardisation matching venue & coach order confirm */
        .booking-steps {
          background-color: #FFFFFF !important;
          border-bottom: 1px solid #E2E8F0 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01) !important;
        }
        .booking-steps li a {
          color: #475569 !important;
          font-weight: 500 !important;
          text-decoration: none !important;
        }
        .booking-steps li.active a {
          color: #22C55E !important;
          font-weight: 700 !important;
        }
        .booking-steps li.active a span {
          background-color: #22C55E !important;
          color: #FFFFFF !important;
        }
        .booking-steps li a span {
          background-color: #F1F5F9 !important;
          color: #475569 !important;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-weight: 700;
        }
        
        .eoc-card {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 20px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
          padding: 28px !important;
          margin-bottom: 24px;
        }
        .eoc-card-title {
          color: #0F172A !important;
          font-size: 18px !important;
          font-weight: 800 !important;
          border-bottom: 1px solid #F1F5F9 !important;
          padding-bottom: 14px !important;
          margin-bottom: 20px !important;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eoc-card-title i { color: #22C55E; }
        
        .eoc-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .eoc-info-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .eoc-info-item h6 {
          color: #64748B !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.6px !important;
          margin-bottom: 6px !important;
        }
        .eoc-info-item p {
          color: #0F172A !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          margin-bottom: 0 !important;
        }
        
        .eoc-summary-card {
          background: #FFFFFF !important;
          border: 2px solid #22C55E !important;
          border-radius: 20px !important;
          padding: 28px !important;
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.08) !important;
          position: sticky;
          top: 100px;
        }
        .eoc-summary-title {
          color: #0F172A !important;
          font-size: 20px !important;
          font-weight: 800 !important;
          margin-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 12px;
        }
        .eoc-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #475569;
        }
        .eoc-summary-row.total {
          border-top: 2px dashed #E2E8F0;
          padding-top: 16px;
          margin-top: 16px;
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
        }
        .eoc-summary-row.total .amount {
          color: #16A34A;
          font-size: 24px;
        }
        
        .eoc-pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #22C55E, #16A34A) !important;
          border: none !important;
          color: #FFFFFF !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          padding: 14px 24px !important;
          border-radius: 12px !important;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.35);
        }
        .eoc-pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.45);
        }
        .eoc-pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .eoc-badge {
          display: inline-block;
          background: #DCFCE7;
          border: 1px solid #BBF7D0;
          color: #166534;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
        }
      `}} />

      {/* Hero standard header */}
      <div
        className="hero-booking-section standard-page-hero"
        style={{
          background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
          paddingTop: "110px",
          paddingBottom: "40px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          className="hero-artwork-blend"
          style={{
            position: "absolute",
            right: "-60px",
            top: 0,
            bottom: 0,
            width: "55%",
            backgroundImage: "url('/assets/img/bg/banner-illustration.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            opacity: 0.86,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-start">
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "12px",
                  color: "#22C55E",
                  fontWeight: "700",
                }}
              >
                BOOK. PLAY. ENJOY
              </span>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "800",
                  color: "#0F172A",
                  lineHeight: "1.1",
                  marginBottom: "16px",
                }}
              >
                Event <span style={{ color: "#22C55E" }}>Confirmation</span>
              </h1>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "18px",
                  marginBottom: "24px",
                  fontWeight: "500",
                  maxWidth: "520px",
                }}
              >
                Review your event booking details and confirm your ticket reservation
              </p>
              <div
                className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm"
                style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}
              >
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>
                  <i className="feather-home me-1" style={{ color: "#64748B" }} /> Home
                </Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}>
                  <i className="feather-chevron-right" style={{ fontSize: "12px" }} />
                </span>
                <Link to="/events" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>
                  Events
                </Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}>
                  <i className="feather-chevron-right" style={{ fontSize: "12px" }} />
                </span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Order Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Booking Stepper */}
      <section className="booking-steps py-3">
        <div className="container">
          <ul className="d-flex justify-content-center align-items-center list-unstyled mb-0 gap-4">
            <li>
              <Link to={`/events/event-details/${id}`}>
                <span>1</span>Event Details
              </Link>
            </li>
            <li className="active">
              <Link to="#">
                <span>2</span>Order Confirmation
              </Link>
            </li>
            <li>
              <span style={{ opacity: 0.6 }}>
                <span>3</span>Payment
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-5">
        {loadingEvent ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" />
            <p className="mt-3 text-muted">Loading event confirmation…</p>
          </div>
        ) : !eventData ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-4">
            <h5>Event Not Found</h5>
            <p className="text-muted">The requested event could not be found or has expired.</p>
            <Link to="/events" className="btn btn-success mt-2">
              Explore Events
            </Link>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            <div className="row g-4">
              {/* Left Column: Event & Attendee Details */}
              <div className="col-lg-8">
                {/* Event Overview Card */}
                <div className="eoc-card">
                  <h5 className="eoc-card-title">
                    <i className="feather-calendar" /> Event Summary
                  </h5>
                  <div className="d-flex gap-4 flex-column flex-sm-row align-items-start mb-4">
                    <img
                      src={imageUrl(eventData.images?.[0]?.src)}
                      alt={eventData.event_name}
                      style={{
                        width: "140px",
                        height: "105px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        flexShrink: 0,
                      }}
                      onError={(e: any) => {
                        e.target.src = "/assets/img/no-img.png";
                      }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="eoc-badge">{eventData.category || "Sports Event"}</span>
                        {eventData.organized_by && (
                          <span className="text-muted small">
                            by <strong>{eventData.organized_by}</strong>
                          </span>
                        )}
                      </div>
                      <h4 style={{ color: "#0F172A", fontWeight: "800", fontSize: "20px", marginBottom: "8px" }}>
                        {eventData.event_name}
                      </h4>
                      <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "0" }}>
                        <i className="feather-map-pin text-success me-1" />
                        {eventData.location || "Indore"}
                      </p>
                    </div>
                  </div>

                  <div className="eoc-info-grid">
                    <div className="eoc-info-item">
                      <h6>Date</h6>
                      <p>{eventDateStr}</p>
                    </div>
                    <div className="eoc-info-item">
                      <h6>Start Time</h6>
                      <p>{eventTimeStr}</p>
                    </div>
                    <div className="eoc-info-item">
                      <h6>Duration</h6>
                      <p>{durationHours} Hours</p>
                    </div>
                    <div className="eoc-info-item">
                      <h6>Tickets Selected</h6>
                      <p>{tickets} Attendee{tickets > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                {/* Attendee Contact Information Card */}
                <div className="eoc-card">
                  <h5 className="eoc-card-title">
                    <i className="feather-user" /> Primary Attendee Details
                  </h5>
                  <p style={{ color: "#64748B", fontSize: "13px", marginTop: "-10px", marginBottom: "16px" }}>
                    Your ticket confirmation and booking updates will be sent to these contact details.
                  </p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="Enter full name"
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        style={{ height: "46px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        placeholder="Enter email address"
                        value={attendeeEmail}
                        onChange={(e) => setAttendeeEmail(e.target.value)}
                        style={{ height: "46px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        placeholder="10-digit mobile number"
                        value={attendeePhone}
                        onChange={(e) => setAttendeePhone(e.target.value)}
                        style={{ height: "46px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions Acceptance */}
                <div className="eoc-card">
                  <h5 className="eoc-card-title">
                    <i className="feather-shield" /> Booking &amp; Event Policy
                  </h5>
                  <p style={{ color: "#475569", fontSize: "13px", lineHeight: "1.7", marginBottom: "16px" }}>
                    {eventData.terms_and_conditions ||
                      "Tickets once booked are confirmed for the registered date and time. Please carry a valid ID proof and digital ticket confirmation at the event venue. Entry is subject to organizer guidelines."}
                  </p>
                  
                  <div
                    id="acceptTermsContainer"
                    onClick={() => setAcceptedTerms((prev) => !prev)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        setAcceptedTerms((prev) => !prev);
                      }
                    }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={acceptedTerms}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 18px",
                      backgroundColor: acceptedTerms ? "#F0FDF4" : "#F8FAFC",
                      border: `1.5px solid ${acceptedTerms ? "#22C55E" : "#CBD5E1"}`,
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        minWidth: "22px",
                        borderRadius: "6px",
                        border: acceptedTerms ? "2px solid #22C55E" : "2px solid #94A3B8",
                        backgroundColor: acceptedTerms ? "#22C55E" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        boxShadow: acceptedTerms ? "0 2px 6px rgba(34, 197, 94, 0.3)" : "none",
                      }}
                    >
                      {acceptedTerms && (
                        <i
                          className="feather-check"
                          style={{
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontWeight: 900,
                            lineHeight: 1,
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: acceptedTerms ? "#15803D" : "#0F172A",
                        cursor: "pointer",
                        lineHeight: "1.4",
                      }}
                    >
                      I accept the event terms, booking guidelines &amp; refund policy.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout */}
              <div className="col-lg-4">
                <div className="eoc-summary-card">
                  <h3 className="eoc-summary-title">Order Summary</h3>

                  <div className="eoc-summary-row">
                    <span>Ticket Price ({tickets}x)</span>
                    <strong style={{ color: "#0F172A" }}>
                      {unitPrice > 0 ? `₹${unitPrice} × ${tickets}` : "Free"}
                    </strong>
                  </div>

                  <div className="eoc-summary-row">
                    <span>Subtotal</span>
                    <strong style={{ color: "#0F172A" }}>₹{totalPrice}</strong>
                  </div>

                  <div className="eoc-summary-row">
                    <span>Platform &amp; Convenience Fee</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>

                  <div className="eoc-summary-row total">
                    <span>Total Payable</span>
                    <span className="amount">₹{totalPrice}</span>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="eoc-pay-btn"
                    >
                      {submitting ? (
                        <>
                          <div className="spinner-border spinner-border-sm text-white" role="status" />
                          <span>Processing…</span>
                        </>
                      ) : totalPrice === 0 ? (
                        <>
                          <i className="feather-check-circle" />
                          <span>Confirm Free Registration</span>
                        </>
                      ) : (
                        <>
                          <i className="feather-credit-card" />
                          <span>Proceed to Pay ₹{totalPrice}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                    <small style={{ color: "#64748B", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <i className="feather-lock text-success" />
                      Secured by Cashfree Payments
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventOrderConfirm;
