import React, { useEffect, useState } from 'react'
import { all_routes } from '../router/all_routes'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath';
import { API_URL } from '../../ApiUrl';
import Password from 'antd/es/input/Password';
import Swal from 'sweetalert2';
import Loader from '../loader/loader';

const ChangePassword = () => {
  const routes = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const navigate = useNavigate()

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [showEmail, setShowEmail] = useState(true)
  const [showOtp, setShowOtp] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loader, setLoader] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  }

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prevState => !prevState);
  }

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    } else if (!emailPattern.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    setLoader(true)
    try {
      const response = await axios.post(`${API_URL}/user/forgot-password`, {
        email: email
      });

      

      if (response.data.token) {
        
        localStorage.setItem("PasswordToken", response.data.token);
        setShowOtp(true)
        setShowEmail(false)
        setLoader(false)
      } else {
        setLoader(false)
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: response.data.message || 'An error occurred, please try again.',
        }));
      }
    } catch (error: any) {
      setLoader(false)
      
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred, please try again later.';

      setErrors((prevErrors) => ({ ...prevErrors, email: errorMessage }));
    }
  }

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    if (!otp) {
      setErrors((prevErrors) => ({ ...prevErrors, otp: 'OTP is required' }));
      return;
    }
    setErrors((prevErrors) => ({ ...prevErrors, otp: '' }));
    setLoader(true)
    try {

      const response = await axios.post(`${API_URL}/user/verfy-otp`,
        {
          otp: otp
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PasswordToken")}`,
          },
        })

      

      if (response.data) {
        
        setShowOtp(false)
        setShowPasswordField(true)
        setLoader(false)
      } else {
        setLoader(false)
        setErrors((prevErrors) => ({
          ...prevErrors,
          otp: response.data.message || 'An error occurred, please try again.',
        }));
      }
    } catch (error: any) {
      setLoader(false)
      
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred, please try again later.';

      setErrors((prevErrors) => ({ ...prevErrors, otp: errorMessage }));
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    let newPasswordError = '';
    let confirmPasswordError = '';

    if (!newPassword) {
      newPasswordError = 'New password is required';
    }
    if (newPassword !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }

    if (newPasswordError || confirmPasswordError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      newPassword: '',
      confirmPassword: '',
    }));
    setLoader(true)
    try {

      const response = await axios.post(`${API_URL}/user/reset-password`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PasswordToken")}`,
          },
        })

      

      if (response.data) {
        
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setLoader(false)
        Swal.fire({
          title: 'Success!',
          text: 'Password updated successfully. Now you can login with your new password.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          localStorage.removeItem("PasswordToken");
          navigate("/login");
        });
      } else {
        setLoader(false)
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPasswordError: response.data.message || 'An error occurred, please try again.',
        }));
      }
    } catch (error: any) {
      setLoader(false)
      
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred, please try again later.';

      setErrors((prevErrors) => ({ ...prevErrors, confirmPasswordError: errorMessage }));
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className="main-wrapper authendication-pages">
        {/* Page Content */}
        <div className="content blur-ellipses login-password">
          <div className="container">
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-7 mx-auto vph-100 d-flex align-items-center">
                <div className="change-password w-100">
                  {/* <header className="text-center">
                  <Link to={routes.home}>
                    <ImageWithBasePath src="/assets/KHELO-INDORE-LOGO.png" className="img-fluid" alt="Logo" />
                  </Link>
                </header> */}
                  <div className="shadow-card">
                    <h2>Forgot Password ?</h2>
                    {/* Login Form */}
                    <form>
                      {/* Email Field */}
                      <div className="form-group">
                        <div className="group-img">
                          <i className="feather-mail" />
                          <input
                            type="email"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Email Address"
                            required
                            disabled={!showEmail}
                          />
                        </div>
                        {errors.email && <div className="text-danger mt-2">{errors.email}</div>}
                      </div>

                      {
                        showOtp &&
                        <div className="form-group">
                          <div className="group-img">
                            <i className="feather-lock" />
                            <input
                              type="text"
                              name="otp"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="form-control"
                              placeholder="OTP"
                              required
                            />
                          </div>
                          {errors.otp && <div className="text-danger mt-2">{errors.otp}</div>}
                        </div>
                      }

                      {
                        showPasswordField && <>
                          <div className="form-group">
                            <div className="pass-group group-img">
                              <i className="toggle-password feather-eye" onClick={togglePasswordVisibility} />
                              <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name='new_password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-control pass-input"
                                placeholder="New Password"
                                required
                              />
                            </div>
                            {errors.newPassword && <div className="text-danger mt-2">{errors.newPassword}</div>}
                          </div>

                          <div className="form-group">
                            <div className="pass-group group-img">
                              <i className="toggle-password-confirm feather-eye" onClick={toggleConfirmPasswordVisibility} />
                              <input
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                name='confirm_password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control pass-confirm"
                                placeholder="Confirm Password"
                                required
                              />
                            </div>
                            {errors.confirmPassword && <div className="text-danger mt-2">{errors.confirmPassword}</div>}
                          </div>
                        </>
                      }


                      {
                        showEmail &&
                        <Link to={""} onClick={handleEmailSubmit} className="btn btn-secondary w-100 d-inline-flex justify-content-center align-items-center">
                          Verify Email <i className="feather-arrow-right-circle ms-2" />
                        </Link>
                      }
                      {
                        showOtp &&
                        <Link to={""} onClick={handleOtpSubmit} className="btn btn-secondary w-100 d-inline-flex justify-content-center align-items-center">
                          Verify Otp <i className="feather-arrow-right-circle ms-2" />
                        </Link>
                      }
                      {
                        showPasswordField &&
                        <Link to={""} onClick={handlePasswordSubmit} className="btn btn-secondary w-100 d-inline-flex justify-content-center align-items-center">
                          Change Password <i className="feather-arrow-right-circle ms-2" />
                        </Link>
                      }
                    </form>

                  </div>
                  <div className="bottom-text text-center">
                    <p>Have an account? <Link to={routes.login}>Sign In!</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  )
}

export default ChangePassword;
