import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import Slider from "react-slick";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { sanitizeHtml } from "../../utils/sanitize";
import Swal from "sweetalert2";

interface CoachData {
  first_name: any;
  last_name: any;
  location: any;
  experience: string;
  email: string;
  gender: string;
  trainer_type: string;
  availability: string;
  specializations: string[];
  skills: string;
  bio: string;
  package: any;
  price: number;
  package_type: string;
  name: string;
  duration: number;
  focus_area: string;
  number_of_sessions: number;
  profile_picture: any;
  src: string;
  address: any;
  city: string;
  state: string;
  zipcode: string;
  google_location: any;
  age: any;
  venue_name: string;
  qualifications: string;
  policiesAndRules: string;
  languages: string;
  class_location: string;
  students_trained: number;
  response_time: string;
  coaching_levels: string[];
  own_level: string;
  profile_views: number;
  reviews_count: number;
  rating: number;
  social_media: any;
  gallery_videos: any;
  daily_availability: any;
  share_token: string;
  mobile: string;
  other_contact_number: string;
}

interface Coach {
  first_name: string;
  last_name: string;
  location: any;
  gender: string;
  trainer_type: string;
  experience: string;
  availability: string;
  specializations: any;
  skills: string;
  bio: string;
  price: string;
  profile_picture: any;
  category: string;
  gallery: any;
}

// ---------- Display helpers (aligned with how admins enter the data) ----------
// Gender / trainer type are saved lowercase by the admin form.
const capitalize = (value?: string | null) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

// Price is a raw number (e.g. 11000) -> ₹11,000
const formatPrice = (value?: any) => {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return `₹${num.toLocaleString("en-IN")}`;
};

// Admin enters specializations as comma separated text, but the DB may also
// hold an array or newline/semicolon separated values - handle all of them
// (including array elements that themselves contain comma separated text).
const getSpecializations = (value: any): string[] => {
  if (!value) return [];
  // String() comma-joins arrays, so this handles arrays, comma separated
  // strings, newline/semicolon separated text, and array elements that
  // themselves contain comma separated values.
  return String(value)
    .split(/[,;\n|•]+/)
    .map((item: string) => item.trim())
    .filter(Boolean);
};

// Location may be stored flat (address/city/state/zipcode) or nested
// (location.address / location.city / ...). Prefer the flat one.
const getCoachLocation = (coach: CoachData | undefined) =>
  [
    coach?.address || coach?.location?.address,
    coach?.city || coach?.location?.city,
    coach?.state || coach?.location?.state,
    coach?.zipcode || coach?.location?.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

const CoachDetail = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const { type, name } = useParams();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>();
  const [coachData, setCochData] = useState<CoachData>();
  const [activeSection, setActiveSection] = useState<string>("coach-details");

  // Derived display values (robust to however admins entered the data)
  const coachName = coachData?.first_name
    ? `${coachData.first_name} ${coachData.last_name || ""}`.trim()
    : "";
  const coachLocation = getCoachLocation(coachData);
  const specializationsList = getSpecializations(coachData?.specializations);
  const formattedPrice = formatPrice(coachData?.price);
  const hasCoachDetails = Boolean(
    coachName ||
      coachData?.gender ||
      coachData?.trainer_type ||
      coachLocation ||
      coachData?.venue_name ||
      coachData?.qualifications ||
      coachData?.skills ||
      formattedPrice
  );

  // ---- Extended profile derived values ----
  const languagesList = coachData?.languages
    ? String(coachData.languages)
        .split(/[,;\n|•]+/)
        .map((l) => l.trim())
        .filter(Boolean)
    : [];
  const coachingLevelsList = coachData?.coaching_levels?.length
    ? coachData.coaching_levels
    : [];
  const socialMedia = coachData?.social_media || {};
  const dailyAvailability =
    coachData?.daily_availability && coachData.daily_availability.length
      ? coachData.daily_availability
      : [];
  const profileViews = coachData?.profile_views || 0;
  const studentsTrained = coachData?.students_trained || 0;

  // ---- Share profile ----
  const [shareCopied, setShareCopied] = useState(false);
  const generateShareLink = async () => {
    try {
      const res = await axios.post(`${API_URL}/web/coach/share/${id}`);
      const link = res.data?.shareLink || window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title: coachName, url: link });
          return;
        } catch (_) {
          /* user dismissed native share */
        }
      }
      await navigator.clipboard.writeText(link);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      console.error("Error generating share link:", error);
    }
  };

  const openSection = (id: string) => {
    setActiveSection(id);
    scrollContent(id);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const idData = useParams();
  const id = idData.id;

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const [selectedCity, setSelectedCity] = useState();

  const cityOptions = [
    { name: "Select City" },
    { name: "Toronto" },
    { name: "Texas" },
  ];

  const gallerySlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const featuredVenuesSlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const scrollContent = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    // Fetch coach data from API
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((coach: any) => ({
          first_name: coach.first_name,
          last_name: coach.last_name,
          location: coach.location,
          trainer_type: coach.trainer_type,
          gender: coach.gender,
          address: coach.address,
          city: coach.city,
          state: coach.state,
          zipCode: coach.zipCode,
          venue_name: coach.venue_name,
          policiesAndRules: coach.policiesAndRules,
          qualifications: coach.qualifications,
          email: coach.email,
          mobile: coach.mobile,
          experience: coach.experience,
          availability: coach.availability,
          specializations: coach.specializations,
          skills: coach.skills,
          bio: coach.bio,
          price: coach.price,
          profile_picture: coach.profile_picture,
          age: coach.age,
          _id: coach._id,
          gallery: coach.gallery,
          category: coach.category,
          // profile: coach.profile
        }));
        setCoaches(mappedData);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    const fetchCoacheId = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetch-coach/${id}`);
        const coachDataId = response.data.coach;
        setCochData(coachDataId);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoacheId();

    fetchCoaches();
  }, []);

  useEffect(() => {
    document.title = coachName ? `${coachName} - Khelo Indore` : "Coach - Khelo Indore";
  }, [coachName]);



  // function removeHtmlTags(text: string | undefined): string {
  //   const doc = new DOMParser().parseFromString(text || '', 'text/html'); // Default to empty string if undefined
  //   return doc.body.textContent || "";
  // }

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/coaches/coach-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: location.pathname } }
      )
    }
  }

  // Opens (or starts) a real chat with the coach
  const handleChat = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/user/user-chat?peerType=Coach&peerId=${Id}`);
    } else {
      navigate("/login", { state: { URL: location.pathname } })
    }
  }

  return (
    <div className="venue-coach-details coach-detail top-margin" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.15", marginBottom: "16px", display: "flex", alignItems: "center", flexWrap: "wrap" as const }}>
                <span style={{ color: "#22C55E", marginRight: "12px" }}>Coach</span> Details
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>
                {coachData?.first_name ? `${coachData.first_name} ${coachData.last_name || ""}` : "View coach profile and book your session"}
              </p>
              
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {/* Breadcrumb pill */}
                <div style={{ display: "inline-flex", alignItems: "center", background: "#FFFFFF", padding: "8px 16px", borderRadius: "50px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                  <Link to="/coaches" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Coaches</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>Details</span>
                </div>
                <button
                  onClick={() => setIsShareOpen(true)}
                  type="button"
                  className="btn rounded-pill d-inline-flex align-items-center px-3 py-2 shadow-sm"
                  style={{ fontSize: "13px", fontWeight: "600", border: "1px solid #22C55E", color: "#22C55E", backgroundColor: "#fff" }}
                >
                  <i className="feather-share-2 me-1" /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      <style dangerouslySetInnerHTML={{__html: `
        .venue-coach-details, .venue-coach-details *, .venue-coach-details span, .venue-coach-details p, .venue-coach-details li {
          color: #334155 !important;
        }
        .venue-coach-details h1, .venue-coach-details h2, .venue-coach-details h3, .venue-coach-details h4, .venue-coach-details h5, .venue-coach-details h6,
        .venue-coach-details h1 *, .venue-coach-details h2 *, .venue-coach-details h3 *, .venue-coach-details h4 *, .venue-coach-details h5 *, .venue-coach-details h6 * {
          color: #0F172A !important;
          font-weight: 700 !important;
        }
        .venue-coach-details a, .venue-coach-details a span {
          color: #334155 !important;
        }
        .venue-coach-details a:hover {
          color: #22C55E !important;
        }
        .venue-coach-details a.btn, .venue-coach-details button.btn,
        .venue-coach-details a.btn *, .venue-coach-details button.btn * {
          color: #FFFFFF !important;
        }
        .venue-coach-details .active, .venue-coach-details .active * {
          color: #22C55E !important;
        }
        .venue-options {
          margin-top: 30px !important;
        }
        .top-margin {
          margin-top: 0px !important;
          padding-top: 0px !important;
        }
        /* Custom Modern Coach Info Card to prevent overlaps */
        .coach-info {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          padding: 24px !important;
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) !important;
          margin-bottom: 24px !important;
        }
        .coach-info .profile-pic {
          width: 120px !important;
          height: 120px !important;
          min-width: 120px !important;
          margin-right: 24px !important;
          overflow: hidden !important;
          border-radius: 12px !important;
          position: static !important;
        }
        .coach-info .profile-pic img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          margin: 0 !important;
          position: static !important;
        }
        /* Sidebar booking card redesigned for light green turf theme */
        .venue-coach-details .book-coach {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
          padding: 24px !important;
        }
        .venue-coach-details .book-coach h4,
        .venue-coach-details .book-coach h4 * {
          color: #0F172A !important;
          border-bottom-color: #E2E8F0 !important;
        }
        .venue-coach-details .book-coach p,
        .venue-coach-details .book-coach span,
        .venue-coach-details .book-coach strong {
          color: #334155 !important;
        }
        .venue-coach-details .book-coach .dull-bg {
          background-color: #F0FDF4 !important;
          border: 1px solid #DCFCE7 !important;
          border-radius: 12px !important;
          padding: 16px !important;
        }
        .venue-coach-details .book-coach .dull-bg * {
          color: #166534 !important;
        }
        .venue-coach-details .book-coach .dull-bg h4.primary-text {
          color: #22C55E !important;
          font-weight: 800 !important;
        }
        .venue-coach-details .book-coach a.btn-secondary,
        .venue-coach-details .book-coach button.btn-secondary,
        .venue-coach-details .book-coach button {
          background-color: #22C55E !important;
          border-color: #22C55E !important;
          color: #FFFFFF !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
          padding: 12px !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        .venue-coach-details .book-coach a.btn-secondary:hover,
        .venue-coach-details .book-coach button.btn-secondary:hover,
        .venue-coach-details .book-coach button:hover {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
          color: #FFFFFF !important;
        }
        .venue-coach-details .book-coach a.btn-secondary i,
        .venue-coach-details .book-coach button.btn-secondary i,
        .venue-coach-details .book-coach button i {
          color: #FFFFFF !important;
          margin-right: 8px !important;
        }
        /* Make sidebar wrappers transparent to prevent any dark block showing through */
        .stickybar, .theiaStickySidebar, .theiaStickySidebarCon {
          background-color: transparent !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        /* Coach profile quick meta chips */
        .coach-quick-meta p {
          color: #334155 !important;
          font-size: 14px !important;
        }
        .coach-quick-meta p i {
          color: #16A34A !important;
        }
        .meta-chip {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          background: #F0FDF4 !important;
          border: 1px solid #DCFCE7 !important;
          color: #166534 !important;
          border-radius: 999px !important;
          padding: 6px 14px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
        }
        .meta-chip i {
          color: #16A34A !important;
        }
        /* Coach Details definition grid */
        .coach-details-grid .cdg-item {
          display: flex !important;
          align-items: flex-start !important;
          padding: 10px 0 !important;
          border-bottom: 1px dashed #E2E8F0 !important;
        }
        .coach-details-grid .cdg-item:last-child {
          border-bottom: none !important;
        }
        .cdg-label {
          width: 130px !important;
          min-width: 130px !important;
          color: #64748B !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .cdg-value {
          color: #0F172A !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          flex: 1 !important;
        }
        /* Specialization chips */
        .spec-chip {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          background: #F0FDF4 !important;
          border: 1px solid #DCFCE7 !important;
          color: #166534 !important;
          border-radius: 999px !important;
          padding: 8px 16px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          margin: 0 8px 8px 0 !important;
        }
        .spec-chip i {
          color: #16A34A !important;
        }
        /* Booking card availability badge */
        .availability-badge {
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          background: #DCFCE7 !important;
          color: #15803D !important;
          border-radius: 999px !important;
          padding: 3px 10px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }
        .availability-badge i {
          color: #16A34A !important;
        }
        .experience-years {
          color: #16A34A !important;
          font-size: 16px !important;
        }
      `}} />
      {/* Page Content */}
      <div className="content">
        <div className="container">
          {/* Row */}
          <div className="row g-4" style={{ paddingTop: "32px", position: "relative", zIndex: 10 }}>
            {/* {coachData.map((coachId,index)=>(   */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-8">
              <div className="dull-bg corner-radius-10 coach-info d-md-flex justify-content-start align-items-start">
                <div className="profile-pic">
                  <Link to="#;">
                    <ImageWithBasePath
                      alt="User"
                      className="corner-radius-10"
                      // src="/assets/img/profiles/avatar-06.jpg"
                      src={
                        coachData?.profile_picture
                          ? `${IMG_URL}${coachData?.profile_picture?.[0]?.src}`
                          : "/assets/img/no-img.png"
                      }
                    />
                  </Link>
                </div>
                <div className="info w-100">
                  <div className="d-sm-flex justify-content-between align-items-start">
                    <h3 className="d-flex align-items-center justify-content-start mb-0">
                      {coachData?.first_name} {coachData?.last_name}
                      <span className="d-flex justify-content-center align-items-center">
                        <i className="fas fa-check-double" />
                      </span>
                    </h3>
                    {/* <Link to="#">
                      <span className="favourite fav-icon">
                        <i className="feather-star" />
                        Favourite
                      </span>
                    </Link> */}
                  </div>
                  {/* <p>Coach Kevin provides training lessons</p> */}
                  {/* <ul className="d-sm-flex align-items-center">
                    <li className="d-flex align-items-center">
                      <div className="white-bg d-flex align-items-center review">
                        <span className="white-bg dark-yellow-bg d-flex align-items-center">
                          4.5
                        </span>
                        <span>300 Reviews</span>
                      </div>
                    </li>
                    <li> */}
                  {/* <ImageWithBasePath
                        src="/assets/img/icons/flag-01.png"
                        alt="Icon"
                      /> */}
                  {/* {coachData?.location?.address},{" "}
                      {coachData?.location?.city}, {coachData?.location?.state},
                      {coachData?.location?.zipcode}
                    
                    </li>
                  </ul> */}
                  <hr />
                  <div className="coach-quick-meta">
                    {coachLocation && (
                      <p className="d-flex align-items-center mb-2">
                        <i className="feather-map-pin me-2" />
                        <span>{coachLocation}</span>
                      </p>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                      {coachData?.trainer_type ? (
                        <span className="meta-chip">
                          <i className="feather-award" /> {capitalize(coachData.trainer_type)}
                        </span>
                      ) : null}
                      {coachData?.experience ? (
                        <span className="meta-chip">
                          <i className="feather-clock" /> {coachData.experience}+ Years Exp.
                        </span>
                      ) : null}
                      {coachData?.gender ? (
                        <span className="meta-chip">
                          <i className="feather-user" /> {capitalize(coachData.gender)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {/* <ul className="d-xl-flex">
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/expert.svg"
                        alt="Icon"
                      />
                      Rank : Expert
                    </li>
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/sessions.svg"
                        alt="Icon"
                      />
                      Sessions Completed : 25
                    </li>
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/since.svg"
                        alt="Icon"
                      />
                      With KheloIndore Since Apr 5, 2023
                    </li>
                  </ul> */}
                </div>
              </div>
              <div className="venue-options white-bg mb-4">
                <ul className="clearfix">
                  <li className={activeSection === "coach-details" ? "active" : ""}>
                    <Link onClick={() => openSection("coach-details")} to={""}>
                      Coach Details
                    </Link>
                  </li>
                  <li className={activeSection === "bio" ? "active" : ""}>
                    <Link onClick={() => openSection("bio")} to={""}>
                      Bio
                    </Link>
                  </li>
                  <li className={activeSection === "experience" ? "active" : ""}>
                    <Link onClick={() => openSection("experience")} to={""}>
                      Experience
                    </Link>
                  </li>
                  <li className={activeSection === "specializations" ? "active" : ""}>
                    <Link onClick={() => openSection("specializations")} to={""}>
                      Specializations
                    </Link>
                  </li>
                  <li className={activeSection === "availability" ? "active" : ""}>
                    <Link onClick={() => openSection("availability")} to={""}>
                      Availability
                    </Link>
                  </li>
                  <li className={activeSection === "rules" ? "active" : ""}>
                    <Link onClick={() => openSection("rules")} to={""}>
                      Policies & Rules
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Accordian Contents */}
              <div className="accordion" id="accordionPanel">
                <div className="accordion-item mb-4" id="coach-details">
                  <h4 className="accordion-header" id="panelsStayOpen-coach-details">
                    <button
                      className={`accordion-button ${
                        activeSection === "coach-details" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "coach-details"}
                      aria-controls="panelsStayOpen-collapseOne"
                      onClick={() =>
                        setActiveSection(
                          activeSection === "coach-details" ? "" : "coach-details"
                        )
                      }
                    >
                      Coach Details
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className={`accordion-collapse collapse ${
                      activeSection === "coach-details" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-coach-details"
                  >
                    <div className="accordion-body">
                      {coachData && hasCoachDetails ? (
                        <div className="coach-details-grid">
                          {coachName ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Name</span>
                              <strong className="cdg-value">{coachName}</strong>
                            </div>
                          ) : null}
                          {coachData?.gender ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Gender</span>
                              <strong className="cdg-value">
                                {capitalize(coachData.gender)}
                              </strong>
                            </div>
                          ) : null}
                          {coachData?.trainer_type ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Trainer Type</span>
                              <strong className="cdg-value">
                                {capitalize(coachData.trainer_type)}
                              </strong>
                            </div>
                          ) : null}
                          {coachLocation ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Location</span>
                              <strong className="cdg-value">{coachLocation}</strong>
                            </div>
                          ) : null}
                          {coachData?.venue_name ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Venue</span>
                              <strong className="cdg-value">{coachData.venue_name}</strong>
                            </div>
                          ) : null}
                          {coachData?.qualifications ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Qualifications</span>
                              <strong className="cdg-value">
                                {coachData.qualifications}
                              </strong>
                            </div>
                          ) : null}
                          {coachData?.skills ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Skills</span>
                              <strong className="cdg-value">{coachData.skills}</strong>
                            </div>
                          ) : null}
                          {formattedPrice ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Price</span>
                              <strong className="cdg-value">{formattedPrice}/hr</strong>
                            </div>
                          ) : null}
                          {coachData?.class_location ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Class Location</span>
                              <strong className="cdg-value">{coachData.class_location}</strong>
                            </div>
                          ) : null}
                          {languagesList.length > 0 ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Languages</span>
                              <strong className="cdg-value">{languagesList.join(", ")}</strong>
                            </div>
                          ) : null}
                          {coachData?.response_time ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Response Time</span>
                              <strong className="cdg-value">{coachData.response_time}</strong>
                            </div>
                          ) : null}
                          {studentsTrained > 0 ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Students Trained</span>
                              <strong className="cdg-value">{studentsTrained}+ Students</strong>
                            </div>
                          ) : null}
                          {coachingLevelsList.length > 0 ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Coaching Levels</span>
                              <strong className="cdg-value">{coachingLevelsList.join(", ")}</strong>
                            </div>
                          ) : null}
                          {coachData?.own_level ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Coach Level</span>
                              <strong className="cdg-value">{capitalize(coachData.own_level)}</strong>
                            </div>
                          ) : null}
                          {profileViews > 0 ? (
                            <div className="cdg-item">
                              <span className="cdg-label">Profile Views</span>
                              <strong className="cdg-value"><i className="feather-eye me-1" style={{ color: "#16A34A" }} />{profileViews.toLocaleString("en-IN")}</strong>
                            </div>
                          ) : null}
                        </div>
                      ) : coachData ? (
                        <p className="mb-0">
                          Coach details are being updated by the admin. Please check back soon.
                        </p>
                      ) : (
                        <p className="mb-0">Loading coach details...</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="bio">
                  <h4 className="accordion-header" id="panelsStayOpen-bio">
                    <button
                      className={`accordion-button ${
                        activeSection === "bio" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "bio"}
                      aria-controls="panelsStayOpen-collapseTwo"
                      onClick={() =>
                        setActiveSection(activeSection === "bio" ? "" : "bio")
                      }
                    >
                      Bio
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className={`accordion-collapse collapse ${
                      activeSection === "bio" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-bio"
                  >
                    <div className="accordion-body">
                      {coachData?.bio ? (
                        <div
                          className="overflow-auto"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(coachData.bio) }}
                        />
                      ) : (
                        <p className="mb-0">No bio provided yet.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="experience">
                  <h4 className="accordion-header" id="panelsStayOpen-experience">
                    <button
                      className={`accordion-button ${
                        activeSection === "experience" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "experience"}
                      aria-controls="panelsStayOpen-collapseThree"
                      onClick={() =>
                        setActiveSection(
                          activeSection === "experience" ? "" : "experience"
                        )
                      }
                    >
                      Experience
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className={`accordion-collapse collapse ${
                      activeSection === "experience" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-experience"
                  >
                    <div className="accordion-body">
                      {coachData?.experience ? (
                        <div className="text show-more-height">
                          <p className="mb-1">
                            <strong className="experience-years">
                              {coachData.experience}+ Years
                            </strong>{" "}
                            of Experience
                          </p>
                          <p className="mb-0">
                            Coaching players at various skill levels.
                          </p>
                        </div>
                      ) : (
                        <p className="mb-0">Experience details not provided yet.</p>
                      )}
                    </div>
                  </div>
                </div>



                <div className="accordion-item mb-4" id="specializations">
                  <h4 className="accordion-header" id="panelsStayOpen-specializations">
                    <button
                      className={`accordion-button ${
                        activeSection === "specializations" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "specializations"}
                      aria-controls="panelsStayOpen-collapseFour"
                      onClick={() =>
                        setActiveSection(
                          activeSection === "specializations" ? "" : "specializations"
                        )
                      }
                    >
                      Specializations
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFour"
                    className={`accordion-collapse collapse ${
                      activeSection === "specializations" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-specializations"
                  >
                    <div className="accordion-body">
                      {specializationsList.length > 0 ? (
                        <div className="d-flex flex-wrap">
                          {specializationsList.map((spec, index) => (
                            <span className="spec-chip" key={index}>
                              <i className="feather-check-circle" />
                              {spec}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-0">No specializations listed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="availability">
                  <h4 className="accordion-header" id="panelsStayOpen-availability">
                    <button
                      className={`accordion-button ${
                        activeSection === "availability" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "availability"}
                      aria-controls="panelsStayOpen-collapseAvail"
                      onClick={() =>
                        setActiveSection(activeSection === "availability" ? "" : "availability")
                      }
                    >
                      Daily Availability
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseAvail"
                    className={`accordion-collapse collapse ${
                      activeSection === "availability" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-availability"
                  >
                    <div className="accordion-body">
                      {dailyAvailability.length > 0 ? (
                        <div className="row g-2">
                          {dailyAvailability.map((avail: any, idx: number) => (
                            <div className="col-sm-6" key={idx}>
                              <div
                                className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3 mb-2"
                                style={{ background: "#F0FDF4", border: "1px solid #DCFCE7" }}
                              >
                                <span className="fw-bold" style={{ color: "#166534", fontSize: "13px" }}>
                                  <i className="feather-calendar me-1" /> {avail.day || avail.day_of_week || "—"}
                                </span>
                                <span style={{ color: "#334155", fontSize: "13px", fontWeight: "600" }}>
                                  {avail.startTime || avail.start_time || "—"} - {avail.endTime || avail.end_time || "—"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-0">Daily availability timings not provided yet.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="rules">
                  <h4 className="accordion-header" id="panelsStayOpen-rules">
                    <button
                      className={`accordion-button ${
                        activeSection === "rules" ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeSection === "rules"}
                      aria-controls="panelsStayOpen-collapseFive"
                      onClick={() =>
                        setActiveSection(activeSection === "rules" ? "" : "rules")
                      }
                    >
                      Policies & Rules
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className={`accordion-collapse collapse ${
                      activeSection === "rules" ? "show" : ""
                    }`}
                    aria-labelledby="panelsStayOpen-rules"
                  >
                    <div className="accordion-body">
                      {coachData?.policiesAndRules ? (
                        <div
                          className="mb-4 overflow-auto"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(coachData.policiesAndRules),
                          }}
                        />
                      ) : (
                        <p className="mb-0">No policies &amp; rules provided yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="accordion-item mb-4" id="short-bio">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-short-bio"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      Short Bio
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-short-bio"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        <p className="mb-4"> {coachData?.bio}</p>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="accordion-item mb-4" id="gallery">
                  <h4 className="accordion-header" id="panelsStayOpen-gallery">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      Gallery
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-gallery"
                  >
                    <div className="accordion-body">
                      <div className="gallery-slider owl-theme">
                        <Slider {...featuredVenuesSlider}>
                          {coaches.map((coach, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                              <div className="featured-venues-item">
                                <div className="listing-item listing-item-grid">
                                  <div
                                    className="listing-img"
                                    style={{ height: "300px" }}
                                  >
                                    <Link to={routes.coachDetail}>
                                      <ImageWithBasePath
                                        src={
                                          coach?.gallery && coach.gallery.length > 0
                                            ? `${IMG_URL}${coach.gallery[0].src}`
                                            : "/assets/img/no-img.png"
                                        }
                                      />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="accordion-item mb-4" id="reviews">
                  <div className="accordion-header" id="panelsStayOpen-reviews">
                    <div
                      className="accordion-button d-flex justify-content-between align-items-center"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSix"
                      aria-controls="panelsStayOpen-collapseSix"
                    >
                      <span className="w-75 mb-0">Reviews</span>
                    </div>
                    <Link
                      to="#;"
                      className="btn btn-gradient pull-right write-review add-review"
                      data-bs-toggle="modal"
                      data-bs-target="#add-review"
                    >
                      Write a review
                    </Link>
                  </div>
                  <div
                    id="panelsStayOpen-collapseSix"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-reviews"
                  >
                    <div className="accordion-body">
                      <div className="row review-wrapper">
                        <div className="col-lg-3">
                          <div className="ratings-info corner-radius-10 text-center">
                            <h3>4.8</h3>
                            <span>out of 5.0</span>
                            <div className="rating">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-9">
                          <div className="recommended">
                            <h5>Recommended by 97% of Players</h5>
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-01.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </div>
                        <div className="review-info">
                          <h6 className="mb-2 tittle">
                            Amanda Booked on 06/04/2023
                          </h6>
                          <div className="rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <span >5.0</span>
                          </div>
                          <span className="success-text">
                            <i className="feather-check" />
                            Yes, I would book again.
                          </span>
                          <h6>Absolutely Perfect</h6>
                          <p>
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
                          </p>
                          <ul className="d-flex">
                            <Lightbox
                              open={open}
                              close={() => setOpen(false)}
                              slides={[
                                { src: "/assets/img/gallery/gallery-01.jpg" },
                                { src: "/assets/img/gallery/gallery-02.jpg" },
                                { src: "/assets/img/gallery/gallery-03.jpg" },
                                { src: "/assets/img/gallery/gallery-04.jpg" },
                                { src: "/assets/img/gallery/gallery-05.jpg" },
                              ]}
                            />
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-01.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-01.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-02.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-02.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-03.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-03.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-04.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-04.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-05.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-05.jpg"
                                />
                              </Link>
                            </li>
                          </ul>
                          <span className="post-date">Sent on 11/03/2023</span>
                        </div>
                      </div>
                      
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-06.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </div>
                        <div className="review-info">
                          <h6 className="mb-2 tittle">
                            Amanda Booked on 06/04/2023
                          </h6>
                          <div className="rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <span className="">5.0</span>
                          </div>
                          <span className="warning-text">
                            <i className="feather-x" />
                            No, I dont want to book again.
                          </span>
                          <h6>Awesome. Its very convenient to play.</h6>
                          <p>
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
                          </p>
                          <div className="dull-bg">
                            <p>
                              Experience badminton excellence at Badminton
                              Academy. Top-notch facilities, well-maintained
                              courts, and a friendly atmosphere. Highly
                              recommended for an exceptional playing experience
                            </p>
                          </div>
                        </div>
                      </div>
                    
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-load-more d-flex justify-content-center align-items-center"
                        >
                          Load More
                          <i className="feather-plus-square" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="accordion-item mb-0" id="location">
                  <h4 className="accordion-header" id="panelsStayOpen-location">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSeven"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseSeven"
                    >
                      Location
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseSeven"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-location"
                  >
                    <div className="accordion-body">
                      <div className="google-maps">
                        {coachData?.location?.google_location ? (
                          <iframe
                            src={coachData?.location?.google_location}
                            height={445}
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          "No Google Location"
                        )}
                      </div>
                     
                    </div>
                  </div>
                </div> */}
              </div>
              {/* Accordian Contents */}
            </div>
            {/* ))} */}
            <aside className="col-12 col-sm-12 col-md-12 col-lg-4 theiaStickySidebar">
              <div className="stickybar">
                <div className="white-bg book-coach">
                  <h4 className="border-bottom">Book A Coach</h4>
                  <p className="d-flex align-items-center flex-wrap">
                    <strong>{coachName || "This Coach"}</strong>
                    <span className="availability-badge ms-2">
                      <i className="feather-check" /> Available Now
                    </span>
                  </p>
                  <div className="dull-bg text-center">
                    <p className="mb-1">Starts From</p>
                    {formattedPrice ? (
                      <>
                        <h4 className="d-inline-block primary-text mb-0">
                          {formattedPrice}
                        </h4>
                        <span>/hr</span>
                      </>
                    ) : (
                      <h4 className="d-inline-block primary-text mb-0">
                        Contact for Pricing
                      </h4>
                    )}
                  </div>
                  {/* Packages before Book Now */}
                  {coachData?.package && (Object.values(coachData.package).some((v: any) => v) || coachData.package_type) ? (
                    <div className="mt-3">
                      <p className="mb-2 fw-bold" style={{ fontSize: "13px", color: "#475569" }}>
                        <i className="feather-gift me-1" style={{ color: "#16A34A" }} /> Packages
                      </p>
                      <div className="d-flex flex-column gap-2">
                        {(Object.keys(coachData.package || {}) as string[]).map((key) => {
                          const val = coachData.package[key];
                          if (!val) return null;
                          return (
                            <div
                              key={key}
                              className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
                              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                            >
                              <span className="text-muted" style={{ fontSize: "13px", fontWeight: "600", textTransform: "capitalize" }}>{key}</span>
                              <strong style={{ color: "#16A34A", fontSize: "14px" }}>{formatPrice(val)}</strong>
                            </div>
                          );
                        })}
                        {coachData.package_type && (
                          <div className="px-3 py-2 rounded-3" style={{ background: "#F0FDF4", border: "1px dashed #DCFCE7", fontSize: "12px", color: "#166534", fontWeight: "600" }}>
                            {coachData.package_type}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="d-grid mt-3 gap-2">
                    <button
                      onClick={() => checkToken(id)}
                      className="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                    >
                      <i className="feather-calendar" />
                      Book Now
                    </button>
                    <button
                      onClick={() => handleChat(id)}
                      className="btn d-inline-flex justify-content-center align-items-center"
                      style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "#FFFFFF", fontWeight: "600", border: "none", borderRadius: "8px" }}
                    >
                      <i className="feather-message-circle" />
                      Message Coach
                    </button>
                  </div>
                  {/* Response time + profile views + share */}
                  <div className="d-flex align-items-center justify-content-between mt-3 pt-3" style={{ borderTop: "1px dashed #E2E8F0" }}>
                    {coachData?.response_time ? (
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#64748B" }}>
                        <i className="feather-clock" style={{ color: "#16A34A" }} />
                        Responds in <strong style={{ color: "#0F172A" }}>&nbsp;{coachData.response_time}</strong>
                      </span>
                    ) : <span />}
                    {profileViews > 0 ? (
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#64748B" }}>
                        <i className="feather-eye" style={{ color: "#16A34A" }} />
                        {profileViews.toLocaleString("en-IN")} views
                      </span>
                    ) : <span />}
                  </div>
                  <button
                    onClick={generateShareLink}
                    className="btn btn-outline-success d-inline-flex justify-content-center align-items-center gap-2 mt-2 w-100"
                    style={{ borderColor: "#22C55E", color: "#16A34A", fontWeight: "600", fontSize: "13px", borderRadius: "8px" }}
                  >
                    <i className={shareCopied ? "feather-check" : "feather-share-2"} />
                    {shareCopied ? "Link Copied!" : "Share Profile"}
                  </button>
                  {/* Social media */}
                  {Object.values(socialMedia).some((v: any) => v) ? (
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-3 pt-3" style={{ borderTop: "1px dashed #E2E8F0" }}>
                      {socialMedia.facebook && (
                        <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: "#F0FDF4", color: "#16A34A" }}>
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                      )}
                      {socialMedia.instagram && (
                        <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: "#F0FDF4", color: "#16A34A" }}>
                          <i className="fa-brands fa-instagram" />
                        </a>
                      )}
                      {socialMedia.youtube && (
                        <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: "#F0FDF4", color: "#16A34A" }}>
                          <i className="fa-brands fa-youtube" />
                        </a>
                      )}
                      {socialMedia.twitter && (
                        <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: "#F0FDF4", color: "#16A34A" }}>
                          <i className="fa-brands fa-twitter" />
                        </a>
                      )}
                      {socialMedia.linkedin && (
                        <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: "#F0FDF4", color: "#16A34A" }}>
                          <i className="fa-brands fa-linkedin-in" />
                        </a>
                      )}
                    </div>
                  ) : null}
                </div>
                {/* <div className="white-bg next-availability">
                  <div className="d-flex justify-content-start align-items-center">
                    <span className="icon-bg-40 d-flex justify-content-center align-items-center">
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Icon"
                        src="/assets/img/icons/head-calendar.svg"
                      />
                    </span>
                    <h4 className="mb-0">Next Availability</h4>
                  </div>
                  <ul className="clearfix">
                    <li>Thu, Sept 24 @ 3 PM</li>
                    <li>Fri, Sept 25 @ 3 PM</li>
                    <li>Sat, Sept 26 @ 3 PM</li>
                    <li>Sun, Sept 27 @ 3 PM</li>
                  </ul>
                </div> */}
                {/* <div className="white-bg">
                  <h4 className="border-bottom">Request for Availability</h4>
                  <form>
                    <div className="mb-10">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter Name"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email Address"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="name" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="court" className="form-label">
                        Court
                      </label>
                      <Dropdown
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cityOptions}
                        optionLabel="name"
                        placeholder="Select City"
                        className="select city-select"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="comments" className="form-label">
                        Details
                      </label>
                      <textarea
                        className="form-control"
                        id="comments"
                        rows={3}
                        placeholder="Enter Comments"
                        defaultValue={""}
                      />
                    </div>
                    <div className="form-check d-flex justify-content-start align-items-center policy">
                      <div className="d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue={true}
                          id="policy"
                          defaultChecked
                        />
                      </div>
                      <label className="form-check-label" htmlFor="policy">
                        By clicking &apos;Send Request&apos;, I agree to
                        KheloIndore Privacy Policy and Terms of Use
                      </label>
                    </div>
                    <div className="d-grid btn-block">
                      <Link
                        to="#"
                        className="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                      >
                        Send Request
                        <i className="feather-arrow-right-circle ms-1" />
                      </Link>
                    </div>
                </div>
                {/* <div className="white-bg listing-owner">
                  <h4 className="border-bottom">Listing By Owner</h4>
                  <ul>
                    <li className="d-flex justify-content-start align-items-center">
                      <div className="">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Post"
                            src="/assets/img/listing-by-owner-01.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to={routes.blogDetails}>
                            Manchester Academy
                          </Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next availablity : </span>
                          <span className="primary-text">15 May 2023</span>
                        </p>
                      </div>
                    </li>
                    <li className="d-flex justify-content-start align-items-center">
                      <div className="">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Post"
                            src="/assets/img/listing-by-owner-02.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to={routes.blogDetails}>
                            Sarah Sports Academy
                          </Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next availablity : </span>
                          <span className="primary-text">15 May 2023</span>
                        </p>
                      </div>
                    </li>
                </div> */}
                {/* <div className="white-bg">
                  <h4 className="border-bottom">Share Venue</h4>
                  <ul className="social-medias d-flex">
                    <li className="facebook">
                      <Link to="#;">
                        <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                    <li className="instagram">
                      <Link to="#;">
                        <i className="fa-brands fa-instagram" />
                      </Link>
                    </li>
                    <li className="behance">
                      <Link to="#;">
                        <i className="fa-brands fa-behance" />
                      </Link>
                    </li>
                    <li className="twitter">
                      <Link to="#;">
                        <i className="fa-brands fa-twitter" />
                      </Link>
                    </li>
                    <li className="pinterest">
                      <Link to="#;">
                        <i className="fa-brands fa-pinterest" />
                      </Link>
                    </li>
                    <li className="linkedin">
                      <Link to="#;">
                        <i className="fa-brands fa-linkedin" />
                      </Link>
                    </li>
                  </ul>
                  <div>
                    <div className="price-wrap aos" data-aos="fade-up">
                      <div className="row justify-content-center">
                        <div className="col-lg-4 d-flex col-md-6">
                          
                          <div className="price-card flex-fill ">
                            <div className="price-head">
                              <ImageWithBasePath
                                src="/assets/img/icons/price-01.svg"
                                alt="Price"
                              />
                              <h3>{coachData?.package.package_type}</h3>
                            </div>
                            <div className="price-body">
                              <div className="per-month">
                                <h2>
                                  <sup>$</sup>
                                  <span>{coachData?.package.price} </span>
                                </h2>
                                <span>Per Month</span>
                              </div>
                              <div className="features-price-list">
                                <h5>{coachData?.package.name}</h5>
                                <p>Everything in our free Upto 10 users. </p>
                                <ul>
                                  <li className="active">
                                    <i className="feather-check-circle" />
                                    duration: {coachData?.package.duration}
                                  </li>
                                  <li className="active">
                                    <i className="feather-check-circle" />
                                    focus_area: {coachData?.package.focus_area}
                                  </li>
                                  <li className="active">
                                    <i className="feather-check-circle" />
                                    number_of_sessions:{coachData?.package.number_of_sessions}
                                  </li>
                                  <li className="inactive">
                                    <i className="feather-x-circle" />
                                    Add Listing{" "}
                                  </li>
                                  <li className="inactive">
                                    <i className="feather-x-circle" />
                                    Approval of Listing
                                  </li>
                                </ul>
                              </div>
                              <div className="price-choose">
                                <Link to="#" className="btn viewdetails-btn">
                                  Choose Plan
                                </Link>
                              </div>
                              <div className="price-footer">
                                <p>
                                  Use, by you or one client, in a single end product which
                                  end users. charged for. The total price includes the
                                  item price and a buyer fee.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </aside>
          </div>
          {/* /Row */}
        </div>
        {/* /container */}
        {/* <section className="section innerpagebg">
          <section className="section innerpagebg">
            <div className="container">
              <div className="featured-slider-group">
                <h3 className="mb-40">Similar Coaches</h3>
                <div className="featured-venues-slider owl-theme">
                  <Slider {...featuredVenuesSlider}>
                    {coaches.map((coach, index) => (
                      <div className="col-lg-4 col-md-6" key={index}>
                        <div className="featured-venues-item">
                          <div className="listing-item listing-item-grid">
                            <div
                              className="listing-img"
                              style={{ height: "300px" }}
                            >
                              <Link to={routes.coachDetail}>
                                <ImageWithBasePath
                                  src={
                                    coach?.profile_picture[0]?.src
                                      ? `${IMG_URL}${coach.profile_picture[0].src}`
                                      : "assets/img/profiles/avatar-06.jpg"
                                  }
                                />
                              </Link>
                              <div
                                className="fav-item-venues"
                                onClick={() => handleItemClick(index)}
                              >
                                <span className="tag tag-blue">
                              {coach.category}
                                </span>
                                <div className="list-reviews coche-star">
                                  <Link
                                    to="#"
                                    className={`fav-icon ${
                                      selectedItems[index] ? "selected" : ""
                                    }`}
                                  >
                                    <i className="feather-heart" />
                                  </Link>
                                </div>
                              </div>
                              <div className="hour-list">
                                <h5 className="tag tag-primary">
                                  From ₹{coach.price}<span>/hr</span>
                                </h5>
                              </div>
                            </div>
                            <div className="listing-content">
                              <h3 className="listing-title">
                                <Link to={routes.coachDetail}>
                                  {coach.first_name} {coach.last_name}
                                </Link>
                              </h3>
                              <ul className="mb-2">
                                <li>
                                  <span>
                                    <i className="feather-map-pin me-2" />
                                    {coach?.location?.city},{" "}
                                    {coach?.location?.state}
                                  </span>
                                </li>
                              </ul>
                              <div className="listing-details-group">
                              
                                <p>
                                  Specializations:{" "}
                                  {coach.specializations.join(", ")}
                                </p>
                              </div>
                              <div className="coach-btn">
                                <ul>
                                  <li>
                                    <Link
                                      to={`/coaches/coach-detail/${coach._id}`}
                                      className="btn btn-primary w-100"
                                    >
                                      <i className="feather-eye me-2" />
                                      View Profile
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to={`/coaches/coach-timedate/${coach._id}`}
                                      className="btn btn-secondary w-100"
                                    >
                                      <i className="feather-calendar me-2" />
                                      Book Now
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="avalbity-review">
                                <ul>
                                  <li>
                                    <div className="avalibity-date">
                                      <span>
                                        <i className="feather-calendar" />
                                      </span>
                                      <div className="avalibity-datecontent">
                                        <h6>Next Availability</h6>
                                        <h5>{coach.availability}</h5>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="list-reviews mb-0">
                                      <div className="d-flex align-items-center">
                                        <span className="rating-bg">4.5</span>
                                        <span>80 Reviews</span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </section>
        </section> */}
      </div>
      {/* /Page Content */}
      {/* Add Review Modal */}
      <div
        className="modal custom-modal fade payment-modal"
        id="add-review"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">Write a Review</h4>
              </div>
              <Link
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                to={""}
              >
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="input-space">
                      <label className="form-label">
                        Your Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="reviewer-name"
                        placeholder="Enter Your Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="input-space">
                      <label className="form-label">Title of your review</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="If you could say it in one sentence, what would you say?"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="input-space">
                      <label className="form-label">
                        Your Review <span>*</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="review"
                        rows={3}
                        placeholder="Enter Your Review"
                        defaultValue={""}
                      />
                      <small className="text-muted">
                        <span id="chars">100</span> characters remaining
                      </small>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="input-space review">
                      <label className="form-label">
                        Rating <span>*</span>
                      </label>
                      <div className="star-rating">
                        <input
                          id="star-5"
                          type="radio"
                          name="rating"
                          defaultValue="star-5"
                        />
                        <label htmlFor="star-5" title="5 stars">
                          <i className="active fa fa-star" />
                        </label>
                        <input
                          id="star-4"
                          type="radio"
                          name="rating"
                          defaultValue="star-4"
                        />
                        <label htmlFor="star-4" title="4 stars">
                          <i className="active fa fa-star" />
                        </label>
                        <input
                          id="star-3"
                          type="radio"
                          name="rating"
                          defaultValue="star-3"
                        />
                        <label htmlFor="star-3" title="3 stars">
                          <i className="active fa fa-star" />
                        </label>
                        <input
                          id="star-2"
                          type="radio"
                          name="rating"
                          defaultValue="star-2"
                        />
                        <label htmlFor="star-2" title="2 stars">
                          <i className="active fa fa-star" />
                        </label>
                        <input
                          id="star-1"
                          type="radio"
                          name="rating"
                          defaultValue="star-1"
                        />
                        <label htmlFor="star-1" title="1 star">
                          <i className="active fa fa-star" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="terms-accept">
                      <div className="d-flex align-items-center form-check">
                        <input
                          type="checkbox"
                          id="terms_accept"
                          className="form-check-input"
                        />
                        <label htmlFor="terms_accept">
                          I have read and accept{" "}
                          <Link to={routes.termsCondition}>
                            Terms &amp; Conditions
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Add Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Review Modal */}
      {/* Share Modal */}
      {isShareOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "20px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              <div className="modal-header border-0 pb-0 justify-content-between align-items-center px-4 pt-4">
                <h5 className="modal-title fw-bold" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px" }}>Share Coach</h5>
                <button type="button" className="btn-close opacity-50" onClick={() => setIsShareOpen(false)} aria-label="Close" style={{ fontSize: "14px", border: "none", background: "none" }}><i className="feather-x" /></button>
              </div>
              <div className="modal-body px-4 py-3">
                <p className="text-muted mb-3" style={{ fontSize: "13px" }}>Share this coach profile with your friends!</p>
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex flex-column align-items-center text-decoration-none"
                    style={{ width: "60px" }}
                  >
                    <div className="d-flex align-items-center justify-content-center text-white rounded-circle mb-1" style={{ width: "45px", height: "45px", backgroundColor: "#1877F2" }}>
                      <i className="fa-brands fa-facebook-f" style={{ fontSize: "18px" }} />
                    </div>
                    <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>Facebook</span>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out coach ${coachName || ""} on Khelo Indore!`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="d-flex flex-column align-items-center text-decoration-none"
                    style={{ width: "60px" }}
                  >
                    <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle mb-1" style={{ width: "45px", height: "45px" }}>
                      <i className="fa-brands fa-x-twitter" style={{ fontSize: "18px" }} />
                    </div>
                    <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>X / Twitter</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setIsShareOpen(false);
                      Swal.fire({
                        icon: "success",
                        title: "Copied!",
                        text: "Link copied to clipboard",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    }}
                    type="button"
                    className="d-flex flex-column align-items-center text-decoration-none border-0 bg-transparent"
                    style={{ width: "60px" }}
                  >
                    <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-1" style={{ width: "45px", height: "45px" }}>
                      <i className="feather-copy" style={{ fontSize: "18px" }} />
                    </div>
                    <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDetail;
