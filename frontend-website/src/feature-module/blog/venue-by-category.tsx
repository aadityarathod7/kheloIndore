import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
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

export default function VenueByCategory(props: any) {
  const routes = all_routes;
  const [venues, setVenues] = useState<Venues[]>([]);
  const [locationName, setLocationName] = useState("");
  const [categoryVenue, setCategoryVenue] = useState<Venues[]>([]);
  const [locationVenue, setLocationVenue] = useState<Venues[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationData, setSearchLocationData] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const thisCategory = useParams<{ type: string }>();
  const categorySelected = thisCategory?.type || "";

  const categoryTitle = categorySelected
    ? categorySelected
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

  const venueLocations = [
    ...new Set(
      venues
        .map((venue) => venue.near_by_location ? String(venue.near_by_location).replace("_", " ") : "")
        .filter(Boolean)
    ),
  ];

  const searchingLocations = (e: any) => {
    const value = e.target.value;
    setSearchLocation(value);
    if (value.trim() === "") {
      setSearchLocationData([]);
    } else {
      setSearchLocationData(
        venueLocations.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleLocationClick = (loc: string) => {
    if (locationName === loc) {
      setLocationName("");
    } else {
      setLocationName(loc);
    }
  };

  useEffect(() => {
    if (categorySelected && venues.length > 0) {
      let filteredData;
      if (categorySelected.toLowerCase() === "other-sports") {
        filteredData = venues.filter((t: any) => {
          const vt = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
          const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
          const name = (t.name || "").toLowerCase();
          const desc = (t.description || "").toLowerCase();

          const isCricket = vt.includes("cricket") || cat.includes("cricket") || name.includes("cricket") || desc.includes("cricket") || vt.includes("turf") || cat.includes("turf");
          const isBadminton = vt.includes("badminton") || cat.includes("badminton") || name.includes("badminton");
          const isSwimming = vt.includes("swim") || cat.includes("swim") || name.includes("swim");
          const isFootball = vt.includes("football") || cat.includes("football") || name.includes("football");
          const isPickleball = vt.includes("pickle") || cat.includes("pickle") || name.includes("pickle");
          const isTennis = (vt.includes("tennis") || cat.includes("tennis") || name.includes("tennis")) && !vt.includes("table") && !cat.includes("table") && !name.includes("table");
          const isBasketball = vt.includes("basketball") || cat.includes("basketball") || name.includes("basketball");
          const isTableTennis = vt.includes("table tennis") || cat.includes("table tennis") || name.includes("table tennis");

          return !(isCricket || isBadminton || isSwimming || isFootball || isPickleball || isTennis || isBasketball || isTableTennis);
        });
      } else {
        const targetCat = categorySelected.toLowerCase().replace(/-/g, " ").trim();
        filteredData = venues.filter((t: any) => {
          const vendorType = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
          const category = (t.category || "").toLowerCase().replace(/_/g, " ").trim();

          return (
            vendorType.includes(targetCat) ||
            category.includes(targetCat) ||
            targetCat.includes(vendorType) ||
            targetCat.includes(category)
          );
        });
      }
      setCategoryVenue(filteredData.length > 0 ? filteredData : venues);
    } else {
      setCategoryVenue(venues);
    }
  }, [venues, categorySelected]);

  useEffect(() => {
    if (locationName) {
      const filteredData = categoryVenue.filter((t: any) => {
        const formattedLocation = (t.near_by_location || "").replace("_", " ").toLowerCase();
        return formattedLocation.includes(locationName.toLowerCase());
      });
      setLocationVenue(filteredData);
    } else {
      setLocationVenue([]);
    }
  }, [locationName, categoryVenue]);

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 9;
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;

  const displayList = locationName ? locationVenue : categoryVenue;
  const currentVenues = displayList.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(displayList.length / venuesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Header Section with ample top padding to prevent fixed navbar overlap */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "150px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "44px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "12px" }}>
                {categoryTitle} <span style={{ color: "#22C55E", marginLeft: "10px" }}>Venues</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "20px", fontWeight: "500", maxWidth: "480px" }}>
                Browse and book top-rated {categoryTitle.toLowerCase()} venues across Indore
              </p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-1.5 rounded-pill shadow-sm" style={{ fontSize: "12px", border: "1px solid #E5E7EB" }}>
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

      {/* Page Content */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "32px 0 60px 0" }}>
        <div className="container">
          <div className="row">
            
            {/* Venue Listings (Sleek Compact 3-Column Cards inside 8-col area) */}
            <div className="col-sm-12 col-md-8 col-lg-8">
              
              {/* Results Header */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 py-2 px-3 bg-white rounded-3 shadow-sm border" style={{ borderColor: "#E2E8E3" }}>
                <h5 className="m-0" style={{ fontSize: "13px", fontWeight: "700", color: "#475569" }}>
                  <span style={{ color: "#3CAB4B", marginRight: "6px" }}>{displayList.length}</span> 
                  {categoryTitle} Venues {locationName ? `in ${locationName}` : ""}
                </h5>
                {locationName && (
                  <button 
                    onClick={() => setLocationName("")}
                    className="btn btn-sm btn-link p-0 text-decoration-none" style={{ fontSize: "11px", color: "#EF4444", fontWeight: "600" }}
                  >
                    Clear location filter ✕
                  </button>
                )}
              </div>

              {/* Cards Grid (3 cards per row for compact look) */}
              <div className="row g-3">
                {currentVenues.length > 0 ? (
                  currentVenues.map((venue, index) => (
                    <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={index}>
                      <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8E3", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                        
                        {/* Compact Card Image Header */}
                        <div className="listing-img" style={{ height: "115px", position: "relative" }}>
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
                          
                          {/* Favorite Button */}
                          <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 2 }}>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(venue._id);
                              }}
                              className="btn btn-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                              style={{ width: "24px", height: "24px", padding: 0, backgroundColor: "#FFFFFF", border: "none" }}
                            >
                              <i 
                                className={favorites[venue._id] ? "fas fa-heart text-danger" : "feather-heart text-muted"} 
                                style={{ fontSize: "11px" }} 
                              />
                            </button>
                          </div>

                          {/* Category Badge */}
                          <div style={{ position: "absolute", top: "6px", left: "6px", zIndex: 2 }}>
                            <span className="tag tag-blue" style={{ background: "#2D3E33", color: "#FFFFFF", fontWeight: "700", fontSize: "9px", padding: "3px 6px", borderRadius: "4px", textTransform: "uppercase" }}>
                              {venue?.vendor_type ? venue.vendor_type.replace("_", " ") : "Venue"}
                            </span>
                          </div>
                        </div>

                        {/* Compact Card Body */}
                        <div className="listing-content news-content p-2.5" style={{ background: "#FFFFFF", padding: "10px" }}>
                          <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "10px" }}>
                            <div className="rating-wrap d-flex align-items-center gap-1">
                              <i className="fas fa-star text-warning" style={{ fontSize: "9px" }} />
                              <span style={{ fontSize: "10px", fontWeight: "700", color: "#17222D" }}>4.8</span>
                            </div>
                          </div>
                          
                          <h3 className="listing-title mb-1" style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.2" }}>
                            <Link
                              to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              className="text-truncate d-block" style={{ color: "#17222D" }}
                              title={venue.name}
                            >
                              {venue.name}
                            </Link>
                          </h3>
                          
                          <div className="d-flex align-items-center justify-content-between mb-1.5" style={{ fontSize: "11px" }}>
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
                          
                          <div className="d-flex align-items-center justify-content-between pt-1.5" style={{ borderTop: "1px solid #F1F5F9" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#17222D" }}>
                              ₹{venue.price_per_hr || "750"} <span style={{ fontSize: "9px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                            </span>
                            <Link 
                              to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              className="btn btn-primary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center justify-content-center shadow-sm"
                              style={{ 
                                fontSize: "11px", 
                                fontWeight: "700", 
                                background: "linear-gradient(135deg, #43B649 0%, #349E3A 100%)", 
                                border: "none",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 12px rgba(67, 182, 73, 0.28)",
                                transition: "all 0.25s ease"
                              }}
                            >
                              Book Slot
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5 bg-white rounded-3 border" style={{ borderColor: "#E2E8E3" }}>
                    <i className="feather-alert-circle text-muted mb-2" style={{ fontSize: "28px" }} />
                    <h6 className="fw-bold text-dark mb-1">No Venues Found</h6>
                    <p className="text-muted small mb-0">Try clearing location search to view available facilities</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center w-100 mt-4">
                  <ul className="pagination">
                    <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <i className="feather-chevron-left" />
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item next ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <i className="feather-chevron-right" />
                      </button>
                    </li>
                  </ul>
                </div>
              )}

            </div>

            {/* Location Sidebar on Right with clean search input padding */}
            <div className="col-sm-12 col-md-4 col-lg-4 blog-sidebar theiaStickySidebar">
              <div className="stickybar">
                <div className="ki-card filter-sidebar-card p-3 mb-0" style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  
                  <div className="d-flex align-items-center justify-content-between pb-2 mb-3" style={{ borderBottom: "1px solid #E2E8E3" }}>
                    <h4 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                      <i className="feather-map-pin text-muted" style={{ fontSize: "15px" }} />
                      Filter by Location
                    </h4>
                    {locationName && (
                      <button 
                        onClick={() => setLocationName("")} 
                        className="btn btn-link p-0 text-decoration-none" style={{ fontSize: "11px", color: "#3CAB4B", fontWeight: "600" }}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Search Location Input with NO icon overlap */}
                  <div className="position-relative mb-3">
                    <i 
                      className="feather-search" 
                      style={{ 
                        left: "14px", 
                        top: "50%", 
                        transform: "translateY(-50%)", 
                        position: "absolute", 
                        color: "#94A3B8", 
                        fontSize: "13px",
                        pointerEvents: "none",
                        zIndex: 2
                      }} 
                    />
                    <input
                      type="text"
                      className="form-control ki-search-input-has-icon"
                      placeholder="Search area..."
                      value={searchLocation}
                      onChange={searchingLocations}
                      style={{ 
                        height: "38px", 
                        fontSize: "12px", 
                        borderRadius: "10px", 
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#FAFAFA"
                      }}
                    />
                  </div>

                  {/* Locations List */}
                  <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                    <ul className="list-unstyled mb-0">
                      {(searchLocationData.length > 0 ? searchLocationData : venueLocations).map((loc, index) => {
                        const isSelected = locationName === loc;
                        return (
                          <li key={index} className="mb-1">
                            <button
                              onClick={() => handleLocationClick(loc)}
                              className="btn w-100 text-start d-flex align-items-center justify-content-between py-1.5 px-3 rounded"
                              style={{
                                fontSize: "12px",
                                fontWeight: isSelected ? "700" : "500",
                                color: isSelected ? "#15803D" : "#475569",
                                backgroundColor: isSelected ? "#F0FDF4" : "transparent",
                                border: isSelected ? "1px solid #BBF7D0" : "1px solid transparent",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <span>{loc}</span>
                              {isSelected && <i className="feather-check text-success" style={{ fontSize: "13px" }} />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
}
