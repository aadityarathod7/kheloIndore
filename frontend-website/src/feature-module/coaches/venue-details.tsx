import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";
import Loader from "../loader/loader";
import "../../style/css/venue_details.css";
import { all_routes } from "../router/all_routes";

interface VenueData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  amenities: any;
  activities: string;
  category: string;
  images: any;
  facilities: any;
  src: any;
  google_location: string;
  open_at: any;
  close_at: any;
  data: any;
  vendor_id: number;
  key: any;
  description: any;
  gameType: any;
  additionalNotes: any;
  policiesAndRules: any;
}

const VenueDetails = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [venueType, setVenueType] = useState<VenueData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("overview");

  const overviewRef = useRef(null);
  const includesRef = useRef(null);
  const rulesRef = useRef(null);
  const timingsRef = useRef(null);
  const facilitiesRef = useRef(null);
  const additionalNotesRef = useRef(null);
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const idData = useParams();
  const id = idData.id;
  const name = idData.name;
  const type = idData.type; 

  const [isFavourite, setIsFavourite] = useState<boolean>(() => {
    if (!id) return false;
    return localStorage.getItem(`fav_venue_${id}`) === "true";
  });

  const handleToggleFavourite = () => {
    const nextStatus = !isFavourite;
    setIsFavourite(nextStatus);
    if (id) {
      localStorage.setItem(`fav_venue_${id}`, String(nextStatus));
    }

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: nextStatus ? "Saved to Favourites!" : "Removed from Favourites",
      text: nextStatus ? "Venue added to your favorites list." : "Venue removed from your favorites list.",
      timer: 2000,
      showConfirmButton: false,
      confirmButtonColor: "#22C55E"
    });
  };
  

  const scrollToRef = (ref: any) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  
  
  
  useEffect(() => {
    const fetchVenueId = async () => {
      try {
        const response = await axios.get(`${API_URL}/venue/individual/${id}`);
        const venueData = response.data.venue;
        setVenueData(venueData);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching venues:", error);
        setLoading(false)
      }
    };
    fetchVenueId();
  }, []);
  
  useEffect(() => {
    if (venueData && venueData.data && typeof venueData.data === 'object') {
      const keys = Object.keys(venueData.data);
      if (keys.length > 0) {
        const nameofkey = keys[0];
        const nameofgame = venueData.data[nameofkey];
        setVenueType(nameofgame);
      }
    }
  }, [venueData]);
  
  useEffect(() => {
       document.title = `Sports Venue - ${type}/${name}/${id}}`;  
   }, []);
  
  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: venueData?.name || "Khelo Indore Venue",
        text: `Check out ${venueData?.name} on Khelo Indore!`,
        url: shareUrl,
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Venue profile link has been copied to your clipboard.",
        timer: 2000,
        showConfirmButton: false,
        background: "#0d1b2a",
        color: "#fff",
        confirmButtonColor: "#00E676"
      });
    }
  };
  
  const handleImageClick = (index: number) => {
    const imageUrl = venueData?.images[index]?.src
      ? `${IMG_URL}${venueData.images[index]?.src}`
      : "assets/img/venues/venues-01.jpg";

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Image preview',
      width: '60%',
      padding: '1rem',
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const handleBookNow = async (e:any) => {
    e.preventDefault();
    console.log("click -=-=-=-")
    const token = localStorage.getItem("token");
    console.log(token, "token")
    if (token) {
      navigate(`/sports-venue/venue-timedate/${id}`);
    } else {
      Swal.fire({
        title: "Please Log In",
        text: "In order to book a venue, you must log in.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login",
            { state: { URL: location.pathname } }
          )
        }
      });
    }

  }


  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Hero CSS overrides */}
          <style dangerouslySetInnerHTML={{__html: `
            .venue-hero-section { background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%) !important; }
            .venue-hero-section h1 { color: #0F172A !important; font-weight: 800 !important; }
            .venue-hero-section h1 span { color: #22C55E !important; }
            .venue-hero-section p { color: #64748B !important; }
            .venue-hero-section span.tagline { color: #22C55E !important; font-weight: 700 !important; }
            .venue-hero-section a { color: #64748B !important; text-decoration: none !important; }
            .venue-hero-section .breadcrumb-pill span.active-crumb { color: #22C55E !important; font-weight: 600 !important; }
            .venue-hero-section .breadcrumb-pill i { color: #64748B !important; }
          `}} />

          {/* Hero Section - matches listing pages */}
          <div className="venue-hero-section" style={{ paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className="row align-items-center">
                <div className="col-lg-7 text-start">
                  <span className="tagline" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
                  <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.15", marginBottom: "16px" }}>
                    <span style={{ color: "#22C55E", marginRight: "12px" }}>Sports</span> Venue
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>
                    {venueData?.name || (name ? name.replaceAll('-', ' ') : "Venue Details")}
                  </p>
                  {/* Breadcrumb pill */}
                  <div className="breadcrumb-pill d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                    <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>
                      <i className="feather-home me-1" style={{ color: "#64748B" }} /> Home
                    </Link>
                    <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                    <Link to={routes.blogListSidebarLeft} style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Sports Venues</Link>
                    <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                    <span className="active-crumb text-capitalize" style={{ color: "#22C55E", fontWeight: "600" }}>
                      {venueData?.name || (name ? name.replaceAll('-', ' ') : "Venue Details")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="khelo-pro-wrapper" style={{ paddingTop: "32px" }}>
            <div className="max-container">

            {/* 2. MAIN 2-COLUMN LAYOUT (Left 70% / Right 30%) */}
            <div className="row g-4">
              {/* LEFT COLUMN (70% / 8 Cols) */}
              <div className="col-lg-8">
                {/* A. Bento Hero Gallery */}
                <div className="row g-3 mb-4">
                  {/* Main Featured Big Image */}
                  <div className={venueData?.images && venueData.images.length >= 2 ? "col-md-8" : "col-12"}>
                    <div className="bento-hero-main">
                      {/* Ambient Blurred Background */}
                      <img
                        src={venueData?.images && venueData.images[0] ? `${IMG_URL}${venueData.images[0].src}` : "/assets/img/venues/venue-01.jpg"}
                        alt="Ambient backdrop"
                        className="ambient-bg"
                        onError={(e: any) => {
                          e.target.src = "/assets/img/venues/venue-01.jpg";
                        }}
                      />
                      {/* Full Uncropped Main Image */}
                      <img
                        src={venueData?.images && venueData.images[0] ? `${IMG_URL}${venueData.images[0].src}` : "/assets/img/venues/venue-01.jpg"}
                        alt={venueData?.name}
                        className="full-hero-img"
                        onClick={() => handleImageClick(0)}
                        onError={(e: any) => {
                          e.target.src = "/assets/img/venues/venue-01.jpg";
                        }}
                      />
                      {/* Featured Badge */}
                      <div className="position-absolute top-0 start-0 p-3" style={{ zIndex: 10 }}>
                        <span className="badge bg-success text-white px-3.5 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", fontWeight: 700 }}>
                          ⭐ Featured
                        </span>
                      </div>
                      {/* Top-Right Action Buttons: Share & Favorite */}
                      <div className="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2" style={{ zIndex: 10 }}>
                        <button
                          type="button"
                          className="glass-icon-btn"
                          onClick={handleShare}
                          title="Share Venue"
                        >
                          <i className="fas fa-share-alt" />
                        </button>
                        <button
                          type="button"
                          className={`glass-icon-btn ${isFavourite ? "active-fav" : ""}`}
                          onClick={handleToggleFavourite}
                          title={isFavourite ? "Remove from Favourites" : "Save to Favourites"}
                        >
                          <i className={isFavourite ? "fas fa-heart text-danger" : "far fa-heart text-white"} />
                        </button>
                      </div>
                      {/* Bottom Overlay Container */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0 text-white"
                        style={{ background: "linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0) 85%)", padding: "20px", zIndex: 10 }}
                      >
                        <h1 className="venue-hero-title mb-2 text-capitalize">
                          {venueData?.name || (name ? name.replaceAll('-', ' ') : "Sports Venue")}
                        </h1>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span className="glass-pill">
                            📍 {venueData?.address ? `${venueData.address}, ${venueData.city || ''}` : "Indore, Madhya Pradesh"}
                          </span>
                          <span className="glass-pill">
                            ⭐ 4.8 (128 Reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 2 Stacked Gallery Thumbnails */}
                  {venueData?.images && venueData.images.length >= 2 && (
                    <div className="col-md-4 d-flex flex-column gap-3">
                      <div className="bento-hero-thumb">
                        <img
                          src={`${IMG_URL}${venueData.images[1]?.src}`}
                          alt="Ambient thumbnail 1"
                          className="ambient-bg"
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-02.jpg";
                          }}
                        />
                        <img
                          src={`${IMG_URL}${venueData.images[1]?.src}`}
                          alt="Venue thumbnail 1"
                          className="full-hero-img"
                          onClick={() => handleImageClick(1)}
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-02.jpg";
                          }}
                        />
                      </div>
                      <div className="bento-hero-thumb">
                        <img
                          src={venueData.images[2] ? `${IMG_URL}${venueData.images[2]?.src}` : `${IMG_URL}${venueData.images[0]?.src}`}
                          alt="Ambient thumbnail 2"
                          className="ambient-bg"
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-03.jpg";
                          }}
                        />
                        <img
                          src={venueData.images[2] ? `${IMG_URL}${venueData.images[2]?.src}` : `${IMG_URL}${venueData.images[0]?.src}`}
                          alt="Venue thumbnail 2"
                          className="full-hero-img"
                          onClick={() => handleImageClick(venueData.images[2] ? 2 : 0)}
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-03.jpg";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* B. NAVIGATION TABS (Immediately follows Hero Gallery!) */}
                <div className="tabs-container-card">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`pro-tab-pill ${activeTab === "overview" ? "active" : "inactive"}`}
                    style={{
                      background: activeTab === "overview" ? "#22C55E" : "#F1F5F9",
                      color: activeTab === "overview" ? "#FFFFFF" : "#1E293B",
                      border: activeTab === "overview" ? "none" : "1px solid #E2E8F0"
                    }}
                  >
                    <i className="fas fa-info-circle" style={{ color: activeTab === "overview" ? "#FFFFFF" : "#22C55E" }} />
                    <span>Overview</span>
                  </button>

                  {venueData?.gameType && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("game")}
                      className={`pro-tab-pill ${activeTab === "game" ? "active" : "inactive"}`}
                      style={{
                        background: activeTab === "game" ? "#22C55E" : "#F1F5F9",
                        color: activeTab === "game" ? "#FFFFFF" : "#1E293B",
                        border: activeTab === "game" ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      <i className="fas fa-volleyball-ball" style={{ color: activeTab === "game" ? "#FFFFFF" : "#22C55E" }} />
                      <span>Game Type</span>
                    </button>
                  )}

                  {venueData?.amenities && venueData.amenities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("amenities")}
                      className={`pro-tab-pill ${activeTab === "amenities" ? "active" : "inactive"}`}
                      style={{
                        background: activeTab === "amenities" ? "#22C55E" : "#F1F5F9",
                        color: activeTab === "amenities" ? "#FFFFFF" : "#1E293B",
                        border: activeTab === "amenities" ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      <i className="fas fa-check-circle" style={{ color: activeTab === "amenities" ? "#FFFFFF" : "#22C55E" }} />
                      <span>Amenities ({venueData.amenities.length})</span>
                    </button>
                  )}

                  {venueData?.facilities && venueData.facilities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("facilities")}
                      className={`pro-tab-pill ${activeTab === "facilities" ? "active" : "inactive"}`}
                      style={{
                        background: activeTab === "facilities" ? "#22C55E" : "#F1F5F9",
                        color: activeTab === "facilities" ? "#FFFFFF" : "#1E293B",
                        border: activeTab === "facilities" ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      <i className="fas fa-building" style={{ color: activeTab === "facilities" ? "#FFFFFF" : "#22C55E" }} />
                      <span>Facilities ({venueData.facilities.length})</span>
                    </button>
                  )}

                  {venueData?.policiesAndRules && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("rules")}
                      className={`pro-tab-pill ${activeTab === "rules" ? "active" : "inactive"}`}
                      style={{
                        background: activeTab === "rules" ? "#22C55E" : "#F1F5F9",
                        color: activeTab === "rules" ? "#FFFFFF" : "#1E293B",
                        border: activeTab === "rules" ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      <i className="fas fa-gavel" style={{ color: activeTab === "rules" ? "#FFFFFF" : "#22C55E" }} />
                      <span>Rules & Policies</span>
                    </button>
                  )}

                  {venueData?.additionalNotes && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("notes")}
                      className={`pro-tab-pill ${activeTab === "notes" ? "active" : "inactive"}`}
                      style={{
                        background: activeTab === "notes" ? "#22C55E" : "#F1F5F9",
                        color: activeTab === "notes" ? "#FFFFFF" : "#1E293B",
                        border: activeTab === "notes" ? "none" : "1px solid #E2E8F0"
                      }}
                    >
                      <i className="fas fa-sticky-note" style={{ color: activeTab === "notes" ? "#FFFFFF" : "#22C55E" }} />
                      <span>Notes</span>
                    </button>
                  )}
                </div>

                {/* C. Active Tab Content Card */}
                <div className="pro-card">
                  {activeTab === "overview" && (
                    <div>
                      {/* Card 1: About this Venue */}
                      <h2 className="section-title">About this Venue</h2>
                      <div
                        dangerouslySetInnerHTML={{ __html: venueData?.description || "No description available." }}
                        className="body-text mb-4"
                      />

                      <hr className="my-4" style={{ borderColor: "#E5E7EB" }} />

                      {/* Card 2: Venue Specifications */}
                      {venueType && venueType.length > 0 && (
                        <div>
                          <h3 className="card-title-head">Venue Specifications</h3>
                          <div className="row row-cols-2 row-cols-md-5 g-3">
                            {venueType.map((spec: any, index: any) => {
                              const k = spec.key.toLowerCase();
                              let iconClass = "fas fa-th-large";
                              const defaultTitle = spec.key.replaceAll('_', ' ');
                              let unit = "Feet";
                              if (k.includes("area")) { iconClass = "fas fa-vector-square"; unit = "sq ft"; }
                              if (k.includes("length")) { iconClass = "fas fa-arrows-alt-h"; unit = "ft"; }
                              if (k.includes("height")) { iconClass = "fas fa-arrows-alt-v"; unit = "ft"; }
                              if (k.includes("width")) { iconClass = "fas fa-arrows-alt-h"; unit = "ft"; }
                              if (k.includes("surface") || k.includes("type")) { iconClass = "fas fa-layer-group"; unit = "Turf"; }

                              return (
                                <div className="col" key={index}>
                                  <div className="pro-spec-card">
                                    <div className="icon-circle">
                                      <i className={iconClass} />
                                    </div>
                                    <span className="spec-label text-truncate w-100">
                                      {defaultTitle}
                                    </span>
                                    <span className="spec-val text-truncate w-100">
                                      {Array.isArray(spec.value) ? spec.value.join(", ") : spec.value}
                                    </span>
                                    <span className="spec-unit">
                                      {unit}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "game" && (
                    <div>
                      <h2 className="section-title">Game Type</h2>
                      <div className="p-4 rounded-3 bg-light border fw-semibold body-text" style={{ borderColor: "#E5E7EB" }}>
                        <i className="fas fa-volleyball-ball text-success me-2" />
                        {venueData?.gameType || "All Sports Allowed"}
                      </div>
                    </div>
                  )}

                  {activeTab === "amenities" && (
                    <div>
                      <h2 className="section-title">Included Amenities ({venueData?.amenities?.length || 0})</h2>
                      <div className="row row-cols-2 row-cols-md-3 g-3">
                        {venueData?.amenities?.map((amenity: any, index: any) => (
                          <div className="col" key={index}>
                            <div className="pro-amenity-card">
                              <i className="fas fa-check-circle" />
                              <span style={{ color: "#111827" }}>{amenity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "facilities" && (
                    <div>
                      <h2 className="section-title">Available Facilities ({venueData?.facilities?.length || 0})</h2>
                      <div className="row row-cols-2 row-cols-md-3 g-3">
                        {venueData?.facilities?.map((facility: any, index: any) => (
                          <div className="col" key={index}>
                            <div className="pro-amenity-card">
                              <i className="fas fa-building" />
                              <span style={{ color: "#111827" }}>{facility}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "rules" && (
                    <div>
                      <h2 className="section-title">Rules & Policies</h2>
                      <div className="p-4 rounded-3 bg-light border body-text" style={{ borderColor: "#E5E7EB" }}>
                        <div dangerouslySetInnerHTML={{ __html: venueData?.policiesAndRules || "Standard sports venue rules apply." }} />
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div>
                      <h2 className="section-title">Additional Notes</h2>
                      <div className="p-4 rounded-3 bg-light border body-text" style={{ borderColor: "#E5E7EB" }}>
                        {venueData?.additionalNotes || "No additional notes provided by vendor."}
                      </div>
                    </div>
                  )}
                </div>

                {/* D. Additional Info Card */}
                <div className="pro-card">
                  <h3 className="card-title-head mb-3">Venue Information</h3>
                  <div className="row row-cols-2 row-cols-md-4 g-3">
                    <div className="col">
                      <div className="p-3 rounded-3 bg-light border text-center h-100" style={{ borderColor: "#E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-2" style={{ width: "38px", height: "38px" }}>
                          <i className="fas fa-running text-success" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="d-block muted-text mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>Best For</span>
                        <span className="fw-extrabold text-dark-title d-block" style={{ fontSize: "14px" }}>{type ? type.replaceAll('-', ' ') : "Cricket, Football"}</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="p-3 rounded-3 bg-light border text-center h-100" style={{ borderColor: "#E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-2" style={{ width: "38px", height: "38px" }}>
                          <i className="fas fa-users text-success" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="d-block muted-text mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>Players</span>
                        <span className="fw-extrabold text-dark-title d-block" style={{ fontSize: "14px" }}>22 Players</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="p-3 rounded-3 bg-light border text-center h-100" style={{ borderColor: "#E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-2" style={{ width: "38px", height: "38px" }}>
                          <i className="fas fa-clock text-success" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="d-block muted-text mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>Timing</span>
                        <span className="fw-extrabold text-dark-title d-block" style={{ fontSize: "14px" }}>6:00 AM – 11:00 PM</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="p-3 rounded-3 bg-light border text-center h-100" style={{ borderColor: "#E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-2" style={{ width: "38px", height: "38px" }}>
                          <i className="fas fa-calendar-alt text-success" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="d-block muted-text mb-1" style={{ fontSize: "12px", fontWeight: 600 }}>Booking Type</span>
                        <span className="fw-extrabold text-dark-title d-block" style={{ fontSize: "14px" }}>Hourly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (30% / 4 Cols): Sticky Sidebar */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: "100px", zIndex: 10 }}>
                  {/* Card 1: Book Court Slot */}
                  <div className="pro-card mb-4 d-flex flex-column justify-content-between">
                    <div>
                      {/* Badges */}
                      <div className="d-flex align-items-center justify-content-between mb-2.5">
                        <span className="badge bg-success bg-opacity-15 text-success px-3 py-1.5 rounded-pill fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          Available for Booking
                        </span>
                        <span className="fw-semibold text-dark-title d-inline-flex align-items-center gap-1" style={{ fontSize: "12px", color: "#111827" }}>
                          <i className="fas fa-shield-alt text-success" /> Verified
                        </span>
                      </div>

                      <h3 className="card-title-head mb-2" style={{ color: "#111827" }}>Book Court Slot</h3>

                      {/* Selector / Calendar Pricing Card */}
                      <div className="p-3 mb-3 rounded-3 text-center" style={{ background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-1.5" style={{ width: "40px", height: "40px" }}>
                          <i className="fas fa-calendar-alt text-success" style={{ fontSize: "18px" }} />
                        </div>
                        {venueData?.price_per_hr ? (
                          <div>
                            <span className="d-block muted-text" style={{ fontSize: "11px", color: "#6B7280" }}>Price Starting From</span>
                            <div className="d-flex align-items-baseline justify-content-center gap-1">
                              <span className="fw-extrabold text-brand-green" style={{ fontSize: "24px", color: "#16A34A" }}>₹{venueData.price_per_hr}</span>
                              <span className="muted-text" style={{ fontSize: "12px", color: "#6B7280" }}>/ hour</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="fw-bold text-dark-title mb-0.5" style={{ fontSize: "14px", color: "#111827" }}>Check Availability for Pricing</h5>
                            <span className="d-block muted-text" style={{ fontSize: "11px", color: "#6B7280" }}>Select date and time to view price</span>
                          </div>
                        )}
                      </div>

                      {/* Checklist */}
                      <ul className="booking-feature-list mb-3">
                        <li style={{ color: "#111827" }}>
                          <i className="fas fa-check-circle text-success" /> Instant Slot Confirmation
                        </li>
                        <li style={{ color: "#111827" }}>
                          <i className="fas fa-check-circle text-success" /> Flexible Booking
                        </li>
                        <li style={{ color: "#111827" }}>
                          <i className="fas fa-check-circle text-success" /> Free Cancellation
                        </li>
                      </ul>
                    </div>

                    {/* CTAs */}
                    <div className="d-flex flex-column gap-2">
                      <button
                        type="button"
                        className="pro-btn-primary"
                        onClick={handleBookNow}
                      >
                        <i className="fas fa-calendar-check" /> Check Availability
                      </button>
                      <button
                        type="button"
                        className="pro-btn-secondary"
                        onClick={() => {
                          Swal.fire({
                            title: "Enquiry Now",
                            text: `For booking enquiries regarding ${venueData?.name || 'this venue'}, please call +91 9977737801 or write to info@kheloindore.com`,
                            icon: "info",
                            confirmButtonColor: "#22C55E"
                          });
                        }}
                      >
                        <i className="fas fa-comment-dots" /> Enquiry Now
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Top Amenities */}
                  <div className="pro-card mb-0">
                    <h3 className="card-title-head mb-3">Top Amenities</h3>
                    <div className="row row-cols-2 g-2 mb-3">
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🅿️</span>
                          <span style={{ color: "#111827" }}>Parking</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>💧</span>
                          <span style={{ color: "#111827" }}>Drinking Water</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>💡</span>
                          <span style={{ color: "#111827" }}>Flood Lights</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🚿</span>
                          <span style={{ color: "#111827" }}>Washroom</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🎽</span>
                          <span style={{ color: "#111827" }}>Changing Room</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🔒</span>
                          <span style={{ color: "#111827" }}>Locker</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("amenities")}
                      className="pro-btn-secondary"
                      style={{ height: "44px" }}
                    >
                      View All Amenities &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating CTA for Mobile / Quick Enquiry */}
            <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1000 }}>
              <button
                type="button"
                className="pro-btn-primary shadow-lg"
                onClick={() => {
                  Swal.fire({
                    title: "Enquiry Now",
                    text: `For booking enquiries regarding ${venueData?.name || 'this venue'}, please call +91 9977737801 or write to info@kheloindore.com`,
                    icon: "info",
                    confirmButtonColor: "#22C55E"
                  });
                }}
                style={{ width: "auto", padding: "0 28px", height: "48px" }}
              >
                <i className="fas fa-comment-dots" style={{ fontSize: "16px" }} /> Enquiry Now
              </button>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default VenueDetails;
