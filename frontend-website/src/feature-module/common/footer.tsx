import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const Footer = () => {
  const routes = all_routes;
  const loginToken = localStorage.getItem("token");

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
                    <Link to="/personal-training">Personal Trainers</Link>
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
                <ul>
                  <li>
                    <Link to="/sports-venue">Cricket Turfs</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Badminton Courts</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Football Grounds</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Swimming Pools</Link>
                  </li>
                  <li>
                    <Link to="/sports-venue">Tennis Courts</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Top Locations */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Locations</h4>
                <ul>
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
    </footer>
  );
};

export default Footer;
