import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../src/Khelo Indore Logo/Group 88.png';
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
    // role: Yup.string().required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      mobile: '',
      password: '',
      // role: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      handleApi(values, setSubmitting);
    },
  });

  console.log(state,"state route")

  const handleApi = (formData, setSubmitting) => {
    axios
      .post(`${API_URL}/user/login`, {
        mobile: Number(formData.mobile),
        password: formData.password,
        // role: formData.role,
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

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('roleSelect');

    selectElement.addEventListener('change', function () {
      if (selectElement.value) {
        selectElement.style.backgroundColor = 'orange';
      } else {
        selectElement.style.backgroundColor = 'white';
      }
    });
  });

  return (
    <div className="con">
      <div className="row justify-content-center">
        <div className="col-md-6 col-10">
          <div className="card mt-5">
            <div className="card-body">
              <img
                src={logoImage}
                alt="Logo"
                className="logo-image"
                style={{ maxWidth: '150px' }}
              />
              <form onSubmit={formik.handleSubmit}>
                {/* <div className="form-group">
                  <label htmlFor="role" style={{ fontWeight: 'bold' }}>
                    Select Role
                  </label>
                  <div className="select-container">
                    <select
                      id="roleSelect"
                      name="role"
                      className="form-control"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.role}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Venue Admin">Venue Admin</option>
                      <option value="Coach">Coach</option>
                    </select>
                    <i className="fa fa-chevron-down select-icon"></i>
                  </div>
                  {formik.touched.role && formik.errors.role ? (
                    <div className="text-danger">{formik.errors.role}</div>
                  ) : null}
                </div> */}

                <div className="form-group">
                  <label htmlFor="mobile" style={{ fontWeight: 'bold' }}>
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    placeholder="Enter Mobile Number"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    className="form-control"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      formik.setFieldValue('mobile', value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile}
                  />
                  {formik.touched.mobile && formik.errors.mobile ? (
                    <div className="text-danger">{formik.errors.mobile}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="password" style={{ fontWeight: 'bold' }}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="spinner">
                  <button type="submit" className="btn-login" disabled={formik.isSubmitting}>
                    Login
                    {formik.isSubmitting && (
                      <ClipLoader color={'#FFFFFF'} loading={formik.isSubmitting} css={override} size={20} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginadmin;
