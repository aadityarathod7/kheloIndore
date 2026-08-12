import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";

// ─── Image Helper ───
const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
};

const getCoachImage = (profile_picture: any): string => {
  if (!profile_picture || !Array.isArray(profile_picture) || profile_picture.length === 0) return "/assets/img/no-img.png";
  const src = profile_picture[0]?.src;
  if (!src) return "/assets/img/no-img.png";
  if (src.startsWith("http")) return src;
  return `${IMG_URL}${src}`;
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [venues, setVenues] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  const getVenueSize = (venue: any) => {
    if (Array.isArray(venue.sports_details) && venue.sports_details.length > 0) {
      const match = venue.sports_details.find((sd: any) => sd && sd.size);
      if (match && match.size) {
        return match.size;
      }
    }
    if (venue.gameType && !["cricket", "football", "badminton", "basketball", "tennis", "table tennis", "swimming", "pickle ball"].includes(venue.gameType.toLowerCase())) {
      return venue.gameType;
    }
    return "Standard";
  };
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "venues" | "coaches" | "trainers">("all");

  // ─── Fetch all data on mount ───
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [venuesRes, coachesRes, trainersRes] = await Promise.all([
          axios.get(`${API_URL}/web/venue/getVenue`).catch(() => ({ data: { venue: [] } })),
          axios.get(`${API_URL}/web/fetch-all-coaches`).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_URL}/web/PersonalTraining/fetchAll`).catch(() => ({ data: { data: [] } })),
        ]);
        setVenues(venuesRes.data?.venue || []);
        setCoaches(coachesRes.data?.data || []);
        setTrainers(trainersRes.data?.data || []);
      } catch {
        // The request failure is handled by the surrounding UI state.
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ─── Filter results by query ───
  const q = query.toLowerCase().trim();

  const filteredVenues = useMemo(() => {
    if (!q) return [];
    return venues.filter((v: any) => {
      const name = (v.name || "").toLowerCase();
      const category = (v.category || "").toLowerCase();
      const vendorType = (v.vendor_type || "").toLowerCase();
      const location = (v.near_by_location || "").toLowerCase();
      return name.includes(q) || category.includes(q) || vendorType.includes(q) || location.includes(q);
    });
  }, [venues, q]);

  const filteredCoaches = useMemo(() => {
    if (!q) return [];
    return coaches.filter((c: any) => {
      const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
      const category = (c.category || "").toLowerCase();
      const trainerType = (c.trainer_type || "").toLowerCase();
      const orgname = (c.orgname || "").toLowerCase();
      const specializations = Array.isArray(c.specializations) ? c.specializations.join(" ").toLowerCase() : "";
      return fullName.includes(q) || category.includes(q) || trainerType.includes(q) || orgname.includes(q) || specializations.includes(q);
    });
  }, [coaches, q]);

  const filteredTrainers = useMemo(() => {
    if (!q) return [];
    return trainers.filter((t: any) => {
      const fullName = `${t.first_name || ""} ${t.last_name || ""}`.toLowerCase();
      const category = (t.category || "").toLowerCase();
      const trainerType = (t.trainer_type || "").toLowerCase();
      const specializations = Array.isArray(t.specializations) ? t.specializations.join(" ").toLowerCase() : "";
      return fullName.includes(q) || category.includes(q) || trainerType.includes(q) || specializations.includes(q);
    });
  }, [trainers, q]);

  const totalResults = filteredVenues.length + filteredCoaches.length + filteredTrainers.length;

  useEffect(() => {
    document.title = query ? `Search Results for "${query}" - Khelo Indore` : "Search - Khelo Indore";
    window.scrollTo(0, 0);
  }, [query]);

  // ─── Determine which sections to show based on active tab ───
  const showVenues = activeTab === "all" || activeTab === "venues";
  const showCoaches = activeTab === "all" || activeTab === "coaches";
  const showTrainers = activeTab === "all" || activeTab === "trainers";

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* ═══ Standard Hero Header ═══ */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "120px", paddingBottom: "36px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "8px", color: "#22C55E", fontWeight: "700" }}>FIND WHAT YOU NEED</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "44px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "12px" }}>
                Search <span style={{ color: "#22C55E", marginLeft: "10px" }}>Results</span>
              </h1>
              {query && (
                <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "16px", fontWeight: "500", maxWidth: "480px" }}>
                  {loading ? "Searching..." : `Showing ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${query}"`}
                </p>
              )}

              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Search Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Header */}

      {/* ═══ Main Content ═══ */}
      <div className="content py-4" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container px-lg-4 px-3">

          {/* ─── Category Tab Filters ─── */}
          <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
            {[
              { key: "all" as const, label: "All Results", count: totalResults, icon: "feather-search" },
              { key: "venues" as const, label: "Venues", count: filteredVenues.length, icon: "feather-map-pin" },
              { key: "coaches" as const, label: "Coaches", count: filteredCoaches.length, icon: "feather-users" },
              { key: "trainers" as const, label: "Trainers", count: filteredTrainers.length, icon: "feather-award" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className="btn d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  backgroundColor: activeTab === tab.key ? "#22C55E" : "#FFFFFF",
                  color: activeTab === tab.key ? "#FFFFFF" : "#334155",
                  border: activeTab === tab.key ? "1px solid #22C55E" : "1px solid #E2E8F0",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
              >
                <i className={tab.icon} style={{ fontSize: "14px" }} />
                <span>{tab.label}</span>
                <span
                  className="d-flex align-items-center justify-content-center rounded-pill"
                  style={{
                    minWidth: "22px",
                    height: "22px",
                    fontSize: "11px",
                    fontWeight: "700",
                    backgroundColor: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                    color: activeTab === tab.key ? "#FFFFFF" : "#64748B",
                    padding: "0 6px",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* ─── Loading State ─── */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted" style={{ fontSize: "14px" }}>Searching across venues, coaches, and trainers...</p>
            </div>
          )}

          {/* ─── No Results State ─── */}
          {!loading && totalResults === 0 && query && (
            <div className="text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8E3" }}>
              <i className="feather-search text-muted mb-3 d-block" style={{ fontSize: "48px" }} />
              <h4 className="fw-bold text-dark mb-2">No results found for &ldquo;{query}&rdquo;</h4>
              <p className="text-muted mb-3" style={{ fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
                Try searching with different keywords like &ldquo;turf&rdquo;, &ldquo;cricket&rdquo;, &ldquo;badminton&rdquo;, or a venue name
              </p>
              <Link to="/" className="btn btn-success rounded-pill px-4 py-2 shadow-sm" style={{ backgroundColor: "#22C55E", borderColor: "#22C55E", fontSize: "13px", fontWeight: "600" }}>
                <i className="feather-home me-2" />Back to Home
              </Link>
            </div>
          )}

          {/* ─── No Query State ─── */}
          {!loading && !query && (
            <div className="text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8E3" }}>
              <i className="feather-search text-muted mb-3 d-block" style={{ fontSize: "48px" }} />
              <h4 className="fw-bold text-dark mb-2">Start your search</h4>
              <p className="text-muted" style={{ fontSize: "14px" }}>
                Use the search bar above to find venues, coaches, and trainers
              </p>
            </div>
          )}

          {/* ═══ VENUES SECTION ═══ */}
          {!loading && showVenues && filteredVenues.length > 0 && (
            <div className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="feather-map-pin text-success" style={{ fontSize: "20px" }} />
                <h4 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "20px" }}>
                  Sports Venues
                </h4>
                <span className="badge rounded-pill" style={{ backgroundColor: "#F0FDF4", color: "#166534", fontSize: "12px", fontWeight: "700", padding: "4px 10px" }}>
                  {filteredVenues.length}
                </span>
              </div>

              <div className="ki-5-col-grid">
                {filteredVenues.map((venue: any, index: number) => (
                  <div key={index} className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease" }}>

                    {/* Card Image */}
                    <div className="listing-img" style={{ height: "105px", position: "relative" }}>
                      <Link
                        to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                        style={{ position: "absolute", inset: 0, display: "block" }}
                      >
                        {getVenueImage(venue?.images).startsWith("http") ? (
                          <img src={getVenueImage(venue?.images)} className="img-fluid" alt={venue.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageWithBasePath src={getVenueImage(venue?.images)} className="img-fluid" alt={venue.name} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                        )}
                      </Link>
                      {/* Category Badge */}
                      <div style={{ position: "absolute", top: "6px", left: "6px", zIndex: 2 }}>
                        <span className="badge" style={{ backgroundColor: "#22C55E", color: "#FFFFFF", fontWeight: "700", fontSize: "9px", padding: "3px 6px", borderRadius: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {venue?.vendor_type ? venue.vendor_type.replace("_", " ") : "Venue"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="listing-content news-content p-2.5" style={{ background: "#FFFFFF", padding: "12px" }}>
                      <div className="d-flex align-items-center justify-content-between mb-2" style={{ fontSize: "12px" }}>
                        <div className="rating-wrap d-flex align-items-center gap-1">
                          <i className="fas fa-star text-warning" style={{ fontSize: "11px" }} />
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#17222D" }}>4.8</span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#606D76", fontWeight: "600" }}>
                          <i className="feather-grid me-1" style={{ color: "#3CAB4B", fontSize: "11px" }} />
                          {getVenueSize(venue)}
                        </span>
                      </div>

                      <h3 className="listing-title mb-1.5" style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.2" }}>
                        <Link
                          to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                          className="text-truncate d-block" style={{ color: "#17222D" }}
                          title={venue.name}
                        >
                          {venue.name}
                        </Link>
                      </h3>

                      <div className="d-flex align-items-center justify-content-between mb-2" style={{ fontSize: "12px" }}>
                        <p className="mb-0 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                          <i className="feather-map-pin me-1" style={{ color: "#3CAB4B" }} />
                          {venue.near_by_location || "Indore"}, Indore
                        </p>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                        <span style={{ fontSize: "16px", fontWeight: "800", color: "#17222D" }}>
                          ₹{venue.price_per_hr || "750"} <span style={{ fontSize: "11px", fontWeight: "normal", color: "#606D76" }}>/hr</span>
                        </span>
                        <Link
                          to={`/sports-venue/${venue.vendor_type ? venue.vendor_type.replace(/\s+/g, "-").toLowerCase() : "venue"}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                          className="btn btn-primary btn-sm rounded-pill px-3 py-1"
                          style={{ fontSize: "12px", fontWeight: "600", backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                        >
                          Book Slot
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ COACHES SECTION ═══ */}
          {!loading && showCoaches && filteredCoaches.length > 0 && (
            <div className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="feather-users text-success" style={{ fontSize: "20px" }} />
                <h4 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "20px" }}>
                  Coaches
                </h4>
                <span className="badge rounded-pill" style={{ backgroundColor: "#F0FDF4", color: "#166534", fontSize: "12px", fontWeight: "700", padding: "4px 10px" }}>
                  {filteredCoaches.length}
                </span>
              </div>

              <div className="row g-3">
                {filteredCoaches.map((coach: any, index: number) => (
                  <div className="col-lg-3 col-md-6 col-sm-12 d-flex" key={index}>
                    <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                      <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                        <Link
                          to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                          style={{ display: "block", height: "100%" }}
                        >
                          <img
                            src={getCoachImage(coach.profile_picture)}
                            alt={coach.first_name}
                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          />
                        </Link>
                        {/* Category Badge */}
                        <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                          <span className="tag tag-blue" style={{ background: "#2D3E33", color: "#FFFFFF", fontWeight: "700", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                            {coach?.trainer_type}
                          </span>
                        </div>
                      </div>

                      <div className="listing-content news-content p-3 w-100 d-flex flex-column justify-content-between flex-grow-1" style={{ background: "#FFFFFF" }}>
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                            <div className="rating-wrap d-flex align-items-center gap-1">
                              <i className="fas fa-star text-warning" style={{ fontSize: "10px" }} />
                              <span style={{ fontSize: "10px", fontWeight: "700", color: "#17222D" }}>4.7</span>
                            </div>
                          </div>
                          <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                            <Link
                              to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                              className="text-truncate d-block" style={{ color: "#17222D" }}
                            >
                              {coach.full_name ? coach.full_name : coach.first_name}
                            </Link>
                          </h3>
                          <p className="mb-2 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                            <i className="feather-map-pin me-1" style={{ color: "#606D76" }} />
                            {coach.near_by_location || "Indore"}, Indore
                          </p>
                          <p className="mb-2 text-truncate" style={{ fontSize: "11px", color: "#64748B" }}>
                            Specialization: {Array.isArray(coach?.specializations) ? coach?.specializations.join(", ") : coach?.specializations || "Coaching"}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 mt-auto" style={{ borderTop: "1px solid #E2E8E3" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                            ₹{coach.price_per_hr || "500"} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                          </span>
                          <Link
                            to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                            className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm"
                            style={{ fontSize: "11px", fontWeight: "700", background: "linear-gradient(135deg, #43B649 0%, #349E3A 100%)", border: "none" }}
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ TRAINERS SECTION ═══ */}
          {!loading && showTrainers && filteredTrainers.length > 0 && (
            <div className="mb-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="feather-award text-success" style={{ fontSize: "20px" }} />
                <h4 className="fw-bold mb-0" style={{ color: "#0F172A", fontSize: "20px" }}>
                  Trainers
                </h4>
                <span className="badge rounded-pill" style={{ backgroundColor: "#F0FDF4", color: "#166534", fontSize: "12px", fontWeight: "700", padding: "4px 10px" }}>
                  {filteredTrainers.length}
                </span>
              </div>

              <div className="row g-3">
                {filteredTrainers.map((trainer: any, index: number) => (
                  <div className="col-lg-3 col-md-6 col-sm-12 d-flex" key={index}>
                    <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                      <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                        <Link
                          to={`/trainers/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                          style={{ display: "block", height: "100%" }}
                        >
                          <img
                            src={getCoachImage(trainer.profile_picture)}
                            alt={trainer.first_name}
                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                          />
                        </Link>
                        {/* Category Badge */}
                        <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2 }}>
                          <span className="tag tag-blue" style={{ background: "#22C55E", color: "#FFFFFF", fontWeight: "700", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                            {trainer?.trainer_type || "Trainer"}
                          </span>
                        </div>
                      </div>

                      <div className="listing-content news-content p-3 w-100 d-flex flex-column justify-content-between flex-grow-1" style={{ background: "#FFFFFF" }}>
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                            <div className="rating-wrap d-flex align-items-center gap-1">
                              <i className="fas fa-star text-warning" style={{ fontSize: "10px" }} />
                              <span style={{ fontSize: "10px", fontWeight: "700", color: "#17222D" }}>4.6</span>
                            </div>
                          </div>
                          <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                            <Link
                              to={`/trainers/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                              className="text-truncate d-block" style={{ color: "#17222D" }}
                            >
                              {trainer.first_name} {trainer.last_name || ""}
                            </Link>
                          </h3>
                          <p className="mb-2 text-truncate" style={{ fontSize: "12px", color: "#606D76" }}>
                            <i className="feather-map-pin me-1" style={{ color: "#606D76" }} />
                            {trainer.near_by_location || "Indore"}, Indore
                          </p>
                          <p className="mb-2 text-truncate" style={{ fontSize: "11px", color: "#64748B" }}>
                            {trainer?.trainer_type || "Trainer"}
                          </p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between pt-2 mt-auto" style={{ borderTop: "1px solid #E2E8E3" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700", color: "#17222D" }}>
                            ₹{trainer.price_per_hr || trainer.price || "500"} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#606D76" }}>/ hr</span>
                          </span>
                          <Link
                            to={`/trainers/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                            className="btn btn-primary btn-sm rounded-pill px-3 py-1 shadow-sm"
                            style={{ fontSize: "11px", fontWeight: "700", background: "linear-gradient(135deg, #43B649 0%, #349E3A 100%)", border: "none" }}
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchResults;
