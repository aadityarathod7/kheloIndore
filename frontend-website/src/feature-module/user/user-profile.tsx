import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Select from "react-select";

interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  mobile: number;
  profile_image: any;
}

interface JwtPayload {
  userID: number;
}

const UserProfile = () => {
  const routes = all_routes;
  const [userDataId, setUserDataId] = useState<JwtPayload | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address: "",
    state: "",
    city: "",
    zipcode: "",
    user_info: "",
    profile_image: [],
  });


  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])


  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserDataId(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, []);

  useEffect(() => {
    const user_id: any = userDataId?.userID;
    setUserId(user_id);
  }, [userDataId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/user/fetch-user-by-id/${userId}`
        );
        console.log(response.data.data, "user dtaaa");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [userId, userDataId]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      Swal.fire(
        "No file selected",
        "Please select a file to upload.",
        "warning"
      );
      return;
    }

    // Validate file size (max 5MB)
    const MAX_SIZE_MB = 5;
    const maxSize = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire(
        "File Too Large",
        `File size exceeds ${MAX_SIZE_MB}MB limit. Please upload a smaller file.`,
        "error"
      );
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire(
        "Invalid File Type",
        "Please upload a JPG, PNG, or SVG file.",
        "error"
      );
      return;
    }

    // Display preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);

    // Prepare form data
    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      // Make the API request
      const response: any = await axios.post(
        ` ${API_URL}/upload-file?types=user`,
        formData
      );

      if (response.status === 200) {
        // const { data } = response;

        if (response.data.status) {
          console.log(response.data, "all response");
          setUploadedFileUrl(response.data.file_data);
          Swal.fire("Success", "File uploaded successfully!", "success");
        } else {
          Swal.fire("Upload Successful", "File uploaded successfully", "info");
        }
      } else {
        console.error("Unexpected response:", response);
        Swal.fire(
          "Unexpected Error",
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        Swal.fire(
          "Upload Error",
          `Error: ${error.response?.data?.message || "Something went wrong with the upload."}`,
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        Swal.fire(
          "Unexpected Error",
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSaveChange = async () => {
    const API_URL = `http://127.0.0.1:3037/api/user/profile-setting/${userId}`;

    const payload = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      mobile: userData.mobile,
      address: userData.address,
      state: userData.state,
      city: userData.city,
      zipcode: userData.zipcode,
      user_info: userData.user_info,
      profile_image: uploadedFileUrl,
    };

    try {
      setLoading(true);
      setError("");

      const response = await axios.put(API_URL, payload);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Profile updated successfully!",
        confirmButtonText: "OK",
      });

      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
        confirmButtonText: "OK",
      });

      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stateOptions = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Ladakh", label: "Ladakh" },
    { value: "Delhi", label: "Delhi" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Puducherry", label: "Puducherry" },
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
  ];

  const cityOption = [
    { value: "Aurangabad", label: "Aurangabad" },
    { value: "Jehanabad", label: "Jehanabad" },
    { value: "Kavali", label: "Kavali" },
    { value: "Tadepalligudem", label: "Tadepalligudem" },
    { value: "Amaravati", label: "Amaravati" },
    { value: "Buxar", label: "Buxar" },
    { value: "Kishanganj", label: "Kishanganj" },
    { value: "Karaikudi", label: "Karaikudi" },
    { value: "Suryapet", label: "Suryapet" },
    { value: "Jamalpur", label: "Jamalpur" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Chennai", label: "Chennai" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Surat", label: "Surat" },
    { value: "Pune", label: "Pune" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Indore", label: "Indore" },
    { value: "Thane", label: "Thane" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Visakhapatnam", label: "Visakhapatnam" },
    { value: "Pimpri-Chinchwad", label: "Pimpri-Chinchwad" },
    { value: "Patna", label: "Patna" },
    { value: "Vadodara", label: "Vadodara" },
    { value: "Ghaziabad", label: "Ghaziabad" },
    { value: "Ludhiana", label: "Ludhiana" },
    { value: "Agra", label: "Agra" },
    { value: "Nashik", label: "Nashik" },
    { value: "Faridabad", label: "Faridabad" },
    { value: "Meerut", label: "Meerut" },
    { value: "Rajkot", label: "Rajkot" },
    { value: "Kalyan-Dombivali", label: "Kalyan-Dombivali" },
    { value: "Vasai-Virar", label: "Vasai-Virar" },
    { value: "Varanasi", label: "Varanasi" },
    { value: "Srinagar", label: "Srinagar" },
    { value: "Dhanbad", label: "Dhanbad" },
    { value: "Amritsar", label: "Amritsar" },
    { value: "Navi Mumbai", label: "Navi Mumbai" },
    { value: "Prayagraj", label: "Prayagraj" },
    { value: "Howrah", label: "Howrah" },
    { value: "Ranchi", label: "Ranchi" },
    { value: "Jabalpur", label: "Jabalpur" },
    { value: "Gwalior", label: "Gwalior" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Vijayawada", label: "Vijayawada" },
    { value: "Jodhpur", label: "Jodhpur" },
    { value: "Madurai", label: "Madurai" },
    { value: "Raipur", label: "Raipur" },
    { value: "Kota", label: "Kota" },
    { value: "Guwahati", label: "Guwahati" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Solapur", label: "Solapur" },
    { value: "Hubballi-Dharwad", label: "Hubballi-Dharwad" },
    { value: "Tiruchirappalli", label: "Tiruchirappalli" },
    { value: "Tiruppur", label: "Tiruppur" },
    { value: "Moradabad", label: "Moradabad" },
    { value: "Mysore", label: "Mysore" },
    { value: "Bareilly", label: "Bareilly" },
    { value: "Gurgaon", label: "Gurgaon" },
    { value: "Aligarh", label: "Aligarh" },
    { value: "Jalandhar", label: "Jalandhar" },
    { value: "Bhubaneswar", label: "Bhubaneswar" },
    { value: "Salem", label: "Salem" },
    { value: "Mira-Bhayandar", label: "Mira-Bhayandar" },
    { value: "Warangal", label: "Warangal" },
    { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "Guntur", label: "Guntur" },
    { value: "Bhiwandi", label: "Bhiwandi" },
    { value: "Saharanpur", label: "Saharanpur" },
    { value: "Gorakhpur", label: "Gorakhpur" },
    { value: "Bikaner", label: "Bikaner" },
    { value: "Amravati", label: "Amravati" },
    { value: "Noida", label: "Noida" },
    { value: "Jamshedpur", label: "Jamshedpur" },
    { value: "Bhilai", label: "Bhilai" },
    { value: "Cuttack", label: "Cuttack" },
    { value: "Firozabad", label: "Firozabad" },
    { value: "Kochi", label: "Kochi" },
    { value: "Nellore", label: "Nellore" },
    { value: "Bhavnagar", label: "Bhavnagar" },
    { value: "Dehradun", label: "Dehradun" },
    { value: "Durgapur", label: "Durgapur" },
    { value: "Asansol", label: "Asansol" },
    { value: "Rourkela", label: "Rourkela" },
    { value: "Nanded", label: "Nanded" },
    { value: "Kolhapur", label: "Kolhapur" },
    { value: "Ajmer", label: "Ajmer" },
    { value: "Akola", label: "Akola" },
    { value: "Gulbarga", label: "Gulbarga" },
    { value: "Jamnagar", label: "Jamnagar" },
    { value: "Ujjain", label: "Ujjain" },
    { value: "Loni", label: "Loni" },
    { value: "Siliguri", label: "Siliguri" },
    { value: "Jhansi", label: "Jhansi" },
    { value: "Ulhasnagar", label: "Ulhasnagar" },
    { value: "Jammu", label: "Jammu" },
    { value: "Sangli-Miraj & Kupwad", label: "Sangli-Miraj & Kupwad" },
    { value: "Mangalore", label: "Mangalore" },
    { value: "Erode", label: "Erode" },
    { value: "Belgaum", label: "Belgaum" },
    { value: "Ambattur", label: "Ambattur" },
    { value: "Tirunelveli", label: "Tirunelveli" },
    { value: "Malegaon", label: "Malegaon" },
    { value: "Gaya", label: "Gaya" },
    { value: "Jalgaon", label: "Jalgaon" },
    { value: "Udaipur", label: "Udaipur" },
    { value: "Maheshtala", label: "Maheshtala" },
    { value: "Davanagere", label: "Davanagere" },
    { value: "Kozhikode", label: "Kozhikode" },
    { value: "Kurnool", label: "Kurnool" },
    { value: "Rajpur Sonarpur", label: "Rajpur Sonarpur" },
    { value: "Rajahmundry", label: "Rajahmundry" },
    { value: "Bardhaman", label: "Bardhaman" }
];


  const handleSelectChange = (selectedOption: any) => {
    setUserData((prevData: any) => ({
      ...prevData,
      state: selectedOption ? selectedOption.value : '',
    }));
  };
  const handleCitySelectChange = (selectedOption: any) => {
    setUserData((prevData: any) => ({
      ...prevData,
      city: selectedOption ? selectedOption.value : '',
    }));
  };

  return (
    <>
      <section className="breadcrumb breadcrumb-list mb-0 top-margin">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">User Profile</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>User Profile</li>
          </ul>
        </div>
      </section>

      <div className="dashboard-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-menu">
                <ul>
                  {/* <li>
                    <Link to={routes.userDashboard}>
                      <ImageWithBasePath
                        src="/assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to={routes.userBookings}>
                      <ImageWithBasePath
                        src="/assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>My Bookings</span>
                    </Link>
                  </li>

                  <li>
                    <Link to={routes.userProfile} className="active">
                      <ImageWithBasePath
                        src="/assets/img/icons/profile-icon.svg"
                        alt="Icon"
                      />
                      <span>Profile Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Dashboard Menu */}
      {/* Page Content */}
      <div className="content court-bg">
        <div className="container">
          {/* <div className="coach-court-list profile-court-list">
              <ul className="nav">
                <li>
                  <Link className="active" to={routes.userProfile}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={routes.userSettingPassword}>Change Password</Link>
                </li>
                <li>
                  <Link to={routes.userProfileOtherSetting}>
                    Other Settings
                  </Link>
                </li>
              </ul>
            </div> */}
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="card ">
                  <form>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="image-upload">
                          <h3>Upload Image</h3>
                          <div className="file-upload">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.svg"
                              onChange={handleFileUpload}
                            />
                          </div>
                          {previewUrl ? (
                            <div className="preview">
                              <h4>Image Preview:</h4>
                              <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: "200px" }}
                              />
                            </div>
                          ) : userData.profile_image?.[0]?.src ? (
                            <div className="preview">
                              <h4>Image Preview:</h4>
                              <img
                                src={`${IMG_URL}${userData.profile_image?.[0]?.src}`}
                                alt="Preview"
                                style={{ maxWidth: "200px" }}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {/* First Name */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            placeholder="Enter Name"
                            value={userData.first_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            placeholder="Enter Name"
                            value={userData.last_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter Email Address"
                            value={userData.email}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            placeholder="Enter Phone Number"
                            value={userData.mobile}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12">
                        <div className="info-about">
                          <label htmlFor="comments" className="form-label">
                            Information about You
                          </label>
                          <textarea
                            className="form-control"
                            id="comments"
                            rows={3}
                            placeholder="About"
                            name="user_info"
                            value={userData.user_info}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="address-form-head">
                        <h4>Address</h4>
                      </div>

                      {/* Address */}
                      <div className="col-lg-12 col-md-12">
                        <div className="input-space">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Enter Your Address"
                            value={userData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* State */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">State</label>
                          <Select
                            options={stateOptions}
                            value={stateOptions.find(
                              (stateOptions) =>
                                stateOptions.value === userData.state
                            )}
                            onChange={handleSelectChange}
                            placeholder="Select State"
                            isSearchable={true}
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space">
                          <label className="form-label">City</label>
                          <Select
                            options={cityOption}
                            value={cityOption.find(
                              (cityOption) => cityOption.value === userData.city
                            )}
                            onChange={handleCitySelectChange}
                            placeholder="Select City"
                            isSearchable={true}
                          />
                        </div>
                        {/* <div className="input-space">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            placeholder="Enter City"
                            value={userData.city}
                            onChange={handleInputChange}
                          />
                        </div> */}
                      </div>

                      {/* Zipcode */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-space mb-0">
                          <label className="form-label">Zipcode</label>
                          <input
                            type="text"
                            className="form-control"
                            name="zipcode"
                            placeholder="Enter Zipcode"
                            value={userData.zipcode || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value) && value.length <= 6) {
                                handleInputChange(e);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="save-changes text-end">
                  <div>
                    <button
                      onClick={handleSaveChange}
                      className="btn btn-secondary save-profile"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
