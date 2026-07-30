import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";
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
}
interface Category {
  category_name: string;
}

interface FilterData {
  vendor_type: any;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  activities: string;
  category: string;
  _id: string;
  images: any;
  src: string;
  near_by_location: any;
}

const fuzzyMatch = (text: string, query: string): boolean => {
  if (!text || !query) return false;
  text = text.toLowerCase().trim();
  query = query.toLowerCase().trim();
  
  if (text.includes(query)) return true;

  const getEditDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1  // deletion
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const words = text.split(/\s+/);
  const qWords = query.split(/\s+/);
  
  return qWords.every((qw) => {
    return words.some((w) => {
      if (w.includes(qw)) return true;
      if (qw.includes(w)) return true;
      const distance = getEditDistance(w, qw);
      const maxAllowedDistance = qw.length <= 2 ? 0 : qw.length <= 5 ? 1 : 2;
      return distance <= maxAllowedDistance;
    });
  });
};

const BlogListSidebarLeft = (_props: { id: string; name: string }) => {
  const [venues, setVenues] = useState<Venues[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (venues.length > 0) {
      const initialFavs: Record<string, boolean> = {};
      venues.forEach((v) => {
        initialFavs[v._id] = localStorage.getItem(`fav_venue_${v._id}`) === "true";
      });
      setFavorites(initialFavs);
    }
  }, [venues]);

  const toggleFavorite = (venueId: string) => {
    const nextStatus = !favorites[venueId];
    localStorage.setItem(`fav_venue_${venueId}`, String(nextStatus));
    setFavorites((prev) => ({
      ...prev,
      [venueId]: nextStatus,
    }));

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: `<span style="color: #1E293B; font-size: 18px; font-weight: 500; font-family: sans-serif;">${nextStatus ? "Saved to Favourites!" : "Removed from Favourites"}</span>`,
      html: `<span style="color: #64748B; font-size: 14px; font-family: sans-serif;">${nextStatus ? "Venue added to your favorites list." : "Venue removed from your favorites list."}</span>`,
      timer: 1500,
      showConfirmButton: false,
      background: "#FFFFFF",
    });
  };

  const [venueByLocation, setVenueByLocation] = useState<Venues[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Advanced filters state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [grassType, setGrassType] = useState("");
  const [layoutType, setLayoutType] = useState("");
  const [floorType, setFloorType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleAmenityChange = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const { selectedLocationSort, selectedSport } = location.state || {};

  useEffect(() => {
    setSelectedLocation(selectedLocationSort?.name || "");
    setSelectedCategory(selectedSport?.name || null);
  }, [location, selectedLocationSort, selectedSport]);
  // useEffect(() => {
  //   document.title = "sports-venue"
  // }, []);

  useEffect(() => {
    // Fetch coach data from API
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
        }));
        setVenues(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setLoading(false);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/fetch`);
        const categoyrData = response.data.categories;
        const mappedData = categoyrData.map((category: any) => ({
          category_name: category.category_name,
          _id: category._id,
        }));
        setCategory(mappedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchCategory();

    fetchVenues();
  }, []);

  const venueType = [
    ...new Set(
      venues.map((venue) => venue.vendor_type ? String(venue.vendor_type).replace("_", " ") : "")
    ),
  ];

  useEffect(() => {
    let filteredData = venues;
    
    // 0. Search Query Filter
    const activeSearch = searchQuery || urlSearchQuery;
    if (activeSearch) {
      const q = activeSearch.toLowerCase().trim();
      filteredData = filteredData.filter((v) => {
        const venueName = String(v.name || "").toLowerCase();
        const address = String(v.address || "").toLowerCase();
        const city = String(v.city || "").toLowerCase();
        const category = String(v.category || "").toLowerCase();
        const vendorType = String(v.vendor_type || "").toLowerCase().replace("_", " ");
        const activities = String(v.activities || "").toLowerCase();
        const nearbyLoc = String(v.near_by_location || "").toLowerCase();

        return (
          fuzzyMatch(venueName, q) ||
          fuzzyMatch(address, q) ||
          fuzzyMatch(city, q) ||
          fuzzyMatch(category, q) ||
          fuzzyMatch(vendorType, q) ||
          fuzzyMatch(activities, q) ||
          fuzzyMatch(nearbyLoc, q)
        );
      });
    }
    
    // 1. Location Area Filter
    if (selectedLocation) {
      filteredData = filteredData.filter((t: any) =>
        t.near_by_location?.toLowerCase()?.includes(selectedLocation.toLowerCase())
      );
    }
    
    // 2. Category/Sport Filter
    if (selectedCategory) {
      filteredData = filteredData.filter((t: any) =>
        t.vendor_type?.toLowerCase()?.replace("_", " ")?.includes(selectedCategory.toLowerCase()) ||
        t.activities?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }
    
    // 3. Grass Type Filter
    if (grassType) {
      filteredData = filteredData.filter((t: any) =>
        t.description?.toLowerCase()?.includes(grassType.toLowerCase()) || 
        t.activities?.toLowerCase()?.includes(grassType.toLowerCase())
      );
    }

    // 4. Layout Type Filter
    if (layoutType) {
      filteredData = filteredData.filter((t: any) =>
        t.description?.toLowerCase()?.includes(layoutType.toLowerCase()) ||
        t.activities?.toLowerCase()?.includes(layoutType.toLowerCase())
      );
    }

    // 5. Floor Type Filter
    if (floorType) {
      filteredData = filteredData.filter((t: any) =>
        t.description?.toLowerCase()?.includes(floorType.toLowerCase()) ||
        t.address?.toLowerCase()?.includes(floorType.toLowerCase())
      );
    }

    // 6. Amenities Filters
    if (selectedAmenities.length > 0) {
      filteredData = filteredData.filter((t: any) => {
        return selectedAmenities.every(amenity => 
          t.description?.toLowerCase()?.includes(amenity.toLowerCase()) ||
          t.activities?.toLowerCase()?.includes(amenity.toLowerCase()) ||
          t.name?.toLowerCase()?.includes(amenity.toLowerCase())
        );
      });
    }

    // 7. Sorting Logic
    if (sortBy === "price-low-high") {
      filteredData = [...filteredData].sort((a, b) => (a.price_per_hr || 750) - (b.price_per_hr || 750));
    } else if (sortBy === "price-high-low") {
      filteredData = [...filteredData].sort((a, b) => (b.price_per_hr || 750) - (a.price_per_hr || 750));
    } else if (sortBy === "name") {
      filteredData = [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
    }

    setVenueByLocation(filteredData);
  }, [selectedLocation, selectedCategory, grassType, layoutType, floorType, selectedAmenities, sortBy, searchQuery, urlSearchQuery, venues]);

  const handleCategoryClick = (categoryName: any) => {
    setSelectedCategory(categoryName);

  };
  console.log(selectedCategory,'dsflksjldkfjs')

  useEffect(() => {
    if (selectedCategory) {
      document.title = `Sports Venue - ${selectedCategory}`;
    } else {
      document.title = "Sports Venue"; 
    }
  }, [selectedCategory]); 

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 5;
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues =
    venueByLocation.length > 0
      ? venueByLocation.slice(indexOfFirstVenue, indexOfLastVenue)
      : venues.slice(indexOfFirstVenue, indexOfLastVenue);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(
    (venueByLocation.length > 0 ? venueByLocation.length : venues.length) / venuesPerPage
  );

  const getPaginationPages = () => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const paginationPages = getPaginationPages();

  return (
    <div>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Hero Section */}
          <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
            {/* Blended Background Turf Graphics */}
            <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
            
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className="row align-items-center">
                <div className="col-lg-7 text-start">
                  <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
                  <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                    Sports <span style={{ color: "#22C55E", marginLeft: "12px" }}>Venues</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Find and book the best sports venues in Indore</p>
                  
                  {/* Breadcrumb pill */}
                  <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                    <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                    <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                    <span style={{ color: "#22C55E", fontWeight: "600" }}>Sports Venues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Hero Section */}

          {/* Page Content */}
          <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "32px 0 60px 0" }}>
            <div className="container">
              <div className="row">
                
                {/* Sidebar Filter on the Left */}
                <div className="col-sm-12 col-md-4 col-lg-4 blog-sidebar theiaStickySidebar">
                  <div className="stickybar">
                    <div className="ki-card filter-sidebar-card p-3 mb-0" style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      
                      {/* Filter Title Header & Reset */}
                      <div className="d-flex align-items-center justify-content-between pb-2 mb-3" style={{ borderBottom: "1px solid #E2E8E3" }}>
                        <h4 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "15px", fontWeight: "700", color: "#17222D" }}>
                          <i className="feather-sliders text-muted" style={{ fontSize: "16px" }} />
                          Filters
                        </h4>
                        <button 
                          onClick={() => {
                            setFromDate("");
                            setToDate("");
                            setFromTime("");
                            setToTime("");
                            setGrassType("");
                            setLayoutType("");
                            setFloorType("");
                            setSortBy("");
                            setSelectedAmenities([]);
                          }}
                          className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                          style={{ fontSize: "12px", fontWeight: "600", color: "#3CAB4B" }}
                        >
                          <i className="feather-refresh-cw" style={{ fontSize: "11px" }} />
                          Reset
                        </button>
                      </div>

                      {/* Group 1: Date Range */}
                      <div className="filter-section mb-3" style={{ borderBottom: "1px solid #EDF3EE", paddingBottom: "14px" }}>
                        <label className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "12px", fontWeight: "700", color: "#17222D" }}>
                          <i className="feather-calendar" style={{ color: "#3CAB4B", fontSize: "14px" }} />
                          Date Range
                        </label>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>From Date</label>
                            <input type="date" className="form-control form-control-sm compact-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                          </div>
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>To Date</label>
                            <input type="date" className="form-control form-control-sm compact-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                          </div>
                        </div>
                      </div>

                      {/* Group 2: Time Range */}
                      <div className="filter-section mb-3" style={{ borderBottom: "1px solid #EDF3EE", paddingBottom: "14px" }}>
                        <label className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "12px", fontWeight: "700", color: "#17222D" }}>
                          <i className="feather-clock" style={{ color: "#3CAB4B", fontSize: "14px" }} />
                          Time Range
                        </label>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>From Hour</label>
                            <select className="form-select form-select-sm compact-select" value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
                              <option value="">Start</option>
                              <option value="06:00">6 AM</option>
                              <option value="08:00">8 AM</option>
                              <option value="10:00">10 AM</option>
                              <option value="12:00">12 PM</option>
                              <option value="14:00">2 PM</option>
                              <option value="16:00">4 PM</option>
                              <option value="18:00">6 PM</option>
                              <option value="20:00">8 PM</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>To Hour</label>
                            <select className="form-select form-select-sm compact-select" value={toTime} onChange={(e) => setToTime(e.target.value)}>
                              <option value="">End</option>
                              <option value="08:00">8 AM</option>
                              <option value="10:00">10 AM</option>
                              <option value="12:00">12 PM</option>
                              <option value="14:00">2 PM</option>
                              <option value="16:00">4 PM</option>
                              <option value="18:00">6 PM</option>
                              <option value="20:00">8 PM</option>
                              <option value="22:00">10 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Specifications (Grass, Layout, Level, Sort) in side-by-side grids */}
                      <div className="filter-section mb-3" style={{ borderBottom: "1px solid #EDF3EE", paddingBottom: "14px" }}>
                        <div className="row g-2 mb-2">
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>Grass Type</label>
                            <select className="form-select form-select-sm compact-select" value={grassType} onChange={(e) => setGrassType(e.target.value)}>
                              <option value="">Any Grass</option>
                              <option value="natural">Natural</option>
                              <option value="artificial">Artificial</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>Layout</label>
                            <select className="form-select form-select-sm compact-select" value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
                              <option value="">Any Layout</option>
                              <option value="covered">Indoor</option>
                              <option value="open">Outdoor</option>
                            </select>
                          </div>
                        </div>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>Floor Level</label>
                            <select className="form-select form-select-sm compact-select" value={floorType} onChange={(e) => setFloorType(e.target.value)}>
                              <option value="">Any Level</option>
                              <option value="ground">Ground</option>
                              <option value="terrace">Terrace</option>
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="filter-label" style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>Sort By</label>
                            <select className="form-select form-select-sm compact-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                              <option value="">Default</option>
                              <option value="price-low-high">Price: Low-High</option>
                              <option value="price-high-low">Price: High-Low</option>
                              <option value="name">Name: A-Z</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Group 3: Amenities in 2 Columns */}
                      <div className="filter-section mb-3 pb-0" style={{ borderBottom: "none" }}>
                        <label className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "12px", fontWeight: "700", color: "#17222D" }}>
                          <i className="feather-tag" style={{ color: "#3CAB4B", fontSize: "14px" }} />
                          Amenities
                        </label>
                        <div className="row g-2">
                          {[
                            { label: "Floodlights", key: "lighting" },
                            { label: "CCTV", key: "security" },
                            { label: "Parking", key: "parking" },
                            { label: "Changing Room", key: "seating" },
                            { label: "Drinking Water", key: "cafeteria" },
                            { label: "Washroom", key: "ac" }
                          ].map((amenity) => (
                            <div className="col-6" key={amenity.key}>
                              <div className="form-check m-0 d-flex align-items-start gap-2">
                                <input 
                                  type="checkbox" 
                                  className="form-check-input" 
                                  id={`amenity-${amenity.key}`}
                                  checked={selectedAmenities.includes(amenity.key)}
                                  onChange={() => handleAmenityChange(amenity.key)}
                                  style={{ width: "13px", height: "13px", cursor: "pointer", flexShrink: 0, marginTop: "2px" }}
                                />
                                <label className="form-check-label" htmlFor={`amenity-${amenity.key}`} style={{ fontSize: "11px", cursor: "pointer", color: "#606D76", fontWeight: "500", userSelect: "none", whiteSpace: "normal", lineHeight: "1.2" }}>
                                  {amenity.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Apply Filters Button */}
                      <div className="mt-3">
                        <button 
                          className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2" 
                          style={{ backgroundColor: "#3CAB4B", borderColor: "#3CAB4B", fontWeight: "600", fontSize: "13px", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(60, 171, 75, 0.2)" }}
                        >
                          <i className="feather-search" />
                          Apply Filters
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Listings Grid on the Right */}
                <div className="col-sm-12 col-md-8 col-lg-8">
                  
                  {/* Listings Header */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 py-2 px-3 bg-white rounded shadow-sm border" style={{ borderColor: "#E2E8E3" }}>
                    <h5 className="m-0" style={{ fontSize: "14px", fontWeight: "700", color: "#475569" }}>
                      <span style={{ color: "#3CAB4B", marginRight: "6px" }}>
                        {selectedCategory || searchQuery || urlSearchQuery || selectedLocation ? venueByLocation.length : venues.length}
                      </span> 
                      Venues Found
                    </h5>
                    
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {/* Local Live Search Input */}
                      <div className="position-relative" style={{ width: "200px" }}>
                        <i className="fas fa-search listings-search-icon" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", position: "absolute", color: "#94A3B8", fontSize: "12px" }} />
                        <input
                          type="text"
                          className="form-control listings-search-input"
                          placeholder="Search venues..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ height: "32px", fontSize: "12px", paddingLeft: "26px", borderRadius: "50px", border: "1px solid #E2E8F0" }}
                        />
                      </div>

                      <div className="d-flex align-items-center gap-1 bg-white px-2 py-1 rounded border" style={{ fontSize: "12px", height: "32px", borderColor: "#E2E8E3" }}>
                        <span className="text-muted pe-1">Sort by:</span>
                        <select className="form-select form-select-sm border-0 bg-transparent py-0 ps-0 pe-4" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ fontSize: "12px", fontWeight: "600", boxShadow: "none", width: "100px", backgroundPosition: "right 4px center" }}>
                          <option value="">Popular</option>
                          <option value="price-low-high">Price: Low-High</option>
                          <option value="price-high-low">Price: High-Low</option>
                          <option value="name">Name: A-Z</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {currentVenues.map((venue, index) => (
                      <div className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex" key={index}>
                        <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                          <div className="listing-img" style={{ height: "140px", position: "relative" }}>
                            <div
                              className="background-image"
                              style={{
                                backgroundImage: `url(${venue?.images[0]?.src
                                    ? `${IMG_URL}${venue?.images[0]?.src}`
                                    : "/assets/img/no-img.png"
                                  })`,
                                height: "100%",
                                backgroundSize: "cover"
                              }}
                            ></div>
                            <Link
                              to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              style={{ position: "absolute", inset: 0 }}
                            >
                              <ImageWithBasePath
                                src={
                                  venue?.images[0]?.src
                                    ? `${IMG_URL}${venue?.images[0]?.src}`
                                    : "/assets/img/no-img.png"
                                }
                                className="img-fluid foreground-image"
                                alt="Venue Image"
                                style={{ height: "100%", width: "100%", objectFit: "cover", opacity: 0 }}
                              />
                            </Link>
                            
                            {/* Favorite Heart Button */}
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
                                  style={{ fontSize: "13px" }} 
                                />
                              </button>
                            </div>

                            {/* Category Badge */}
                            <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                              <span className="tag tag-blue" style={{ background: "#2D3E33", color: "#FFFFFF", fontWeight: "700", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                                {venue?.vendor_type.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                          <div className="listing-content news-content p-3" style={{ background: "#FFFFFF" }}>
                            <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                              <div className="rating-wrap d-flex align-items-center gap-1">
                                <i className="fas fa-star text-warning" style={{ fontSize: "10px" }} />
                                <span style={{ fontSize: "10px", fontWeight: "700", color: "#17222D" }}>4.8</span>
                              </div>
                              <span style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>
                                <i className="feather-grid me-1" style={{ color: "#3CAB4B", fontSize: "10px" }} />
                                Standard
                              </span>
                            </div>
                            <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                              <Link
                                to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                                className="text-truncate d-block" style={{ color: "#17222D" }}
                              >
                                {venue.name}
                              </Link>
                            </h3>
                            <p className="mb-2 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                              <i className="feather-map-pin me-1" style={{ color: "#606D76" }} />
                              {venue.near_by_location}, Indore
                            </p>
                            <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: "1px solid #E2E8E3" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                                ₹{venue.price_per_hr || "750"} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                              </span>
                              <Link 
                                to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                                className="btn btn-primary btn-sm rounded-pill px-3 py-1"
                                style={{ fontSize: "11px", fontWeight: "600", backgroundColor: "#3CAB4B", borderColor: "#3CAB4B" }}
                              >
                                Book Slot
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Modern Centered Pagination wrapper */}
                  <div className="d-flex justify-content-center w-100 mt-4">
                    <ul className="pagination">
                      {venues.length > venuesPerPage && (
                        <>
                          <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                              <i className="feather-chevron-left" />
                            </button>
                          </li>
                          {paginationPages.map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
                            >
                              {page === "..." ? (
                                <span className="page-link" style={{ border: "none", background: "transparent", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center" }}>...</span>
                              ) : (
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}
                          <li className={`page-item next ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                              <i className="feather-chevron-right" />
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* /Page Content */}
        </>
      )}
    </div>
  );
};

export default BlogListSidebarLeft;
