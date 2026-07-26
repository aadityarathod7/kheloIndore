import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import "../../src/User.css";
import Swal from "sweetalert2";
import { API_URL } from '../utils/ApiUrl';
import { useNavigate } from 'react-router-dom';
 
const Users = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    role: "User",
    password: "",
    confirm_password: "",
    status: true,
  });
 
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
 
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Validate form fields
    const validationErrors = {};
 
    // First Name validation
    if (!formData.first_name.trim()) {
      validationErrors.first_name = "First name is required";
    }
 
    // Last Name validation
    if (!formData.last_name.trim()) {
      validationErrors.last_name = "Last name is required";
    }
 
    // Mobile validation
    if (formData.mobile.trim().length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
      validationErrors.mobile = "Mobile number must be a 10-digit number";
    }
 
    // Email validation
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Basic regex for email validation
      validationErrors.email = "Email is not valid";
    }
 
    // Password validation
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }
 
    // Confirm Password validation
    if (!formData.confirm_password.trim()) {
      validationErrors.confirm_password = "Confirm Password is required";
    } else if (formData.password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }
 
    // Role validation
    if (!formData.role.trim()) {
      validationErrors.role = "Role is required";
    }
 
    // If there are any validation errors, set them and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
 
    try {
      const response = await axios.post(
        `${API_URL}/super-admin/add-user`,
        formData
      );
     
   
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User added successfully",
        }).then(() => {
          navigate('/users');
        });
      } else {
   
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message || "Something went wrong!",
        });
      }
     
    } catch (error) {
      console.error("Error:", error);
     
   
      const errorMessage = error?.response?.data?.message || "An error occurred while adding the user.";
     
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
      });
    }
  }
 
  
  const handleCancel = () => {
    navigate('/users');
  };
 
  return (     
    <>
      <h3 className="mb-4 title">Add User</h3>
      <Container
        style={{
          maxWidth: "1000px",
          boxShadow: "6px 0px 1px -8px rgba(0,0,0,0.75)",
          marginBottom: "20px",
          marginTop: "30px",
          // marginRight: "400px",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* First Name and Last Name in one row */}
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  First Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  isInvalid={!!errors.first_name}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                  maxLength={25}
                  style={{ marginTop: "5px", marginBottom: "4px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>
                  Last Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  isInvalid={!!errors.last_name}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                  maxLength={25}
                  style={{ marginTop: "5px", marginBottom: "4px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
 
          <Row>
            {/* Email and Mobile in one row */}
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email Address<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  style={{ marginTop: "5px", marginBottom: "4px"  }}
                  maxLength={50}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMobile">
                <Form.Label>
                  Mobile Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Mobile Number"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, mobile: newValue });
                  }}
                  isInvalid={!!errors.mobile}
                  style={{ marginTop: "5px", marginBottom: "4px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
 
          <Row>
            {/* Password and Confirm Password in one row */}
            <Col md={6}>
              <Form.Group controlId="formPassword">
                <Form.Label>
                  Password<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  style={{ marginTop: "5px", marginBottom: "4px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
 
            <Col md={6}>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>
                  Confirm Password<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  isInvalid={!!errors.confirm_password}
                  style={{ marginTop: "5px", marginBottom: "4px" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirm_password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
 
          <Form.Group controlId="formCheckbox">
            <div className="checkbox-container">
              <Form.Check
                type="checkbox"
                id="statusCheckbox"
                name="status"
                aria-label="option 1"
                className="checkbox-input"
                checked={formData.status || false}
                onChange={e => setFormData({ ...formData, status: e.target.checked })}
              />
            </div>
            <Form.Label className="checkbox-label">Status</Form.Label>
          </Form.Group>
 
          {apiError && (
            <Row className="mt-3">
              <Col md={12}>
                <div className="alert alert-danger">{apiError}</div>
              </Col>
            </Row>
          )}
 
          <Row style={{ marginTop: "20px", marginLeft: "0px" }}>
            <Col md={12}>
              <div className="ButtonsContainer d-flex justify-content-start">
                {" "}
                <button
                  type="submit"
                  className="submit-button"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
 
export default Users;