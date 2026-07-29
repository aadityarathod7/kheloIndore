import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
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
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstTime = location.state?.firstTime || localStorage.getItem("profileCompleted") === "false";
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
      if (!userId) return;
      try {
        const response = await axios.get(
          `${API_URL}/user/fetch-user-by-id/${userId}`
        );
        if (response.data?.data) {
          setUserData(response.data.data);
        }
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
      Swal.fire("No file selected", "Please select a file to upload.", "warning");
      return;
    }

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

    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire(
        "Invalid File Type",
        "Please upload a JPG, PNG, or SVG file.",
        "error"
      );
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("uploadFile", file);

    try {
      const response: any = await axios.post(
        `${API_URL}/upload-file?types=user`,
        formData
      );

      if (response.status === 200) {
        if (response.data.status) {
          setUploadedFileUrl(response.data.file_data);
          Swal.fire({
            icon: "success",
            title: "Photo Uploaded!",
            text: "Profile image uploaded successfully.",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire("Upload Successful", "File uploaded successfully", "info");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire(
          "Upload Error",
          `Error: ${error.response?.data?.message || "Something went wrong with the upload."}`,
          "error"
        );
      } else {
        Swal.fire("Unexpected Error", "An unexpected error occurred.", "error");
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSaveChange = async () => {
    if (!userData.first_name?.trim() || !userData.last_name?.trim() || !userData.email?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields Missing",
        text: "Please enter your First Name, Last Name, and Email to complete your profile.",
      });
      return;
    }

    const saveApiUrl = `${API_URL}/user/profile-setting/${userId}`;

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
      profile_image: uploadedFileUrl || userData.profile_image,
    };

    try {
      setLoading(true);
      setError("");

      await axios.put(saveApiUrl, payload);
      localStorage.setItem("profileCompleted", "true");
      window.dispatchEvent(new Event("userProfileUpdated"));

      Swal.fire({
        icon: "success",
        title: "Profile Saved!",
        text: "Your profile details have been updated successfully.",
        confirmButtonText: "Go to Home",
        confirmButtonColor: "#22C55E",
      }).then(() => {
        navigate("/");
      });
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
    { value: "Delhi", label: "Delhi" },
  ];

  const cityOption = [
    { value: "Indore", label: "Indore" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Gwalior", label: "Gwalior" },
    { value: "Jabalpur", label: "Jabalpur" },
    { value: "Ujjain", label: "Ujjain" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Chennai", label: "Chennai" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Pune", label: "Pune" },
    { value: "Jaipur", label: "Jaipur" },
  ];

  const handleSelectChange = (selectedOption: any) => {
    setUserData((prevData: any) => ({
      ...prevData,
      state: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleCitySelectChange = (selectedOption: any) => {
    setUserData((prevData: any) => ({
      ...prevData,
      city: selectedOption ? selectedOption.value : "",
    }));
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "8px",
      fontSize: "13px",
      paddingLeft: "24px",
      borderColor: state.isFocused ? "#22C55E" : "#E2E8F0",
      backgroundColor: "#FFFFFF",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(34, 197, 94, 0.12)" : "none",
      "&:hover": {
        borderColor: "#22C55E",
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#94A3B8",
      fontSize: "13px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#0F172A",
      fontSize: "13px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: "13px",
      backgroundColor: state.isSelected
        ? "#22C55E"
        : state.isFocused
        ? "rgba(34, 197, 94, 0.1)"
        : "#FFFFFF",
      color: state.isSelected ? "#FFFFFF" : "#0F172A",
      cursor: "pointer",
    }),
  };

  const avatarSrc = previewUrl || (userData.profile_image?.[0]?.src ? `${IMG_URL}${userData.profile_image?.[0]?.src}` : null);
  const initialLetter = userData.first_name ? userData.first_name[0].toUpperCase() : "U";

  return (
    <>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "175px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>USER DASHBOARD</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Profile <span style={{ color: "#22C55E", marginLeft: "12px" }}>Settings</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "20px", fontWeight: "500", maxWidth: "480px" }}>Manage your profile information, contact details & avatar</p>
              
              <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="fas fa-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="fas fa-chevron-right" style={{ fontSize: "10px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>Profile Settings</span>
                </div>

                <div className="d-inline-flex align-items-center gap-2 ms-sm-2">
                  <Link to={routes.userBookings} className="ki-tab-btn">
                    <i className="fas fa-calendar-alt me-2" />
                    <span>My Bookings</span>
                  </Link>
                  <Link to={routes.userProfile} className="ki-tab-btn active">
                    <i className="fas fa-user-edit me-2" />
                    <span>Profile Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFirstTime && (
        <div className="container mt-4">
          <div
            className="alert border-0 d-flex align-items-center p-4 rounded-4 shadow-sm"
            style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)", borderLeft: "5px solid #F59E0B" }}
            role="alert"
          >
            <div
              className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
              style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", color: "#D97706" }}
            >
              <i className="fas fa-user-clock fs-5" />
            </div>
            <div>
              <strong className="d-block mb-1" style={{ fontSize: "16px", color: "#92400E" }}>
                Complete Your Profile
              </strong>
              <span style={{ fontSize: "14px", color: "#B45309" }}>
                Please fill in your <strong>First Name</strong>, <strong>Last Name</strong>, and verify your <strong>Email Address</strong> to activate full access for venue and coach bookings.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="content court-bg py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="ki-profile-card">
                {/* Header Profile Photo Section */}
                <div className="pb-4 mb-4 border-bottom">
                  <div className="ki-section-title">
                    <div className="ki-section-icon">
                      <i className="fas fa-camera" />
                    </div>
                    Profile Photo
                  </div>

                  <div className="ki-avatar-section">
                    <div className="ki-avatar-box">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile" />
                      ) : (
                        <span>{initialLetter}</span>
                      )}
                      <div className="ki-avatar-badge">
                        <i className="fas fa-camera me-1" /> Edit
                      </div>
                    </div>

                    <div className="ki-upload-actions">
                      <div className="ki-upload-btn-wrapper mb-2">
                        <button
                          type="button"
                          className="btn btn-sm px-4 py-2 text-white font-weight-bold"
                          style={{
                            background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                            borderRadius: "50px",
                            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                            border: "none"
                          }}
                        >
                          <i className="fas fa-upload me-2" /> Upload New Photo
                        </button>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <small className="text-muted">
                        Allowed Formats: JPG, PNG, SVG (Max size: 5MB)
                      </small>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="pb-4 mb-4 border-bottom">
                  <div className="ki-section-title">
                    <div className="ki-section-icon">
                      <i className="fas fa-user-circle" />
                    </div>
                    Personal Information
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="ki-input-group">
                        <label className="ki-field-label">First Name *</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-user ki-input-icon" />
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            placeholder="Enter First Name"
                            value={userData.first_name || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="ki-input-group">
                        <label className="ki-field-label">Last Name *</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-user ki-input-icon" />
                          <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            placeholder="Enter Last Name"
                            value={userData.last_name || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="ki-input-group">
                        <label className="ki-field-label">Email Address *</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-envelope ki-input-icon" />
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter Email Address"
                            value={userData.email || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="ki-input-group">
                        <label className="ki-field-label">Phone Number *</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-phone-alt ki-input-icon" />
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            placeholder="Enter Phone Number"
                            value={userData.mobile || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="ki-input-group">
                        <label className="ki-field-label">About Yourself</label>
                        <div className="ki-input-wrapper">
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Tell us about your favorite sports, hobbies, or bio..."
                            name="user_info"
                            value={userData.user_info || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Address Section */}
                <div>
                  <div className="ki-section-title">
                    <div className="ki-section-icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    Address & Location
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <div className="ki-input-group">
                        <label className="ki-field-label">Street Address</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-home ki-input-icon" />
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="House No., Street Name, Area"
                            value={userData.address || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="ki-input-group">
                        <label className="ki-field-label">State</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-map-marked-alt ki-input-icon" />
                          <div style={{ width: "100%" }}>
                            <Select
                              options={stateOptions}
                              styles={customSelectStyles}
                              value={stateOptions.find((opt) => opt.value.toLowerCase() === String(userData.state || "").toLowerCase()) || (userData.state ? { value: userData.state, label: userData.state } : null)}
                              onChange={handleSelectChange}
                              placeholder="Select State"
                              isSearchable={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="ki-input-group">
                        <label className="ki-field-label">City</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-city ki-input-icon" />
                          <div style={{ width: "100%" }}>
                            <Select
                              options={cityOption}
                              styles={customSelectStyles}
                              value={cityOption.find((opt) => opt.value.toLowerCase() === String(userData.city || "").toLowerCase()) || (userData.city ? { value: userData.city, label: userData.city } : null)}
                              onChange={handleCitySelectChange}
                              placeholder="Select City"
                              isSearchable={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="ki-input-group">
                        <label className="ki-field-label">Zipcode</label>
                        <div className="ki-input-wrapper">
                          <i className="fas fa-mail-bulk ki-input-icon" />
                          <input
                            type="text"
                            className="form-control"
                            name="zipcode"
                            placeholder="6-digit Zipcode"
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
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-5 pt-3 border-top d-flex align-items-center justify-content-between">
                  <div>
                    {error && <span className="text-danger font-weight-bold">{error}</span>}
                    {success && <span className="text-success font-weight-bold">{success}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveChange}
                    className="btn ki-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2" /> Saving Changes...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2" /> Save Profile Details
                      </>
                    )}
                  </button>
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
