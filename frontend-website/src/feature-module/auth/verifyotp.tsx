

import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
// import "./register.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {API_URL} from "../../ApiUrl"
import Loader from "../loader/loader";

const VerifyOTP = () => {
  const route = all_routes;
  const navigate = useNavigate(); // Use useNavigate hook
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // useEffect(() => {
  //   // Retrieve token from local storage
  //   const storedToken = localStorage.getItem('token');
  //   if (storedToken) {
  //     // If token exists in local storage, set it in component state
  //     setToken(storedToken);
  //   } else {
  //     // If token doesn't exist, redirect user to the login page
  //     navigate('/user/user-dashboard');
  //   }
  // }, [navigate]);
  
useEffect(()=>{
  const loginToken = localStorage.getItem("token");
  if (loginToken) {
    navigate("/");
  }
},[])
  const handleOTPChange = (e:any) => {
    setOTP(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!otp) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please enter OTP to verify!',
        });
        return;
      }

      setLoader(true)

      const response = await axios.post(
        `${API_URL}/user/registration/otp`,
        { otp: otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token2')}`,
          },
        }
      );
      if (response.data.success) {
        setLoader(false)
        const authToken = response.data.KHELO_INDORE || '';
        const sanitizedToken = authToken.replace(/["']/g, '');
        setToken(sanitizedToken);
        // localStorage.setItem('token', response.data.token);

        Swal.fire('Success!', 'Signup Successful!', 'success');
        navigate('/login');
      } else {
        Swal.fire('Error!', 'Invalid OTP. Please try again.', 'error');
      }
    } catch (error) {
      setLoader(false)
      console.error('Error verifying OTP:', error);
      Swal.fire('Error!', 'Failed to verify OTP. Please try again.', 'error');
    }
  };

  return (
    <>
    {loader && <Loader></Loader>}
      {/* Main Wrapper */}
      <div className="main-wrapper authendication-pages">
        {/* Page Content */}
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
                            Register Now
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
                        {/* <p>Please Enter OTP</p> */}

                        {/* OTP Verification Form */}
                        <form>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Please Enter OTP"
                              value={otp}
                              onChange={handleOTPChange}
                            />
                          </div>

                          <button
                            type="button"
                            className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center w-100 btn-block"
                            onClick={handleSubmit}
                          >
                            Verify OTP
                            <i className="feather-arrow-right-circle ms-2" />
                          </button>
                        </form>
                        {/* /OTP Verification Form */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default VerifyOTP;




