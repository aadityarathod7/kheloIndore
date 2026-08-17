import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
  StateSelect,
  CitySelect,
  LanguageSelect,
} from "react-country-state-city";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../utils/ApiUrl";
import { Image_URL } from "../utils/ApiUrl";
import "../Coaches.css";

const UpdateCoach = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    age: "",
    languages: [],
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
    package: { monthly: "", quarterly: "", yearly: "" },
    price: "",
    specializations: [],
    profile_picture: [],
    gallery: [],
    videos: [],
    bio: "",
    status: "",
    // ---- Extended profile fields ----
    coaching_levels: [],
    own_level: "",
    response_time: "",
    class_location: "",
    training_mode: "",
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
  const handleLevelToggle = (level) => {
    setInput((prev) => {
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
    setInput({
      ...input,
      social_media: {
        ...input.social_media,
        [name]: value,
      },
    });
  };
  const handleAvailabilityChange = (index, field, value) => {
    setInput((prev) => {
      const next = [...(prev.daily_availability || [])];
      if (!next[index]) next[index] = { day: DAY_OPTIONS[index] };
      next[index] = { ...next[index], [field]: value };
      return {
        ...prev,
        daily_availability: next,
      };
    });
  };

  const uploadCoachMedia = async (event, mediaType) => {
    const files = Array.from(event.target.files || []);
    const uploaded = [];
    for (const file of files) {
      if ((mediaType === "image" && !file.type.startsWith("image/")) || (mediaType === "video" && !file.type.startsWith("video/"))) continue;
      const uploadData = new FormData();
      uploadData.append("uploadFile", file);
      try {
        const response = await axios.post(`${API_URL}/upload-file?types=coach`, uploadData);
        if (response.data?.file_data?.[0]) uploaded.push(response.data.file_data[0]);
      } catch {
        Swal.fire("Upload failed", `Could not upload ${file.name}.`, "error");
      }
    }
    if (uploaded.length) {
      const field = mediaType === "image" ? "gallery" : "videos";
      setInput((current) => ({ ...current, [field]: [...(current[field] || []), ...uploaded] }));
    }
    event.target.value = "";
  };

  const [newFile, setNewFile] = useState({ new_images: [] });
  const [filePreview, setFilePreview] = useState();
  const [languages, setlanguages] = useState([]);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [loc, setNearbyLoc] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCountryid(101);
    fetchNearbyLocations();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchcoach = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetch-coach/${_id}`);
        const coach = response.data.coach;
        
        setInput({
          first_name: coach.first_name,
          last_name: coach.last_name,
          gender: coach.gender,
          age: coach.age,
          languages: Array.isArray(coach.languages) ? coach.languages : (coach.languages ? [coach.languages] : []),
          email: coach.email,
          mobile: coach.mobile,
          address: coach.location.address,
          city: coach.location.city,
          state: coach.location.state,
          zipcode: coach.location.zipcode,
          google_location: coach.location.google_location,
          near_by_location: coach.near_by_location,
          experience: coach.experience,
          availability: coach.availability,
          category: coach.category,
          package: coach.package || { monthly: "", quarterly: "", yearly: "" },
          price: coach.price,
          specializations: Array.isArray(coach.specializations)
            ? coach.specializations.join(", ")
            : coach.specializations || "",
          bio: coach.bio,
          profile_picture: coach.profile_picture,
          status: coach.status,
          coaching_levels: coach.coaching_levels || [],
          own_level: coach.own_level || "",
          response_time: coach.response_time || "",
          class_location: coach.class_location || "",
          training_mode: coach.training_mode || "",
          students_trained: coach.students_trained || 0,
          social_media: coach.social_media || {
            facebook: "",
            instagram: "",
            youtube: "",
            twitter: "",
            linkedin: "",
          },
          daily_availability: coach.daily_availability || [],
          gallery: coach.gallery || [],
          videos: coach.videos || coach.gallery_videos || [],
        });
        if (response.data.coach.profile_picture.length > 0) {
          const imageUrl = response.data.coach.profile_picture; 
          setFilePreview(imageUrl); 
        }
      } catch (error) {
        
      }
    };

    fetchcoach();
  }, []);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFile((prevState) => ({
      ...prevState,
      new_images: [...prevState.new_images, ...files],
    }));
  };

  const handlePreviousImages = (e) => {
    const files = Array.from(e.target.files);
    setNewFile((prevState) => ({
      ...prevState,
      profile_picture: [...prevState.profile_picture, ...files],
    }));
  };

  const handleRemovePreviousImages = (ele) => {
    setInput((prevState) => ({
      ...prevState,
      profile_picture: prevState.profile_picture.filter((_, i) => i !== ele),
    }));
  };

  const handleRemovePhoto = (index) => {
    setNewFile((prevState) => ({
      ...prevState,
      new_images: prevState.new_images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
    
  };

  const handleStateChange = (state) => {
    setInput({
      ...input,
      state: state,
    });
    
  };

  const handleCityChange = (city) => {
    setInput({
      ...input,
      city: city.name,
    });
    
  };

  const handleLanguageChange = (city) => {
    setInput({
      ...input,
      languages: languages.name,
    });
    
  };

  const handleCategoryChange = (selectedOption) => {
    setInput({ ...input, category: selectedOption.value });
  };

  const handlelocationChange = (selectedOption) => {
    setInput({ ...input, near_by_location: selectedOption.value });
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

  // const uploadImage = async (fileArray) => {
  //   try {
  //     // formData.append("uploadFile", image);
  //     const formData = new FormData();
  //     fileArray.forEach((newFile, index) => {
  //       formData.append("types", "coach");
  //       formData.append(`uploadFile`, newFile);
  //     });
  //     const response = await axios.post(`${API_URL}/upload-file`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     return null;
  //   }
  // };

  const handleCancel = () => {
    navigate("/coaches");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const uploadResponses = await uploadImage(newFile.new_images);
      // if (uploadResponses) {
        const formData = new FormData();
        // uploadResponses.data.file_data.map((ele) => {
        //   formData.append("profile_picture", ele);
        // });
        const response = await axios.put(
          `${API_URL}/update-coach-super-admin/${_id}`,
          input,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Your form data has been updated successfully.",
        }).then((result) => {
          navigate("/coaches");
        });
      // }
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update form. Please try again later.",
      });
    }
  };


  return (
    <>
      <h3 className="mb-4 title"> Coach</h3>
      <Container>
        <Form>
          <Row>
            <Col sm={3}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="first_name"
                  value={input.first_name}
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
                  value={input.last_name}
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
                  value={input.gender}
                  placeholder={`${input.gender || ""}`}
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
                  value={input.age}
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
                  value={input.email}
                  onChange={handleChange}
                  maxLength={50}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  name="mobile"
                  maxLength={10}
                  value={input.mobile}
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
                  value={input.availability}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="formSpecializations">
                <Form.Label>Specializations</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="e.g. Batting Technique, Fast Bowling, Fielding"
                  name="specializations"
                  value={input.specializations}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Separate each specialization with a comma - they are shown as tags on the website.
                </Form.Text>
              </Form.Group>
              <br></br>
            </Col>
          </Row>
          <Row>
            <Col sm={12} className="mb-3">
              <h6>Languages Known</h6>
              <div className="ki-selection-group">
                {["Hindi", "English", "Marathi"].map((language) => {
                  const active = (input.languages || []).includes(language);
                  return (
                    <div
                      key={language}
                      className={`ki-selection-chip ${active ? "active" : ""}`}
                      onClick={() => setInput((current) => ({
                        ...current,
                        languages: (current.languages || []).includes(language)
                          ? current.languages.filter((item) => item !== language)
                          : [...(current.languages || []), language],
                      }))}
                    >
                      {active && <span className="check-icon">✓</span>}
                      {language}
                    </div>
                  );
                })}
              </div>
            </Col>
            {/* <Col sm={3}>
              <h6>State</h6>
              <StateSelect
                countryid={countryid}
                value={input.location.state}
                autoComplete="off"
                onChange={(e) => {
                  setInput({
                    ...input, location: {
                      ...input.location,
                      state: e.name
                    }
                  });
                  setstateid(e.id);
                }}
                placeHolder="Select State"
              />
            </Col> */}
            {/* <Col sm={3}>
              <h6>City</h6>
              <CitySelect
                autoComplete="off"
                countryid={countryid}
                stateid={stateid}
                value={input.location.city}
                onChange={(e) => {
                  setInput({
                    ...input, location: {
                      ...input.location,
                      city: e.name
                    }
                  });
                }}
                placeHolder="Select City"
              />
            </Col> */}

            {/* <Col sm={3}>
              <Form.Group controlId="formZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter zip code"
                  name="zipcode"
                  value={input.location.zipcode}
                  onChange={(e) => {
                    setInput({
                      ...input, location: {
                        ...input.location,
                        zipcode: e.target.value
                      }
                    });
                  }}
                />
              </Form.Group><br></br>
            </Col> */}

            {/* <Col sm={3}>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  name="address"
                  value={input.location.address}
                  onChange={(e) => {
                    setInput({
                      ...input, location: {
                        ...input.location,
                        address: e.target.value
                      }
                    });
                  }}
                />
              </Form.Group>
            </Col> */}
            <Col sm={3}>
              <Form.Group controlId="formExperience">
                <Form.Label>Experience(in years)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter experience"
                  name="experience"
                  value={input.experience}
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
                  value={input.near_by_location}
                  options={loc.map((location) => ({
                    label: location.area_name,
                    value: location.area_name,
                  }))}
                  onChange={handlelocationChange}
                  placeholder={`${input.near_by_location || "Select Location"}`}
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
                  value={input.google_location}
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
                  value={input.category}
                  options={categories.map((category) => ({
                    label: category.category_name,
                    value: category.category_name,
                  }))}
                  onChange={handleCategoryChange}
                  placeholder={`${input.category || "Select category"}`}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formPackage">
                <Form.Label>Package</Form.Label>
                <Form.Control
                  as="select"
                  name="package"
                  value={input.package}
                  placeholder={input.package}
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
                  value={input.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="formAvailability">
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter availability"
                  name="availability"
                  value={input.availability}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formClassLocation">
                <Form.Label>Class Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. On-site / Online / Player's home"
                  name="class_location"
                  value={input.class_location || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group controlId="formTrainingMode">
                <Form.Label>Training Mode</Form.Label>
                <Form.Select name="training_mode" value={input.training_mode || ""} onChange={handleChange}>
                  <option value="">Select training mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={3}>
              <Form.Group controlId="formStudentsTrained">
                <Form.Label>Students Trained</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of students trained"
                  name="students_trained"
                  value={input.students_trained || 0}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
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
                        background: (input.coaching_levels || []).includes(level)
                          ? "#22C55E"
                          : "#F1F5F9",
                        color: (input.coaching_levels || []).includes(level)
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
            <Col sm={3}>
              <Form.Group controlId="formOwnLevel">
                <Form.Label>Your Own Level</Form.Label>
                <Form.Control
                  as="select"
                  name="own_level"
                  value={input.own_level || ""}
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
            <Col sm={3}>
              <Form.Group controlId="formResponseTime">
                <Form.Label>Response Time</Form.Label>
                <Form.Control
                  as="select"
                  name="response_time"
                  value={input.response_time || ""}
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
            <Col sm={3}>
              <Form.Group controlId="formBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter bio"
                  name="bio"
                  value={input.bio}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={12}><Form.Label className="fw-bold">Package Prices</Form.Label></Col>
            {[['monthly', 'Monthly'], ['quarterly', 'Quarterly'], ['yearly', 'Yearly']].map(([key, label]) => (
              <Col sm={3} key={key}>
                <Form.Group controlId={`package-${key}`}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder={`Enter ${label.toLowerCase()} price`}
                    value={input.package?.[key] || ""}
                    onChange={(event) => setInput((current) => ({ ...current, package: { ...(current.package || {}), [key]: event.target.value } }))}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
          <Row>
            <h5 className="mb-3 mt-3">Social Media Profiles</h5>
            {["facebook", "instagram", "youtube", "twitter", "linkedin"].map((platform) => (
              <Col sm={3} key={platform} className="mb-3">
                <Form.Group controlId={`formSocial${platform}`}>
                  <Form.Label style={{ textTransform: "capitalize" }}>{platform}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${platform} URL`}
                    name={platform}
                    value={input.social_media?.[platform] || ""}
                    onChange={handleSocialChange}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
          <Row className="mt-3">
            <Col sm={6} className="mb-3">
              <Form.Group controlId="coachGalleryUpload">
                <Form.Label>Training / Profile Images</Form.Label>
                <Form.Control type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => uploadCoachMedia(event, "image")} />
                <Form.Text className="text-muted">You can select multiple JPEG, PNG, or WebP images.</Form.Text>
              </Form.Group>
              {!!input.gallery?.length && <div className="small text-success mt-1">{input.gallery.length} image(s) added</div>}
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group controlId="coachVideoUpload">
                <Form.Label>Training Videos</Form.Label>
                <Form.Control type="file" accept="video/mp4,video/webm,video/quicktime" multiple onChange={(event) => uploadCoachMedia(event, "video")} />
                <Form.Text className="text-muted">You can select multiple training videos.</Form.Text>
              </Form.Group>
              {!!input.videos?.length && <div className="small text-success mt-1">{input.videos.length} video(s) added</div>}
            </Col>
          </Row>
          <Row>
            <h5 className="mb-3">Daily Availability Timings</h5>
            {DAY_OPTIONS.map((day, index) => {
              const item = (input.daily_availability || [])[index] || {};
              return (
                <Col sm={3} key={day} className="mb-3">
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
          <Row>
            {/* <Col sm={3}>
              <div className="mb-3">
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Profile Picture
                </h6>
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
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                    <button
                      className="btn3"
                      onClick={() =>
                        document.querySelector("input[type=file]").click()
                      }
                    >
                      {" "}
                      Or Click to Select{" "}
                    </button>
                  </div>
                  <div>
                    {filePreview && (
                      <div>
                        {filePreview.map((ele, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <img
                                src={`${Image_URL}${ele.src}`}
                                alt=""
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  margin: "5px",
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleRemovePreviousImages(index);
                                  setFilePreview(() =>
                                    filePreview.filter((ele2) => {
                                      return ele2 !== ele;
                                    })
                                  );
                                }}
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
                          );
                        })}
                      </div>
                    )}
                    {newFile.new_images.map((photo, index) => (
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
            </Col> */}

            <Form.Group controlId="formCheckbox">
              <div className="checkbox-container">
                <Form.Check
                  type="checkbox"
                  id="statusCheckbox"
                  name="status"
                  aria-label="option 1"
                  className="checkbox-input"
                  checked={input.status || false}
                  onChange={(e) =>
                    setInput({ ...input, status: e.target.checked })
                  }
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <button type="submit" className="SubmitButton" onClick={handleSubmit}>
            Update
          </button>

          <button type="cancel" className="CancelButton" onClick={handleCancel}>
            Cancel
          </button>
        </Form>
      </Container>
    </>
  );
};

export default UpdateCoach;
