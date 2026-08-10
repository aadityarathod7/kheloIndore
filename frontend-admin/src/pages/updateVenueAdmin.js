import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";
import { CitySelect, StateSelect } from "react-country-state-city/dist/cjs";

const UpdateVenueAdmin = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState()
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
  });

  const [errors, setErrors] = useState({});
  const [countryid] = useState(101);

  const [stateid, setStateid] = useState(0);
  const [apiError, setApiError] = useState("");

  const fetchUserData = async (_id) => {
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
    try {
      const response = await axios.get(`${API_URL}/user/fetch-user-by-id/${_id}`);
      const { data } = response.data;

      setAdminData(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile: data.mobile,
        role: data.role,
        status: data.status,
        state: data.state || "",
        city: data.city || "",
        zipcode: data.zipcode || "",
      });

      if (data.state) {
        setStateid(data.state.id);
      }
      Swal.close();
    } catch (error) {
      
      Swal.close();
    }
  };

  useEffect(() => {

    if (_id) {
      fetchUserData(_id);
    }
  }, [_id]);

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, mobile, state, city } = formData;
    const newErrors = {};

    if (!first_name) newErrors.first_name = "First name is required.";
    if (!last_name) newErrors.last_name = "Last name is required.";
    if (!mobile) newErrors.mobile = "Mobile number is required.";
    // if (!state) newErrors.state = "State is required.";
    // if (!city) newErrors.city = "City is required.";

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
        title: "Admin Updated!",
        text: "Venue Admin updated successfully",
      });
      navigate("/venue-admin");
    } catch (error) {
      
      setApiError(error.response?.data?.message || "Failed to update Venue admin")
    }
  };

  const handleCancel = () => {
    navigate("/venue-admin");
  };

  const handleUpdateAccess = async (isAdminAccess) => {
    try {
      const response = await axios.put(`${API_URL}/super-admin/update-admin-status`, {
        id: _id,
        is_admin_access: isAdminAccess,
        role: "Venue Admin"
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        Swal.fire("Success!", "Admin access updated successfully.", "success");
        fetchUserData(_id)
      } else {
        Swal.fire("Error", "Failed to update admin access.", "error");
      }
    } catch (error) {
      
      Swal.fire("Error", "An error occurred while updating admin access.", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  return (
    <>
      <h3 className="mb-4 title">Update Venue Admin</h3>
      <Container
        style={{
          maxWidth: "1000px",
          boxShadow: "6px 0px 1px -8px rgba(0,0,0,0.75)",
          marginBottom: "20px",
          marginTop: "30px",
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
                  maxLength={25}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
                  }}
                  isInvalid={!!errors.first_name}
                />
                {errors.first_name && (
                  <Form.Text className="text-danger">
                    {errors.first_name}
                  </Form.Text>
                )}
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
                  maxLength={25}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
                  }}
                  isInvalid={!!errors.last_name}
                />
                {errors.last_name && (
                  <Form.Text className="text-danger">
                    {errors.last_name}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label className="mt-3">Email Address
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  maxLength={50}
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMobile">
                <Form.Label className="mt-3">
                  Mobile Number<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  placeholder="Enter Mobile Number"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  isInvalid={!!errors.mobile}
                />
                {errors.mobile && (
                  <Form.Text className="text-danger">
                    {errors.mobile}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formZipCode">
                <Form.Label className="mt-3">Zip Code</Form.Label>
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
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formState">
                <Form.Label className="mt-3">
                  State
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter State"
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Restrict input to alphabetic characters
                  }}
                  isInvalid={!!errors.state}
                />
                {errors.state && (
                  <Form.Text className="text-danger">
                    {errors.state}
                  </Form.Text>
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
                <Form.Label className="mt-3">
                  City
                </Form.Label>


                <Form.Control
                  type="text"
                  placeholder="Enter State"
                  name="state"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Restrict input to alphabetic characters
                  }}
                  isInvalid={!!errors.city}
                />
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
            <Col md={12} className="d-flex justify-content-start mt-3">
              {
                adminData?.is_admin_access === 1 || adminData?.is_admin_access === 2 ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="submit-button"
                      style={{ marginRight: "10px" }}
                      onClick={() => handleUpdateAccess(1)}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      className="cancel-button"
                      onClick={() => handleUpdateAccess(2)}
                    >
                      Reject
                    </Button>
                  </>
                )
              }
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default UpdateVenueAdmin;