import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL } from "../../ApiUrl";

const Footer = () => {
  const routes = all_routes;
  const loginToken = localStorage.getItem("token");
  const location = useLocation();
  const [showAllSports, setShowAllSports] = useState(false);
  const [showAllCoaches, setShowAllCoaches] = useState(false);
  const [showAllTrainers, setShowAllTrainers] = useState(false);
  // Re-evaluated on every route change so the bottom nav reflects login/logout
  // without requiring a full page reload.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const sports = [
    "Cricket Turfs", "Badminton Courts", "Football Grounds", "Swimming Pools", "Pickleball Courts", "Tennis Courts",
    "Basketball Courts", "Table Tennis", "Volleyball", "Squash Courts", "Box Cricket", "Kabaddi", "Hockey", "Running", "Cycling", "Gym & Fitness",
  ];

  const coachCategories = [
    { name: "Cricket Coaches", search: "Cricket" },
    { name: "Badminton Coaches", search: "Badminton" },
    { name: "Football Coaches", search: "Football" },
    { name: "Tennis Coaches", search: "Tennis" },
    { name: "Swimming Coaches", search: "Swimming" },
    { name: "Gym & Fitness Coaches", search: "Gym" },
    { name: "Yoga Coaches", search: "Yoga" },
    { name: "Basketball Coaches", search: "Basketball" },
    { name: "Skating Coaches", search: "Skating" },
    { name: "Zumba Coaches", search: "Zumba" }
  ];

  const trainerCategories = [
    { name: "Personal Fitness", search: "Fitness" },
    { name: "Yoga & Meditation", search: "Yoga" },
    { name: "Zumba & Dance", search: "Zumba" },
    { name: "Gym & Strength", search: "Gym" },
    { name: "Pilates & Core", search: "Pilates" },
    { name: "Sports Conditioning", search: "Conditioning" },
    { name: "Weight Loss", search: "Weight" },
    { name: "Boxing Training", search: "Boxing" }
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="row g-3 footer-content-grid">
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-about">
                <Link to="/" className="footer-logo" aria-label="Khelo Indore home">
                  <ImageWithBasePath
                    src="/assets/img/khelo-Indore-Logo.png"
                    className="img-fluid"
                    alt="Khelo Indore Logo"
                  />
                  <span>Khelo<span>Indore</span></span>
                </Link>
                <p className="footer-desc">
                  Your home for booking the best turfs, courts, pools, coaches and trainers across Indore.
                </p>
                <address className="footer-contact-details">
                  <div className="footer-contact-item">
                    <i className="feather-map-pin" aria-hidden="true" />
                    <span>366/4, Samajwad Nagar, Indore, Madhya Pradesh, India – 452002</span>
                  </div>
                  <div className="footer-contact-item">
                    <i className="feather-phone" aria-hidden="true" />
                    <a href="tel:+917898880731">+91-7898880731</a>
                  </div>
                  <div className="footer-contact-item">
                    <i className="feather-mail" aria-hidden="true" />
                    <a href="mailto:info@kheloindore.in">info@kheloindore.in</a>
                  </div>
                </address>
                <Link to={routes.contactUs} className="footer-enquiry">
                  <i className="feather-mail" /> Plan your next game
                </Link>
                <div className="social-icon">
                  <ul className="d-flex align-items-center gap-2 m-0 p-0">
                    <li>
                      <Link to="#" className="facebook" aria-label="Facebook">
                        <i className="fab fa-facebook-f" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="twitter" aria-label="Twitter">
                        <i className="fab fa-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="instagram" aria-label="Instagram">
                        <i className="fab fa-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="linked-in" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Sports Venues</h4>
                <ul>
                  {sports.slice(0, showAllSports ? sports.length : 6).map((sport) => (
                    <li key={sport}>
                      <Link to={`/sports-venue?search=${encodeURIComponent(sport)}`}>{sport}</Link>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="footer-load-more" onClick={() => setShowAllSports((current) => !current)} aria-expanded={showAllSports}>
                      {showAllSports ? "Show less" : `+${sports.length - 6} more`}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Coaches</h4>
                <ul>
                  {coachCategories.slice(0, showAllCoaches ? coachCategories.length : 6).map((coach) => (
                    <li key={coach.name}>
                      <Link to={`/coaches?search=${encodeURIComponent(coach.search)}`}>{coach.name}</Link>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="footer-load-more" onClick={() => setShowAllCoaches((current) => !current)} aria-expanded={showAllCoaches}>
                      {showAllCoaches ? "Show less" : `+${coachCategories.length - 6} more`}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Trainers</h4>
                <ul>
                  {trainerCategories.slice(0, showAllTrainers ? trainerCategories.length : 6).map((trainer) => (
                    <li key={trainer.name}>
                      <Link to={`/trainers?search=${encodeURIComponent(trainer.search)}`}>{trainer.name}</Link>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="footer-load-more" onClick={() => setShowAllTrainers((current) => !current)} aria-expanded={showAllTrainers}>
                      {showAllTrainers ? "Show less" : `+${trainerCategories.length - 6} more`}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <div className="copyright-text">
                  <p className="mb-0">
                    &copy; 2026 KheloIndore. Powered by MANS Sports Entertainment.
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <ul className="footer-legal-links">
                  <li><Link to={routes.blogGrid}>Blogs</Link></li>
                  <li><Link to={routes.contactUs}>Contact Us</Link></li>
                  <li><Link to={routes.privacyPolicy}>Privacy Policy</Link></li>
                  <li><Link to={routes.termsCondition}>Terms &amp; Conditions</Link></li>
                  <li><Link to={routes.refundPolicy}>Refund Policy</Link></li>
                  <li><Link to={loginToken ? routes.userProfile : "/login"}>My Account</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar — dynamic 4-tab app bar (Home | Bookings | Messages | Profile/Login) */}
      <div
        className="mobile-bottom-nav d-md-none position-fixed bottom-0 start-0 end-0 d-flex align-items-stretch justify-content-around"
        style={{
          zIndex: 1050,
          height: "68px",
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid #E5EDE6",
          boxShadow: "0 -6px 24px rgba(23, 34, 45, 0.08)",
        }}
      >
        <Link
          to="/"
          className={`tab-item d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="tab-icon"><i className="feather-home" /></span>
          <span className="tab-label">Home</span>
        </Link>

        <Link
          to={routes.userBookings}
          className={`tab-item d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-bookings") || location.pathname.includes("bookings") ? "active" : ""}`}
        >
          <span className="tab-icon"><i className="feather-calendar" /></span>
          <span className="tab-label">Bookings</span>
        </Link>

        <Link
          to={isLoggedIn ? routes.userProfile : routes.login}
          className={`tab-item d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-profile") || location.pathname.includes("profile") || location.pathname === "/login" ? "active" : ""}`}
        >
          <span className="tab-icon"><i className="feather-user" /></span>
          <span className="tab-label">{isLoggedIn ? "Profile" : "Login"}</span>
        </Link>

        <style>{`
          .mobile-bottom-nav .tab-item {
            flex: 1;
            min-width: 0;
            color: #64748B !important;
            transition: color 0.2s ease;
          }
          .mobile-bottom-nav .tab-item.active {
            color: #16A34A !important;
          }
          .mobile-bottom-nav .tab-icon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 30px;
            border-radius: 999px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            color: inherit !important;
          }
          .mobile-bottom-nav .tab-icon i {
            font-size: 19px;
            color: inherit !important;
          }
          .mobile-bottom-nav .tab-item.active .tab-icon {
            background: #EAF5EB;
          }
          .mobile-bottom-nav .tab-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: inherit !important;
          }
          .mobile-bottom-nav .notif-dot {
            position: absolute;
            top: 2px;
            right: 5px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #EF4444;
            border: 2px solid #FFFFFF;
            animation: notifPulse 2s ease-in-out infinite;
          }
          .mobile-bottom-nav .notif-dot.chat-unread-badge {
            top: -4px;
            right: -6px;
            width: auto;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            border-radius: 999px;
            background: #EF4444;
            color: #FFFFFF !important;
            font-size: 10px;
            font-weight: 700;
            line-height: 18px;
            text-align: center;
            animation: notifPulse 2s ease-in-out infinite;
          }
          @keyframes notifPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(0.85); }
          }
          @media (max-width: 767.98px) {
            body {
              padding-bottom: 76px !important;
            }
            .enquiry-btn {
              bottom: 92px !important;
            }
          }
        `}</style>
      </div>
    </footer>
  );
};

export default Footer;
