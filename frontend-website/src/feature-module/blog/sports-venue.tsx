import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";

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

const BlogListSidebarLeft = (_props: { id: any; name: any }) => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [venues, setVenues] = useState<Venues[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueByLocation, setVenueByLocation] = useState<Venues[]>([]);
  const [seacrhCategory, setSearchCategory] = useState("");
  const [searchCategoryData, setSearchCategoryData] = useState<Venues[]>([]);
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

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(item => item !== amenity) : [...prev, amenity]
    );
  };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
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
      venues.map((venue, _index) => venue.vendor_type.replace("_", " "))
    ),
  ];

  const searchingCategories = (e:any) => {
    const value = e.target.value;
    setSearchCategory(value);
    if (value.trim() === "") {
      setSearchCategoryData([]);
    } else {
      setSearchCategoryData(
        venueType.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    let filteredData = venues;
    
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
  }, [selectedLocation, selectedCategory, grassType, layoutType, floorType, selectedAmenities, sortBy, venues]);

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

  return (
    <div>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Breadcrumb */}
          <div className="breadcrumb breadcrumb-list mb-0 top-margin">
            <span className="primary-right-round" />
            <div className="container">
              <h1 className="text-white">Sports Venue</h1>
              <ul>
                <li>
                  <Link to={routes.home}>Home</Link>
                </li>
                <li>Sports Venue</li>
              </ul>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Page Content */}
          <div className="content blog-grid">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-8">
                  <div className="row">
                    {currentVenues.map((venue, index) => (
                      <div className="col-lg-6 col-md-12 col-sm-6 mb-4 d-flex" key={index}>
                        <div className="ki-card ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden" }}>
                          <div className="listing-item venue-page p-0 border-0 w-100" style={{ background: "transparent" }}>
                            <div className="listing-img" style={{ height: "180px", position: "relative" }}>
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
                              <div className="fav-item-venues news-sports" style={{ top: "12px", left: "12px" }}>
                                <span className="tag tag-blue" style={{ background: "linear-gradient(90deg, #49BC4F, #38A941)", color: "#FFFFFF", fontWeight: "700", boxShadow: "0 2px 8px rgba(60,171,75,0.2)" }}>
                                  {venue?.vendor_type.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div className="listing-content news-content p-3">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="rating-wrap d-flex align-items-center gap-1">
                                  <i className="fas fa-star text-warning" style={{ fontSize: "12px" }} />
                                  <span style={{ fontSize: "12px", color: "#606D76" }}>4.8 (18 reviews)</span>
                                </div>
                                <span style={{ fontSize: "12px", color: "#606D76" }}>
                                  <i className="fas fa-arrows-alt me-1" style={{ color: "#3CAB4B" }} />
                                  Standard Size
                                </span>
                              </div>
                              <h3 className="listing-title mb-2" style={{ fontSize: "18px", fontWeight: "600" }}>
                                <Link
                                  to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                                  className="text-truncate d-block" style={{ color: "#17222D" }}
                                >
                                  {venue.name}
                                </Link>
                              </h3>
                              <p className="mb-3" style={{ fontSize: "13px", color: "#606D76" }}>
                                <i className="feather-map-pin me-2" style={{ color: "#3CAB4B" }} />
                                {venue.near_by_location}
                              </p>
                              <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: "1px solid #E2E8E3" }}>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#17222D" }}>
                                  ₹{venue.price_per_hr || "750"} <span style={{ fontSize: "11px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                                </span>
                                <Link 
                                  to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                                  className="btn btn-primary btn-sm rounded-pill px-3"
                                  style={{ fontSize: "12px" }}
                                >
                                  Book Slot
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ul className="pagination">
                    {venues.length > venuesPerPage &&
                      Array(Math.ceil(venues.length / venuesPerPage))
                        .fill()
                        .map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                  </ul>

                  {/* /Blog */}
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4 blog-sidebar theiaStickySidebar">
                  <div className="stickybar d-flex flex-column gap-4">
                    {/* Advanced Date & Hour Filter */}
                    <div className="ki-card mb-0">
                      <h4 className="mb-3" style={{ fontSize: "18px", borderBottom: "none", paddingBottom: 0, color: "#17222D" }}>Advanced Booking Filter</h4>
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="mb-1" style={{ fontSize: "11px", color: "#606D76" }}>From Date</label>
                          <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: "6px 8px", fontSize: "12px" }} />
                        </div>
                        <div className="col-6">
                          <label className="mb-1" style={{ fontSize: "11px", color: "#606D76" }}>To Date</label>
                          <input type="date" className="form-control form-control-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: "6px 8px", fontSize: "12px" }} />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="mb-1" style={{ fontSize: "11px", color: "#606D76" }}>From Hour</label>
                          <select className="form-select form-select-sm" value={fromTime} onChange={(e) => setFromTime(e.target.value)} style={{ padding: "6px 8px", fontSize: "12px" }}>
                            <option value="">Start</option>
                            <option value="06:00">6:00 AM</option>
                            <option value="08:00">8:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="20:00">8:00 PM</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label className="mb-1" style={{ fontSize: "11px", color: "#606D76" }}>To Hour</label>
                          <select className="form-select form-select-sm" value={toTime} onChange={(e) => setToTime(e.target.value)} style={{ padding: "6px 8px", fontSize: "12px" }}>
                            <option value="">End</option>
                            <option value="08:00">8:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="22:00">10:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Sorting Card */}
                    <div className="ki-card mb-0">
                      <h4 className="mb-3" style={{ fontSize: "18px", borderBottom: "none", paddingBottom: 0, color: "#17222D" }}>Sort Results</h4>
                      <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px" }}>
                        <option value="">Default sorting</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>

                    {/* Pitch Specifications */}
                    <div className="ki-card mb-0">
                      <h4 className="mb-3" style={{ fontSize: "18px", borderBottom: "none", paddingBottom: 0, color: "#17222D" }}>Pitch Features</h4>
                      
                      <div className="mb-3">
                        <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#606D76" }}>Grass Type</label>
                        <select className="form-select form-select-sm" value={grassType} onChange={(e) => setGrassType(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px" }}>
                          <option value="">Any Grass</option>
                          <option value="natural">Natural Grass</option>
                          <option value="artificial">Artificial Grass</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#606D76" }}>Layout</label>
                        <select className="form-select form-select-sm" value={layoutType} onChange={(e) => setLayoutType(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px" }}>
                          <option value="">Any Layout</option>
                          <option value="covered">Covered / Indoor</option>
                          <option value="open">Open Air / Outdoor</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#606D76" }}>Location Level</label>
                        <select className="form-select form-select-sm" value={floorType} onChange={(e) => setFloorType(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px" }}>
                          <option value="">Any Level</option>
                          <option value="ground">Ground Floor</option>
                          <option value="terrace">Terrace / Rooftop</option>
                        </select>
                      </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="ki-card mb-0">
                      <h4 className="mb-3" style={{ fontSize: "18px", borderBottom: "none", paddingBottom: 0, color: "#17222D" }}>Amenities</h4>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { label: "Floodlights", key: "lighting" },
                          { label: "Security / CCTV", key: "security" },
                          { label: "Seating Stand", key: "seating" },
                          { label: "Parking Space", key: "parking" },
                          { label: "Cafeteria / Cafe", key: "cafeteria" },
                          { label: "Air Conditioning", key: "ac" },
                          { label: "Sound System", key: "sound" }
                        ].map((amenity) => (
                          <div className="form-check" key={amenity.key}>
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              id={`amenity-${amenity.key}`}
                              checked={selectedAmenities.includes(amenity.key)}
                              onChange={() => handleAmenityChange(amenity.key)}
                              style={{ cursor: "pointer" }}
                            />
                            <label className="form-check-label" htmlFor={`amenity-${amenity.key}`} style={{ fontSize: "13px", cursor: "pointer", color: "#606D76" }}>
                              {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
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
