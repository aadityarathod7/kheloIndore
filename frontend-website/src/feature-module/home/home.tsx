import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CountUp from "react-countup";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

interface Coach {
  first_name: string;
  last_name: string;
  _id: number;
  price: number;
  profile_picture: any;
  src: string;
  near_by_location: string;
  category: string;
  trainer_type: string;
  experience?: number;
  rating?: number;
  reviews_count?: number;
  package?: {
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  };
}

interface Trainer {
  last_name: string;
  first_name: string;
  duration: string;
  focus_area: string;
  price: number;
  _id: number;
  profile_picture: any;
  src: string;
  category: string;
  near_by_location: string;
  specializations: string;
  trainer_type: string;
  experience?: number;
  rating?: number;
  reviews_count?: number;
  package?: {
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  };
}

interface Venues {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  activities: string;
  category: string;
  _id: string;
  images: any;
  src: string;
  vendor_type: string;
  near_by_location: string;
  price_per_hr?: number;
  size?: string;
  venue_size?: string;
  rating?: number;
  reviews_count?: number;
  data?: Record<string, unknown>;
}

interface ApiCategory {
  _id: string;
  category_name: string;
  status?: boolean;
}

interface CategoryCard {
  name: string;
  slug: string;
  count: number;
  icon: string;
  color: string;
  bg: string;
}

type CategoryProviderTab = "venue" | "coach" | "trainer";

const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "/assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "/assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
};

const getCategoryIcon = (category: string) => {
  const cat = String(category || "").toLowerCase();
  if (cat.includes("swim")) return "fas fa-swimmer";
  if (cat.includes("tennis")) return "fas fa-table-tennis";
  if (cat.includes("cricket")) return "fas fa-baseball-ball";
  if (cat.includes("football") || cat.includes("soccer")) return "fas fa-soccer-ball";
  if (cat.includes("badminton")) return "fas fa-table-tennis";
  if (cat.includes("gym") || cat.includes("fitness")) return "fas fa-dumbbell";
  return "fas fa-running";
};

const categoryStyle = (category: string) => {
  const name = category.toLowerCase();
  if (name.includes("swim")) return { color: "#0891B2", bg: "#CFFAFE" };
  if (name.includes("tennis")) return { color: "#7C3AED", bg: "#EDE9FE" };
  if (name.includes("badminton")) return { color: "#2563EB", bg: "#DBEAFE" };
  if (name.includes("basket")) return { color: "#DC2626", bg: "#FEE2E2" };
  if (name.includes("football") || name.includes("soccer")) return { color: "#059669", bg: "#D1FAE5" };
  return { color: "#16A34A", bg: "#DCFCE7" };
};

const normaliseCategory = (value: string) => value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const isUsableCategory = (value: unknown) => {
  const category = String(value || "").trim();
  return Boolean(category) && !["-", "n/a", "na", "none", "null", "undefined"].includes(category.toLowerCase());
};

const formatLocation = (loc: string) => {
  if (!loc) return "Indore";
  const cleaned = loc.trim();
  if (cleaned.toLowerCase().includes("indore")) return cleaned;
  return `${cleaned}, Indore`;
};

const getArea = (location: string) => location?.split(",")[0]?.trim() || "Indore";

const getProfileImage = (profilePicture: any): string => {
  const first = Array.isArray(profilePicture) ? profilePicture[0] : profilePicture;
  const imagePath = typeof first === "string" ? first : first?.src || first?.url || "";
  if (!imagePath) return "/assets/img/no-img.png";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  return `${IMG_URL}${imagePath}`;
};

const getVenueSize = (venue: Venues): string | null => {
  const data = venue.data as Record<string, any> | undefined;
  const vendorData = Array.isArray(data?.vendor_data)
    ? Object.fromEntries(data.vendor_data.map((item: any) => [item?.key, item?.value]))
    : {};
  const formatFeet = (value: unknown, suffix = "ft") => {
    if (typeof value !== "string" && typeof value !== "number") return "";
    const text = String(value).trim();
    if (!text) return "";
    return /\b(ft|feet|sq\.?\s*ft)\b/i.test(text) ? text : `${text} ${suffix}`;
  };
  const sportSize = venue.sports_details?.find((detail) => detail?.size?.trim())?.size;
  const values = [
    formatFeet(data?.total_area_in_sq_feet, "sq. ft."),
    formatFeet(vendorData.total_area_in_sq_feet, "sq. ft."),
    formatFeet(data?.dimension),
    formatFeet(vendorData.dimension),
    formatFeet(data?.field_dimensions),
    formatFeet(vendorData.field_dimensions),
    formatFeet(data?.rink_dimensions),
    formatFeet(vendorData.rink_dimensions),
    formatFeet(data?.court_size),
    formatFeet(vendorData.court_size),
    sportSize,
    venue.size,
    venue.venue_size,
    data?.size,
    data?.venue_size,
    vendorData.size,
  ];

  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .find((value) => Boolean(value) && !/^\d+[a-z]+\d+$/i.test(value)) || null;
};
type ProviderKind = "Venue" | "Coach" | "Trainer";

const SingleProviderCard = ({ kind, provider }: { kind: ProviderKind; provider: Venues | Coach | Trainer }) => {
  const isVenue = kind === "Venue";
  const venue = provider as Venues;
  const person = provider as Coach | Trainer;
  const name = isVenue ? venue.name : `${person.first_name || ""} ${person.last_name || ""}`.trim();
  const category = isVenue ? venue.vendor_type : person.category || person.trainer_type || kind;
  const image = isVenue
    ? getVenueImage(venue.images)
    : getProfileImage(person.profile_picture);
  const link = isVenue
    ? `/sports-venue/${(venue.vendor_type || "venue").replace(/\s+/g, "-").toLowerCase()}/${name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`
    : kind === "Coach"
      ? `/coaches/${(person.category || "coach").replace(/\s+/g, "-").toLowerCase()}/${(person.first_name || "coach").replace(/\s+/g, "-").toLowerCase()}/${person._id}`
      : `/trainers/trainer/${(person.first_name || "trainer").replace(/\s+/g, "-").toLowerCase()}/${person._id}`;
  const rate = isVenue ? venue.price_per_hr : person.price || person.package?.monthly;
  const area = getArea(isVenue ? venue.near_by_location : person.near_by_location);
  const rating = isVenue ? venue.rating : person.rating;
  const reviewCount = isVenue ? venue.reviews_count : person.reviews_count;
  const venueSize = isVenue ? getVenueSize(venue) : null;

  return (
    <article className={`listing-item home-venue border-white-10 top-provider-card top-provider-card--${kind.toLowerCase()}`} style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(15, 34, 45, 0.08)", margin: "4px" }}>
      <div className="listing-img" style={{ height: "165px", position: "relative", overflow: "hidden" }}>
        <Link to={link}>
          <img src={image} className="img-fluid" alt={name} onError={(event) => { event.currentTarget.src = "/assets/img/no-img.png"; }} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
        </Link>
        <span className="tag tag-blue" style={{ position: "absolute", top: "12px", left: "12px", padding: "6px 10px", background: "#22C55E", color: "#fff", fontWeight: 700, borderRadius: "9px", fontSize: "11px" }}>
          {kind === "Venue" ? category : `${category} ${kind}`}
        </span>
      </div>
      <div className="listing-content" style={{ textAlign: "left", padding: "18px 20px" }}>
        <div className="d-flex align-items-center justify-content-between mb-2" style={{ color: "#64748B", fontSize: "13px", minHeight: "20px" }}>
          <span>
            <i className="fas fa-star me-1" style={{ color: rating && rating > 0 ? "#F59E0B" : "#0F172A" }} />
            {rating && rating > 0 ? `${rating.toFixed(1)}${reviewCount ? ` (${reviewCount})` : ""}` : isVenue ? "New" : "New provider"}
          </span>
          {isVenue && venueSize && <span><i className="feather-grid me-1" />{venueSize}</span>}
        </div>
        <h3 className="listing-title text-truncate mb-2" style={{ fontSize: "18px", fontWeight: 700 }}><Link to={link}>{name}</Link></h3>
        <p className="mb-3 text-truncate" style={{ color: "#64748B", fontSize: "14px" }}><i className="feather-map-pin me-2" />{area}</p>
        <div className="d-flex align-items-end justify-content-between pt-2" style={{ borderTop: "1px solid #EEF2F0" }}>
          <div><small style={{ color: "#64748B" }}>{isVenue ? "Hourly Rate" : "Starts from"}</small><div style={{ fontSize: "22px", fontWeight: 800 }}>{rate ? `₹${rate}` : "Contact us"}{rate && <small style={{ fontSize: "13px", fontWeight: 400 }}>/{isVenue ? "hr" : "month"}</small>}</div></div>
          <Link to={link} className="d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#22C55E", color: "#fff" }}><i className="fas fa-chevron-right" /></Link>
        </div>
      </div>
    </article>
  );
};

const TopProviderCard = ({ kind, providers }: { kind: ProviderKind; providers: (Venues | Coach | Trainer)[] }) => {
  const viewAllLink = kind === "Venue" ? "/sports-venue" : kind === "Coach" ? "/coaches" : "/trainers";

  const columnSliderSettings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    dotsClass: "ki-vertical-dots",
    customPaging: () => (
      <div className="vertical-dot-inner" />
    )
  };

  return (
    <div className="col-lg-4 col-md-6">
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "12px" }}>
        <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0F172A", fontWeight: 700, fontSize: "22px", margin: 0 }}>
          Top Rated <span style={{ color: "#22C55E" }}>{kind}</span>
        </h3>
        <Link to={viewAllLink} style={{ color: "#16A34A", fontSize: "13px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          View all <i className="fas fa-arrow-right ms-1" />
        </Link>
      </div>
      {providers && providers.length > 0 ? (
        <div className="ki-vertical-provider-slider">
          <Slider {...columnSliderSettings}>
            {providers.map((item) => (
              <div key={item._id} style={{ outline: "none" }}>
                <SingleProviderCard kind={kind} provider={item} />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center py-4 text-muted" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "20px" }}>
          No {kind.toLowerCase()}s available
        </div>
      )}
    </div>
  );
};

interface Goto {
  name: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

const Home = () => {
  const routes = all_routes;
  const [selectedTimeframe, setSelectedTimeframe] = useState<Goto>();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [venues, setVenues] = useState<Venues[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [activeTopRatedTab, setActiveTopRatedTab] = useState("venues");
  const [topProviderIndex, setTopProviderIndex] = useState(0);
  const [selectedLocationSort, setSelectedLocationSort] = useState<{ name: string } | null>(null);
  const [selectedSport, setSelectedSport] = useState<{ name: string } | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categoryProviderTab, setCategoryProviderTab] = useState<CategoryProviderTab>("venue");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    const rotation = window.setInterval(() => setTopProviderIndex((current) => current + 1), 3000);
    return () => window.clearInterval(rotation);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Keep one provider section on screen and rotate the same three-card area.
  useEffect(() => {
    const providerTypes = ["venues", "coaches", "trainers"];
    const rotation = window.setInterval(() => {
      setActiveTopRatedTab((current) => {
        const currentIndex = providerTypes.indexOf(current);
        return providerTypes[(currentIndex + 1) % providerTypes.length];
      });
    }, 5000);

    return () => window.clearInterval(rotation);
  }, []);

  useEffect(() => {
    // Never trigger the browser prompt automatically. Location is used only
    // after the visitor has already granted permission.
    if (!("geolocation" in navigator) || !("permissions" in navigator)) return;

    navigator.permissions.query({ name: "geolocation" }).then((permission) => {
      if (permission.state !== "granted") return;

      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }).catch(() => {
      // Some browsers do not expose geolocation permission state. In that
      // case, leave location unset instead of showing a disruptive prompt.
    });
  }, []);

  const timeframeOptions = [
    { name: "Sports Venue" },
    { name: "Coaches" },
    { name: "Trainer" },
  ];
  const categoryOptions = [
    { name: "Sports Venue" },
    { name: "Coaches" },
    { name: "Trainer" },
  ];
  const [sortOptions, setSortOptions] = useState<{ name: string }[]>([
    { name: "Vijay Nagar" },
    { name: "Palasia" },
    { name: "Rajendra Nagar" },
    { name: "Navlakha" },
    { name: "MG Road" },
    { name: "Bengali Square" },
    { name: "Kanadia Road" },
    { name: "Mahalaxmi Nagar" },
    { name: "LIG Square" },
    { name: "Bhawarkuan" },
    { name: "Khajrana Square" },
    { name: "Nipania" },
    { name: "Rau" },
    { name: "Tejaji Nagar" },
    { name: "Palda" },
    { name: "Limbodi" },
    { name: "Silicon City" },
    { name: "Tillor Khurd" },
    { name: "Singapore Township" },
    { name: "Super Corridor" },
    { name: "Musakhedi" },
    { name: "Airport Road" },
    { name: "MR 10" },
    { name: "Dewas Naka" },
  ]);

  const [sportsOptions, setSportsOptions] = useState<{ name: string }[]>([
    { name: "Cricket" },
    { name: "Football" },
    { name: "Badminton" },
    { name: "Tennis" },
    { name: "Swimming" },
    { name: "Basketball" },
    { name: "Volleyball" },
    { name: "Gym & Fitness" },
    { name: "Table Tennis" },
  ]);

  useEffect(() => {
    const cleanLocation = (loc: string): string => {
      if (!loc) return "";
      const cleaned = loc.trim()
        .replace(/,\s*Indore/gi, "")
        .replace(/,\s*Ind/gi, "")
        .replace(/\s+/g, " ");

      // Capitalize words
      return cleaned.split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    const locationsSet = new Set<string>();
    const sportsSet = new Set<string>();

    // Collect from venues
    venues.forEach(v => {
      if (v.near_by_location) {
        locationsSet.add(cleanLocation(v.near_by_location));
      }
      if (v.category) {
        sportsSet.add(v.category.trim());
      }
    });

    // Collect from coaches
    coaches.forEach(c => {
      if (c.near_by_location) {
        locationsSet.add(cleanLocation(c.near_by_location));
      }
      if (c.category) {
        sportsSet.add(c.category.trim());
      }
    });

    // Collect from trainers
    trainer.forEach(t => {
      if (t.near_by_location) {
        locationsSet.add(cleanLocation(t.near_by_location));
      }
      if (t.category) {
        sportsSet.add(t.category.trim());
      }
    });

    // Filter, sort, and map locations
    const uniqueSorted = Array.from(locationsSet)
      .filter(loc => loc.length > 0 && loc.toLowerCase() !== "indore") // omit general 'Indore'
      .sort()
      .map(loc => ({ name: loc }));

    if (uniqueSorted.length > 0) {
      setSortOptions(uniqueSorted);
    }

    // Filter, sort, and map sports
    const uniqueSports = Array.from(sportsSet)
      .map(sport => {
        const cleaned = sport.trim();
        // Skip invalid characters, hyphens, and empty entries
        if (cleaned === "-" || cleaned === "_" || cleaned.length < 2) return null;

        // Capitalize each word (Title Case)
        let formatted = cleaned.split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");

        // Fix common spelling errors
        if (formatted.toLowerCase() === "swiming") formatted = "Swimming";

        return { name: formatted };
      })
      .filter((s): s is { name: string } => s !== null);

    // Deduplicate
    const uniqueSportsMap = new Map();
    uniqueSports.forEach(s => {
      uniqueSportsMap.set(s.name.toLowerCase(), s);
    });

    const finalSports = Array.from(uniqueSportsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));

    if (finalSports.length > 0) {
      setSportsOptions(finalSports);
    }
  }, [venues, coaches, trainer]);

  const popularSearches = useMemo(() => {
    const selectedCategory = selectedTimeframe?.name || "Sports Venue";
    const entries = selectedCategory === "Coaches"
      ? coaches
      : selectedCategory === "Trainer"
        ? trainer
        : venues;
    const popularity = new Map<string, number>();

    entries.forEach((entry) => {
      const category = String(entry.category || "").trim();
      if (!category) return;

      category.split(/[,|/]+/).forEach((value) => {
        const name = value.replace(/[-_]/g, " ").trim();
        if (!name) return;
        popularity.set(name, (popularity.get(name) || 0) + 1);
      });
    });

    const emojiByCategory: Record<string, string> = {
      cricket: "🏏", football: "⚽", badminton: "🏸", tennis: "🎾",
      basketball: "🏀", swimming: "🏊", volleyball: "🏐", yoga: "🧘",
      fitness: "💪", gym: "🏋️", cycling: "🚴", running: "🏃",
    };
    const getEmoji = (name: string) => {
      const key = Object.keys(emojiByCategory).find((item) => name.toLowerCase().includes(item));
      return key ? emojiByCategory[key] : "⭐";
    };
    const fallback = selectedCategory === "Coaches"
      ? ["Fitness", "Badminton", "Football", "Cricket", "Swimming"]
      : selectedCategory === "Trainer"
        ? ["Fitness", "Weight Loss", "Yoga", "Strength Training", "Swimming"]
        : ["Cricket", "Football", "Badminton", "Tennis", "Basketball"];

    const ranked = Array.from(popularity.entries())
      .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
      .slice(0, 5)
      .map(([name]) => name);

    return (ranked.length ? ranked : fallback).map((name) => ({ name, emoji: getEmoji(name) }));
  }, [selectedTimeframe, venues, coaches, trainer]);

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000,
        },
      },
    ],
  };

  const images = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  const options = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000,
        },
      },
    ],
  };

  // Top-rated cards rotate one at a time with a vertical page-like transition.
  const verticalCardSlider = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 8000,
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  const locationOptions = [
    { value: "germany", label: "Germany" },
    { value: "russia", label: "Russia" },
    { value: "france", label: "France" },
    { value: "uk", label: "UK" },
    { value: "colombia", label: "Colombia" },
  ];

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });

    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((coach: any) => ({
          first_name: coach.first_name,
          last_name: coach.last_name,
          _id: coach._id,
          price: coach.price,
          profile_picture: coach.profile_picture,
          near_by_location: coach.near_by_location,
          category: coach.category,
          trainer_type: coach.trainer_type,
          experience: coach.experience,
          package: coach.package,
          rating: coach.rating,
          reviews_count: coach.reviews_count,
        }));
        setCoaches(mappedData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };

    fetchCoaches();

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
          vendor_type: venues.vendor_type,
          near_by_location: venues.near_by_location,
          price_per_hr: venues.price_per_hr,
          size: venues.size,
          venue_size: venues.venue_size,
          rating: venues.rating,
          reviews_count: venues.reviews_count,
          data: venues.data,
        }));
        setVenues(mappedData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };

    fetchVenues();

    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ categories?: ApiCategory[] }>(`${API_URL}/category/fetch`);
        setApiCategories((response.data.categories || []).filter((category) => category.status !== false));
      } catch {
        // Provider data below remains a live fallback when categories are unavailable.
      }
    };

    fetchCategories();
  }, []);

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
          duration: trainer.duration,
          focus_area: trainer.focus_area,
          price: trainer.price,
          _id: trainer._id,
          profile_picture: trainer.profile_picture,
          category: trainer.category,
          near_by_location: trainer.near_by_location,
          specializations: trainer.specializations,
          trainer_type: trainer.trainer_type,
          experience: trainer.experience,
          package: trainer.package,
          rating: trainer.rating,
          reviews_count: trainer.reviews_count,
        }));
        setTrainer(mappedData);
      } catch {
        // The request failure is handled by the surrounding UI state.
      }
    };

    fetchTrainer();
  }, []);

  const getResultCount = () => {
    let count = 0;
    const categoryName = selectedTimeframe?.name;
    const sportName = selectedSport?.name?.toLowerCase();
    const locationName = selectedLocationSort?.name;

    if (categoryName === "Sports Venue") {
      count = venues.filter(v => {
        const matchLocation = !locationName || v.near_by_location?.toLowerCase()?.includes(locationName.toLowerCase()) || locationName.toLowerCase()?.includes(v.near_by_location?.toLowerCase());
        const matchSport = !sportName || v.category?.toLowerCase()?.includes(sportName) || v.activities?.toLowerCase()?.includes(sportName);
        return matchLocation && matchSport;
      }).length;
    } else if (categoryName === "Coaches") {
      count = coaches.filter(c => {
        const matchLocation = !locationName || c.near_by_location?.toLowerCase()?.includes(locationName.toLowerCase()) || locationName.toLowerCase()?.includes(c.near_by_location?.toLowerCase());
        const matchSport = !sportName || c.category?.toLowerCase()?.includes(sportName);
        return matchLocation && matchSport;
      }).length;
    } else if (categoryName === "Trainer") {
      count = trainer.filter(t => {
        const matchLocation = !locationName || t.near_by_location?.toLowerCase()?.includes(locationName.toLowerCase()) || locationName.toLowerCase()?.includes(t.near_by_location?.toLowerCase());
        const matchSport = !sportName || t.category?.toLowerCase()?.includes(sportName) || t.specializations?.toLowerCase()?.includes(sportName);
        return matchLocation && matchSport;
      }).length;
    }
    return count;
  };

  const navigateToPage = (e: any) => {
    e.preventDefault();
    const count = getResultCount();

    Swal.fire({
      title: `${count} Results Found!`,
      text: `We found ${count} matching ${selectedTimeframe?.name} profiles.`,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "View Listings",
      cancelButtonText: "Cancel",
      width: "380px",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedTimeframe?.name === "Coaches") {
          navigate("/coaches", { state: { selectedLocationSort, selectedSport } });
        } else if (selectedTimeframe?.name === "Trainer") {
          navigate("/trainers", { state: { selectedLocationSort, selectedSport } });
        } else if (selectedTimeframe?.name === "Sports Venue") {
          const sportSlug = selectedSport?.name
            ? selectedSport.name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
            : "all";
          navigate(`/sports-venue/${sportSlug}`, { state: { selectedLocationSort, selectedSport } });
        }
      }
    });
  };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const visibleVenues = venues.slice(0, 6);
  const visibleCoaches = coaches.slice(0, 6);
  const visibleTrainers = trainer.slice(0, 6);


  const categoryCardsByProvider = useMemo<Record<CategoryProviderTab, CategoryCard[]>>(() => {
    const categoryGroups: Record<CategoryProviderTab, string[][]> = {
      venue: venues.map((item) => [item.category]),
      coach: coaches.map((item) => [item.category]),
      trainer: trainer.map((item) => [item.category]),
    };

    return (Object.entries(categoryGroups) as [CategoryProviderTab, string[][]][]).reduce((result, [providerType, groups]) => {
      const providerCategoryGroups = groups.map((values) => values
        .flatMap((value) => String(value || "").split(/[,|/]+/))
        .map((value) => value.trim())
        .filter(isUsableCategory));
      const liveCategoryNames = providerCategoryGroups.flat();
      const sourceNames = Array.from(new Map([
        ...apiCategories.map((category) => category.category_name),
        ...liveCategoryNames,
      ].filter(isUsableCategory).map((name) => [normaliseCategory(name), name])).values());

      result[providerType] = sourceNames
        .map((name) => {
          const key = normaliseCategory(name);
          const count = providerCategoryGroups.filter((names) => names.some((liveName) => {
            const liveKey = normaliseCategory(liveName);
            return liveKey === key;
          })).length;
          return { name, slug: key.replace(/\s+/g, "-"), count, icon: getCategoryIcon(name), ...categoryStyle(name) };
        })
        .filter((category) => providerCategoryGroups.length === 0 || category.count > 0)
        .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name));
      return result;
    }, { venue: [], coach: [], trainer: [] } as Record<CategoryProviderTab, CategoryCard[]>);
  }, [apiCategories, venues, coaches, trainer]);

  const categoryCards = categoryCardsByProvider[categoryProviderTab];

  // ─── Stats count-up trigger ───
  // countup.js's built-in scroll-spy measures element positions against the
  // initial layout, which breaks once hero images finish loading and shift the
  // page (numbers stayed at 0+ until a second scroll). An IntersectionObserver
  // tracks the live position, so the count-up fires reliably on first view.
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStatsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="hero-section" style={{ backgroundImage: "linear-gradient(rgba(229, 236, 227, 0.92), rgba(229, 236, 227, 0.92)), url('/assets/img/bg/banner.jpg')" }}>
        <div className="banner-cock-one">
          {/* <ImageWithBasePath
            src="assets/img/icons/banner-cock1.svg"
            alt="Banner"
          /> */}
        </div>
        <div className="banner-shapes">
          <div className="banner-dot-one">
            <span />
          </div>
          {/* <div className="banner-cock-two">
            <ImageWithBasePath src="assets/img/new-img10.png" alt="Banner" />
            <span />
          </div> */}
          <div className="banner-dot-two">
            <span />
          </div>
        </div>
        <div className="container">
          <div className="home-banner py-5" style={{ paddingTop: "80px" }}>
            <div className="row align-items-center w-100" style={{ marginTop: "90px" }}>
              <div className="col-lg-8 col-md-12 mx-auto">
                <div className="section-search aos" data-aos="fade-up">
                  {/* Badge */}
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="ki-badge">
                      <i className="feather-star" /> WORLD CLASS COACHES &amp; PREMIUM COURTS
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="display-heading mb-2" style={{ color: "#17222D", fontSize: "clamp(26px, 3.1vw, 42px)", fontWeight: "800", lineHeight: "1.15", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em" }}>
                    Everything You Need for <span style={{ background: "linear-gradient(90deg, #3EAF4F, #63C56B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "#42AE52", display: "inline-block", paddingBottom: "6px" }}>Sports</span> <br />
                    <span style={{ background: "linear-gradient(90deg, #3EAF4F, #63C56B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "#42AE52", display: "inline-block", paddingBottom: "6px" }}>All in One Place</span>
                  </h1>

                  {/* Description */}
                  <p className="sub-info mb-3" style={{ color: "#0F172A", lineHeight: "1.7", maxWidth: "640px" }}>
                    Book venues, connect with expert coaches, join training programs, and discover exciting sports activities near you.
                  </p>

                  {/* Features Row */}
                  <div className="d-flex align-items-center ki-feature-row gap-3 mb-3">
                    <div className="ki-feature-item d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "36px", height: "36px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-user" style={{ fontSize: "15px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "15px" }}>Expert Coaches</div>
                        <div style={{ color: "#334155", fontSize: "13px", fontWeight: "600" }}>Certified &amp; Experienced</div>
                      </div>
                    </div>

                    <div className="ki-feature-item d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "36px", height: "36px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-grid" style={{ fontSize: "15px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "15px" }}>Premium Facilities</div>
                        <div style={{ color: "#334155", fontSize: "13px", fontWeight: "600" }}>Best-in-class Venues</div>
                      </div>
                    </div>

                    <div className="ki-feature-item d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "36px", height: "36px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-trending-up" style={{ fontSize: "15px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "15px" }}>Personalized Training</div>
                        <div style={{ color: "#334155", fontSize: "13px", fontWeight: "600" }}>Tailored for You</div>
                      </div>
                    </div>
                  </div>

                  {/* Search Box Capsule */}
                  <div className="ki-search-card">
                    <form>

                      {/* Column 1: Category */}
                      <div className="search-col">
                        <div className="form-group">
                          <label>Category</label>
                          <div className="dropdown-wrapper">
                            <i className="feather-grid" />
                            <Dropdown
                              value={selectedTimeframe}
                              onChange={(e) => setSelectedTimeframe(e.value)}
                              options={timeframeOptions}
                              optionLabel="name"
                              placeholder="Select"
                              className="select custom-select-list w-100"
                              panelClassName="ki-search-dropdown-panel"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Sport */}
                      <div className="search-col">
                        <div className="form-group">
                          <label>Sport</label>
                          <div className="dropdown-wrapper">
                            <i className="feather-target" />
                            <Dropdown
                              value={selectedSport}
                              onChange={(e) => setSelectedSport(e.value)}
                              options={sportsOptions}
                              optionLabel="name"
                              filter
                              filterBy="name"
                              filterMatchMode="startsWith"
                              filterPlaceholder="Type a sport..."
                              placeholder="Select"
                              className="select custom-select-list w-100"
                              panelClassName="ki-search-dropdown-panel"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Location */}
                      <div className="search-col">
                        <div className="form-group">
                          <label>Location</label>
                          <div className="dropdown-wrapper">
                            <i className="feather-map-pin" />
                            <Dropdown
                              value={selectedLocationSort}
                              onChange={(e) => setSelectedLocationSort(e.value)}
                              options={sortOptions}
                              optionLabel="name"
                              filter
                              filterBy="name"
                              filterMatchMode="startsWith"
                              filterPlaceholder="Type an area..."
                              placeholder="Select"
                              className="select custom-select-list w-100"
                              panelClassName="ki-search-dropdown-panel"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Column 4: Search Button */}
                      <div className="search-btn-col">
                        <button
                          className="btn"
                          onClick={navigateToPage}
                          disabled={!selectedTimeframe}
                        >
                          <i className="feather-search" />
                          <span className="search-text">Search</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Popular Searches */}
                  <div className="trending-searches mt-3 d-flex align-items-center gap-2">
                    <span className="ki-popular-searches me-2">Popular Searches:</span>
                    <div className="d-inline-flex gap-2">
                      {popularSearches.map((item) => (
                        <Link
                          key={item.name}
                          className="ki-search-tag"
                          to={selectedTimeframe?.name === "Sports Venue" || !selectedTimeframe
                            ? `/sports-venue/${item.name.toLowerCase().replace(/\s+/g, "-")}`
                            : selectedTimeframe.name === "Coaches" ? "/coaches" : "/trainers"}
                          state={selectedTimeframe?.name === "Sports Venue" || !selectedTimeframe
                            ? undefined
                            : { selectedSport: { name: item.name } }}
                          aria-label={`Browse ${item.name} ${selectedTimeframe?.name || "Sports Venue"}`}
                        >
                          <span className="me-1">{item.emoji}</span>{item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 mt-4 mt-lg-0">
                <div className="banner-imgs text-center aos" data-aos="fade-up" data-aos-delay="250">
                  <div className="glowing-hero-circle">
                    <img
                      className="img-fluid"
                      src="/logo.png"
                      alt="Banner"
                    />
                    {/* Floating green leaves */}
                    <div className="floating-leaf leaf-1"><i className="fas fa-leaf" /></div>
                    <div className="floating-leaf leaf-2"><i className="fas fa-leaf" /></div>
                    <div className="floating-leaf leaf-3"><i className="fas fa-leaf" /></div>
                    <div className="floating-leaf leaf-4"><i className="fas fa-leaf" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Statistics counter bar */}
          <div className="stats-counter-bar mt-5 p-3 p-md-4 mb-4" ref={statsRef}>
            <div className="row align-items-center g-0">
              <div className="col-6 col-lg-3 ki-stat-col">
                <div className="ki-stat">
                  <div className="ki-stat-icon">
                    <i className="feather-users" />
                  </div>
                  <div className="ki-stat-info">
                    <h3 className="mb-0 ki-stat-num">
                      {statsInView ? <CountUp end={500} suffix="+" duration={2.2} /> : "500+"}
                    </h3>
                    <p className="mb-0">Expert Coaches <span>Qualified &amp; Verified</span></p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3 ki-stat-col">
                <div className="ki-stat">
                  <div className="ki-stat-icon">
                    <i className="feather-map-pin" />
                  </div>
                  <div className="ki-stat-info">
                    <h3 className="mb-0 ki-stat-num">
                      {statsInView ? <CountUp end={50} suffix="+" duration={2.2} /> : "50+"}
                    </h3>
                    <p className="mb-0">Premium Venues <span>Across Indore</span></p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3 ki-stat-col">
                <div className="ki-stat">
                  <div className="ki-stat-icon">
                    <i className="feather-user-check" />
                  </div>
                  <div className="ki-stat-info">
                    <h3 className="mb-0 ki-stat-num">
                      {statsInView ? <CountUp end={10} suffix="K+" duration={2.2} /> : "10K+"}
                    </h3>
                    <p className="mb-0">Happy Athletes <span>Training With Us</span></p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-3 ki-stat-col">
                <div className="ki-stat">
                  <div className="ki-stat-icon">
                    <i className="feather-star" />
                  </div>
                  <div className="ki-stat-info">
                    <h3 className="mb-0 ki-stat-num">
                      {statsInView ? <CountUp end={4.8} decimals={1} suffix="/5" duration={2.2} /> : "4.8/5"}
                    </h3>
                    <p className="mb-0">User Rating <span>Top Rated Platform</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="section-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C271.15,57.17,216.56,49.2,176,44.6c-31.08-4.19-59.26-10.05-91.3-18.75C57,18.3,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
      <section className="section work-section">
        <div className="work-cock-img">
          {/* <ImageWithBasePath src="assets/img/icons/work-cock.svg" alt="Icon" /> */}
        </div>
        <div className="work-img">
          {/* <div className="work-img-right">
            <ImageWithBasePath src="assets/img/new-img01.png" alt="Icon" />
          </div> */}
        </div>
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2 style={{ color: "#17222D", fontFamily: "Space Grotesk, sans-serif" }}>
              How It <span style={{ color: "var(--ki-primary)" }}>Works</span>
            </h2>
            <p className="sub-title" style={{ color: "#606D76" }}>
              Simplifying the booking process for coaches, venues, and athletes.
            </p>
          </div>
          <div className="row justify-content-center ">
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid work-grid-visual w-100 hover-lift">
                <div className="work-visual aos" data-aos="fade-up" data-aos-delay="250">
                  <ImageWithBasePath src="/assets/venue.jpg" alt="Sports venue" />
                </div>
                <div className="work-icon aos" data-aos="fade-up" data-aos-delay="180">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon3.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content aos" data-aos="fade-up" data-aos-delay="100">
                  <h5>
                    <Link to={routes.blogListSidebarLeft}>Select Venues</Link>
                  </h5>
                  <p>
                    Easily book venues, pay, and enjoy a seamless experience on
                    our user-friendly platform.
                  </p>
                  <Link className="btn" to={routes.blogListSidebarLeft}>
                    Go To Venues <i className="feather-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid work-grid-visual w-100 hover-lift">
                <div className="work-visual aos" data-aos="fade-up" data-aos-delay="350">
                  <ImageWithBasePath src="/assets/coach.png" alt="Sports coach" />
                </div>
                <div className="work-icon aos" data-aos="fade-up" data-aos-delay="280">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon2.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content aos" data-aos="fade-up" data-aos-delay="200">
                  <h5>
                    <Link to={routes.coachesGrid}>Select Coaches</Link>
                  </h5>
                  <p>
                    Book coaches for expert guidance and premium facilities.
                    Enjoy a seamless experience on our platform.
                  </p>
                  <Link className="btn" to={routes.coachesGrid}>
                    Go To Coaches <i className="feather-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid work-grid-visual w-100 hover-lift">
                <div className="work-visual aos" data-aos="fade-up" data-aos-delay="450">
                  <ImageWithBasePath src="/assets/trainer.png" alt="Personal trainer" />
                </div>
                <div className="work-icon aos" data-aos="fade-up" data-aos-delay="380">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon1.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content aos" data-aos="fade-up" data-aos-delay="300">
                  <h5>
                    <Link to="/trainers">Select Trainer</Link>
                  </h5>
                  <p>
                    Transform your fitness journey with personalized workouts
                    and expert guidance from our dedicated trainers.
                  </p>
                  <Link className="btn" to="/trainers">
                    Go to Trainer <i className="feather-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="section category-section" style={{ padding: "40px 0" }}>
        <div className="container-fluid px-0">
          <div className="section-heading text-center mb-4 aos" data-aos="fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>
              Browse by <span style={{ color: "var(--ki-primary)" }}>Category</span>
            </h2>
            <p className="sub-title" style={{ color: "#606D76" }}>
              Choose a provider type, then explore its available categories.
            </p>
          </div>

          <div className="container">
            <div className="d-flex justify-content-center flex-wrap gap-2 mb-4" role="tablist" aria-label="Browse provider categories">
              {(["venue", "coach", "trainer"] as CategoryProviderTab[]).map((providerType) => {
                const isActive = categoryProviderTab === providerType;
                const label = providerType === "venue" ? "Venue" : providerType === "coach" ? "Coach" : "Trainer";
                return (
                  <button
                    key={providerType}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className="btn rounded-pill px-4 py-2"
                    onClick={() => {
                      setCategoryProviderTab(providerType);
                      setShowAllCategories(false);
                    }}
                    style={{
                      background: isActive ? "#22C55E" : "#FFFFFF",
                      border: "1px solid #22C55E",
                      boxShadow: isActive ? "0 6px 16px rgba(34, 197, 94, 0.24)" : "none",
                      color: isActive ? "#FFFFFF" : "#16A34A",
                      fontWeight: 700,
                      minWidth: "112px",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="row g-3 justify-content-center">
              {categoryCards.slice(0, showAllCategories ? undefined : 6).map((cat) => (
                <div key={cat.slug} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 d-flex">
                  <div
                    className="ki-category-slider-card p-3 text-center d-flex flex-column align-items-center justify-content-between w-100"
                    style={{ height: "175px", borderRadius: "20px" }}
                    onClick={() => navigate(
                      categoryProviderTab === "venue"
                        ? `/sports-venue/${cat.slug}`
                        : `${categoryProviderTab === "coach" ? routes.coachesGrid : routes.blogList}?category=${encodeURIComponent(cat.name)}`
                    )}
                  >
                    <div
                      className="category-icon-wrap d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: cat.bg,
                        color: cat.color
                      }}
                    >
                      <i className={`${cat.icon}`} style={{ fontSize: "18px", color: cat.color }} />
                    </div>
                    <div>
                      <h4 className="ki-cat-name mb-0">{cat.name}</h4>
                      <p className="ki-cat-count mb-0">{cat.count} {cat.count === 1 ? "Listing" : "Listings"}</p>
                    </div>
                    <button
                      className="btn rounded-pill ki-category-explore-btn w-100"
                      style={{
                        fontSize: "11px",
                        border: "1.5px solid #22C55E",
                        color: "#16A34A",
                        background: "transparent",
                        fontWeight: "600",
                        padding: "3px 10px"
                      }}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {categoryCards.length > 6 && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4 py-2 shadow-sm"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  style={{ backgroundColor: "#22C55E", borderColor: "#22C55E" }}
                >
                  {showAllCategories ? "Show less" : "View all"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Rated Providers Header */}
      <section className="section featured-venues-header top-providers-heading" style={{ padding: "30px 0 20px 0" }}>
        <div className="container">
          <div className="section-heading text-center mb-0 aos" data-aos="fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>
              Top Rated <span style={{ color: "var(--ki-primary)" }}>Providers</span>
            </h2>
            <p className="sub-title mb-0" style={{ color: "#606D76" }}>
              Discover top rated venues, expert coaches, and trainers in Indore.
            </p>
          </div>
        </div>
      </section>

      <section className="section featured-venues-list top-providers-section py-5">
        <div className="container">
          <style>{`
            .ki-vertical-provider-slider {
              position: relative;
            }
            .ki-vertical-provider-slider .slick-list {
              margin: 0 -4px;
            }
            .ki-vertical-provider-slider .slick-slide {
              padding: 10px 4px 15px 24px !important;
              outline: none !important;
            }
            .ki-vertical-dots {
              position: absolute !important;
              left: 2px !important;
              right: auto !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
              width: 20px !important;
              list-style: none !important;
              padding: 0 !important;
              margin: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
              z-index: 10 !important;
            }
            .ki-vertical-dots li {
              width: 12px !important;
              height: 24px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              margin: 0 !important;
              cursor: pointer !important;
            }
            .ki-vertical-dots li .vertical-dot-inner {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #94A3B8;
              opacity: 0.4;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .ki-vertical-dots li.slick-active .vertical-dot-inner {
              width: 6px;
              height: 18px;
              border-radius: 99px;
              background-color: #22C55E;
              opacity: 1;
            }
          `}</style>

          <div className="row g-4 align-items-start">
            <TopProviderCard kind="Venue" providers={visibleVenues} />
            <TopProviderCard kind="Coach" providers={visibleCoaches} />
            <TopProviderCard kind="Trainer" providers={visibleTrainers} />
          </div>
        </div>
      </section>

      {/* One rotating Top Rated Provider section: venues, coaches, then trainers. */}
      {activeTopRatedTab === "venues" && (
      <section key="venues" className="section featured-venues-list top-providers-section top-provider-rotation py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3 aos" data-aos="fade-up">
            <div className="text-start">
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0F172A", fontWeight: "700", fontSize: "26px", marginBottom: "6px" }}>
                Top Rated <span style={{ color: "#22C55E" }}>Venues</span>
              </h3>
              <p className="mb-0" style={{ color: "#64748B", fontSize: "14px", fontWeight: "400" }}>
                Discover and book Indore&apos;s best sports venues, turfs, and courts.
              </p>
              <div style={{ width: "32px", height: "3px", backgroundColor: "#22C55E", borderRadius: "5px", marginTop: "12px" }} />
            </div>
            {venues.length > 6 && (
              <Link
                to={routes.blogListSidebarLeft}
                className="btn d-inline-flex align-items-center px-4 py-2"
                style={{
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#22C55E",
                  border: "1px solid #22C55E",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                View All Venues
                <i className="fas fa-arrow-circle-right ms-2" style={{ fontSize: "16px", color: "#22C55E" }} />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100 aos" data-aos="fade-up" data-aos-delay="120">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...verticalCardSlider} className="ki-vertical-card-slider">
                  {visibleVenues.map((venue, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item home-venue border-white-10 ki-feature-card" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                        <div className="listing-img" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                          <Link to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}>
                            {getVenueImage(venue?.images).startsWith("http") ? (
                              <img
                                src={getVenueImage(venue?.images)}
                                className="img-fluid"
                                alt={venue.name}
                                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <ImageWithBasePath
                                src={getVenueImage(venue?.images)}
                                className="img-fluid"
                                alt={venue.name}
                                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                              />
                            )}
                          </Link>
                          <div className="fav-item-venues news-sports" style={{ top: "12px", left: "12px" }}>
                            <span className="tag tag-blue" style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "28px", padding: "4px 12px", background: "#FFFFFF", color: "#16A34A", fontWeight: "700", borderRadius: "999px", fontSize: "10px", lineHeight: 1, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(22, 163, 74, 0.1)" }}>
                              <i className={getCategoryIcon(venue.vendor_type)} style={{ fontSize: "11px" }} />
                              {venue.vendor_type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <div className="listing-content home-venue news-content p-3" style={{ textAlign: "left" }}>
                          <h3 className="listing-title" style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif" }}>
                            <Link to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`} className="text-truncate d-block" style={{ color: "#0F172A", textDecoration: "none" }}>
                              {venue.name}
                            </Link>
                          </h3>
                          <div className="d-flex align-items-center justify-content-between mt-2">
                            <p className="mb-0 text-truncate" style={{ fontSize: "13px", color: "#64748B", maxWidth: "70%", display: "flex", alignItems: "center", gap: "6px" }}>
                              <i className="feather-map-pin" style={{ color: "#94A3B8", fontSize: "14px" }} />
                              {formatLocation(venue?.near_by_location)}
                            </p>
                          </div>

                          <div className="d-flex align-items-center justify-content-between mt-4">
                            <div className="d-flex flex-column text-start">
                              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginBottom: "4px" }}>Hourly Rate</span>
                              {venue?.price_per_hr !== undefined && venue?.price_per_hr > 0 ? (
                                <span style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
                                  ₹{venue.price_per_hr}
                                  <span style={{ fontSize: "13px", fontWeight: "400", color: "#64748B" }}>/hr</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: "15px", fontWeight: "600", color: "#64748B" }}>Contact Venue</span>
                              )}
                            </div>
                            <Link
                              to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#22C55E",
                                color: "#FFFFFF",
                                transition: "all 0.2s ease-in-out",
                                textDecoration: "none"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#16A34A";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#22C55E";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-chevron-right" style={{ fontSize: "14px" }} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {activeTopRatedTab === "coaches" && (
      <section key="coaches" className="section featured-venues-list top-coaches-section top-provider-rotation py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3 aos" data-aos="fade-up">
            <div className="text-start">
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0F172A", fontWeight: "700", fontSize: "26px", marginBottom: "6px" }}>
                Top Rated <span style={{ color: "#22C55E" }}>Coaches</span>
              </h3>
              <p className="mb-0" style={{ color: "#64748B", fontSize: "14px", fontWeight: "400" }}>
                Discover and connect with Indore&apos;s best coaches across various sports.
              </p>
              <div style={{ width: "32px", height: "3px", backgroundColor: "#22C55E", borderRadius: "5px", marginTop: "12px" }} />
            </div>
            {coaches.length > 6 && (
              <Link
                to={routes.coachesGrid}
                className="btn d-inline-flex align-items-center px-4 py-2"
                style={{
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#22C55E",
                  border: "1px solid #22C55E",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                View All Coaches
                <i className="fas fa-arrow-circle-right ms-2" style={{ fontSize: "16px", color: "#22C55E" }} />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100 aos" data-aos="fade-up" data-aos-delay="120">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...verticalCardSlider} className="ki-vertical-card-slider">
                  {visibleCoaches.map((coach, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item mb-0 ki-feature-card" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                        <div className="listing-img" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                          <Link to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, "-").toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}>
                            <ImageWithBasePath
                              src={
                                coach?.profile_picture?.[0]?.src
                                  ? `${IMG_URL}${coach?.profile_picture?.[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="fav-item-venues" style={{ top: "14px", left: "14px", right: "auto", width: "auto", padding: 0, zIndex: 2 }}>
                            <span className="tag tag-blue" style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "28px", padding: "4px 12px", background: "#FFFFFF", color: "#16A34A", fontWeight: "700", borderRadius: "999px", fontSize: "10px", lineHeight: 1, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(22, 163, 74, 0.1)" }}>
                              <i className={getCategoryIcon(coach.category)} style={{ fontSize: "11px" }} />
                              {(coach.category || "Coach").toUpperCase()} COACH
                            </span>
                          </div>
                        </div>
                        <div className="listing-content list-coche-content p-3" style={{ textAlign: "left" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                            <Link to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, "-").toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`} className="text-truncate d-block" style={{ color: "#0F172A", textDecoration: "none" }}>
                              {coach?.first_name} {coach?.last_name}
                            </Link>
                            <i className="fas fa-check-circle text-success ms-1.5" style={{ fontSize: "13px", flexShrink: 0, color: "#22C55E" }} />
                          </h3>
                          <div className="d-flex align-items-center justify-content-between mt-2">
                            <p className="mb-0 text-truncate" style={{ fontSize: "13px", color: "#64748B", maxWidth: "70%", display: "flex", alignItems: "center", gap: "6px" }}>
                              <i className="feather-map-pin" style={{ color: "#94A3B8", fontSize: "14px" }} />
                              {formatLocation(coach?.near_by_location)}
                            </p>
                            {coach?.experience !== undefined && coach?.experience > 0 && (
                              <span style={{ fontSize: "11px", fontWeight: "600", color: "#16A34A", background: "#F0FDF4", padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {coach?.experience} Yrs Exp
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-4">
                            <div className="d-flex flex-column text-start">
                              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginBottom: "4px" }}>Starts from</span>
                              <span style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
                                ₹{coach?.price || coach?.package?.monthly || 0}
                                <span style={{ fontSize: "13px", fontWeight: "400", color: "#64748B" }}>/month</span>
                              </span>
                            </div>
                            <Link
                              to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, "-").toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#22C55E",
                                color: "#FFFFFF",
                                transition: "all 0.2s ease-in-out",
                                textDecoration: "none"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#16A34A";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#22C55E";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-chevron-right" style={{ fontSize: "14px" }} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {activeTopRatedTab === "trainers" && (
      <section key="trainers" className="section featured-venues-list top-trainers-section top-provider-rotation py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3 aos" data-aos="fade-up">
            <div className="text-start">
              <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0F172A", fontWeight: "700", fontSize: "26px", marginBottom: "6px" }}>
                Top Rated <span style={{ color: "#22C55E" }}>Trainers</span>
              </h3>
              <p className="mb-0" style={{ color: "#64748B", fontSize: "14px", fontWeight: "400" }}>
                Discover and connect with Indore&apos;s best trainers across various fitness goals.
              </p>
              <div style={{ width: "32px", height: "3px", backgroundColor: "#22C55E", borderRadius: "5px", marginTop: "12px" }} />
            </div>
            {trainer.length > 6 && (
              <Link
                to={routes.blogList}
                className="btn d-inline-flex align-items-center px-4 py-2"
                style={{
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#22C55E",
                  border: "1px solid #22C55E",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                View All Trainers
                <i className="fas fa-arrow-circle-right ms-2" style={{ fontSize: "16px", color: "#22C55E" }} />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100 aos" data-aos="fade-up" data-aos-delay="120">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...verticalCardSlider} className="ki-vertical-card-slider">
                  {visibleTrainers.map((train, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item mb-0 ki-feature-card" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                        <div className="listing-img" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                          <Link to={`/trainers/trainer/${train.first_name.replace(/\s+/g, "-").toLowerCase()}/${train._id}`}>
                            <ImageWithBasePath
                              src={
                                train?.profile_picture?.[0]?.src
                                  ? `${IMG_URL}${train?.profile_picture?.[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="fav-item-venues" style={{ top: "14px", left: "14px", right: "auto", width: "auto", padding: 0, zIndex: 2 }}>
                            <span className="tag tag-blue" style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "28px", padding: "4px 12px", background: "#FFFFFF", color: "#16A34A", fontWeight: "700", borderRadius: "999px", fontSize: "10px", lineHeight: 1, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "1px solid rgba(22, 163, 74, 0.1)" }}>
                              <i className={getCategoryIcon(train.category || train.trainer_type)} style={{ fontSize: "11px" }} />
                              {(train.category || train.trainer_type || "Trainer").toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="listing-content p-3" style={{ textAlign: "left" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                            <Link to={`/trainers/trainer/${train.first_name.replace(/\s+/g, "-").toLowerCase()}/${train._id}`} className="text-truncate d-block" style={{ color: "#0F172A", textDecoration: "none" }}>
                              {train.first_name} {train.last_name}
                            </Link>
                            <i className="fas fa-check-circle text-success ms-1.5" style={{ fontSize: "13px", flexShrink: 0, color: "#22C55E" }} />
                          </h3>
                          <div className="d-flex align-items-center justify-content-between mt-2">
                            <p className="mb-0 text-truncate" style={{ fontSize: "13px", color: "#64748B", maxWidth: "70%", display: "flex", alignItems: "center", gap: "6px" }}>
                              <i className="feather-map-pin" style={{ color: "#94A3B8", fontSize: "14px" }} />
                              {formatLocation(train?.near_by_location)}
                            </p>
                            {train?.experience !== undefined && train?.experience > 0 && (
                              <span style={{ fontSize: "11px", fontWeight: "600", color: "#16A34A", background: "#F0FDF4", padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {train?.experience} Yrs Exp
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-4">
                            <div className="d-flex flex-column text-start">
                              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginBottom: "4px" }}>Starts from</span>
                              <span style={{ fontSize: "20px", fontWeight: "800", color: "#0F172A", display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
                                ₹{train?.price || train?.package?.monthly || 0}
                                <span style={{ fontSize: "13px", fontWeight: "400", color: "#64748B" }}>/month</span>
                              </span>
                            </div>
                            <Link
                              to={`/trainers/trainer/${train.first_name.replace(/\s+/g, "-").toLowerCase()}/${train._id}`}
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#22C55E",
                                color: "#FFFFFF",
                                transition: "all 0.2s ease-in-out",
                                textDecoration: "none"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#16A34A";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#22C55E";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-chevron-right" style={{ fontSize: "14px" }} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}


      {/* /Featured Coaches */}

      {/* Journey */}
      {/* <section className="section journey-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex align-items-center">
              <div className="start-your-journey aos" data-aos="fade-up">
                <h2>
                  Start Your Journey With{" "}
                  <span className="active-sport">KheloIndore</span> Badminton
                  Today.
                </h2>
                <p>
                  At KheloIndore Badminton, we prioritize your satisfaction and
                  value your feedback as we continuously improve and evolve our
                  learning experiences.
                </p>
                <p>
                  Our instructors utilize modern methods for effective badminton
                  lessons, offering introductory sessions for beginners and
                  personalized development plans to foster individual growth.
                </p>
                <span className="stay-approach">
                  Stay Ahead With Our Innovative Approach:
                </span>
                <div className="journey-list">
                  <ul>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Skilled Professionals
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Modern Techniques
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Intro Lesson
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Personal Development
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Advanced Equipment
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Interactive Classes For Easy Learning.
                    </li>
                  </ul>
                </div>
                <div className="convenient-btns">
                  <Link
                    to={routes.login}
                    className="btn btn-primary d-inline-flex align-items-center"
                  >
                    <span>
                      <i className="feather-log-in me-2" />
                    </span>
                    Get Started
                  </Link>
                  <Link
                    to={routes.aboutUs}
                    className="btn btn-secondary d-inline-flex align-items-center"
                  >
                    <span>
                      <i className="feather-align-justify me-2" />
                    </span>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="journey-img aos" data-aos="fade-up">
                <ImageWithBasePath
                  src="assets/img/journey-01.png"
                  className="img-fluid"
                  alt="User"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* /Journey */}

      {/* Group Coaching */}
      {/* <section className="section group-coaching">
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Our <span>Features</span>
            </h2>
            <p className="sub-title">
              Discover your potential with our comprehensive training, expert
              trainers, and advanced facilities. Join us to improve your
              athletic career.
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-01.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Group Coaching</h3>
                  <p>
                    Accelerate your skills with tailored group coaching sessions
                    for badminton players game.
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-02.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Private Coaching</h3>
                  <p>
                    Find private badminton coaches and academies for a
                    personalized approach to skill enhancement.
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-03.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Equipment Store</h3>
                  <p>
                    Your one-stop shop for high-quality badminton equipment,
                    enhancing your on-court performance.
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-04.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Innovative Lessons</h3>
                  <p>
                    Enhance your badminton skills with innovative lessons,
                    combining modern techniques and training methods
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-05.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Badminton Community</h3>
                  <p>
                    Upraise your game with engaging lessons and a supportive
                    community. Join us now and take your skills to new heights.
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div
                className="work-grid coaching-grid w-100 aos"
                data-aos="fade-up"
              >
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/coache-icon-06.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h3>Court Rental</h3> 
                  <p>
                    Enjoy uninterrupted badminton sessions at KheloIndorewith
                    our premium court rental services.
                  </p>
                  <Link to="#">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* Group Coaching */}

      {/* /Earn Money moved to bottom */}


      {/* /Courts Near */}

      {/* Testimonials */}
      <section className="section our-testimonials">
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Our <span>Testimonials</span>
            </h2>
            <p className="sub-title">
              Glowing testimonials from passionate sports enthusiasts worldwide,
              showcasing our exceptional services.
            </p>
          </div>
          <div className="row">
            <div className="featured-slider-group aos" data-aos="fade-up">
              <div className="owl-carousel testimonial-slide featured-venues-slider owl-theme">
                <Slider {...settings}>
                  <div className="testimonial-group">
                    <div className="testimonial-review">
                      <div className="rating-point">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <span> 5.0</span>
                      </div>
                      <h5>Personalized Attention</h5>
                      <p>
                        KheloIndore coaching services enhanced my badminton
                        skills. Personalized attention from knowledgeable
                        coaches propelled my game to new heights.
                      </p>
                    </div>
                    <div className="listing-venue-owner">
                      <Link className="navigation" to={""}>
                        <ImageWithBasePath
                          src="/assets/img/profiles/avatar-01.jpg"
                          alt="User"
                        />
                      </Link>
                      <div className="testimonial-content">
                        <h5>
                          <Link to="#">Aarav Mehta</Link>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="testimonial-group">
                    <div className="testimonial-review">
                      <div className="rating-point">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <span> 5.0</span>
                      </div>
                      <h5>Quality Matters !</h5>
                      <p>
                        KheloIndore offer a wide range of venues from small
                        rooms to large halls. Booking is straightforward with
                        clear pricing and good customer support.
                      </p>
                    </div>
                    <div className="listing-venue-owner">
                      <Link className="navigation" to={""}>
                        <ImageWithBasePath
                          src="/assets/img/profiles/avatar-04.jpg"
                          alt="User"
                        />
                      </Link>
                      <div className="testimonial-content">
                        <h5>
                          <Link to="#">Rohan Sharma</Link>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="testimonial-group">
                    <div className="testimonial-review">
                      <div className="rating-point">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <span> 5.0</span>
                      </div>
                      <h5>Excellent Professionalism !</h5>
                      <p>
                        KheloIndore is a great platform for booking venues.
                        It&apos;s easy to use with a simple interface for
                        finding venues based on location, capacity, and budget.
                      </p>
                    </div>
                    <div className="listing-venue-owner">
                      <Link className="navigation" to={""}>
                        <ImageWithBasePath
                          src="/assets/img/profiles/avatar-03.jpg"
                          alt="User"
                        />
                      </Link>
                      <div className="testimonial-content">
                        <h5>
                          <Link to="#">Neha Singhal</Link>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="testimonial-group">
                    <div className="testimonial-review">
                      <div className="rating-point">
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <i className="fas fa-star filled" />
                        <span> 5.0</span>
                      </div>
                      <h5>Quality Matters !</h5>
                      <p>
                        KheloIndore is Highly recommended for anyone planning
                        events. Booking is straightforward with clear pricing
                        and good customer support.
                      </p>
                    </div>
                    <div className="listing-venue-owner">
                      <Link className="navigation" to={""}>
                        <ImageWithBasePath
                          src="/assets/img/profiles/avatar-04.jpg"
                          alt="User"
                        />
                      </Link>
                      <div className="testimonial-content">
                        <h5>
                          <Link to="#">Karan Verma</Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earn Money / Grow with Khelo Indore */}
      <section className="section earn-money ki-grow-section py-5 position-relative" style={{ overflow: "hidden" }}>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          {/* Section Heading */}
          <div className="text-center mb-4 aos" data-aos="fade-up">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
              <span style={{ width: "32px", height: "3px", backgroundColor: "#16A34A", borderRadius: "2px" }}></span>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0F172A", fontWeight: "700", fontSize: "32px", margin: 0 }}>
                Grow with <span style={{ color: "#16A34A" }}>Khelo Indore</span>
              </h2>
              <span style={{ width: "32px", height: "3px", backgroundColor: "#16A34A", borderRadius: "2px" }}></span>
            </div>
            <p className="mb-0" style={{ color: "#64748B", fontSize: "16px", fontWeight: "400" }}>
              Join our community and take your sports journey to the next level.
            </p>
          </div>

          <div className="row justify-content-between align-items-stretch g-4">
            {/* Left Column (Venues) */}
            <div className="col-lg-5 col-md-12 d-flex">
              <div className="ki-grow-option ki-grow-option--venue">
              <div className="row align-items-center g-4">
                <div className="col-md-7 text-start">
                  <div className="d-flex align-items-start mb-3">
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", flexShrink: 0, boxShadow: "0 4px 10px rgba(22, 163, 74, 0.15)" }}>
                      <i className="fa-solid fa-building" style={{ fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "24px", color: "#0F172A", fontFamily: "Space Grotesk, sans-serif", fontWeight: "700", marginBottom: "0", lineHeight: "1.3" }}>
                        List your <br />
                        <span className="sports-venue-heading-text" style={{ color: "#16A34A" }}>sports venue</span> <br />
                        with us
                      </h3>
                      <div style={{ width: "32px", height: "3px", backgroundColor: "#16A34A", borderRadius: "2px", marginTop: "12px" }} />
                    </div>
                  </div>
                  <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                    Earn money renting out your private fields, turf, pool, or gym on Indore&apos;s largest local sports search platform.
                  </p>
                  <ul className="list-unstyled mb-0" style={{ paddingLeft: 0 }}>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "12px", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#16A34A", marginRight: "8px", fontSize: "16px" }} />
                      ₹1,000,000 liability insurance
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "12px", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#16A34A", marginRight: "8px", fontSize: "16px" }} />
                      Build of Trust with validation
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "0", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#16A34A", marginRight: "8px", fontSize: "16px" }} />
                      Protected booking environment
                    </li>
                  </ul>
                  <div className="d-block d-md-none mt-4 text-center">
                    <img className="ki-grow-visual"
                      src="/images.jpg"
                      alt="Sports Turf"
                      style={{ width: "100%", maxWidth: "210px", height: "240px", objectFit: "cover", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                    />
                  </div>
                </div>
                <div className="col-md-5 d-none d-md-flex justify-content-center justify-content-md-end">
                  <img className="ki-grow-visual"
                    src="/images.jpg"
                    alt="Sports Turf"
                    style={{ width: "100%", maxWidth: "210px", height: "240px", objectFit: "cover", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                  />
                </div>
              </div>
              {/* Centered Button below Venues */}
              <div className="d-flex justify-content-center mt-3 pt-1">
                <Link
                  to="/register?role=venue"
                  className="btn ki-grow-cta ki-grow-cta--venue d-inline-flex align-items-center justify-content-between px-4 py-2.5"
                  style={{
                    width: "100%",
                    maxWidth: "340px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                    border: "none",
                    backgroundColor: "#16A34A",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#15803D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#16A34A";
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-building" style={{ fontSize: "15px" }} />
                    <span>List Your Venue</span>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              </div>
              </div>
            </div>

            {/* Separator Column (Vertical Line & OR Bubble) */}
            <div className="col-lg-2 d-none d-lg-flex align-items-center justify-content-center position-relative" style={{ minHeight: "260px" }}>
              <div style={{ position: "absolute", top: "5%", bottom: "5%", width: "1px", backgroundColor: "#E2E8F0" }} />
              <div className="d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#F1F5F9", border: "1px solid #E2E8E3", color: "#64748B", fontSize: "12px", fontWeight: "700", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                OR
              </div>
            </div>

            {/* Right Column (Trainers/Coaches) */}
            <div className="col-lg-5 col-md-12 d-flex">
              <div className="ki-grow-option ki-grow-option--coach">
              <div className="row align-items-center g-4">
                <div className="col-md-7 text-start">
                  <div className="d-flex align-items-start mb-3">
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", flexShrink: 0, boxShadow: "0 4px 10px rgba(234, 88, 12, 0.15)" }}>
                      <i className="fa-solid fa-graduation-cap" style={{ fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "24px", color: "#0F172A", fontFamily: "Space Grotesk, sans-serif", fontWeight: "700", marginBottom: "0", lineHeight: "1.3" }}>
                        Are you a <br />
                        <span className="trainer-coach-heading-text" style={{ color: "#EA580C" }}>trainer/coach?</span> <br />
                        Enroll with us
                      </h3>
                      <div style={{ width: "32px", height: "3px", backgroundColor: "#EA580C", borderRadius: "2px", marginTop: "12px" }} />
                    </div>
                  </div>
                  <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                    Grow your training business, reach local players, schedule sessions, and manage bookings securely.
                  </p>
                  <ul className="list-unstyled mb-0" style={{ paddingLeft: 0 }}>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "12px", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#EA580C", marginRight: "8px", fontSize: "16px" }} />
                      Connect with students in Indore
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "12px", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#EA580C", marginRight: "8px", fontSize: "16px" }} />
                      Flexible calendar scheduling
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "0", color: "#334155", fontSize: "14px", fontWeight: "500" }}>
                      <i className="fa-solid fa-circle-check" style={{ color: "#EA580C", marginRight: "8px", fontSize: "16px" }} />
                      Fast, secured online payouts
                    </li>
                  </ul>
                  <div className="d-block d-md-none mt-4 text-center">
                    <img className="ki-grow-visual"
                      src="/trainer.png"
                      alt="Coaching Session"
                      style={{ width: "100%", maxWidth: "210px", height: "240px", objectFit: "cover", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                    />
                  </div>
                </div>
                <div className="col-md-5 d-none d-md-flex justify-content-center justify-content-md-end">
                  <img className="ki-grow-visual"
                    src="/trainer.png"
                    alt="Coaching Session"
                    style={{ width: "100%", maxWidth: "210px", height: "240px", objectFit: "cover", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
                  />
                </div>
              </div>
              {/* Centered Button below Trainers */}
              <div className="d-flex justify-content-center mt-3 pt-1">
                <Link
                  to="/register?role=coach"
                  className="btn ki-grow-cta ki-grow-cta--coach d-inline-flex align-items-center justify-content-between px-4 py-2.5"
                  style={{
                    width: "100%",
                    maxWidth: "340px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#FFFFFF",
                    border: "none",
                    backgroundColor: "#EA580C",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#C2410C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#EA580C";
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-user" style={{ fontSize: "15px" }} />
                    <span>Join as a Trainer / Coach</span>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
