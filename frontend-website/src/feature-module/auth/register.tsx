import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import axios from "axios";
import { API_URL } from "../../ApiUrl";
import Swal from "sweetalert2";
import { BiMessageError } from "react-icons/bi";
import Loader from "../loader/loader";
const Signin = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const location = useLocation();

  const isLocal = 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.");
  
  const adminUrl = isLocal 
    ? `${window.location.protocol}//${window.location.hostname}:3001/admin`
    : "/admin";
  const searchParams = new URLSearchParams(location.search);
  const paramRole = searchParams.get("role");

  let defaultRole = "Venue Admin";
  if (paramRole === "coach") {
    defaultRole = "Coach";
  } else if (paramRole === "trainer") {
    defaultRole = "Personal Trainer";
  }

  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
    email: "",
    confirm_password: "",
    role: defaultRole,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "register "
  }, []);

  const [registeredMobiles, setRegisteredMobiles] = useState<string[]>([]);
  const [policy, setpolicy] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const errorCheckbox = document.querySelectorAll(".err-checkbox");
  const errorFirstName = document.querySelectorAll(".err-firstName");
  const errorLastName = document.querySelectorAll(".err-lastName");
  const errorMobileNumber = document.querySelectorAll(".err-mobile");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    {
      const loginToken = localStorage.getItem("token");
      if (loginToken) {
        navigate("/user/user-profile");
      }
    }
  }, []);

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Loading",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close(); // Close the loading dialog after some time (simulation)
    }, 1000);
  };

  const handleRole = (name: string, value: string) => {
    if (name && value) {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
  };
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the input state
    setInput((prev) => ({ ...prev, [name]: value }));

    // Remove error for this field if the user starts typing
    setErrors((prevErrors: any) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  // Handle Checkbox Change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setErrors((prev: any) => ({ ...prev, checkbox: "" }));
  };

  // Handle Form Submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    // Validation
    if (!input.first_name) newErrors.first_name = "First name is required";
    if (!input.last_name) newErrors.last_name = "Last name is required";
    if (!input.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(input.email)) newErrors.email = "Email is invalid";
    if (!input.mobile) newErrors.mobile = "Mobile number is required";
    else if (input.mobile.length !== 10) newErrors.mobile = "Mobile number must be 10 digits";
    if (!input.password) newErrors.password = "Password is required";
    else if (input.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!input.confirm_password) newErrors.confirm_password = "Password confirmation is required";
    else if (input.confirm_password !== input.password) newErrors.confirm_password = "Passwords must match";
    if (!isChecked) newErrors.checkbox = "You must agree to the terms";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      Swal.fire({
        title: "Registering...",
        text: "Processing Registration.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      if (registeredMobiles.includes(input.mobile)) {
        setErrors({ mobile: "Mobile number already registered" });
        Swal.close();
        return;
      }

      const response = await axios.post(`${API_URL}/user/signup`, input);
      if (response.data.success) {
        Swal.close();
        localStorage.setItem("token2", response.data.token);

        if (input.role === "User") {
          Swal.fire({
            title: "Success!",
            text: "An OTP has been sent to your Email and Mobile.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/auth/verifyotp");
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: input.role === "Venue Admin" 
              ? "You have registered successfully! You can now log in to the admin panel."
              : "Registration successful. Check your email for the admin login link to complete your profile and list your services.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            // Partners complete their profile and manage services in the admin app.
            // `adminUrl` also points to port 3001 while running locally.
            window.location.assign(adminUrl);
          });
        }
      } else {
        setErrors({ api: response.data.message || "Registration failed." });
        Swal.close();
      }
    } catch (error: any) {
      const apiError = error?.response?.data?.message || error?.message || "Registration failed. Please check network connection.";
      setErrors({ api: apiError });
      Swal.close();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  }

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prevState => !prevState);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", overflow: "hidden" }}>
      <style>{`
        .register-input::placeholder {
          font-size: 13.5px !important;
          color: #94A3B8 !important;
          font-weight: 500 !important;
        }
        .register-input {
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #0F172A !important;
          width: 100% !important;
        }
      `}</style>
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Left Side: Marketing and Branding Banner */}
          <div className="col-12 col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{
            background: "linear-gradient(135deg, #102a18 0%, #06120a 100%)",
            padding: "80px 60px",
            position: "relative",
            overflow: "hidden",
            color: "#ffffff"
          }}>
            {/* Visual background blobs */}
            <div style={{ position: "absolute", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", top: "-50px", left: "-50px" }} />
            <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)", bottom: "-100px", right: "-100px" }} />
            
            <div style={{ position: "relative", zIndex: 2, maxWidth: "480px" }}>
              <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#22C55E", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginBottom: "40px" }}>
                <i className="fa-solid fa-arrow-left" /> Back to Homepage
              </Link>
              
              <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: "rgba(34,197,94,0.15)", color: "#22C55E", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "20px" }}>
                Partner Registration
              </div>
              
              <h1 style={{ fontSize: "40px", fontWeight: "800", lineHeight: "1.2", marginBottom: "20px", color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>
                Grow your business with <span style={{ color: "#22C55E" }}>Khelo Indore</span>
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}>
                Join venue owners, coaches, and fitness trainers list their services and connect directly with thousands of sports enthusiasts.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E", fontSize: "20px", flexShrink: 0 }}>
                    <i className="fa-solid fa-building" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>List Your Venue</h5>
                    <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>Renting out turfs, badminton courts, pools, or gyms is seamless and secure.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E", fontSize: "20px", flexShrink: 0 }}>
                    <i className="fa-solid fa-graduation-cap" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>Coaches & Academies</h5>
                    <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>Enroll sports student batches, manage calendar slots, and build your profile.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E", fontSize: "20px", flexShrink: 0 }}>
                    <i className="fa-solid fa-wallet" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>PNL & approvals</h5>
                    <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>Super-admin verification ensures a trusted list of verified partners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Sign-up Form */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center" style={{
            background: "#fafafa",
            padding: "40px 20px",
            minHeight: "100vh"
          }}>
            <div style={{
              width: "100%",
              maxWidth: "500px",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "40px 32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              border: "1px solid #e2e8f0"
            }}>
              {/* Header */}
              <div className="text-center" style={{ marginBottom: "32px" }}>
                <Link to="/">
                  <ImageWithBasePath
                    src="/assets/KHELO-INDORE-LOGO.png"
                    style={{ height: "60px", marginBottom: "20px", objectFit: "contain" }}
                    alt="Logo"
                  />
                </Link>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", marginBottom: "8px", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Partner Registration
                </h2>
                <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
                  Enter your details to create a partner account.
                </p>
              </div>

              {/* Custom Styled Tab List */}
              <div style={{
                display: "flex",
                background: "#f1f5f9",
                padding: "6px",
                borderRadius: "14px",
                marginBottom: "32px"
              }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: input.role === "Venue Admin" ? "#ffffff" : "transparent",
                    color: input.role === "Venue Admin" ? "#0F172A" : "#64748B",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    boxShadow: input.role === "Venue Admin" ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                  }}
                  onClick={() => handleRole("role", "Venue Admin")}
                >
                  List Your Venue
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: (input.role === "Coach" || input.role === "Personal Trainer") ? "#ffffff" : "transparent",
                    color: (input.role === "Coach" || input.role === "Personal Trainer") ? "#0F172A" : "#64748B",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    boxShadow: (input.role === "Coach" || input.role === "Personal Trainer") ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
                  }}
                  onClick={() => handleRole("role", "Coach")}
                >
                  List as Coach / Trainer
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp}>
                {/* Coach/Trainer Radio Options */}
                {(input.role === "Coach" || input.role === "Personal Trainer") && (
                  <div style={{
                    display: "flex",
                    gap: "24px",
                    padding: "14px 20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "24px"
                  }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#334155", margin: 0 }}>
                      <input
                        type="radio"
                        name="role"
                        value="Coach"
                        checked={input.role === "Coach"}
                        onChange={handleInputChange}
                        style={{ accentColor: "#22C55E", width: "16px", height: "16px" }}
                      />
                      Coach / Academy
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#334155", margin: 0 }}>
                      <input
                        type="radio"
                        name="role"
                        value="Personal Trainer"
                        checked={input.role === "Personal Trainer"}
                        onChange={handleInputChange}
                        style={{ accentColor: "#22C55E", width: "16px", height: "16px" }}
                      />
                      Trainer
                    </label>
                  </div>
                )}

                {/* Input Fields */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>First Name <span style={{ color: "#ef4444" }}>*</span></label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First name"
                      className="register-input"
                      value={input.first_name}
                      onChange={(e) => {
                        if (/^[A-Za-z\s]*$/.test(e.target.value)) handleInputChange(e);
                      }}
                      maxLength={25}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0F172A",
                        background: "#ffffff",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                    {errors.first_name && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.first_name}</div>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Last Name <span style={{ color: "#ef4444" }}>*</span></label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last name"
                      className="register-input"
                      value={input.last_name}
                      onChange={(e) => {
                        if (/^[A-Za-z\s]*$/.test(e.target.value)) handleInputChange(e);
                      }}
                      maxLength={25}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0F172A",
                        background: "#ffffff",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                    {errors.last_name && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.last_name}</div>}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    className="register-input"
                    value={input.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px 48px 12px 16px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      color: "#0F172A",
                      background: "#ffffff",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                    onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                  />
                  {errors.email && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.email}</div>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Mobile Number <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter 10-digit mobile number"
                    className="register-input"
                    value={input.mobile}
                    onChange={(e) => {
                      if (/^\d{0,10}$/.test(e.target.value)) handleInputChange(e);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      color: "#0F172A",
                      background: "#ffffff",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                    onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                  />
                  {errors.mobile && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.mobile}</div>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Password <span style={{ color: "#ef4444" }}>*</span></label>
                  <div style={{ position: "relative" }} className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      className="register-input"
                      value={input.password}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0F172A",
                        background: "#ffffff",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                    <i
                      className="toggle-password feather-eye"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#64748B",
                        fontSize: "16px"
                      }}
                    />
                  </div>
                  {errors.password && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.password}</div>}
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Confirm Password <span style={{ color: "#ef4444" }}>*</span></label>
                  <div style={{ position: "relative" }} className="pass-group">
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Confirm password"
                      className="register-input"
                      value={input.confirm_password}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0F172A",
                        background: "#ffffff",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#22C55E"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                    <i
                      className="toggle-password feather-eye"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#64748B",
                        fontSize: "16px"
                      }}
                    />
                  </div>
                  {errors.confirm_password && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.confirm_password}</div>}
                </div>

                {/* Terms and Conditions */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", fontSize: "13px", color: "#475569", margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{ accentColor: "#22C55E", width: "16px", height: "16px", marginTop: "2px" }}
                    />
                    <span>
                      I agree to the{" "}
                      <a href="/terms-condition" target="_blank" rel="noopener noreferrer" style={{ color: "#22C55E", fontWeight: "600", textDecoration: "none" }}>
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#22C55E", fontWeight: "600", textDecoration: "none" }}>
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                  {errors.checkbox && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}><BiMessageError /> {errors.checkbox}</div>}
                </div>

                {errors.api && <div style={{ color: "#ef4444", fontSize: "14px", padding: "10px 14px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fee2e2", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}><BiMessageError /> {errors.api}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(34,197,94,0.25)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(34,197,94,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(34,197,94,0.25)";
                  }}
                >
                  Create Partner Account
                </button>

                {/* Login link */}
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <span style={{ fontSize: "14px", color: "#64748B" }}>
                    Already have an account?{" "}
                    <a href={adminUrl} style={{ color: "#22C55E", fontWeight: "700", textDecoration: "none" }}>
                      Login Now
                    </a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
