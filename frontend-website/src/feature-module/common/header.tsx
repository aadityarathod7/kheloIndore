import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import "../../style/css/custom.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from "jwt-decode";

import { COffcanvasTitle } from "@coreui/react";
import { COffcanvasHeader } from "@coreui/react";
import { COffcanvasBody } from "@coreui/react";
import { COffcanvas } from "@coreui/react";
import { CButton, CCloseButton } from "@coreui/react";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";
import axios from "axios";

interface tokenvalue {
  userID: string;
  first_name: string;
  last_name: string;
  role: string;
  iat: number;
  exp: number;
}

const Header = () => {
  const routes = all_routes;
  const location = useLocation();
  const loginToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cachedData, setCachedData] = useState<{ venues: any[]; coaches: any[]; trainers: any[] } | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<any>(null);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearchQuery.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(globalSearchQuery.trim())}`);
  };

  // ─── Fetch & cache data for suggestions ───
  const fetchSuggestionsData = async () => {
    if (cachedData) return cachedData;
    setSuggestionsLoading(true);
    try {
      const [venuesRes, coachesRes, trainersRes] = await Promise.all([
        axios.get(`${API_URL}/web/venue/getVenue`).catch(() => ({ data: { venue: [] } })),
        axios.get(`${API_URL}/web/fetch-all-coaches`).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/web/PersonalTraining/fetchAll`).catch(() => ({ data: { data: [] } })),
      ]);
      const data = {
        venues: venuesRes.data?.venue || [],
        coaches: coachesRes.data?.data || [],
        trainers: trainersRes.data?.data || [],
      };
      setCachedData(data);
      return data;
    } catch {
      return { venues: [], coaches: [], trainers: [] };
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // ─── Filter suggestions from cached data ───
  const filterSuggestions = (data: { venues: any[]; coaches: any[]; trainers: any[] }, q: string) => {
    const results: any[] = [];
    const ql = q.toLowerCase();

    // Venues
    data.venues.forEach((v: any) => {
      const name = (v.name || "").toLowerCase();
      const vendorType = (v.vendor_type || "").toLowerCase();
      const category = (v.category || "").toLowerCase();
      if (name.includes(ql) || vendorType.includes(ql) || category.includes(ql)) {
        results.push({
          type: "venue",
          label: v.name,
          subtitle: v.near_by_location ? `${v.near_by_location}, Indore` : "Indore",
          icon: "feather-map-pin",
          link: `/sports-venue/${vendorType.replace(/\s+/g, "-") || "venue"}/${name.replace(/\s+/g, "-")}/${v._id}`,
          badge: v.vendor_type?.replace("_", " ") || "Venue",
        });
      }
    });

    // Coaches
    data.coaches.forEach((c: any) => {
      const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
      const trainerType = (c.trainer_type || "").toLowerCase();
      const category = (c.category || "").toLowerCase();
      if (fullName.includes(ql) || trainerType.includes(ql) || category.includes(ql)) {
        results.push({
          type: "coach",
          label: c.full_name || c.first_name,
          subtitle: c.trainer_type || "Coach",
          icon: "feather-users",
          link: `/coaches/${trainerType.replace(/\s+/g, "-")}/${(c.first_name || "").replace(/\s+/g, "-").toLowerCase()}/${c._id}`,
          badge: c.trainer_type || "Coach",
        });
      }
    });

    // Trainers
    data.trainers.forEach((t: any) => {
      const fullName = `${t.first_name || ""} ${t.last_name || ""}`.toLowerCase();
      const trainerType = (t.trainer_type || "").toLowerCase();
      if (fullName.includes(ql) || trainerType.includes(ql)) {
        results.push({
          type: "trainer",
          label: `${t.first_name || ""} ${t.last_name || ""}`.trim(),
          subtitle: t.trainer_type || "Trainer",
          icon: "feather-award",
          link: `/personal-training/trainer/${(t.first_name || "").replace(/\s+/g, "-").toLowerCase()}/${t._id}`,
          badge: t.trainer_type || "Trainer",
        });
      }
    });

    return results.slice(0, 8); // Max 8 suggestions
  };

  // ─── Handle search input change with debounce ───
  const handleSearchInputChange = (val: string) => {
    setGlobalSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const data = await fetchSuggestionsData();
      const filtered = filterSuggestions(data, val.trim());
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 300);
  };

  // ─── Close suggestions on outside click ───
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [fullUserData, setFullUserData] = useState<any>(null);
  const [input, setInput] = useState({
    first_name: "",
    mobile: "",
    email: "",
    subject: "Quick Enquiry",
    comments: "",
  });

  const clearStaleSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token2");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");
    setUserData(null);
    setFullUserData(null);
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  interface JwtPayload {
    first_name: string;
    role?: string;
    userID?: number;
    id?: number;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode<JwtPayload>(token);
          setUserData(decodedToken);
          const userId = decodedToken?.userID || decodedToken?.id;
          if (userId) {
            const res = await axios.get(`${API_URL}/user/fetch-user-by-id/${userId}`);
            if (res.data?.data) {
              setFullUserData(res.data.data);
            }
          }
        } catch (err) {
          // A database reseed removes old demo users. Clear the browser's old
          // JWT instead of repeatedly requesting a user that no longer exists.
          const status = axios.isAxiosError(err) ? err.response?.status : undefined;
          if (status === 400 || status === 401 || status === 404) {
            clearStaleSession();
            return;
          }
          
        }
      }
    };
    fetchUserData();

    window.addEventListener("userProfileUpdated", fetchUserData);
    return () => {
      window.removeEventListener("userProfileUpdated", fetchUserData);
    };
  }, [location.pathname]);

  const handleInputChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "first_name") {
      if (/^[a-zA-Z\s]+$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setError(`${name} must contain only letters`);
      }
    } else if (name === "phone") {
      if (/^\d{0,10}$/.test(value) || value === "") {
        setInput((prevState) => ({
          ...prevState,
          mobile: value,
        }));
      } else {
        setError("Mobile number must be 10 digits");
      }
    } else if (name === "email") {
      setInput((prevState) => ({
        ...prevState,
        email: value,
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleInquiries = async (e: any) => {
    e.preventDefault();
    try {
      if (!input.first_name || !input.mobile || !input.comments) {
        setError("Please fill in all required fields.");
        alert("Please fill in all required fields.");
        return;
      }

      const response = await axios
        .post(`${API_URL}/enquiry/create`, input)
        .then((response) => {
          // alert("response");
          showLoadingAlert();
          setVisible(false);
          setTimeout(function () {
            Swal.fire(
              "Success!",
              "Your enquiry has been submitted!",
              "success"
            );
          }, 1000);

          //   navigate("/");

          if (response) {
            setInput({
              first_name: "",
              mobile: "",
              email: "",
              subject: "Quick Enquiry",
              comments: "",
            });
          }
        });
    } catch (error) {
      

      setError("Error: " + error);
    }
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Loading",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
    }, 1000);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token2");
    localStorage.removeItem("userName");
    localStorage.removeItem("id");

    // navigate("/");
  };

  const header = [
    {
      tittle: "Home",
      separateRoute: true,
      routes: routes.home,
    },
    {
      tittle: "Sports Venues",
      separateRoute: true,
      routes: routes.blogListSidebarLeft,
    },
    {
      tittle: "Coaches",
      separateRoute: true,
      routes: routes.coachesGrid,
    },
    {
      tittle: "Trainers",
      separateRoute: true,
      routes: routes.blogList,
    },
    {
      tittle: "Events",
      separateRoute: true,
      routes: routes.events,
    },
    {
      tittle: "Blogs",
      separateRoute: true,
      routes: routes.blogGrid,
    },
    {
      tittle: "Contact Us",
      separateRoute: true,
      routes: routes.contactUs,
    },
  ];

  const mobileNavLinks = [
    { label: "Home", icon: "fas fa-home", route: routes.home },
    { label: "Sports Venues", icon: "fas fa-map-marker-alt", route: routes.blogListSidebarLeft },
    { label: "Coaches", icon: "fas fa-user-ninja", route: routes.coachesGrid },
    { label: "Trainers", icon: "fas fa-dumbbell", route: routes.blogList },
    { label: "Events", icon: "fas fa-calendar-alt", route: routes.events },
    { label: "Blogs", icon: "fas fa-newspaper", route: routes.blogGrid },
    { label: "Contact Us", icon: "fas fa-envelope", route: routes.contactUs },
  ];

  const profileStyle = {
    display: loginToken ? "block" : "none",
  };

  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  useEffect(() => {
    const handleDocumentClick = () => {
      setIsProfileOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen);
  };

  const hideOffcanvas = () => {
    setOffcanvasOpen(false);
    setMobileSearchQuery("");
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;
    const q = mobileSearchQuery.trim();
    setMobileSearchQuery("");
    hideOffcanvas();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setOffcanvasOpen(false);
  }, [location.pathname]);

  // Lock body scroll + close on Escape while the drawer is open
  useEffect(() => {
    if (!offcanvasOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffcanvasOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [offcanvasOpen]);

  return (
    <>
      <header
        className={`header ${location.pathname === routes.home ? "header-trans" : "header-sticky"
          } ${isScrolled || location.pathname.startsWith("/events/") ? "fixed" : ""}`}
      >
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header">
              <div className="mobile-navbar d-lg-none d-flex align-items-center justify-content-between w-100"
                style={{
                  background: "#FFFFFF",
                  borderBottom: "1px solid #F1F5F9",
                  padding: "8px 12px",
                  position: "relative",
                  zIndex: 10
                }}
              >
                <Link to="/" className="navbar-brand m-0 p-0">
                  <img
                    src="/logo.png"
                    className="img-fluid"
                    alt="Logo"
                    style={{ maxHeight: "34px", objectFit: "contain" }}
                  />
                </Link>
                <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                  {/* Quick search */}
                  <Link
                    to="/search"
                    className="d-flex align-items-center justify-content-center text-decoration-none"
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#FFFFFF",
                      flexShrink: 0
                    }}
                    aria-label="Search venues, coaches and trainers"
                  >
                    <i className="fas fa-search text-dark" style={{ fontSize: "13px" }} />
                  </Link>
                  {/* Account: Profile/Login button */}
                  {loginToken ? (
                    <Link
                      to={routes.userProfile}
                      className="d-flex align-items-center justify-content-center text-decoration-none"
                      style={{
                        backgroundColor: "#16A34A",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "12.5px",
                        height: "36px",
                        border: "none",
                        color: "#FFFFFF",
                        padding: "0 12px",
                        gap: "6px",
                        flexShrink: 0,
                        whiteSpace: "nowrap" as const
                      }}
                      aria-label="My Profile"
                    >
                      <i className="fas fa-user" style={{ fontSize: "12px", color: "#FFFFFF" }} />
                      <span style={{ maxWidth: "65px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#FFFFFF" }}>
                        {fullUserData?.first_name || userData?.first_name || "Profile"}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="d-flex align-items-center justify-content-center text-decoration-none"
                      style={{
                        backgroundColor: "#16A34A",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "12.5px",
                        height: "36px",
                        border: "none",
                        color: "#FFFFFF",
                        padding: "0 12px",
                        gap: "6px",
                        flexShrink: 0
                      }}
                    >
                      <i className="fas fa-user" style={{ fontSize: "12px", color: "#FFFFFF" }} />
                      <span style={{ color: "#FFFFFF" }}>Login</span>
                    </Link>
                  )}
                  {/* Menu */}
                  <button
                    className="d-flex align-items-center justify-content-center p-0"
                    onClick={toggleOffcanvas}
                    type="button"
                    aria-label="Toggle navigation"
                    aria-expanded={offcanvasOpen}
                    aria-controls="mobileOffcanvas"
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                      outline: "none",
                      backgroundColor: "transparent",
                      flexShrink: 0
                    }}
                  >
                    <i className="fas fa-bars text-dark" style={{ fontSize: "14px" }} />
                  </button>
                </div>
              </div>
              {/* <nav className="navbar navbar-light bg-light">
              <div className="container-fluid">
                <button className="navbar-toggler  first-button" type="button" data-mdb-collapse-init
                  data-mdb-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                  aria-expanded="false" aria-label="Toggle navigation">
                  <i className="fas fa-bars white"></i>
                </button>
              </div>
            </nav>
            <div className="collapse" id="navbarToggleExternalContent">
              <div className="bg-light shadow-3 p-4">
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block border-bottom m-0">Link 1</button>
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block border-bottom m-0">Link 2</button>
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-block m-0">Link 3</button>
              </div>
            </div> */}

              {/* <Link id="mobile_btn" to="#">
              <span className="bar-icon">
                <span />
                <span />
                <span />
              </span>
            </Link> */}
              <Link to="/" className="navbar-brand logo d-none d-lg-flex" style={{ padding: "0", alignItems: "center", textDecoration: "none" }}>
                <img
                  src="/logo.png"
                  className="img-fluid logo-navbar-3d"
                  alt="Logo"
                  style={{
                    maxHeight: "56px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 1px 3px rgba(67, 182, 73, 0.3))",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                />
              </Link>
            </div>
            <div className="main-menu-wrapper d-none d-lg-block">
              <div className="menu-header">
                <Link to="/" className="menu-logo">
                  <img
                    src="/logo.png"
                    className="img-fluid"
                    alt="Logo"
                    style={{ maxHeight: "36px" }}
                  />
                </Link>
                <Link id="menu_close" className="menu-close" to="#">
                  {" "}
                  <i className="fas fa-times" />
                </Link>
              </div>
              <ul className="main-nav">
                {header.map((mainMenus, mainIndex) => (
                  <React.Fragment key={mainIndex}>
                    {mainMenus.separateRoute ? (
                      <li
                        key={mainIndex}
                        className={
                          mainMenus.routes === "/"
                            ? (location.pathname === "/" ? "active" : "")
                            : (location.pathname.startsWith(mainMenus.routes) ? "active" : "")
                        }
                      >
                        <Link to={mainMenus.routes}>{mainMenus.tittle}</Link>
                      </li>
                    ) : (
                      <li
                        className={`has-submenu ${mainMenus?.menu?.map((item) => item?.routes).includes(location.pathname) ? "active" : ""}`}
                      >
                        <Link to="#">
                          {mainMenus.tittle}{" "}
                          <i className="fas fa-chevron-down"></i>
                        </Link>
                        <ul
                          className={`submenu ${mainMenus.showAsTab ? "d-block" : ""}`}
                        >
                          {mainMenus.menu?.map((menu, menuIndex) => (
                            <li
                              key={menuIndex}
                              className={`${menu.hasSubRoute ? "has-submenu" : ""} ${menu?.subMenus?.map((item) => item?.routes).includes(location.pathname) ? "active" : ""}`}
                            >
                              {menu.hasSubRoute ? (
                                <React.Fragment>
                                  <Link to="#">{menu.menuValue}</Link>
                                  <ul
                                    className={`submenu ${menu.showSubRoute ? "d-block" : ""}`}
                                  >
                                    {menu.subMenus?.map(
                                      (subMenu, subMenuIndex) => (
                                        <li key={subMenuIndex}>
                                          <Link to={subMenu.routes}>
                                            {subMenu.menuValue}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </React.Fragment>
                              ) : (
                                <li
                                  className={
                                    location.pathname.includes(menu.routes)
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <Link to={menu.routes}>{menu.menuValue}</Link>
                                </li>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>

            <ul className="nav header-navbar-rht">
              {/* Global Search Bar (Only on Desktop) */}
              <li className="nav-item d-none d-lg-block me-3">
                <div className="nav-search-bar" ref={suggestionsRef} style={{ position: "relative" }}>
                  <form onSubmit={handleGlobalSearch} className="position-relative">
                    <input
                      type="text"
                      value={globalSearchQuery}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      onFocus={() => { if (suggestions.length > 0 && globalSearchQuery.trim().length >= 2) setShowSuggestions(true); }}
                      className="form-control nav-search-input"
                      autoComplete="off"
                      placeholder="Search venues, coaches, trainers..."
                    />
                    <button type="submit" className="nav-search-btn">
                      <i className="fas fa-search" />
                    </button>
                  </form>

                  {/* ─── Live Search Suggestions Dropdown ─── */}
                  {showSuggestions && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        left: "auto",
                        width: "360px",
                        marginTop: "6px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "14px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                        zIndex: 9999,
                        overflow: "hidden",
                        padding: "8px 0",
                        maxHeight: "400px",
                        overflowY: "auto",
                      }}
                    >
                      {suggestionsLoading ? (
                        <div className="d-flex align-items-center justify-content-center py-4 gap-2" style={{ color: "#64748B", fontSize: "13px" }}>
                          <div className="spinner-border spinner-border-sm text-success" role="status" />
                          <span>Searching...</span>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <>
                          {suggestions.map((item: any, idx: number) => (
                            <Link
                              key={idx}
                              to={item.link}
                              onClick={() => { setShowSuggestions(false); setGlobalSearchQuery(""); }}
                              className="d-flex align-items-center gap-3 px-3.5 py-3 text-decoration-none"
                              style={{
                                borderBottom: idx < suggestions.length - 1 ? "1px solid #F1F5F9" : "none",
                                transition: "background-color 0.15s ease",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  backgroundColor: item.type === "venue" ? "#F0FDF4" : item.type === "coach" ? "#EFF6FF" : "#FDF4FF",
                                  color: item.type === "venue" ? "#22C55E" : item.type === "coach" ? "#3B82F6" : "#A855F7",
                                }}
                              >
                                <i className={item.icon} style={{ fontSize: "15px" }} />
                              </div>
                              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="fw-bold" style={{ fontSize: "13px", color: "#0F172A", lineHeight: "1.3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {item.label}
                                </div>
                                <div style={{ fontSize: "11px", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {item.subtitle}
                                </div>
                              </div>
                              <span
                                className="badge rounded-pill flex-shrink-0"
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "700",
                                  padding: "4px 10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  backgroundColor: item.type === "venue" ? "#F0FDF4" : item.type === "coach" ? "#EFF6FF" : "#FDF4FF",
                                  color: item.type === "venue" ? "#166534 !important" : item.type === "coach" ? "#1D4ED8 !important" : "#7E22CE !important",
                                }}
                              >
                                {item.badge}
                              </span>
                            </Link>
                          ))}
                          {/* View All Results link */}
                          <Link
                            to={`/search?q=${encodeURIComponent(globalSearchQuery.trim())}`}
                            onClick={() => { setShowSuggestions(false); }}
                            className="d-flex align-items-center justify-content-center gap-2 py-3 text-decoration-none"
                            style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", color: "#22C55E", fontSize: "13px", fontWeight: "600", marginTop: "4px" }}
                          >
                            <i className="feather-search" style={{ fontSize: "14px" }} />
                            View all results for &ldquo;{globalSearchQuery.trim()}&rdquo;
                          </Link>
                        </>
                      ) : (
                        <div className="text-center py-4" style={{ color: "#94A3B8", fontSize: "13px" }}>
                          <i className="feather-search d-block mb-2" style={{ fontSize: "20px" }} />
                          No suggestions found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
              <li className="nav-item">
                {/* <Link
                className="nav-link btn btn-secondary"
                to="http://127.0.0.1:3037/admin"
              >
                <span>
                  <i className="feather-check-circle" />
                </span>
                List Your Court
              </Link> */}
              </li>

              <li className="nav-item d-none d-lg-block">
                {loginToken ? (
                  <div className="user-profile-nav">
                    <div
                      className={`profile-trigger d-flex align-items-center gap-2 cursor-pointer ${isProfileOpen ? "show" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileOpen(!isProfileOpen);
                      }}
                    >
                      <div className="avatar-circle" style={{ overflow: "hidden" }}>
                        {fullUserData?.profile_image?.[0]?.src ? (
                          <img
                            src={`${IMG_URL}${fullUserData.profile_image[0].src}`}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                          />
                        ) : (
                          (fullUserData?.first_name || userData?.first_name || 'U')[0].toUpperCase()
                        )}
                      </div>
                      <span className="user-name-text">
                        {fullUserData?.first_name || userData?.first_name || "User"}
                      </span>
                      <i className="fas fa-chevron-down" style={{ fontSize: "12px", opacity: 0.7 }} />
                      <div className="lt-btn">
                        <ul className="profile-dropdown">
                          <li className="ft-colr-ffff">
                            <Link to={routes.userDashboard}>
                              <i className="fas fa-th-large"></i> &nbsp;
                              Dashboard
                            </Link>
                          </li>
                          <li className="ft-colr-ffff">
                            <Link to={routes.userBookings}>
                              <i className="fas fa-calendar-alt"></i> &nbsp;
                              My Bookings
                            </Link>
                          </li>
                          <li className="ft-colr-ffff">
                            <Link to={`${routes.userDashboard}?tab=favourites`}>
                              <i className="fas fa-heart"></i> &nbsp;
                              My Favourites
                            </Link>
                          </li>
                          <li className="ft-colr-ffff">
                            <Link to={routes.userProfile}>
                              <i className="fas fa-user-edit"></i> &nbsp;
                              Edit Profile
                            </Link>
                          </li>
                          <li className="ft-colr-ffff" onClick={removeToken}>
                            <Link to={routes.home}>
                              <i className="fas fa-sign-out-alt"></i> Logout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    <Link to={"/login"} className="navbar-register-btn px-4">
                      Login
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* Modern Full-Height Mobile Offcanvas Drawer */}
      <div
        className={`ki-mob-drawer offcanvas offcanvas-start ${offcanvasOpen ? "show" : ""}`}
        tabIndex={-1}
        id="mobileOffcanvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          height: "100vh",
          zIndex: 1060,
          visibility: offcanvasOpen ? "visible" : "hidden",
          transform: offcanvasOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.32s ease",
          boxShadow: "8px 0 32px rgba(15, 23, 42, 0.16)"
        }}
      >
        {/* Brand header */}
        <div className="ki-mob-drawer-header">
          <div className="ki-mob-drawer-brand-row">
            <img src="/logo.png" alt="Khelo Indore" className="ki-mob-drawer-logo" />
            <div className="ki-mob-drawer-brand-text">
              <span className="ki-mob-drawer-brand">Khelo Indore</span>
              <span className="ki-mob-drawer-tagline">Play - Train - Compete</span>
            </div>
          </div>
          <button type="button" className="ki-mob-drawer-close" onClick={hideOffcanvas} aria-label="Close menu">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="ki-mob-drawer-body">
          {/* Search */}
          <form onSubmit={handleMobileSearch} className="ki-mob-search" role="search">
            <i className="fas fa-search" />
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search venues, coaches, trainers..."
              aria-label="Search"
            />
          </form>

          {/* Menu */}
          <div className="ki-mob-section-label">Menu</div>
          <nav className="ki-mob-nav" aria-label="Mobile menu">
            {mobileNavLinks.map((item, idx) => {
              const isActive =
                item.route === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.route);
              return (
                <Link
                  key={idx}
                  to={item.route}
                  onClick={hideOffcanvas}
                  className={`ki-mob-nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="ki-mob-nav-icon">
                    <i className={item.icon} />
                  </span>
                  <span className="ki-mob-nav-label">{item.label}</span>
                  <i className="fas fa-chevron-right ki-mob-nav-arrow" />
                </Link>
              );
            })}
          </nav>

          {/* Account */}
          <div className="ki-mob-section-label">Account</div>
          {loginToken ? (
            <>
              <div className="ki-mob-user">
                <span className="ki-mob-avatar">
                  {(fullUserData?.first_name || userData?.first_name || "U")[0].toUpperCase()}
                </span>
                <div className="ki-mob-user-text">
                  <span className="ki-mob-user-name">
                    {fullUserData?.first_name || userData?.first_name || "User"}
                  </span>
                  <span className="ki-mob-user-role">
                    {userData?.role
                      ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
                      : "Member"}
                  </span>
                </div>
              </div>
              <Link to={routes.userBookings} onClick={hideOffcanvas} className="ki-mob-account-item">
                <i className="fas fa-calendar-alt" /> My Bookings
              </Link>
              <Link to={routes.userProfile} onClick={hideOffcanvas} className="ki-mob-account-item">
                <i className="fas fa-user-edit" /> Edit Profile
              </Link>
              <button
                type="button"
                className="ki-mob-account-item ki-mob-logout"
                onClick={() => {
                  removeToken();
                  hideOffcanvas();
                  navigate(routes.home);
                }}
              >
                <i className="fas fa-sign-out-alt" /> Logout
              </button>
            </>
          ) : (
            <div className="ki-mob-auth">
              <Link to="/login" onClick={hideOffcanvas} className="ki-mob-btn-primary">
                <i className="fas fa-sign-in-alt" /> Login
              </Link>
              <Link to={routes.register} onClick={hideOffcanvas} className="ki-mob-btn-outline">
                <i className="fas fa-user-plus" /> Create Account
              </Link>
            </div>
          )}

          <div className="ki-mob-drawer-footer">
            <i className="fas fa-map-marker-alt" /> Indore, Madhya Pradesh
          </div>
        </div>
      </div>
      {offcanvasOpen && (
        <div
          className="offcanvas-backdrop ki-mob-backdrop fade show"
          onClick={hideOffcanvas}
          style={{ zIndex: 1050 }}
        />
      )}
      {typeof document !== "undefined" && createPortal(
        <div>
          {!visible && (
            <div className="enquiry-btn" style={{ position: "fixed", bottom: "80px", right: "30px", zIndex: 999999 }}>
              <CButton
                onClick={() => setVisible(true)}
                className="btn btn-primary d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                  border: "none",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 15px rgba(22, 163, 74, 0.4)",
                  padding: "12px 24px",
                  borderRadius: "30px",
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "none",
                  transition: "all 0.3s ease"
                }}
              >
                <i className="fas fa-envelope" style={{ color: "#FFFFFF" }} />
                <span style={{ color: "#FFFFFF" }}>Enquiry Now</span>
              </CButton>
            </div>
          )}
          <COffcanvas
            placement="end"
            scroll={true}
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: "420px", border: "none", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}
          >
            {/* ── Premium Green Header ── */}
            <COffcanvasHeader
              style={{
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                padding: "16px 20px",
                borderBottom: "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* decorative bubbles */}
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "110px", height: "110px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-20px", left: "10px", width: "65px", height: "65px", background: "rgba(255,255,255,0.06)", borderRadius: "50%", pointerEvents: "none" }} />

              {/* single row: icon + text | close */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", flexShrink: 0 }}>
                    <i className="fas fa-paper-plane" style={{ color: "#FFFFFF", fontSize: "15px" }} />
                  </div>
                  <div>
                    <h5 style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, margin: 0, fontSize: "17px", letterSpacing: "-0.3px" }}>
                      Send Enquiry
                    </h5>
                    <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "12px", margin: "2px 0 0", fontWeight: 400 }}>
                      We&apos;ll reply within 24 hours
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "8px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#FFFFFF", fontSize: "14px", flexShrink: 0 }}
                >✕</button>
              </div>
            </COffcanvasHeader>

            {/* ── Form Body ── */}
            <COffcanvasBody style={{ padding: "18px 20px 16px", background: "#F8FAFC", overflowY: "auto" }}>
              <form onSubmit={handleInquiries} noValidate>

                {/* ── Field helper ── */}
                {[
                  { label: "Full Name", id: "full-name", name: "first_name", type: "text", icon: "fa-user", placeholder: "Enter your full name", value: input.first_name },
                  { label: "Phone Number", id: "phone", name: "phone", type: "number", icon: "fa-phone", placeholder: "Enter 10-digit number", value: input.mobile },
                  { label: "Email Address", id: "e-mail", name: "email", type: "text", icon: "fa-envelope", placeholder: "Enter your email", value: input.email },
                ].map(({ label, id, name, type, icon, placeholder, value }) => (
                  <div key={id} style={{ marginBottom: "10px" }}>
                    <label
                      htmlFor={id}
                      style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "4px" }}
                    >
                      {label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <i
                        className={`fas ${icon}`}
                        style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "13px", zIndex: 3, pointerEvents: "none" }}
                      />
                      <input
                        id={id}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleInputChange}
                        style={{
                          display: "block",
                          width: "100%",
                          paddingLeft: "40px",
                          paddingRight: "14px",
                          height: "40px",
                          borderRadius: "10px",
                          border: "1.5px solid #E5E7EB",
                          fontSize: "13px",
                          color: "#111827",
                          background: "#FFFFFF",
                          outline: "none",
                          transition: "border 0.2s ease, box-shadow 0.2s ease",
                          fontFamily: "'Inter','Space Grotesk',sans-serif",
                          boxSizing: "border-box",
                        }}
                        onFocus={e => { e.target.style.border = "1.5px solid #22C55E"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)"; }}
                        onBlur={e => { e.target.style.border = "1.5px solid #E5E7EB"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  </div>
                ))}

                {/* ── Message ── */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    htmlFor="comments"
                    style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: "10px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "4px" }}
                  >
                    Message
                  </label>
                  <div style={{ position: "relative" }}>
                    <i
                      className="fas fa-comment-dots"
                      style={{ position: "absolute", left: "14px", top: "11px", color: "#9CA3AF", fontSize: "13px", zIndex: 3, pointerEvents: "none" }}
                    />
                    <textarea
                      id="comments"
                      name="comments"
                      rows={2}
                      placeholder="Tell us about your enquiry..."
                      value={input.comments}
                      onChange={handleInputChange}
                      style={{
                        display: "block",
                        width: "100%",
                        paddingLeft: "40px",
                        paddingRight: "14px",
                        paddingTop: "10px",
                        borderRadius: "10px",
                        border: "1.5px solid #E5E7EB",
                        fontSize: "13px",
                        color: "#111827",
                        background: "#FFFFFF",
                        outline: "none",
                        resize: "none",
                        transition: "border 0.2s ease, box-shadow 0.2s ease",
                        fontFamily: "'Inter','Space Grotesk',sans-serif",
                        boxSizing: "border-box",
                      }}
                      onFocus={e => { e.target.style.border = "1.5px solid #22C55E"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)"; }}
                      onBlur={e => { e.target.style.border = "1.5px solid #E5E7EB"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "42px",
                    background: "linear-gradient(135deg,#22C55E 0%,#16A34A 100%)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.36)",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.2px",
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 22px rgba(34,197,94,0.48)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(34,197,94,0.38)"; }}
                >
                  <i className="fas fa-paper-plane" style={{ fontSize: "14px" }} />
                  Send Enquiry
                </button>

                {/* trust badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "8px" }}>
                  <i className="fas fa-shield-alt" style={{ color: "#9CA3AF", fontSize: "11px" }} />
                  <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500 }}>Your information is 100% confidential</span>
                </div>

              </form>
            </COffcanvasBody>
          </COffcanvas>

        </div>,
        document.body
      )}

    </>);
};

export default Header;
