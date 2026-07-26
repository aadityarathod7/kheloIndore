import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";
import Loader from "../loader/loader";
import "../../style/css/venue_details.css";

interface VenueData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  amenities: any;
  activities: string;
  category: string;
  images: any;
  facilities: any;
  src: any;
  google_location: string;
  open_at: any;
  close_at: any;
  data: any;
  vendor_id: number;
  key: any;
  description: any;
  gameType: any;
  additionalNotes: any;
  policiesAndRules: any;
}

const VenueDetails = () => {
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [venueType, setVenueType] = useState<VenueData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const overviewRef = useRef(null);
  const includesRef = useRef(null);
  const rulesRef = useRef(null);
  const timingsRef = useRef(null);
  const facilitiesRef = useRef(null);
  const additionalNotesRef = useRef(null);
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const idData = useParams();
  const id = idData.id;
  const name = idData.name;
  const type = idData.type; 
  console.log(idData,'--------');
  const location = useLocation();
  

  const scrollToRef = (ref: any) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  
  
  
  useEffect(() => {
    const fetchVenueId = async () => {
      try {
        const response = await axios.get(`${API_URL}/venue/individual/${id}`);
        const venueData = response.data.venue;
        setVenueData(venueData);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching venues:", error);
        setLoading(false)
      }
    };
    fetchVenueId();
  }, []);
  
  useEffect(() => {
    if (venueData) {
      const nameofkey = Object.keys(venueData?.data)[0]
      const nameofgame = venueData?.data[nameofkey]
      setVenueType(nameofgame)
    }
  }, [venueData]);
  
  useEffect(() => {
       document.title = `Sports Venue - ${type}/${name}/${id}}`;  
   }, []);
  
  
  const handleImageClick = (index: number) => {
    const imageUrl = venueData?.images[index]?.src
      ? `${IMG_URL}${venueData.images[index]?.src}`
      : "assets/img/venues/venues-01.jpg";

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Image preview',
      width: '60%',
      padding: '1rem',
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const handleBookNow = async (e:any) => {
    e.preventDefault();
    console.log("click -=-=-=-")
    const token = localStorage.getItem("token");
    console.log(token, "token")
    if (token) {
      navigate(`/sports-venue/venue-timedate/${id}`);
    } else {
      Swal.fire({
        title: "Please Log In",
        text: "In order to book a venue, you must log in.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login",
            { state: { URL: location.pathname } }
          )
        }
      });
    }

  }


  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="venue-coach-details top-margin">
          {/*Galler Slider Section*/}
          <div className="bannergallery-section">
            <div className="main-gallery-slider">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={4}
                breakpoints={{
                  1024: { slidesPerView: 3 },
                  768: { slidesPerView: 2 },
                  640: { slidesPerView: 1 },
                }}
                className="venue-space"
              >
                {venueData?.images?.map((venue: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div
                      className="gallery-widget-item"
                      onClick={() => handleImageClick(index)}
                    >
                      <Link to="#" data-fancybox="gallery1">
                        <ImageWithBasePath
                          className="img-fluid fixed-height"
                          alt={`Image ${index + 1}`}
                          src={`${IMG_URL}${venue?.src}`}
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="venue-info white-bg d-block">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <h1 className="d-flex align-items-center justify-content-start">
                    {" "}
                    {venueData?.name}
                    {/* <span className="d-flex justify-content-center align-items-center"></span> */}
                  </h1>
                  <ul className="d-sm-flex justify-content-start align-items-center">
                    <li>
                      <i className="feather-map-pin" /> {venueData?.address}, {venueData?.city}, {venueData?.state}, {venueData?.zipcode}
                    </li>
                  </ul>
                </div>
                {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 text-right">
          <ul className="social-options float-lg-end d-sm-flex justify-content-start align-items-center">
            <li><Link to="#"><i className="feather-share-2" />Share</Link></li>
            <li><Link to="#" className="favour-adds"><i className="feather-star" />Add to favourite</Link></li>
            <li className="venue-review-info d-flex justify-content-start align-items-center">
              <span className="d-flex justify-content-center align-items-center">5.0</span>
              <div className="review">
                <div className="rating">
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                </div>
                <p className="mb-0"><Link to="#">15 Reviews</Link></p>
              </div>
              <i className="fa-regular fa-comments" />
            </li>
          </ul>
        </div> */}

                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className="d-flex float-sm-end align-items-center">
                <p className="d-inline-block me-2 mb-0">Starts From :</p>
                <h3 className="primary-text mb-0 d-inline-block">
                  $150<span>/ hr</span>
                </h3>
              </div>
            </div> */}
              </div>
              <hr />
              <div className="row bottom-row d-flex align-items-center">
                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6">
          <ul className="d-sm-flex details">
            <li>
              <div className="profile-pic">
                <Link to="#" className="venue-type"><ImageWithBasePath className="img-fluid" src="/assets/img/icons/venue-type.svg" alt="Icon" /></Link>
              </div>
              <div className="ms-2">
                <p>Venue Type</p>
                <h6 className="mb-0">Indoor</h6>
              </div>
            </li>
            <li>
              <div className="profile-pic">
                <Link to="#"><ImageWithBasePath className="img-fluid" src="/assets/img/profiles/avatar-01.jpg" alt="Icon" /></Link>
              </div>
              <div className="ms-2">
                <p>Added By</p>
                <h6 className="mb-0">Hendry Williams</h6>
              </div>
            </li>
          </ul>
        </div> */}
              </div>
            </div>
          </div>
          {/* Page Content */}
          <div className="content">
            <div className="container">
              {/* Row */}
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                  <div className="venue-options white-bg mb-4">
                    <ul className="clearfix">
                      <li className="active">
                        <Link to="#overview"
                          onClick={() => scrollToRef(overviewRef)}
                        >Overview</Link>
                      </li>
                      <li>
                        <Link to="#includes"
                          onClick={() => scrollToRef(gameRef)}
                        >Game Type</Link>
                      </li>
                      <li>
                        <Link to="#rules"
                          onClick={() => scrollToRef(includesRef)}
                        >Includes</Link>
                      </li>
                      <li>
                        <Link to="#timings"
                          onClick={() => scrollToRef(facilitiesRef)}
                        >Facilities</Link>
                      </li>
                      <li>
                        <Link to="#timings"
                          onClick={() => scrollToRef(rulesRef)}
                        >Rules</Link>
                      </li>
                      <li>
                        <Link to="#timings"
                          onClick={() => scrollToRef(additionalNotesRef)}
                        >Additional Notes</Link>
                      </li>
                    </ul>
                  </div>
                  {/* Accordian Contents */}
                  <div className="accordion" id="accordionPanel">
                    <section className="overview" id="overview" ref={overviewRef}>
                      <div className="accordion-item mb-4" id="overview">
                        <h4 className="accordion-header" id="panelsStayOpen-overview">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseOne"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Overview
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseOne"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-overview"
                        >
                          <div className="accordion-body">
                            <div className="text show-more-height">
                              <div dangerouslySetInnerHTML={{ __html: venueData?.description }} />
                              <br />
                              <p>
                                These are some of the features of the venue.
                              </p>
                              <ul className="venue-discription">
                                {venueType?.map((type: any, index: any) => (
                                  <li className="dis-list" key={index}>
                                    <p className="p-f">{type.key.replaceAll('_', ' ')}</p>:
                                    <p className="p-t">
                                      {Array.isArray(type.value) ? type.value.join(", ") : type.value}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* <div className="show-more d align-items-center primary-text">
                        <i className="feather-plus-circle" />
                        Show More
                      </div> */}
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="includes" id="games" ref={gameRef}>
                      <div className="accordion-item mb-4" id="games">
                        <h4 className="accordion-header" id="panelsStayOpen-games">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseTwo"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseTwo"
                          >
                            Games
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseTwo"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-games"
                        >
                          <div className="accordion-body">
                            {venueData?.gameType}
                            {/* <ul className="clearfix">
                                {venueData?.amenities.map((amenity: any, index: any) => (
                                  <li key={index}><i className="feather-check-square" />{amenity}</li>
                                ))}
                              </ul> */}
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="includes" id="includes" ref={includesRef}>
                      <div className="accordion-item mb-4" id="includes">
                        <h4 className="accordion-header" id="panelsStayOpen-includes">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseThree"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseThree"
                          >
                            Includes
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseThree"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-includes"
                        >
                          <div className="accordion-body">
                            <ul className="clearfix">
                              {venueData?.amenities.map((amenity: any, index: any) => (
                                <li key={index}><i className="feather-check-square" />{amenity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="includes" id="facilities" ref={facilitiesRef}>
                      <div className="accordion-item mb-4" id="facilities">
                        <h4 className="accordion-header" id="panelsStayOpen-facilities">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseFour"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseFour"
                          >
                            Facilities
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseFour"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-includes"
                        >
                          <div className="accordion-body">
                            <ul className="clearfix">
                              {venueData?.facilities.map((facility: any, index: any) => (
                                <li key={index}><i className="feather-check-square" />{facility}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rules" id="rules" ref={rulesRef}>
                      <div className="accordion-item mb-4" id="rules">
                        <h4 className="accordion-header" id="panelsStayOpen-rules">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseFive"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseFive"
                          >
                            Rules
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseFive"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-rules"
                        >
                          <div className="accordion-body">
                            <div dangerouslySetInnerHTML={{ __html: venueData?.policiesAndRules }} />
                            {/* <ul>
                                <li>
                                  <p>
                                    <i className="feather-alert-octagon" />
                                    Non Marking Shoes are recommended not mandatory for
                                    Badminton.
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <i className="feather-alert-octagon" />A maximum
                                    number of members per booking per court is
                                    admissible fixed by Venue Vendors
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    <i className="feather-alert-octagon" />
                                    No pets, no seeds, no gum, no glass, no hitting or
                                    swinging outside of the cage
                                  </p>
                                </li>
                              </ul> */}
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="timing" id="timing" ref={additionalNotesRef}>
                      <div className="accordion-item mb-4" id="amenities">
                        <h4
                          className="accordion-header"
                          id="panelsStayOpen-amenities"
                        >
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseSix"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseSix"
                          >
                            Additional Notes
                          </button>
                        </h4>
                        <div
                          id="panelsStayOpen-collapseSix"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-amenities"
                        >
                          <div className="accordion-body">
                            <ul className="d-md-flex justify-content-between align-items-center">
                              {/* <div><i className="feather-clock me-2" style={{ color: "red" }} />
                                  {new Date(venueData?.open_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} to {new Date(venueData?.close_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</div> */}
                              {venueData?.additionalNotes}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                    {/* <section className="activity" id="activity" ref={locationRef}>
            <div className="accordion-item mb-4" id="amenities">
              <h4
                className="accordion-header"
                id="panelsStayOpen-amenities"
              >
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFour"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseFour"
                >
                  Activities
                </button>
              </h4>
              <div
                id="panelsStayOpen-collapseFour"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-amenities"
              >
                <div className="accordion-body">
                  <ul className="d-md-flex justify-content-between align-items-center">
                    {venueData?.activities && (
                      <div> {venueData?.activities}</div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section> */}
                    {/* <div className="accordion-item mb-4" id="reviews">
                  <div className="accordion-header" id="panelsStayOpen-reviews">
                    <div
                      className="accordion-button d-flex justify-content-between align-items-center"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSix"
                      aria-controls="panelsStayOpen-collapseSix"
                    >
                      <span className="w-75 mb-0">Reviews</span>
                      <Link
                        to="#"
                        className="btn btn-gradient pull-right write-review add-review"
                        data-bs-toggle="modal"
                        data-bs-target="#add-review"
                      >
                        Write a review
                      </Link>
                    </div>
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
                      Review Box
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-01.jpg"
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
                          <h6>Absolutely perfect</h6>
                          <p>
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
                          </p>
                          <ul className="review-gallery clearfix">
                            <li>
                              <Link
                                to="/assets/img/gallery/gallery-thumb-01.jpg"
                                data-fancybox="gallery"
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
                                to="/assets/img/gallery/gallery-thumb-02.jpg"
                                data-fancybox="gallery"
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
                                to="/assets/img/gallery/gallery-thumb-03.jpg"
                                data-fancybox="gallery"
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
                                to="/assets/img/gallery/gallery-thumb-04.jpg"
                                data-fancybox="gallery"
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
                                to="/assets/img/gallery/gallery-thumb-05.jpg"
                                data-fancybox="gallery"
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
                      /Review Box 
                       Review Box
                      <div className="review-box d-md-flex">
                        <div className="review-profile">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-06.jpg"
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
                      /Review Box
                      <div className="d-flex justify-content-center mt-1">
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
                    {/* <section className="location" id="location" ref={locationRef}>
            <div className="accordion-item" id="location">
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
                      src={venueData?.google_location}
                      height={445}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="dull-bg d-flex justify-content-start align-items-center mt-3">
                    <div className="white-bg me-2">
                      <i className="fas fa-location-arrow" />
                    </div>
                    <div>
                      <h6>Our Venue Location</h6>
                      <p>{venueData?.address} ,{" "}
                        {venueData?.city} , {venueData?.state} , {venueData?.zipcode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
                  </div>
                  {/* Accordian Contents */}
                </div>
                <aside className="col-12 col-sm-12 col-md-12 col-lg-4 theiaStickySidebar">
                  <div className="stickybar">
                    <div className="white-bg book-court">
                      <h4 className="border-bottom">Book A Court</h4>
                      {/* <h5 className="d-inline-block">Badminton Academy,</h5> */}
                      {/* <p className="d-inline-block"> available Now</p> */}
                      {/* <ul className="d-sm-flex align-items-center justify-content-evenly">
                          <li className="venue-booking-price">
                            <h4>Start From</h4>
                            <h3 className="d-inline-block primary-text">₹150</h3>
                            <span>/hr</span>
                      <p>up to 1 guests</p>
                          </li>
                          <li>
                      <span>
                        <i className="feather-plus" />
                      </span>
                    </li>
                          <li>
                      <h4 className="d-inline-block primary-text">₹5</h4>
                      <span>/hr</span>
                      <p>
                        each additional guest <br />
                        up to 4 guests max
                      </p>
                    </li>
                        </ul> */}
                      <div className="d-grid btn-block mt-3">
                        <Link
                          className="btn btn-secondary d-inline-flex justify-content-center align-items-center"
                          onClick={handleBookNow}
                          to={""}
                          // to={`/sports-venue/venue-timedate/${id}`}
                        >
                          <i className="feather-calendar" />
                          Book Now
                        </Link>
                      </div>
                    </div>
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
                      <label htmlFor="date" className="form-label">
                        Date
                      </label>
                      <div className="form-icon">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="Select Date"
                          id="date"
                        />
                        <span className="cus-icon">
                          <i className="feather-calendar" />
                        </span>
                      </div>
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
                    <div>
                      <label className="form-label">Number of Guests</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={1}
                          readOnly
                        />
                        <input
                          type="number"
                          className="form-control active"
                          defaultValue={2}
                          readOnly
                        />
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={3}
                          readOnly
                        />
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={4}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="form-check d-flex justify-content-start align-items-center policy">
                      <div className="d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="policy"
                          defaultChecked
                        />
                      </div>
                      <label className="form-check-label" htmlFor="policy">
                        By clicking &apos;Send Request&apos;, I agree to
                        Dreamsport Privacy Policy and Terms of Use
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
                </div> */}
                    {/* <div className="white-bg cage-owner-info">
            <h4 className="border-bottom">Cage Owner Details</h4>
            <div className="d-flex justify-content-start align-items-center">
              <div className="profile-pic">
                <Link to="#">
                  <ImageWithBasePath
                    className="img-fluid"
                    alt="User"
                    src="/assets/img/profiles/avatar-05.jpg"
                  />
                </Link>
              </div>
              <div>
                <h5>Hendry Williams</h5>
                <div className="rating">
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <i className="fas fa-star filled" />
                  <span>5.0</span>
                  <span>(20 Reviews)</span>
                </div>
              </div>
            </div>
          </div> */}
                    {/* <div className="white-bg listing-owner">
                  <h4 className="border-bottom">Listing By Owner</h4>
                  <ul>
                    <li className="d-flex justify-content-start align-items-center">
                      <div>
                        <Link to="blog-details.html">
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Venue"
                            src="/assets/img/listing-by-owner-01.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to="blog-details.html">Manchester Academy</Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next Availablity : </span>
                          <span className="primary-text">15 May 2023</span>
                        </p>
                      </div>
                    </li>
                    <li className="d-flex justify-content-start align-items-center">
                      <div>
                        <Link to="blog-details.html">
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Venue"
                            src="/assets/img/listing-by-owner-02.jpg"
                          />
                        </Link>
                      </div>
                      <div className="owner-info">
                        <h5>
                          <Link to="blog-details.html">
                            Sarah Sports Academy
                          </Link>
                        </h5>
                        <p>
                          <i className="feather-map-pin" />
                          <span>Sacramento, CA</span>
                        </p>
                        <p className="mb-0">
                          <i className="feather-calendar" />
                          <span>Next Availablity : </span>
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
                          <Link to="#">
                            <i className="fa-brands fa-facebook-f" />
                          </Link>
                        </li>
                        <li className="instagram">
                          <Link to="#">
                            <i className="fa-brands fa-instagram" />
                          </Link>
                        </li>
                        <li className="twitter">
                          <Link to="#">
                            <i className="fa-brands fa-x-twitter" />
                          </Link>
                        </li>
                        <li className="linkedin">
                          <Link to="#">
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
            {/* /Container */}
            {/* <section className="section innerpagebg">
          <div className="container">
            <div className="featured-slider-group">
              <h3 className="mb-40">Similar Venues</h3>
              <div className="owl-carousel featured-venues-slider owl-theme">
                <Slider {...settings}>
                 
                  <div className="featured-venues-item">
                    <div className="listing-item mb-0">
                      <div className="listing-img">
                        <Link to="venue-details.html">
                          <ImageWithBasePath
                            src="/assets/img/venues/venues-01.jpg"
                            alt="Venue"
                          />
                        </Link>
                        <div className="fav-item-venues">
                          <span className="tag tag-blue">Featured</span>
                          <h5 className="tag tag-primary">
                            $450<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                      <div className="listing-content">
                        <div className="list-reviews">
                          <div className="d-flex align-items-center">
                            <span className="rating-bg">4.2</span>
                            <span>300 Reviews</span>
                          </div>
                          <Link to="#" className="fav-icon">
                            <i className="feather-heart" />
                          </Link>
                        </div>
                        <h3 className="listing-title">
                          <Link to="venue-details.html">
                            Sarah Sports Academy
                          </Link>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            Elevate your athletic journey at Sarah Sports
                            Academy, where excellence meets opportunity.
                          </p>
                          <ul>
                            <li>
                              <span>
                                <i className="feather-map-pin" />
                                Port Alsworth, AK
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="feather-calendar" />
                                Next Availablity :{" "}
                                <span className="primary-text">
                                  15 May 2023
                                </span>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <div className="listing-venue-owner">
                            <Link className="navigation" to={""}>
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-01.jpg"
                                alt="User"
                              />
                              Mart Sublin
                            </Link>
                          </div>
                          <Link
                            to="venue-details.html"
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2" />
                            </span>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div className="featured-venues-item">
                    <div className="listing-item mb-0">
                      <div className="listing-img">
                        <Link to="venue-details.html">
                          <ImageWithBasePath
                            src="/assets/img/venues/venues-02.jpg"
                            className="img-fluid"
                            alt="Venues"
                          />
                        </Link>
                        <div className="fav-item-venues">
                          <span className="tag tag-blue">Top Rated</span>
                          <h5 className="tag tag-primary">
                            $200<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                      <div className="listing-content">
                        <div className="list-reviews">
                          <div className="d-flex align-items-center">
                            <span className="rating-bg">5.0</span>
                            <span>150 Reviews</span>
                          </div>
                          <Link to="#" className="fav-icon">
                            <i className="feather-heart" />
                          </Link>
                        </div>
                        <h3 className="listing-title">
                          <Link to="venue-details.html">Badminton Academy</Link>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            Unleash your badminton potential at our premier
                            Badminton Academy, where champions are made
                          </p>
                          <ul>
                            <li>
                              <span>
                                <i className="feather-map-pin" />
                                Sacramento, CA
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="feather-calendar" />
                                Next Availablity :{" "}
                                <span className="primary-text">
                                  15 May 2023
                                </span>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <div className="listing-venue-owner">
                            <Link className="navigation" to={""}>
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-02.jpg"
                                alt="User"
                              />
                              Rebecca
                            </Link>
                          </div>
                          <Link
                            to="venue-details.html"
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2" />
                            </span>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  <div className="featured-venues-item">
                    <div className="listing-item mb-0">
                      <div className="listing-img">
                        <Link to="venue-details.html">
                          <ImageWithBasePath
                            src="/assets/img/venues/venues-03.jpg"
                            className="img-fluid"
                            alt="Venues"
                          />
                        </Link>
                        <div className="fav-item-venues">
                          <h5 className="tag tag-primary">
                            $350<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                      <div className="listing-content">
                        <div className="list-reviews">
                          <div className="d-flex align-items-center">
                            <span className="rating-bg">4.7</span>
                            <span>120 Reviews</span>
                          </div>
                          <Link to="#" className="fav-icon">
                            <i className="feather-heart" />
                          </Link>
                        </div>
                        <h3 className="listing-title">
                          <Link to="venue-details.html">
                            Manchester Academy
                          </Link>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            Manchester Academy: Where dreams meet excellence in
                            sports education and training game.
                          </p>
                          <ul>
                            <li>
                              <span>
                                <i className="feather-map-pin" />
                                Guysville, OH
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="feather-calendar" />
                                Next Availablity :{" "}
                                <span className="primary-text">
                                  16 May 2023
                                </span>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <div className="listing-venue-owner">
                            <Link className="navigation" to={""}>
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-03.jpg"
                                alt="User"
                              />
                              Andrew
                            </Link>
                          </div>
                          <Link
                            to="venue-details.html"
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2" />
                            </span>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="featured-venues-item">
                    <div className="listing-item mb-0">
                      <div className="listing-img">
                        <Link to="venue-details.html">
                          <ImageWithBasePath
                            src="/assets/img/venues/venues-02.jpg"
                            className="img-fluid"
                            alt="Venues"
                          />
                        </Link>
                        <div className="fav-item-venues">
                          <span className="tag tag-blue">Featured</span>
                          <h5 className="tag tag-primary">
                            $450<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                      <div className="listing-content">
                        <div className="list-reviews">
                          <div className="d-flex align-items-center">
                            <span className="rating-bg">4.5</span>
                            <span>300 Reviews</span>
                          </div>
                          <Link to="#" className="fav-icon">
                            <i className="feather-heart" />
                          </Link>
                        </div>
                        <h3 className="listing-title">
                          <Link to="venue-details.html">
                            ABC Sports Academy
                          </Link>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.industry&apos;s standard
                          </p>
                          <ul>
                            <li>
                              <span>
                                <i className="feather-map-pin" />
                                Little Rock, AR
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="feather-calendar" />
                                Next Availablity :{" "}
                                <span className="primary-text">
                                  17 May 2023
                                </span>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <div className="listing-venue-owner">
                            <Link className="navigation" to={""}>
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-04.jpg"
                                alt="User"
                              />
                              Mart Sublin
                            </Link>
                          </div>
                          <Link
                            to="venue-details.html"
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2" />
                            </span>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
             
                </Slider>
              </div>
            </div>
          </div>
        </section> */}
          </div>
          {/* /Page Content */}
        </div>
      )}
    </>
  );
};

export default VenueDetails;
