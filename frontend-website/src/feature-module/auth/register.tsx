import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
    email: "",
    confirm_password: "",
    role: "User",
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
            text: "You have registered Successfully. Please wait for admin approval.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/");
          });
        }
      } else {
        setErrors({ api: response.data.message });
        Swal.close();
      }
    } catch (error: any) {
      setErrors({ api: error.response.data.message });
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
    <div>
      <>
        <div className="main-wrapper authendication-pages">
          <div className="content">
            <div className="container wrapper no-padding">
              <div className="row no-margin vph-100">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                  <div className="banner-bg register">
                    <div className="row no-margin h-100">
                      <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                        <div className="h-100 d-flex justify-content-center align-items-center">
                          <div className="text-bg register text-center">
                            <button
                              type="button"
                              className="btn btn-limegreen text-capitalize"
                            >
                              <i className="fa-solid fa-thumbs-up me-3" />
                              register Now
                            </button>
                            <p>
                              Register now for our innovative sports software
                              solutions, designed to tackle challenges in
                              everyday sports activities and events.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
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
                          <h2>Get Started With Khelo Indore</h2>
                          <p>
                            Ignite your sports journey with KheloIndore and get
                            started now.
                          </p>

                          <ul
                            className="nav nav-tabs"
                            id="myTab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link  d-flex align-items-center ${input.role === "User" ? "active" : ""}`}
                                id="user-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#user"
                                type="button"
                                role="tab"
                                aria-controls="user"
                                onClick={() => handleRole("role", "User")}
                              >
                                I am a User
                              </button>
                            </li>

                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link  d-flex align-items-center ${input.role === "Venue Admin" ? "active" : ""}`}
                                id="venue-admin-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#venue-admin"
                                type="button"
                                role="tab"
                                aria-controls="venue-admin"
                                aria-selected={input.role === "Venue Admin"}
                                onClick={() =>
                                  handleRole("role", "Venue Admin")
                                }
                              >
                                Venue Admin
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link  d-flex align-items-center ${input.role === "Coach" || input.role === "Personal Trainer" ? "active" : ""}`}
                                id="Coach-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#Coach"
                                type="button"
                                role="tab"
                                aria-controls="Coach"
                                aria-selected={input.role === "Coach"}
                                onClick={() => handleRole("role", "Coach")}
                              >
                                Coach / Personal Trainer
                              </button>
                            </li>
                          </ul>

                          <div className="tab-content" id="myTabContent">
                            <div
                              className="tab-pane fade show active"
                              // id="user"
                              role="tabpanel"
                              aria-labelledby="user-tab"
                            >
                              <form onSubmit={handleSignUp}>
                                {(input.role === "Coach" ||
                                  input.role === "Personal Trainer") && (
                                    <div className="form-group d-flex gap-4">
                                      <div className="form-check d-flex gap-1">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="role"
                                          id="Coach"
                                          value="Coach"
                                          checked={input.role === "Coach"}
                                          onChange={handleInputChange}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="coach"
                                        >
                                          Coach
                                        </label>
                                      </div>
                                      <div className="form-check d-flex gap-1">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="role"
                                          id="Personal Trainer"
                                          value="Personal Trainer"
                                          checked={
                                            input.role === "Personal Trainer"
                                          }
                                          onChange={handleInputChange}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="Personal Trainer"
                                        >
                                          Personal Trainer
                                        </label>
                                      </div>
                                      {errors.role && (
                                        <p
                                          className="text-danger"
                                          style={{ fontSize: "16px" }}
                                        >
                                          <BiMessageError /> {errors.role}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                <div className="form-group">
                                  <label htmlFor="first_name">
                                    First Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    placeholder="First Name"
                                    name="first_name"
                                    maxLength={25}
                                    value={input.first_name}
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      // Allow only letters and spaces
                                      if (/^[A-Za-z\s]*$/.test(value)) {
                                        handleInputChange(e);
                                      }
                                    }}
                                  />
                                  {errors.first_name && (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "16px" }}
                                    >
                                      <BiMessageError /> {errors.first_name}
                                    </p>
                                  )}
                                </div>

                                <div className="form-group">
                                  <label htmlFor="last_name">
                                    Last Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    maxLength={25}
                                    placeholder="Last Name"
                                    name="last_name"
                                    value={input.last_name}
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      // Allow only letters and spaces
                                      if (/^[A-Za-z\s]*$/.test(value)) {
                                        handleInputChange(e);
                                      }
                                    }}
                                  />
                                  {errors.last_name && (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "16px" }}
                                    >
                                      <BiMessageError /> {errors.last_name}
                                    </p>
                                  )}
                                </div>

                                <div className="form-group">
                                  <label htmlFor="email">
                                    Email <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Email"
                                    name="email"
                                    value={input.email}
                                    onChange={handleInputChange}
                                  />
                                  {errors.email && (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "16px" }}
                                    >
                                      <BiMessageError /> {errors.email}
                                    </p>
                                  )}
                                </div>

                                <div className="form-group">
                                  <label htmlFor="mobile">
                                    Mobile{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="mobile"
                                    placeholder="Mobile"
                                    name="mobile"
                                    value={input.mobile}
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      if (/^\d{0,10}$/.test(value)) {
                                        handleInputChange(e);
                                      }
                                    }}
                                  />
                                  {errors.mobile && (
                                    <p
                                      className="text-danger"
                                      style={{ fontSize: "16px" }}
                                    >
                                      <BiMessageError /> {errors.mobile}
                                    </p>
                                  )}
                                </div>
                                <div className="form-group">
                                  <label htmlFor="password">
                                    Password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="pass-group group-img">
                                    <i className="toggle-password feather-eye" onClick={togglePasswordVisibility} />
                                    <input
                                      type={isPasswordVisible ? 'text' : 'password'}
                                      className="form-control"
                                      id="password"
                                      placeholder="Password"
                                      name="password"
                                      value={input.password}
                                      onChange={handleInputChange}
                                    />
                                    {errors.password && (
                                      <p
                                        className="text-danger"
                                        style={{ fontSize: "16px" }}
                                      >
                                        <BiMessageError /> {errors.password}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="form-group">
                                  <label htmlFor="confirmPassword">
                                    Confirm Password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="pass-group group-img">
                                    <i className="toggle-password feather-eye" onClick={toggleConfirmPasswordVisibility} />
                                    <input
                                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                                      className="form-control"
                                      id="confirm_password"
                                      placeholder="Confirm Password"
                                      name="confirm_password"
                                      value={input.confirm_password}
                                      onChange={handleInputChange}
                                    />
                                    {errors.confirm_password && (
                                      <p
                                        className="text-danger"
                                        style={{ fontSize: "16px" }}
                                      >
                                        <BiMessageError />{" "}
                                        {errors.confirm_password}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="form-check custom-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="policy"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                  />
                                  <label htmlFor="policy">
                                    I agree to the{" "}
                                    <a
                                      href="/terms-condition"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Terms of Use
                                    </a>
                                  </label>
                                </div>
                                {errors.checkbox && (
                                  <p
                                    className="text-danger"
                                    style={{ fontSize: "16px" }}
                                  >
                                    <BiMessageError /> {errors.checkbox}
                                  </p>
                                )}

                                {errors.api && (
                                  <p
                                    className="text-danger"
                                    style={{ fontSize: "16px" }}
                                  >
                                    <BiMessageError /> {errors.api}
                                  </p>
                                )}

                                <button
                                  type="submit"
                                  className="btn btn-secondary w-100"
                                >
                                  Create Account
                                </button>

                                <div className="text-center py-3">
                                  <p>
                                    Have an account?{" "}
                                    <Link to="/login" className="loginbtn">
                                      login !
                                    </Link>
                                  </p>
                                </div>
                              </form>
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
        </div>
      </>
    </div>
  );
};

export default Signin;
