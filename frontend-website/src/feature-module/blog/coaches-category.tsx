import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";

const cleanCategoryName = (name) => {
  const lower = name.toLowerCase().trim();
  if (lower === "cricket grounds") return "Cricket";
  if (lower === "tennis court") return "Tennis";
  if (lower === "basketball stadium") return "Basketball";
  if (lower === "volleyball") return "Volleyball";
  if (lower === "football") return "Football";
  if (lower === "pool club") return "Pool";
  if (lower === "archery club") return "Archery";
  if (lower === "swiming academy" || lower === "swimming academy") return "Swimming";
  if (lower === "gym") return "Fitness";
  // Capitalize first letter of each word as fallback
  return name.replace(/\b\w/g, c => c.toUpperCase());
};

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

const getCategoryImage = (imgStr?: string, categoryName = "") => {
  const name = categoryName.toLowerCase().trim();
  if (!imgStr || imgStr.includes("photo-1517649763962-0c623266010b")) {
    if (name.includes("karate")) {
      return "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop";
    }
    if (name.includes("taekwon") || name.includes("martial")) {
      return "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=800&auto=format&fit=crop";
    }
    if (name.includes("archery")) {
      return "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&auto=format&fit=crop&q=80";
    }
    if (name.includes("playstation") || name.includes("gaming") || name.includes("game")) {
      return "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop";
    }
    if (name.includes("pool") || name.includes("billiards")) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80";
    }
    if (name.includes("climbing") || name.includes("rock")) {
      return "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop";
  }
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  const cleanStr = imgStr.startsWith("/") ? imgStr.substring(1) : imgStr;
  return `${IMG_URL}/${cleanStr}`;
};

interface Coach {
  category: string;
  trainer_type: string;
  specializations: any;
}

const CoachesCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Coaches - Categories";
  }, []);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coachesRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/web/fetch-all-coaches`),
          axios.get(`${API_URL}/category/fetch`)
        ]);

        const coachData = coachesRes.data.data || [];
        const mappedCoaches = coachData.map((c: any) => ({
          category: c.category || "",
          trainer_type: c.trainer_type || "",
          specializations: c.specializations || "",
        }));
        setCoaches(mappedCoaches);

        const dbCategories = catRes.data.categories || [];
        const mappedCategories = dbCategories.map((c: any) => {
          const cleanedName = cleanCategoryName(c.category_name);
          return {
            id: c._id,
            name: cleanedName,
            slug: slugify(cleanedName),
            image: getCategoryImage(c.images && c.images[0], c.category_name)
          };
        });
        setCategories(mappedCategories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const classifyCoaches = (coachesList: Coach[]) => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = 0;
    });

    coachesList.forEach((c) => {
      categories.forEach((catObj) => {
        if (matchCategory(c.category, c.trainer_type, c.specializations, catObj.name)) {
          counts[catObj.id]++;
        }
      });
    });

    return counts;
  };

  const categoryCounts = classifyCoaches(coaches);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    <span style={{ color: "#22C55E" }}>Coaches</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select a sport category to view listings and book your coach</p>
                  
                  {/* Category Search Input */}
                  <div className="mb-4 position-relative" style={{ maxWidth: "480px" }}>
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow px-4 py-3"
                      placeholder="Search coaches (e.g. Football, Cricket)"
                      style={{ fontSize: "15px", paddingRight: "50px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="feather-search position-absolute end-0 top-50 translate-middle-y me-4" style={{ color: "#22C55E", fontSize: "18px" }} />
                  </div>

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
                {filteredCategories.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="mb-3">
                      <i className="feather-search" style={{ fontSize: "48px", color: "#94A3B8" }} />
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#334155" }}>No Categories Found</h3>
                    <p style={{ color: "#64748B" }}>{"We couldn't find any categories matching \"" + searchQuery + "\""}</p>
                  </div>
                ) : (
                  filteredCategories.map((cat) => {
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
                        <div className="position-absolute top-0 start-0 m-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, ...getCategoryStyle(cat.name) }}><i className={getCategoryIcon(cat.name)} style={{ fontSize: 20 }} /></div>
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
                }))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoachesCategory;
