import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { fetchUnreadCount } from "../../utils/chat";

const Footer = () => {
  const routes = all_routes;
  const loginToken = localStorage.getItem("token");
  const location = useLocation();
  const [showAllSports, setShowAllSports] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  // Re-evaluated on every route change so the bottom nav reflects login/logout
  // without requiring a full page reload.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Live unread message badge: initial fetch + poll + cross-tab event sync
  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadChatCount(0);
      return;
    }
    let cancelled = false;
    const tick = () => {
      fetchUnreadCount().then((n) => {
        if (!cancelled) setUnreadChatCount(n);
      });
    };
    tick();
    const onUnread = (e: Event) => {
      if (!cancelled) setUnreadChatCount((e as CustomEvent).detail || 0);
    };
    window.addEventListener("ki-chat-unread", onUnread);
    const timer = window.setInterval(tick, 15000);
    return () => {
      cancelled = true;
      window.removeEventListener("ki-chat-unread", onUnread);
      window.clearInterval(timer);
    };
  }, [isLoggedIn]);

  const sports = [
    "Cricket Turfs", "Badminton Courts", "Football Grounds", "Swimming Pools", "Pickleball Courts", "Tennis Courts",
    "Basketball Courts", "Table Tennis", "Volleyball", "Squash Courts", "Box Cricket", "Kabaddi", "Hockey", "Running", "Cycling", "Gym & Fitness",
  ];
  const popularLocations = [
    "Vijay Nagar", "Palasia", "Bhawarkuan", "Rajendra Nagar", "Navlakha", "LIG Square",
    "Bengali Square", "Annapurna Road", "Mahalaxmi Nagar", "Rau", "Super Corridor", "Nipania", "Kanadia Road", "Khajrana", "Scheme 54", "Sudama Nagar", "AB Road", "Tilak Nagar", "Sukhliya", "Geeta Bhawan", "Saket Nagar", "Ring Road",
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
          <div className="row g-4 g-xl-5">
            <div className="col-lg-4 col-md-6">
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

            <div className="col-lg-2 col-md-3 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Explore</h4>
                <ul>
                  <li>
                    <Link to={routes.blogListSidebarLeft}>Sports Venues</Link>
                  </li>
                  <li>
                    <Link to={routes.coachesGrid}>Coaches & Academies</Link>
                  </li>
                  <li>
                    <Link to="/personal-training">Trainers</Link>
                  </li>
                  <li>
                    <Link to={routes.blogGrid}>Blogs & Stories</Link>
                  </li>
                  <li>
                    <Link to={routes.contactUs}>Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Sports</h4>
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

            <div className="col-lg-4 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Popular locations</h4>
                <ul className="footer-location-list">
                  {popularLocations.slice(0, showAllLocations ? popularLocations.length : 6).map((area) => (
                    <li key={area}>
                      <Link to={`/sports-venue?location=${encodeURIComponent(area)}`}>{area}</Link>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="footer-load-more" onClick={() => setShowAllLocations((current) => !current)} aria-expanded={showAllLocations}>
                      {showAllLocations ? "Show less" : `+${popularLocations.length - 6} more`}
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
          to={routes.userChat}
          className={`tab-item d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-chat") || location.pathname.includes("chat") ? "active" : ""}`}
        >
          <span className="tab-icon">
            <i className="feather-bell" />
            {isLoggedIn && unreadChatCount > 0 && (
              <span className="notif-dot chat-unread-badge">{unreadChatCount > 9 ? "9+" : unreadChatCount}</span>
            )}
          </span>
          <span className="tab-label">Messages</span>
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
