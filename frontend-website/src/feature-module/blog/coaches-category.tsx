import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../ApiUrl";
import Loader from "../loader/loader";

interface Coach {
  category: string;
  trainer_type: string;
  specializations: any;
}

const CoachesCategory = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Coaches - Categories";
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((c: any) => ({
          category: c.category || "",
          trainer_type: c.trainer_type || "",
          specializations: c.specializations || "",
        }));
        setCoaches(mappedData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const classifyCoaches = (coachesList: Coach[]) => {
    const counts = {
      cricket: 0,
      badminton: 0,
      swimming: 0,
      football: 0,
      pickleball: 0,
      tennis: 0,
      basketball: 0,
      "table-tennis": 0,
      "other-sports": 0,
    };

    coachesList.forEach((c) => {
      const cat = (c.category || "").toLowerCase().replace(/_/g, " ").trim();
      const trainerType = (c.trainer_type || "").toLowerCase().replace(/_/g, " ").trim();
      const spec = Array.isArray(c.specializations)
        ? c.specializations.join(" ").toLowerCase()
        : String(c.specializations || "").toLowerCase();

      const isCricket = cat.includes("cricket") || trainerType.includes("cricket") || spec.includes("cricket") || cat.includes("turf") || trainerType.includes("turf");
      const isBadminton = cat.includes("badminton") || trainerType.includes("badminton") || spec.includes("badminton");
      const isSwimming = cat.includes("swim") || trainerType.includes("swim") || spec.includes("swim");
      const isFootball = cat.includes("football") || trainerType.includes("football") || spec.includes("football");
      const isPickleball = cat.includes("pickle") || trainerType.includes("pickle") || spec.includes("pickle");
      const isTennis = (cat.includes("tennis") || trainerType.includes("tennis") || spec.includes("tennis")) && !cat.includes("table") && !trainerType.includes("table") && !spec.includes("table");
      const isBasketball = cat.includes("basketball") || trainerType.includes("basketball") || spec.includes("basketball");
      const isTableTennis = cat.includes("table tennis") || trainerType.includes("table tennis") || spec.includes("table tennis");

      if (isCricket) {
        counts.cricket++;
      } else if (isBadminton) {
        counts.badminton++;
      } else if (isSwimming) {
        counts.swimming++;
      } else if (isFootball) {
        counts.football++;
      } else if (isPickleball) {
        counts.pickleball++;
      } else if (isTennis) {
        counts.tennis++;
      } else if (isBasketball) {
        counts.basketball++;
      } else if (isTableTennis) {
        counts["table-tennis"]++;
      } else {
        counts["other-sports"]++;
      }
    });

    return counts;
  };

  const categoryCounts = classifyCoaches(coaches);

  const categories = [
    {
      id: "cricket",
      name: "cricket",
      slug: "cricket",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "badminton",
      name: "badminton",
      slug: "badminton",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "other-sports",
      name: "other-sports",
      slug: "other-sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "swimming",
      name: "swimming",
      slug: "swimming",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "football",
      name: "football",
      slug: "football",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "pickleball",
      name: "pickleball",
      slug: "pickleball",
      image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "tennis",
      name: "tennis",
      slug: "tennis",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "basketball",
      name: "basketball",
      slug: "basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "table-tennis",
      name: "table-tennis",
      slug: "table-tennis",
      image: "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
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
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select a sport category to view listings and book your coach</p>
                  
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

          {/* Categories Grid Content */}
          <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "24px 0 60px 0" }}>
            <div className="container">
              <div className="row g-4">
                {categories.map((cat) => {
                  const coachCount = categoryCounts[cat.id as keyof typeof categoryCounts] || 0;
                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={cat.id}>
                      <Link 
                        to={`/coaches/category/${cat.slug}`}
                        className="ki-category-card" 
                        onMouseEnter={(e) => {
                          const img = e.currentTarget.querySelector(".category-img") as HTMLElement;
                          if (img) img.style.transform = "scale(1.06)";
                        }}
                        onMouseLeave={(e) => {
                          const img = e.currentTarget.querySelector(".category-img") as HTMLElement;
                          if (img) img.style.transform = "scale(1)";
                        }}
                      >
                        {/* Background Image */}
                        <div 
                          className="category-img position-absolute"
                          style={{
                            backgroundImage: `url(${cat.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transition: "transform 0.4s ease",
                            inset: 0
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div 
                          className="position-absolute" 
                          style={{
                            background: "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.1) 100%)",
                            inset: 0
                          }}
                        />
                        
                        {/* Category Info */}
                        <div className="position-absolute bottom-0 start-0 p-4 text-start">
                          <h3 className="ki-category-title">
                            {cat.name}
                          </h3>
                          <span className="ki-category-count">
                            {coachCount} {coachCount === 1 ? "coach" : "coaches"}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoachesCategory;
