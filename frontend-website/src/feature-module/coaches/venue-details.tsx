import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { sanitizeHtml } from "../../utils/sanitize";
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

const getVenueImgUrl = (images: any, index = 0): string => {
  const fallback = "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80";
  if (!images || !Array.isArray(images) || images.length === 0) return fallback;
  const item = images[index] !== undefined ? images[index] : images[0];
  if (!item) return fallback;
  const str = typeof item === "string" ? item : (item.src || item.url || "");
  if (!str) return fallback;
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  return `${IMG_URL}${str}`;
};

const VenueDetails = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [venueType, setVenueType] = useState<VenueData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("overview");

  // ─── Custom Lightbox States & Handlers ───
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!venueData?.images || venueData.images.length === 0) return;
    setLightboxIndex((prev) => (prev === 0 ? venueData.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!venueData?.images || venueData.images.length === 0) return;
    setLightboxIndex((prev) => (prev === venueData.images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, venueData]);

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

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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
  
  const handleShare = async () => {
    const shareData = {
      title: venueData?.name || "Khelo Indore Sports Venue",
      text: `Check out ${venueData?.name || "this sports venue"} on Khelo Indore!`,
      url: window.location.href,
    };

    // Use the browser/device sharing interface when available. This provides
    // the familiar social-app picker seen in the reference image.
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Closing the native sheet is expected; retain the in-page sheet as a
        // fallback only when native sharing cannot be used.
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }

    setIsShareOpen(true);
  };
  
  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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

            .about-venue-box {
              transition: all 0.3s ease !important;
            }
            .about-venue-box:hover {
              border-color: #22C55E !important;
              box-shadow: 0 8px 16px rgba(34, 197, 94, 0.04) !important;
              background-color: #FFFFFF !important;
            }
            .spec-info-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              width: 100% !important;
            }
            .spec-info-card:hover {
              transform: translateY(-4px) !important;
              border-color: #22C55E !important;
              box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.1), 0 8px 10px -6px rgba(34, 197, 94, 0.1) !important;
            }
            .spec-info-card:hover .icon-wrapper {
              transform: scale(1.1) rotate(4deg) !important;
              background-color: #22C55E !important;
              color: #FFFFFF !important;
            }
            .spec-info-card .icon-wrapper {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .spec-info-card .spec-label {
              color: #475569 !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
              display: block !important;
              margin-bottom: 2px !important;
            }
            .spec-info-card .spec-value {
              color: #0F172A !important;
              font-size: 13px !important;
              font-weight: 700 !important;
              display: block !important;
            }

            .venue-info-row {
              display: flex !important;
              flex-wrap: wrap !important;
              width: 100% !important;
            }
            .venue-info-row > .col {
              flex: 0 0 25% !important;
              max-width: 25% !important;
              width: 25% !important;
            }
            
            .venue-info-row-5 {
              display: flex !important;
              flex-wrap: wrap !important;
              width: 100% !important;
            }
            .venue-info-row-5 > .col {
              flex: 0 0 20% !important;
              max-width: 20% !important;
              width: 20% !important;
            }

            @media (max-width: 767.98px) {
              .venue-info-row > .col,
              .venue-info-row-5 > .col {
                flex: 0 0 50% !important;
                max-width: 50% !important;
                width: 50% !important;
              }
            }
            .khelo-pro-wrapper {
              padding-top: 24px !important;
            }
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
                        src={getVenueImgUrl(venueData?.images, 0)}
                        alt="Ambient backdrop"
                        className="ambient-bg"
                      />
                      {/* Full Uncropped Main Image */}
                      <img
                        src={getVenueImgUrl(venueData?.images, 0)}
                        alt={venueData?.name}
                        className="full-hero-img"
                        onClick={() => handleImageClick(0)}
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
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleShare();
                          }}
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
                      {/* Bottom Overlay Removed */}
                    </div>
                  </div>

                  {/* Right 2 Stacked Gallery Thumbnails */}
                  {venueData?.images && venueData.images.length >= 2 && (
                    <div className="col-md-4 d-flex flex-column gap-3">
                      <div className="bento-hero-thumb">
                        <img
                          src={getVenueImgUrl(venueData?.images, 1)}
                          alt="Ambient thumbnail 1"
                          className="ambient-bg"
                        />
                        <img
                          src={getVenueImgUrl(venueData?.images, 1)}
                          alt="Venue thumbnail 1"
                          className="full-hero-img"
                          onClick={() => handleImageClick(1)}
                        />
                      </div>
                      <div className="bento-hero-thumb">
                        <img
                          src={getVenueImgUrl(venueData?.images, 2)}
                          alt="Ambient thumbnail 2"
                          className="ambient-bg"
                        />
                        <img
                          src={getVenueImgUrl(venueData?.images, 2)}
                          alt="Venue thumbnail 2"
                          className="full-hero-img"
                          onClick={() => handleImageClick(2)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Bar directly below the Hero Gallery */}
                <div className="bg-white rounded-4 p-3 mb-4 shadow-sm border d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ borderColor: "#E2E8E3" }}>
                  <div>
                    <h1 className="fw-bold mb-1 text-dark text-capitalize" style={{ fontSize: "22px", fontFamily: "Space Grotesk, sans-serif" }}>
                      {venueData?.name || (name ? name.replaceAll('-', ' ') : "Sports Venue")}
                    </h1>
                    <div className="d-flex flex-wrap align-items-center gap-3 text-muted" style={{ fontSize: "13px" }}>
                      <span>
                        <i className="fas fa-star text-warning me-1" />4.8 (128 Reviews)
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt text-success me-1" /> {venueData?.city || "Indore"}, Madhya Pradesh
                      </span>
                    </div>
                  </div>
                  {venueData?.google_location && (
                    <a
                      href={venueData.google_location.startsWith("http") ? venueData.google_location : `https://${venueData.google_location}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill font-weight-bold"
                      style={{ fontSize: "13px", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                    >
                      <i className="feather-navigation" /> Directions (Google Maps)
                    </a>
                  )}
                </div>

                {/* D. Top Amenities Section (Positioned above map & below details bar) */}
                <div className="pro-card mb-4">
                  <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                    <div>
                      <h3 className="card-title-head mb-1" style={{ color: "#111827", fontFamily: "Space Grotesk, sans-serif" }}>Amenities</h3>
                      <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>Everything you need for a comfortable game.</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "58px", height: "58px", background: "#EAF8ED", border: "1px solid #CDEFD5" }}>
                      <ImageWithBasePath src="/assets/img/icons/amenities.svg" alt="Venue amenities" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                    </div>
                  </div>
                  {(() => {
                    const amenityIconMap: Record<string, string> = {
                      parking: "fas fa-parking",
                      "drinking water": "fas fa-tint",
                      water: "fas fa-tint",
                      floodlight: "fas fa-lightbulb",
                      floodlights: "fas fa-lightbulb",
                      "flood lights": "fas fa-lightbulb",
                      washroom: "fas fa-shower",
                      washrooms: "fas fa-shower",
                      restroom: "fas fa-restroom",
                      "changing room": "fas fa-tshirt",
                      "changing rooms": "fas fa-tshirt",
                      locker: "fas fa-lock",
                      lockers: "fas fa-lock",
                      "first aid": "fas fa-briefcase-medical",
                      "first-aid": "fas fa-briefcase-medical",
                      scoreboard: "fas fa-list-ol",
                      "seating area": "fas fa-chair",
                      seating: "fas fa-chair",
                      wifi: "fas fa-wifi",
                      "wi-fi": "fas fa-wifi",
                      cafeteria: "fas fa-coffee",
                      canteen: "fas fa-utensils",
                      "air conditioning": "fas fa-snowflake",
                      ac: "fas fa-snowflake",
                      cctv: "fas fa-video",
                      security: "fas fa-shield-alt",
                      "equipment rental": "fas fa-baseball-ball",
                      equipment: "fas fa-baseball-ball",
                      coaching: "fas fa-graduation-cap",
                      "pro shop": "fas fa-shopping-bag",
                    };
                    const getIcon = (name: string) => {
                      const key = name.toLowerCase().trim();
                      return amenityIconMap[key] || "fas fa-check-circle";
                    };
                    const amenityList: string[] = Array.isArray(venueData?.amenities)
                      ? venueData.amenities
                      : [];
                    if (amenityList.length === 0) {
                      return (
                        <p className="text-muted small">No amenities listed for this venue.</p>
                      );
                    }
                    return (
                      <div className="row row-cols-md-3 row-cols-2 g-3">
                        {amenityList.map((amenity: string, idx: number) => (
                          <div className="col" key={idx}>
                            <div className="pro-amenity-card d-flex align-items-center gap-2.5 p-2 rounded-3 border" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", height: "100%" }}>
                              <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                                <i className={getIcon(amenity)} style={{ fontSize: "14px" }} />
                              </div>
                              <span className="fw-semibold text-dark text-capitalize text-truncate" style={{ fontSize: "13px" }} title={amenity}>{amenity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* B. NAVIGATION TABS (Immediately follows Hero Gallery!) */}
                {(venueData?.gameType || (venueData?.facilities && venueData.facilities.length > 0) || venueData?.policiesAndRules || venueData?.additionalNotes) && (
                  <div className="tabs-container-card">
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
                )}

                {/* C. Active Tab Content Card */}
                <div className="pro-card" style={{ padding: "16px", marginBottom: "16px" }}>
                  {activeTab === "overview" && (
                    <div>
                      {/* Card 1: About this Venue */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 font-weight-bold" style={{ fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Overview</span>
                      </div>
                      <h3 className="card-title-head mb-3" style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>About this Venue</h3>
                      <div
                        className="about-venue-box p-3 rounded-3 border-start border-4"
                        style={{
                          borderLeft: "4px solid #22C55E",
                          backgroundColor: "#F8FAFC",
                          borderTop: "1px solid #E2E8F0",
                          borderRight: "1px solid #E2E8F0",
                          borderBottom: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(venueData?.description) || "No description available." }}
                          className="body-text text-secondary mb-0"
                          style={{ fontSize: "14px", lineHeight: "1.7", color: "#475569" }}
                        />
                      </div>

                       <hr className="my-3" style={{ borderColor: "#E2E8F0" }} />

                      {/* Card 2: Venue Specifications */}
                      {venueType && venueType.length > 0 && (
                        <div>
                          <h3 className="card-title-head">Venue Specifications</h3>
                           <div className="row row-cols-2 row-cols-md-5 g-2 venue-info-row-5">
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
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(venueData?.policiesAndRules) || "Standard sports venue rules apply." }} />
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
                <div className="pro-card" style={{ padding: "16px", marginBottom: "16px" }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 font-weight-bold" style={{ fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Specifications</span>
                  </div>
                  <h3 className="card-title-head mb-3" style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Venue Information</h3>
                   <div className="row row-cols-2 row-cols-md-4 g-2 venue-info-row">
                    <div className="col">
                      <div className="spec-info-card p-2 py-3 rounded-3 border text-center h-100" 
                           style={{ 
                             borderColor: "#E2E8F0", 
                             background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                           }}>
                        <div className="icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                             style={{ 
                               width: "38px", 
                               height: "38px", 
                               backgroundColor: "#DCFCE7", 
                               color: "#16A34A"
                             }}>
                          <i className="fas fa-running" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="spec-label">Best For</span>
                        <span className="spec-value text-truncate">
                          {type ? type.replaceAll('-', ' ') : "Cricket, Football"}
                        </span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="spec-info-card p-2 py-3 rounded-3 border text-center h-100" 
                           style={{ 
                             borderColor: "#E2E8F0", 
                             background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                           }}>
                        <div className="icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                             style={{ 
                               width: "38px", 
                               height: "38px", 
                               backgroundColor: "#DCFCE7", 
                               color: "#16A34A"
                             }}>
                          <i className="fas fa-rupee-sign" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="spec-label">Price</span>
                        <span className="spec-value text-truncate">₹{venueData?.price_per_hr || 1000} / hr</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="spec-info-card p-2 py-3 rounded-3 border text-center h-100" 
                           style={{ 
                             borderColor: "#E2E8F0", 
                             background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                           }}>
                        <div className="icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                             style={{ 
                               width: "38px", 
                               height: "38px", 
                               backgroundColor: "#DCFCE7", 
                               color: "#16A34A"
                             }}>
                          <i className="fas fa-clock" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="spec-label">Timing</span>
                        <span className="spec-value text-truncate">24 Hours</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="spec-info-card p-2 py-3 rounded-3 border text-center h-100" 
                           style={{ 
                             borderColor: "#E2E8F0", 
                             background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
                           }}>
                        <div className="icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                             style={{ 
                               width: "38px", 
                               height: "38px", 
                               backgroundColor: "#DCFCE7", 
                               color: "#16A34A"
                             }}>
                          <i className="fas fa-calendar-alt" style={{ fontSize: "16px" }} />
                        </div>
                        <span className="spec-label">Booking Type</span>
                        <span className="spec-value text-truncate">Hourly</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Map Card moved to sidebar */}
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
                      <div className="pricing-box-visible text-center">
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-2" style={{ width: "42px", height: "42px" }}>
                          <i className="fas fa-calendar-alt text-success" style={{ fontSize: "18px" }} />
                        </div>
                        <div>
                          <span className="pricing-label-text d-block mb-1">Price Starting From</span>
                          <div className="d-flex align-items-baseline justify-content-center gap-1">
                            <span className="pricing-amount-text">₹{venueData?.price_per_hr || 1000}</span>
                            <span className="pricing-unit-text">/ hour</span>
                          </div>
                        </div>
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
                        <i className="fas fa-calendar-check" /> Book Now
                      </button>
                    </div>
                  </div>

                  {/* Moved Compact Location & Map Card (Positioned directly below Book Slot) */}
                  <div className="pro-card mt-4">
                    <h3 className="card-title-head mb-3" style={{ color: "#111827", fontSize: "16px" }}>Location & Map</h3>
                    {/* Embedded Google Minimap */}
                    <div className="rounded-3 overflow-hidden border mb-3" style={{ height: "180px", borderColor: "#E2E8F0" }}>
                      <iframe
                        title="Venue Location Minimap"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          (venueData?.name || '') + " " + (venueData?.address || '') + " Indore Madhya Pradesh"
                        )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                    {/* Address Detail displayed only once (below minimap) */}
                    <div className="d-flex gap-2">
                      <i className="fas fa-map-marker-alt text-success mt-1" style={{ fontSize: "14px", flexShrink: 0 }} />
                      <div>
                        <h6 className="fw-bold mb-0.5" style={{ color: "#111827", fontSize: "13px" }}>
                          {venueData?.name || "Venue Address"}
                        </h6>
                        <p className="mb-0 text-muted" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                          {venueData?.address ? `${venueData.address}, ${venueData.city || 'Indore'}, ${venueData.state || 'Madhya Pradesh'}` : "Indore, Madhya Pradesh"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>



            </div>
          </div>

          {/* Custom Premium Lightbox Modal */}
          {lightboxOpen && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
              style={{ 
                zIndex: 10000, 
                backgroundColor: "rgba(15, 23, 42, 0.95)", 
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "opacity 0.3s ease"
              }}
              onClick={() => setLightboxOpen(false)}
            >
              {/* Header Info & Close Button */}
              <div 
                className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-between px-4 py-3"
                style={{ zIndex: 10002 }}
              >
                <div className="text-white">
                  <h5 className="fw-bold mb-0" style={{ fontSize: "16px" }}>{venueData?.name}</h5>
                  <span style={{ fontSize: "12px", opacity: 0.7, fontWeight: "500" }}>
                    Image {lightboxIndex + 1} of {venueData?.images?.length || 1}
                  </span>
                </div>
                <button 
                  type="button"
                  className="btn btn-link text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                  onClick={() => setLightboxOpen(false)}
                  style={{ 
                    width: "40px", 
                    height: "40px", 
                    backgroundColor: "rgba(255,255,255,0.1)", 
                    border: "none",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  <i className="feather-x" style={{ fontSize: "20px" }} />
                </button>
              </div>

              {/* Left Navigation Arrow */}
              {venueData?.images && venueData.images.length > 1 && (
                <button
                  type="button"
                  className="position-absolute start-0 ms-4 btn d-flex align-items-center justify-content-center rounded-circle text-white shadow-lg"
                  onClick={handlePrevImage}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    zIndex: 10003,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#22C55E";
                    e.currentTarget.style.borderColor = "#22C55E";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  <i className="feather-chevron-left" style={{ fontSize: "24px" }} />
                </button>
              )}

              {/* Main Lightbox Image Viewport */}
              <div 
                className="d-flex align-items-center justify-content-center p-3"
                style={{ maxWidth: "85%", maxHeight: "70%", zIndex: 10001 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getVenueImgUrl(venueData?.images, lightboxIndex)}
                  alt="Lightbox View"
                  className="img-fluid rounded-3 shadow-2xl"
                  style={{ 
                    maxHeight: "70vh", 
                    maxWidth: "100%", 
                    objectFit: "contain",
                    border: "4px solid rgba(255,255,255,0.15)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                />
              </div>

              {/* Right Navigation Arrow */}
              {venueData?.images && venueData.images.length > 1 && (
                <button
                  type="button"
                  className="position-absolute end-0 me-4 btn d-flex align-items-center justify-content-center rounded-circle text-white shadow-lg"
                  onClick={handleNextImage}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    zIndex: 10003,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#22C55E";
                    e.currentTarget.style.borderColor = "#22C55E";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  <i className="feather-chevron-right" style={{ fontSize: "24px" }} />
                </button>
              )}

              {/* Horizontal Clickable Thumbnail Previews */}
              {venueData?.images && venueData.images.length > 1 && (
                <div 
                  className="position-absolute bottom-0 mb-4 d-flex align-items-center justify-content-center gap-2 p-2 rounded-4"
                  style={{ 
                    backgroundColor: "rgba(15, 23, 42, 0.6)", 
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    zIndex: 10002,
                    maxWidth: "90%",
                    overflowX: "auto"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {venueData.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="btn p-0 rounded-3 overflow-hidden border"
                      style={{
                        width: "56px",
                        height: "42px",
                        borderColor: lightboxIndex === idx ? "#22C55E" : "transparent",
                        borderWidth: "2.5px",
                        opacity: lightboxIndex === idx ? 1 : 0.5,
                        transition: "all 0.2s"
                      }}
                    >
                      <img 
                        src={getVenueImgUrl(venueData.images, idx)} 
                        alt="thumbnail"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                    </button>
                  ))}
                </div>
              )}
              {/* Share Modal */}
              {isShareOpen && typeof document !== "undefined" && createPortal((
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10050 }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: "20px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                      <div className="modal-header border-0 pb-0 justify-content-between align-items-center px-4 pt-4">
                        <h5 className="modal-title fw-bold" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "20px" }}>Share Venue</h5>
                        <button type="button" className="btn-close opacity-50" onClick={() => setIsShareOpen(false)} aria-label="Close" style={{ fontSize: "14px" }}></button>
                      </div>
                      <div className="modal-body px-4 py-3">
                        <p className="text-muted mb-3" style={{ fontSize: "13px" }}>Share this venue with your friends and sports groups!</p>
                        
                        {/* Social Grid */}
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
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${venueData?.name || "this venue"} on Khelo Indore!`)}`} 
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
                          
                          <a 
                            href={`mailto:?subject=${encodeURIComponent(`Check out this sports venue: ${venueData?.name || "Khelo Indore"}`)}&body=${encodeURIComponent(`Hey, check out this sports venue on Khelo Indore: ${window.location.href}`)}`}
                            className="d-flex flex-column align-items-center text-decoration-none"
                            style={{ width: "60px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle mb-1" style={{ width: "45px", height: "45px" }}>
                              <i className="fa-regular fa-envelope" style={{ fontSize: "18px" }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>Email</span>
                          </a>
                          
                          <a 
                            href={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`Check out ${venueData?.name || "this venue"} on Khelo Indore!`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="d-flex flex-column align-items-center text-decoration-none"
                            style={{ width: "60px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center text-white rounded-circle mb-1" style={{ width: "45px", height: "45px", backgroundColor: "#FF4500" }}>
                              <i className="fa-brands fa-reddit-alien" style={{ fontSize: "18px" }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>Reddit</span>
                          </a>
                          
                          <a 
                            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(`Check out ${venueData?.name || "this venue"} on Khelo Indore!`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="d-flex flex-column align-items-center text-decoration-none"
                            style={{ width: "60px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center text-white rounded-circle mb-1" style={{ width: "45px", height: "45px", backgroundColor: "#BD081C" }}>
                              <i className="fa-brands fa-pinterest" style={{ fontSize: "18px" }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>Pinterest</span>
                          </a>
                          
                          <a 
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="d-flex flex-column align-items-center text-decoration-none"
                            style={{ width: "60px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center text-white rounded-circle mb-1" style={{ width: "45px", height: "45px", backgroundColor: "#0077B5" }}>
                              <i className="fa-brands fa-linkedin-in" style={{ fontSize: "18px" }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: "11px", fontWeight: "600" }}>LinkedIn</span>
                          </a>
                        </div>
                        
                        {/* Copy Link Input */}
                        <div className="input-group mb-2">
                          <input 
                            type="text" 
                            className="form-control bg-light border-0" 
                            value={window.location.href} 
                            readOnly 
                            style={{ fontSize: "12px", borderRadius: "10px 0 0 10px", height: "40px" }} 
                          />
                          <button 
                            className="btn btn-success" 
                            type="button" 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              setShareCopied(true);
                              setTimeout(() => setShareCopied(false), 2000);
                            }}
                            style={{ borderRadius: "0 10px 10px 0", fontSize: "12px", fontWeight: "600", width: "80px" }}
                          >
                            {shareCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ), document.body)}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VenueDetails;
