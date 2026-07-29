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
  console.log(idData,'--------');
  const location = useLocation();
  

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
    if (venueData) {
      const nameofkey = Object.keys(venueData?.data)[0]
      const nameofgame = venueData?.data[nameofkey]
      setVenueType(nameofgame)
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
        <div className="khelo-pro-wrapper">
          <div className="max-container">
            {/* 1. Breadcrumbs (Above Hero Section) */}
            <div className="d-flex align-items-center gap-2 mb-3 text-secondary" style={{ fontSize: "14px", fontWeight: 500 }}>
              <Link to="/" className="muted-text text-decoration-none d-inline-flex align-items-center gap-1">
                <i className="feather-home" style={{ fontSize: "15px" }} /> Home
              </Link>
              <span>/</span>
              <Link to={routes.blogListSidebarLeft} className="muted-text text-decoration-none">
                Sports Venues
              </Link>
              <span>/</span>
              <span className="fw-bold text-dark text-capitalize">
                {venueData?.name || (name ? name.replaceAll('-', ' ') : "Venue Details")}
              </span>
            </div>

            {/* 2. Hero Section & Booking Card Row (2-Column: Left 70% / Right 30%) */}
            <div className="row g-4 mb-4">
              {/* LEFT (70% / 8 Cols): Bento Gallery */}
              <div className="col-lg-8">
                <div className="row g-3">
                  {/* Main Featured Big Image */}
                  <div className={venueData?.images && venueData.images.length >= 2 ? "col-md-8" : "col-12"}>
                    <div className="bento-hero-main">
                      <img
                        src={venueData?.images && venueData.images[0] ? `${IMG_URL}${venueData.images[0].src}` : "/assets/img/venues/venue-01.jpg"}
                        alt={venueData?.name}
                        onClick={() => handleImageClick(0)}
                        onError={(e: any) => {
                          e.target.src = "/assets/img/venues/venue-01.jpg";
                        }}
                      />
                      {/* Featured Badge */}
                      <div className="position-absolute top-0 start-0 p-4">
                        <span className="badge bg-success text-white px-3.5 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", fontWeight: 700 }}>
                          ⭐ Featured
                        </span>
                      </div>
                      {/* Bottom Overlay Container */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0 text-white"
                        style={{ background: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0) 75%)", padding: "32px" }}
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
                          alt="Venue thumbnail 1"
                          onClick={() => handleImageClick(1)}
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-02.jpg";
                          }}
                        />
                      </div>
                      <div className="bento-hero-thumb">
                        <img
                          src={venueData.images[2] ? `${IMG_URL}${venueData.images[2]?.src}` : `${IMG_URL}${venueData.images[0]?.src}`}
                          alt="Venue thumbnail 2"
                          onClick={() => handleImageClick(venueData.images[2] ? 2 : 0)}
                          onError={(e: any) => {
                            e.target.src = "/assets/img/venues/venue-03.jpg";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT (30% / 4 Cols): Sticky Booking Card */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: "100px", zIndex: 10 }}>
                  <div className="pro-card d-flex flex-column justify-content-between mb-0">
                    <div>
                      {/* Badges */}
                      <div className="d-flex align-items-center justify-content-between mb-2.5">
                        <span className="badge bg-success bg-opacity-15 text-success px-3 py-1.5 rounded-pill fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          Available for Booking
                        </span>
                        <span className="fw-semibold text-dark-title" style={{ fontSize: "12px" }}>
                          <i className="fas fa-shield-alt text-success me-1" /> Verified
                        </span>
                      </div>

                      <h3 className="card-title-head mb-2">Book Court Slot</h3>

                      {/* Selector / Calendar Pricing Card */}
                      <div className="p-3 mb-3 rounded-3 text-center" style={{ background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-1.5" style={{ width: "40px", height: "40px" }}>
                          <i className="fas fa-calendar-alt text-success" style={{ fontSize: "18px" }} />
                        </div>
                        {venueData?.price_per_hr ? (
                          <div>
                            <span className="d-block muted-text" style={{ fontSize: "11px" }}>Price Starting From</span>
                            <div className="d-flex align-items-baseline justify-content-center gap-1">
                              <span className="fw-extrabold text-brand-green" style={{ fontSize: "24px" }}>₹{venueData.price_per_hr}</span>
                              <span className="muted-text" style={{ fontSize: "12px" }}>/ hour</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h5 className="fw-bold text-dark-title mb-0.5" style={{ fontSize: "14px" }}>Check Availability for Pricing</h5>
                            <span className="d-block muted-text" style={{ fontSize: "11px" }}>Select date and time to view price</span>
                          </div>
                        )}
                      </div>

                      {/* Checklist */}
                      <ul className="list-unstyled mb-3" style={{ fontSize: "13px" }}>
                        <li className="d-flex align-items-center gap-2 py-1 fw-semibold text-dark-title">
                          <i className="fas fa-check-circle text-success" /> Instant Slot Confirmation
                        </li>
                        <li className="d-flex align-items-center gap-2 py-1 fw-semibold text-dark-title">
                          <i className="fas fa-check-circle text-success" /> Flexible Booking
                        </li>
                        <li className="d-flex align-items-center gap-2 py-1 fw-semibold text-dark-title">
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
                </div>
              </div>
            </div>

            {/* 3. NAVIGATION TABS (Enclosed White Rounded Container Card) */}
            <div className="tabs-container-card">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`pro-tab-pill ${activeTab === "overview" ? "active" : "inactive"}`}
              >
                <i className="fas fa-info-circle" /> Overview
              </button>

              {venueData?.gameType && (
                <button
                  type="button"
                  onClick={() => setActiveTab("game")}
                  className={`pro-tab-pill ${activeTab === "game" ? "active" : "inactive"}`}
                >
                  <i className="fas fa-volleyball-ball" /> Game Type
                </button>
              )}

              {venueData?.amenities && venueData.amenities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("amenities")}
                  className={`pro-tab-pill ${activeTab === "amenities" ? "active" : "inactive"}`}
                >
                  <i className="fas fa-check-circle" /> Amenities ({venueData.amenities.length})
                </button>
              )}

              {venueData?.facilities && venueData.facilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("facilities")}
                  className={`pro-tab-pill ${activeTab === "facilities" ? "active" : "inactive"}`}
                >
                  <i className="fas fa-building" /> Facilities ({venueData.facilities.length})
                </button>
              )}

              {venueData?.policiesAndRules && (
                <button
                  type="button"
                  onClick={() => setActiveTab("rules")}
                  className={`pro-tab-pill ${activeTab === "rules" ? "active" : "inactive"}`}
                >
                  <i className="fas fa-gavel" /> Rules & Policies
                </button>
              )}

              {venueData?.additionalNotes && (
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`pro-tab-pill ${activeTab === "notes" ? "active" : "inactive"}`}
                >
                  <i className="fas fa-sticky-note" /> Notes
                </button>
              )}
            </div>

            {/* 4. CONTENT & SIDEBAR ROW */}
            <div className="row g-4">
              {/* LEFT COLUMN (70% / 8 Cols) */}
              <div className="col-lg-8">
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
                              <span>{amenity}</span>
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
                              <span>{facility}</span>
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

                {/* Card 3: Additional Info Cards (4 Equal Cards) */}
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

              {/* RIGHT COLUMN (30% / 4 Cols): Sidebar Cards */}
              <div className="col-lg-4">
                <div className="d-flex flex-column gap-4">
                  {/* Card: Top Amenities */}
                  <div className="pro-card mb-0">
                    <h3 className="card-title-head mb-3">Top Amenities</h3>
                    <div className="row row-cols-2 g-2 mb-3">
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🅿️</span>
                          <span>Parking</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>💧</span>
                          <span>Drinking Water</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>💡</span>
                          <span>Flood Lights</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🚿</span>
                          <span>Washroom</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🎽</span>
                          <span>Changing Room</span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="pro-amenity-card">
                          <span>🔒</span>
                          <span>Locker</span>
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

                  {/* Card: Share & Save Venue */}
                  <div className="pro-card mb-0">
                    <h3 className="card-title-head mb-3">Share & Save</h3>
                    <div className="d-flex flex-column gap-2">
                      <button
                        type="button"
                        onClick={handleShare}
                        className="pro-btn-secondary"
                        style={{ height: "48px" }}
                      >
                        <i className="fas fa-share-alt" /> Share Venue
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          Swal.fire({
                            icon: "success",
                            title: "Saved!",
                            text: "Venue added to your favorites.",
                            timer: 2000,
                            showConfirmButton: false,
                            confirmButtonColor: "#22C55E"
                          });
                        }}
                        className="pro-btn-secondary"
                        style={{ height: "48px" }}
                      >
                        <i className="fas fa-heart text-danger" /> Save Favourite
                      </button>
                    </div>
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
      )}
    </>
  );
};

export default VenueDetails;
