import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../src/Khelo Indore Logo/logo.png';
import '../../src/Loginadmin.css';
import { API_URL } from '../utils/ApiUrl';

function Loginadmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile number is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      mobile: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      handleApi(values, setSubmitting);
    },
  });

  const handleApi = (formData, setSubmitting) => {
    axios
      .post(`${API_URL}/user/login`, {
        mobile: Number(formData.mobile),
        password: formData.password,
      })
      .then((response) => {
        if (response.data.success) {
          setSubmitting(false);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.userId);
          localStorage.setItem('role', response.data.role);

          if (state?.userId) {
            if (state?.role === "venueAdmin") {
              navigate(`/venue-admin/update/${state?.userId}`);
            } else if (state?.role === "coachTrainer") {
              navigate(`/approve-trainer-coach/${state?.userId}`);
            }
          } else {
            switch (response.data.role) {
              case 'Super Admin':
                navigate('/dashboard');
                break;
              case 'Venue Admin':
                navigate('/venues');
                break;
              case 'Coach':
                navigate('/coaches');
                break;
              case 'Personal Trainer':
                navigate('/personal-training');
                break;
              default:
                navigate('/dashboard');
            }
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'You are not active, please contact admin',
            icon: 'error',
          });
          setSubmitting(false);
        }
      })
      .catch((error) => {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred';
        Swal.fire('Error', errorMessage, 'error');
        setSubmitting(false);
      });
  };

  return (
    <div className="admin-auth-wrapper">
      <div className="admin-login-card">
        {/* Accent Bar */}
        <div className="card-accent-bar" />

        {/* Logo Header */}
        <div className="text-center mb-4">
          <img
            src={logoImage}
            alt="Khelo Indore Logo"
            className="login-logo-img"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="login-title">
            Admin Portal Login
          </h2>
          <p className="login-subtitle">
            Enter your mobile number and password to continue
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="mobile" className="input-label">
              Mobile Number
            </label>
            <div className="phone-input-wrapper">
              <span className="country-prefix">+91</span>
              <input
                id="mobile"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                type="text"
                inputMode="numeric"
                maxLength={10}
                className="clean-admin-input"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  formik.setFieldValue('mobile', value);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
            </div>
            {formik.touched.mobile && formik.errors.mobile ? (
              <div className="text-danger small mt-1 ps-1">{formik.errors.mobile}</div>
            ) : null}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              className="clean-admin-input w-100"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger small mt-1 ps-1">{formik.errors.password}</div>
            ) : null}
          </div>

          <button type="submit" className="btn-admin-submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <span>Logging in...</span>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Loginadmin;
