import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";
import { CitySelect, StateSelect } from "react-country-state-city/dist/cjs";
 
const UpdateUsers = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
 
  // Initial state for formData
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    role: "",
    status: false,
    state: "",
    zipcode: "",
    city: "",
    stateId: "",
  });
  
 
  const [errors, setErrors] = useState({});
  const [countryid] = useState(101);
  const [stateid, setStateid] = useState();
  const [apiError, setApiError] = useState("");
 
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      text: "Fetching data...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    axios
      .get(`${API_URL}/user/fetch-user-by-id/${_id}`)
      .then((res) => {
        const { data } = res.data;
        
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          mobile: data.mobile,
          role: data.role,
          status: data.status,
          state: data.state || "", // Ensure empty string if state is null
          city: data.city || "", // Ensure empty string if city is null
          zipcode: data.zipcode || "",
          stateId: data.stateId || "",
        });
        if (data) {
          setStateid(data.stateId); // Assuming `state` contains an ID
        }
        Swal.close();
      })
      .catch((error) => {
        
        Swal.close();
      });
  }, [_id]);
 
  
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
 
    // Clear the error when the user starts editing the field
    setErrors({
      ...errors,
      [name]: "",
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Simple validation
    const { first_name, last_name, mobile, state , city } = formData;
    const newErrors = {};
 
    // Validate required fields
    if (!first_name) newErrors.first_name = "First name is required.";
    if (!last_name) newErrors.last_name = "Last name is required.";
    if (!mobile) newErrors.mobile = "Mobile number is required.";
    // if (!state) newErrors.state = "State is required.";
    // if (!city) newErrors.city = "City is required.";
 
    // If there are validation errors, set the error state and show an alert
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 
    try {
      const response = await axios.put(
        `${API_URL}/super-admin/update-user/${_id}`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "User Updated!",
        text: "User updated successfully",
      });
      navigate("/users");
    } catch (error) {
      
      setApiError(error.response?.data?.message || "Failed to update user")
    }
  };
 
  const handleCancel = () => {
    navigate("/users");
  };
 
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
 
  return (
    <>
      <h3 className="mb-4 title">Update User</h3>
      <Container
        style={{
          maxWidth: "1000px",
          boxShadow: "6px 0px 1px -8px rgba(0,0,0,0.75)",
          marginBottom: "20px",
          marginTop: "30px",
          // marginRight: "400px",
        }}
      >
        <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <Row>
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
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
                  }}
                  maxLength={25}
                  isInvalid={!!errors.first_name}
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
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
                  }}
                  maxLength={25}
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
 
          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label  className="mt-3">
                  Email Address<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  maxLength={50}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMobile">
                <Form.Label  className="mt-3">
                  Mobile Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  placeholder="Enter Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  isInvalid={!!errors.mobile}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
 
          <Row>
            <Col md={6}>
              <Form.Group controlId="formZipCode">
                <Form.Label   className="mt-3">Zip Code</Form.Label>
 
 
                <Form.Control
                  type="text"
                  placeholder="Enter Zip Code"
                  name="zipcode"
                  maxLength={6}
                  value={formData.zipcode}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
                     <Form.Control.Feedback type="invalid">
                  {errors.zipcode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>


            <Col md={6}>
              <Form.Group controlId="formState">
                <Form.Label  className="mt-3">
                  State<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={formData.state ? formData.state : "Select State"}
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                  }}
                  onInput={(e) => {
                    // Allow alphabetic characters and spaces
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); 
                  }}
                  
                  onKeyDown={handleKeyDown}
                  isInvalid={!!errors.state}
                />
                {errors.state && (
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
 
            </Col>


            
          </Row>
 
          <Row>
            <Col md={6}>
              <Form.Group controlId="formStatus">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formCity">
                <Form.Label  className="mt-3">City</Form.Label>
 
 
                <Form.Control
                  type="text"
                  placeholder={formData.city ? formData.city : "Select city"}
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Restrict input to alphabetic characters
                  }}

                
                  onKeyDown={handleKeyDown}
                  isInvalid={!!errors.city}
                />
                {errors.city && (
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
 
          {apiError && (
            <Row className="mt-3">
              <Col md={12}>
                <div className="alert alert-danger">{apiError}</div>
              </Col>
            </Row>
          )}
 
          <Row>
            <Col md={12} className="d-flex justify-content-start">
              <Button
                type="submit"
                className="submit-button"
                style={{ marginRight: "10px" }}
              >
                Update
              </Button>
              <Button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
 
export default UpdateUsers;