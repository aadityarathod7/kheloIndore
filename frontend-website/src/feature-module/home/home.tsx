import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const cleanLocation = (loc: string): string => {
      if (!loc) return "";
      let cleaned = loc.trim()
        .replace(/,\s*Indore/gi, "")
        .replace(/,\s*Ind/gi, "")
        .replace(/\s+/g, " ");
      
      // Capitalize words
      return cleaned.split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    const locationsSet = new Set<string>();
    
    // Collect from venues
    venues.forEach(v => {
      if (v.near_by_location) {
        locationsSet.add(cleanLocation(v.near_by_location));
      }
    });

    // Collect from coaches
    coaches.forEach(c => {
      if (c.near_by_location) {
        locationsSet.add(cleanLocation(c.near_by_location));
      }
    });

    // Collect from trainers
    trainer.forEach(t => {
      if (t.near_by_location) {
        locationsSet.add(cleanLocation(t.near_by_location));
      }
    });

    // Filter, sort, and map to options format
    const uniqueSorted = Array.from(locationsSet)
      .filter(loc => loc.length > 0 && loc.toLowerCase() !== "indore") // omit general 'Indore'
      .sort()
      .map(loc => ({ name: loc }));

    if (uniqueSorted.length > 0) {
      setSortOptions(uniqueSorted);
    }
  }, [venues, coaches, trainer]);
  const sportsOptions = [
    { name: "Cricket" },
    { name: "Football" },
    { name: "Badminton" },
    { name: "Tennis" },
    { name: "Swimming" },
    { name: "Basketball" },
    { name: "Volleyball" },
    { name: "Gym & Fitness" },
    { name: "Table Tennis" },
  ];

  const settings = {
    dots: false,
    infinite: true,
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
      text: `We found ${count} matching registered ${selectedTimeframe?.name} profiles. Proceed to view listings?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, View Listings",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF6B2C",
      cancelButtonColor: "#0D1B2A",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedTimeframe?.name === "Coaches") {
          navigate("/coaches", { state: { selectedLocationSort, selectedSport } });
        } else if (selectedTimeframe?.name === "Personal Trainer") {
          navigate("/personal-training", { state: { selectedLocationSort, selectedSport } });
        } else if (selectedTimeframe?.name === "Sports Venue") {
          navigate("/sports-venue", { state: { selectedLocationSort, selectedSport } });
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
              <div className="col-lg-7 col-md-12 mx-auto">
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
                  <p className="sub-info mb-3" style={{ color: "#0F172A", fontSize: "14.5px", fontWeight: "600", lineHeight: "1.7", maxWidth: "620px" }}>
                    Book venues, connect with expert coaches, join training programs, and discover exciting sports activities near you.
                  </p>

                  {/* Features Row */}
                  <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "32px", height: "32px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-user" style={{ fontSize: "13px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "13px" }}>Expert Coaches</div>
                        <div style={{ color: "#334155", fontSize: "11.5px", fontWeight: "600" }}>Certified &amp; Experienced</div>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "32px", height: "32px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-grid" style={{ fontSize: "13px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "13px" }}>Premium Facilities</div>
                        <div style={{ color: "#334155", fontSize: "11.5px", fontWeight: "600" }}>Best-in-class Venues</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "32px", height: "32px", background: "#EAF5EB", color: "#3CAB4B" }}>
                        <i className="feather-trending-up" style={{ fontSize: "13px" }} />
                      </div>
                      <div>
                        <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "13px" }}>Personalized Training</div>
                        <div style={{ color: "#334155", fontSize: "11.5px", fontWeight: "600" }}>Tailored for You</div>
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
                              placeholder="Select"
                              className="select custom-select-list w-100"
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
                              placeholder="Select"
                              className="select custom-select-list w-100"
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
                  <div className="trending-searches mt-3 d-flex align-items-center gap-2 flex-wrap">
                    <span className="ki-popular-searches me-2">Popular Searches:</span>
                    <div className="d-inline-flex gap-2 flex-wrap">
                      {["Cricket", "Football", "Badminton", "Tennis", "Basketball"].map((sportName) => (
                        <span 
                          key={sportName}
                          className="ki-search-tag" 
                          onClick={() => {
                            setSelectedTimeframe({ name: "Sports Venue" });
                            setSelectedSport({ name: sportName });
                          }}
                        >
                          {sportName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 mt-4 mt-lg-0">
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
              <div className="work-grid w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="100">
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
              <div className="work-grid w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="200">
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
              <div className="work-grid w-100 aos hover-lift" data-aos="fade-up" data-aos-delay="300">
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
      <section className="section category-section" style={{ background: "transparent", padding: "80px 0" }}>
        <div className="container">
          <div className="section-heading text-center aos" data-aos="fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>
              Browse by <span style={{ color: "var(--ki-primary)" }}>Category</span>
            </h2>
            <p className="sub-title" style={{ color: "#606D76" }}>
              Select a sport category to view all registered venues, coaches, and academies.
            </p>
          </div>
          <div 
            className="d-flex overflow-auto gap-3 pt-3 pb-4 mt-4 flex-nowrap ki-category-scroll" 
            style={{ 
              scrollbarWidth: "thin", 
              scrollbarColor: "var(--ki-primary) rgba(0,0,0,0.05)",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {[
              { name: "Cricket", icon: "fas fa-baseball-ball", color: "#F97316" },
              { name: "Football", icon: "fas fa-futbol", color: "#16A34A" },
              { name: "Badminton", icon: "fas fa-table-tennis", color: "#F97316" },
              { name: "Tennis", icon: "fas fa-basketball-ball", color: "#16A34A" },
              { name: "Swimming", icon: "fas fa-swimmer", color: "#16A34A" },
              { name: "Basketball", icon: "fas fa-basketball-ball", color: "#F97316" },
              { name: "Gym & Fitness", icon: "fas fa-dumbbell", color: "#F97316" },
              { name: "Volleyball", icon: "fas fa-volleyball-ball", color: "#16A34A" }
            ].map((cat, idx) => (
              <div 
                key={idx}
                className="ki-card ki-card-hover p-4 text-center aos d-flex flex-column align-items-center justify-content-between" 
                data-aos="fade-up" 
                data-aos-delay={50 * idx}
                style={{
                  cursor: "pointer",
                  minWidth: "220px",
                  maxWidth: "220px",
                  flex: "0 0 auto",
                  background: "var(--ki-bg-surface)",
                  borderRadius: "24px",
                  border: "1px solid #E2E8E3",
                  transition: "all 0.3s ease"
                }}
                onClick={() => navigate("/sports-venue", { state: { selectedSport: { name: cat.name } } })}
              >
                <div 
                  className="category-icon-wrap d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: `rgba(${cat.color === "#F97316" ? "249,115,22" : "22,163,74"}, 0.1)`,
                    color: cat.color
                  }}
                >
                  <i className={`${cat.icon}`} style={{ fontSize: "24px" }} />
                </div>
                <h4 className="mb-1" style={{ fontSize: "18px", fontWeight: "700", fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>{cat.name}</h4>
                <p className="mb-3" style={{ fontSize: "12px", color: "#606D76" }}>
                  {cat.name === "Cricket" ? "12 Listings" : cat.name === "Football" ? "8 Listings" : cat.name === "Badminton" ? "6 Listings" : cat.name === "Tennis" ? "4 Listings" : "5 Listings"}
                </p>
                <button 
                  className="btn rounded-pill"
                  style={{
                    fontSize: "12px",
                    border: "1.5px solid #43B649",
                    color: "#3CAB4B",
                    background: "transparent",
                    fontWeight: "600",
                    padding: "4px 16px"
                  }}
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider divider-dark">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z" className="shape-fill"></path>
        </svg>
      </div>

      {/* Rental Deals */}
      <section className="section featured-venues" style={{ background: "var(--ki-bg-main)", padding: "80px 0 50px 0" }}>
        <div className="container">
          <div className="section-heading text-center aos" data-aos="fade-up">
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#17222D" }}>
              Top Rated <span style={{ color: "var(--ki-primary)" }}>Providers</span>
            </h2>
            <p className="sub-title" style={{ color: "#606D76" }}>
              Discover top rated venues, expert coaches, and personal trainers in Indore.
            </p>
          </div>

          {/* Unified Category Tabs */}
          <div className="d-flex justify-content-center mb-5 aos" data-aos="fade-up">
            <div className="btn-group p-1" style={{ background: "#F3F7F3", border: "1px solid #D6E4D8", borderRadius: "30px" }}>
              <button 
                type="button"
                onClick={() => setActiveTopRatedTab("venues")} 
                className={`btn btn-sm px-4 py-2 rounded-pill font-weight-bold transition-all ${activeTopRatedTab === "venues" ? "btn-primary text-white" : ""}`}
                style={{ fontSize: "14px", fontWeight: "700", color: activeTopRatedTab === "venues" ? "#FFFFFF" : "#17222D", background: activeTopRatedTab === "venues" ? "linear-gradient(90deg, #49BC4F, #38A941)" : "transparent" }}
              >
                Venues
              </button>
              <button 
                type="button"
                onClick={() => setActiveTopRatedTab("coaches")} 
                className={`btn btn-sm px-4 py-2 rounded-pill font-weight-bold transition-all ${activeTopRatedTab === "coaches" ? "btn-primary text-white" : ""}`}
                style={{ fontSize: "14px", fontWeight: "700", color: activeTopRatedTab === "coaches" ? "#FFFFFF" : "#17222D", background: activeTopRatedTab === "coaches" ? "linear-gradient(90deg, #49BC4F, #38A941)" : "transparent" }}
              >
                Coaches
              </button>
              <button 
                type="button"
                onClick={() => setActiveTopRatedTab("trainers")} 
                className={`btn btn-sm px-4 py-2 rounded-pill font-weight-bold transition-all ${activeTopRatedTab === "trainers" ? "btn-primary text-white" : ""}`}
                style={{ fontSize: "14px", fontWeight: "700", color: activeTopRatedTab === "trainers" ? "#FFFFFF" : "#17222D", background: activeTopRatedTab === "trainers" ? "linear-gradient(90deg, #49BC4F, #38A941)" : "transparent" }}
              >
                Personal Trainers
              </button>
            </div>
          </div>

          <div className="row">
            <div className="featured-slider-group">
              <div className="owl-carousel featured-venues-slider owl-theme">
                {activeTopRatedTab === "venues" && (
                  <Slider {...settings}>
                    {venues.map((venue, index) => (
                      <div className="featured-venues-item" key={index}>
                        <div className="listing-item home-venue border-white-10" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                          <div className="listing-img" style={{ height: "200px" }}>
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
                )}

                {activeTopRatedTab === "coaches" && (
                  <Slider {...options}>
                    {coaches.map((coach, index) => (
                      <div className="featured-venues-item" key={index}>
                        <div className="listing-item mb-0" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                          <div className="listing-img" style={{ height: "200px" }}>
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
                            <div className="fav-item-venues" style={{ top: "12px", left: "12px" }}>
                              <span className="tag tag-blue" style={{ background: "var(--ki-accent)", color: "#FFFFFF", fontWeight: "700", borderRadius: "8px", fontSize: "12px", textTransform: "uppercase" }}>
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
                )}

                {activeTopRatedTab === "trainers" && (
                  <Slider {...options}>
                    {trainer.map((train, index) => (
                      <div className="featured-venues-item" key={index}>
                        <div className="listing-item mb-0" style={{ background: "var(--ki-bg-surface)", border: "1px solid #E2E8E3", borderRadius: "24px", overflow: "hidden", margin: "10px", boxShadow: "var(--ki-shadow-card)" }}>
                          <div className="listing-img" style={{ height: "200px" }}>
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
                            <div className="fav-item-venues" style={{ top: "12px", left: "12px" }}>
                              <span className="tag tag-blue" style={{ background: "var(--ki-accent)", color: "#FFFFFF", fontWeight: "700", borderRadius: "8px", fontSize: "12px", textTransform: "uppercase" }}>
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
                )}
              </div>
            </div>
          </div>

          {/* Unified View All Button */}
          <div className="view-all text-center mt-5 mb-5 aos" data-aos="fade-up">
            <Link
              to={activeTopRatedTab === "venues" ? routes.blogListSidebarLeft : activeTopRatedTab === "coaches" ? routes.coachesGrid : routes.blogList}
              className="btn btn-primary d-inline-flex align-items-center px-4 py-2"
              style={{ borderRadius: "12px" }}
            >
              {activeTopRatedTab === "venues" ? "View All Sports Venues" : activeTopRatedTab === "coaches" ? "View All Coaches" : "View All Personal Trainers"}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* /Rental Deals */}

      {/* Services */}
      {/* <section className="section service-section">
        <div className="work-cock-img">
          <ImageWithBasePath
            src="assets/img/icons/work-cock.svg"
            alt="Service"
          />
        </div>
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Explore Our <span>Services</span>
            </h2>
            <p className="sub-title">
              Fostering excellence and empowering sports growth through tailored
              services for athletes, coaches, and enthusiasts.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="service-grid w-100 aos" data-aos="fade-up">
                <div className="service-img">
                  <Link to={routes.blogListSidebarLeft}>
                    <ImageWithBasePath
                      src="assets/img/services/service-01.jpg"
                      className="img-fluid"
                      alt="Service"
                    />
                  </Link>
                </div>
                <div className="service-content">
                  <h4>
                    <Link to={routes.blogListSidebarLeft}>Court Rent</Link>
                  </h4>
                  <Link to={routes.blogListSidebarLeft}>Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="service-grid w-100 aos" data-aos="fade-up">
                <div className="service-img">
                  <Link to={routes.serviceDetail}>
                    <ImageWithBasePath
                      src="assets/img/services/service-02.jpg"
                      className="img-fluid"
                      alt="Service"
                    />
                  </Link>
                </div>
                <div className="service-content">
                  <h4>
                    <Link to={routes.serviceDetail}>Group Lesson</Link>
                  </h4>
                  <Link to={routes.serviceDetail}>Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="service-grid w-100 aos" data-aos="fade-up">
                <div className="service-img">
                  <Link to={routes.coachesGrid}>
                    <ImageWithBasePath
                      src="assets/img/services/service-03.jpg"
                      className="img-fluid"
                      alt="Service"
                    />
                  </Link>
                </div>
                <div className="service-content">
                  <h4>
                    <Link to={routes.coachesGrid}>Training Program</Link>
                  </h4>
                  <Link to={routes.coachesGrid}>Learn More</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="service-grid w-100 aos" data-aos="fade-up">
                <div className="service-img">
                  <Link to={routes.blogList}>
                    <ImageWithBasePath
                      src="assets/img/services/service-04.jpg"
                      className="img-fluid"
                      alt="Service"
                    />
                  </Link>
                </div>
                <div className="service-content">
                  <h4>
                    <Link to={routes.blogList}>Private Lessons</Link>
                  </h4>
                  <Link to={routes.blogList}>Learn More</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="view-all text-center aos" data-aos="fade-up">
            <Link
              to={routes.services}
              className="btn btn-secondary d-inline-flex align-items-center"
            >
              View All Services{" "}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
          </div>
        </div>
      </section> */}
      {/* /Services */}

      {/* Convenient */}
      <section className="section convenient-section">
        <div className="cock-img">
          <div className="cock-img-one">
            {/* <ImageWithBasePath src="assets/img/icons/cock-01.svg" alt="Icon" /> */}
          </div>
          <div className="cock-img-two">
            {/* <ImageWithBasePath src="assets/img/icons/cock-02.svg" alt="Icon" /> */}
          </div>
          {/* <div className="cock-circle">
            <ImageWithBasePath src="assets/img/new-img08.png" alt="Icon" />
          </div> */}
        </div>
        <div className="container">
          <div className="convenient-content aos" data-aos="fade-up">
            <h2 style={{ color: "#17222D", fontFamily: "Space Grotesk, sans-serif" }}>Convenient &amp; Flexible Scheduling</h2>
            <p style={{ color: "#606D76" }}>
              Find and book coaches conveniently with our online system that
              matches your schedule and location.
            </p>
          </div>
          <div className="convenient-btns aos" data-aos="fade-up">
            <Link
              to={routes.blogList}
              className="btn btn-primary d-inline-flex align-items-center"
            >
              Book a Training{" "}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
            <Link
              to={routes.coachesGrid}
              className="btn btn-secondary d-inline-flex align-items-center"
            >
              Book a Coach{" "}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* /Convenient */}


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
                    Become a Venue Member
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
                    Become a Certified Coach
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
