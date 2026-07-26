import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { API_URL } from "../utils/ApiUrl";
import { FiUpload, FiX } from "react-icons/fi";
import { Image_URL } from "../utils/ApiUrl";

const UpdateEvent = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

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
    status: false,
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [newFile, setNewFile] = useState({ new_images: [] });
  const [loc, setNearbyLoc] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchNearbyLocations();
  }, []);

  const handlelocationChange = (selectedOption) => {
    setFormData({ ...formData, near_by_location: selectedOption.value });
  };

  const fetchNearbyLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/near-by/get`);
      setNearbyLoc(response.data.loc);
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
    setFilePreview((prevState) => [
      ...prevState,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemovePreviousImages = (index) => {
    setPreviousImages((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
    setFilePreview((prevState) => prevState.filter((_, i) => i !== index));
  };

  const uploadImage = async (fileArray) => {
    try {
      const formDataForUpload = new FormData();
      fileArray.forEach((file) => {
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
      return response.data.filePaths;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/event/get/${_id}`)
      .then((res) => {
        const {
          event_name,
          description,
          start_date,
          end_date,
          location,
          price,
          organized_by,
          terms_and_conditions,
          near_by_location,
          status,
          images,
        } = res.data.data;
        const formattedStartDate = new Date(start_date)
          .toISOString()
          .split("T")[0];
        const formattedEndDate = new Date(end_date).toISOString().split("T")[0];
        setFormData({
          event_name,
          description,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          location,
          price,
          organized_by,
          terms_and_conditions,
          near_by_location,
          status,
          images: [],
        });
        setPreviousImages(images);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, [_id]);

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
    try {
      if (formData.images.length > 0) {
        const uploadedFilePaths = await uploadImage(formData.images);
        if (!uploadedFilePaths) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to upload images",
          });
          return;
        }
        formData.imagePaths = uploadedFilePaths;
      }
      formData.previousImages = previousImages; // Add previous images to formData
      const response = await axios.put(
        `${API_URL}/event/update/${_id}`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Event updated successfully",
      });
      navigate("/events");
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update event",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      event_name: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      status: false,
      images: [],
    });
    setErrors({});
  };

  return (
    <>
      <h3 className="mb-4 title">Update Event</h3>
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
                  placeholder="Enter Event Title"
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
              </Form.Group>
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
            </Col>

            <Col md={4}>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="num"
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
                <Form.Label>Description</Form.Label>
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
                      multiple
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
                    {previousImages && (
                      <div>
                        {previousImages.map((ele, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={`${Image_URL}${ele.src}`}
                              alt="Previous Image"
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "5px",
                              }}
                            />
                            <button
                              onClick={() => handleRemovePreviousImages(index)}
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
                    )}
                    {filePreview && (
                      <div>
                        {filePreview.map((ele, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={ele}
                              alt="Selected Photo"
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
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
              />
            </div>
            <Form.Label className="checkbox-label">Status</Form.Label>
          </Form.Group>

          {/* Buttons */}
          <Row style={{ marginTop: "20px", marginLeft: "0px" }}>
            <Col md={12}>
              <div className="ButtonsContainer d-flex justify-content-start">
                <button type="submit" className="submit-button btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-button btn btn-secondary"
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

export default UpdateEvent;
