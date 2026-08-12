import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  StateSelect,
  CitySelect,
  LanguageSelect,
} from "react-country-state-city";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";
import Select from "react-select";
import "../Coaches.css";

const AddPT = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    age: "",
    languages: "",
    email: "",
    mobile: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipcode: "",
      google_location: "",
    },
    near_by_location: "",
    experience: "",
    availability: "",
    category: "",
    package: "",
    price: "",
    specializations: [],
    profile_picture: [],
    gallery: [],
    bio: "",
    status: true,
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
  const [dailyAvailability, setDailyAvailability] = useState(
    DAY_OPTIONS.map((day) => ({ day, startTime: "", endTime: "" }))
  );
  const handleAvailabilityChange = (index, field, value) => {
    setDailyAvailability((prev) => {
      const next = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData((fd) => ({
        ...fd,
        daily_availability: next.filter(
          (item) => item.startTime && item.endTime
        ),
      }));
      return next;
    });
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

  useEffect(() => {
    setCountryid(101);
    fetchNearbyLocations();
    fetchCategories();
  }, []);

  const navigate = useNavigate();
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [languages, setlanguages] = useState(0);
  const [loc, setNearbyLoc] = useState([]);
  const [categories, setCategories] = useState([]);
  const fileInputRefProfile = useRef(null);
  const fileInputRefGallery = useRef(null);

  const handleChange = (e) => {
    if (e.name === "zipcode" || e.name === "address") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [e.name]: e,
        },
      });
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleStateChange = (state) => {
    setFormData({
      ...formData,
      state: state,
    });
  };

  const handleCityChange = (city) => {
    setFormData({
      ...formData,
      city: city.name,
    });
  };

  const handleLanguageChange = (city) => {
    setFormData({
      ...formData,
      languages: languages.name,
    });
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      profile_picture: [...prevState.profile_picture, ...files],
    }));
  };

  const handleFileInputChangeGallery = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      gallery: [...prevState.gallery, ...files],
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      profile_picture: prevState.profile_picture.filter((_, i) => i !== index),
    }));
  };

  const handleRemovePhotoGallery = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      gallery: prevState.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption.value });
  };

  const handlelocationChange = (selectedOption) => {
    setFormData({ ...formData, near_by_location: selectedOption.value });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/fetch`);
      setCategories(response.data.categories);
    } catch (error) {
      
    }
  };

  const fetchNearbyLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/near-by/get`);
      setNearbyLoc(response.data.loc);
    } catch (error) {
      
    }
  };

  const uploadImage = async (fileArray) => {
    try {
      const formDataForUpload = new FormData();
      fileArray.forEach((file, index) => {
        formDataForUpload.append("types", "personal-training");
        formDataForUpload.append("uploadFile", file);
      });
      const response = await axios.post(
        `${API_URL}/upload-file`,
        formDataForUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      
      return null;
    }
  };

  const handleButtonClickProfile = (e) => {
    e.preventDefault();
    fileInputRefProfile.current.click();
  };

  const handleButtonClickGallery = (e) => {
    e.preventDefault();
    fileInputRefGallery.current.click();
  };

  const handleCancel = () => {
    navigate("/personal-training");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadResponses = await uploadImage(formData.profile_picture);
      const uploadResponses_gallery = await uploadImage(formData.gallery);
      if (uploadResponses && uploadResponses_gallery) {
        const profile_picture = uploadResponses.data.file_data;
        const gallery = uploadResponses_gallery.data.file_data;
        const response = await axios.post(
          `${API_URL}/PersonalTraining/create`,
          {
            ...formData,
            profile_picture,
            gallery,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Personal trainer added successfully",
        }).then(() => {
          navigate("/personal-training");
        });
      }
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add personal trainer",
      });
    }
  };

  return (
    <>
      <h3 className="mb-4 title">Trainer</h3>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={3}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  maxLength={25}
                />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  maxLength={25}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={50}
                />
              </Form.Group>
              <br></br>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formAvailability">
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formSpecializations">
                <Form.Label>Specializations</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter specializations"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              <h6>Language</h6>
              <LanguageSelect
                autoComplete="off"
                value={formData.languages}
                onChange={(e) => {
                  setFormData({ ...formData, languages: e.name });
                  setlanguages(e.id);
                }}
                placeHolder="Select Language"
              />
            </Col>
            <Col sm={3}>
              <h6>State</h6>
              <StateSelect
                countryid={countryid}
                value={formData.location.state}
                autoComplete="off"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      state: e.name,
                    },
                  });
                  setstateid(e.id);
                }}
                placeHolder="Select State"
              />
            </Col>
            <Col sm={3}>
              <h6>City</h6>
              <CitySelect
                autoComplete="off"
                countryid={countryid}
                stateid={stateid}
                value={formData.location.city}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      city: e.name,
                    },
                  });
                }}
                placeHolder="Select City"
              />
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter zip code"
                  name="zipcode"
                  value={formData.location.zipcode}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        zipcode: e.target.value,
                      },
                    });
                  }}
                />
              </Form.Group>
              <br></br>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        address: e.target.value,
                      },
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="formExperience">
                <Form.Label>Experience (in years)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formLocation">
                <Form.Label className="heading">
                  Near By Location <span className="StarSymbol">*</span>
                </Form.Label>
                <Select
                  name="near_by_location"
                  value={formData.near_by_location}
                  options={loc.map((near_by_location) => ({
                    label: near_by_location.area_name,
                    value: near_by_location.area_name,
                  }))}
                  onChange={handlelocationChange}
                  placeholder={`${
                    formData.near_by_location || "Select Near Location"
                  }`}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formGoogle">
                <Form.Label>Google Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Google Location"
                  name="google_location"
                  value={formData.google_location}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formCategory">
                <Form.Label className="heading">
                  Category <span className="StarSymbol">*</span>
                </Form.Label>
                <Select
                  name="category"
                  value={formData.category}
                  options={categories.map((category) => ({
                    label: category.category_name,
                    value: category.category_name,
                  }))}
                  onChange={handleCategoryChange}
                  placeholder={`${formData.category || "Select category"}`}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formPackage">
                <Form.Label>Package</Form.Label>
                <Form.Control
                  as="select"
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                >
                  <option value="">Select Package</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="num"
                  placeholder="Enter price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Profile Picture
                </h6>
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setFormData((prevState) => ({
                      ...prevState,
                      profile_picture: [
                        ...prevState.profile_picture,
                        ...files.filter((file) =>
                          file.type.startsWith("image/")
                        ),
                      ],
                    }));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    width: "300px",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Drag & Drop here</h3>
                  <div style={{ marginBottom: "10px" }}>
                    <FiUpload
                      style={{ fontSize: "48px", marginBottom: "10px" }}
                    />
                    <input
                      type="file"
                      // multiple
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                      ref={fileInputRefProfile}
                    />
                    <button className="btn3" onClick={handleButtonClickProfile}>
                      Or Click to Select
                    </button>
                  </div>
                  <div>
                    {formData.profile_picture.map((photo, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "5px",
                          }}
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Gallery
                </h6>
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setFormData((prevState) => ({
                      ...prevState,
                      gallery: [
                        ...prevState.gallery,
                        ...files.filter((file) =>
                          file.type.startsWith("image/")
                        ),
                      ],
                    }));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    width: "300px",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Drag & Drop here</h3>
                  <div style={{ marginBottom: "10px" }}>
                    <FiUpload
                      style={{ fontSize: "48px", marginBottom: "10px" }}
                    />
                    <input
                      type="file"
                      // multiple
                      onChange={handleFileInputChangeGallery}
                      style={{ display: "none" }}
                      ref={fileInputRefGallery}
                    />
                    <button className="btn3" onClick={handleButtonClickGallery}>
                      Or Click to Select
                    </button>
                  </div>
                  <div>
                    {formData.gallery.map((photo, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "5px",
                          }}
                        />
                        <button
                          onClick={() => handleRemovePhotoGallery(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={4}>
              <Form.Group controlId="formBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Enter bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

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
                  value={formData.own_level}
                  onChange={handleChange}
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
                  value={formData.response_time}
                  onChange={handleChange}
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

            <Col sm={4}>
              <Form.Group controlId="formClassLocation">
                <Form.Label>Class Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. On-site / Online / Player's home"
                  name="class_location"
                  value={formData.class_location}
                  onChange={handleChange}
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
                  value={formData.students_trained}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Social Media Profiles */}
          <Row className="mt-4">
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

          {/* Daily Availability Timings */}
          <Row className="mt-4">
            <h5 className="mb-3">Daily Availability Timings</h5>
            {dailyAvailability.map((item, index) => (
              <Col sm={4} key={item.day} className="mb-3">
                <div
                  className="p-3 rounded-3"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <Form.Label className="fw-bold">{item.day}</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="time"
                      value={item.startTime}
                      onChange={(e) =>
                        handleAvailabilityChange(index, "startTime", e.target.value)
                      }
                    />
                    <Form.Control
                      type="time"
                      value={item.endTime}
                      onChange={(e) =>
                        handleAvailabilityChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row>
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
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <button type="submit" className="SubmitButton">
            Submit
          </button>
          <button type="cancel" className="CancelButton" onClick={handleCancel}>
            Cancel
          </button>
        </Form>
      </Container>
    </>
  );
};

export default AddPT;
