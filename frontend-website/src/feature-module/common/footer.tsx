import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";

const Footer = () => {
  const routes = all_routes;

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState();

  const languageOptions = [
    { name: "English (US)" },
    { name: "UK" },
    { name: "Japan" },
  ];
  const currencyOptions = [{ name: "$ USD" }, { name: "$ Euro" }];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const loginToken=localStorage.getItem('token');

  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Join */}
        <div className="footer-join aos" data-aos="fade-up">
          <h2>We Welcome Your Passion And Expertise</h2>
          <p className="sub-title">
            Join our empowering sports community today and grow with us.
          </p>
          <Link to={routes.register} className="btn btn-primary">
            <i className="feather-user-plus" /> Join With Us
          </Link>
        </div>
        {/* /Footer Join */}
        {/* Footer Top */}
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Contact us</h4>
                <div className="footer-address-blk">
                  <div className="footer-call">
                    <span>Customer Care</span>
                    <p>+91-7898880731</p>
                  </div>
                  <div className="footer-call">
                    <span>Need Live Suppot</span>
                    <p>info@kheloindore.in</p>
                  </div>
                </div>
                {/* <div className="social-icon">
                  <ul>
                    <li>
                      <Link to="#" className="facebook">
                        <i className="fab fa-facebook-f" />{" "}
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="twitter">
                        <i className="fab fa-twitter" />{" "}
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="instagram">
                        <i className="fab fa-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="linked-in">
                        <i className="fab fa-linkedin-in" />
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Quick Links</h4>
                <ul>
                  {/* <li>
                    <Link to={routes.aboutUs}>About us</Link>
                  </li> */}
                  {/* <li>
                    <Link to={routes.events}>Events</Link>
                  </li> */}
                  <li>
                    <Link to={routes.contactUs}>Contact us</Link>
                  </li>
                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Support</h4>
                <ul>
                  {/* <li>
                    <Link to={routes.faq}>Faq</Link>
                  </li> */}
                  <li>
                    <Link to={routes.privacyPolicy}>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to={routes.termsCondition}>
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.refundPolicy}>Refund Policy</Link>
                  </li>
                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Other Links</h4>
                <ul>
                  <li>
                    <Link to={routes.coachesGrid}>Coaches</Link>
                  </li>
                  <li>
                    <Link to={routes.blogListSidebarLeft}>Sports Venue</Link>
                  </li>
                  <li>
                    <Link to={loginToken?routes.userProfile:"/login"}>My Account</Link>
                  </li>
                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Address</h4>
                <ul>
                  <li>
                    <Link to="#">366/4, Samajwad Nagar, Indore, MADHYA PRADESH, INDORE ,<br/> Pin 452002</Link>
                  </li>
                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
          </div>
        </div>
        {/* /Footer Top */}
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          {/* Copyright */}
          <div className="copyright">
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="copyright-text">
                  <p className="mb-0">
                    © 2025 All Rights Reserved By
                    KheloIndore <br/>Powered by MANS Sports Entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Copyright */}
        </div>
      </div>
      {/* /Footer Bottom */}
    </footer>
  );
};

export default Footer;
