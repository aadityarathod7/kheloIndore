import React, { useState, useEffect, ReactNode } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
// import data from '../../../public/assets/img/featured'
interface Location {
  address: string;
  city: string;
  state: string;
  zipcode: number;
}

interface Coach {
  full_name: ReactNode;
  trainer_type: any;
  first_name: string;
  last_name: string;
  location: Location;
  experience: string;
  availability: string;
  specializations: string[];
  bio: string;
  _id: number;
  price: number;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  profile_picture: any;
  src: string;
  orgname: string;
  // profile:string;
  category: string;
  near_by_location: string;
  age: number;
}
interface FilterData {
  trainer_type: ReactNode;
  full_name: ReactNode;
  first_name: string;
  last_name: string;
  location: Location;
  experience: string;
  availability: string;
  specializations: string[];
  bio: string;
  _id: number;
  price: number;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  profile_picture: any;
  src: string;
  orgname: string;
  // profile:string;
  category: string;
  near_by_location: string;
  age: number;
}

interface SortCriteria {
  name: string;
  // other properties if needed
}

const options = [
  { value: "archery", label: "Archery" },
  { value: "badminton", label: "Badminton" },
  { value: "baseball", label: "Baseball" },
  { value: "basketball", label: "Basketball" },
  { value: "golf", label: "Golf" },
  { value: "hockey", label: "Hockey" },
  { value: "kabaddi", label: "Kabaddi" },
  { value: "shooting", label: "Shooting" },
  { value: "skating", label: "Skating" },
  { value: "snooker", label: "Snooker" },
  { value: "soccer", label: "Soccer" },
  { value: "squash", label: "Squash" },
  { value: "swimming", label: "Swimming" },
  { value: "tennis", label: "Tennis" },
  { value: "volleyball", label: "Volleyball" },
  { value: "yoga", label: "Yoga" },
  { value: "zumba", label: "Zumba" },
];

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

const CoachesGrid = (_props: { id?: string }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortCriteria>();
  const [name, setName] = useState<any[]>([]);
  const [locationName, setLocationName] = useState<any[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [finalFilterCoach, setFinalFilterCoach] = useState<FilterData[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  const navigate = useNavigate();
  const locations = useLocation();

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "coaches "
  }, []);

  const locationByHome = useLocation();
  const { selectedLocationSort, selectedSport } = locationByHome.state || {};

  useEffect(() => {
    setLocation(selectedLocationSort?.name || "");
    setSelectedCategory(selectedSport?.name || null);
  }, [locationByHome, selectedLocationSort, selectedSport]);

  useEffect(() => {
    // Fetch coach data from API
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((coach: any) => ({
          first_name: coach.first_name,
          last_name: coach.last_name,

          _id: coach._id,

          full_name: coach.full_name, // Ensure full_name is included
          trainer_type: coach.trainer_type, // Ensure trainer_type is included
          specializations: coach.specializations,
          profile_picture: coach.profile_picture,
          category: coach.category,
          near_by_location: coach.near_by_location,
        }));
        setCoaches(mappedData);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({
      name: t.category,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setName(updatedNames);
  }, [coaches]);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({
      name: t.near_by_location,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setLocationName(updatedNames);
  }, [coaches]);

  // Handle category change

  const handleCategoryChange = (e: { value: string }) => {
    console.log("Selected Category:", e.value);  // Debugging line
    setSelectedCategory(e.value);  // Update selected category
  };

  useEffect(() => {
    let filteredData = coaches;

    const activeSearch = searchQuery || urlSearchQuery;
    if (activeSearch) {
      const q = activeSearch.toLowerCase().trim();
      filteredData = filteredData.filter((coach) => {
        const firstName = String(coach.first_name || "").toLowerCase();
        const lastName = String(coach.last_name || "").toLowerCase();
        const fullName = String(coach.full_name || `${firstName} ${lastName}`).toLowerCase();
        const category = String(coach.category || "").toLowerCase();
        const trainerType = String(coach.trainer_type || "").toLowerCase();
        const nearbyLoc = String(coach.near_by_location || "").toLowerCase();
        
        let specMatch = false;
        if (Array.isArray(coach.specializations)) {
          specMatch = coach.specializations.some((s: string) => fuzzyMatch(s, q));
        } else if (coach.specializations) {
          specMatch = fuzzyMatch(String(coach.specializations), q);
        }

        return (
          fuzzyMatch(fullName, q) ||
          fuzzyMatch(category, q) ||
          fuzzyMatch(trainerType, q) ||
          fuzzyMatch(nearbyLoc, q) ||
          specMatch
        );
      });
    }

    if (location) {
      filteredData = filteredData.filter((coach) =>
        coach.near_by_location?.toLowerCase()?.includes(location.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((coach) =>
        coach.category?.toLowerCase()?.includes(selectedCategory.toLowerCase()) ||
        coach.trainer_type?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }

    setFinalFilterCoach(filteredData);
  }, [location, selectedCategory, searchQuery, urlSearchQuery, coaches]);

  // Handle trainer type change (you can set options here as well)

  // useEffect(() => {
  //   if (location) {
  //     const filteredData = coaches.filter((t: any) =>
  //       t.near_by_location?.includes(location)
  //     );
  //     setCoachByLocation(filteredData);
  //     setFinalFilterCoach(filteredData);
  //   }
  // }, [location, coaches]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     if (selectedSort) {
  //       const filteredData = coachPrice.filter((t: any) =>
  //         t.category?.includes(selectedCategory)
  //       );
  //       // setFilterCoaches(filteredData);
  //       setFinalFilterCoach(filteredData);
  //     } else {
  //       const filteredData = coaches.filter((t: any) =>
  //         t.category?.includes(selectedCategory)
  //       );
  //       setCoachCategory(filteredData);
  //       setFinalFilterCoach(filteredData);
  //     }
  //   }

  //   if (selectedCategory) {
  //     const filteredData = coaches.filter((t: any) =>
  //       t.category?.includes(selectedCategory)
  //     );
  //     setCoachCategory(filteredData);
  //     setFinalFilterCoach(filteredData);
  //   }
  // }, [selectedCategory]);

  // useEffect(() => {
  //   if (selectedSort) {
  //     if (selectedCategory) {
  //       if (selectedSort.name === "low price") {
  //         const filterData = coachCategogy.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         // setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       } else {
  //         const filterData = coachCategogy.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         // setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       }
  //     } else {
  //       if (selectedSort.name === "low price") {
  //         const filterData = coaches.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       } else {
  //         const filterData = coaches.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       }
  //     }
  //   }
  // }, [selectedSort]);

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const sortOptions = [{ name: "low price" }, { name: "high price" }];
  // const locationOptions = [];

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/coaches/coach-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: locations.pathname } }
      )
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Sports <span style={{ color: "#22C55E", marginLeft: "12px" }}>Coaches</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Find and book the best sports coaches in Indore</p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      {/* Page Content */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "16px 0 40px 0" }}>
        <div className="container">
          {/* Sort By */}
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section d-flex align-items-center justify-content-between flex-wrap gap-3 py-2 px-3">
                <div className="count-search mb-0">
                  <p className="mb-0" style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    <span>
                      {selectedCategory || searchQuery || urlSearchQuery || selectedSort || location
                        ? finalFilterCoach.length
                        : coaches.length}
                    </span>{" "}
                    Coaches are listed
                  </p>
                </div>
                
                <div className="d-flex align-items-center flex-wrap gap-3">
                  {/* Local Live Search Input */}
                  <div className="position-relative" style={{ width: "260px" }}>
                    <i className="fas fa-search listings-search-icon" />
                    <input
                      type="text"
                      className="form-control listings-search-input"
                      placeholder="Search coach by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div style={{ width: "180px" }}>
                    <Dropdown
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e)}
                      options={options}
                      placeholder="Category"
                      className="select custom-select-list w-100"
                      style={{ height: "36px", display: "flex", alignItems: "center" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sort By */}
          <div className="row justify-content-center">
            {selectedCategory || selectedSort || location ? (
              finalFilterCoach.length > 0 ? ( // Ensure there are filtered coaches
                finalFilterCoach.map((coach, index) => (
                  <div className="col-lg-4 col-md-6" key={index}>
                    <div className="listing-item listing-item-grid ki-card-hover">
                      <div
                        className="listing-img"
                        style={{ height: "140px", overflow: "hidden", position: "relative" }}
                      >
                        <Link
                          to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                        >
                          <ImageWithBasePath
                            src={
                              coach.profile_picture[0]?.src
                                ? `${IMG_URL}${coach.profile_picture[0]?.src}`
                                : "assets/img/no-img.png"
                            }
                            alt="user"
                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          />
                        </Link>
                        <> </>
                        <div
                          className="fav-item-venues"
                          onClick={() => handleItemClick(index)}
                        >
                          <span className="tag tag-blue">
                            {coach.trainer_type}
                          </span>
                          {/* <div className="list-reviews coche-star">
                          <Link
                            to="#"
                            className={`fav-icon ${selectedItems[index] ? "selected" : ""
                              }`}
                          >
                            <i className="feather-heart" />
                          </Link>
                        </div> */}
                        </div>
                        {/* <div className="hour-list">
                        <h5 className="tag tag-primary">
                          From ₹{coach.price} <span>/month</span>
                        </h5>
                      </div> */}
                      </div>
                      <div className="listing-content">
                        <h3 className="listing-title">
                          <Link
                            to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                          >
                             {coach.full_name ? coach.full_name : coach.first_name}
                          </Link>
                        </h3>
                        <ul className="mb-2">
                          {/* <li>
                            <span>
                              <i className="feather-map-pin me-2" />
                              {coach.location?.address},{coach.location?.city},{" "}
                              {coach.location?.state}.{coach.location?.zipcode}
                              {coach.near_by_location}
                            </span>
                          </li> */}
                        </ul>
                        <div className="listing-details-group">
                          {/* <p>{coach.bio}</p> */}
                          <p>
                            Specializations:{" "}
                            {Array.isArray(coach?.specializations)
                              ? coach?.specializations.join(", ")
                              : coach?.specializations ||
                              "No specializations provided"}
                          </p>
                        </div>
                        <div className="coach-btn">
                          <ul>
                            <li>
                              <Link
                                to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                                className="ki-btn-primary w-100 text-dark"
                              >
                                <i className="feather-eye me-2" />
                                View Profile
                              </Link>
                            </li>
                            <li>
                              <div onClick={() => checkToken(coach._id)}>
                                <Link
                                  to={``}
                                  className="ki-btn-secondary w-100"
                                >
                                  <i className="feather-calendar me-2" />
                                  Book Now
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No coaches found for the selected category.</p>
              )
            ) : (
              coaches.map((coach, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="listing-item listing-item-grid ki-card-hover">
                    <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                      {/* <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src={`assets/img/featured/${coach.profile}`}
                        alt="Venue"
                      />
                    </Link> */}

                      <Link
                        to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                      >
                        <ImageWithBasePath
                          // src="assets/img/featured/featured-05.jpg"
                          src={
                            coach.profile_picture[0]?.src
                              ? `${IMG_URL}${coach.profile_picture[0]?.src}`
                              : "/assets/img/no-img.png"
                          }
                          alt="user"
                          style={{ height: "100%", width: "100%", objectFit: "cover" }}
                        />
                      </Link>
                      <div
                        className="fav-item-venues"
                        onClick={() => handleItemClick(index)}
                      >
                        <span className="tag tag-blue">
                          {coach?.trainer_type}
                        </span>
                        {/* <div className="list-reviews coche-star">
                          <Link
                            to="#"
                            className={`fav-icon ${selectedItems[index] ? "selected" : ""
                              }`}
                          >
                            <i className="feather-heart" />
                          </Link>
                        </div> */}
                      </div>
                      {/* <div className="hour-list">
                        <h5 className="tag tag-primary">
                          From ₹{coach.price} <span>/month</span>
                        </h5>
                      </div> */}
                    </div>
                    <div className="listing-content">
                      <h3 className="listing-title">
                        <Link
                          to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                        >
                          {coach?.full_name}
                        </Link>
                      </h3>
                      {/* <ul className="mb-2">
                          <li>
                            <span>
                              <i className="feather-map-pin me-2" />
                              {coach?.near_by_location}
                            </span>
                          </li>
                        </ul> */}
                      <div className="listing-details-group">
                        {/* <p>{coach.bio}</p> */}
                        <p>
                          Specializations:{" "}
                          {Array.isArray(coach?.specializations)
                            ? coach?.specializations.join(", ")
                            : coach?.specializations ||
                            "No specializations provided"}
                        </p>
                      </div>
                      <div className="coach-btn">
                        <ul>
                          <li>
                            <Link
                              // to={
                              //   routes.coachDetail
                              // }
                              to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                              className="ki-btn-primary w-100"
                            >
                              <i className="feather-eye me-2" />
                              View Profile
                            </Link>
                          </li>
                          <li>
                            <div onClick={() => checkToken(coach?._id)}>
                              <Link
                                to={``}
                                className="ki-btn-secondary w-100"
                              >
                                <i className="feather-calendar me-2" />
                                Book Now
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="avalbity-review">
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
                      </div> */}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* <div className="col-12 text-center mt-3">
            <Link to="#" className="btn btn-load">
              Load More Coaches{" "}
              <ImageWithBasePath
                src="assets/img/icons/u_plus-square.svg"
                className="ms-2"
                alt="Icon"
              />
            </Link>
          </div> */}
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CoachesGrid;
