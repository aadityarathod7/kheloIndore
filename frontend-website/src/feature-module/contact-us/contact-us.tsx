import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../ApiUrl";

type ContactFormState = {
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  subject: string;
  comments: string;
};

const initialState: ContactFormState = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  subject: "",
  comments: "",
};

const ContactUs = () => {
  const [input, setInput] = useState<ContactFormState>(initialState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us";
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setError(null);

    if (name === "first_name" || name === "last_name") {
      if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setError("Names can only contain letters");
      }
      return;
    }

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          mobile: value,
        }));
      } else {
        setError("Mobile number must be 10 digits");
      }
      return;
    }

    if (name === "email") {
      setInput((prevState) => ({
        ...prevState,
        email: value,
      }));
      return;
    }

    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInquiries = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedInput = {
      ...input,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      mobile: input.mobile.trim(),
      email: input.email.trim(),
      subject: input.subject.trim(),
      comments: input.comments.trim(),
    };

    if (
      !trimmedInput.first_name ||
      !trimmedInput.last_name ||
      !trimmedInput.mobile ||
      !trimmedInput.comments
    ) {
      setError("Please fill in all required fields.");
      Swal.fire("Please fill in all required fields.");
      return;
    }

    if (trimmedInput.mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      Swal.fire("Mobile number must be 10 digits");
      return;
    }

    if (trimmedInput.email && !/^\S+@\S+\.\S+$/.test(trimmedInput.email)) {
      setError("Please enter a valid email address");
      Swal.fire("Please enter a valid email address");
      return;
    }

    try {
      await axios.post(`${API_URL}/contactUs/create`, trimmedInput);
      Swal.fire(
        "Your request has been successfully submitted. We'll be in touch shortly!"
      );
      setInput({ ...initialState });
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Please check all the fields are filled properly");
      setError("Unable to submit your request right now. Please try again later.");
    }
  };

  return (
    <div className="contact-us-page">
      <div
        className="hero-booking-section"
        style={{
          background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
          paddingTop: "110px",
          paddingBottom: "40px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div
          className="hero-artwork-blend"
          style={{
            position: "absolute",
            right: "-60px",
            top: 0,
            bottom: 0,
            width: "55%",
            backgroundImage: "url('/assets/img/bg/banner-illustration.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            opacity: 0.9,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span
                className="font-weight-bold"
                style={{
                  fontSize: "13px",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "12px",
                  color: "#22C55E",
                  fontWeight: "700",
                }}
              >
                BOOK. PLAY. ENJOY
              </span>
              <h1
                className="d-flex align-items-center flex-wrap"
                style={{
                  fontSize: "56px",
                  fontWeight: "800",
                  color: "#0F172A",
                  lineHeight: "1.1",
                  marginBottom: "16px",
                }}
              >
                Contact <span style={{ color: "#22C55E", marginLeft: "12px" }}>Us</span>
              </h1>
              <p
                style={{
                  color: "#64748B",
                  fontSize: "20px",
                  marginBottom: "24px",
                  fontWeight: "500",
                  maxWidth: "480px",
                }}
              >
                Share your query and our team will get back to you soon.
              </p>

              <div
                className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm"
                style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}
              >
                <Link
                  to="/"
                  style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}
                >
                  <i className="feather-home me-1" style={{ color: "#64748B" }} /> Home
                </Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}>
                  <i
                    className="feather-chevron-right"
                    style={{ fontSize: "12px", color: "#64748B" }}
                  />
                </span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content contact-group">
        <div className="container">
          <div className="contact-shell">
            <div className="contact-card">
              <span className="contact-eyebrow">Need help?</span>
              <h2>We&apos;re here for quick answers.</h2>
              <p>
                Send us your details and we&apos;ll make sure your enquiry reaches the right team.
              </p>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="feather-mail" />
                </div>
                <div>
                  <strong>Email</strong>
                  <Link to="mailto:info@kheloindore.in">info@kheloindore.in</Link>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="feather-phone-call" />
                </div>
                <div>
                  <strong>Phone</strong>
                  <span>+91-7898880731</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="feather-clock" />
                </div>
                <div>
                  <strong>Response time</strong>
                  <span>Usually within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              <form className="contact-us" onSubmit={handleInquiries}>
                <div className="contact-form-heading">Send a message</div>
                {error ? <div className="form-alert">{error}</div> : null}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="first-name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first-name"
                      name="first_name"
                      placeholder="Enter first name"
                      value={input.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="last-name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last-name"
                      name="last_name"
                      placeholder="Enter last name"
                      value={input.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter email address"
                      value={input.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="mobile" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      name="mobile"
                      placeholder="Enter phone number"
                      value={input.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      placeholder="Enter subject"
                      value={input.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="comments" className="form-label">
                      Comments
                    </label>
                    <textarea
                      className="form-control"
                      id="comments"
                      name="comments"
                      rows={4}
                      placeholder="Tell us what you need"
                      value={input.comments}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-secondary d-flex align-items-center">
                  Submit
                  <i className="feather-arrow-right-circle ms-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
