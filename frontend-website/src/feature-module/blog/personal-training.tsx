import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
// import data from '../../../public/assets/img/featured'

interface Trainer {
  first_name: string;
  last_name: string;
  near_by_location: string;
  category: string;
  price: number;
  _id: number;
  profile_picture: any;
  src: string;
  specializations: string;
  trainer_type: string;
}
interface FilterData {
  last_name: string;
  first_name: string;

  duration: string;
  focus_area: string;
  price: number;
  _id: number;
  profile_picture: string[];
  src: string;
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

const BlogList = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortCriteria | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);
  const [filterTrainer, setFilterTrainer] = useState<Trainer[]>([]);
  const [filterPriceOnly, setFilterPriceOnly] = useState<Trainer[]>([]);
  const [filterCategoryOnly, setFilterCategoryOnly] = useState<Trainer[]>([]);
  const [trainerPrice, setTrainerPrice] = useState<Trainer[]>([]);
  const [finalFilterTrainer, setFinalFilterTrainer] = useState<Trainer[]>([]);
  const [name, setName] = useState<Trainer[]>([]);
  const [data, setData] = useState([]);
  const [selectedlocation, setSelectedLocation] = useState<any>("");
  const [trainerByLocation, setTrainerByLocation] = useState<Trainer[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "personal-training"
  }, []);

  const navigate = useNavigate()

  const location = useLocation();
  const { selectedLocationSort, selectedSport } = location.state || {};

  useEffect(() => {
    setSelectedLocation(selectedLocationSort?.name || "");
    setSelectedCategory(selectedSport?.name || null);
  }, [location, selectedLocationSort, selectedSport]);

  useEffect(() => {
    // Fetch coach data from API
    const fetchTrainer = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/web/PersonalTraining/fetchAll`
        );
        const trainerData = response.data.data;

        const mappedData = trainerData.map((trainer: any) => ({
          first_name: trainer.first_name,
          last_name: trainer.last_name,
          near_by_location: trainer.near_by_location,
          category: trainer.category,
          price: trainer.price,
          _id: trainer._id,
          specializations: trainer.specializations,
          profile_picture: trainer.profile_picture,
          trainer_type: trainer.trainer_type,
        }));
        setTrainer(mappedData);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };

    fetchTrainer();
  }, []);

  useEffect(() => {
    const areaMap = trainer.map((t: any) => ({
      name: t.category,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames.filter(
      (item, index) => allNames.indexOf(item) === index
    );
    setName(updatedNames);
  }, [trainer]);

  const handleCategoryChange = (e: { value: string }) => {
    console.log("Selected Category:", e.value);  // Debugging line
    setSelectedCategory(e.value);  // Update selected category
  };

  useEffect(() => {
    let filteredData = trainer;

    const activeSearch = searchQuery || urlSearchQuery;
    if (activeSearch) {
      const q = activeSearch.toLowerCase().trim();
      filteredData = filteredData.filter((t) => {
        const firstName = String(t.first_name || "").toLowerCase();
        const lastName = String(t.last_name || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        const category = String(t.category || "").toLowerCase();
        const trainerType = String(t.trainer_type || "").toLowerCase();
        const nearbyLoc = String(t.near_by_location || "").toLowerCase();
        
        let specMatch = false;
        if (Array.isArray(t.specializations)) {
          specMatch = t.specializations.some((s: string) => fuzzyMatch(s, q));
        } else if (t.specializations) {
          specMatch = fuzzyMatch(String(t.specializations), q);
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

    if (selectedlocation) {
      filteredData = filteredData.filter((t) =>
        t.near_by_location?.toLowerCase()?.includes(selectedlocation.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((t) =>
        t.category?.toLowerCase()?.includes(selectedCategory.toLowerCase()) ||
        t.trainer_type?.toLowerCase()?.includes(selectedCategory.toLowerCase()) ||
        t.specializations?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }

    setFinalFilterTrainer(filteredData);
  }, [selectedlocation, selectedCategory, searchQuery, urlSearchQuery, trainer]);

  // useEffect(() => {
  //   if (location) {
  //     const filteredData = trainer.filter((t: any) =>
  //       t.near_by_location?.includes(selectedlocation)
  //     );
  //     setTrainerByLocation(filteredData);
  //     setFinalFilterTrainer(filteredData);
  //   }
  // }, [selectedlocation, trainer]);

  // useEffect(() => {
  //   if (selectedSort) {
  //     if (selectedCategory) {
  //       if (selectedSort.name === "low price") {
  //         const filterData = filterCategoryOnly.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setTrainerPrice(filterData);
  //         setFinalFilterTrainer(filterData);
  //       } else {
  //         const filterData = filterCategoryOnly.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setTrainerPrice(filterData);
  //         setFinalFilterTrainer(filterData);
  //       }
  //     } else {
  //       if (selectedSort.name === "low price") {
  //         const filterData = trainer.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setFilterTrainer(filterData);
  //         setFinalFilterTrainer(filterData);
  //       } else {
  //         const filterData = trainer.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setFilterTrainer(filterData);
  //         setFinalFilterTrainer(filterData);
  //       }
  //     }
  //   }

  //   if (selectedSort?.name === "low price") {
  //     const filterData = trainer.filter((trainer: any) => trainer.price <= 50);
  //     setFilterPriceOnly(filterData);
  //   } else {
  //     const filterData = trainer.filter((trainer: any) => trainer.price > 50);
  //     setFilterPriceOnly(filterData);
  //   }
  // }, [selectedSort]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     if (selectedSort) {
  //       const filteredData = filterPriceOnly.filter((t: any) =>
  //         t.category.includes(selectedCategory)
  //       );
  //       setFilterTrainer(filteredData);
  //       setFinalFilterTrainer(filteredData);
  //     } else {
  //       const filteredData = trainer.filter((t: any) =>
  //         t.category.includes(selectedCategory)
  //       );
  //       setFilterTrainer(filteredData);
  //       setFinalFilterTrainer(filteredData);
  //     }
  //   }

  //   if (selectedCategory) {
  //     const filteredData = trainer.filter((t: any) =>
  //       t.category.includes(selectedCategory)
  //     );
  //     setFilterCategoryOnly(filteredData);
  //     setFinalFilterTrainer(filteredData);
  //   }
  // }, [selectedCategory]);
  // const handleCategoryChange = (selectedOption: { value: string }) => {
  //   setSelectedCategory(selectedOption ? selectedOption.value : null);
  // };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const sortOptions = [{ name: "low price" }, { name: "high price" }];
  const sortLocation = [{ location: "location" }, { location: "location" }];

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/personal-training/training-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: location.pathname } }
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
                Personal <span style={{ color: "#22C55E", marginLeft: "12px" }}>Trainers</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Find and book personal fitness trainers in Indore</p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Personal Trainer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      {/* Page Content */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "16px 0 40px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section d-flex align-items-center justify-content-between flex-wrap gap-3 py-2 px-3">
                <div className="count-search mb-0">
                  <p className="mb-0" style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    <span>
                      {selectedCategory || searchQuery || urlSearchQuery || selectedSort || selectedlocation
                        ? finalFilterTrainer.length
                        : trainer.length}
                    </span>{" "}
                    Trainers are listed
                  </p>
                </div>
                
                <div className="d-flex align-items-center flex-wrap gap-3">
                  {/* Local Live Search Input */}
                  <div className="position-relative" style={{ width: "260px" }}>
                    <i className="fas fa-search listings-search-icon" />
                    <input
                      type="text"
                      className="form-control listings-search-input"
                      placeholder="Search trainer by name..."
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

          <div className="row justify-content-center">
            {selectedCategory || selectedSort || selectedlocation
              ? (
                finalFilterTrainer.length > 0 ? (finalFilterTrainer.map((trainer, index) => (
                  <div className="col-lg-4 col-md-6" key={index}>
                    <div className="listing-item listing-item-grid ki-card-hover">
                      <div
                        className="listing-img"
                        style={{ height: "140px", overflow: "hidden", position: "relative" }}
                      >
                        <Link
                          to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                        >
                          <ImageWithBasePath
                            src={
                              trainer.profile_picture[0]?.src
                                ? `${IMG_URL}${trainer.profile_picture[0].src}`
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
                            {trainer?.trainer_type}
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
                          ₹{trainer.price}/month <span></span>
                        </h5>
                      </div> */}
                      </div>
                      <div className="listing-content">
                        <h3 className="listing-title">
                          <Link
                            to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                          >
                            {trainer.first_name}
                            {trainer.last_name}
                          </Link>
                        </h3>
                        {/* <ul className="mb-2">
                        <li>
                          <span><i className="feather-map-pin me-2" /> {trainer.near_by_location}</span>
                        </li>
                      </ul> */}
                        <div className="listing-details-group">
                          <p> Specializations: {trainer.specializations}</p>
                        </div>
                        <div className="coach-btn">
                          <ul>
                            <li>
                              <Link
                                to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                                className="btn btn-primary w-100"
                              >
                                <i className="feather-eye me-2" />
                                View Profile
                              </Link>
                            </li>
                            <li>
                            <div onClick={() => checkToken(trainer._id)}>
                            <Link
                              to={``}
                              className="btn btn-secondary w-100"
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
                  <p>No trainer found for the selected category.</p>
                )
              ) : (trainer.map((trainer, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="listing-item listing-item-grid ki-card-hover">
                    <div
                      className="listing-img"
                      style={{ height: "140px", overflow: "hidden", position: "relative" }}
                    >
                      <Link
                        to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                      >
                        <ImageWithBasePath
                          src={
                            trainer?.profile_picture[0]?.src
                              ? `${IMG_URL}${trainer.profile_picture[0].src}`
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
                          {trainer?.trainer_type}
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
                            ₹{trainer.price}/month <span></span>
                          </h5>
                        </div> */}
                    </div>
                    <div className="listing-content">
                      <h3 className="listing-title">
                        <Link
                          to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                        >
                          {trainer.first_name}&nbsp;&nbsp;
                          {trainer.last_name}
                        </Link>
                      </h3>
                      {/* <ul className="mb-2">
                          <li>
                            <span><i className="feather-map-pin me-2" /> {trainer.near_by_location}</span>
                          </li>
                        </ul> */}
                      <div className="listing-details-group">
                        <p> Specializations: {trainer.specializations}</p>
                      </div>
                      <div className="coach-btn">
                        <ul>
                          <li>
                            <Link
                              to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                              className="btn btn-primary w-100"
                            >
                              <i className="feather-eye me-2" />
                              View Profile
                            </Link>
                          </li>
                          <li>
                            <div onClick={() => checkToken(trainer._id)}>
                              <Link
                                to={``}
                                className="btn btn-secondary w-100"
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
              )))}
          </div>
          {/* <div className="col-12 text-center mt-3">
            <Link to="#" className="btn btn-load">
              Load More Personal Trainers{" "}
              <ImageWithBasePath
                src="assets/img/icons/u_plus-square.svg"
                className="ms-2"
                alt="Icon"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
