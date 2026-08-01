import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../ApiUrl";
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

const BlogListSidebarLeft = () => {
  const [venues, setVenues] = useState<Venues[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sports Venues - Categories";
  }, []);

  useEffect(() => {
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
          google_location: venues.google_location,
          description: venues.description || "",
        }));
        setVenues(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const classifyVenues = (venuesList: Venues[]) => {
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

    venuesList.forEach((v) => {
      const vt = (v.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
      const cat = (v.category || "").toLowerCase().replace(/_/g, " ").trim();
      const name = (v.name || "").toLowerCase();
      const desc = (v.description || "").toLowerCase();

      const isCricket = vt.includes("cricket") || cat.includes("cricket") || name.includes("cricket") || desc.includes("cricket") || vt.includes("turf") || cat.includes("turf");
      const isBadminton = vt.includes("badminton") || cat.includes("badminton") || name.includes("badminton");
      const isSwimming = vt.includes("swim") || cat.includes("swim") || name.includes("swim");
      const isFootball = vt.includes("football") || cat.includes("football") || name.includes("football");
      const isPickleball = vt.includes("pickle") || cat.includes("pickle") || name.includes("pickle");
      const isTennis = (vt.includes("tennis") || cat.includes("tennis") || name.includes("tennis")) && !vt.includes("table") && !cat.includes("table") && !name.includes("table");
      const isBasketball = vt.includes("basketball") || cat.includes("basketball") || name.includes("basketball");
      const isTableTennis = vt.includes("table tennis") || cat.includes("table tennis") || name.includes("table tennis");

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

  const categoryCounts = classifyVenues(venues);

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
                    Sports <span style={{ color: "#22C55E", marginLeft: "12px" }}>Venues</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select a sport category to view listings and book your slot</p>
                  
                  {/* Breadcrumb pill */}
                  <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                    <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                    <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                    <span style={{ color: "#22C55E", fontWeight: "600" }}>Sports Venues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid Content */}
          <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "60px 0" }}>
            <div className="container">
              <div className="row g-4">
                {categories.map((cat) => {
                  const facilityCount = categoryCounts[cat.id] || 0;
                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={cat.id}>
                      <Link 
                        to={`/sports-venue/${cat.slug}`}
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
                            {facilityCount} {facilityCount === 1 ? "facility" : "facilities"}
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

export default BlogListSidebarLeft;
