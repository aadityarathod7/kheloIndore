import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import "../../src/Venue.css";
import Swal from "sweetalert2";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";
import { API_URL } from "../utils/ApiUrl";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
import ReactQuill from "react-quill";
import { StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Archery from "../venueComponents/Archery";
import Badminton from "../venueComponents/Badminton";
import Baseball from "../venueComponents/Baseball";
import Basketball from "../venueComponents/Basketball";
import Golf from "../venueComponents/Golf";
import Gym from "../venueComponents/Gym";
import Hockey from "../venueComponents/Hockey";
import Kabaddi from "../venueComponents/Kabaddi";
import Playstation from "../venueComponents/PlayStation";
import Shooting from "../venueComponents/Shooting";
import Skating from "../venueComponents/Skating";
import Snooker from "../venueComponents/Snooker";
import Soccer from "../venueComponents/Soccer";
import Squash from "../venueComponents/Squash";
import Swimming from "../venueComponents/Swimming";
import Tennis from "../venueComponents/Tennis";
import Turf from "../venueComponents/Turf";
import Volleyball from "../venueComponents/Volleyball";
import Yoga from "../venueComponents/Yoga";
import Zumba from "../venueComponents/Zumba";
import { Percent } from "antd/es/progress/style";
const UpdateVenue = () => {
  const [formData, setFormData] = useState({
    vendor_type: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    images: [],
    amenities: [],
    near_by_location: "",
    google_location: "",
    contact_number: "",
    capacity: "",
    other_contact_number: "",
    price_per_hr: "",
    description: "",
    status: true,
    vendor_details: {},
    venue_owner_name: "",
    vendor_id: "",
    facilities: [],
    emailId: "",
    additionalNotes: "",
    gameType: "",
    policiesAndRules: "",
  });

  const amenitiesOptions = [
    { name: "Seating" },
    { name: "Lighting" },
    { name: "Sound system" },
    { name: "Equipment storage" },
    { name: "Air conditon" },
    { name: "Drinking Water" },
    { name: "First Aid" },
    { name: "Shower" },
    { name: "Waiting Lounge" },
    { name: "Wi-Fi" },
    { name: "CCTV" },
    { name: "Refreshments" },
    { name: "Changing Room" },
    { name: "Power Backup" },
    { name: "Open 24x7" },
  ];

  const facilitiesOptions = [
    { name: "Parking" },
    { name: "Washrooms" },
    { name: "Food" },
    { name: "Lockers" },
  ];

  const [categories, setCategories] = useState([]);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [zipcode, setzipcode] = useState("");
  const [files, setFiles] = useState([]);
  const [loc, setNearbyLoc] = useState([]);
  const [vendors, setVendor] = useState([]);
  const adminRole = localStorage.getItem("role");
  const { _id: updateVenueId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [newData, setNewData] = useState({});

  const fileInputRef = useRef(null);

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);

    // Upload files via API
    const uploadedFiles = await uploadImage(files);

    if (uploadedFiles && uploadedFiles.data && uploadedFiles.data.file_data) {
      const uploadedImages = uploadedFiles.data.file_data.map((file) => ({
        src: file.src,
        fileName: file.fileName,
        orgname: file.orgname,
      }));

      // Update state with newly uploaded images
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...uploadedImages],
      }));
    }
  };

  // Handle removing a photo
  const handleRemovePhoto = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  // Upload images via API
  const uploadImage = async (fileArray) => {
    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("uploadFile", file);
      });

      const response = await axios.post(
        `${API_URL}/upload-file?types=venue
 `,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.file_data, "response=-=-=-");
      return response;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  const handleAmenitiesChange = (selectedList) => {
    setFormData((prevData) => ({ ...prevData, amenities: selectedList }));
  };

  const handlelocationChange = (selectedOption) => {
    setFormData((prevData) => ({ ...prevData, near_by_location: selectedOption.value }));
  };

  const handleVendorChange = (selectedOption) => {
    setFormData((prevData) => ({ ...prevData, vendor_type: selectedOption.value }));
  };

  const handleEditorChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlefacilitiesChange = (selectedList) => {
    setFormData((prevData) => ({ ...prevData, facilities: selectedList }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      facilitiesOptions: "",
    }));
  };

  const handleCancel = () => {
    navigate("/venues");
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/fetch`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };



  async function fetchData() {
    try {
      const response = await fetch(
        `${API_URL}/venue/individual/${updateVenueId}`
      );
      const result = await response.json();
      const prev = result.venue;

      setNewData(result.venue)

      const transformedVendorDetails = prev?.data?.vendor_data?.reduce(
        (acc, item) => {
          acc[item.key] = item.value || "";
          return acc;
        },
        {}
      );

      console.log(transformedVendorDetails,"transformedVendorDetails")

      console.log(result?.venue, "all data in result")
      setFormData({
        name: result?.venue?.name,
        address: prev?.address,
        city: prev?.city,
        state: prev?.state,
        zipcode: prev?.zipcode,
        images: prev?.images,
        amenities: prev?.amenities,
        near_by_location: prev?.near_by_location,
        google_location: prev?.google_location,
        contact_number: prev?.contact_number,
        capacity: prev?.capacity,
        other_contact_number: prev?.other_contact_number,
        price_per_hr: prev?.price_per_hr,
        description: prev?.description,
        status: prev?.status !== undefined ? prev?.status : true,
        vendor_details: transformedVendorDetails,
        venue_owner_name: "",
        vendor_id: prev?.vendor_id,
        facilities: prev?.facilities,
        emailId: prev?.emailId,
        additionalNotes: prev?.additionalNotes,
        gameType: prev?.gameType,
        policiesAndRules: prev?.policiesAndRules,
        vendor_type: prev?.vendor_type,
      });
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
    // fetchCategories();
    setCountryid(101);
    // fetchNearbyLocations();
    // fetchVendor();
  }, []);


  console.log(formData, "ajksdfhlajksdfh")


  const fetchNearbyLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/near-by/get`);
      setNearbyLoc(response.data.loc);
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${API_URL}/vendor/get`);
      setVendor(response.data.vendors);
    } catch (error) {
      console.error("Error fetching vendor type:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData(prevFormData => ({
        ...prevFormData,
        category: value,
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/venue/edit/${updateVenueId}`,
        formData,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Venue updated successfully",
        });
        navigate("/venues");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add venue",
      });
    }
  };

  const getVenueOwner = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/fetch-user-by-id/${formData.vendor_id}`
      );
      const fullName = `${response?.data?.data?.first_name} ${response?.data?.data?.last_name}`;
      setFormData((prevData) => ({
        ...prevData,
        venue_owner_name: fullName,
      }));
    } catch (error) {
      console.error("Error fetching venue owner:", error);
    }
  };

  useEffect(() => {
    getVenueOwner();
  }, [formData.vendor_id]);

  console.log(formData, "formdata")

  const cleanedAmenities = formData?.amenities?.filter(item => item !== null) || [];
  const cleanedFacilities = formData?.facilities?.filter(item => item !== null) || [];

  return (
    <>
      <h3> Update Venue</h3>
      <Container>
        <Form>
          <Row>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formName" className="mb-2">
                  <Form.Label className="heading">
                    Venue Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Venue Name"
                    name="name"
                    maxLength={25}
                    isInvalid={!!errors.name}
                    value={formData.name}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z]/g, " ");
                    }}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formVendore" className="mb-2">
                  <Form.Label className="heading">
                    Category Type <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="vendor_type"
                    value={formData.vendor_type}
                    onChange={handleChange}
                    placeholder="Enter Category Type"
                    isInvalid={!!errors.vendor_type}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vendor_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formName" className="mb-2">
                  <Form.Label className="heading">
                    Venue Owner
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    placeholder="Enter venue owner ID"
                    isInvalid={!!errors.vendor_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vendor_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId="formAddress">
                  <Form.Label className="heading">
                    Address
                    <span style={{ color: "red" }}>*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Address"
                    name="address"
                    value={formData.address}
                    isInvalid={!!errors.address}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
              <Form.Group controlId="formState" className="mb-2">
                  <Form.Label className="heading">
                  State <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter State"
                    name="state"
                    maxLength={25}
                    isInvalid={!!errors.state}
                    value={formData.state}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z]/g, " ");
                    }}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group controlId="formCity" className="mb-2">
                  <Form.Label className="heading">
                  City <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City"
                    name="city"
                    maxLength={25}
                    isInvalid={!!errors.city}
                    value={formData.city}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z]/g, " ");
                    }}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* <Form.Group className="mb-2">
                  <Form.Label className="heading">
                    City <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div className="select-wrapper">
                    <div
                      className={`stdropdown-container ${errors.city ? "error" : ""
                        }`}
                    >
                      <CitySelect
                        countryid={countryid}
                        stateid={stateid}
                        value={formData.city}
                        onChange={(e) => {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            city: "",
                          }));
                          setFormData((prevData) => ({ ...prevData, city: e.name }));
                        }}
                        onFocus={() => {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            city: "",
                          }));
                        }}
                        placeHolder="Select City"
                      />
                    </div>

                    {errors.city && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "0.875em",
                          marginTop: "0.25rem",
                        }}
                      >
                        {errors.city}
                      </div>
                    )}
                  </div>
                </Form.Group> */}
              </Col>
              <Col md={4}>
                <Form.Group controlId="formLocation" className="mb-2">
                  <Form.Label className="heading">
                    Zipcode
                    <span style={{ color: "red" }}>*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    isInvalid={!!errors.zipcode}
                    className="add-venue-form-custom-class"
                    maxLength={6}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.zipcode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formDescription">
                  <Form.Label className="heading">
                    Description <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <ReactQuill
                    theme="snow"
                    style={{
                      height: "auto",
                      backgroundColor: "#ffffff",
                      borderColor: "#cccccc",
                    }}
                    value={formData.description}
                    onChange={(content) =>
                      handleEditorChange({
                        target: { name: "description", value: content },
                      })
                    }
                    placeholder="Enter description here"
                  />
                  {errors.description && (
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ display: "block" }}
                    >
                      {errors.description}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formDescription">
                  <Form.Label className="heading">
                    Additional Notes
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Additional Notes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    isInvalid={!!errors.additionalNotes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.additionalNotes}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group
                  controlId="formSnookerContactNumber"
                  className="mb-2"
                >
                  <Form.Label className="heading">
                    Contact Number <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Contact Number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    isInvalid={!!errors.contact_number}
                    maxLength={10}
                    className="add-venue-form-custom-class"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group
                  controlId="formSnookerContactNumber"
                  className="mb-2"
                >
                  <Form.Label className="heading">
                    Other Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Contact Number"
                    name="other_contact_number"
                    value={formData.other_contact_number}
                    onChange={handleChange}
                    isInvalid={!!errors.other_contact_number}
                    maxLength={10}
                    className="add-venue-form-custom-class"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.other_contact_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formSnookerEmail" className="mb-2">
                  <Form.Label className="heading">
                    Email Address <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email Address"
                    name="emailId"
                    value={formData.emailId}
                    maxLength={50}
                    onChange={handleChange}
                    isInvalid={!!errors.emailId}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.emailId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formTimings" className="mb-2">
                  <Form.Label className="heading">
                    Amenities
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div className="select-wrapper">
                    <Multiselect
                      options={amenitiesOptions}
                      displayValue="name"
                      selectedValues={cleanedAmenities.length > 0 ? cleanedAmenities : []}
                      onSelect={handleAmenitiesChange}
                      onRemove={handleAmenitiesChange}
                      placeholder={
                        formData.amenities.length > 0
                          ? formData.amenities.join(", ")
                          : "Select Amenities"
                      }
                    />

                    {errors.amenitiesOptions && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "0.875em",
                          marginTop: "0.25rem",
                          fontWeight: "400",
                        }}
                      >
                        {errors.amenitiesOptions}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group controlId="formTimings" className="mb-2">
                  <Form.Label className="heading">
                    Facilities
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <div className="select-wrapper">
                    <Multiselect
                      options={facilitiesOptions}
                      displayValue="name"
                      selectedValues={cleanedFacilities.length > 0 ? cleanedFacilities : []}
                      onSelect={handlefacilitiesChange}
                      onRemove={handlefacilitiesChange}
                      placeholder={
                        formData.facilities.length > 0
                          ? formData.facilities.join(", ")
                          : "Select facilities"
                      }
                    />
                    {errors.facilitiesOptions && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "0.875em",
                          marginTop: "0.25rem",
                          fontWeight: "400",
                        }}
                      >
                        {errors.facilitiesOptions}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  controlId="formSnookerContactNumber"
                  className="mb-2"
                >
                  <Form.Label className="heading">
                    Number of People <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Number of People"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    isInvalid={!!errors.capacity}
                    maxLength={10}
                    className="add-venue-form-custom-class"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formName" className="mb-2">
                  <Form.Label className="heading">
                    Game Type
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Game Type"
                    name="gameType"
                    isInvalid={!!errors.gameType}
                    value={formData.gameType}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.gameType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formName" className="mb-2">
                  <Form.Label className="heading">
                    Google Location
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Google Location"
                    name="google_location"
                    isInvalid={!!errors.google_location}
                    value={formData.google_location}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.google_location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <Form.Group controlId="formDescription">
                  <Form.Label className="heading">
                    Policies And Rules<span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <ReactQuill
                    theme="snow"
                    style={{
                      height: "auto",
                      backgroundColor: "#ffffff",
                      borderColor: "#cccccc",
                    }}
                    placeholder="Enter Policies And Rules"
                    value={formData.policiesAndRules}
                    onChange={(content) =>
                      handleChange({
                        target: { name: "policiesAndRules", value: content },
                      })
                    }
                  />
                  {errors.policiesAndRules && (
                    <div
                      className="invalid-feedback"
                      style={{ display: "block" }}
                    >
                      {errors.policiesAndRules}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formLocation" className="mb-2">
                  <Form.Label className="heading">
                    Near By Location<span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Location"
                    name="near_by_location"
                    maxLength={25}
                    isInvalid={!!errors.near_by_location}
                    value={formData.near_by_location}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z ]/g, " ");
                    }}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  {errors.near_by_location && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "0.875em",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.near_by_location}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <div className="mb-3">
                <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Photo
                </h6>
                <div
                  onDrop={async (e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(
                      (file) => file.type.startsWith("image/")
                    );

                    // Upload dropped files
                    const uploadedFiles = await uploadImage(files);

                    if (uploadedFiles && uploadedFiles.data) {
                      const uploadedImages = uploadedFiles.data.map((file) => ({
                        src: file.url, // Assuming API returns `url`
                      }));

                      setFormData((prevState) => ({
                        ...prevState,
                        images: [...prevState.images, ...uploadedImages],
                      }));
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
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
                      accept="image/*"
                      id="fileInput"
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="btn3"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Select
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
                          src={
                            photo.src
                              ? `http://127.0.0.1:3037${photo.src}`
                              : photo instanceof File
                                ? URL.createObjectURL(photo)
                                : photo
                          }
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginRight: "12px",
                          }}
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          type="button"
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
            </Row>
            <Row>
              {formData.vendor_type === "Cricket Turf" ? (
                <Turf
                  onChange={(turfData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: turfData,
                    }));
                  }}
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            {console.log(formData.vendor_details)}
            <Row>
              {formData.vendor_type === "Basketball" ? (
                <Basketball
                  onChange={(basketballData) =>
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: basketballData,
                    }))
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Archery" ? (
                <Archery
                  onChange={(archeryData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: archeryData,
                    }));
                  }

                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Badminton" ? (
                <Badminton
                  onChange={(badmintonData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: badmintonData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Baseball" ? (
                <Baseball
                  onChange={(baseballData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: baseballData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type == "Golf Club" ? (
                <Golf
                  onChange={(golfData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: golfData,
                    }));
                  }

                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Gym" ? (
                <Gym
                  onChange={(gymData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: gymData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Hockey" ||
                formData.vendor_type === "Hockey(Outdoor)" ? (
                <Hockey
                  onChange={(hockeyData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: hockeyData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Kabaddi" ? (
                <Kabaddi
                  onChange={(kabaddiData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: kabaddiData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Playstation" ? (
                <Playstation
                  onChange={(playstationData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: playstationData,
                    }));
                  }

                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Shooting" ? (
                <Shooting
                  onChange={(shootingData) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: shootingData,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Skating" ||
                formData.vendor_type === "Skating(Ice)" ? (
                <Skating
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Snooker" ? (
                <Snooker
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Soccer" ? (
                <Soccer
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Squash" ? (
                <Squash
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Swimming Pool" ? (
                <Swimming
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Tennis" ? (
                <Tennis
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Volleyball(Indoor)" ||
                formData.vendor_type === "Volleyball(Beach)" ? (
                <Volleyball
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Yoga" ? (
                <Yoga
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Zumba Classes" ? (
                <Zumba
                  onChange={(Data) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      vendor_details: Data,
                    }));
                  }
                  }
                  vendorDetails={formData.vendor_details}
                />
              ) : null}
            </Row>
            <Form.Group controlId="formCheckbox cursor-pointer">
              <div className="checkbox-container ">
                <Form.Check
                  type="checkbox"
                  id="statusCheckbox"
                  name="status"
                  aria-label="option 1"
                  className="checkbox-input"
                  checked={formData.status || false}
                  onChange={(e) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      status: e.target.checked,
                    }));
                  }
                  }
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <Row></Row>
          <button type="button" onClick={handleSubmit} className="SubmitButton">
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

export default UpdateVenue;
