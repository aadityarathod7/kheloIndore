

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { openCashfreeCheckout } from "../../utils/cashfreeCheckout";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import Swal from 'sweetalert2';

interface TrainerData {
  first_name: string;
  last_name: string;
  duration: string;
  focus_area: string[];
  price: number;
  profile_picture: any;
  src: string;
  email: string;
  mobile: number;
  category?: string;
  trainer_type?: string;
  venue_name?: string;
  near_by_location?: string;
}

const TrainingOrderConfirm = (props: any) => {
  const routes = all_routes;
  const navigate = useNavigate();
  const idData = useParams();
  const id = idData.id;
  const location = useLocation();

  const storedConfirmation = useMemo(() => {
    try {
      const item = sessionStorage.getItem("activeBookingConfirmation") || sessionStorage.getItem("pendingBooking");
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed?.state) return parsed.state;
        return parsed;
      }
    } catch {
      // Ignore storage parse error
    }
    return null;
  }, []);

  const effectiveState = location.state || storedConfirmation || {};

  const [trainerData, setTrainerData] = useState<any>(
    effectiveState?.trainerData || effectiveState?.providerData || null
  );

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      let name = "";
      let email = "";
      let phone = "";

      if (storedUser) {
        const u = JSON.parse(storedUser);
        name = u.name || `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.userName || "";
        email = u.email || "";
        phone = u.mobile || u.phone || "";
      }

      if ((!name || !email || !phone) && token) {
        try {
          const decoded: any = jwtDecode(token);
          if (!name) name = decoded.name || decoded.userName || `${decoded.first_name || ""} ${decoded.last_name || ""}`.trim() || "";
          if (!email) email = decoded.email || "";
          if (!phone) phone = decoded.mobile || decoded.phone || "";
        } catch {
          // Token decode fallback
        }
      }

      setCustomerInfo({
        name: name || "Khelo Indore Member",
        email: email || "customer@kheloindore.in",
        phone: phone || "+91 8349307444",
      });
    } catch {
      // Storage retrieval fallback
    }
  }, []);

  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      sessionStorage.setItem("activeBookingConfirmation", JSON.stringify(location.state));
    }
  }, [location.state]);

  const { bookingData } = effectiveState;
  const isMembership = Boolean(effectiveState?.isMembership);
  const membershipPlan = effectiveState?.membershipPlan || effectiveState?.plan;
  const totalPriceNumber = Number(
    effectiveState?.totalPrice ||
    effectiveState?.total_Price ||
    bookingData?.total_price ||
    membershipPlan?.price ||
    0
  );
  const [paymentType, setPaymentType] = useState<string>("full");
  

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchTrainerId = async () => {
      if (!id) return;
      try {
        let res;
        try {
          res = await axios.get(`${API_URL}/web/PersonalTraining/fetch/${id}`);
        } catch {
          res = await axios.get(`${API_URL}/PersonalTraining/fetch/${id}`);
        }
        const trainer = res?.data?.personalTrainer || res?.data?.trainer || res?.data?.data;
        if (trainer) {
          setTrainerData((prev: any) => ({ ...(prev || {}), ...trainer }));
        }
      } catch {
        // Handled silently
      }
    };
    fetchTrainerId();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      sessionStorage.setItem("pendingBooking", JSON.stringify({
        targetUrl: `/trainers/training-order-confirm/${id}`,
        trainerId: id,
        state: effectiveState,
        type: "training",
        timestamp: Date.now(),
      }));

      Swal.fire({
        title: "Login to continue",
        text: "Please log in to complete your booking and payment.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login / Register",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#22C55E",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", {
            state: {
              URL: `/trainers/training-order-confirm/${id}`,
              bookingState: effectiveState,
              returnTo: `/trainers/training-order-confirm/${id}`,
            },
          });
        }
      });
      return;
    }

    try {
      if (effectiveState.isMembership) {
        const response = await axios.post(
          `${API_URL}/membership/checkout`,
          {
            provider_type: "trainer",
            provider_id: id,
            plan_index: effectiveState.planIndex ?? 0,
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (response?.data?.payment_session_id) {
          sessionStorage.removeItem("pendingBooking");
          sessionStorage.removeItem("activeBookingConfirmation");
          sessionStorage.setItem("lastBookingType", "memberships");
          await openCashfreeCheckout(response.data.payment_session_id);
          return;
        } else {
          throw new Error(response?.data?.message || "Unable to start Cashfree checkout.");
        }
      }

      const response = await axios.post(
        `${API_URL}/personalTrainer/payment`,
        {
          ...bookingData,
          payment_type: paymentType,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response?.data?.paymentSessionId) {
        sessionStorage.removeItem("pendingBooking");
        sessionStorage.removeItem("activeBookingConfirmation");
        sessionStorage.setItem("lastBookingType", "trainer");
        await openCashfreeCheckout(response.data.paymentSessionId);
      } else {
        throw new Error(response?.data?.message || "Unable to start Cashfree checkout.");
      }
      // navigate(`/coaches/coach-order-confirm/${id}`, {
      //   state: {
      //     bookingData,selectedTimeSlot
      //   },
      // });
    } catch (error) {
      
      Swal.fire({
        title: "Error",
        text: "Error in booking",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  

  return (
    <div>
      <>
        {/* Breadcrumb */}
      <style dangerouslySetInnerHTML={{__html: `
        /* High contrast text and layout standardisation */
        .booking-steps {
          background-color: #FFFFFF !important;
          border-bottom: 1px solid #E2E8F0 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01) !important;
        }
        .booking-steps li a {
          color: #475569 !important;
          font-weight: 500 !important;
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
        }
        
        /* Order Confirmation cards styling */
        .card {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
          padding: 30px !important;
        }
        .booking-order-confirmation h5 {
          color: #0F172A !important;
          font-weight: 700 !important;
          border-bottom: 1px solid #E2E8F0 !important;
          padding-bottom: 15px !important;
          margin-bottom: 25px !important;
        }
        .booking-info li h6 {
          color: #475569 !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.05em !important;
          margin-bottom: 8px !important;
        }
        .booking-info li p {
          color: #0F172A !important;
          font-weight: 600 !important;
          font-size: 16px !important;
        }
        
        /* Buttons overrides */
        .btn-primary {
          background-color: #22C55E !important;
          border-color: #22C55E !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
          padding: 12px 24px !important;
        }
        .btn-primary:hover {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
          color: #FFFFFF !important;
        }
        .btn-secondary {
          background-color: #F1F5F9 !important;
          border-color: #E2E8F0 !important;
          color: #475569 !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
        }
        .btn-secondary:hover {
          background-color: #E2E8F0 !important;
          color: #334155 !important;
        }
      `}} />
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Book <span style={{ color: "#22C55E", marginLeft: "12px" }}>Trainer</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Review your booking details and confirm your order</p>
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Book Trainer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <section className="booking-steps py-30">
          <div className="container">
            <ul className="d-xl-flex justify-content-center align-items-center">
              <li>
                <h5>
                  <Link to={``}>
                    <span>1</span>Time &amp; Date
                  </Link>
                </h5>
              </li>
              <li className="active">
                <h5>
                  <Link to={``}>
                    <span>2</span>Order Confirmation
                  </Link>
                </h5>
              </li>
              {/* <li>
                <h5>
                  <Link to={`/trainers/training-payment/${id}`}>
                    <span>3</span>Payment
                  </Link>
                </h5>
              </li> */}
            </ul>
          </div>
        </section>
        {/* Page Content */}
        <div className="content py-4" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="container">
            <div className="text-center mb-40">
              <h3 className="mb-1">Order Confirmation</h3>
              </div>
            {/* <section className="card mb-40">
              <div className="text-center mb-40">
                <h3 className="mb-1">Order Confirmation</h3>
                <p className="sub-title">
                  Booking confirmed. Contact support for changes/inquiries.
                  Enjoy your coaching experience with us.
                </p>
              </div>
              <div className="master-academy dull-whitesmoke-bg card">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-100 coach-book-img"
                        src={trainerData?.profile_picture?.[0]?.src ? `${IMG_URL}${trainerData.profile_picture?.[0]?.src}` : "/assets/img/featured/featured-06.jpg"}
                        alt="User"
                      />
                    </Link>
                    <div className="info">
                       <div className="d-flex justify-content-start align-items-center mb-3">
                        <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                          4.5
                        </span>
                        <span>300 Reviews</span>
                      </div> 
                      <h3 className="mb-2">{trainerData?.first_name} {trainerData?.last_name}</h3>
                      <p>
                        Certified Coach with a deep understanding of
                        the sport&apos;s strategies.
                      </p>
                    </div>
                  </div>
                  <div className="white-bg">
                    <p className="mb-1">Starts From</p>
                    <h3 className="d-inline-block primary-text mb-0">₹{trainerData?.price}</h3>
                    <span>/hr</span>
                  </div> 
                </div>
              </div>
            </section> */}
            <section className="card booking-order-confirmation">
              <h5 className="mb-3">Booking Details</h5>
              <ul className="booking-info d-lg-flex justify-content-between align-items-center W-100 flex-wrap">
                <li>
                  <h6>Coach / Trainer Name</h6>
                  <p>
                    {trainerData ? `${trainerData.first_name || ""} ${trainerData.last_name || ""}`.trim() : "Personal Trainer"}
                  </p>
                </li>
                {trainerData?.category && (
                  <li>
                    <h6>Sport / Discipline</h6>
                    <p>{trainerData.category}</p>
                  </li>
                )}
                <li>
                  <h6>{isMembership ? "Membership Plan" : "Appointment Date"}</h6>
                  <p>
                    {isMembership
                      ? `${membershipPlan?.name || "Membership"} (${membershipPlan?.months || 1} Month${(membershipPlan?.months || 1) > 1 ? "s" : ""} Access)`
                      : bookingData?.start_date && bookingData?.end_date
                        ? `${new Date(bookingData.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(bookingData.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                        : "N/A"}
                  </p>
                </li>
                <li>
                  <h6>{isMembership ? "Access Validity" : "Appointment Time"}</h6>
                  <p>
                    {isMembership
                      ? `Valid for ${membershipPlan?.months || 1} month${(membershipPlan?.months || 1) > 1 ? "s" : ""} from purchase`
                      : bookingData?.start_time
                        ? String(bookingData.start_time).split(",").map((st: string, idx: number) => {
                            const et = String(bookingData.end_time || "").split(",")[idx] || "";
                            return et ? `${st.trim()} to ${et.trim()}` : st.trim();
                          }).join(", ")
                        : "Standard Operating Hours"}
                  </p>
                </li>
                {trainerData?.venue_name && (
                  <li>
                    <h6>Venue / Facility</h6>
                    <p>{trainerData.venue_name}{trainerData.near_by_location ? `, ${trainerData.near_by_location}` : ""}</p>
                  </li>
                )}
              </ul>
              <h5 className="mb-3">Customer &amp; Attendee Information</h5>
              <ul className="contact-info d-lg-flex justify-content-between align-items-center">
                <li>
                  <h6>Customer Name</h6>
                  <p>{customerInfo.name || "Member"}</p>
                </li>
                <li>
                  <h6>Contact Email Address</h6>
                  <p>{customerInfo.email || "customer@kheloindore.in"}</p>
                </li>
                <li>
                  <h6>Phone Number</h6>
                  <p>{customerInfo.phone || "+91 8349307444"}</p>
                </li>
              </ul>
            </section>
            {/* Booking Disclaimer */}
            <section className="card mt-4" style={{ padding: "20px", backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
              <p className="mb-0" style={{ fontSize: "13px", color: "#9A3412", lineHeight: "1.6", fontWeight: "500" }}>
                <i className="feather-alert-triangle me-1" />
                <strong>Disclaimer:</strong> If you book this Coach/Trainer directly or through any platform other than Khelo Indore, Khelo Indore will not be responsible for any issues, refunds or disputes related to that booking.
              </p>
            </section>
            {/* Payment Type Selection */}
            {isMembership ? (
              <section className="card mt-4" style={{ padding: "24px", background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1 text-success d-flex align-items-center gap-2">
                      <i className="feather-shield text-success" />
                      {membershipPlan?.name || "Monthly"} Membership Access
                    </h5>
                    <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
                      One-time payment for <strong>{membershipPlan?.months || 1} month{(membershipPlan?.months || 1) > 1 ? "s" : ""}</strong> access to personal training sessions. Non-refundable once activated.
                    </p>
                  </div>
                  <div className="text-end">
                    <span style={{ fontSize: "12px", color: "#64748B", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Payable</span>
                    <strong style={{ color: "#16A34A", fontSize: "26px" }}>₹{totalPriceNumber.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </section>
            ) : (
              <section className="card mt-4" style={{ padding: "24px" }}>
                <h5 className="mb-3">Select Payment Option</h5>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label
                      className="d-flex align-items-start gap-2 p-3 rounded border"
                      style={{ cursor: "pointer", borderColor: paymentType === "full" ? "#22C55E" : "#E2E8F0", background: paymentType === "full" ? "#F0FDF4" : "#FFFFFF" }}
                    >
                      <input
                        type="radio"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={() => setPaymentType("full")}
                      />
                      <span>
                        <strong style={{ color: "#0F172A" }}>Full Payment</strong>
                        <br />
                        <span style={{ fontSize: "12px", color: "#64748B" }}>Pay 100% now. If you cancel at least 4 hours before the booking time, 25% is deducted and the rest is refunded.</span>
                      </span>
                    </label>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label
                      className="d-flex align-items-start gap-2 p-3 rounded border"
                      style={{ cursor: "pointer", borderColor: paymentType === "partial" ? "#22C55E" : "#E2E8F0", background: paymentType === "partial" ? "#F0FDF4" : "#FFFFFF" }}
                    >
                      <input
                        type="radio"
                        name="paymentType"
                        value="partial"
                        checked={paymentType === "partial"}
                        onChange={() => setPaymentType("partial")}
                      />
                      <span>
                        <strong style={{ color: "#0F172A" }}>Partial Payment (25% advance)</strong>
                        <br />
                        <span style={{ fontSize: "12px", color: "#64748B" }}>Pay 25% now and the rest later. Partial payments are non-refundable.</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "14px 18px", marginTop: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#475569" }}>
                    Amount payable now: <strong style={{ color: "#16A34A", fontSize: "16px" }}>₹{Math.round(totalPriceNumber * (paymentType === "partial" ? 0.25 : 1)).toLocaleString("en-IN")}</strong>
                    {paymentType === "partial" && (
                      <span style={{ fontSize: "12px", color: "#64748B" }}> (balance of ₹{Math.round(totalPriceNumber * 0.75).toLocaleString("en-IN")} payable later)</span>
                    )}
                  </span>
                </div>
              </section>
            )}
            <div className="text-center btn-row">
              <Link
                className="btn btn-primary me-3 btn-icon"
                to={isMembership ? `/trainers/personal-training-details/${id}` : `/trainers/training-timedate/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={handleSubmit}
              >
                {isMembership ? `Pay ₹${totalPriceNumber.toLocaleString("en-IN")}` : "Pay Now"} <i className="feather-arrow-right-circle ms-1" />
              </button>
            </div>
          </div>
          {/* /Container */}
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default TrainingOrderConfirm;
