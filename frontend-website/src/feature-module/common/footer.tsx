import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const Footer = () => {
  const routes = all_routes;
  const loginToken = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Top Links */}
        <div className="footer-top">
          <div className="row g-3 g-lg-4">
            {/* Column 1: Brand Info & Socials */}
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="footer-widget footer-about">
                <div className="footer-logo mb-2">
                  <ImageWithBasePath
                    src="/assets/img/khelo-Indore-Logo.png"
                    className="img-fluid"
                    alt="Khelo Indore Logo"
                    style={{ maxHeight: "42px" }}
                  />
                </div>
                <p className="footer-desc mb-3">
                  Indore&apos;s leading platform for booking premium sports turfs, courts, swimming pools, and hiring professional trainers &amp; coaches.
                </p>
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

            {/* Column 2: Our Services */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Our Services</h4>
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
                </ul>
              </div>
            </div>

            {/* Column 3: Sports Categories */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Sports</h4>
                <ul style={{ maxHeight: "280px", overflowY: "auto" }}>
                  <li>
                    <Link to="/sports-venue/cricket">Cricket Turfs</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/badminton">Badminton Courts</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/football">Football Grounds</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/swimming">Swimming Pools</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/pickleball">Pickleball Courts</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/tennis">Tennis Courts</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/basketball">Basketball Courts</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/table-tennis">Table Tennis</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue/other-sports">Other Sports</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Top Locations */}
            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Locations</h4>
                <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 10px", minWidth: "260px" }}>
                  <li>
                    <Link to="/sports-venue">Vijay Nagar</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Palasia</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Bhawarkuan</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Rajendra Nagar</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Navlakha</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">LIG Square</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Bengali Square</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Annapurna Road</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Mahalaxmi Nagar</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Khajrana</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Rau</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Nipania</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Super Corridor</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Kanadia Road</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 5: Support & Info */}
            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Support & Info</h4>
                <ul>
                  <li>
                    <Link to={routes.contactUs}>Contact Us</Link>
                  </li>
                  <li>
                    <Link to={routes.privacyPolicy}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to={routes.termsCondition}>Terms &amp; Conditions</Link>
                  </li>
                  <li>
                    <Link to={routes.refundPolicy}>Refund Policy</Link>
                  </li>
                  <li>
                    <Link to={loginToken ? routes.userProfile : "/login"}>My Account</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* /Footer Top Links */}
      </div>

      {/* Footer Bottom copyright */}
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="row align-items-center">
              <div className="col-md-12 text-center">
                <div className="copyright-text">
                  <p className="mb-0">
                    &copy; 2026 All Rights Reserved By <strong>KheloIndore</strong> | Powered by <strong>MANS Sports Entertainment</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Footer Bottom copyright */}

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
