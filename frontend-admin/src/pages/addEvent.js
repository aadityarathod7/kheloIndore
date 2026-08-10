import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Select from "react-select";
import { API_URL } from "../utils/ApiUrl";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    price: "",
    organized_by: "",
    terms_and_conditions: "",
    near_by_location: "",
    images: [],
    status: true,
  });

  
  const [errors, setErrors] = useState({});
  const [loc, setNearbyLoc] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNearbyLocations();
  }, []);

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

  const handlelocationChange = (selectedOption) => {
    setFormData({ ...formData, near_by_location: selectedOption.value });
  };

  const fetchNearbyLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/near-by/get`);
      
      setNearbyLoc(response.data.loc);
    } catch (error) {
      
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
     // Logging the selected files
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImage = async (fileArray) => {
    try {
      const formDataForUpload = new FormData();
      fileArray.forEach((file, index) => {
        formDataForUpload.append("types", "events-media");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.event_name.trim()) {
      validationErrors.event_name = "Event name is required";
    }
    if (!formData.start_date.trim()) {
      validationErrors.start_date = "Start date is required";
    }

    if (!formData.location.trim()) {
      validationErrors.start_date = "Location is required";
    }


    if (!formData.end_date.trim()) {
      validationErrors.end_date = "End date is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const uploadResponses = await uploadImage(formData.images);
      if (uploadResponses) {
        const images = uploadResponses.data.file_data;
        
        const response = await axios.post(
          `${API_URL}/event/create`,
          {
            ...formData,
            images,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Event added successfully",
        }).then(() => {
          navigate("/events");
        });
      }
    } catch (error) {
      
      const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to add event. Please try again later.";
      Swal.fire({
        
        icon: "error",
        title: "Error",
        text: errorMessage,

      });
    }



  };

  const handleCancel = () => {
    // Clear form data
    setFormData({
      event_name: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      images: [],
      status: true,
    });
    // Clear errors
    setErrors({});
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <>
      <h3 className="mb-4 title">Event</h3>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group controlId="formEventName">
                <Form.Label>
                  Event Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Event Name"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  isInvalid={!!errors.event_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.event_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                  <Form.Control.Feedback type="invalid">
                  {errors.event_name}
                </Form.Control.Feedback>
              </Form.Group>
              <br></br>
            </Col>
            <Col md={4}>
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
                    formData.near_by_location || "Select Location"
                  }`}
                />
              </Form.Group>
              <br></br>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group controlId="formOrganizedBy">
                <Form.Label> Organized By</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Organization Name"
                  name="organized_by"
                  value={formData.organized_by}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formStartDate">
                <Form.Label>
                  Start Date<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  isInvalid={!!errors.start_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formEndDate">
                <Form.Label>
                  End Date<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  isInvalid={!!errors.end_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
              <br></br>
            </Col>

            <Col md={4}>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <br></br>
            </Col>

            <Col md={4}>
              <Form.Group controlId="formTerm">
                <Form.Label>Terms and Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Terms and Conditions"
                  name="terms_and_conditions"
                  value={formData.terms_and_conditions}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formDescription">
                <Form.Label>
                  Description<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <div className="mb-3">
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Photo
                </h6>
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setFormData((prevState) => ({
                      ...prevState,
                      images: [
                        ...prevState.images,
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
                      ref={fileInputRef}
                    />
                    <button className="btn3" onClick={handleButtonClick}>
                      Or Click to Select
                    </button>
                  </div>
                  <div>
                    {formData.images.map((photo, index) => (
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

          {/* Buttons */}
          <Row style={{ marginTop: "20px", marginLeft: "0px" }}>
            <Col md={12}>
              <div className="ButtonsContainer d-flex justify-content-start">
                {" "}
                {/* Align buttons to the left */}
                <button type="submit" className="submit-button">
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

export default AddEvent;
