import React, { useEffect, useMemo, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
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
}

const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
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
  const [activeTopRatedTab, setActiveTopRatedTab] = useState("venues");
  const [selectedLocationSort, setSelectedLocationSort] = useState<{ name: string } | null>(null);
  const [selectedSport, setSelectedSport] = useState<{ name: string } | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const timeframeOptions = [
    { name: "Sports Venue" },
    { name: "Coaches" },
    { name: "Personal Trainer" },
  ];
  const categoryOptions = [
    { name: "Sports Venue" },
    { name: "Coaches" },
    { name: "Personal Trainer" },
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
      : selectedCategory === "Personal Trainer"
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
      : selectedCategory === "Personal Trainer"
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
    slidesToShow: 4,
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
        }));
        setCoaches(mappedData);
      } catch (error) {
        console.error("Error fetching coaches:", error);
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
          // profile: coach.profile
        }));
        setVenues(mappedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
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
        }));
        setTrainer(mappedData);
      } catch (error) {
        console.error("Error fetching trainer:", error);
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
    } else if (categoryName === "Personal Trainer") {
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
        } else if (selectedTimeframe?.name === "Personal Trainer") {
          navigate("/personal-training", { state: { selectedLocationSort, selectedSport } });
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
                            : selectedTimeframe.name === "Coaches" ? "/coaches" : "/personal-training"}
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
                <div className="banner-imgs text-center aos" data-aos="fade-up">
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
          <div className="stats-counter-bar mt-5 p-4 mb-4">
            <div className="row align-items-center text-center text-md-start">
              <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "48px", height: "48px", background: "#EAF5EB", color: "#3CAB4B" }}>
                    <i className="feather-users" style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <h3 className="mb-0">500+</h3>
                    <p className="mb-0">Expert Coaches <span className="d-block">Qualified &amp; Verified</span></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start ms-md-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "48px", height: "48px", background: "#EAF5EB", color: "#3CAB4B" }}>
                    <i className="feather-map-pin" style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <h3 className="mb-0">50+</h3>
                    <p className="mb-0">Premium Venues <span className="d-block">Across Indore</span></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3 mb-md-0">
                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start ms-md-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "48px", height: "48px", background: "#EAF5EB", color: "#3CAB4B" }}>
                    <i className="feather-user-check" style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <h3 className="mb-0">10K+</h3>
                    <p className="mb-0">Happy Athletes <span className="d-block">Training With Us</span></p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start ms-md-4">
                  <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "48px", height: "48px", background: "#EAF5EB", color: "#3CAB4B" }}>
                    <i className="feather-star" style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <h3 className="mb-0">4.8/5</h3>
                    <p className="mb-0">User Rating <span className="d-block">Top Rated Platform</span></p>
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
              <div className="work-grid work-grid-visual w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="100">
                <div className="work-visual">
                  <ImageWithBasePath src="/assets/img/venues/venues-01.jpg" alt="Sports venue" />
                </div>
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon3.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
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
              <div className="work-grid work-grid-visual w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="200">
                <div className="work-visual">
                  <ImageWithBasePath src="/assets/img/profiles/avatar-coach-detail.jpg" alt="Sports coach" />
                </div>
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon2.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
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
              <div className="work-grid work-grid-visual w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="300">
                <div className="work-visual">
                  <ImageWithBasePath src="/assets/img/profiles/user-01.jpg" alt="Personal trainer" />
                </div>
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon1.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <Link to="/personal-training">Select Trainer</Link>
                  </h5>
                  <p>
                    Transform your fitness journey with personalized workouts
                    and expert guidance from our dedicated trainers.
                  </p>
                  <Link className="btn" to="/personal-training">
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
              Select a sport category to view all registered venues, coaches, and academies.
            </p>
          </div>
          
          <div className="container">
            <div className="row g-3 justify-content-center">
              {[
                { name: "Cricket", slug: "cricket", count: "141 Listings", icon: "fas fa-baseball-ball", color: "#16A34A", bg: "#DCFCE7" },
                { name: "Badminton", slug: "badminton", count: "25 Listings", icon: "fas fa-table-tennis", color: "#2563EB", bg: "#DBEAFE" },
                { name: "Football", slug: "football", count: "13 Listings", icon: "fas fa-futbol", color: "#059669", bg: "#D1FAE5" },
                { name: "Swimming", slug: "swimming", count: "12 Listings", icon: "fas fa-swimmer", color: "#0891B2", bg: "#CFFAFE" },
                { name: "Pickleball", slug: "pickleball", count: "24 Listings", icon: "fas fa-table-tennis", color: "#D97706", bg: "#FEF3C7" },
                { name: "Tennis", slug: "tennis", count: "8 Listings", icon: "fas fa-basketball-ball", color: "#7C3AED", bg: "#EDE9FE" },
                { name: "Basketball", slug: "basketball", count: "6 Listings", icon: "fas fa-basketball-ball", color: "#DC2626", bg: "#FEE2E2" },
                { name: "Table Tennis", slug: "table-tennis", count: "10 Listings", icon: "fas fa-table-tennis", color: "#DB2777", bg: "#FCE7F3" },
                { name: "Other Sports", slug: "other-sports", count: "514 Listings", icon: "fas fa-trophy", color: "#4F46E5", bg: "#E0E7FF" },
              ].slice(0, showAllCategories ? undefined : 6).map((cat, idx) => (
                <div key={idx} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 d-flex">
                  <div 
                    className="ki-category-slider-card p-3 text-center d-flex flex-column align-items-center justify-content-between w-100" 
                    style={{ height: "175px", borderRadius: "20px" }}
                    onClick={() => navigate(`/sports-venue/${cat.slug}`)}
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
                      <p className="ki-cat-count mb-0">{cat.count}</p>
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

            {9 > 6 && (
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
      <section className="section featured-venues-header top-providers-heading" style={{ padding: "30px 0 20px 0", borderBottom: "1px solid #D9E5F5" }}>
        <div className="container">
          <div className="section-heading text-center mb-0 aos" data-aos="fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>
              Top Rated <span style={{ color: "var(--ki-primary)" }}>Providers</span>
            </h2>
            <p className="sub-title mb-0" style={{ color: "#606D76" }}>
              Discover top rated venues, expert coaches, and personal trainers in Indore.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Venues */}
      <section className="section featured-venues-list top-providers-section py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 aos" data-aos="fade-up">
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D", fontWeight: "700", fontSize: "20px" }}>
              Top Rated <span style={{ color: "var(--ki-primary)" }}>Venues</span>
            </h3>
            {venues.length > 6 && (
              <Link
                to={routes.blogListSidebarLeft}
                className="btn btn-primary btn-sm d-inline-flex align-items-center px-3 py-1.5"
                style={{ borderRadius: "10px", fontSize: "13px", background: "linear-gradient(90deg, #49BC4F, #38A941)", border: "none" }}
              >
                View All Venues <i className="feather-arrow-right-circle ms-2" />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...settings}>
                  {visibleVenues.map((venue, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item home-venue border-white-10" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
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
                            <span className="tag tag-blue" style={{ background: "var(--ki-primary)", color: "#FFFFFF", fontWeight: "700", borderRadius: "8px", fontSize: "12px", textTransform: "uppercase" }}>
                              {venue.vendor_type.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <div className="listing-content home-venue news-content p-3">
                          <h3 className="listing-title" style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif" }}>
                            <Link to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`} className="text-truncate d-block" style={{ color: "#17222D" }}>
                              {venue.name}
                            </Link>
                          </h3>
                          <p style={{ fontSize: "13px", color: "#606D76" }}>
                            <i className="feather-map-pin me-2" style={{ color: "var(--ki-primary)" }} />
                            {venue?.near_by_location}
                          </p>
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

      {/* Top Rated Coaches */}
      <section className="section featured-venues-list top-coaches-section py-5" style={{ borderTop: "1px solid #F2DCD4", borderBottom: "1px solid #F2DCD4" }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 aos" data-aos="fade-up">
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D", fontWeight: "700", fontSize: "20px" }}>
              Top Rated <span style={{ color: "var(--ki-accent)" }}>Coaches</span>
            </h3>
            {coaches.length > 6 && (
              <Link
                to={routes.coachesGrid}
                className="btn btn-primary btn-sm d-inline-flex align-items-center px-3 py-1.5"
                style={{ borderRadius: "10px", fontSize: "13px", background: "linear-gradient(90deg, #49BC4F, #38A941)", border: "none" }}
              >
                View All Coaches <i className="feather-arrow-right-circle ms-2" />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...options}>
                  {visibleCoaches.map((coach, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item mb-0" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                        <div className="listing-img" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                          <Link to={`/coaches/${coach?.category?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}>
                            <ImageWithBasePath
                              src={
                                coach?.profile_picture[0]?.src
                                  ? `${IMG_URL}${coach?.profile_picture[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="fav-item-venues" style={{ top: "14px", left: "14px", right: "auto", width: "auto", padding: 0, zIndex: 2 }}>
                            <span className="tag tag-blue" style={{ display: "inline-flex", alignItems: "center", minHeight: "28px", padding: "7px 10px", background: "var(--ki-accent)", color: "#FFFFFF", fontWeight: "700", borderRadius: "999px", fontSize: "10px", lineHeight: 1, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(28, 145, 51, 0.24)" }}>
                              {coach.trainer_type || "Coach"}
                            </span>
                          </div>
                        </div>
                        <div className="listing-content list-coche-content p-3">
                          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif" }}>
                            <Link to={`/coaches/${coach?.category?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`} className="text-truncate d-block" style={{ color: "#17222D" }}>
                              {coach?.first_name} {coach?.last_name}
                            </Link>
                          </h3>
                          <p style={{ fontSize: "13px", color: "#606D76" }}>
                            <i className="feather-map-pin me-2" style={{ color: "var(--ki-primary)" }} />
                            {coach?.near_by_location || "Indore"}
                          </p>
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

      {/* Top Rated Trainers */}
      <section className="section featured-venues-list top-trainers-section py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 aos" data-aos="fade-up">
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D", fontWeight: "700", fontSize: "20px" }}>
              Top Rated <span style={{ color: "var(--ki-primary)" }}>Trainers</span>
            </h3>
            {trainer.length > 6 && (
              <Link
                to={routes.blogList}
                className="btn btn-primary btn-sm d-inline-flex align-items-center px-3 py-1.5"
                style={{ borderRadius: "10px", fontSize: "13px", background: "linear-gradient(90deg, #49BC4F, #38A941)", border: "none" }}
              >
                View All Trainers <i className="feather-arrow-right-circle ms-2" />
              </Link>
            )}
          </div>
          <div className="row">
            <div className="featured-slider-group w-100">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...options}>
                  {visibleTrainers.map((train, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item mb-0" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                        <div className="listing-img" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                          <Link to={`/personal-training/trainer/${train.first_name.replace(/\s+/g, "-").toLowerCase()}/${train._id}`}>
                            <ImageWithBasePath
                              src={
                                train?.profile_picture[0]?.src
                                  ? `${IMG_URL}${train?.profile_picture[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="fav-item-venues" style={{ top: "14px", left: "14px", right: "auto", width: "auto", padding: 0, zIndex: 2 }}>
                            <span className="tag tag-blue" style={{ display: "inline-flex", alignItems: "center", minHeight: "28px", padding: "7px 10px", background: "var(--ki-accent)", color: "#FFFFFF", fontWeight: "700", borderRadius: "999px", fontSize: "10px", lineHeight: 1, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(28, 145, 51, 0.24)" }}>
                              {train.trainer_type || "Trainer"}
                            </span>
                          </div>
                        </div>
                        <div className="listing-content p-3">
                          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif" }}>
                            <Link to={`/personal-training/trainer/${train.first_name.replace(/\s+/g, "-").toLowerCase()}/${train._id}`} className="text-truncate d-block" style={{ color: "#17222D" }}>
                              {train.first_name} {train.last_name}
                            </Link>
                          </h3>
                          <p style={{ fontSize: "13px", color: "#606D76" }}>
                            <i className="feather-map-pin me-2" style={{ color: "var(--ki-primary)" }} />
                            {train?.near_by_location || "Indore"}
                          </p>
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

      {/* Earn Money */}
      <section className="section earn-money">
        <div className="cock-img cock-position">
          <div className="cock-img-one ">
            {/* <ImageWithBasePath src="assets/img/icons/cock-01.svg" alt="Icon" /> */}
          </div>
          <div className="cock-img-two">
            {/* <ImageWithBasePath src="assets/img/icons/cock-02.svg" alt="Icon" /> */}
          </div>
          <div className="cock-circle">
            {/* <ImageWithBasePath src="assets/img/bg/cock-shape.png" alt="Icon" /> */}
          </div>
        </div>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Venue Partner Card */}
            <div className="col-lg-5 col-md-6 d-flex">
              <div className="private-venue w-100 d-flex flex-column justify-content-between p-4 aos" data-aos="fade-up" style={{ borderRadius: "28px" }}>
                <div>
                  <div className="icon-badge mb-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(67, 182, 73, 0.1)", color: "#3CAB4B" }}>
                    <i className="fa-solid fa-building-circle-check" style={{ fontSize: "22px" }} />
                  </div>
                  <h3 style={{ fontSize: "22px", color: "#17222D", fontFamily: "Space Grotesk, sans-serif", fontWeight: "700", marginBottom: "16px" }}>
                    List your sports venue with us
                  </h3>
                  <p style={{ color: "#606D76", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                    Earn money renting out your private fields, turf, pool, or gym on {"Indore's"} largest local sports search platform.
                  </p>
                  <ul className="list-unstyled mb-4" style={{ paddingLeft: 0 }}>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      ₹1,000,000 liability insurance
                    </li>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      Build of Trust with validation
                    </li>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      Protected booking environment
                    </li>
                  </ul>
                </div>
                <Link
                  to={routes.login}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-2"
                  style={{ background: "linear-gradient(90deg, #49BC4F, #38A941)", border: "none", borderRadius: "12px", fontWeight: "700" }}
                >
                  Get Started Now
                  <i className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
            </div>

            {/* Coach Partner Card */}
            <div className="col-lg-5 col-md-6 d-flex">
              <div className="private-venue w-100 d-flex flex-column justify-content-between p-4 aos" data-aos="fade-up" data-aos-delay="100" style={{ borderRadius: "28px" }}>
                <div>
                  <div className="icon-badge mb-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(67, 182, 73, 0.1)", color: "#3CAB4B" }}>
                    <i className="fa-solid fa-user-graduate" style={{ fontSize: "22px" }} />
                  </div>
                  <h3 style={{ fontSize: "22px", color: "#17222D", fontFamily: "Space Grotesk, sans-serif", fontWeight: "700", marginBottom: "16px" }}>
                    Are you a trainer/coach? Enroll with us
                  </h3>
                  <p style={{ color: "#606D76", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                    Grow your training business, reach local players, schedule sessions, and manage bookings securely.
                  </p>
                  <ul className="list-unstyled mb-4" style={{ paddingLeft: 0 }}>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      Connect with students in Indore
                    </li>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      Flexible calendar scheduling
                    </li>
                    <li className="d-flex align-items-center mb-2" style={{ color: "#606D76", fontSize: "14px" }}>
                      <i className="fa-solid fa-circle-check me-2" style={{ color: "#43B649" }} />
                      Fast, secured online payouts
                    </li>
                  </ul>
                </div>
                <Link
                  to={routes.contactUs}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-2"
                  style={{ background: "linear-gradient(90deg, #49BC4F, #38A941)", border: "none", borderRadius: "12px", fontWeight: "700" }}
                >
                  Contact Us To Join
                  <i className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Earn Money */}


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
                          src="assets/img/profiles/avatar-01.jpg"
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
                          src="assets/img/profiles/avatar-04.jpg"
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
                          src="assets/img/profiles/avatar-03.jpg"
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
                          src="assets/img/profiles/avatar-04.jpg"
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
    </>
  );
};

export default Home;
