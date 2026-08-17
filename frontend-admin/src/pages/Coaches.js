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

const Coaches = () => {
  const [formData, setFormData] = useState({
    full_name: "",
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
    categories: [],
    videos: [],
  });
  const navigate = useNavigate();

  

  const [errors, setErrors] = useState({});
  const coachId = useParams();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/fetch`);
      setCategories(response.data.categories || []);
    } catch (error) {
      
    }
  };

  

  const handleEditorChange = (content, name) => {
    setFormData(prevData => ({ ...prevData, [name]: content }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prevData => ({ ...prevData, [name]: checked }));

      setErrors({
        ...errors,
        [name]: checked ? "" : "This field is required", // Example validation message for a checkbox
      });
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handlePackageChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      package: { ...previous.package, [name]: value === "" ? "" : Number(value) },
    }));
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
    
    let validationErrors = {};
    

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
      validationErrors.qualifications = "Qualifications is required";
    }


    if (!formData.specializations.trim()) {
      validationErrors.specializations = "Specialization is required";
    }
    const experienceValue = String(formData.experience ?? "").trim();
    if (!experienceValue) {
      validationErrors.experience = "Experience is required";
    } else if (Number.isNaN(Number(experienceValue)) || Number(experienceValue) <= 0) {
      validationErrors.experience = "Experience must be a positive number";
    }    if (typeof formData.price === 'string' && !formData.price.trim()) {
      validationErrors.price = "Price is required";
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

    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    
    try {
      const response = await axios.put(
        `${API_URL}/update/coach/${coachId._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      Swal.fire({
        icon: "success",
        title: "Coach Updated!",
        text: "Coach updated successfully",
      });
      navigate(`/coaches/slots-add/${coachId._id}`);
    } catch (error) {
      
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
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      

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
          formDataUpload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (response.data && response.data.file_data && response.data.file_data[0]) {
          uploaded.push(response.data.file_data[0]);
        }
      } catch (error) {
        
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
      const response = await axios.get(`${API_URL}/fetch-coach/${coachId._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      
      setFormData({
        full_name:
          response.data.coach.full_name ||
          `${response.data.coach.first_name || ""} ${response.data.coach.last_name || ""
            }`.trim(), // Use API data or empty string if not available
        date_of_birth: response.data.coach.date_of_birth || "",
        gender: response.data.coach.gender || "",
        trainer_type: response.data.coach.trainer_type || "",
        address: response.data.coach.address || "",
        city: response.data.coach.city || "",
        state: response.data.coach.state || "",
        zipcode: response.data.coach.zipcode || "",
        mobile: response.data.coach.mobile || "",
        other_mobile: response.data.coach.other_mobile || "",
        email: response.data.coach.email || "",
        bio: response.data.coach.bio || "",
        qualifications: response.data.coach.qualifications || "",
        price: response.data.coach.price || "",
        specializations: response.data.coach.specializations || "",
        experience: response.data.coach.experience || "",
        skills: response.data.coach.skills || "",
        policiesAndRules: response.data.coach.policiesAndRules || "",
        profile_picture: response.data.coach.profile_picture || [], // Ensure it's an array
        identity_Proof: response.data.coach.identity_Proof || [], // Ensure it's an array
        other_document: response.data.coach.other_document || [], // Ensure it's an array
        categories: response.data.coach.categories || [],
        videos: response.data.coach.videos || [],
      });
    } catch (error) {
      
    }
  };

  useEffect(() => {
    getCoachData();
    fetchCategories();
  }, [coachId._id]);

  return (
    <>
      <h3 className="mb-4 title">Update Coach</h3>
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
                  placeholder="Full Name"
                  name="full_name"
                  maxLength={25}
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
                  placeholder="Enter Date of Birth"
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
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Languages Known</Form.Label>
                <div className="ki-selection-group">
                  {["Hindi", "English", "Marathi"].map((language) => {
                    const active = (formData.languages || []).includes(language);
                    return (
                      <div
                        key={language}
                        className={`ki-selection-chip ${active ? "active" : ""}`}
                        onClick={() => setFormData((previous) => ({
                          ...previous,
                          languages: (previous.languages || []).includes(language)
                            ? previous.languages.filter((item) => item !== language)
                            : [...(previous.languages || []), language],
                        }))}
                      >
                        {active && <span className="check-icon">✓</span>}
                        {language}
                      </div>
                    );
                  })}
                </div>
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>Class Location</Form.Label>
                <Form.Control name="class_location" placeholder="e.g. Vijay Nagar / Online" value={formData.class_location} onChange={handleInputChange} />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>Training Mode</Form.Label>
                <Form.Select name="training_mode" value={formData.training_mode} onChange={handleInputChange}>
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </Form.Select>
              </Form.Group>
            </Col>
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, experience: value });
                  }}
                  isInvalid={!!errors.experience}

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
          <Row className="mt-2">
            <Col sm={12}><h5 className="mb-3">Service Packages <small className="text-muted fw-normal">(optional)</small></h5></Col>
            {[["monthly", "Monthly package"], ["quarterly", "Quarterly package"], ["yearly", "Yearly package"]].map(([name, label]) => (
              <Col sm={4} key={name}>
                <Form.Group className="mb-3">
                  <Form.Label>{label} price (₹)</Form.Label>
                  <Form.Control type="number" min="0" name={name} placeholder="Enter package price" value={formData.package?.[name] ?? ""} onChange={handlePackageChange} />
                </Form.Group>
              </Col>
            ))}
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
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="SubmitButton"
          >
            Submit
          </button>

          <button type="button" className="CancelButton" onClick={() => { navigate("/coaches") }}>
            Cancel
          </button>
        </Form>
      </Container>
    </>
  );
};

export default Coaches;
