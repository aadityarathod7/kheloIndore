import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL } from "../../ApiUrl";

interface VenueData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  amenities: string;
  activities: string;
  category: string;

  // Other properties...
}

const BlogDetails = (props: any) => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  const [venueData, setVenueData] = useState<VenueData[]>([]);

  const idData = useParams();
  const id = idData.id;

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const fetchCoacheId = async () => {
      try {
        const response = await axios.get(`${API_URL}/venue/individual/${id}`);
        const venueData = response.data.venue;
        setVenueData(venueData);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoacheId();  
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
  return (
    <div style={{ backgroundColor: "#F8FAFC" }}>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>SPORTS VENUE DETAILS</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "40px", fontWeight: "800", color: "#0F172A", lineHeight: "1.2", marginBottom: "16px" }}>
                {venueData?.name || "Venue Details"}
              </h1>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <Link to="/sports-venue" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>Venues</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Hero Section */}
      <style dangerouslySetInnerHTML={{__html: `
        .content.blog-details, .content.blog-details * {
          color: #334155 !important;
        }
        .content.blog-details h2, .content.blog-details h2 a, .content.blog-details h3, .content.blog-details h3 a {
          color: #0F172A !important;
          font-weight: 800 !important;
        }
        .content.blog-details a.btn {
          color: #FFFFFF !important;
        }
      `}} />
      {/* Page Content */}
      <div className="content blog-details">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 mx-auto">
              {/* Blog */}
              <div className="featured-venues-item">
                <div className="listing-item blog-info">
                  <div className="listing-img">
                    <Link to={"#"}>
                      <ImageWithBasePath
                        src="/assets/img/blog/blog-01.jpg"
                        className="img-fluid"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues news-sports">
                      <span className="tag tag-blue">{venueData?.category}</span>
                    </div>
                  </div>
                  <hr />
                  <h2 className="listing-title">
                    <Link to="#">{venueData?.name}</Link>
                  </h2>

                  <div className="listing-content news-content">
                    <div className="listing-venue-owner blog-detail-owner d-lg-flex justify-content-between align-items-center">
                      <div className="navigation">
                        <div>
                          <i className="feather-map-pin me-2" />
                          {venueData.address} , {venueData.city} ,{" "}
                          {venueData.state} , {venueData.zipcode}
                        </div>

                        {/* <Link to="#"><ImageWithBasePath src="/assets/img/profiles/avatar-01.jpg" alt="User" />Orlando Waters</Link> */}
                      </div>
                      <Link to="#" className="btn btn-primary">
                        Book Now
                      </Link>
                    </div>

                    <div className="listing-venue-owner blog-detail-owner d-lg-flex justify-content-between align-items-center">
                      <div className="navigation">
                        <div>
                          {venueData.amenities && (
                            <div>Amenities: {venueData.amenities}</div>
                          )}
                        </div>

                        {/* <Link to="#"><ImageWithBasePath src="/assets/img/profiles/avatar-01.jpg" alt="User" />Orlando Waters</Link> */}
                      </div>
                    </div>

                    <div className="listing-venue-owner blog-detail-owner d-lg-flex justify-content-between align-items-center">
                      <div className="navigation">
                        <div>
                          {venueData.activities && (
                            <div>Activities: {venueData.activities}</div>
                          )}
                        </div>
                      </div>
                    </div> 


                    <div className="listing-venue-owner blog-detail-owner d-lg-flex justify-content-between align-items-center">
                      <div className="navigation">
                        <div>
                          
                            <div>Venue Rules: </div>
                        
                        </div>
                      </div>
                    </div>



                    {/* <p>There are many variations of passages of at Lorem Ipsum available but the majority suffered that dummy is alteration. There are many variations of passages of Lorem Ipsum available but the or majority have that suffered alteration words which don&apos;t look even slightly believable. There are many available but the majority the have suffered alteration. There are many variations of dummy passages Lorem majority the have the suffered alteration.</p>
                    <p>There are many variations of passages of at Lorem Ipsum available but the majority the have too suffered alteration. There are many variations of passages of Lorem Ipsum available majority have that suffered alteration words which don&apos;t look even slightly believable. There are available but the majority the have suffered alteration.</p>
                    <p>Lorem Ipsum available but the or majority have that suffered alteration words which don&apos;t look even slightly believable. There are many available but the majority the have suffered alteration. There are many variations of dumm passages Lorem majority the have the suffered alteration.</p> */}
                    <div className="blog-images d-sm-flex align-items-center justify-content-start">
                      <Link to="#">
                        <ImageWithBasePath
                          src="/assets/img/blog/blog-05.jpg"
                          className="img-fluid"
                          alt="Venue"
                        />
                      </Link>
                      <Link to="#">
                        <ImageWithBasePath
                          src="/assets/img/blog/blog-06.jpg"
                          className="img-fluid"
                          alt="Venue"
                        />
                      </Link>
                      <Link to="#">
                        <ImageWithBasePath
                          src="/assets/img/blog/blog-07.jpg"
                          className="img-fluid"
                          alt="Venue"
                        />
                      </Link>
                    </div>
                  </div>
                  {/* <hr> */}
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    <div className=" d-flex align-items-center tags-wrapper">
                      <h6>Tags:</h6>
                      <ul className="tags">
                        <li>
                          <Link to="#" className="tag">
                            Rackets
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="tag">
                            New Game
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="tag">
                            Dresses
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    <div className="d-flex justify-content-lg-end align-items-center social-medias-wrapper">
                      <h6>Share on :</h6>
                      <ul className="social-medias d-flex">
                        <li className="facebook">
                          <Link to="#;">
                            <i className="fa-brands fa-facebook-f" />
                          </Link>
                        </li>
                        <li className="linkedin">
                          <Link to="#;">
                            <i className="fa-brands fa-linkedin" />
                          </Link>
                        </li>
                        <li className="instagram">
                          <Link to="#;">
                            <i className="fa-brands fa-instagram" />
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
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Blog */}
              {/* Author Comments */}
              <div className="blog-comments">
                <div className="dull-bg author-widget">
                  <div className=" author-group d-md-flex align-items-center justify-content-start">
                    <div className="profile-pic">
                      <Link to="#;" className="d-inline-block">
                        <ImageWithBasePath
                          src="/assets/img/profiles/avatar-01.jpg"
                          alt="User"
                        />
                      </Link>
                    </div>
                    <div className="info">
                      <span>Author</span>
                      <h5>Antony Hilfn</h5>
                      <p>
                        Lorem Ipsum available but the or majority have that
                        suffered alteration words which don&apos;t look even
                        slightly believable. There are many available but the
                        majority the have suffered alteration. There are many
                        variations of dumm passages Lorem majority the have the
                        suffered alteration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Author Comments */}
              {/* Comments */}
              <div className="blog-comments">
                <div className="dull-bg">
                  <h4 className="mb-0">Comments (45)</h4>
                  <hr />
                  <ul>
                    <li className="author-group d-md-flex align-items-center justify-content-start">
                      <div className="profile-pic">
                        <Link to="#;" className="d-inline-block">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-04.jpg"
                            alt="User"
                          />
                        </Link>
                      </div>
                      <div className="info">
                        <div className="head d-flex align-items-center justify-content-start">
                          <h5>Antony Hilfn</h5>
                          <i className="fa-solid fa-circle" />
                          <span>15 Mar 2023</span>
                        </div>
                        <p>
                          Lorem Ipsum available but the or majority have that
                          suffered alteration words which don&apos;t look even
                          slightly believable. There are many available but the
                          majority the have suffered alteration. There are many
                          variations of dumm passages Lorem majority the have
                          the suffered alteration.
                        </p>
                        <Link to="#">Reply</Link>
                      </div>
                    </li>
                    <li className="author-group d-md-flex align-items-center justify-content-start">
                      <div className="profile-pic">
                        <Link to="#;" className="d-inline-block">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-05.jpg"
                            alt="User"
                          />
                        </Link>
                      </div>
                      <div className="info">
                        <div className="head d-flex align-items-center justify-content-start">
                          <h5>Besant</h5>
                          <i className="fa-solid fa-circle" />
                          <span>15 Mar 2023</span>
                        </div>
                        <p>
                          Lorem Ipsum available but the or majority have that
                          suffered alteration words which don&apos;t look even
                          slightly believable. There are many available but the
                          majority the have suffered alteration. There are many
                          variations of dumm passages Lorem majority the have
                          the suffered alteration.
                        </p>
                        <Link to="#">Reply</Link>
                      </div>
                    </li>
                    <li className=" author-group d-md-flex align-items-center justify-content-start">
                      <div className="profile-pic">
                        <Link to="#;" className="d-inline-block">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-06.jpg"
                            alt="User"
                          />
                        </Link>
                      </div>
                      <div className="info">
                        <div className="head d-flex align-items-center justify-content-start">
                          <h5>Maria Fin</h5>
                          <i className="fa-solid fa-circle" />
                          <span>15 Mar 2023</span>
                        </div>
                        <p>
                          Lorem Ipsum available but the or majority have that
                          suffered alteration words which don&apos;t look even
                          slightly believable. There are many available but the
                          majority the have suffered alteration. There are many
                          variations of dumm passages Lorem majority the have
                          the suffered alteration.
                        </p>
                        <Link to="#">Reply</Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {/* /Comments */}
              <div className="card new-comment white-bg">
                <h4>Enter Details</h4>
                <form>
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                  <div className="mb-3">
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
                  <button type="submit" className="btn btn-gradient">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* <section className="section dull-bg similar-list">
          <div className="container">
            <h2 className="text-center mb-40">Similar Listing</h2>
            <div className="row">
              <div className="featured-slider-group ">
                <div className="featured-venues-slider owl-theme">
                  <Slider {...featuredVenuesSlider}>
                   
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-07.jpg"
                              alt="Venue"
                            />
                          </Link>
                          <div
                            className="fav-item-venues news-sports"
                            key={1}
                            onClick={() => handleItemClick(1)}
                          >
                            <span className="tag tag-blue">Badminton</span>
                            <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[1] ? "selected" : ""}`}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="/assets/img/profiles/avatar-01.jpg"
                                  alt="User"
                                />
                                Orlando Waters
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                15 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              A Great And Fun Activity For You And Your Entire
                              Family
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <i className="feather-heart" />
                                45
                              </li>
                              <li>
                                <i className="feather-message-square" />
                                45
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="/assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              10 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-08.jpg"
                              alt="Venue"
                            />
                          </Link>
                          <div
                            className="fav-item-venues news-sports"
                            key={2}
                            onClick={() => handleItemClick(2)}
                          >
                            <span className="tag tag-blue">
                              Sports Activites
                            </span>
                            <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[2] ? "selected" : ""}`}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="/assets/img/profiles/avatar-06.jpg"
                                  alt="User"
                                />
                                Claire Nichols
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                16 Jun 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              Sports Make Us A Lot Stronger And Healthier Than
                              We Think
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <i className="feather-heart" />
                                35
                              </li>
                              <li>
                                <i className="feather-message-square" />
                                35
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="/assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              12 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-09.jpg"
                              alt="Venue"
                            />
                          </Link>
                          <div
                            className="fav-item-venues news-sports"
                            key={3}
                            onClick={() => handleItemClick(3)}
                          >
                            <span className="tag tag-blue">Rules of Game</span>
                            <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="/assets/img/profiles/avatar-06.jpg"
                                  alt="User"
                                />
                                Joanna Le
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                11 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              We Organize Events &amp; Parties in our Club
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <i className="feather-heart" />
                                25
                              </li>
                              <li>
                                <i className="feather-message-square" />
                                25
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="/assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              14 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-08.jpg"
                              alt="Venue"
                            />
                          </Link>
                          <div
                            className="fav-item-venues news-sports"
                            key={4}
                            onClick={() => handleItemClick(4)}
                          >
                            <span className="tag tag-blue">
                              Sports Activites
                            </span>
                            <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[4] ? "selected" : ""}`}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="/assets/img/profiles/avatar-01.jpg"
                                  alt="User"
                                />
                                Mart Sublin
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                12 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              Sports Make Us A Lot Stronger And Healthier Than
                              We Think
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <i className="feather-heart" />
                                35
                              </li>
                              <li>
                                <i className="feather-message-square" />
                                35
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="/assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              12 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                 
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default BlogDetails;
