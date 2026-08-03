import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const Footer = () => {
  const routes = all_routes;
  const loginToken = localStorage.getItem("token");
  const location = useLocation();
  const [showAllSports, setShowAllSports] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

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

      {/* Mobile Bottom Navigation Bar */}
      <div 
        className="mobile-bottom-nav d-md-none position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg d-flex align-items-center justify-content-around py-2" 
        style={{ zIndex: 1050, height: "60px" }}
      >
        <Link 
          to="/" 
          className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname === "/" ? "text-success" : "text-secondary"}`}
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <i className="feather-home" style={{ fontSize: "20px", marginBottom: "3px" }} />
          <span>Home</span>
        </Link>
        
        <Link 
          to={routes.userBookings} 
          className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-bookings") || location.pathname.includes("bookings") ? "text-success" : "text-secondary"}`}
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <i className="feather-calendar" style={{ fontSize: "20px", marginBottom: "3px" }} />
          <span>Bookings</span>
        </Link>
        
        <Link 
          to={routes.userChat} 
          className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-chat") || location.pathname.includes("chat") ? "text-success" : "text-secondary"}`}
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <i className="feather-message-square" style={{ fontSize: "20px", marginBottom: "3px" }} />
          <span>Messages</span>
        </Link>
        
        <Link 
          to={routes.userProfile} 
          className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${location.pathname.startsWith("/user/user-profile") || location.pathname.includes("profile") ? "text-success" : "text-secondary"}`}
          style={{ fontSize: "11px", fontWeight: "600" }}
        >
          <i className="feather-user" style={{ fontSize: "20px", marginBottom: "3px" }} />
          <span>Profile</span>
        </Link>
        <style>{`
          @media (max-width: 767.98px) {
            body {
              padding-bottom: 60px !important;
            }
          }
        `}</style>
      </div>
    </footer>
  );
};

export default Footer;
