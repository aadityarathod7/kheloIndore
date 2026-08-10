import React, { useState, useEffect, ReactNode } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

interface Coach {
  full_name: ReactNode;
  trainer_type: any;
  first_name: string;
  last_name: string;
  location: any;
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
  category: string;
  near_by_location: string;
  age: number;
  gender: string;
  rating: number;
  reviews_count: number;
  response_time: string;
  coaching_levels: string[];
  students_trained: number;
  profile_views: number;
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

const sortOptions = [
  { name: "Popularity" },
  { name: "Experience" },
  { name: "Response Time" },
  { name: "Price: Low to High" },
  { name: "Price: High to Low" },
];

const genderOptions = ["Male", "Female", "Other"];
const coachingLevelOptions = ["Beginner", "Intermediate", "Advanced"];

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
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
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
  const [selectedSort, setSelectedSort] = useState<{ name: string }>();
  const [name, setName] = useState<any[]>([]);
  const [locationName, setLocationName] = useState<any[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [finalFilterCoach, setFinalFilterCoach] = useState<Coach[]>([]);

  // ---- Advanced filter states ----
  const [filterSpecialization, setFilterSpecialization] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("");
  const [filterRating, setFilterRating] = useState<number>(0);
  const [filterMinReviews, setFilterMinReviews] = useState<number>(0);
  const [filterMinPrice, setFilterMinPrice] = useState<string>("");
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>("");
  const [filterMinAge, setFilterMinAge] = useState<string>("");
  const [filterMaxAge, setFilterMaxAge] = useState<string>("");
  const [filterLevels, setFilterLevels] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coachesPerPage = 6; // 3 per row x 2 rows
  const indexOfLastCoach = currentPage * coachesPerPage;
  const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
  const currentCoaches = finalFilterCoach.slice(indexOfFirstCoach, indexOfLastCoach);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const totalPages = Math.ceil(finalFilterCoach.length / coachesPerPage);

  const getPaginationPages = () => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (start === 1) {
        end = maxPageButtons;
      } else if (end === totalPages) {
        start = totalPages - maxPageButtons + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const paginationPages = getPaginationPages();

  useEffect(() => {
    setCurrentPage(1);
  }, [location, selectedCategory, searchQuery, filterGender, filterRating, filterMinReviews, filterMinPrice, filterMaxPrice, filterMinAge, filterMaxAge, filterLevels, filterSpecialization]);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (coaches.length > 0) {
      const initialFavs: Record<string, boolean> = {};
      coaches.forEach((c) => {
        initialFavs[c._id] = localStorage.getItem(`fav_coach_${c._id}`) === "true";
      });
      setFavorites(initialFavs);
    }
  }, [coaches]);

  const toggleFavorite = (coachId: string | number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login First",
        text: "You need to log in to add coaches to your favourites.",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    const nextStatus = !favorites[coachId];
    localStorage.setItem(`fav_coach_${coachId}`, String(nextStatus));
    setFavorites((prev) => ({
      ...prev,
      [coachId]: nextStatus,
    }));

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: `<span style="color: #1E293B; font-size: 18px; font-weight: 500; font-family: sans-serif;">${nextStatus ? "Saved to Favourites!" : "Removed from Favourites"}</span>`,
      html: `<span style="color: #64748B; font-size: 14px; font-family: sans-serif;">${nextStatus ? "Coach added to your favorites list." : "Coach removed from your favorites list."}</span>`,
      timer: 1500,
      showConfirmButton: false,
      background: "#FFFFFF",
    });
  };

  const navigate = useNavigate();
  const locations = useLocation();

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Coaches - Khelo Indore";
  }, []);

  const locationByHome = useLocation();
  const { selectedLocationSort, selectedSport } = locationByHome.state || {};

  useEffect(() => {
    setLocation(selectedLocationSort?.name || "");
    setSelectedCategory(selectedSport?.name || null);
  }, [locationByHome, selectedLocationSort, selectedSport]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((coach: any) => ({
          first_name: coach.first_name,
          last_name: coach.last_name,
          _id: coach._id,
          full_name: coach.full_name,
          trainer_type: coach.trainer_type,
          specializations: coach.specializations,
          profile_picture: coach.profile_picture,
          category: coach.category,
          near_by_location: coach.near_by_location,
          age: coach.age,
          gender: coach.gender,
          price: coach.price,
          experience: coach.experience,
          rating: coach.rating,
          reviews_count: coach.reviews_count,
          response_time: coach.response_time,
          coaching_levels: coach.coaching_levels,
          students_trained: coach.students_trained,
          profile_views: coach.profile_views,
        }));
        setCoaches(mappedData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({ name: t.category }));
    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setName(updatedNames);
  }, [coaches]);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({ name: t.near_by_location }));
    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setLocationName(updatedNames);
  }, [coaches]);

  const handleCategoryChange = (e: { value: string }) => {
    setSelectedCategory(e.value);
  };

  // ---- Sorting ----
  const applySort = (list: Coach[]) => {
    const sorted = [...list];
    switch (selectedSort?.name) {
      case "Popularity":
        sorted.sort((a, b) => (b.profile_views || 0) - (a.profile_views || 0));
        break;
      case "Experience":
        sorted.sort((a, b) => (Number(b.experience) || 0) - (Number(a.experience) || 0));
        break;
      case "Response Time":
        // Response times like "Within 1 hour", "Within 24 hours", "Within 2 days"
        sorted.sort((a, b) => {
          const aHours = parseResponseTime(a.response_time);
          const bHours = parseResponseTime(b.response_time);
          if (aHours === -1 && bHours === -1) return 0;
          if (aHours === -1) return 1;
          if (bHours === -1) return -1;
          return aHours - bHours;
        });
        break;
      case "Price: Low to High":
        sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      default:
        break;
    }
    return sorted;
  };

  const parseResponseTime = (value?: string): number => {
    if (!value) return -1;
    const lower = value.toLowerCase();
    const match = lower.match(/(\d+)\s*(hour|hr|day)/);
    if (!match) return -1;
    const num = Number(match[1]);
    return match[2].startsWith("day") ? num * 24 : num;
  };

  // ---- Advanced filtering ----
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
      filteredData = filteredData.filter(
        (coach) =>
          coach.category?.toLowerCase()?.includes(selectedCategory.toLowerCase()) ||
          coach.trainer_type?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }

    // Specialization filter
    if (filterSpecialization) {
      const q = filterSpecialization.toLowerCase();
      filteredData = filteredData.filter((coach) => {
        const specs = Array.isArray(coach.specializations)
          ? coach.specializations.join(", ")
          : String(coach.specializations || "");
        return specs.toLowerCase().includes(q);
      });
    }

    // Gender filter
    if (filterGender) {
      filteredData = filteredData.filter(
        (coach) => (coach.gender || "").toLowerCase() === filterGender.toLowerCase()
      );
    }

    // Rating filter (minimum rating)
    if (filterRating > 0) {
      filteredData = filteredData.filter((coach) => (coach.rating || 0) >= filterRating);
    }

    // Reviews filter (minimum reviews)
    if (filterMinReviews > 0) {
      filteredData = filteredData.filter((coach) => (coach.reviews_count || 0) >= filterMinReviews);
    }

    // Price range filter
    if (filterMinPrice) {
      filteredData = filteredData.filter((coach) => (Number(coach.price) || 0) >= Number(filterMinPrice));
    }
    if (filterMaxPrice) {
      filteredData = filteredData.filter((coach) => (Number(coach.price) || 0) <= Number(filterMaxPrice));
    }

    // Age range filter
    if (filterMinAge) {
      filteredData = filteredData.filter((coach) => (Number(coach.age) || 0) >= Number(filterMinAge));
    }
    if (filterMaxAge) {
      filteredData = filteredData.filter((coach) => (Number(coach.age) || 0) <= Number(filterMaxAge));
    }

    // Coaching level filter
    if (filterLevels.length > 0) {
      filteredData = filteredData.filter((coach) => {
        const levels = Array.isArray(coach.coaching_levels)
          ? coach.coaching_levels
          : coach.coaching_levels
          ? String(coach.coaching_levels).split(",").map((s) => s.trim())
          : [];
        return filterLevels.some((lvl) =>
          levels.some((l) => l.toLowerCase() === lvl.toLowerCase())
        );
      });
    }

    setFinalFilterCoach(applySort(filteredData));
  }, [location, selectedCategory, searchQuery, urlSearchQuery, coaches, filterSpecialization, filterGender, filterRating, filterMinReviews, filterMinPrice, filterMaxPrice, filterMinAge, filterMaxAge, filterLevels, selectedSort]);

  const handleLevelToggle = (level: string) => {
    setFilterLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setFilterSpecialization("");
    setFilterGender("");
    setFilterRating(0);
    setFilterMinReviews(0);
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterMinAge("");
    setFilterMaxAge("");
    setFilterLevels([]);
    setSearchQuery("");
    setSelectedCategory(null);
    setLocation(null);
  };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));

  const checkToken = (Id: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/coaches/coach-timedate/${Id}`);
    } else {
      navigate("/login", { state: { URL: locations.pathname } });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Sports <span style={{ color: "#22C55E", marginLeft: "12px" }}>Coaches</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Find and book the best sports coaches in Indore</p>
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Coaches</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "16px 0 40px 0" }}>
        <div className="container">
          {/* Sort By */}
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section d-flex align-items-center justify-content-between flex-wrap gap-3 py-2 px-3">
                <div className="count-search mb-0">
                  <p className="mb-0" style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    <span>{finalFilterCoach.length}</span> Coaches are listed
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

                  {/* Sort By Dropdown */}
                  <div className="sortbyset" style={{ width: "200px" }}>
                    <Dropdown
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.value)}
                      options={sortOptions}
                      optionLabel="name"
                      placeholder="Sort By"
                      className="select custom-select-list w-100"
                      style={{ height: "36px", display: "flex", alignItems: "center" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listing Content Group */}
          <div className="listing-list-sidebar">
            <div className="row">
              {/* Advanced Filter Sidebar */}
              <div className="col-lg-3 theiaStickySidebar">
                <div className="stickybar">
                  <div className="listing-filter-group listing-item" style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div className="sidebar-heading d-flex align-items-center justify-content-between mb-3">
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                        Advanced <span style={{ color: "#22C55E" }}>Filter</span>
                      </h3>
                      <button onClick={clearAllFilters} className="btn btn-link p-0" style={{ fontSize: "12px", color: "#EF4444", textDecoration: "none", fontWeight: "600" }}>
                        Clear All
                      </button>
                    </div>

                    {/* Specialization */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Specialization</label>
                      <input
                        type="text"
                        className="form-control form-control-sm mt-1"
                        placeholder="e.g. Batting Coach"
                        value={filterSpecialization}
                        onChange={(e) => setFilterSpecialization(e.target.value)}
                        style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      />
                    </div>

                    {/* Gender */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Gender</label>
                      <select
                        className="form-select form-select-sm mt-1"
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      >
                        <option value="">All</option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Rating (min)</label>
                      <select
                        className="form-select form-select-sm mt-1"
                        value={filterRating}
                        onChange={(e) => setFilterRating(Number(e.target.value))}
                        style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      >
                        <option value={0}>Any</option>
                        <option value={4.5}>4.5 & above</option>
                        <option value={4}>4.0 & above</option>
                        <option value={3.5}>3.5 & above</option>
                        <option value={3}>3.0 & above</option>
                      </select>
                    </div>

                    {/* Reviews */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Reviews (min)</label>
                      <select
                        className="form-select form-select-sm mt-1"
                        value={filterMinReviews}
                        onChange={(e) => setFilterMinReviews(Number(e.target.value))}
                        style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      >
                        <option value={0}>Any</option>
                        <option value={10}>10+</option>
                        <option value={50}>50+</option>
                        <option value={100}>100+</option>
                        <option value={500}>500+</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Price (₹/hr)</label>
                      <div className="d-flex gap-2 mt-1">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Min"
                          value={filterMinPrice}
                          onChange={(e) => setFilterMinPrice(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Max"
                          value={filterMaxPrice}
                          onChange={(e) => setFilterMaxPrice(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div className="mb-3">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Age</label>
                      <div className="d-flex gap-2 mt-1">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Min"
                          value={filterMinAge}
                          onChange={(e) => setFilterMinAge(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Max"
                          value={filterMaxAge}
                          onChange={(e) => setFilterMaxAge(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                        />
                      </div>
                    </div>

                    {/* Coaching Level */}
                    <div className="mb-2">
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>Coaching Level</label>
                      {coachingLevelOptions.map((level) => (
                        <div key={level} className="form-check mt-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`level-${level}`}
                            checked={filterLevels.includes(level)}
                            onChange={() => handleLevelToggle(level)}
                          />
                          <label className="form-check-label" htmlFor={`level-${level}`} style={{ fontSize: "13px", color: "#475569" }}>
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coach Cards */}
              <div className="col-lg-9">
                <div className="row justify-content-center">
                  {currentCoaches.length > 0 ? (
                    currentCoaches.map((coach, index) => (
                      <div className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex" key={index}>
                        <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                          <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                            <Link
                              to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                              style={{ display: "block", height: "100%" }}
                            >
                              <ImageWithBasePath
                                src={coach.profile_picture[0]?.src ? `${IMG_URL}${coach.profile_picture[0]?.src}` : "/assets/img/no-img.png"}
                                alt="user"
                                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                              />
                            </Link>

                            {/* Favorite Heart Button */}
                            <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2 }}>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(coach._id);
                                }}
                                className="btn btn-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: "28px", height: "28px", padding: 0, backgroundColor: "#FFFFFF", border: "none" }}
                              >
                                <i className={favorites[coach._id] ? "fas fa-heart text-danger" : "feather-heart text-muted"} style={{ fontSize: "13px" }} />
                              </button>
                            </div>

                            {/* Category Badge */}
                            <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                              <span className="tag tag-blue" style={{ background: "#2D3E33", color: "#FFFFFF", fontWeight: "700", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                                {coach?.trainer_type}
                              </span>
                            </div>
                          </div>

                          <div className="listing-content news-content p-3 w-100 d-flex flex-column justify-content-between flex-grow-1" style={{ background: "#FFFFFF" }}>
                            <div>
                              {/* Rating */}
                              <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                                <div className="rating-wrap d-flex align-items-center gap-1">
                                  <i className="fas fa-star text-warning" style={{ fontSize: "11px" }} />
                                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#17222D" }}>
                                    {coach.rating || "4.0"}
                                  </span>
                                  <span style={{ fontSize: "10px", color: "#64748B" }}>
                                    ({coach.reviews_count || 0} reviews)
                                  </span>
                                </div>
                                <span style={{ fontSize: "10px", color: "#64748B" }}>
                                  <i className="feather-eye me-1" />
                                  {coach.profile_views || 0} views
                                </span>
                              </div>

                              <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                                <Link
                                  to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                                  className="text-truncate d-block" style={{ color: "#17222D" }}
                                >
                                  {coach.full_name ? coach.full_name : coach.first_name}
                                </Link>
                              </h3>
                              <p className="mb-1 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                                <i className="feather-map-pin me-1" style={{ color: "#606D76" }} />
                                {coach.near_by_location || "Indore"}, Indore
                              </p>
                              <p className="mb-1 text-truncate" style={{ fontSize: "11px", color: "#64748B" }}>
                                Specialization: {Array.isArray(coach?.specializations) ? coach?.specializations.join(", ") : coach?.specializations || "Coaching"}
                              </p>
                              <p className="mb-1" style={{ fontSize: "11px", color: "#64748B" }}>
                                {coach.age ? <>Age: {coach.age}</> : null}
                                {coach.response_time ? <> <span style={{ color: "#CBD5E1" }}>|</span> <i className="feather-clock me-1" />{coach.response_time}</> : null}
                              </p>
                              <p className="mb-0" style={{ fontSize: "11px", color: "#64748B" }}>
                                <i className="feather-users me-1" /> {coach.students_trained || 0} students trained
                              </p>
                            </div>

                            <div className="d-flex align-items-center justify-content-between pt-2 mt-auto" style={{ borderTop: "1px solid #E2E8E3" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                                ₹{coach.price || "500"} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                              </span>
                              <div className="d-flex gap-1.5">
                                <Link
                                  to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                                  className="btn btn-outline-success btn-sm rounded-pill px-2.5 py-1"
                                  style={{ fontSize: "11px", fontWeight: "600", borderColor: "#3CAB4B", color: "#3CAB4B" }}
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => checkToken(coach?._id)}
                                  className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm"
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    background: "linear-gradient(135deg, #43B649 0%, #349E3A 100%)",
                                    border: "none",
                                    color: "#FFFFFF",
                                    boxShadow: "0 4px 12px rgba(67, 182, 73, 0.28)",
                                  }}
                                >
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-lg-12 text-center py-5 bg-white rounded shadow-sm border mt-3">
                      <h5 className="text-muted" style={{ fontWeight: "500" }}>No coaches found matching your filters</h5>
                    </div>
                  )}
                </div>

                {/* Centered Pagination wrapper */}
                <div className="d-flex justify-content-center w-100 mt-4">
                  <ul className="pagination">
                    {finalFilterCoach.length > coachesPerPage && (
                      <>
                        <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            <i className="feather-chevron-left" />
                          </button>
                        </li>
                        {paginationPages.map((page, index) => (
                          <li key={index} className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}>
                            {page === "..." ? (
                              <span className="page-link" style={{ border: "none", background: "transparent", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center" }}>...</span>
                            ) : (
                              <button className="page-link" onClick={() => handlePageChange(page)}>
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
      </div>
    </div>
  );
};

export default CoachesGrid;
