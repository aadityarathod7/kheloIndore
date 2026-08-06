import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Slider from "react-slick";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import Lightbox from "yet-another-react-lightbox";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { sanitizeHtml } from "../../utils/sanitize";

interface TrainerData {
  first_name: any;
  last_name: any;
  duration: string;
  focus_area: any;
  price: number;
  profile_picture: any;
  src: string;
  specializations: string[];
  experience: string;
  location: any;
  gallery: any;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  gender: string;
  email: string;
  trainer_type: string;
  venue: string;
  bio: string;
  policiesAndRules: string;
  skills: string;
  qualifications: string;
}
// Other properties...

const PersonalTrainingDetails = (props: any) => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [open, setOpen] = React.useState(false);
  const [trainerData, setTrainerData] = useState<TrainerData>();
  const idData = useParams();
  const id = idData.id;
  const name = idData.name;
  const type = idData.type;

  const navigate = useNavigate();



  const [selectedCity, setSelectedCity] = useState();
  const cityOptions = [
    { name: "Select City" },
    { name: "Toronto" },
    { name: "Texas" },
  ];
  const [selectedSort, setSelectedSort] = useState<string>();
  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];

  useEffect(() => {
    // Fetch coach data from API

    const fetchTrainerId = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/PersonalTraining/fetch/${id}`
        );
        const trainerDataId = response.data.personalTrainer;
        setTrainerData(trainerDataId);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchTrainerId();
  }, []);
  useEffect(() => {
    document.title = `personal-training - ${type}/${name}/${id}}`;
  }, []);

  const featuredVenuesSlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const scrollContent = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  function removeHtmlTags(text: string | undefined): string {
    const doc = new DOMParser().parseFromString(text || '', 'text/html'); // Default to empty string if undefined
    return doc.body.textContent || "";
  }

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/personal-training/training-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: location.pathname } }
      )
    }
  }

  return (
    <div className="venue-coach-details coach-detail top-margin" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7" style={{ textAlign: "left" }}>
              <span style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.15", marginBottom: "16px", display: "flex", alignItems: "center", flexWrap: "wrap" as const }}>
                <span style={{ color: "#22C55E", marginRight: "12px" }}>Trainer</span> Details
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>
                {trainerData?.first_name ? `${trainerData.first_name} ${trainerData.last_name || ""}` : "View trainer profile and book your session"}
              </p>
              
              {/* Breadcrumb pill */}
              <div style={{ display: "inline-flex", alignItems: "center", background: "#FFFFFF", padding: "8px 16px", borderRadius: "50px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home" style={{ color: "#64748B", marginRight: "4px" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <Link to="/personal-training" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Trainers</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      <style dangerouslySetInnerHTML={{__html: `
        .venue-coach-details, .venue-coach-details *, .venue-coach-details span, .venue-coach-details p, .venue-coach-details li {
          color: #334155 !important;
        }
        .venue-coach-details h1, .venue-coach-details h2, .venue-coach-details h3, .venue-coach-details h4, .venue-coach-details h5, .venue-coach-details h6,
        .venue-coach-details h1 *, .venue-coach-details h2 *, .venue-coach-details h3 *, .venue-coach-details h4 *, .venue-coach-details h5 *, .venue-coach-details h6 * {
          color: #0F172A !important;
          font-weight: 700 !important;
        }
        .venue-coach-details a, .venue-coach-details a span {
          color: #334155 !important;
        }
        .venue-coach-details a:hover {
          color: #22C55E !important;
        }
        .venue-coach-details a.btn, .venue-coach-details button.btn,
        .venue-coach-details a.btn *, .venue-coach-details button.btn * {
          color: #FFFFFF !important;
        }
        .venue-coach-details .active, .venue-coach-details .active * {
          color: #22C55E !important;
        }
        .venue-options {
          margin-top: 30px !important;
        }
        .top-margin {
          margin-top: 0px !important;
          padding-top: 0px !important;
        }
        /* Custom Modern Coach Info Card to prevent overlaps */
        .coach-info {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          padding: 24px !important;
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) !important;
          margin-bottom: 24px !important;
        }
        .coach-info .profile-pic {
          width: 120px !important;
          height: 120px !important;
          min-width: 120px !important;
          margin-right: 24px !important;
          overflow: hidden !important;
          border-radius: 12px !important;
          position: static !important;
        }
        .coach-info .profile-pic img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          margin: 0 !important;
          position: static !important;
        }
        /* Sidebar booking card redesigned for light green turf theme */
        .venue-coach-details .book-coach {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
          padding: 24px !important;
        }
        .venue-coach-details .book-coach h4,
        .venue-coach-details .book-coach h4 * {
          color: #0F172A !important;
          border-bottom-color: #E2E8F0 !important;
        }
        .venue-coach-details .book-coach p,
        .venue-coach-details .book-coach span,
        .venue-coach-details .book-coach strong {
          color: #334155 !important;
        }
        .venue-coach-details .book-coach .dull-bg {
          background-color: #F0FDF4 !important;
          border: 1px solid #DCFCE7 !important;
          border-radius: 12px !important;
          padding: 16px !important;
        }
        .venue-coach-details .book-coach .dull-bg * {
          color: #166534 !important;
        }
        .venue-coach-details .book-coach .dull-bg h4.primary-text {
          color: #22C55E !important;
          font-weight: 800 !important;
        }
        .venue-coach-details .book-coach a.btn-secondary,
        .venue-coach-details .book-coach button.btn-secondary,
        .venue-coach-details .book-coach button {
          background-color: #22C55E !important;
          border-color: #22C55E !important;
          color: #FFFFFF !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
          padding: 12px !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        .venue-coach-details .book-coach a.btn-secondary:hover,
        .venue-coach-details .book-coach button.btn-secondary:hover,
        .venue-coach-details .book-coach button:hover {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
          color: #FFFFFF !important;
        }
        .venue-coach-details .book-coach a.btn-secondary i,
        .venue-coach-details .book-coach button.btn-secondary i,
        .venue-coach-details .book-coach button i {
          color: #FFFFFF !important;
          margin-right: 8px !important;
        }
        /* Make sidebar wrappers transparent to prevent any dark block showing through */
        .stickybar, .theiaStickySidebar, .theiaStickySidebarCon {
          background-color: transparent !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
      `}} />
      {/* Page Content */}
      <div className="content">
        <div className="container">
          {/* Row */}
          <div className="row g-4" style={{ paddingTop: "32px", position: "relative", zIndex: 10 }}>
            {/* {trainerData.map((coachId,index)=>(   */}
            <div className="col-12 col-sm-12 col-md-12 col-lg-8">
              <div className="dull-bg corner-radius-10 coach-info d-md-flex justify-content-start align-items-start">
                <div className="profile-pic">
                  <Link to="#;">
                    <ImageWithBasePath
                      alt="User"
                      className="corner-radius-10"
                      // src="/assets/img/profiles/avatar-coach-detail.jpg"

                      src={
                        trainerData?.profile_picture
                          ? `${IMG_URL}${trainerData?.profile_picture?.[0]?.src}`
                          : "/assets/img/featured/featured-06.jpg"
                      }
                    />
                  </Link>
                </div>
                <div className="info w-100">
                  <div className="d-sm-flex justify-content-between align-items-start">
                    <h3 className="d-flex align-items-center justify-content-start mb-0">
                      {trainerData?.first_name} &nbsp;{trainerData?.last_name}
                      <span className="d-flex justify-content-center align-items-center">
                        <i className="fas fa-check-double" />
                      </span>
                    </h3>
                    {/* <Link to="#">
                      <span className="favourite fav-icon">
                        <i className="feather-star" />
                        Favourite
                      </span>
                    </Link> */}
                  </div>
                  {/* <p>
                    Trainer {trainerData?.first_name} provides
                    lessons in Santa Monica at Penmar Park
                  </p> */}
                  {/* <ul className=" align-items-center">
                    <li className="d-flex align-items-center">
                      <div className="white-bg d-flex align-items-center review">
                       
                        <span>specializations : </span>
                        
                        <span>
                          &nbsp;
                          {trainerData?.specializations &&
                            trainerData?.specializations.map((area: any, index: number) =>
                              index > 0 ? `, ${area}` : area
                            )
                              .join("")}
                        </span>
                      </div>
                    </li>
                    <li className="d-flex align-items-center">
                      <div className="white-bg d-flex align-items-center review">
                        <span>Location: {trainerData?.location?.address}, {trainerData?.location?.city}, {trainerData?.location?.state}
                          , {trainerData?.location?.zipcode}
                        </span>
                      </div>
                    </li>
                    <li> */}
                  {/* <ImageWithBasePath
                        src="assets/img/icons/flag-01.png"
                        alt="Icon"
                      /> */}
                  {/* {trainerData?.location?.address}, {trainerData?.location?.city}, {trainerData?.location?.state},{trainerData?.location?.zipCode} */}
                  {/* {coachData?.location?.city} */}
                  {/* </li>
                  </ul> */}
                  <hr />
                  {/* <ul className="d-xl-flex">
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/expert.svg"
                        alt="Icon"
                      />
                      Rank : Expert
                    </li>
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/sessions.svg"
                        alt="Icon"
                      />
                      Sessions Completed : 25
                    </li>
                    <li className="d-flex align-items-center">
                      <ImageWithBasePath
                        src="/assets/img/icons/since.svg"
                        alt="Icon"
                      />
                      With KheloIndore Since Apr 5, 2023
                    </li>
                  </ul> */}
                </div>
              </div>
              <div className="venue-options white-bg mb-4">
                <ul className="clearfix">
                  <li className="active">
                    <Link onClick={() => scrollContent("short-bio")} to={""}>
                      Trainer Details
                    </Link>
                  </li>
                  {/* <li>
                    <Link onClick={() => scrollContent("basic-info")} to={""}>
                      Lesson With Me
                    </Link>
                  </li> */}
                  <li>
                    <Link onClick={() => scrollContent("bio")} to={""}>
                      Bio
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("experience")} to={""}>
                      Experience
                    </Link>
                  </li>

                  <li>
                    <Link
                      onClick={() => scrollContent("specialization")}
                      to={""}
                    >
                      Specialization
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("rules")} to={""}>
                      Policies & Rules
                    </Link>
                  </li>
                  {/* <li>
                    <Link onClick={() => scrollContent("training")} to={""}>
                      Gallery
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link onClick={() => scrollContent("reviews")} to={""}>
                      Reviews
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link onClick={() => scrollContent("location")} to={""}>
                      Location
                    </Link>
                  </li> */}
                </ul>
              </div>
              {/* Accordian Contents */}
              <div className="accordion" id="accordionPanel">
                <div className="accordion-item mb-4" id="short-bio">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-short-bio"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      Trainer Details
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-short-bio"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        <p className="mb-4">
                          Name: {trainerData?.first_name}{" "}
                          {trainerData?.last_name}
                        </p>
                        <p className="mb-4">Gender: {trainerData?.gender}</p>

                        <p className="mb-4">
                          Trainer Type: {trainerData?.trainer_type}
                        </p>

                        <p className="mb-4">
                          Location: {trainerData?.address}, {trainerData?.city},{" "}
                          {trainerData?.state}, {trainerData?.zipcode}
                        </p>
                        {trainerData?.venue ? <p className="mb-4">Venue: {trainerData?.venue}</p> : ""}
                        <p className="mb-4">
                          Qualifications: {trainerData?.qualifications}
                        </p>
                        {trainerData?.skills ? <p className="mb-4">Skills: {trainerData?.skills}</p> : ""}
                        <p className="mb-4">Price: {trainerData?.price}</p>
                      </div>
                      {/* <div className="show-more d align-items-center primary-text">
                        <i className="feather-plus-circle" />
                        Show More
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* <div className="accordion-item mb-4" id="coaching">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-lesson-with-me"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      Lesson With Me
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-lesson-with-me"
                  >
                    <div className="accordion-body">
                      <p>
                        Join me for personalized lessons tailored to your needs.
                        Choose from individual, 2-player, or group lessons for a
                        customized experience.Heighten your skills and
                        relish the process of getting better.
                      </p>
                      <ul className="clearfix">
                        <li>
                          <i className="feather-check-square" />
                          Single Lesson
                        </li>
                        <li>
                          <i className="feather-check-square" />2 Player Lesson
                        </li>
                        <li>
                          <i className="feather-check-square" />
                          Small Group Lesson
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                <div className="accordion-item mb-4" id="bio">
                  <h4 className="accordion-header" id="panelsStayOpen-bio">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      Bio
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-coaching"
                  >
                    <div className="accordion-body">
                      {/* <p>{removeHtmlTags(trainerData?.bio)}</p> */}
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(trainerData?.bio) }} />
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-4" id="experience">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-experience"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      Experience
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-experience"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        <p className="mb-4">
                          {trainerData?.experience} years of experience coaching
                          at various skill levels.
                        </p>
                      </div>
                      {/* <div className="show-more d align-items-center primary-text">
                        <i className="feather-plus-circle" />
                        Show More
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-4" id="specialization">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-specialization"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFour"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseFour"
                    >
                      Specializations
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-specialization"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        <p className="mb-0">
                          {trainerData?.specializations &&
                            trainerData?.specializations
                              .map((area: any, index: number) =>
                                index > 0 ? `, ${area}` : area
                              )
                              .join("")}
                        </p>
                      </div>
                      {/* <div className="show-more d align-items-center primary-text">
                        <i className="feather-plus-circle" />
                        Show More
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="rules">
                  <h4 className="accordion-header" id="panelsStayOpen-rules">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      Policies & Rules
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-rules"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        {/* <p className="mb-4">{removeHtmlTags(trainerData?.policiesAndRules)}</p> */}
                        <div className="mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(trainerData?.policiesAndRules) }} />

                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="accordion-item mb-4" id="gallery">
                  <h4 className="accordion-header" id="panelsStayOpen-gallery">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      Gallery
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-gallery"
                  >
                    <div className="accordion-body">
                      <div className="gallery-slider owl-theme">
                        <Slider {...featuredVenuesSlider}>
                          {trainerData?.gallery?.map((trainer: any, index: any) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                              <div className="featured-venues-item">
                                <div className="listing-item listing-item-grid">
                                  <div
                                    className="listing-img"
                                    style={{ height: "300px" }}
                                  >
                                    <Link to={routes.personalTrainingDetails}>
                                      <ImageWithBasePath
                                        src={
                                          trainer
                                            ? `${IMG_URL}${trainer.src}`
                                            :
                                            "assets/img/profiles/avatar-06.jpg"
                                        }
                                      />
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
                </div> */}
                {/* <div className="accordion-item mb-4" id="reviews">
                  <div className="accordion-header" id="panelsStayOpen-reviews">
                    <div
                      className="accordion-button d-flex justify-content-between align-items-center"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSix"
                      aria-controls="panelsStayOpen-collapseSix"
                    >
                      <span className="w-75 mb-0">Reviews</span>
                    </div>
                    <Link
                      to="#;"
                      className="btn btn-gradient pull-right write-review add-review"
                      data-bs-toggle="modal"
                      data-bs-target="#add-review"
                    >
                      Write a review
                    </Link>
                  </div>
                  <div
                    id="panelsStayOpen-collapseSix"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-reviews"
                  >
                    <div className="accordion-body">
                      <div className="row review-wrapper">
                        <div className="col-lg-3">
                          <div className="ratings-info corner-radius-10 text-center">
                            <h3>4.8</h3>
                            <span>out of 5.0</span>
                            <div className="rating">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-9">
                          <div className="recommended">
                            <h5>Recommended by 97% of Players</h5>
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">Quality of service</p>
                                <ul>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <i />
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-01.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </div>
                        <div className="review-info">
                          <h6 className="mb-2 tittle">
                            Amanda Booked on 06/04/2023
                          </h6>
                          <div className="rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <span>5.0</span>
                          </div>
                          <span className="success-text">
                            <i className="feather-check" />
                            Yes, I would book again.
                          </span>
                          <h6>Absolutely Perfect</h6>
                          <p>
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
                          </p>
                          <ul className="d-flex">
                            <Lightbox
                              open={open}
                              close={() => setOpen(false)}
                              slides={[
                                { src: "/assets/img/gallery/gallery-01.jpg" },
                                { src: "/assets/img/gallery/gallery-02.jpg" },
                                { src: "/assets/img/gallery/gallery-03.jpg" },
                                { src: "/assets/img/gallery/gallery-04.jpg" },
                                { src: "/assets/img/gallery/gallery-05.jpg" },
                              ]}
                            />
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-01.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-01.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-02.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-02.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-03.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-03.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-04.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-04.jpg"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="assets/img/gallery/gallery-thumb-05.jpg"
                                data-fancybox="gallery"
                                onClick={() => setOpen(true)}
                              >
                                <ImageWithBasePath
                                  className="img-fluid"
                                  alt="Image"
                                  src="/assets/img/gallery/gallery-05.jpg"
                                />
                              </Link>
                            </li>
                          </ul>
                          <span className="post-date">Sent on 11/03/2023</span>
                        </div>
                      </div>
                    
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-06.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </div>
                        <div className="review-info">
                          <h6 className="mb-2 tittle">
                            Amanda Booked on 06/04/2023
                          </h6>
                          <div className="rating">
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <i className="fas fa-star filled" />
                            <span className="">5.0</span>
                          </div>
                          <span className="warning-text">
                            <i className="feather-x" />
                            No, I dont want to book again.
                          </span>
                          <h6>Awesome. Its very convenient to play.</h6>
                          <p>
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
                          </p>
                          <div className="dull-bg">
                            <p>
                              Experience badminton excellence at Badminton
                              Academy. Top-notch facilities, well-maintained
                              courts, and a friendly atmosphere. Highly
                              recommended for an exceptional playing experience
                            </p>
                          </div>
                        </div>
                      </div>
                    
                      <div className="d-flex justify-content-center">
                        <button
                          type="button"
                          className="btn btn-load-more d-flex justify-content-center align-items-center"
                        >
                          Load More
                          <i className="feather-plus-square" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="accordion-item mb-0" id="location">
                  <h4 className="accordion-header" id="panelsStayOpen-location">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSeven"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseSeven"
                    >
                      Location
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseSeven"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-location"
                  >
                    <div className="accordion-body">
                      <div className="google-maps">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                          height={445}
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="dull-bg d-flex justify-content-start align-items-center mb-0">
                        <div className="white-bg me-2">
                          <i className="fas fa-location-arrow" />
                        </div>
                        <div className="">
                          <h6>Our Venue Location</h6>
                          <p>70 Bright St New York, USA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              {/* Accordian Contents */}
            </div>
            {/* ))} */}
            <aside className="col-12 col-sm-12 col-md-12 col-lg-4 theiaStickySidebar">
              <div className="stickybar">
                <div className="white-bg book-coach">
                  <h4 className="border-bottom">Book A Trainer</h4>
                  <p>
                    <strong>{trainerData?.first_name}</strong> Available Now{" "}
                  </p>
                  <div className="dull-bg text-center">
                    <p className="mb-1">Start’s From</p>
                    <h4 className="d-inline-block primary-text mb-0">
                      ₹{trainerData?.price}
                    </h4>
                    <span>/hr</span>
                  </div>
                  <div className="d-grid mt-3">
                    <button
                      onClick={() => checkToken(id)}
                      className="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                    >
                      <i className="feather-calendar" />
                      Book Now
                    </button>
                  </div>
                </div>
                {/* <div className="white-bg next-availability">
                  <div className="d-flex justify-content-start align-items-center">
                    <span className="icon-bg-40 d-flex justify-content-center align-items-center">
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Icon"
                        src="/assets/img/icons/head-calendar.svg"
                      />
                    </span>
                    <h4 className="mb-0">Next Availability</h4>
                  </div>
                  <ul className="clearfix">
                    <li>Thu, Sept 24 @ 3 PM</li>
                    <li>Fri, Sept 25 @ 3 PM</li>
                    <li>Sat, Sept 26 @ 3 PM</li>
                    <li>Sun, Sept 27 @ 3 PM</li>
                  </ul>
                </div> */}
                {/* <div className="white-bg">
                  <h4 className="border-bottom">Request for Availability</h4>
                  <form>
                    <div className="mb-10">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter Name"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email Address"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="name" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phonenumber"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="court" className="form-label">
                        Court
                      </label>
                      <Dropdown
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cityOptions}
                        optionLabel="name"
                        placeholder="Select City"
                        className="select city-select"
                      />
                    </div>
                    <div className="mb-10">
                      <label htmlFor="comments" className="form-label">
                        Details
                      </label>
                      <textarea
                        className="form-control"
                        id="comments"
                        rows={3}
                        placeholder="Enter Comments"
                        defaultValue={""}
                      />
                    </div>
                    <div className="form-check d-flex justify-content-start align-items-center policy">
                      <div className="d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue={true}
                          id="policy"
                          defaultChecked
                        />
                      </div>
                      <label className="form-check-label" htmlFor="policy">
                        By clicking &apos;Send Request&apos;, I agree to
                        KheloIndore Privacy Policy and Terms of Use
                      </label>
                    </div>
                    <div className="d-grid btn-block">
                      <Link
                        to="#"
                        className="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                      >
                        Send Request
                        <i className="feather-arrow-right-circle ms-1" />
                      </Link>
                    </div>
                  </form>
                </div>
                {/* <div className="white-bg listing-owner">
                  <h4 className="border-bottom">Listing By Owner</h4>
                  <ul>
                    <li className="d-flex justify-content-start align-items-center">
                      <div className="">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Post"
                            src="/assets/img/listing-by-owner-01.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to={routes.blogDetails}>
                            Manchester Academy
                          </Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next availablity : </span>
                          <span className="primary-text">15 May 2023</span>
                        </p>
                      </div>
                    </li>
                    <li className="d-flex justify-content-start align-items-center">
                      <div className="">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Post"
                            src="/assets/img/listing-by-owner-02.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to={routes.blogDetails}>
                            Sarah Sports Academy
                          </Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next availablity : </span>
                          <span className="primary-text">15 May 2023</span>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div> */}
                {/* <div className="white-bg">
                  <h4 className="border-bottom">Share Venue</h4>
                  <ul className="social-medias d-flex">
                    <li className="facebook">
                      <Link to="#;">
                        <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                    <li className="instagram">
                      <Link to="#;">
                        <i className="fa-brands fa-instagram" />
                      </Link>
                    </li>
                    <li className="behance">
                      <Link to="#;">
                        <i className="fa-brands fa-behance" />
                      </Link>
                    </li>
                    <li className="twitter">
                      <Link to="#;">
                        <i className="fa-brands fa-twitter" />
                      </Link>
                    </li>
                    <li className="pinterest">
                      <Link to="#;">
                        <i className="fa-brands fa-pinterest" />
                      </Link>
                    </li>
                    <li className="linkedin">
                      <Link to="#;">
                        <i className="fa-brands fa-linkedin" />
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
            </aside>
          </div>
          {/* /Row */}
        </div>
        {/* /container */}
        {/* <section className="section innerpagebg">
          <div className="container">
            <div className="featured-slider-group">
              <h3 className="mb-40">Similar Coaches</h3>
              <div className="featured-venues-slider owl-theme">
                <Slider {...featuredVenuesSlider}>
                  {coaches.map((coach, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                      <div className="featured-venues-item">
                        <div className="listing-item listing-item-grid">
                          <div className="listing-img">
                            <Link to={routes.coachDetail}>
                              <ImageWithBasePath
                                src="assets/img/featured/featured-05.jpg"
                                alt="Venue"
                              />
                            </Link>
                            <div
                              className="fav-item-venues"
                              onClick={() => handleItemClick(index)}
                            >
                              <span className="tag tag-blue">Professional</span>
                              <div className="list-reviews coche-star">
                                <Link
                                  to="#"
                                  className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                    }`}
                                >
                                  <i className="feather-heart" />
                                </Link>
                              </div>
                            </div>
                            <div className="hour-list">
                              <h5 className="tag tag-primary">
                                From $350 <span>/hr</span>
                              </h5>
                            </div>
                          </div>
                          <div className="listing-content">
                            <h3 className="listing-title">
                              <Link to={routes.coachDetail}>
                                {coach.first_name} {coach.last_name}
                              </Link>
                            </h3>
                            <ul className="mb-2">
                              <li>
                                <span>
                                  <i className="feather-map-pin me-2" />
                                  {coach.location.city}, {coach.location.state}
                                </span>
                              </li>
                            </ul>
                            <div className="listing-details-group">
                              <p>{coach.bio}</p>
                              <p>
                                Specializations: {coach.specializations.join(", ")}
                              </p>
                            </div>
                            <div className="coach-btn">
                              <ul>
                                <li>
                                  <Link
                                    to={routes.coachDetail}
                                    className="btn btn-primary w-100"
                                  >
                                    <i className="feather-eye me-2" />
                                    View Profile
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={routes.coachDetail}
                                    className="btn btn-secondary w-100"
                                  >
                                    <i className="feather-calendar me-2" />
                                    Book Now
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="avalbity-review">
                              <ul>
                                <li>
                                  <div className="avalibity-date">
                                    <span>
                                      <i className="feather-calendar" />
                                    </span>
                                    <div className="avalibity-datecontent">
                                      <h6>Next Availability</h6>
                                      <h5>{coach.availability}</h5>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="list-reviews mb-0">
                                    <div className="d-flex align-items-center">
                                      <span className="rating-bg">4.5</span>
                                      <span>80 Reviews</span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
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
        </section> */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default PersonalTrainingDetails;
