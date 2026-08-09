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
    // ---- Extended profile fields ----
    coaching_levels: [],
    own_level: "",
    response_time: "",
    class_location: "",
    students_trained: 0,
    social_media: {
      facebook: "",
      instagram: "",
      youtube: "",
      twitter: "",
      linkedin: "",
    },
    daily_availability: [],
    categories: [],
    videos: [],
  });

  const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
  const RESPONSE_TIME_OPTIONS = [
    "Within 1 hour",
    "Within 2 hours",
    "Within 6 hours",
    "Within 12 hours",
    "Within 24 hours",
    "Within 48 hours",
  ];
  const DAY_OPTIONS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/fetch`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleLevelToggle = (level) => {
    setFormData((prev) => {
      const current = prev.coaching_levels || [];
      return {
        ...prev,
        coaching_levels: current.includes(level)
          ? current.filter((l) => l !== level)
          : [...current, level],
      };
    });
  };
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      social_media: {
        ...formData.social_media,
        [name]: value,
      },
    });
  };
  const handleAvailabilityChange = (index, field, value) => {
    setFormData((prev) => {
      const next = [...(prev.daily_availability || [])];
      if (!next[index]) next[index] = { day: DAY_OPTIONS[index] };
      next[index] = { ...next[index], [field]: value };
      return {
        ...prev,
        daily_availability: next,
      };
    });
  };

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

  const handleUploadVideo = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];

    for (let file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append("uploadFile", file);

      try {
        const response = await axios.post(
          `${API_URL}/upload-file?types=coach`,
          formDataUpload
        );
        if (response.data && response.data.file_data && response.data.file_data[0]) {
          uploaded.push(response.data.file_data[0]);
        }
      } catch (error) {
        console.error("Error uploading the video", error);
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      videos: [...(prevFormData.videos || []), ...uploaded],
    }));
  };

  const handleRemoveVideo = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      videos: (prevFormData.videos || []).filter((_, i) => i !== index),
    }));
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
        coaching_levels: response.data.personalTrainer.coaching_levels || [],
        own_level: response.data.personalTrainer.own_level || "",
        response_time: response.data.personalTrainer.response_time || "",
        class_location: response.data.personalTrainer.class_location || "",
        students_trained: response.data.personalTrainer.students_trained || 0,
        social_media: response.data.personalTrainer.social_media || {
          facebook: "",
          instagram: "",
          youtube: "",
          twitter: "",
          linkedin: "",
        },
        daily_availability: response.data.personalTrainer.daily_availability || [],
        categories: response.data.personalTrainer.categories || [],
        videos: response.data.personalTrainer.videos || [],
      });
    } catch (error) {
      console.error("Error fetching PersonalTrainer data:", error);
    }
  };

  useEffect(() => {
    getCoachData();
    fetchCategories();
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
                  isMulti
                  id="categories"
                  options={categories.map(c => ({ value: c.category_name, label: c.category_name }))}
                  value={(formData.categories || []).map(cat => ({ value: cat, label: cat }))}
                  onChange={(selectedOptions) => {
                    const selectedVals = selectedOptions ? selectedOptions.map(o => o.value) : [];
                    setFormData({ ...formData, categories: selectedVals, trainer_type: selectedVals[0] || "" });
                    setErrors({ ...errors, trainer_type: "" });
                  }}
                  placeholder="Select Game Types"
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
            <Col sm={4}>
              <Form.Group controlId="formClassLocation">
                <Form.Label>Class Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. On-site / Online / Player's home"
                  name="class_location"
                  value={formData.class_location || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formStudentsTrained">
                <Form.Label>Students Trained</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of students trained"
                  name="students_trained"
                  value={formData.students_trained || 0}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={4}>
              <Form.Group controlId="formCoachingLevels">
                <Form.Label>Coaching Levels (who you coach)</Form.Label>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {LEVEL_OPTIONS.map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => handleLevelToggle(level)}
                      className="btn btn-sm"
                      style={{
                        borderRadius: "50px",
                        fontWeight: "600",
                        background: (formData.coaching_levels || []).includes(level)
                          ? "#22C55E"
                          : "#F1F5F9",
                        color: (formData.coaching_levels || []).includes(level)
                          ? "#FFFFFF"
                          : "#475569",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formOwnLevel">
                <Form.Label>Your Own Level</Form.Label>
                <Form.Control
                  as="select"
                  name="own_level"
                  value={formData.own_level || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Your Level</option>
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formResponseTime">
                <Form.Label>Response Time</Form.Label>
                <Form.Control
                  as="select"
                  name="response_time"
                  value={formData.response_time || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Response Time</option>
                  {RESPONSE_TIME_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <h5 className="mb-3">Social Media Profiles</h5>
            {["facebook", "instagram", "youtube", "twitter", "linkedin"].map((platform) => (
              <Col sm={4} key={platform} className="mb-3">
                <Form.Group controlId={`formSocial${platform}`}>
                  <Form.Label style={{ textTransform: "capitalize" }}>{platform}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${platform} URL`}
                    name={platform}
                    value={formData.social_media?.[platform] || ""}
                    onChange={handleSocialChange}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
          <Row className="mt-3">
            <h5 className="mb-3">Daily Availability Timings</h5>
            {DAY_OPTIONS.map((day, index) => {
              const item = (formData.daily_availability || [])[index] || {};
              return (
                <Col sm={4} key={day} className="mb-3">
                  <div
                    className="p-3 rounded-3"
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                  >
                    <Form.Label className="fw-bold">{day}</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="time"
                        value={item.startTime || ""}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "startTime", e.target.value)
                        }
                      />
                      <Form.Control
                        type="time"
                        value={item.endTime || ""}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "endTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </Col>
              );
            })}
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
            <Col sm={4}>
              <Form.Group controlId="formVideos">
                <Form.Label>Upload Video</Form.Label>
                <div
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Upload</h3>

                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    style={{ display: "none" }}
                    id="fileInput-video"
                    onChange={handleUploadVideo}
                  />
                  <label
                    htmlFor="fileInput-video"
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

                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {(formData.videos || []).map((vid, index) => (
                      <div key={index} style={{ position: "relative", margin: "5px" }}>
                        <video
                          src={`${Image_URL}${vid.src}`}
                          controls
                          style={{
                            width: "120px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FiX style={{ fontSize: "10px" }} />
                        </button>
                      </div>
                    ))}
                  </div>
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
