import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import AOS from "aos";
import "aos/dist/aos.css";
import Select from "react-select";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import { COffcanvasTitle } from "@coreui/react";
import { COffcanvasHeader } from "@coreui/react";
import { COffcanvasBody } from "@coreui/react";
import { COffcanvas } from "@coreui/react";
import { CButton, CCloseButton } from "@coreui/react";
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
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [venues, setVenues] = useState<Venues[]>([]);
  const [selectedLocationSort, setSelectedLocationSort] = useState<string>();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);

  // const { id } = props;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    first_name: "",
    mobile: "",
    email: "",
    subject: "Quick Enquiry",
    comments: "",
  });

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
  const sortOptions = [
    { name: "Vijay Nagar" },
    { name: "Palasia" },
    { name: "Rajendra Nagar" },
    { name: "Navlakha" },
    { name: "MG Road" },
    { name: "Geeta Bhawan Square" },
    { name: "Tower Square" },
    { name: "Rajwada" },
    { name: "Regal Square" },
    { name: "Bhawarkuan Square" },
    { name: "Khajrana Square" },
    { name: "Patnipura Square" },
    { name: "IT Park" },
    { name: "Rajiv Gandhi" },
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

  const navigateToPage = () => {
    if (selectedTimeframe?.name === "Coaches") {
      navigate("/coaches", { state: { selectedLocationSort } });
    } else if (selectedTimeframe?.name === "Personal Trainer") {
      navigate("/personal-training", { state: { selectedLocationSort } });
    } else if (selectedTimeframe?.name === "Sports Venue") {
      navigate("/sports-venue", { state: { selectedLocationSort } });
    }
    // else {
    //   Swal.fire({
    //     title: "Invalid Selection",
    //     text: "Please select a category before proceeding.",
    //     icon: "warning",
    //     timer: 5000,
    //     showConfirmButton: false,
    //   });
    // }
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
      <section className="hero-section top-margin">
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
          <div className="home-banner">
            <div className="row align-items-center w-100">
              <div className="col-lg-7 col-md-10 mx-auto">
                <div className="section-search aos" data-aos="fade-up">
                  <h4>World Class Coaches &amp; Premium Courts</h4>
                  <h1>
                    Choose Your <span>Coaches</span> and Start Your Training
                  </h1>
                  <p className="sub-info">
                    Unleash Your Athletic Potential with Expert Coaching,
                    State-of-the-Art Facilities, and Personalized Training
                    Programs.
                  </p>
                  <div className="search-box">
                    <form>
                      <div className="search-input line">
                        <div
                          className="form-group mb-0"
                          style={{ width: "219px" }}
                        >
                          <label>Search for</label>
                          <Dropdown
                            value={selectedTimeframe}
                            onChange={(e) => setSelectedTimeframe(e.value)}
                            options={timeframeOptions}
                            optionLabel="name"
                            placeholder="Choose venue/coach"
                            className="select custom-select-list"
                          />
                        </div>
                      </div>

                      <div className="search-input">
                        <div
                          className="form-group mb-0"
                          style={{ width: "219px" }}
                        >
                          <label>Location</label>
                          <Dropdown
                            value={selectedLocationSort}
                            onChange={(e) => setSelectedLocationSort(e.value)}
                            options={sortOptions}
                            optionLabel="name"
                            placeholder="Choose Location"
                            className="select custom-select-list w-100"
                          />
                        </div>
                      </div>

                      <div className="search-btn">
                        <button
                          className="btn"
                          onClick={navigateToPage}
                          disabled={!selectedTimeframe} // Disable if no selection

                          // type="submit"
                        >
                          <i className="feather-search" />
                          <span className="search-text">Search</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="banner-imgs text-center aos" data-aos="fade-up">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="assets/img/khelo-Indore-Logo.png"
                    alt="Banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
            <h2>
              How It <span>Works</span>
            </h2>
            <p className="sub-title">
              Simplifying the booking process for coaches, venues, and athletes.
            </p>
          </div>
          <div className="row justify-content-center ">
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid w-100 aos" data-aos="fade-up">
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
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid w-100 aos" data-aos="fade-up">
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
              <div className="work-grid w-100 aos" data-aos="fade-up">
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
          </div>
        </div>
      </section>

      {/* Rental Deals */}
      <section className="section featured-venues">
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Top Rated <span>Venues</span>
            </h2>
            <p className="sub-title">
              Advanced sports venues offer the latest facilities, dynamic and
              unique environments for enhanced sports performance.
            </p>
          </div>
          <div className="row">
            <div className="featured-slider-group ">
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...settings}>
                  {/* Featured Item */}
                  {venues.map((venue, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item home-venue">
                        <div className="listing-img">
                          <div
                            className="background-image"
                            style={{
                              backgroundImage: `url(${
                                venue?.images[0]?.src
                                  ? `${IMG_URL}${venue?.images[0]?.src}`
                                  : "/assets/img/no-img.png"
                              })`,
                            }}
                          ></div>
                          <Link
                            to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                          >
                            <ImageWithBasePath
                              src={
                                venue?.images[0]?.src
                                  ? `${IMG_URL}${venue?.images[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              className="img-fluid foreground-image"
                              alt="Venue"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">
                              {/* {venue.category &&
                                venue.category
                                  .split(",")
                                  .map((category) => category.trim())
                                  .join(", ")} */}
                              {venue.vendor_type}
                            </span>

                            {/* <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                                key={3}
                                onClick={() => handleItemClick(3)}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div> */}
                          </div>
                        </div>
                        <div className="listing-content home-venue news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              {/* <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                alt="User"
                              />
                              Orlando Waters
                            </Link> */}
                              {venue.activities}
                              <span>
                                {/* <i className="feather-calendar" />
                              15 May 2023 */}
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link
                              to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                            >
                              {venue.name}{" "}
                            </Link>
                          </h3>
                          <p>
                            <i className="feather-map-pin me-2" />
                            {venue?.near_by_location}
                          </p>
                          {/* <div className="listing-button read-new">
                          <ul className="nav">
                            <li>
                              <Link to="#">
                                <i className="feather-heart" />
                                45
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                <i className="feather-message-square" />
                                40
                              </Link>
                            </li>
                          </ul>
                          <span>
                            <ImageWithBasePath
                              src="assets/img/icons/clock.svg"
                              alt=""
                            />
                            10 Min To Read
                          </span>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* /Featured Item */}
                </Slider>
              </div>
            </div>
          </div>
          {/* View More */}
          <div className="view-all text-center aos" data-aos="fade-up">
            <Link
              to={routes.blogListSidebarLeft}
              className="btn btn-secondary d-inline-flex align-items-center"
            >
              View All Sports Venue
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
          </div>
          {/* View More */}
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
            <h2>Convenient &amp; Flexible Scheduling</h2>
            <p>
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

      {/* Featured Coaches */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Top Rated <span>Coaches</span>
            </h2>
            <p className="sub-title">
              Uplift your game with our featured coaches, personalized
              instruction, and expertise to achieve your goals.
            </p>
          </div>
          <div className="row">
            <div className="featured-slider-group aos" data-aos="fade-up">
              <div className="owl-carousel featured-coache-slider owl-theme">
                <Slider {...options}>
                  {/* Featured Item */}
                  {coaches.map((coach, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item mb-0">
                        <div
                          className="listing-img"
                          style={{ height: "231px" }}
                        >
                          <Link
                            to={`/coaches/${coach?.category?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                          >
                            <ImageWithBasePath
                              src={
                                coach?.profile_picture[0]?.src
                                  ? `${IMG_URL}${coach?.profile_picture[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <span className="tag tag-blue">
                              {coach.trainer_type}
                            </span>
                            {/* <div className="list-reviews coche-star">
                              <Link to="#" className="fav-icon">
                                <i className="feather-heart" />
                              </Link>
                            </div> */}
                          </div>
                        </div>
                        <div className="listing-content list-coche-content">
                          {/* <span><i className="feather-map-pin me-2" />{coach?.near_by_location}</span> */}
                          <h3>
                            {/* <Link to={routes.coachDetail}>Kevin Anderson</Link> */}

                            <Link
                              to={`/coaches/${coach?.category?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                            >
                              {coach?.first_name} {coach?.last_name}
                            </Link>
                          </h3>
                          <Link to={`/coaches/coach-detail/${coach._id}`}>
                            <i className="feather-arrow-right" />
                          </Link>
                          <Link
                            to={`/coaches/coach-detail/${coach._id}`}
                            className="icon-hover"
                          >
                            <i className="feather-calendar" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div className="view-all text-center aos" data-aos="fade-up">
            <Link
              to={routes.coachesGrid}
              className="btn btn-secondary d-inline-flex align-items-center"
            >
              View All Coaches{" "}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
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
                    to={routes.register}
                    className="btn btn-primary d-inline-flex align-items-center"
                  >
                    <span>
                      <i className="feather-user-plus me-2" />
                    </span>
                    Join With Us
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
          <div className="row">
            <div className="col-md-6">
              <div className="private-venue aos" data-aos="fade-up">
                <div className="convenient-btns become-owner " role="tablist">
                  <Link
                    to={routes.register}
                    className="btn btn-secondary become-venue d-inline-flex align-items-center nav-link active"
                    id="nav-Recent-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-Recent"
                    role="tab"
                    aria-controls="nav-Recent"
                    aria-selected="true"
                  >
                    Become A Venue Member
                  </Link>
                  <Link
                    to={routes.register}
                    className="btn btn-primary become-coche d-inline-flex align-items-center nav-link"
                    id="nav-RecentCoaching-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-RecentCoaching"
                    role="tab"
                    aria-controls="nav-RecentCoaching"
                    aria-selected="false"
                  >
                    Become A Coach
                  </Link>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Recent"
                    role="tabpanel"
                    aria-labelledby="nav-Recent-tab"
                    tabIndex={0}
                  >
                    <h2>
                      Earn Money Renting Out Your Private Venues On KheloIndore
                    </h2>
                    <p>
                      Join our network of private facility owners, offering
                      rentals to local players, coaches, and teams.
                    </p>
                    <div className="earn-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          ₹1,000,000 liability insurance{" "}
                        </li>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          Build of Trust
                        </li>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          Protected Environment for Your Activities{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="convenient-btns">
                      <Link
                        to={routes.register}
                        className="btn btn-secondary d-inline-flex align-items-center"
                      >
                        <span className="lh-1">
                          <i className="feather-user-plus me-2" />
                        </span>
                        Join With Us
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show "
                    id="nav-RecentCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-Recent-tab"
                    tabIndex={0}
                  >
                    <h2>
                      Earn Money Renting Out Your Private Coaches On KheloIndore
                    </h2>
                    <p>
                      Join our network of private facility owners, offering
                      rentals to local players, coaches, and teams.
                    </p>
                    <div className="earn-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          ₹1,000,000 liability insurance{" "}
                        </li>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          Build of Trust
                        </li>
                        <li>
                          <i className="fa-solid fa-circle-check " />
                          Protected Environment for Your Activities{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="convenient-btns">
                      <Link
                        to={routes.register}
                        className="btn btn-secondary d-inline-flex align-items-center"
                      >
                        <span className="lh-1">
                          <i className="feather-user-plus me-2" />
                        </span>
                        Join With Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Earn Money */}

      {/* Courts Near */}
      <section className="section court-near">
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              Top Rated <span>Personal Trainer</span>
            </h2>
            <p className="sub-title">
              Discover Personal Trainer for convenient and accessible gameplay.
            </p>
          </div>
          <div className="row">
            <div className="featured-slider-group aos" data-aos="fade-up">
              <div className="owl-carousel featured-coache-slider owl-theme">
                <Slider {...options}>
                  {/* Featured Item */}
                  {trainer.map((trainer, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                      <div className="featured-venues-item">
                        <div className="listing-item listing-item-grid">
                          <div
                            className="listing-img"
                            style={{ height: "240px" }}
                          >
                            {/* <Link to={routes.coachDetail}>
                        <ImageWithBasePath
                          src={`assets/img/featured/${coach.profile}`}
                          alt="Venue"
                        />
                      </Link> */}

                            <Link
                              to={`/personal-training/trainer/${trainer.first_name.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                            >
                              <ImageWithBasePath
                                src={
                                  trainer?.profile_picture[0]?.src
                                    ? `${IMG_URL}${trainer?.profile_picture[0]?.src}`
                                    : "/assets/img/no-img.png"
                                }
                                alt="user"
                              />
                            </Link>

                            <div
                              className="fav-item-venues"
                              onClick={() => handleItemClick(index)}
                            >
                              <span className="tag tag-blue">
                                {trainer.trainer_type}
                              </span>
                              {/* <div className="list-reviews coche-star">
                                <Link
                                  to="#"
                                  className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                    }`}
                                >
                                  <i className="feather-heart" />
                                </Link>
                              </div> */}
                            </div>
                            {/* <div className="hour-list">
                              <h5 className="tag tag-primary">
                                ₹{trainer.price} <span>/hr</span>
                              </h5>
                            </div> */}
                          </div>
                          <div className="listing-content home-trainer">
                            <h3 className="listing-title">
                              <Link
                                to={`/personal-training/trainer/${trainer.first_name.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                              >
                                {trainer.first_name} {trainer.last_name}
                              </Link>
                            </h3>
                            {/* <ul className="mb-2">
                              <li>
                                <span><i className="feather-map-pin me-2" />{trainer.near_by_location}</span>
                              </li>
                            </ul> */}
                            <div className="listing-details-group">
                              <p>specializations: {trainer.specializations}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          {/* View More */}
          <div className="view-all text-center aos" data-aos="fade-up">
            <Link
              to={routes.blogList}
              className="btn btn-secondary d-inline-flex align-items-center"
            >
              View All Personal Trainer{" "}
              <span className="lh-1">
                <i className="feather-arrow-right-circle ms-2" />
              </span>
            </Link>
          </div>
          {/* View More */}
        </div>
      </section>
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
                          <Link to="#">Ariyan Rusov</Link>
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
                          <Link to="#">Darren Valdez</Link>
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
                          <Link to="#">Elinor Dunn</Link>
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
                          <Link to="#">Darren Valdez</Link>
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
