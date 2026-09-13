import React, { useEffect, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [resetStep, setResetStep] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const resetLinkToken = new URLSearchParams(location.search).get('resetToken');
    if (resetLinkToken) {
      setResetToken(resetLinkToken);
      setResetStep('password');
    }
  }, [location.search]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('resetToken')) return;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (['Super Admin', 'Venue Admin', 'Coach', 'Personal Trainer'].includes(payload?.role)) {
          navigate('/dashboard');
        } else {
          window.location.replace('/');
        }
      } catch {
        // An invalid token is handled by the normal login form / route guard.
      }
    }
  }, [navigate, location.search]);

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

  const requestResetOtp = async (event) => {
    event.preventDefault();
    setResetLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/user/forgot-password`, { email: resetEmail.trim() });
      setResetToken(data.token);
      setResetStep('verify');
      Swal.fire('OTP sent', 'Check your registered email for the reset OTP.', 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Unable to send reset OTP.', 'error');
    } finally { setResetLoading(false); }
  };

  const verifyResetOtp = async (event) => {
    event.preventDefault();
    setResetLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/user/verfy-otp`, { otp: resetOtp }, { headers: { Authorization: `Bearer ${resetToken}` } });
      setResetToken(data.resetToken);
      setResetStep('password');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Invalid OTP.', 'error');
    } finally { setResetLoading(false); }
  };

  const resetAccountPassword = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) return Swal.fire('Password too short', 'Use at least 8 characters.', 'error');
    if (newPassword !== confirmPassword) return Swal.fire('Passwords do not match', 'Enter the same password twice.', 'error');
    setResetLoading(true);
    try {
      await axios.post(`${API_URL}/user/reset-password`, { new_password: newPassword, confirm_password: confirmPassword }, { headers: { Authorization: `Bearer ${resetToken}` } });
      Swal.fire('Password updated', 'You can now log in with your new password.', 'success');
      setResetStep('login');
      setResetOtp(''); setResetToken(''); setNewPassword(''); setConfirmPassword('');
      navigate('/', { replace: true });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Unable to reset password.', 'error');
    } finally { setResetLoading(false); }
  };

  if (resetStep !== 'login') {
    const isRequest = resetStep === 'request';
    const isVerify = resetStep === 'verify';
    const submitHandler = isRequest ? requestResetOtp : isVerify ? verifyResetOtp : resetAccountPassword;
    return (
      <div className="admin-auth-wrapper">
        <div className="admin-login-card">
          <div className="card-accent-bar" />
          <div className="text-center mb-4"><img src={logoImage} alt="Khelo Indore Logo" className="login-logo-img" /></div>
          <div className="text-center mb-4">
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">{isRequest ? 'Enter the registered email for your Venue Admin, Coach, or Trainer account.' : isVerify ? 'Enter the 6-digit OTP sent to your email.' : 'Choose a new password for your account.'}</p>
          </div>
          <form onSubmit={submitHandler}>
            {isRequest && <div className="form-group mb-4"><label className="input-label">Registered Email</label><input type="email" required className="clean-admin-input w-100" placeholder="Enter registered email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} /></div>}
            {isVerify && <div className="form-group mb-4"><label className="input-label">OTP</label><input type="text" required maxLength={6} inputMode="numeric" className="clean-admin-input w-100" placeholder="Enter 6-digit OTP" value={resetOtp} onChange={(event) => setResetOtp(event.target.value.replace(/\D/g, ''))} /></div>}
            {!isRequest && !isVerify && <>
              <div className="form-group mb-3"><label className="input-label">New Password</label><div className="position-relative"><input type={showNewPassword ? 'text' : 'password'} required className="clean-admin-input w-100" placeholder="Minimum 8 characters" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><button type="button" className="btn position-absolute end-0 top-50 translate-middle-y" onClick={() => setShowNewPassword(!showNewPassword)} aria-label="Show or hide new password"><i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} /></button></div></div>
              <div className="form-group mb-4"><label className="input-label">Confirm New Password</label><input type={showNewPassword ? 'text' : 'password'} required className="clean-admin-input w-100" placeholder="Re-enter new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
            </>}
            <button type="submit" className="btn-admin-submit" disabled={resetLoading}>{resetLoading ? 'Please wait...' : isRequest ? 'Send Reset OTP' : isVerify ? 'Verify OTP' : 'Set New Password'}</button>
          </form>
          <button type="button" className="btn btn-link w-100 mt-3 text-decoration-none" onClick={() => setResetStep('login')}>Back to login</button>
        </div>
      </div>
    );
  }

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
            <div className="position-relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="clean-admin-input w-100"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <button type="button" className="btn position-absolute end-0 top-50 translate-middle-y" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password"><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /></button>
            </div>
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
          <button type="button" className="btn btn-link w-100 mt-2 text-decoration-none" onClick={() => setResetStep('request')}>Forgot password?</button>
        </form>
      </div>
    </div>
  );
}

export default Loginadmin;
