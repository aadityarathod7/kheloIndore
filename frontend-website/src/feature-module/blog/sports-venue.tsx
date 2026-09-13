import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";
import { toCategorySlug, VENUE_CATEGORIES } from "../../constants/categories";

const categoryImageOverrides: Record<string, string> = {
  archery: "https://images.unsplash.com/photo-1712350840799-eed8c91053ce?auto=format&fit=crop&w=1000&q=85",
  badminton: "https://images.unsplash.com/photo-1775993167393-f2add1f8eec2?auto=format&fit=crop&w=1000&q=85",
  baseball: "https://images.unsplash.com/photo-1624422670211-28788f86d43f?auto=format&fit=crop&w=1000&q=85",
  basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85",
  bowling: "https://images.unsplash.com/photo-1541000778043-8fba815a9484?auto=format&fit=crop&w=1000&q=85",
  boxing: "https://images.unsplash.com/photo-1602457471243-7f43e539097f?auto=format&fit=crop&w=1000&q=85",
  chess: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=1000&q=85",
  cricket: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1000&q=85",
  dance: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1000&q=85",
  football: "https://images.unsplash.com/photo-1606470542032-a9caa0be6e97?auto=format&fit=crop&w=1000&q=85",
  golf: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1000&q=85",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85",
  hockey: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1000&q=85",
  karate: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=85",
  skating: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1000&q=85",
  tennis: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=85",
  turf: "https://images.unsplash.com/photo-1606470542032-a9caa0be6e97?auto=format&fit=crop&w=1000&q=85",
  volleyball: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1000&q=85",
  swimming: "https://images.unsplash.com/photo-1560090963-4fde545b73de?auto=format&fit=crop&w=1000&q=85",
  yoga: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1000&q=85",
  "go-kart": "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1000&q=85",
  horse: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1000&q=85",
  kabaddi: "https://images.unsplash.com/photo-1595210382266-2d0077c1f541?auto=format&fit=crop&w=1000&q=85",
  martial: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=85",
  pickleball: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=85",
  playstation: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=85",
  pool: "https://images.unsplash.com/photo-1560090963-4fde545b73de?auto=format&fit=crop&w=1000&q=85",
  "rock climbing": "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=85",
  shooting: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?auto=format&fit=crop&w=1000&q=85",
  snooker: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1000&q=85",
  squash: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1000&q=85",
  taekwondo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=1000&q=85",
  "table tennis": "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1000&q=85",
  zumba: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1000&q=85",
};

const getCategoryImage = (imgStr?: string, categoryName = "") => {
  const name = categoryName.toLowerCase().trim();
  const matchingOverride = Object.entries(categoryImageOverrides).find(([keyword]) => name.includes(keyword));
  if (matchingOverride) return matchingOverride[1];
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
  const [categories, setCategories] = useState<any[]>([]);
  const [venues, setVenues] = useState<Venues[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAlphabet, setSelectedAlphabet] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sports Venues - Categories";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const venueRes = await axios.get(`${API_URL}/web/venue/getVenue`);

        const venuesData = venueRes.data.venue || [];
        const mappedVenues = venuesData.map((venues: any) => ({
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
        setVenues(mappedVenues);

        setCategories(VENUE_CATEGORIES.map((name) => ({
          id: toCategorySlug(name),
          name,
          slug: toCategorySlug(name),
          image: getCategoryImage(undefined, name),
        })));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const normaliseCategory = (value: unknown) => String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  const isValidCategory = (value: string) => Boolean(value) && !["-", "n/a", "na", "none", "null", "undefined", "other"].includes(value);

  const categoryAliases: Record<string, string[]> = {
    "basketball stadium": ["basketball stadium", "basketball court", "basketball complex", "outdoor basketball court"],
    "chess club": ["chess", "chess club"],
    "cricket grounds": ["cricket", "cricket ground", "cricket grounds"],
    "turf": ["turf", "cricket", "cricket ground", "cricket grounds", "cricket turf", "cricket turfs"],
    "dance studio": ["dance", "dance studio", "dance and fitness hub", "dance and fitness studio"],
    "gym": ["gym", "prominent gym", "fitness center", "fitness centers", "fitness centre", "fitness complex", "fitness hub", "fitness studio", "wellness center"],
    "pickleball": ["pickleball", "pickle ball"],
    "swiming academy": ["swiming academy", "swimming academy", "swimming centre", "swimming club", "swimming pool", "premier swimming and aquatic training academy"],
    "tennis court": ["tennis court", "tennis courts"],
    "turf": ["turf"],
  };

  const classifyVenues = (venuesList: Venues[]) => {
    const counts: Record<string, number> = Object.fromEntries(categories.map((category) => [category.id, 0]));

    venuesList.forEach((venue) => {
      const venueCategories = String(venue.category || "")
        .split(/[,|/]+/)
        .map(normaliseCategory)
        .filter(isValidCategory);
      const venueType = normaliseCategory(venue.vendor_type);

      categories.forEach((category) => {
        const categoryName = normaliseCategory(category.name);
        const acceptedValues = categoryAliases[categoryName] || [categoryName];
        const valuesToCheck = categoryName === "turf" ? [venueType] : venueCategories;
        if (valuesToCheck.some((value) => acceptedValues.includes(value))) {
          counts[category.id] += 1;
        }
      });
    });

    return counts;
  };
  const categoryCounts = classifyVenues(venues);

  const alphabetLetters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const filteredCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((cat) => selectedAlphabet === "All" || cat.name.toUpperCase().startsWith(selectedAlphabet))
    .sort((first, second) => first.name.localeCompare(second.name));

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Hero Section */}
          <div className="hero-booking-section standard-page-hero" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
            <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "58%", backgroundImage: "url('/assets/img/bg/sports-venue-hero.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 66%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 66%, rgba(0,0,0,0) 100%)", opacity: 0.88 }}></div>
            
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className="row align-items-center">
                <div className="col-lg-7 text-start">
                  <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
                  <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                    Sports <span style={{ color: "#22C55E", marginLeft: "12px" }}>Venues</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select a sport category to view listings and book your slot</p>
                  <div className="d-inline-flex align-items-center rounded-pill px-3 py-2 mb-4" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", color: "#166534", fontSize: "14px", fontWeight: "700" }}>
                    <i className="feather-map-pin me-2" aria-hidden="true" />
                    {venues.length} {venues.length === 1 ? "venue listing" : "venue listings"}
                  </div>
                  
                  {/* Category Search Input */}
                  <div className="mb-4 position-relative" style={{ maxWidth: "480px" }}>
                    <input
                      type="text"
                      className="form-control rounded-pill border-0 shadow px-4 py-3"
                      placeholder="Search venues (e.g. Cricket, Football)"
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
                    <span style={{ color: "#22C55E", fontWeight: "600" }}>Sports Venues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid Content */}
          <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "24px 0 60px 0" }}>
            <div className="container">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-4" aria-label="Filter venue categories by alphabet">
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3"
                  onClick={() => setSelectedAlphabet("All")}
                  style={{ background: selectedAlphabet === "All" ? "#16A34A" : "#FFFFFF", border: "1px solid #BBF7D0", color: selectedAlphabet === "All" ? "#FFFFFF" : "#166534", fontWeight: "700", minWidth: "48px" }}
                >
                  All
                </button>
                {alphabetLetters.map((letter) => {
                  const hasCategory = categories.some((category) => category.name.toUpperCase().startsWith(letter));
                  const isSelected = selectedAlphabet === letter;
                  return (
                    <button
                      type="button"
                      key={letter}
                      className="btn btn-sm rounded-circle p-0"
                      onClick={() => hasCategory && setSelectedAlphabet(letter)}
                      disabled={!hasCategory}
                      aria-pressed={isSelected}
                      style={{ width: "34px", height: "34px", background: isSelected ? "#16A34A" : "#FFFFFF", border: "1px solid #BBF7D0", color: isSelected ? "#FFFFFF" : hasCategory ? "#166534" : "#CBD5E1", fontWeight: "700", cursor: hasCategory ? "pointer" : "not-allowed", opacity: hasCategory ? 1 : 0.65 }}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
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
                            backgroundImage: `url(${getCategoryImage(cat.image, cat.name)})`,
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
                            {facilityCount} {facilityCount === 1 ? "venue" : "venues"}
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

export default BlogListSidebarLeft;
