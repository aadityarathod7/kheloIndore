import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { all_routes } from '../router/all_routes';

const PrivacyPolicy = () => {
  const routes = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0)
      document.title = "privacy-policy"
  }, [])

  return (
    <div>
      <>
        {/* Breadcrumb */}
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Privacy <span style={{ color: "#22C55E", marginLeft: "12px" }}>Policy</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Your privacy is critically important to us</p>
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <h2>Privacy Policy</h2>
            <div className="condition-details">
              <p>
                Welcome to Khelo Indore powered by Mans Sports Entertainment! Your privacy is critically important to us. This Privacy Policy document explains how we collect, use, and protect your personal information when you visit our website or use our services.
              </p>
              <div className="policy-data">
                <h3>Information We Collect</h3>
                <p>
                  At Khelo Indore, we collect different types of information to provide and improve our services:
                  <p>
                    <div className="policy-list">
                      <ul>
                        <li>
                          <b>Personal Information:</b> We collect personal details such as your name, email address, phone number, and billing information when you register on our site, subscribe to our newsletter, fill out a form, or use other features.
                        </li>
                        <li>
                          <b>Usage Data:</b> We gather information on how you access and use our services, including your IP address, browser type, pages visited, and the date and time of your visit.
                        </li>
                        <li>
                          <b>Cookies:</b> We use cookies and similar tracking technologies to track activity on our site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </li>
                      </ul>
                    </div>
                  </p>
                </p>
              </div>
              <div className="policy-data">
                <h3>How We Use Your Information</h3>
                <p>
                  Khelo Indore uses the collected data for various purposes:
                  <p>
                    <div className="policy-list">
                      <ul>
                        <li>
                          <b>To Provide and Maintain Our Service:</b> To ensure smooth operation and to deliver the services you request.
                        </li>
                        <li>
                          <b>To Notify You About Changes:</b> To inform you about changes to our services, terms, or policies.
                        </li>
                        <li>
                          <b>To Improve Our Services:</b> To analyze and enhance the performance of our website and services.
                        </li>
                        <li>
                          <b>To Send Periodic Emails:</b> To send you updates, promotional materials, and other information that may be of interest to you. You can opt out of receiving these communications at any time.
                        </li>
                      </ul>
                    </div>
                  </p>
                </p>
              </div>
              <div className="policy-data">
                <h3>How We Protect Your Information</h3>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information:
                  <p>
                    <div className="policy-list">
                      <ul>
                        <li>
                          <b>Secure Servers:</b> Your information is stored on secure servers protected by firewalls and encryption.
                        </li>
                        <li>
                          <b>Limited Access:</b> Only authorized personnel have access to your personal data.
                        </li>
                        <li>
                          <b>Regular Audits:</b> We conduct regular security audits to ensure your data remains safe.
                        </li>
                      </ul>
                    </div>
                  </p>
                </p>
              </div>
              <div className="policy-data">
                <h3>Sharing Your Information</h3>
                <p>
                  Khelo Indore does not sell, trade, or otherwise transfer to outside parties your personally identifiable information except in the following cases:
                  <p>
                    <div className="policy-list">
                      <ul>
                        <li>
                          <b>Service Providers:</b> We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users.
                        </li>
                        <li>
                          <b>Legal Requirements:</b> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                        </li>
                      </ul>
                    </div>
                  </p>
                </p>
              </div>
              <div className="policy-data">
                <h3>Your Rights</h3>
                <p>
                  You have the right to:
                  <p>
                    <div className="policy-list">
                      <ul>
                        <li>
                          <b>Access Your Data:</b> Request a copy of the personal information we hold about you.
                        </li>
                        <li>
                          <b>Correct Your Data:</b> Request corrections to any inaccuracies in your personal data.
                        </li>
                        <li>
                          <b>Delete Your Data:</b> Request the deletion of your personal information, subject to legal obligations.
                        </li>
                      </ul>
                    </div>
                  </p>
                </p>
              </div>
              <div className="policy-data">
                <h3>Third-Party Links</h3>
                <p>
                  Our website may contain links to third-party sites. Khelo Indore powered by Mans Sports Entertainment is not responsible for the privacy practices of these other sites. We encourage you to read their privacy policies.
                </p>
              </div>
              <div className="policy-data">
                <h3>Changes to This Privacy Policy</h3>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
              <div className="policy-data">
                <h3>Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                  <p>
                    <b>Khelo Indore</b><br/>
                    <b>Email:</b> manssportsentertainment@gmail.com<br/>
                  </p>
                  Thank you for choosing Khelo Indore. We are committed to protecting your privacy and ensuring a safe online experience.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>

    </div>
  )
}

export default PrivacyPolicy