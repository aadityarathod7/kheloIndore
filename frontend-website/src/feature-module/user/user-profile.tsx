import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Select, { type SingleValue, type StylesConfig } from "react-select";

interface ProfileImage {
  src?: string;
}

interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  user_info: string;
  favourite_sports: string[];
  profile_image: ProfileImage[];
}

interface JwtPayload {
  userID: string | number;
}

interface SelectOption {
  value: string;
  label: string;
}

interface UploadResponse {
  status: boolean;
  file_data: Array<{ src: string; fileName?: string; orgname?: string }>;
}

interface FavouriteVenue {
  _id?: string;
  id?: string | number;
  name?: string;
  vendor_type?: string;
  category?: string;
  categories?: string[];
  address?: string;
  city?: string;
  images?: Array<{ src?: string; url?: string } | string>;
}

interface SportOption {
  name: string;
  icon: string;
  category: string;
}

const ALL_SELECTABLE_SPORTS: SportOption[] = [
  { name: "Cricket", icon: "🏏", category: "Popular" },
  { name: "Turf", icon: "🏟️", category: "Popular" },
  { name: "Badminton", icon: "🏸", category: "Racquet" },
  { name: "Football", icon: "⚽", category: "Popular" },
  { name: "Tennis", icon: "🎾", category: "Racquet" },
  { name: "Pickleball", icon: "🏓", category: "Racquet" },
  { name: "Swimming Pool", icon: "🏊", category: "Fitness" },
  { name: "Basketball", icon: "🏀", category: "Ball Sports" },
  { name: "Table Tennis", icon: "🏓", category: "Racquet" },
  { name: "Volleyball", icon: "🏐", category: "Ball Sports" },
  { name: "Gym", icon: "🏋️", category: "Fitness" },
  { name: "Yoga", icon: "🧘", category: "Fitness" },
  { name: "Snooker", icon: "🎱", category: "Indoor" },
  { name: "Pool Club", icon: "🎱", category: "Indoor" },
  { name: "Squash", icon: "🎾", category: "Racquet" },
  { name: "Bowling", icon: "🎳", category: "Indoor" },
  { name: "Skating (Ice/Roller)", icon: "🛼", category: "Indoor" },
  { name: "Kabaddi", icon: "🤼", category: "Popular" },
  { name: "Hockey (Indoor/Outdoor)", icon: "🏑", category: "Ball Sports" },
  { name: "Shooting", icon: "🎯", category: "Indoor" },
  { name: "Archery", icon: "🏹", category: "Indoor" },
  { name: "Boxing", icon: "🥊", category: "Fitness" },
  { name: "Karate", icon: "🥋", category: "Fitness" },
  { name: "Taekwondo", icon: "🥋", category: "Fitness" },
  { name: "Chess Academy", icon: "♟️", category: "Indoor" },
  { name: "Dance Academy", icon: "💃", category: "Fitness" },
  { name: "Zumba Classes", icon: "💃", category: "Fitness" },
  { name: "Golf Club", icon: "⛳", category: "Popular" },
  { name: "Go-karting", icon: "🏎️", category: "Popular" },
  { name: "Horse Riding", icon: "🏇", category: "Popular" },
  { name: "Rock Climbing", icon: "🧗", category: "Fitness" },
  { name: "PlayStation", icon: "🎮", category: "Indoor" },
  { name: "Baseball", icon: "⚾", category: "Ball Sports" },
  { name: "Sky Martial Arts", icon: "🥋", category: "Fitness" },
  { name: "Other Sports", icon: "🏅", category: "Other" },
];

const UserProfile = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || location.state?.URL;
  const isFirstTime = location.state?.firstTime || localStorage.getItem("profileCompleted") === "false";
  const [userDataId, setUserDataId] = useState<JwtPayload | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address: "",
    state: "",
    city: "",
    zipcode: "",
    user_info: "",
    favourite_sports: [],
    profile_image: [],
  });

  const [favouriteVenues, setFavouriteVenues] = useState<FavouriteVenue[]>([]);
  const [favLoading, setFavLoading] = useState<boolean>(true);

  const loadFavVenues = async () => {
    try {
      const favIds: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("fav_venue_") && localStorage.getItem(key) === "true") {
          const vId = key.replace("fav_venue_", "");
          if (vId) favIds.push(vId);
        }
      }

      if (favIds.length > 0) {
        const promises = favIds.map((vId) =>
          axios.get(`${API_URL}/venue/individual/${vId}`).then((res) => res.data?.venue).catch(() => null)
        );
        const results = await Promise.all(promises);
        setFavouriteVenues(results.filter((v): v is FavouriteVenue => v !== null));
      } else {
        setFavouriteVenues([]);
      }
    } catch {
      // Handled
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    loadFavVenues();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("tab") === "favourites") {
      setTimeout(() => {
        const favElem = document.getElementById("favourites-section");
        if (favElem) {
          favElem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);
    }
  }, [location.search]);

  const handleRemoveFav = (venueId: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem(`fav_venue_${venueId}`);
    setFavouriteVenues((prev) => prev.filter((v) => String(v.id || v._id) !== String(venueId)));
    Swal.fire({
      icon: "info",
      title: '<span style="color: #1E293B; font-size: 18px; font-weight: 500; font-family: sans-serif;">Removed from Favourites</span>',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
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
    setUserId(userDataId ? String(userDataId.userID) : null);
  }, [userDataId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await axios.get<{ data?: ProfileData }>(
          `${API_URL}/user/fetch-user-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (response.data?.data) {
          setUserData({ ...response.data.data, favourite_sports: response.data.data.favourite_sports || [] });
        }
      } catch {
        // Keep the current form values when the profile cannot be loaded.
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
      const response = await axios.post<UploadResponse>(
        `${API_URL}/upload-file?types=user`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 200 && response.data.status) {
        const uploadedImage = response.data.file_data?.[0]?.src;
        if (uploadedImage) {
          if (!userId) {
            throw new Error("Your account could not be identified. Please sign in again.");
          }

          const profileImage = [{ src: uploadedImage }];
          const savedProfile = await axios.put(
            `${API_URL}/user/profile-setting/${userId}`,
            { profile_image: profileImage },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          setUploadedFileUrl(uploadedImage);
          setUserData((current) => ({
            ...current,
            profile_image: savedProfile.data?.data?.profile_image || profileImage,
          }));
          window.dispatchEvent(new Event("userProfileUpdated"));
          Swal.fire({
            icon: "success",
            title: "Profile Photo Saved!",
            text: "Your new profile photo will remain after refresh.",
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error("The server did not return an image URL.");
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
  const [sportSearch, setSportSearch] = useState("");
  const [selectedSportTag, setSelectedSportTag] = useState("All");
  const [savingSports, setSavingSports] = useState(false);

  const toggleFavouriteSport = (sport: string) => {
    const selectedSports = userData.favourite_sports || [];
    if (selectedSports.some((s) => s.toLowerCase() === sport.toLowerCase())) {
      setUserData((current) => ({
        ...current,
        favourite_sports: (current.favourite_sports || []).filter(
          (item) => item.toLowerCase() !== sport.toLowerCase()
        ),
      }));
      return;
    }

    if (selectedSports.length >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Maximum 3 Sports Allowed",
        text: "You can select up to 3 favourite sports. Please unselect one from your slots above before choosing another.",
        confirmButtonColor: "#22C55E",
      });
      return;
    }

    setUserData((current) => ({
      ...current,
      favourite_sports: [...(current.favourite_sports || []), sport],
    }));
  };

  const handleSaveFavouriteSports = async () => {
    if (!userId) {
      Swal.fire("Login Required", "Please log in to save your favourite sports.", "warning");
      return;
    }
    try {
      setSavingSports(true);
      const saveApiUrl = `${API_URL}/user/profile-setting/${userId}`;
      await axios.put(
        saveApiUrl,
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          favourite_sports: userData.favourite_sports || [],
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      localStorage.setItem("userFavouriteSports", JSON.stringify(userData.favourite_sports || []));
      window.dispatchEvent(new Event("userProfileUpdated"));

      Swal.fire({
        icon: "success",
        title: "Sports Preferences Saved!",
        text: "Your top 3 sports are saved. Venues, turfs, and coaches for these sports will now appear on top!",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Could not save favourite sports. Please try again.",
      });
    } finally {
      setSavingSports(false);
    }
  };

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
      favourite_sports: userData.favourite_sports || [],
      profile_image: uploadedFileUrl ? [{ src: uploadedFileUrl }] : userData.profile_image,
    };

    try {
      setLoading(true);
      setError("");

      await axios.put(saveApiUrl, payload, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      localStorage.setItem("profileCompleted", "true");
      localStorage.setItem("userFavouriteSports", JSON.stringify(userData.favourite_sports || []));
      window.dispatchEvent(new Event("userProfileUpdated"));

      Swal.fire({
        icon: "success",
        title: "Profile Saved!",
        text: "Your profile details have been updated successfully.",
        confirmButtonText: returnTo ? "Continue Booking" : "Go to Home",
        confirmButtonColor: "#22C55E",
      }).then(() => {
        navigate(returnTo || "/");
      });
    } catch (err) {
      
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

  const handleSelectChange = (selectedOption: SingleValue<SelectOption>) => {
    setUserData((prevData) => ({
      ...prevData,
      state: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleCitySelectChange = (selectedOption: SingleValue<SelectOption>) => {
    setUserData((prevData) => ({
      ...prevData,
      city: selectedOption ? selectedOption.value : "",
    }));
  };

  const customSelectStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
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
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94A3B8",
      fontSize: "13px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0F172A",
      fontSize: "13px",
    }),
    option: (base, state) => ({
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
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "195px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
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
                <div className="ki-user-breadcrumb d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="fas fa-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="fas fa-chevron-right" style={{ fontSize: "10px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>Profile Settings</span>
                </div>

                <nav className="ki-user-hero-nav ms-sm-2" aria-label="User account navigation">
                  <Link to={routes.userDashboard} className="ki-tab-btn">
                    <i className="fas fa-th-large me-2" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to={routes.userBookings} className="ki-tab-btn">
                    <i className="fas fa-calendar-alt me-2" />
                    <span>My Bookings</span>
                  </Link>
                  <a
                    href="#favourite-sports-section"
                    className="ki-tab-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      const elem = document.getElementById("favourite-sports-section");
                      if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    <i className="fas fa-trophy text-warning me-2" />
                    <span>Favourite Sports</span>
                  </a>
                  <a
                    href="#favourites-section"
                    className="ki-tab-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      const elem = document.getElementById("favourites-section");
                      if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    <i className="fas fa-heart text-danger me-2" />
                    <span>My Favourites</span>
                  </a>
                  <Link to={routes.userProfile} className="ki-tab-btn active">
                    <i className="fas fa-user-edit me-2" />
                    <span>Profile Settings</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFirstTime && (
        <div className="container mt-4">
          <div
            className="alert border-0 d-flex align-items-center p-4 rounded-4 shadow-sm ki-profile-alert"
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
              <strong className="d-block mb-1 ki-profile-alert-title" style={{ fontSize: "16px", color: "#92400E" }}>
                Complete Your Profile
              </strong>
              <span className="ki-profile-alert-desc" style={{ fontSize: "14px", color: "#B45309" }}>
                Please fill in your <strong style={{ color: "#78350F" }}>First Name</strong>, <strong style={{ color: "#78350F" }}>Last Name</strong>, and verify your <strong style={{ color: "#78350F" }}>Email Address</strong> to activate full access for venue and coach bookings.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="content court-bg py-4 ki-user-profile">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-11 col-lg-12">
              {/* Top Compact Profile Photo Card */}
              <div className="ki-profile-card mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    minWidth: "80px",
                    minHeight: "80px",
                    maxWidth: "80px",
                    maxHeight: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid #22C55E",
                    boxShadow: "0 6px 18px rgba(34, 197, 94, 0.25)",
                    background: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      style={{ width: "80px", height: "80px", minWidth: "80px", minHeight: "80px", maxWidth: "80px", maxHeight: "80px", objectFit: "cover", borderRadius: "50%" }}
                    />
                  ) : (
                    <span style={{ fontSize: "28px", fontWeight: "800", color: "#22C55E" }}>{initialLetter}</span>
                  )}
                </div>
                <div>
                  <h4 className="mb-1 fw-bold text-dark" style={{ fontSize: "20px" }}>
                    {userData.first_name || 'User'} {userData.last_name || ''}
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                    {userData.email || 'user@kheloindore.com'}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column align-items-end gap-1">
                <div className="position-relative overflow-hidden d-inline-block">
                  <button
                    type="button"
                    className="btn btn-sm text-white fw-bold px-4 py-2"
                    style={{
                      background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                      borderRadius: "50px",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                      border: "none",
                      pointerEvents: "none"
                    }}
                  >
                    <i className="fas fa-upload me-2" /> Upload New Photo
                  </button>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={handleFileUpload}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer"
                    }}
                  />
                </div>
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  JPG, PNG, SVG (Max 5MB)
                </small>
              </div>
            </div>
          </div>

          {/* Side-by-Side 2-Column Horizontal Grid */}
          <div className="row g-4">
            {/* Column 1: Personal Information */}
            <div className="col-lg-6">
              <div className="ki-profile-card h-100">
                <div className="ki-section-title mb-4">
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
                          placeholder="First Name"
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
                          placeholder="Last Name"
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
                          placeholder="Email Address"
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
                          placeholder="Phone Number"
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
                          rows={2}
                          placeholder="Favorite sports, bio..."
                          name="user_info"
                          value={userData.user_info || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Address & Location + Save */}
            <div className="col-lg-6">
              <div className="ki-profile-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="ki-section-title mb-4">
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

                    <div className="col-md-6">
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

                    <div className="col-md-6">
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

                    <div className="col-12">
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
                <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                  <div>
                    {error && <span className="text-danger font-weight-bold" style={{ fontSize: "13px" }}>{error}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveChange}
                    className="btn ki-submit-btn px-4 py-2"
                    disabled={loading}
                    style={{ backgroundColor: "#22C55E", border: "none", borderRadius: "50px", color: "#FFFFFF", fontWeight: "700" }}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2" /> Saving...
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

            {/* My Top 3 Favourite Sports Section */}
            <div id="favourite-sports-section" className="ki-profile-card mt-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", color: "#D97706", fontSize: "20px", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)" }}
                  >
                    <i className="fas fa-trophy" />
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: "19px" }}>
                      My Top 3 Favourite Sports
                    </h5>
                    <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
                      Select your 3 best sports. Venues, turfs, coaches, and trainers for these sports will be shown <strong>on top</strong> across the platform.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge rounded-pill px-3 py-2 fw-bold ${
                      (userData.favourite_sports || []).length === 3
                        ? "bg-success text-white"
                        : (userData.favourite_sports || []).length > 0
                          ? "bg-info-subtle text-info-emphasis"
                          : "bg-warning-subtle text-warning-emphasis"
                    }`}
                    style={{ fontSize: "12.5px" }}
                  >
                    {(userData.favourite_sports || []).length === 3 && <i className="fas fa-check-circle me-1" />}
                    {(userData.favourite_sports || []).length} of 3 Selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveFavouriteSports}
                    disabled={savingSports}
                    className="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                    style={{ backgroundColor: "#22C55E", border: "none", fontSize: "12.5px" }}
                  >
                    {savingSports ? (
                      <><i className="fas fa-spinner fa-spin me-1" /> Saving...</>
                    ) : (
                      <><i className="fas fa-save me-1" /> Save Sports</>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Ranked Slots Preview */}
              <div className="row g-3 mb-4">
                {[0, 1, 2].map((slotIndex) => {
                  const rankLabels = ["1st Sport", "2nd Sport", "3rd Sport"];
                  const rankMedals = ["🥇", "🥈", "🥉"];
                  const currentSport = (userData.favourite_sports || [])[slotIndex];
                  const sportObj = currentSport ? ALL_SELECTABLE_SPORTS.find((s) => s.name.toLowerCase() === currentSport.toLowerCase()) : null;

                  return (
                    <div className="col-md-4" key={slotIndex}>
                      {currentSport ? (
                        <div
                          className="p-3 rounded-3 d-flex align-items-center justify-content-between position-relative shadow-sm"
                          style={{
                            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                            border: "2px solid #86EFAC",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 overflow-hidden">
                            <span style={{ fontSize: "22px" }}>{sportObj?.icon || rankMedals[slotIndex]}</span>
                            <div className="overflow-hidden">
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.5px", display: "block" }}>
                                {rankMedals[slotIndex]} {rankLabels[slotIndex]}
                              </span>
                              <strong className="text-dark text-truncate d-block" style={{ fontSize: "15px" }}>
                                {currentSport}
                              </strong>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFavouriteSport(currentSport)}
                            className="btn btn-sm btn-light rounded-circle p-0 d-flex align-items-center justify-content-center text-muted"
                            style={{ width: "26px", height: "26px", border: "1px solid #CBD5E1", flexShrink: 0 }}
                            title={`Remove ${currentSport}`}
                          >
                            <i className="fas fa-times" style={{ fontSize: "11px" }} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="p-3 rounded-3 d-flex align-items-center justify-content-center text-center text-muted"
                          style={{
                            background: "#F8FAFC",
                            border: "2px dashed #CBD5E1",
                            minHeight: "68px"
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
                            {rankMedals[slotIndex]} + Select {rankLabels[slotIndex]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Search & Tag Filter Bar */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="position-relative flex-grow-1" style={{ maxWidth: "340px" }}>
                  <input
                    type="text"
                    className="form-control rounded-pill pe-4"
                    placeholder="Search sports (e.g. Cricket, Badminton)..."
                    style={{ fontSize: "13px", paddingLeft: "36px", height: "38px" }}
                    value={sportSearch}
                    onChange={(e) => setSportSearch(e.target.value)}
                  />
                  <i className="fas fa-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" style={{ fontSize: "12px" }} />
                  {sportSearch && (
                    <button
                      type="button"
                      onClick={() => setSportSearch("")}
                      className="btn position-absolute end-0 top-50 translate-middle-y me-1 p-0 border-0 text-muted"
                      style={{ width: "24px", height: "24px" }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-1">
                  {["All", "Popular", "Racquet", "Ball Sports", "Fitness", "Indoor"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedSportTag(tag)}
                      className={`btn btn-sm rounded-pill px-2.5 py-1 ${selectedSportTag === tag ? "btn-success" : "btn-outline-secondary"}`}
                      style={{ fontSize: "12px", fontWeight: "600" }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sports Grid Chips */}
              <div className="d-flex flex-wrap gap-2" style={{ maxHeight: "260px", overflowY: "auto", padding: "4px" }}>
                {ALL_SELECTABLE_SPORTS
                  .filter((item) => {
                    const matchesSearch = item.name.toLowerCase().includes(sportSearch.toLowerCase().trim());
                    const matchesTag = selectedSportTag === "All" || item.category === selectedSportTag;
                    return matchesSearch && matchesTag;
                  })
                  .map((sportItem) => {
                    const isSelected = (userData.favourite_sports || []).some(
                      (s) => s.toLowerCase() === sportItem.name.toLowerCase()
                    );

                    return (
                      <button
                        key={sportItem.name}
                        type="button"
                        onClick={() => toggleFavouriteSport(sportItem.name)}
                        className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-2 transition-all ${
                          isSelected ? "btn-success text-white shadow-sm" : "btn-outline-secondary bg-white text-dark"
                        }`}
                        style={{
                          fontSize: "13px",
                          fontWeight: isSelected ? "700" : "500",
                          border: isSelected ? "1.5px solid #16A34A" : "1px solid #CBD5E1",
                          transform: isSelected ? "scale(1.02)" : "none",
                        }}
                      >
                        <span>{sportItem.icon}</span>
                        <span>{sportItem.name}</span>
                        {isSelected && <i className="fas fa-check-circle ms-1" style={{ fontSize: "12px" }} />}
                      </button>
                    );
                  })}
              </div>

              <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1 text-success" />
                  Your favourite sports update automatically across Khelo Indore. Matching venues, coaches, and academies will be shown on top.
                </small>
                <button
                  type="button"
                  onClick={handleSaveFavouriteSports}
                  disabled={savingSports}
                  className="btn btn-success btn-sm rounded-pill px-3 py-1.5 fw-bold"
                  style={{ backgroundColor: "#22C55E", border: "none" }}
                >
                  {savingSports ? "Saving..." : "Save Favourite Sports"}
                </button>
              </div>
            </div>

            {/* My Favourite Venues Section */}
            <div id="favourites-section" className="ki-profile-card mt-4">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#FFF0F3", color: "#DF4265", fontSize: "16px" }}
                  >
                    <i className="fas fa-heart" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "18px" }}>My Favourite Venues</h5>
                    <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>Your saved venues for quick booking</p>
                  </div>
                </div>
                <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 fw-semibold" style={{ fontSize: "12px" }}>
                  {favLoading ? "…" : `${favouriteVenues.length} Saved`}
                </span>
              </div>

              {favLoading ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-spinner fa-spin text-success me-2" /> Loading favourite venues…
                </div>
              ) : favouriteVenues.length === 0 ? (
                <div className="text-center py-4">
                  <i className="far fa-heart fa-2x text-muted mb-2 d-block opacity-50" />
                  <p className="text-muted small mb-2">You haven&apos;t added any venues to your favourites yet.</p>
                  <Link to="/sports-venue" className="btn btn-sm btn-outline-success rounded-pill px-3">
                    Explore Venues <i className="fas fa-arrow-right ms-1" />
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {favouriteVenues.map((v, index) => {
                    const vId = v._id || v.id;
                    const vendorType = (v.vendor_type || "venue").replace(/\s+/g, "-").toLowerCase();
                    const venueNameSlug = (v.name || "venue").replace(/\s+/g, "-").toLowerCase();
                    const venueUrl = `/sports-venue/${vendorType}/${venueNameSlug}/${vId}`;
                    const getVenueCoverImage = (venue: FavouriteVenue): string => {
                      let rawImg: any = venue.images;
                      if (typeof rawImg === "string") {
                        try {
                          if (rawImg.startsWith("[") || rawImg.startsWith("{")) {
                            rawImg = JSON.parse(rawImg);
                          }
                        } catch {
                          // keep raw string
                        }
                      }

                      let path = "";
                      if (Array.isArray(rawImg) && rawImg.length > 0) {
                        const first = rawImg[0];
                        path = typeof first === "string" ? first : (first?.src || first?.url || "");
                      } else if (typeof rawImg === "string") {
                        path = rawImg;
                      }

                      if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
                        return path;
                      }

                      if (path) {
                        const clean = path.startsWith("/") ? path : `/${path}`;
                        return `${IMG_URL}${clean}`;
                      }

                      const text = `${venue.name || ""} ${venue.vendor_type || ""} ${venue.category || ""}`.toLowerCase();
                      if (text.includes("foot") || text.includes("soccer")) {
                        return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("cricket") || text.includes("turf") || text.includes("box")) {
                        return "https://images.unsplash.com/photo-1531415074868-036b1c57e32b?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("badminton")) {
                        return "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("tennis") || text.includes("pickleball")) {
                        return "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("swim") || text.includes("pool")) {
                        return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("gym") || text.includes("fitness")) {
                        return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80";
                      }
                      return "/assets/img/venues/venues-01.jpg";
                    };

                    const getFallbackImage = (venue: FavouriteVenue): string => {
                      const text = `${venue.name || ""} ${venue.vendor_type || ""} ${venue.category || ""}`.toLowerCase();
                      if (text.includes("foot") || text.includes("soccer")) {
                        return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("cricket") || text.includes("turf") || text.includes("box")) {
                        return "https://images.unsplash.com/photo-1531415074868-036b1c57e32b?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("badminton")) {
                        return "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("tennis") || text.includes("pickleball")) {
                        return "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("swim") || text.includes("pool")) {
                        return "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80";
                      }
                      if (text.includes("gym") || text.includes("fitness")) {
                        return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80";
                      }
                      return "/assets/img/venues/venues-01.jpg";
                    };

                    const coverImg = getVenueCoverImage(v);
                    const fallbackImg = getFallbackImage(v);

                    return (
                      <div key={String(vId || index)} className="col-md-6 col-lg-4">
                        <div
                          className="p-3 rounded-3 border d-flex align-items-center justify-content-between h-100"
                          style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
                        >
                          <div className="d-flex align-items-center gap-3 overflow-hidden">
                            <Link to={venueUrl} style={{ width: "50px", height: "50px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, display: "block", backgroundColor: "#E2E8F0" }}>
                              <img
                                src={coverImg}
                                alt={v.name || "Venue"}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.src !== fallbackImg) {
                                    target.src = fallbackImg;
                                  } else {
                                    target.src = "/assets/img/venues/venues-01.jpg";
                                  }
                                }}
                              />
                            </Link>
                            <div className="overflow-hidden">
                              <h6 className="mb-0 text-truncate" style={{ fontSize: "14px", fontWeight: 700 }}>
                                <Link to={venueUrl} className="text-decoration-none text-dark hover-success" title={v.name}>
                                  {v.name || "Venue"}
                                </Link>
                              </h6>
                              <p className="mb-0 text-muted text-truncate" style={{ fontSize: "12px" }}>
                                <i className="fas fa-map-marker-alt me-1 text-danger" style={{ fontSize: "10px" }} />
                                {v.address ? (v.address.length > 25 ? `${v.address.slice(0, 25)}…` : v.address) : (v.city || "Indore")}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                            <button
                              type="button"
                              onClick={(e) => handleRemoveFav(String(vId), e)}
                              title="Remove from Favourites"
                              className="btn btn-sm text-danger border-0 p-1"
                            >
                              <i className="far fa-trash-alt" />
                            </button>
                            <Link
                              to={venueUrl}
                              className="btn btn-sm btn-success rounded-pill px-2.5 py-1 text-white text-decoration-none"
                              style={{ fontSize: "11px", fontWeight: 600 }}
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
