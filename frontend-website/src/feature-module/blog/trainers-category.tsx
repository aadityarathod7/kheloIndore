import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";

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

interface Trainer {
  category: string;
  trainer_type: string;
  specializations: any;
}

const TrainersCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Trainers - Categories";
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
        const [trainersRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/web/PersonalTraining/fetchAll`),
          axios.get(`${API_URL}/category/fetch`)
        ]);

        const trainerData = trainersRes.data.data || [];
        const mappedTrainers = trainerData.map((t: any) => ({
          category: t.category || "",
          trainer_type: t.trainer_type || "",
          specializations: t.specializations || "",
        }));
        setTrainers(mappedTrainers);

        const dbCategories = catRes.data.categories || [];
        const mappedCategories = dbCategories.map((c: any) => ({
          id: c._id,
          name: c.category_name,
          slug: slugify(c.category_name),
          image: getCategoryImage(c.images && c.images[0], c.category_name)
        }));
        setCategories(mappedCategories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const classifyTrainers = (trainersList: Trainer[]) => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = 0;
    });

    trainersList.forEach((t) => {
      const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
      const trainerType = (t.trainer_type || "").toLowerCase().replace(/_/g, " ").trim();
      const spec = Array.isArray(t.specializations)
        ? t.specializations.join(" ").toLowerCase()
        : String(t.specializations || "").toLowerCase();

      const matched = categories.find((catObj) => {
        const cName = catObj.name.toLowerCase().trim();
        const validCat = cat.length >= 3 && cat !== "other" && cat !== "-";
        const validTrainerType = trainerType.length >= 3 && trainerType !== "other" && trainerType !== "-";
        return (
          (validCat && cat.includes(cName)) ||
          (validTrainerType && trainerType.includes(cName)) ||
          (validCat && cName.includes(cat)) ||
          (validTrainerType && cName.includes(trainerType)) ||
          spec.includes(cName)
        );
      });

      if (matched) {
        counts[matched.id]++;
      }
    });

    return counts;
  };

  const categoryCounts = classifyTrainers(trainers);

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
                    <span style={{ color: "#22C55E" }}>Trainers</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select a sport category to view listings and book your trainer</p>
                  
                  {/* Category Search Input */}
                  <div className="mb-4 position-relative" style={{ maxWidth: "480px" }}>
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow px-4 py-3"
                      placeholder="Search trainers categories (e.g. Yoga, Taekwondo, Fitness...)"
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
                    <span style={{ color: "#22C55E", fontWeight: "600" }}>Trainers</span>
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
                  const trainerCount = categoryCounts[cat.id as keyof typeof categoryCounts] || 0;
                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={cat.id}>
                      <Link 
                        to={`/trainers/category/${cat.slug}`}
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
                            {trainerCount} {trainerCount === 1 ? "trainer" : "trainers"}
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

export default TrainersCategory;
