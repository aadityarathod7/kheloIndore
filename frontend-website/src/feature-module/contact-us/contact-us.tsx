import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../ApiUrl";

const ContactUs = () => {
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    subject: "",
    comments: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "contact-us";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log;
    if (name === "first_name" || name === "last_name") {
      if (/^[a-zA-Z]+$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setError(`${name} must contain only letters`);
      }
    } else if (name === "phone") {
      if (/^\d{0,10}$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          mobile: value,
        }));
      } else {
        setError("Mobile number must be 10 digits");
      }
    } else if (name === "email") {
      setInput((prevState) => ({
        ...prevState,
        email: value,
      }));
      // if (/^\S+@\S+\.\S+$/.test(value) || value === "") {

      // } else {
      //   setError("Please enter a valid email address");
      // }
    } else {
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleInquiries = async (e: any) => {
    e.preventDefault();
    try {
      if (
        !input.first_name ||
        !input.last_name ||
        !input.mobile ||
        !input.comments
      ) {
        setError("Please fill in all required fields.");
        Swal.fire("Please fill in all required fields.");
        return;
      }

      await axios.post(`${API_URL}/contactUs/create`, input);
      Swal.fire(
        "Your request has been successfully submitted. We'll be in touch shortly!"
      );
      setInput({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        subject: "",
        comments: "",
      });

      // Handle success or navigate to another page
      // Navigate to success page upon successful submission
      // if (response.data.success) {
      // } else {
      //   setError("Error: " + response.data.message);
      // }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(`Please check all the fields are filled properly`);

      setError("Error: " + error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Contact <span style={{ color: "#22C55E", marginLeft: "12px" }}>Us</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Get in touch with the Khelo Indore team</p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      <div className="contact-us-page">
        <div className="content blog-details contact-group">
          <div className="container">
            <h2 className="text-center mb-40">Contact Information</h2>
            <div className="row mb-40 justify-content-center">
              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="d-flex justify-content-start align-items-center details">
                  <i className="feather-mail d-flex justify-content-center align-items-center" />
                  <div className="info">
                    <h4>Email Address</h4>
                    <p>
                      <Link to="mailto:info@example.com">
                        info@kheloindore.in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="d-flex justify-content-start align-items-center details">
                  <i className="feather-phone-call d-flex justify-content-center align-items-center" />
                  <div className="info">
                    <h4>Phone Number</h4>
                    <p>+91-7898880731</p>
                  </div>
                </div>
              </div>
              {/* <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="d-flex justify-content-start align-items-center details">
                  <i className="feather-map-pin d-flex justify-content-center align-items-center" />
                  <div className="info">
                    <h4>Location</h4>
                    <p>3365 Central AvenueTeterboro, NJ 07608</p>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="row">
              <div className="col-12">
                <div className="google-maps"> 
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                    height={445}
                    style={{ border: 0 }}
                    // allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div> */}
          </div>
          <section className="section dull-bg">
            <div className="container">
              <h2 className="text-center mb-40">
                Reach out to us and let&apos;s smash your enquiries
              </h2>
              <form className="contact-us">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 mb-3">
                    <label htmlFor="first-name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first-name"
                      name="first_name"
                      placeholder="Enter First Name"
                      value={input.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 mb-3">
                    <label htmlFor="last-name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last-name"
                      name="last_name"
                      placeholder="Enter Last Name"
                      value={input.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 mb-3">
                    <label htmlFor="e-mail" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="e-mail"
                      name="email"
                      placeholder="Enter Email Address"
                      value={input.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter Phone Number"
                      value={input.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      placeholder="Enter Subject"
                      value={input.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comments" className="form-label">
                    Comments
                  </label>
                  <textarea
                    className="form-control"
                    id="comments"
                    name="comments"
                    rows={3}
                    placeholder="Enter Comments"
                    value={input.comments}
                    onChange={handleInputChange}
                    // defaultValue={""}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center"
                  onClick={handleInquiries}
                >
                  Submit
                  <i className="feather-arrow-right-circle ms-2" />
                </button>
              </form>
            </div>
          </section>
        </div>
        {/* /Page Content */}
      </div>
    </div>
  );
};

export default ContactUs;
