import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

interface Venues {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  activities: string;
  category: string;
  _id: string;
  images: any;
  src: string;
  near_by_location: string;
  vendor_type: any;
  price_per_hr: any;
  google_location: any;
  description: any;
}

const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
};

const SLOT_TIMING_OPTIONS = [
  { id: "all", label: "Select Time" },
  { id: "all-full", label: "All Slots (6 AM - 11 PM)" },
  { id: "morning", label: "Morning (06:00 AM - 12:00 PM)" },
  { id: "afternoon", label: "Afternoon (12:00 PM - 05:00 PM)" },
  { id: "evening", label: "Evening (05:00 PM - 09:00 PM)" },
  { id: "night", label: "Night (09:00 PM - 11:00 PM)" },
];

export default function VenueByCategory() {
  const [venues, setVenues] = useState<Venues[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const thisCategory = useParams<{ type: string }>();
  const categorySelected = thisCategory?.type || "";

  // Filter States
  const [selectedSport, setSelectedSport] = useState<string>(categorySelected ? categorySelected.toLowerCase() : "all");
  const [locationName, setLocationName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("all");
  const [selectedGrassType, setSelectedGrassType] = useState<string>("any");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("popular");

  useEffect(() => {
    if (categorySelected) {
      setSelectedSport(categorySelected.toLowerCase());
    }
  }, [categorySelected]);

  const categoryTitle = selectedSport && selectedSport !== "all"
    ? selectedSport
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Sports";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${categoryTitle} Venues - Khelo Indore`;
  }, [categoryTitle]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/venue/getVenue`);
        const venuesData = response.data.venue;
        const mappedData = venuesData.map((venues: any) => ({
          name: venues.name,
          address: venues.address,
          city: venues.city,
          state: venues.state,
          zipcode: venues.zipcode,
          activities: venues.activities,
          images: venues.images,
          category: venues.category,
          _id: venues._id,
          near_by_location: venues.near_by_location,
          vendor_type: venues.vendor_type,
          price_per_hr: venues.price_per_hr,
          google_location: venues.google_location,
          description: venues.description || "",
        }));
        setVenues(mappedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  const toggleFavorite = (venueId: string) => {
    const nextStatus = !favorites[venueId];
    localStorage.setItem(`fav_venue_${venueId}`, String(nextStatus));
    setFavorites((prev) => ({
      ...prev,
      [venueId]: nextStatus,
    }));

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: `${nextStatus ? "Saved to Favourites!" : "Removed from Favourites"}`,
      text: `${nextStatus ? "Venue added to your favorites list." : "Venue removed from your favorites list."}`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const venueLocations = useMemo(() => {
    return [
      ...new Set(
        venues
          .map((venue) => venue.near_by_location ? String(venue.near_by_location).replace("_", " ").trim() : "")
          .filter(Boolean)
      ),
    ];
  }, [venues]);

  // Unified Filtering & Sorting Engine
  const displayList = useMemo(() => {
    const result = venues.filter((t: any) => {
      // 1. Sports Filter
      if (selectedSport && selectedSport !== "all") {
        const vt = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
        const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
        const name = (t.name || "").toLowerCase();
        const desc = (t.description || "").toLowerCase();

        if (selectedSport === "other-sports") {
          const isCricket = vt.includes("cricket") || cat.includes("cricket") || name.includes("cricket") || desc.includes("cricket") || vt.includes("turf") || cat.includes("turf");
          const isBadminton = vt.includes("badminton") || cat.includes("badminton") || name.includes("badminton");
          const isSwimming = vt.includes("swim") || cat.includes("swim") || name.includes("swim");
          const isFootball = vt.includes("football") || cat.includes("football") || name.includes("football");
          const isPickleball = vt.includes("pickle") || cat.includes("pickle") || name.includes("pickle");
          const isTennis = (vt.includes("tennis") || cat.includes("tennis") || name.includes("tennis")) && !vt.includes("table") && !cat.includes("table") && !name.includes("table");
          const isBasketball = vt.includes("basketball") || cat.includes("basketball") || name.includes("basketball");
          const isTableTennis = vt.includes("table tennis") || cat.includes("table tennis") || name.includes("table tennis");

          if (isCricket || isBadminton || isSwimming || isFootball || isPickleball || isTennis || isBasketball || isTableTennis) {
            return false;
          }
        } else {
          const targetCat = selectedSport.replace(/-/g, " ").trim();
          const matches = vt.includes(targetCat) || cat.includes(targetCat) || targetCat.includes(vt) || targetCat.includes(cat);
          if (!matches) return false;
        }
      }

      // 2. Location Filter
      if (locationName) {
        const formattedLocation = (t.near_by_location || "").replace("_", " ").toLowerCase();
        if (!formattedLocation.includes(locationName.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    // Sort Sorting logic
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price_per_hr || 0) - Number(b.price_per_hr || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price_per_hr || 0) - Number(a.price_per_hr || 0));
    }

    return result;
  }, [venues, selectedSport, locationName, sortBy]);

  const handleResetFilters = () => {
    setLocationName("");
    setSelectedDate("");
    setSelectedSlot("all");
    setSelectedGrassType("any");
    setSelectedAmenity("any");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 5; // 5 cards per row matching design mockup page count
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;

  const currentVenues = displayList.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.max(1, Math.ceil(displayList.length / venuesPerPage));

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Hero Header Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "130px", paddingBottom: "35px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-1.5 rounded-pill shadow-sm mb-2" style={{ fontSize: "12px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 8px", color: "#94A3B8" }}><i className="feather-chevron-right" style={{ fontSize: "11px" }} /></span>
                <Link to="/sports-venue" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Sports Venues</Link>
                <span style={{ margin: "0 8px", color: "#94A3B8" }}><i className="feather-chevron-right" style={{ fontSize: "11px" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>{categoryTitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Header Section */}

      {/* Main Page Container */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "28px 0 60px 0" }}>
        <div className="container-fluid px-lg-5 px-md-4 px-3">
          
          {/* Title & Count Row */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div>
              <h1 className="fw-extrabold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: "28px", fontWeight: "800", color: "#17222D", fontFamily: "Space Grotesk, sans-serif" }}>
                <span style={{ color: "#22C55E" }}>{displayList.length}</span> {categoryTitle} Venues
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: "14px", fontWeight: "500", color: "#64748B" }}>
                Book the best {categoryTitle.toLowerCase()} grounds in Indore
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted" style={{ fontSize: "12px", fontWeight: "600" }}>Sort by:</span>
              <select
                className="form-select form-select-sm rounded-pill shadow-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: "34px", width: "130px", fontSize: "12px", fontWeight: "600", borderColor: "#E2E8E3", backgroundColor: "#FFFFFF", cursor: "pointer" }}
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Horizontal Top Filter Bar (Full Width Card) */}
          <div className="bg-white rounded-4 p-3 mb-4 shadow-sm border" style={{ borderColor: "#E2E8E3" }}>
            <div className="row g-2 align-items-center">
              
              {/* 1. Location */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <label className="form-label mb-1 fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: "11px", color: "#1E293B" }}>
                  <i className="feather-map-pin text-success" /> Location
                </label>
                <select
                  className="form-select form-select-sm rounded-3 border"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  style={{ height: "38px", fontSize: "12px", borderColor: "#CBD5E1", backgroundColor: "#FAFAFA" }}
                >
                  <option value="">Select Location</option>
                  {venueLocations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* 2. Date */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <label className="form-label mb-1 fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: "11px", color: "#1E293B" }}>
                  <i className="feather-calendar text-success" /> Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm rounded-3 border"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ height: "38px", fontSize: "12px", borderColor: "#CBD5E1", backgroundColor: "#FAFAFA" }}
                />
              </div>

              {/* 3. Time Slot */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <label className="form-label mb-1 fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: "11px", color: "#1E293B" }}>
                  <i className="feather-clock text-success" /> Time
                </label>
                <select
                  className="form-select form-select-sm rounded-3 border"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  style={{ height: "38px", fontSize: "12px", borderColor: "#CBD5E1", backgroundColor: "#FAFAFA" }}
                >
                  {SLOT_TIMING_OPTIONS.map((slot) => (
                    <option key={slot.id} value={slot.id}>{slot.label}</option>
                  ))}
                </select>
              </div>

              {/* 4. Grass Type */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <label className="form-label mb-1 fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: "11px", color: "#1E293B" }}>
                  <i className="feather-layers text-success" /> Grass Type
                </label>
                <select
                  className="form-select form-select-sm rounded-3 border"
                  value={selectedGrassType}
                  onChange={(e) => setSelectedGrassType(e.target.value)}
                  style={{ height: "38px", fontSize: "12px", borderColor: "#CBD5E1", backgroundColor: "#FAFAFA" }}
                >
                  <option value="any">Any Grass</option>
                  <option value="box">Box Cricket Turf</option>
                  <option value="natural">Natural Grass Ground</option>
                  <option value="artificial">Artificial Turf</option>
                  <option value="matting">Matting Pitch</option>
                </select>
              </div>

              {/* 5. Amenities */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <label className="form-label mb-1 fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: "11px", color: "#1E293B" }}>
                  <i className="feather-grid text-success" /> Amenities
                </label>
                <select
                  className="form-select form-select-sm rounded-3 border"
                  value={selectedAmenity}
                  onChange={(e) => setSelectedAmenity(e.target.value)}
                  style={{ height: "38px", fontSize: "12px", borderColor: "#CBD5E1", backgroundColor: "#FAFAFA" }}
                >
                  <option value="any">Any Amenities</option>
                  <option value="floodlights">Floodlights</option>
                  <option value="parking">Parking</option>
                  <option value="changing-room">Changing Room</option>
                  <option value="water">Drinking Water</option>
                  <option value="canteen">Canteen / Cafe</option>
                </select>
              </div>

              {/* 6. Filter Action Buttons */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-12 d-flex align-items-end gap-2 mt-2 mt-xl-0">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-3 w-50 d-flex align-items-center justify-content-center gap-1"
                  style={{ height: "38px", fontSize: "11px", fontWeight: "600", borderColor: "#CBD5E1" }}
                  onClick={handleResetFilters}
                >
                  <i className="feather-sliders" /> Reset
                </button>
                <button
                  className="btn btn-success btn-sm rounded-3 w-50 d-flex align-items-center justify-content-center gap-1 fw-bold text-white shadow-sm"
                  style={{ height: "38px", fontSize: "11px", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                >
                  <i className="feather-filter" /> Apply
                </button>
              </div>

            </div>
          </div>

          {/* Cards Grid (Exact 5 Cards Per Row Desktop Layout matching user reference image) */}
          {currentVenues.length > 0 ? (
            <div className="ki-5-col-grid">
              {currentVenues.map((venue, index) => (
                <div key={index} className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease" }}>
                  
                  {/* Card Image Cover Header */}
                  <div className="listing-img" style={{ height: "140px", position: "relative" }}>
                    <Link
                      to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                      style={{ position: "absolute", inset: 0, display: "block" }}
                    >
                      {getVenueImage(venue?.images).startsWith("http") ? (
                        <img
                          src={getVenueImage(venue?.images)}
                          className="img-fluid"
                          alt={venue.name}
                          style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <ImageWithBasePath
                          src={getVenueImage(venue?.images)}
                          className="img-fluid"
                          alt={venue.name}
                          style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        />
                      )}
                    </Link>
                    
                    {/* Category Badge on Top-Left */}
                    <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                      <span className="badge" style={{ backgroundColor: "#22C55E", color: "#FFFFFF", fontWeight: "700", fontSize: "9px", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {venue?.vendor_type ? venue.vendor_type.replace("_", " ") : "Venue"}
                      </span>
                    </div>

                    {/* Favorite Heart Button on Top-Right */}
                    <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2 }}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(venue._id);
                        }}
                        className="btn btn-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                        style={{ width: "28px", height: "28px", padding: 0, backgroundColor: "#FFFFFF", border: "none" }}
                      >
                        <i 
                          className={favorites[venue._id] ? "fas fa-heart text-danger" : "feather-heart text-muted"} 
                          style={{ fontSize: "12px" }} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="listing-content news-content p-3" style={{ background: "#FFFFFF" }}>
                    
                    {/* Rating & Standard badge */}
                    <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                      <div className="rating-wrap d-flex align-items-center gap-1">
                        <i className="fas fa-star text-warning" style={{ fontSize: "10px" }} />
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#17222D" }}>4.8</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>
                        <i className="feather-grid me-1" style={{ color: "#3CAB4B", fontSize: "10px" }} />
                        Standard
                      </span>
                    </div>

                    {/* Venue Title */}
                    <h3 className="listing-title mb-1" style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.25" }}>
                      <Link
                        to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                        className="text-truncate d-block" style={{ color: "#17222D" }}
                        title={venue.name}
                      >
                        {venue.name}
                      </Link>
                    </h3>

                    {/* Location Pin & Map Link */}
                    <div className="d-flex align-items-center justify-content-between mb-2" style={{ fontSize: "11px" }}>
                      <p className="mb-0 text-truncate" style={{ fontSize: "11px", color: "#606D76" }}>
                        <i className="feather-map-pin me-1" style={{ color: "#3CAB4B" }} />
                        {venue.near_by_location || "Indore"}, Indore
                      </p>
                      {venue.google_location && (
                        <a
                          href={venue.google_location.startsWith("http") ? venue.google_location : `https://${venue.google_location}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Google Maps"
                          className="text-success ms-1 flex-shrink-0"
                          style={{ fontSize: "10px", fontWeight: "600" }}
                        >
                          Map 🗺️
                        </a>
                      )}
                    </div>

                    {/* Price & Book Button */}
                    <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#17222D" }}>
                        ₹{venue.price_per_hr || "750"} <span style={{ fontSize: "9px", fontWeight: "normal", color: "#606D76" }}>/hr</span>
                      </span>
                      <Link 
                        to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                        className="btn btn-primary btn-sm rounded-pill px-3 py-1"
                        style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                      >
                        Book Slot
                      </Link>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="col-12 text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8E3" }}>
              <i className="feather-alert-circle text-muted mb-2" style={{ fontSize: "32px" }} />
              <h5 className="fw-bold text-dark">No Venues Found</h5>
              <p className="text-muted fs-6 mb-0">Try clearing your search filters to view available facilities</p>
            </div>
          )}

          {/* Bottom Pagination & Status Subtitle (matching design reference) */}
          <div className="d-flex flex-column align-items-center justify-content-center mt-5 mb-3 gap-2">
            <ul className="pagination mb-0">
              <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link rounded-3 mx-1" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <i className="feather-chevron-left" />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                  <button 
                    className="page-link rounded-3 mx-1" 
                    onClick={() => handlePageChange(page)}
                    style={{
                      backgroundColor: page === currentPage ? "#22C55E" : "#FFFFFF",
                      borderColor: page === currentPage ? "#22C55E" : "#E2E8E3",
                      color: page === currentPage ? "#FFFFFF" : "#17222D",
                      fontWeight: "700"
                    }}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item next ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link rounded-3 mx-1" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <i className="feather-chevron-right" />
                </button>
              </li>
            </ul>

            <span className="text-muted" style={{ fontSize: "13px", fontWeight: "500", color: "#64748B" }}>
              Showing {indexOfFirstVenue + 1} to {Math.min(indexOfLastVenue, displayList.length)} of <span className="fw-bold text-dark">{displayList.length}</span> venues
            </span>
          </div>

        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
}
