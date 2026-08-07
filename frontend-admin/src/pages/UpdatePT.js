import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL, Image_URL } from "../utils/ApiUrl";
import "../Coaches.css";
import Select from "react-select";

const UpdatepersonalTrainer  = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    venue_name: "",
    date_of_birth: "",
    gender: "",
    trainer_type: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    mobile: "",
    other_mobile: "",
    email: "",
    bio: "",
    qualifications: "",
    price: "",
    specializations: "",
    experience: "",
    skills: "",
    policiesAndRules: "",
    profile_picture: [],
    identity_Proof: [],
    other_document: [],
    status: "",
  });
  const navigate = useNavigate();

  console.log(formData);

  const [errors, setErrors] = useState({});
  const UpdatepersonalTrainerID = useParams();

  console.log(UpdatepersonalTrainerID._id, "id of coach");

  const handleEditorChange = (content, name) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: content }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));

      setErrors({
        ...errors,
        [name]: checked ? "" : "This field is required", // Example validation message for a checkbox
      });
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSelectChange = (selectedOption) => {
    handleInputChange({
      target: {
        name: "trainer_type",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  const options = [
    { value: "archery", label: "Archery" },
    { value: "badminton", label: "Badminton" },
    { value: "baseball", label: "Baseball" },
    { value: "basketball", label: "Basketball" },
    { value: "golf", label: "Golf" },
    { value: "hockey", label: "Hockey" },
    { value: "kabaddi", label: "Kabaddi" },
    { value: "shooting", label: "Shooting" },
    { value: "skating", label: "Skating" },
    { value: "snooker", label: "Snooker" },
    { value: "soccer", label: "Soccer" },
    { value: "squash", label: "Squash" },
    { value: "swimming", label: "Swimming" },
    { value: "tennis", label: "Tennis" },
    { value: "volleyball", label: "Volleyball" },
    { value: "yoga", label: "Yoga" },
    { value: "zumba", label: "Zumba" },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("hiiiiii");
    let validationErrors = {};
    console.log(validationErrors, "validation");
    
    if (!formData.full_name.trim()) {
      validationErrors.full_name = "Full Name is required";
    }
    if (!formData.date_of_birth.trim()) {
      validationErrors.date_of_birth = "Date of Birth is required";
    }
    if (!formData.gender.trim()) {
      validationErrors.gender = "Gender is required";
    }
    if (!formData.trainer_type.trim()) {
      validationErrors.trainer_type = "Category Type is required";
    }
    if (!formData.address.trim()) {
      validationErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      validationErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      validationErrors.state = "State is required";
    }
    if (!formData.zipcode.trim()) {
      validationErrors.zipcode = "Zip Code is required";
    } else if (formData.zipcode.trim().length !== 6) {
      validationErrors.zipcode = "Zip Code must be 6 characters long";
    }
    if (!formData.bio.trim()) {
      validationErrors.bio = "Bio is required";
    }
    if (!formData.qualifications.trim()) {
      validationErrors.qualifications = "Qualification is required";
    }
    
  
    if (!formData.policiesAndRules.trim()) {
      validationErrors.policiesAndRules = "Policies and Rules are required";
    }
    if (!Array.isArray(formData.profile_picture) || formData.profile_picture.length === 0) {
      validationErrors.profile_picture = "Profile picture is required";
    }

    if (!Array.isArray(formData.identity_Proof) || formData.identity_Proof.length === 0) {
      validationErrors.identity_Proof = "Identity proof is required";
    }
    if (!String(formData.specializations).trim()) {
      validationErrors.specializations = "Specialization is required";
    }

    if (!formData.experience || formData.experience.trim() === '') {
      validationErrors.experience = "Experience is required";
    } else if (isNaN(formData.experience) || parseInt(formData.experience) <= 0) {
      validationErrors.experience = "Experience must be a positive number";
    }
    if (typeof formData.price === 'string' && !formData.price.trim()) {
      validationErrors.price = "Price is required";
    }

    console.log(validationErrors, "validation");
    console.log(validationErrors, "-=-=-=-=-=-=-=");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Form submitted successfully:", formData);
    try {
      const response = await axios.put(
        `${API_URL}/updatePersonalTrainer/${UpdatepersonalTrainerID._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Update response:", response.data);
      Swal.fire({
        icon: "success",
        title: "PersonalTrainer Updated!",
        text: "PersonalTrainer updated successfully",
      });
      navigate(`/personal-training/slots-add/${UpdatepersonalTrainerID._id}`);
    } catch (error) {
      console.error("Error updating the PersonalTrainer:", error);
    }
  };

  const handleUploadImage = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const response = await axios.post(
        `${API_URL}/upload-file?types=coach`,
        formData
      );
      console.log(type, "type");

      if (type === "profile") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profile_picture: [response.data.file_data[0]],
        }));
      } else if (type === "idProof") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          identity_Proof: [response.data.file_data[0]],
        }));
      } else if (type === "document") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          other_document: [response.data.file_data[0]],
        }));
      }
    } catch (error) {
      console.error("Error uploading the image", error);
    }
  };

  const removeImage = (type) => {
    if (type === "profile") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        profile_picture: [],
      }));
    } else if (type === "idProof") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        identity_Proof: [],
      }));
    } else if (type === "document") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        other_document: [],
      }));
    }
  };

  const getCoachData = async () => {
    try {
      const response = await axios.get(`${API_URL}/PersonalTraining/fetch/${UpdatepersonalTrainerID._id}`);
      console.log(response.data.personalTrainer, "response of api");
      setFormData({
        full_name:
          response.data.personalTrainer.full_name ||
          `${response.data.personalTrainer.first_name || ""} ${
            response.data.personalTrainer.last_name || ""
          }`.trim(), // Use API data or empty string if not available
        venue_name: response.data.personalTrainer.venue_name ,
        date_of_birth: response.data.personalTrainer.date_of_birth || "",
        gender: response.data.personalTrainer.gender || "",
        trainer_type: response.data.personalTrainer.trainer_type || "",
        address: response.data.personalTrainer.address || "",
        city: response.data.personalTrainer.city || "",
        state: response.data.personalTrainer.state || "",
        zipcode: response.data.personalTrainer.zipcode || "",
        mobile: response.data.personalTrainer.mobile || "",
        other_mobile: response.data.personalTrainer.other_mobile || "",
        email: response.data.personalTrainer.email || "",
        bio: response.data.personalTrainer.bio || "",
        qualifications: response.data.personalTrainer.qualifications || "",
        price: response.data.personalTrainer.price || "",
        specializations: response.data.personalTrainer.specializations || "",
        experience: response.data.personalTrainer.experience || "",
        skills: response.data.personalTrainer.skills || "",
        policiesAndRules: response.data.personalTrainer.policiesAndRules || "",
        profile_picture: response.data.personalTrainer.profile_picture || [], // Ensure it's an array
        identity_Proof: response.data.personalTrainer.identity_Proof || [], // Ensure it's an array
        other_document: response.data.personalTrainer.other_document || [], // Ensure it's an array
        status: response.data.personalTrainer.status || "", // Default to an empty string if not available
      });
    } catch (error) {
      console.error("Error fetching PersonalTrainer data:", error);
    }
  };

  useEffect(() => {
    getCoachData();
  }, [UpdatepersonalTrainerID._id]);

  return (
    <>
      <h3 className="mb-4 title">Update Personal Trainer</h3>
      <Container>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col sm={4}>
              <Form.Group controlId="fullName">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={25}
                  placeholder="Enter full name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  isInvalid={!!errors.full_name}
                />
                {errors.full_name && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.full_name}
                  </div>
                )}
              </Form.Group>
            </Col>


            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Game type <span className="text-danger">*</span>
                </Form.Label>
                <Select
                  id="trainer_type"
                  maxLength={25}
                  options={options}
                  value={options.find(
                    (option) => option.value === formData.trainer_type
                  )}
                  onChange={handleSelectChange}
                  isInvalid={!!errors.trainer_type}
                  placeholder="Select Game Type"
                />
                {errors.trainer_type && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.trainer_type}
                  </div>
                )}
              </Form.Group>
            </Col>

            
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  type="text"
                  name="venue_name"
                  placeholder="Enter Venue"
                  value={formData.venue_name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Gender <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select" // This will render a dropdown
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>{" "}
                  {/* Default empty option */}
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
                {errors.gender && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.gender}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={8}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Enter Address"
                  name="address"
                  maxLength={50}
                  value={formData.address}
                  onChange={handleInputChange}
                  isInvalid={!!errors.address}
                />
                {errors.address && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.address}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  City <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  isInvalid={!!errors.city}
                />
                {errors.city && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.city}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  State <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter State"
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  isInvalid={!!errors.state}
                />
                {errors.state && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.state}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Pincode <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={6}
                  placeholder="Enter Pincode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    // Prevent non-numeric input
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  isInvalid={!!errors.zipcode}
                />
                {errors.zipcode && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.zipcode}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Contact no. <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile no."
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={true}
                  onKeyDown={(e) => {
                    // Prevent non-numeric input
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  isInvalid={!!errors.mobile}
                />
                {errors.mobile && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.mobile}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>Other Contact no. </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile no."
                  name="other_mobile"
                  maxLength={10}
                  value={formData.other_mobile}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    // Prevent non-numeric input
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  maxLength={50}
                  value={formData.email}
                  disabled={true}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                />
                {errors.email && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Date Of Birth<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  isInvalid={!!errors.date_of_birth}
                />
                {errors.date_of_birth && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.date_of_birth}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={8}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Bio / Description <span className="text-danger">*</span>
                </Form.Label>
                <ReactQuill
                  theme="snow"
                  style={{
                    height: "auto",
                    backgroundColor: "#ffffff",
                    borderColor: "#cccccc",
                  }}
                  value={formData.bio}
                  onChange={(content) => handleEditorChange(content, "bio")}
                  placeholder="Enter bio / description"
                  isInvalid={!!errors.bio}
                />
                {errors.bio && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.bio}
                  </div>
                )}
              </Form.Group>
            </Col>
            {/* <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="first_name"
                  value=""
                />
              </Form.Group>
            </Col> */}
          </Row>
          <Row className="mt-3">
            <Col sm={8}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Specializations <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Enter specializations"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  isInvalid={!!errors.specializations}
                />
                <Form.Text className="text-muted">
                  Separate each specialization with a comma - they are shown as tags on the website.
                </Form.Text>
                {errors.specializations && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.specializations}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Experience <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Experience (in years)"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  isInvalid={!!errors.experience}
                  onKeyDown={(e) => {
                    // Prevent non-numeric input
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.experience && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.experience}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>Additional Skills </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Enter additional skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Qualification <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter qualification"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  isInvalid={!!errors.qualifications}
                />
                {errors.qualifications && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.qualifications}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Price <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  isInvalid={!!errors.price}
                />
                {errors.price && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.price}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={12}>
              <Form.Group controlId="formFirstName">
                <Form.Label>
                  Policies And Rules <span className="text-danger">*</span>
                </Form.Label>
                <ReactQuill
                  theme="snow"
                  style={{
                    height: "auto",
                    backgroundColor: "#ffffff",
                    borderColor: "#cccccc",
                  }}
                  value={formData.policiesAndRules}
                  onChange={(content) =>
                    handleEditorChange(content, "policiesAndRules")
                  }
                  placeholder="Enter Policies And Rules"
                />
                {errors.policiesAndRules && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                      fontWeight: "400",
                    }}
                  >
                    {errors.policiesAndRules}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formProfileImage">
                <Form.Label>
                  Profile <span className="text-danger">*</span>
                </Form.Label>
                <div
                  style={{
                    border: errors?.profile_picture
                      ? "2px dashed red"
                      : "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Upload</h3>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="fileInput-profile"
                    onChange={(e) => handleUploadImage(e, "profile")}
                  />
                  <label
                    htmlFor="fileInput-profile"
                    style={{ cursor: "pointer" }}
                  >
                    <FiUpload
                      style={{
                        fontSize: "48px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </label>

                  {formData.profile_picture?.[0] && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${Image_URL}${formData.profile_picture?.[0]?.src}`}
                        alt={`Photo`}
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "5px",
                        }}
                      />
                      <button
                        onClick={() => removeImage("profile")}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "84px",
                          border: " 1px solid",
                          cursor: "pointer",
                          display: "flex",
                          padding: "2px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>

                {errors?.profile_picture && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors?.profile_picture}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formIdentityProof">
                <Form.Label>
                  Identity Proof <span className="text-danger">*</span>
                </Form.Label>
                <div
                  style={{
                    border: errors?.identity_Proof
                      ? "2px dashed red"
                      : "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Upload</h3>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="fileInput-idProof"
                    onChange={(e) => handleUploadImage(e, "idProof")}
                  />
                  <label
                    htmlFor="fileInput-idProof"
                    style={{ cursor: "pointer" }}
                  >
                    <FiUpload
                      style={{
                        fontSize: "48px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </label>

                  {formData.identity_Proof?.[0] && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${Image_URL}${formData.identity_Proof?.[0]?.src}`}
                        alt={`Photo`}
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "5px",
                        }}
                      />
                      <button
                        onClick={() => removeImage("idProof")}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "84px",
                          border: " 1px solid",
                          cursor: "pointer",
                          display: "flex",
                          padding: "2px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
                {errors?.identity_Proof && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors?.identity_Proof}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formDocument">
                <Form.Label>Other Document </Form.Label>
                <div
                  style={{
                    border:
                      // errors?.images
                      //   ?
                      //   "2px dashed red"
                      //   :
                      "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Upload</h3>

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="fileInput-document"
                    onChange={(e) => handleUploadImage(e, "document")}
                  />
                  <label
                    htmlFor="fileInput-document"
                    style={{ cursor: "pointer" }}
                  >
                    <FiUpload
                      style={{
                        fontSize: "48px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  {formData.other_document?.[0] && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${Image_URL}${formData.other_document?.[0]?.src}`}
                        alt={`Photo`}
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "5px",
                        }}
                      />
                      <button
                        onClick={() => removeImage("document")}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "84px",
                          border: " 1px solid",
                          cursor: "pointer",
                          display: "flex",
                          padding: "2px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Form.Group controlId="formCheckbox">
              <div className="checkbox-container">
                <Form.Check
                  type="checkbox"
                  id="statusCheckbox"
                  name="status"
                  aria-label="option 1"
                  className="checkbox-input"
                  checked={formData.status || false}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({ ...prevFormData, status: e.target.checked }))
                  }
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="SubmitButton"
          >
            Submit
          </button>

          <button type="button" className="CancelButton" onClick={()=>{navigate("/personal-training")}}>
            Cancel
          </button>
        </Form>
      </Container>
    </>
  );
};

export default UpdatepersonalTrainer;
