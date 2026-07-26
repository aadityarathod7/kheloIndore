import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import "../../src/Venue.css";
import Swal from "sweetalert2";
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";
import { API_URL } from "../utils/ApiUrl";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiX } from "react-icons/fi";
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
import ErrorList from "antd/es/form/ErrorList";
const AddVenue = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);
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
    other_contact_number: "",
    price_per_hr: "",
    capacity: "",
    description: "",
    status: true,
    vendor_details: {},
    venue_owner_name: [],
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
    // { name: "Seating Lounge" },
    // { name: "Changing Room" },
    // { name: "Power Backup" },
    // { name: "Open 24x7" },
  ];

  const facilitiesOptions = [
    { name: "Parking" },
    { name: "Washrooms" },
    { name: "Food" },
    { name: "Lockers" },
  ];

  useEffect(() => {
    fetchCategories();
    setCountryid(101);
    fetchNearbyLocations();
    fetchVendor();
    venueOwnerDetails();
  }, []);


  const [categories, setCategories] = useState([]);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [loc, setNearbyLoc] = useState([]);
  const [vendors, setVendor] = useState([]);
  const [venueOwnerData, setVenueOwnerData] = useState([]);
  const fileInputRef = useRef(null);
  const adminRole = localStorage.getItem("role");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      images: "",
    }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  // const uploadImage = async (fileArray) => {
  //   try {
  //     const formDataForUpload = new FormData();
  //     fileArray.forEach((file, index) => {
  //       formDataForUpload.append("types", "venue");
  //       // formDataForUpload.append("uploadFile", file);
  //       formDataForUpload.append("uploadFile[]", file);
  //     });
  //     const response = await axios.post(
  //       `${API_URL}/upload-file`,
  //       formDataForUpload,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     return response;
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Please Enter Fields",
  //     });

  //     return null;
  //   }
  // };

  // const uploadImage = async (fileArray) => {
  //   try {
  //     const formDataForUpload = new FormData();
  //     fileArray.forEach((file) => {
  //       formDataForUpload.append("types", "venue");
  //       formDataForUpload.append("uploadFile", file);
  //     });

  //     const response = await axios.post(
  //       `${API_URL}/upload-file`,
  //       formDataForUpload,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.data.status) {
  //       return response.data.file_data.map((file) => ({
  //         src: file.src,
  //         fileName: file.fileName,
  //         orgname: file.orgname,
  //       }));
  //     } else {
  //       throw new Error("File upload failed");
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "File upload failed. Please try again.",
  //     });
  //     return [];
  //   }
  // };

  const uploadImage = async (fileArray) => {
    try {
      const formDataForUpload = new FormData();
      fileArray.forEach((file) => {
        formDataForUpload.append("uploadFile", file);
      });

      const response = await axios.post(
        `${API_URL}/upload-file?types=venue`,
        formDataForUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        return response.data.file_data.map((file) => ({
          src: file.src,
          fileName: file.fileName,
          orgname: file.orgname,
        }));
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File upload failed. Please try again.",
      });
      return [];
    }
  };

  const handleAmenitiesChange = (selectedList) => {
    setFormData({ ...formData, amenities: selectedList });
    setErrors((prevErrors) => ({
      ...prevErrors,
      amenitiesOptions: "",
    }));
  };
  const handleEditorChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlefacilitiesChange = (selectedList) => {
    setFormData({ ...formData, facilities: selectedList });
    setErrors((prevErrors) => ({
      ...prevErrors,
      facilitiesOptions: "",
    }));
  };

  // const handleCategoryChange = (selectedOption) => {
  //   setFormData({ ...formData, category: selectedOption.value });
  // };

  const handlelocationChange = (selectedOption) => {
    setFormData({ ...formData, near_by_location: selectedOption.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      near_by_location: "",
    }));
  };

  const handleVendorChange = (selectedOption) => {
    setFormData({ ...formData, vendor_type: selectedOption.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      vendor_type: "",
    }));
  };

  const handleCancel = () => {
    navigate("/venues");
  };
  const venueOwnerDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/get/venue/role/list`);
      setVenueOwnerData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleVenueOwnerChange = (selectedOption) => {
    setFormData({
      ...formData,
      vendor_id: selectedOption ? selectedOption.value : "",
    });
    setSelectedOwner(selectedOption);
    setErrors((prevErrors) => ({
      ...prevErrors,
      vendor_id: "",
    }));
  };

  const venueOwnerOptions = venueOwnerData.map((owner) => ({
    value: owner._id,
    label: owner.first_name && owner.last_name ? `${owner.first_name} ${owner.last_name}` : owner.first_name,
  }));


  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchNearbyLocations = async () => {
    try {
      const response = await axios.get(`${API_URL}/near-by/get`);
      setNearbyLoc(response.data.loc);
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${API_URL}/vendor/get`);
      setVendor(response.data.vendors);
    } catch (error) {
      console.error("Error fetching vendor type:", error);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   //Update Category field
  //   if (name === "category") {
  //     setFormData({
  //       ...formData,
  //       category: value,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };
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

  // const handleStateChange = (e) => {
  //   setFormData({ ...formData, state: e.name });
  //   setstateid(e.id);

  //   // Clear the error for the state field
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     state: "",
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.contact_number.trim()) {
      validationErrors.contact_number = "Contact Number is required";
    }
    if (!formData.capacity.trim()) {
      validationErrors.capacity = "Number of people is required";
    }
    if (!formData.name.trim()) {
      validationErrors.name = " Venue Name is required";
    }
    if (!formData.gameType.trim()) {
      validationErrors.gameType = " Game Type is required";
    }
    if (!formData.address.trim()) {
      validationErrors.address = " Address is required";
    }
    if (!formData.zipcode.trim()) {
      validationErrors.zipcode = " Zipcode is required";
    }
    if (!formData.state.trim()) {
      validationErrors.state = " State is required";
    }
    if (!formData.policiesAndRules.trim()) {
      validationErrors.policiesAndRules = " Policies And Rules are required";
    }
    if (!formData.city.trim()) {
      validationErrors.city = " City is required";
    }
    if (!formData.description.trim()) {
      validationErrors.description = " Description is required";
    }
    if (!formData.emailId.trim()) {
      validationErrors.emailId = "Email ID is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.emailId)) {
      validationErrors.emailId = "Please enter a valid email address";
    }
    if (adminRole === "Super Admin") {
      if (!formData.vendor_id.trim()) {
        validationErrors.vendor_id = "Venue Owner is required";
      }
    }

    if (formData.vendor_type === "Cricket Turf") {
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.height_in_feet.trim()) {
        validationErrors.height_in_feet = "Height is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface Type are required";
      }
    }

    if (formData.vendor_type === "Basketball") {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of Courts is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.height_in_feet.trim()) {
        validationErrors.height_in_feet = "Height is required";
      }
      if (!formData.vendor_details.court_size.trim()) {
        validationErrors.court_size = "Court Size are required";
      }
    }

    if (formData.vendor_type === "Archery") {
      if (!formData.vendor_details.number_of_ranges.trim()) {
        validationErrors.number_of_ranges = "Number of Ranges is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total Area is required";
      }
      if (!formData.vendor_details.target_distance.trim()) {
        validationErrors.target_distance = "Target Distance is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface Type is required";
      }
      if (!formData.vendor_details.safety_equipment.trim()) {
        validationErrors.safety_equipment = "Safety equipment is required";
      }
      if (!formData.vendor_details.instruction.trim()) {
        validationErrors.instruction = "Instruction is required";
      }
    }

    if (formData.vendor_type === "Badminton") {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of courts is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }

      if (!formData.vendor_details.court_size.trim()) {
        validationErrors.court_size = "Court Size is required";
      }
    }

    if (formData.vendor_type === "Baseball") {
      if (!formData.vendor_details.number_of_fields.trim()) {
        validationErrors.number_of_fields = "Number of fields is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
      if (!formData.vendor_details.field_dimensions.trim()) {
        validationErrors.field_dimensions = "Field dimensions is required";
      }

      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type is required";
      }
    }
    if (formData.vendor_type === "Golf Club") {
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
    }

    // if (formData.vendor_type === "Gym") {
    //   if (!formData.vendor_details.number_of_trainers.trim()) {
    //     validationErrors.number_of_trainers = "Number of trainers is required";
    //   }
    //   if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
    //     validationErrors.total_area_in_sq_feet = "Total area is required";
    //   }
    //   if (!formData.vendor_details.price_per_month.trim()) {
    //     validationErrors.price_per_month = "Price per month is required";
    //   }
    //   if (!formData.vendor_details.price_per_quarter.trim()) {
    //     validationErrors.price_per_quarter = "Price per quarter is required";
    //   }
    //   if (!formData.vendor_details.price_per_year.trim()) {
    //     validationErrors.price_per_year = "Price per year is required";
    //   }

    //   if (!formData.vendor_details.female_timing.trim()) {
    //     validationErrors.female_timing = "Female timing is required";
    //   }
    //   if (!formData.vendor_details.male_timing.trim()) {
    //     validationErrors.male_timing = "Male timing is required";
    //   }
    // }

    if (
      formData.vendor_type === "Hockey" ||
      formData.vendor_type === "Hockey(Outdoor)"
    ) {
      const { vendor_details } = formData;
      if (!formData.vendor_details.number_of_rinks.trim()) {
        validationErrors.number_of_rinks = "Number of rinks is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
      if (!formData.vendor_details.rink_dimensions.trim()) {
        validationErrors.rink_dimensions = "Rink dimensions is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type is required";
      }
      if (!formData.vendor_details.skate_rentals.trim()) {
        validationErrors.skate_rentals = "Skate rentals is required";
      }
      if (!formData.vendor_details.equipment_rentals.trim()) {
        validationErrors.equipment_rentals = "Equipment rentals is required";
      }
      if (!formData.vendor_details.lockers.trim()) {
        validationErrors.lockers = "Lockers is required";
      }
    }



    if (formData.vendor_type === "Kabaddi") {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of Courts is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.court_size.trim()) {
        validationErrors.court_size = "Court size is required";
      }
    }
    if (formData.vendor_type === "Playstation") {
      if (!formData.vendor_details.game_types.trim()) {
        validationErrors.game_types = "Game type is required";
      }
      if (!formData.vendor_details.features.trim()) {
        validationErrors.features = "Features is required";
      }
    }

    if (formData.vendor_type === "Shooting") {
      if (!formData.vendor_details.number_of_ranges.trim()) {
        validationErrors.number_of_ranges = "Number of ranges is required";
      }
      if (!formData.vendor_details.target_distance.trim()) {
        validationErrors.target_distance = "Target distance is required";
      }
      if (!formData.vendor_details.caliber_restrictions.trim()) {
        validationErrors.caliber_restrictions =
          "Caliber restrictions is required";
      }

      if (!formData.vendor_details.safety_equipment.trim()) {
        validationErrors.safety_equipment = "Safety equipment is required";
      }
      if (!formData.vendor_details.instruction.trim()) {
        validationErrors.instruction = "Instruction is required";
      }
      if (!formData.vendor_details.ammunition.trim()) {
        validationErrors.ammunition = "Ammunition is required";
      }
    }

    if (
      formData.vendor_type === "Skating" ||
      formData.vendor_type === "Skating(Ice)"
    ) {
      const { vendor_details } = formData;
      if (!formData.vendor_details.number_of_rinks.trim()) {
        validationErrors.number_of_rinks = "Number of rinks is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }

      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type is required";
      }
      if (!formData.vendor_details.skate_rentals.trim()) {
        validationErrors.skate_rentals = "Skate rentals is required";
      }

      if (!formData.vendor_details.lockers.trim()) {
        validationErrors.lockers = "Lockers is required";
      }
    }

    if (formData.vendor_type === "Snooker") {
      if (!formData.vendor_details.number_of_tables.trim()) {
        validationErrors.number_of_tables = "Number of tables is required";
      }
      if (!formData.vendor_details.table_type.trim()) {
        validationErrors.table_type = "Table type is required";
      }
      if (!formData.vendor_details.table_length_in_feet.trim()) {
        validationErrors.table_length_in_feet = "Table length is required";
      }

      if (!formData.vendor_details.table_width_in_feet.trim()) {
        validationErrors.table_width_in_feet = "Table width is required";
      }
      if (!formData.vendor_details.price_per_month.trim()) {
        validationErrors.price_per_month = "Price per month is required";
      }
    }
    if (formData.vendor_type === "Soccer") {
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }

      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface Type is required";
      }
    }

    if (formData.vendor_type === "Squash") {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of Courts is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type are required";
      }
      if (!formData.vendor_details.racket_rentals.trim()) {
        validationErrors.racket_rentals = "Racket rentals are required";
      }
      if (!formData.vendor_details.ball_rentals.trim()) {
        validationErrors.ball_rentals = "Ball rentals are required";
      }
      if (!formData.vendor_details.eye_protection.trim()) {
        validationErrors.eye_protection = "Eye protection are required";
      }
    }

    if (formData.vendor_type === "Swimming Pool") {
      if (!formData.vendor_details.number_of_pools.trim()) {
        validationErrors.number_of_pools = "Number of pools is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total area is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.depth_in_feet.trim()) {
        validationErrors.depth_in_feet = "Depth is required";
      }
      if (!formData.vendor_details.age_restrictions.trim()) {
        validationErrors.age_restrictions = "Age restrictions are required";
      }
      if (!formData.vendor_details.female_timing.trim()) {
        validationErrors.female_timing = "Female timing is required";
      }
      if (!formData.vendor_details.male_timing.trim()) {
        validationErrors.male_timing = "Male timing is required";
      }
      if (!formData.vendor_details.water_quality.trim()) {
        validationErrors.water_quality = "Water quality is required";
      }
    }

    if (formData.vendor_type === "Tennis") {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of Courts is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type are required";
      }
    }

    if (
      formData.vendor_type === "Volleyball(Indoor)" ||
      formData.vendor_type === "Volleyball(Beach)"
    ) {
      if (!formData.vendor_details.number_of_courts.trim()) {
        validationErrors.number_of_courts = "Number of Courts is required";
      }
      if (!formData.vendor_details.total_area_in_sq_feet.trim()) {
        validationErrors.total_area_in_sq_feet = "Total is required";
      }
      if (!formData.vendor_details.length_in_feet.trim()) {
        validationErrors.length_in_feet = "Length is required";
      }
      if (!formData.vendor_details.width_in_feet.trim()) {
        validationErrors.width_in_feet = "Width is required";
      }
      if (!formData.vendor_details.surface_type.trim()) {
        validationErrors.surface_type = "Surface type is required";
      }
      if (!formData.vendor_details.ball_rentals.trim()) {
        validationErrors.ball_rentals = "Ball rentals is required";
      }
      if (!formData.vendor_details.net_setup.trim()) {
        validationErrors.net_setup = "Net setup required";
      }
    }
    if (formData.vendor_type === "Yoga") {
      if (!formData.vendor_details.class_types.trim()) {
        validationErrors.class_types = "Class types is required";
      }
      if (!formData.vendor_details.class_focus.trim()) {
        validationErrors.class_focus = "Class focus is required";
      }
      if (!formData.vendor_details.virtual_class.trim()) {
        validationErrors.virtual_class = "Virtual class is required";
      }

    }

    if (formData.vendor_type === "Zumba Classes") {
      if (!formData.vendor_details.class_types.trim()) {
        validationErrors.class_types = "Class types is required";
      }
      if (!formData.vendor_details.class_focus.trim()) {
        validationErrors.class_focus = "Class focus is required";
      }
      if (!formData.vendor_details.virtual_class.trim()) {
        validationErrors.virtual_class = "Virtual class is required";
      }
      if (!formData.vendor_details.female_class_time.trim()) {
        validationErrors.female_class_time = "Female class time is required";
      }

    }

    if (!formData.vendor_type.trim()) {
      validationErrors.vendor_type = "Category is required";
    }
    if (!formData.near_by_location.trim()) {
      validationErrors.near_by_location = "Location is required";
    }

    if (!formData.amenities || formData.amenities.length === 0) {
      validationErrors.amenitiesOptions = "Please select at least one amenity";
    }
    if (!formData.facilities || formData.facilities.length === 0) {
      validationErrors.facilitiesOptions =
        "Please select at least one facility";
    }
    if (!formData.images || formData.images.length === 0) {
      validationErrors.images = "Please select at least one image";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const loadingSwal = Swal.fire({
      title: "Processing...",
      text: "Please wait while we are adding the venue...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Display the loading indicator
      },
    });

    try {
      const uploadResponses = await uploadImage(formData.images);
      if (uploadResponses) {
        const images = uploadResponses;
        const amenitiesArr = formData.amenities.map((data) => data.name);
        formData.amenities = amenitiesArr;
        const facilitiesArr = formData.facilities.map((data) => data.name);
        formData.facilities = facilitiesArr;
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Please log in again.",
          });
          return;
        }

        const response = await axios.post(
          `${API_URL}/venue/addVenue`,
          {
            ...formData,
            images,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );

        if (response.data) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Venue added successfully",
          });
          navigate(`/venues/add/slots/${response.data.venue._id}`);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error.response || error.message || error);
      console.log("Error:", error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message,
      });
    } finally {
      loadingSwal.close();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <>
      <h3>Venue</h3>
      <Container>
        <Form onSubmit={handleSubmit}>
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
                    isInvalid={!!errors.name}
                    value={formData.name}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
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
                  <Select
                    name="vendor_type"
                    value={formData.vendor}
                    options={vendors.map((vendor) => ({
                      label: vendor.vendor_type,
                      value: vendor.vendor_type,
                    }))}
                    onChange={handleVendorChange}
                    placeholder={`${formData.vendor || "Select Category Type"}`}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.vendor_type
                          ? "red"
                          : base.borderColor,
                        "&:hover": {
                          borderColor: errors.vendor_type
                            ? "red"
                            : base["&:hover"].borderColor,
                        },
                      }),
                    }}
                  />
                  {errors.vendor_type && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "0.875em",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.vendor_type}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                {adminRole === "Venue Admin" ? (
                  ""
                ) : (
                  <Form.Group controlId="formName" className="mb-2">
                    <Form.Label className="heading">
                      Venue Owner
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Select
                      options={venueOwnerOptions}
                      placeholder="Enter venue owner name"
                      name="vendor_id"
                      value={selectedOwner}
                      onChange={handleVenueOwnerChange}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.vendor_id
                            ? "red"
                            : base.borderColor,
                          "&:hover": {
                            borderColor: errors.vendor_id
                              ? "red"
                              : base["&:hover"].borderColor,
                          },
                        }),
                      }}
                    />
                    {errors.vendor_id && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "0.875em",
                          marginTop: "0.25rem",
                          fontWeight: "400",
                        }}
                      >
                        {errors.vendor_id}
                      </div>
                    )}
                  </Form.Group>
                )}
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
                    maxLength={50}
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
                    isInvalid={!!errors.state}
                    value={formData.state}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
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
                    isInvalid={!!errors.city}
                    value={formData.city}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                    }}
                    onChange={handleChange}
                    className="add-venue-form-custom-class"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
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
                  <Form.Label className="heading">Additional Notes</Form.Label>
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
                  <Form.Label className="heading">Other Number</Form.Label>
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
                    maxLength={50}
                    value={formData.emailId}
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
                      selectedValues={formData.amenities}
                      onSelect={handleAmenitiesChange}
                      onRemove={handleAmenitiesChange}
                      placeholder="Select"
                      style={{
                        multiselectContainer: errors.amenitiesOptions
                          ? { border: "1px solid red" }
                          : {},
                      }}
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
                      selectedValues={formData.facilities}
                      onSelect={handlefacilitiesChange}
                      onRemove={handlefacilitiesChange}
                      placeholder="Select"
                      style={{
                        multiselectContainer: errors.facilitiesOptions
                          ? { border: "1px solid red" }
                          : {},
                      }}
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
                    Near By Location <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Select
                    name="near_by_location"
                    value={formData.near_by_location}
                    options={loc.map((location) => ({
                      label: location.area_name,
                      value: location.area_name,
                    }))}
                    onChange={handlelocationChange}
                    placeholder={`${formData.near_by_location || "Select Location"
                      }`}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.near_by_location
                          ? "red"
                          : base.borderColor,
                        "&:hover": {
                          borderColor: errors.near_by_location
                            ? "red"
                            : base["&:hover"].borderColor,
                        },
                      }),
                    }}
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
                <Form.Label
                  className="heading"
                  style={{ marginBottom: "15px" }}
                >
                  Upload Photo <span style={{ color: "red" }}>*</span>
                </Form.Label>
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
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      images: "",
                    }));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    border: errors.images
                      ? "2px dashed red"
                      : "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px" }}>Drag & Drop here</h3>
                  <div style={{ marginBottom: "10px" }}>
                    <FiUpload
                      style={{ fontSize: "48px", marginBottom: "10px", cursor: "pointer" }}
                      onClick={handleButtonClick}
                    />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                    {/* <button className="btn3" onClick={handleButtonClick}>
                      Select
                    </button> */}
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

                {errors.images && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "0.875em",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.images}
                  </div>
                )}
              </div>
            </Row>
            <Row>
              {formData.vendor_type === "Cricket Turf" ? (
                <Turf
                  errors={errors}
                  onChange={(turfData) => {
                    setFormData({ ...formData, vendor_details: turfData });
                  }}
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Basketball" ? (
                <Basketball
                  errors={errors}
                  onChange={(basketballData) =>
                    setFormData({ ...formData, vendor_details: basketballData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Archery" ? (
                <Archery
                  errors={errors}
                  onChange={(archeryData) =>
                    setFormData({ ...formData, vendor_details: archeryData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Badminton" ? (
                <Badminton
                  errors={errors}
                  onChange={(badmintonData) =>
                    setFormData({ ...formData, vendor_details: badmintonData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Baseball" ? (
                <Baseball
                  errors={errors}
                  onChange={(baseballData) =>
                    setFormData({ ...formData, vendor_details: baseballData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type == "Golf Club" ? (
                <Golf
                  errors={errors}
                  onChange={(golfData) =>
                    setFormData({ ...formData, vendor_details: golfData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Gym" ? (
                <Gym
                  errors={errors}
                  onChange={(gymData) =>
                    setFormData({ ...formData, vendor_details: gymData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Hockey" ||
                formData.vendor_type === "Hockey(Outdoor)" ? (
                <Hockey
                  errors={errors}
                  onChange={(hockeyData) =>
                    setFormData({ ...formData, vendor_details: hockeyData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Kabaddi" ? (
                <Kabaddi
                  errors={errors}
                  onChange={(kabaddiData) =>
                    setFormData({ ...formData, vendor_details: kabaddiData })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Playstation" ? (
                <Playstation
                  errors={errors}
                  onChange={(playstationData) =>
                    setFormData({
                      ...formData,
                      vendor_details: playstationData,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Shooting" ? (
                <Shooting
                  errors={errors}
                  onChange={(shootingData) =>
                    setFormData({
                      ...formData,
                      vendor_details: shootingData,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Skating" ||
                formData.vendor_type === "Skating(Ice)" ? (
                <Skating
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Snooker" ? (
                <Snooker
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Soccer" ? (
                <Soccer
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Squash" ? (
                <Squash
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Swimming Pool" ? (
                <Swimming
                  errors={errors} // Pass errors prop
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Tennis" ? (
                <Tennis
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Volleyball(Indoor)" ||
                formData.vendor_type === "Volleyball(Beach)" ? (
                <Volleyball
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Yoga" ? (
                <Yoga
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
                />
              ) : null}
            </Row>
            <Row>
              {formData.vendor_type === "Zumba Classes" ? (
                <Zumba
                  errors={errors}
                  onChange={(Data) =>
                    setFormData({
                      ...formData,
                      vendor_details: Data,
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <Row></Row>
          <button type="submit" onClick={handleSubmit} className="SubmitButton">
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

export default AddVenue;
