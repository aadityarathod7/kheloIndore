import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../ApiUrl";

const Login = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"MOBILE" | "OTP">("MOBILE");
  const [loading, setLoading] = useState(false);
  const [mobileApiError, setMobileApiError] = useState("");
  const [otpApiError, setOtpApiError] = useState("");

  const { URL } = location.state || {};

  useEffect(() => {
    const loginToken = localStorage.getItem("token");
    if (loginToken) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Login - Khelo Indore";
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setMobileApiError("");
    setMobileNumber(numericValue);
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!mobileNumber.trim() || mobileNumber.length !== 10) {
      setMobileApiError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setMobileApiError("");

    axios
      .post(`${API_URL}/user/login/mobile`, {
        mobile: mobileNumber,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          localStorage.setItem("token2", response.data.token);
          setStep("OTP");

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 10000,
            timerProgressBar: true,
            background: "#FFFFFF",
            color: "#0F172A",
            iconColor: "#22C55E",
            customClass: {
              popup: "swal-light-toast-shadow"
            }
          });
          Toast.fire({
            icon: "success",
            title: `Testing OTP: ${response.data.otp}`,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "Unable to send OTP. Please try again.",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        const msg = error?.response?.data?.message || "Failed to send OTP. Please try again.";
        setMobileApiError(msg);
      });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length < 4) {
      setOtpApiError("Please enter the verification OTP");
      return;
    }

    setLoading(true);
    setOtpApiError("");

    axios
      .post(
        `${API_URL}/user/login/mobile/otp`,
        {
          mobile: mobileNumber,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token2")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const authToken = response.data.token;
        const isProfileCompleted = response.data.profileCompleted;
        const userData = response.data.user;

        localStorage.setItem("token", authToken);
        localStorage.setItem("profileCompleted", isProfileCompleted ? "true" : "false");

        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        if (!isProfileCompleted) {
          Swal.fire({
            title: "Welcome to Khelo Indore!",
            text: "Please complete your profile to continue.",
            icon: "info",
            confirmButtonText: "Complete Profile",
            confirmButtonColor: "#22C55E",
            background: "#FFFFFF",
            color: "#0F172A",
          }).then(() => {
            navigate(route.userProfile, { state: { firstTime: true } });
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            background: "#FFFFFF",
            color: "#0F172A",
            iconColor: "#22C55E",
            customClass: {
              popup: "swal-light-toast-shadow"
            }
          });
          Toast.fire({
            icon: "success",
            title: "Logged In Successfully!",
          });
          if (URL) {
            navigate(URL);
          } else {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        const msg = error?.response?.data?.message || "Invalid OTP. Please check and try again.";
        setOtpApiError(msg);
      });
  };

  return (
    <div
      className="ki-auth-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5 px-3 position-relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.45), rgba(21, 128, 61, 0.25)), url('/assets/img/bg/stadium.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sleek Flat Card */}
      <div
        className="ki-minimal-card card border-0 position-relative"
        style={{
          zIndex: 2,
          maxWidth: "420px",
          width: "100%",
          padding: "44px 36px",
        }}
      >
        {/* Top green indicators */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: "#22C55E" }} />

        {/* Logo Header */}
        <div className="text-center mb-4">
          <Link to={route.home}>
            <img
              src="/assets/KHELO-INDORE-LOGO.png"
              alt="Khelo Indore Logo"
              style={{ maxHeight: "56px" }}
            />
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1" style={{ fontSize: "22px", color: "#0F172A", letterSpacing: "-0.5px" }}>
            {step === "MOBILE" ? "Welcome to Khelo Indore" : "Verify Mobile Number"}
          </h2>
          <p className="text-muted m-0" style={{ fontSize: "14px", color: "#64748B" }}>
            {step === "MOBILE"
              ? "Enter your mobile number to get OTP"
              : `Enter 6-digit code sent to +91 ${mobileNumber}`}
          </p>
        </div>

        {step === "MOBILE" ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="form-label fw-bold mb-2 ps-2" style={{ fontSize: "12px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Mobile Number
              </label>

              {/* Flat Input Container */}
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="text"
                  name="mobile"
                  className="clean-phone-input"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  maxLength={10}
                  onChange={handleMobileChange}
                  autoFocus
                />
              </div>
              {mobileApiError && (
                <div className="text-danger small mt-2 fw-semibold ps-2">
                  <i className="fas fa-exclamation-circle me-1" /> {mobileApiError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-submit w-100 fw-bold"
              disabled={loading || mobileNumber.length !== 10}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin me-2" /> Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2 ps-2 pe-2">
                <label className="form-label fw-bold mb-0" style={{ fontSize: "12px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Enter OTP Code
                </label>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                  style={{ color: "#22C55E", fontSize: "12px" }}
                  onClick={() => {
                    setStep("MOBILE");
                    setOtp("");
                    setOtpApiError("");
                  }}
                >
                  <i className="fas fa-edit me-1" /> Change
                </button>
              </div>

              <div className="phone-input-container justify-content-center">
                <input
                  type="text"
                  name="otp"
                  className="clean-phone-input text-center"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, ""));
                    setOtpApiError("");
                  }}
                  style={{
                    fontSize: "20px",
                    letterSpacing: "6px",
                  }}
                  autoFocus
                />
              </div>
              {otpApiError && (
                <div className="text-danger small mt-2 fw-semibold text-center">
                  <i className="fas fa-exclamation-circle me-1" /> {otpApiError}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-submit w-100 fw-bold"
              disabled={loading || !otp}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin me-2" /> Verifying...
                </span>
              ) : (
                "Verify & Proceed"
              )}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link btn-sm text-secondary text-decoration-none"
                style={{ fontSize: "13px" }}
                onClick={handleSendOtp}
                disabled={loading}
              >
                Didn&apos;t receive OTP? <span className="text-success fw-bold">Resend OTP</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-top text-center" style={{ fontSize: "12px", color: "#94A3B8" }}>
          By continuing, you agree to Khelo Indore&apos;s <Link to="/contact-us" style={{ color: "#64748B" }}>Terms</Link> &amp; <Link to="/contact-us" style={{ color: "#64748B" }}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};

export default Login;
