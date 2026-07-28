import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import Swal from "sweetalert2";
import "../../style/css/custom.css";
import { API_URL } from "../../ApiUrl";

const Login = () => {
  const route = all_routes;
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileApiError, setMobileApiError] = useState("");
  const [otpPassApiError, setOtpPassApiError] = useState("");
  const location = useLocation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { URL } = location.state || {};

  const handleChange = (e: any) => {
    const value = e.target.value;

    const numericValue = value.replace(/[^0-9]/g, "");
    setMobileApiError("");

    setShowOtpField(false);
    setShowPasswordField(false);

    setMobileNumber(numericValue);

  };

  useEffect(() => {
    const loginToken = localStorage.getItem("token");
    if (loginToken) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "login"
  }, []);

  const handleLoginWithMobile = (field: any) => {
    if (!mobileNumber.trim()) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please enter mobile number",
        icon: "error",
      });
      return;
    }

    axios
      .post(`${API_URL}/user/login/mobile`, {
        mobile: mobileNumber,
      })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("token2", response.data.token);
          if (field === "OTP") {
            setShowOtpField(true);
            setShowPasswordField(false);
          } else if (field === "Password") {
            setShowOtpField(false);
            setShowPasswordField(true);
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "You are not active, please contact admin",
            icon: "error",
          });
        }
      })
      .catch(() => {
        setMobileApiError("Mobile number not registered.");
        // Swal.fire({
        //   title: "Error",
        //   text: "Mobile number not registered.",
        //   icon: "error",
        // });
      });
  };

  const handleConfirmPasswordOtp = (e: any) => {
    e.preventDefault();

    if (otp) {
      axios
        .post(`${API_URL}/user/login/mobile/otp`, {
          mobile: mobileNumber,
          otp: otp,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token2")}`,
          },
        })
        .then((response) => {
          const authToken = response.data.token;
          const sanitizedToken = authToken;
          localStorage.setItem("token", sanitizedToken);
          if (URL) {
            navigate(URL)
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error with OTP login:", error);
          setOtpPassApiError(error?.response?.data?.message)
        });
    }
    else if (password) {
      axios
        .post(`${API_URL}/user/login/mobile/otp`, {
          mobile: mobileNumber,
          password: password,
        })
        .then((response) => {
          const authToken = response.data.token;
          const sanitizedToken = authToken;
          localStorage.setItem("token", sanitizedToken);
          if (URL) {
            navigate(URL)
          } else {
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error with password login:", error);
          setOtpPassApiError(error?.response?.data?.message)
        });
    } else {
      console.log("Please provide either OTP or password.");
      showPasswordField && setOtpPassApiError("Please provide password.");
      showOtpField && setOtpPassApiError("Please provide OTP.");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  }

  return (
    <>
      <div className="main-wrapper authendication-pages">
        <div className="content">
          <div className="container wrapper no-padding">
            <div className="row no-margin vph-100">
              <div className="col-12 col-sm-12 col-lg-6 no-padding">
                <div className="banner-bg login">
                  <div className="row no-margin h-100">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <div className="text-bg register text-center">
                          <button
                            type="button"
                            className="btn btn-limegreen text-capitalize"
                          >
                            <i className="fa-solid fa-thumbs-up me-3" />
                            Login User, Coach &amp; Venue Admin
                          </button>
                          <p>
                            Log in right away for our advanced sports software
                            solutions, created to address issues in regular
                            sporting events and activities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-lg-6 no-padding">
                <div className="dull-pg">
                  <div className="row no-margin vph-100 d-flex align-items-center justify-content-center">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <header className="text-center">
                        <Link to={route.home}>
                          <ImageWithBasePath
                            src="/assets/KHELO-INDORE-LOGO.png"
                            className="img-fluid img-logo"
                            alt="Logo"
                          />
                        </Link>
                      </header>
                      <div className="shadow-card">
                        <h2>Welcome Back</h2>
                        <p>Login into your account</p>

                        <form onSubmit={handleConfirmPasswordOtp}>
                          <div className="form-group">
                            <input
                              type="text"
                              name="mobile"
                              className={`form-control ${mobileApiError ? "is-invalid" : ""}`}
                              placeholder="Enter Mobile Number"
                              value={mobileNumber}
                              maxLength={10}
                              onChange={handleChange}
                            />
                            {mobileApiError && (
                              <div className="invalid-feedback">{mobileApiError}</div>
                            )}
                          </div>
                          {showPasswordField && (
                            <>
                              <div className="form-group">
                                <div className="pass-group group-img">
                                  <i className="toggle-password feather-eye" onClick={togglePasswordVisibility} />
                                  <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="password"
                                    className={`form-control ${otpPassApiError ? "is-invalid" : ""}`}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                      setOtpPassApiError("");
                                    }}
                                  />
                                  {otpPassApiError && (
                                    <div className="invalid-feedback">{otpPassApiError}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-end"><Link to={route.changePassword}>Forgot Password ?</Link></div>
                            </>
                          )}
                          {showOtpField && (
                            <>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="otp"
                                  className={`form-control ${otpPassApiError ? "is-invalid" : ""}`}
                                  placeholder="Enter OTP"
                                  value={otp}
                                  onChange={(e) => {
                                    setOtp(e.target.value);
                                    setOtpPassApiError("");
                                  }}
                                />
                                {otpPassApiError && (
                                  <div className="invalid-feedback">{otpPassApiError}</div>
                                )}
                              </div>
                            </>
                          )}
                          {showPasswordField && (
                            <button
                              type="submit"
                              className="ki-btn-primary w-100 text-dark"
                              onClick={handleConfirmPasswordOtp}
                            >
                              Login
                            </button>
                          )}
                        </form>
                        {showOtpField && (
                          <button
                            className="ki-btn-primary text-capitalize mt-3 w-100 text-dark"
                            onClick={handleConfirmPasswordOtp}
                          >
                            Login
                          </button>
                        )}
                        <div className="row mb-3 d-flex justify-content-center gap-4">
                          {!(showOtpField || showPasswordField) && (
                            <>
                              <button
                                className="ki-btn-secondary col-5"
                                onClick={() => {
                                  handleLoginWithMobile("OTP");
                                }}
                                disabled={
                                  !mobileNumber || mobileNumber.length < 10
                                }
                              >
                                Login with OTP
                              </button>
                              <button
                                className="ki-btn-secondary col-5"
                                onClick={() => {
                                  handleLoginWithMobile("Password");
                                }}
                                disabled={
                                  !mobileNumber || mobileNumber.length < 10
                                }
                              >
                                Login with Password
                              </button>
                            </>
                          )}
                        </div>

                        <div className="bottom-text text-center mt-3">
                          <p>
                            Don’t have an account?{" "}
                            <Link to={route.register}>Sign up!</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
