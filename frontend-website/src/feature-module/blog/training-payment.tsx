import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { API_URL, IMG_URL } from "../../ApiUrl";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";

interface TrainerData {
  first_name: string;
  last_name: string;
  duration: string;
  focus_area: string[];
  price: number;
  profile_picture: string[];
  src: string;
}

const TrainingPayment = (props: any) => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = useState<TrainerData[]>([]);
  const idData = useParams();
  const location = useLocation();

  const id = idData.id;
  const { selectedBatch, selectedTimeSlot, subtotal } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Fetch coach data from API

    const fetchTrainerId = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/PersonalTraining/fetch/${id}`
        );
        const trainerDataId = response.data.personalTrainer;
        setTrainerData(trainerDataId);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchTrainerId();
  }, []);

  return (
    <div>
      <>
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
        
        /* Payment / checkout forms styling */
        .card {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
        }
        .card h3, .card h4 {
          color: #0F172A !important;
          font-weight: 700 !important;
        }
        .card p, .card span, .card li, .card label {
          color: #334155 !important;
        }
        .payment-form input, .payment-form select, .payment-form textarea {
          border: 1px solid #CBD5E1 !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          color: #0F172A !important;
        }
        .payment-form input:focus {
          border-color: #22C55E !important;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
        }
        
        /* Subtotal and checkout details */
        .booking-details {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          padding: 24px !important;
        }
        .booking-details h3 {
          border-bottom: 1px solid #E2E8F0 !important;
          padding-bottom: 15px !important;
          margin-bottom: 20px !important;
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
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Complete your payment and confirm your training session</p>
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
              {/* <li>
                <h5>
                  <Link to={routes.coachDetails}>
                    <span>1</span>Type of Booking
                  </Link>
                </h5>
              </li> */}
              <li>
                <h5>
                  <Link to={`/personal-training/training-timedate/${id}`}>
                    <span>1</span>Time &amp; Date
                  </Link>
                </h5>
              </li>
              {/* <li>
                <h5>
                  <Link to={routes.coachPersonalInfo}>
                    <span>3</span>Personal Information
                  </Link>
                </h5>
              </li> */}
              <li>
                <h5>
                  <Link to={`/personal-training/training-order-confirm/${id}`}>
                    <span>2</span>Order Confirmation
                  </Link>
                </h5>
              </li>
              <li className="active">
                <h5>
                  <Link to={`/personal-trainingtra/training-payment/${id}`}>
                    <span>3</span>Payment
                  </Link>
                </h5>
              </li>
            </ul>
          </div>
        </section>
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <section>
              <div className="text-center mb-40">
                <h3 className="mb-1">Payment</h3>
                <p className="sub-title">
                  Securely make your payment for the booking. Contact support
                  for assistance.
                </p>
              </div>
              <div className="master-academy dull-whitesmoke-bg card mb-40">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-100 coach-book-img"
                        src={
                          trainerData?.profile_picture
                            ? `${IMG_URL}${trainerData?.profile_picture[0].src}`
                            : "/assets/img/featured/featured-06.jpg"
                        }
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
                      <h3 className="mb-2">
                        {trainerData?.first_name}
                        {trainerData?.lastt_name}
                      </h3>
                      <p>
                        Certified Badminton Coach with a deep understanding of
                        the sport`&apos;s strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row checkout">
                <div className="col-12 col-sm-12 col-md-12 col-lg-7">
                  <div className="card booking-details">
                    <h3 className="border-bottom">Order Summary</h3>
                    <ul>
                      <li>
                        <i className="feather-calendar me-2" />
                        <p>
                          {selectedBatch
                            ? new Date(
                                selectedBatch.batch_date
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </p>
                      </li>
                      <li>
                        <i className="feather-clock me-2" />
                        <p>
                          {selectedTimeSlot?.startTime} -{" "}
                          {selectedTimeSlot?.endTime}
                        </p>
                      </li>
                      {/* <li>
                        <i className="feather-users me-2" />
                        Total Hours : 3 Hrs
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-5">
                  <aside className="card payment-modes">
                    <h3 className="border-bottom">Checkout</h3>
                    <h6 className="mb-3">Select Payment Gateway</h6>
                    <div className="radio">
                      <div className="form-check form-check-inline mb-3">
                        <input
                          className="form-check-input default-check me-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio1"
                          defaultValue="Credit Card"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio1"
                        >
                          Credit Card
                        </label>
                      </div>
                      <div className="form-check form-check-inline mb-3">
                        <input
                          className="form-check-input default-check me-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio2"
                          defaultValue="Paypal"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio2"
                        >
                          Paypal
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input default-check me-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio3"
                          defaultValue="Wallet"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio3"
                        >
                          Wallet
                        </label>
                      </div>
                    </div>
                    <hr />
                    <ul className="order-sub-total">
                      <li>
                        <p>Sub total</p>
                        <h6>₹250</h6>
                      </li>
                      <li>
                        <p>Additional Guest</p>
                        <h6>₹25</h6>
                      </li>
                      <li>
                        <p>Service charge</p>
                        <h6>₹70</h6>
                      </li>
                    </ul>
                    <div className="order-total d-flex justify-content-between align-items-center">
                      <h5>Order Total</h5>
                      <h5>₹450</h5>
                    </div>
                    <div className="form-check d-flex justify-content-start align-items-center policy">
                      <div className="d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="policy"
                        />
                      </div>
                      <label className="form-check-label" htmlFor="policy">
                        By clicking `&apos;Send Request`&apos;, I agree to
                        KheloIndore{" "}
                        <Link to={routes.privacyPolicy}>Privacy Policy</Link>{" "}
                        and <Link to={routes.termsCondition}>Terms of Use</Link>
                      </label>
                    </div>
                    <div className="d-grid btn-block">
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#bookingconfirmModal"
                      >
                        Proceed ₹200
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </div>
          {/* Container */}
        </div>
        {/* /Page Content */}
      </>
      <>
        {/* Booking Confirmed Modal */}
        <div
          className="modal fade"
          id="bookingconfirmModal"
          tabIndex={-1}
          aria-labelledby="bookingconfirmModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-center d-inline-block">
                <ImageWithBasePath
                  src="assets/img/icons/booking-confirmed.svg"
                  alt="Icon"
                />
              </div>
              <div className="modal-body text-center">
                <h3 className="mb-3">Booking has been Confirmed</h3>
                <p>Check your email on the booking confirmation</p>
              </div>
              <div className="modal-footer text-center d-inline-block">
                <Link to={routes.userDashboard} className="btn btn-primary">
                  <i className="feather-arrow-left-circle me-1" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Booking Confirmed Modal */}
      </>
    </div>
  );
};

export default TrainingPayment;
