import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

const matchCategory = (cat, trainerType, specializations, q) => {
  const c = (cat || "").toLowerCase().trim();
  const t = (trainerType || "").toLowerCase().trim();
  const target = q.toLowerCase().trim();

  const specs = Array.isArray(specializations)
    ? specializations.join(" ").toLowerCase()
    : String(specializations || "").toLowerCase();

  if (target === "tennis") {
    return (c === "tennis" || c === "tennis court" || t.includes("tennis") || specs.includes("tennis")) && !c.includes("table") && !t.includes("table") && !specs.includes("table");
  }

  return c === target || c.includes(target) || t === target || t.includes(target) || specs.includes(target);
};
import { getCategoryIcon, getCategoryStyle } from "../../utils/categoryVisual";

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
  age: number;
  gender: string;
  experience: string;
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
  { name: "Rating: High to Low" },
  { name: "Newest First" },
  { name: "Name: A to Z" },
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
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
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

const BlogList = () => {
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [selectedSort, setSelectedSort] = useState<{ name: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (trainer.length > 0) {
      const initialFavs: Record<string, boolean> = {};
      trainer.forEach((t) => {
        initialFavs[t._id] = localStorage.getItem(`fav_trainer_${t._id}`) === "true";
      });
      setFavorites(initialFavs);
    }
  }, [trainer]);

  const toggleFavorite = (trainerId: string | number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please Login First",
        text: "You need to log in to add trainers to your favourites.",
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

    const nextStatus = !favorites[trainerId];
    localStorage.setItem(`fav_trainer_${trainerId}`, String(nextStatus));
    setFavorites((prev) => ({ ...prev, [trainerId]: nextStatus }));

    Swal.fire({
      icon: nextStatus ? "success" : "info",
      title: `<span style="color: #1E293B; font-size: 18px; font-weight: 500; font-family: sans-serif;">${nextStatus ? "Saved to Favourites!" : "Removed from Favourites"}</span>`,
      html: `<span style="color: #64748B; font-size: 14px; font-family: sans-serif;">${nextStatus ? "Trainer added to your favorites list." : "Trainer removed from your favorites list."}</span>`,
      timer: 1500,
      showConfirmButton: false,
      background: "#FFFFFF",
    });
  };

  const [finalFilterTrainer, setFinalFilterTrainer] = useState<Trainer[]>([]);
  const [selectedlocation, setSelectedLocation] = useState<any>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 12; // 12 cards per page
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = finalFilterTrainer.slice(indexOfFirstTrainer, indexOfLastTrainer);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const totalPages = Math.ceil(finalFilterTrainer.length / trainersPerPage);

  const getPaginationPages = () => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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

      for (let i = start; i <= end; i++) pages.push(i);

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
  }, [selectedlocation, selectedCategory, searchQuery, filterGender, filterRating, filterMinReviews, filterMinPrice, filterMaxPrice, filterMinAge, filterMaxAge, filterLevels, filterSpecialization]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Trainers - Khelo Indore";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLocationSort, selectedSport } = location.state || {};
  const { type } = useParams<{ type: string }>();

  useEffect(() => {
    setSelectedLocation(selectedLocationSort?.name || "");
    if (type) {
      let formattedType = type.replace(/-/g, " ");
      formattedType = formattedType.replace(/\b\w/g, c => c.toUpperCase());
      setSelectedCategory(formattedType);
    } else {
      setSelectedCategory(selectedSport?.name || null);
    }
  }, [location, selectedLocationSort, selectedSport, type]);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/PersonalTraining/fetchAll`);
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
          age: trainer.age,
          gender: trainer.gender,
          experience: trainer.experience,
          rating: trainer.rating,
          reviews_count: trainer.reviews_count,
          response_time: trainer.response_time,
          coaching_levels: trainer.coaching_levels,
          students_trained: trainer.students_trained,
          profile_views: trainer.profile_views,
        }));
        setTrainer(mappedData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };

    fetchTrainer();
  }, []);

  const handleCategoryChange = (e: { value: string }) => {
    setSelectedCategory(e.value);
  };

  const parseResponseTime = (value?: string): number => {
    if (!value) return -1;
    const lower = value.toLowerCase();
    const match = lower.match(/(\d+)\s*(hour|hr|day)/);
    if (!match) return -1;
    const num = Number(match[1]);
    return match[2].startsWith("day") ? num * 24 : num;
  };

  const applySort = (list: Trainer[]) => {
    const sorted = [...list];
    switch (selectedSort?.name) {
      case "Popularity":
        sorted.sort((a, b) => (b.profile_views || 0) - (a.profile_views || 0));
        break;
      case "Experience":
        sorted.sort((a, b) => (Number(b.experience) || 0) - (Number(a.experience) || 0));
        break;
      case "Response Time":
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
      case "Rating: High to Low":
        sorted.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "Newest First":
        sorted.sort((a, b) => +new Date(b.createdAt || b.created_at || 0) - +new Date(a.createdAt || a.created_at || 0));
        break;
      case "Name: A to Z":
        sorted.sort((a, b) => `${a.full_name || a.first_name || ""} ${a.last_name || ""}`.localeCompare(`${b.full_name || b.first_name || ""} ${b.last_name || ""}`));
        break;
      default:
        break;
    }
    return sorted;
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
      const q = selectedCategory.toLowerCase().trim();
      if (q === "other sports" || q === "other-sports") {
        filteredData = filteredData.filter((t) => {
          const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
          const trainerType = (t.trainer_type || "").toLowerCase().replace(/_/g, " ").trim();
          const spec = Array.isArray(t.specializations)
            ? t.specializations.join(" ").toLowerCase()
            : String(t.specializations || "").toLowerCase();

          const isStandard =
            cat.includes("cricket") || trainerType.includes("cricket") || spec.includes("cricket") || cat.includes("turf") || trainerType.includes("turf") ||
            cat.includes("badminton") || trainerType.includes("badminton") || spec.includes("badminton") ||
            cat.includes("swim") || trainerType.includes("swim") || spec.includes("swim") ||
            cat.includes("football") || trainerType.includes("football") || spec.includes("football") ||
            cat.includes("pickle") || trainerType.includes("pickle") || spec.includes("pickle") ||
            ((cat.includes("tennis") || trainerType.includes("tennis") || spec.includes("tennis")) && !cat.includes("table") && !trainerType.includes("table") && !spec.includes("table")) ||
            cat.includes("basketball") || trainerType.includes("basketball") || spec.includes("basketball") ||
            cat.includes("table tennis") || trainerType.includes("table tennis") || spec.includes("table tennis");
          return !isStandard;
        });
      } else {
        filteredData = filteredData.filter((t) => {
          return matchCategory(t.category, t.trainer_type, t.specializations, q);
        });
      }
    }

    // Specialization filter
    if (filterSpecialization) {
      const q = filterSpecialization.toLowerCase();
      filteredData = filteredData.filter((t) => {
        const specs = Array.isArray(t.specializations)
          ? t.specializations.join(", ")
          : String(t.specializations || "");
        return specs.toLowerCase().includes(q);
      });
    }

    // Gender filter
    if (filterGender) {
      filteredData = filteredData.filter(
        (t) => (t.gender || "").toLowerCase() === filterGender.toLowerCase()
      );
    }

    // Rating filter
    if (filterRating > 0) {
      filteredData = filteredData.filter((t) => (t.rating || 0) >= filterRating);
    }

    // Reviews filter
    if (filterMinReviews > 0) {
      filteredData = filteredData.filter((t) => (t.reviews_count || 0) >= filterMinReviews);
    }

    // Price range
    if (filterMinPrice) {
      filteredData = filteredData.filter((t) => (Number(t.price) || 0) >= Number(filterMinPrice));
    }
    if (filterMaxPrice) {
      filteredData = filteredData.filter((t) => (Number(t.price) || 0) <= Number(filterMaxPrice));
    }

    // Age range
    if (filterMinAge) {
      filteredData = filteredData.filter((t) => (Number(t.age) || 0) >= Number(filterMinAge));
    }
    if (filterMaxAge) {
      filteredData = filteredData.filter((t) => (Number(t.age) || 0) <= Number(filterMaxAge));
    }

    // Coaching level
    if (filterLevels.length > 0) {
      filteredData = filteredData.filter((t) => {
        const levels = Array.isArray(t.coaching_levels)
          ? t.coaching_levels
          : t.coaching_levels
          ? String(t.coaching_levels).split(",").map((s) => s.trim())
          : [];
        return filterLevels.some((lvl) =>
          levels.some((l) => l.toLowerCase() === lvl.toLowerCase())
        );
      });
    }

    setFinalFilterTrainer(applySort(filteredData));
    // eslint-disable-next-line
  }, [selectedlocation, selectedCategory, searchQuery, urlSearchQuery, trainer, filterSpecialization, filterGender, filterRating, filterMinReviews, filterMinPrice, filterMaxPrice, filterMinAge, filterMaxAge, filterLevels, selectedSort]);

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
    setSelectedLocation("");
  };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const checkToken = (Id: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/trainers/training-timedate/${Id}`);
    } else {
      navigate("/login", { state: { URL: location.pathname } });
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
                <span style={{ color: "#22C55E" }}>Trainers</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Find and book fitness trainers in Indore</p>
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Trainer</span>
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
                    <span>{finalFilterTrainer.length}</span> Trainers are listed
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
                        placeholder="e.g. Strength Coach"
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
                            id={`pt-level-${level}`}
                            checked={filterLevels.includes(level)}
                            onChange={() => handleLevelToggle(level)}
                          />
                          <label className="form-check-label" htmlFor={`pt-level-${level}`} style={{ fontSize: "13px", color: "#475569" }}>
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trainer Cards */}
              <div className="col-lg-9">
                <div className="row justify-content-center">
                  {currentTrainers.length > 0 ? (
                    currentTrainers.map((trainer, index) => (
                      <div className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex" key={index}>
                        <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                          <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                            <Link
                              to={`/trainers/trainer/${(trainer.first_name || "trainer").replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                              style={{ display: "block", height: "100%" }}
                            >
                              <ImageWithBasePath
                                src={trainer.profile_picture[0]?.src ? `${IMG_URL}${trainer.profile_picture[0].src}` : "/assets/img/no-img.png"}
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
                                  toggleFavorite(trainer._id);
                                }}
                                className="btn btn-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: "28px", height: "28px", padding: 0, backgroundColor: "#FFFFFF", border: "none" }}
                              >
                                <i className={favorites[trainer._id] ? "fas fa-heart text-danger" : "feather-heart text-muted"} style={{ fontSize: "13px" }} />
                              </button>
                            </div>

                            {/* Category Badge */}
                            <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                              <span className="tag tag-blue d-inline-flex align-items-center gap-1" style={{ ...getCategoryStyle(trainer?.trainer_type || trainer?.category), fontWeight: "700", fontSize: "10px", padding: "5px 8px", borderRadius: "999px", textTransform: "uppercase" }}>
                                <i className={getCategoryIcon(trainer?.trainer_type || trainer?.category)} /> {trainer?.trainer_type || trainer?.category || "Trainer"}
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
                                    {trainer.rating || "4.0"}
                                  </span>
                                  <span style={{ fontSize: "10px", color: "#64748B" }}>
                                    ({trainer.reviews_count || 0} reviews)
                                  </span>
                                </div>
                                <span style={{ fontSize: "10px", color: "#64748B" }}>
                                  <i className="feather-eye me-1" />
                                  {trainer.profile_views || 0} views
                                </span>
                              </div>

                              <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                                <Link
                                  to={`/trainers/trainer/${(trainer.first_name || "trainer").replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                                  className="text-truncate d-block" style={{ color: "#17222D" }}
                                >
                                  {trainer.first_name} {trainer.last_name}
                                </Link>
                              </h3>
                              <p className="mb-1 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                                <i className="feather-map-pin me-1" style={{ color: "#606D76" }} />
                                {trainer.near_by_location || "Indore"}, Indore
                              </p>
                              <p className="mb-1 text-truncate" style={{ fontSize: "11px", color: "#64748B" }}>
                                Specialization: {Array.isArray(trainer?.specializations) ? trainer?.specializations.join(", ") : trainer?.specializations || "Fitness Trainer"}
                              </p>
                              <p className="mb-1" style={{ fontSize: "11px", color: "#64748B" }}>
                                {trainer.age ? <>Age: {trainer.age}</> : null}
                                {trainer.response_time ? <> <span style={{ color: "#CBD5E1" }}>|</span> <i className="feather-clock me-1" />{trainer.response_time}</> : null}
                              </p>
                              <p className="mb-0" style={{ fontSize: "11px", color: "#64748B" }}>
                                <i className="feather-users me-1" /> {trainer.students_trained || 0} students trained
                              </p>
                            </div>

                            <div className="d-flex align-items-center justify-content-between pt-2 mt-auto" style={{ borderTop: "1px solid #E2E8E3" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                                ₹{trainer.price || "600"} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                              </span>
                              <div className="d-flex gap-1.5">
                                <Link
                                  to={`/trainers/trainer/${(trainer.first_name || "trainer").replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                                  className="btn btn-outline-success btn-sm rounded-pill px-2.5 py-1"
                                  style={{ fontSize: "11px", fontWeight: "600", borderColor: "#3CAB4B", color: "#3CAB4B" }}
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => checkToken(trainer._id)}
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
                      <h5 className="text-muted" style={{ fontWeight: "500" }}>No trainers found matching your filters</h5>
                    </div>
                  )}
                </div>

                {/* Centered Pagination wrapper */}
                <div className="d-flex justify-content-center w-100 mt-4">
                  <ul className="pagination">
                    {finalFilterTrainer.length > trainersPerPage && (
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

export default BlogList;
