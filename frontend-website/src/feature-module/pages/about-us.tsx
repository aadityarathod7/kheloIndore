import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const AboutUs = () => {
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
    window.scrollTo(0, 0)
  }, [])

  const teamSlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
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
          slidesToShow: 3,
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
  const testimonialSlider = {
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
          slidesToShow: 2,
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
  const testimonialBrandSlider = {
    dots: false,
    nav: false,
    autoplay: true,
    slidesToShow: 5,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 3,
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
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">About Us</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>About Us</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        {/* About Us Info */}
        <section className="aboutus-info">
          <div className="container">
            {/* Banners */}
            <div className="row d-flex align-items-center">
              <div className=" col-12 col-sm-3 col-md-3 col-lg-3">
                <div className="banner text-center">
                  <ImageWithBasePath
                    src="/assets/img/aboutus/banner-01.jpg"
                    className="img-fluid corner-radius-10"
                    alt="Banner-01"
                  />
                </div>
              </div>
              <div className=" col-12 col-sm-6 col-md-6 col-lg-6">
                <div className="banner text-center">
                  <ImageWithBasePath
                    src="/assets/img/aboutus/banner-02.jpg"
                    className="img-fluid corner-radius-10"
                    alt="Banner-02"
                  />
                </div>
              </div>
              <div className=" col-12 col-sm-3 col-md-3 col-lg-3">
                <div className="banner text-center">
                  <ImageWithBasePath
                    src="/assets/img/aboutus/banner-03.jpg"
                    className="img-fluid corner-radius-10"
                    alt="Banner-03"
                  />
                </div>
              </div>
            </div>
            {/* /Banners */}
            {/* Vision-Mission */}
            <div className="vision-mission">
              <div className="row">
                <div className=" col-12 col-sm-12 col-md-12 col-lg-8">
                  <h2>Your Vision</h2>
                  <p>
                    We envision a thriving badminton ecosystem with innovative
                    technologies that enhance skills and cultivate a love for
                    the sport. Our platform inspires individuals to unleash
                    their full potential in badminton.
                  </p>
                  <p>
                    We revolutionize badminton, empowering coaches and players
                    to excel. Our platform offers comprehensive tools and
                    support for growth within the badminton community. Join us
                    and reach new heights of excellence!
                  </p>
                </div>
                <div className=" col-12 col-sm-12 col-md-12 col-lg-4">
                  <div className="mission-bg">
                    <h2>Our Mission</h2>
                    <p>
                      We provide coaches and players with a seamless platform
                      for connectivity, personalized insights, and educational
                      resources. Together, we foster a collaborative community
                      that supports growth and success in badminton.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Vision-Mission */}
          </div>
        </section>
        {/* /About Us Info */}
        <section className="section ourteam dull-bg">
          <div className="container">
            <div className="section-heading">
              <h2>
                Our <span>Team</span>
              </h2>
              <p className="sub-title">
                Our team united by passion, driven by excellence.
              </p>
            </div>
            <div className="featured-slider-group p-0">
              <div className="team-slider owl-theme">
                <Slider {...teamSlider}>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-01.jpg"
                            className="img-fluid"
                            alt="Team-01"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Caterine</h4>
                          <h6>Chief Executive Officer</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Caterine</h4>
                          <h6>Chief Executive Officer</h6>
                        </div>
                        <p>
                          Results-driven CEO, Ms. Caterine, fosters innovation
                          and drives growth with proven success. Her strategic
                          vision, collaborative leadership, and financial acumen
                          consistently deliver excellence, value, and strong
                          stakeholder relationships.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-02.jpg"
                            className="img-fluid"
                            alt="Team-02"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Anto</h4>
                          <h6>Marketing Manager</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Anto</h4>
                          <h6>Marketing Manager</h6>
                        </div>
                        <p>
                          Mr. Anto, our Marketing Manager, passionately drives
                          impactful marketing campaigns, expanding the reach of
                          badminton. With expertise in brand management and
                          digital marketing, he elevates our presence and
                          engages our target audience.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-03.jpg"
                            className="img-fluid"
                            alt="Team-03"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Lucas Finn</h4>
                          <h6>Team Leader</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Lucas Finn</h4>
                          <h6>Team Leader</h6>
                        </div>
                        <p>
                          Introducing Mr. Lucas Finn, our inspiring Team Leader
                          in badminton. Lucas&apos;s commitment to excellence
                          ensures seamless project execution and success in the
                          sport.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-04.jpg"
                            className="img-fluid"
                            alt="Team-04"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Andrew</h4>
                          <h6>Designer</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Andrew</h4>
                          <h6>Designer</h6>
                        </div>
                        <p>
                          Mr. Andrew is a skilled badminton designer known for
                          transforming courts, creating striking packaging,
                          designing stylish apparel, and developing captivating
                          tournament branding.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-05.jpg"
                            className="img-fluid"
                            alt="Team-05"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Adrian</h4>
                          <h6>Business Head</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Adrian</h4>
                          <h6>Business Head</h6>
                        </div>
                        <p>
                          Introducing Mr. Lucas Finn, our inspiring Team Leader
                          in badminton. Lucas&apos;s commitment to excellence
                          ensures seamless project execution and success in the
                          sport.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-06.jpg"
                            className="img-fluid"
                            alt="Team-06"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Lucas Finn</h4>
                          <h6>Team Leader</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Lucas Finn</h4>
                          <h6>Team Leader</h6>
                        </div>
                        <p>
                          Introducing Mr. Lucas Finn, our inspiring Team Leader
                          in badminton. Lucas&apos;s commitment to excellence
                          ensures seamless project execution and success in the
                          sport.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-07.jpg"
                            className="img-fluid"
                            alt="Team-07"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Adrian</h4>
                          <h6>Business Head</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Adrian</h4>
                          <h6>Business Head</h6>
                        </div>
                        <p>
                          Introducing Mr. Lucas Finn, our inspiring Team Leader
                          in badminton. Lucas&apos;s commitment to excellence
                          ensures seamless project execution and success in the
                          sport.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-item">
                    <div className="info text-center">
                      <div className="wrap">
                        <div className="prfile-pic">
                          <ImageWithBasePath
                            src="/assets/img/aboutus/team-08.jpg"
                            className="img-fluid"
                            alt="Team-08"
                          />
                        </div>
                        <div className="short-info">
                          <h4>Andrew</h4>
                          <h6>Designer</h6>
                        </div>
                      </div>
                      <div className="more">
                        <div className="short-info">
                          <h4>Andrew</h4>
                          <h6>Designer</h6>
                        </div>
                        <p>
                          Mr. Andrew is a skilled badminton designer known for
                          transforming courts, creating striking packaging,
                          designing stylish apparel, and developing captivating
                          tournament branding.
                        </p>
                        <ul className="social-medias d-inline-flex">
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
                              <i className="fa-brands fa-twitter" />
                            </Link>
                          </li>
                          <li className="pinterest">
                            <Link to="#">
                              <i className="fa-brands fa-pinterest" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </section>
        {/* Group Coaching */}
        <section className="section white-bg">
          <div className="container">
            <div className="section-heading">
              <h2>
                Our <span>Features</span>
              </h2>
              <p className="sub-title">
                Discover your potential with our comprehensive training, expert
                trainers, and advanced facilities.Join us to improve your
                athletic career
              </p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-01.svg"
                        className="img-fluid"
                        alt="Icon"
                      />
                    </div>
                  </div>
                  <div className="work-content">
                    <h3>Group Coaching</h3>
                    <p>
                      Accelerate your skills with tailored group coaching
                      sessions for badminton players game.
                    </p>
                    <Link to="#">Learn More</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-02.svg"
                        className="img-fluid"
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
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-03.svg"
                        className="img-fluid"
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
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-04.svg"
                        className="img-fluid"
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
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-05.svg"
                        className="img-fluid"
                        alt="Icon"
                      />
                    </div>
                  </div>
                  <div className="work-content">
                    <h3>Badminton Community</h3>
                    <p>
                      Upraise your game with engaging lessons and a supportive
                      community. Join us now and take your skills to new
                      heights.
                    </p>
                    <Link to="#">Learn More</Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="work-grid coaching-grid w-100">
                  <div className="work-icon">
                    <div className="work-icon-inner">
                      <ImageWithBasePath
                        src="/assets/img/icons/coache-icon-06.svg"
                        className="img-fluid"
                        alt="Icon"
                      />
                    </div>
                  </div>
                  <div className="work-content">
                    <h3>Court Rental</h3>
                    <p>
                      Enjoy uninterrupted badminton sessions at KheloIndore with
                      our premium court rental services.
                    </p>
                    <Link to="#">Learn More</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Group Coaching */}
        {/* Testimonials */}
        <section className="section our-testimonials">
          <div className="container">
            <div className="section-heading">
              <h2>
                Our <span>Testimonials</span>
              </h2>
              <p className="sub-title">
                Glowing testimonials from passionate badminton enthusiasts
                worldwide, showcasing our exceptional services.s
              </p>
            </div>
            <div className="row">
              <div className="featured-slider-group">
                <div className="testimonial-slide featured-venues-slider owl-theme">
                  <Slider {...testimonialSlider}>
                    {/* Testimonials Item */}
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
                        <Link to={"#"} className="navigation">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-01.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </Link>
                        <div className="testimonial-content">
                          <h5>Ariyan Rusov</h5>
                          <Link to="#" className="btn btn-primary ">
                            Badminton
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* /Testimonials Item */}
                    {/* Testimonials Item */}
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
                          KheloIndore advanced badminton equipment has greatly
                          improved my performance on the court. Their quality
                          range of rackets and shoes made a significant impact.
                        </p>
                      </div>
                      <div className="listing-venue-owner">
                        <Link to={"#"} className="navigation">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-04.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </Link>
                        <div className="testimonial-content">
                          <h5>Darren Valdez</h5>
                          <Link to="#" className="btn btn-primary ">
                            Badminton
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* /Testimonials Item */}
                    {/* Testimonials Item */}
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
                          KheloIndore unmatched professionalism and service
                          excellence left a positive experience. Highly
                          recommended for court rentals and equipment purchases.
                        </p>
                      </div>
                      <div className="listing-venue-owner">
                        <Link to={"#"} className="navigation">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-03.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </Link>
                        <div className="testimonial-content">
                          <h5>Elinor Dunn</h5>
                          <Link to="#" className="btn btn-primary ">
                            Badminton
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* /Testimonials Item */}
                    {/* Testimonials Item */}
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
                          KheloIndore advanced badminton equipment has greatly
                          improved my performance on the court. Their quality
                          range of rackets and shoes made a significant impact.
                        </p>
                      </div>
                      <div className="listing-venue-owner">
                        <Link to={"#"} className="navigation">
                          <ImageWithBasePath
                            src="/assets/img/profiles/avatar-04.jpg"
                            className="img-fluid"
                            alt="User"
                          />
                        </Link>
                        <div className="testimonial-content">
                          <h5>Darren Valdez</h5>
                          <Link to="#" className="btn btn-primary ">
                            Badminton
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* /Testimonials Item */}
                  </Slider>
                </div>
              </div>
              {/* Testimonials Slide */}
              <div className="brand-slider-group">
                <div className="testimonial-brand-slider owl-theme">
                  <Slider {...testimonialBrandSlider}>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                    <div className="brand-logos">
                      <ImageWithBasePath
                        src="/assets/img/testimonial-icon-01.svg"
                        className="img-fluid"
                        alt="Brand-logo"
                      />
                    </div>
                  </Slider>
                </div>
              </div>
              {/* /Testimonials Slide */}
            </div>
          </div>
        </section>
        {/* /Testimonials */}
        {/* Featured Plans */}
        <section className="section featured-plan">
          <div className="work-img ">
            <div className="work-img-right">
              <ImageWithBasePath
                src="/assets/img/bg/work-bg.png"
                alt="Featured"
              />
            </div>
          </div>
          <div className="container">
            <div className="section-heading ">
              <h2>
                We Made the <span>Plans For You</span>
              </h2>
              <p className="sub-title">
                Choose monthly or yearly plans for uninterrupted access to our
                premium badminton facilities. Join us and experience convenient
                excellence.
              </p>
            </div>
            <div className="interset-btn">
              <div className="status-toggle d-inline-flex align-items-center">
                Monthly
                <input type="checkbox" id="status_1" className="check" />
                <label htmlFor="status_1" className="checktoggle">
                  checkbox
                </label>
                Yearly
              </div>
            </div>
            <div className="price-wrap ">
              <div className="row justify-content-center">
                <div className="col-lg-4 d-flex col-md-6">
                  {/* Price Card */}
                  <div className="price-card flex-fill ">
                    <div className="price-head">
                      <ImageWithBasePath
                        src="/assets/img/icons/price-01.svg"
                        alt="Price"
                      />
                      <h3>Professoinal</h3>
                    </div>
                    <div className="price-body">
                      <div className="per-month">
                        <h2>
                          <sup>$</sup>
                          <span>60.00</span>
                        </h2>
                        <span>Per Month</span>
                      </div>
                      <div className="features-price-list">
                        <h5>Features</h5>
                        <p>Everything in our free Upto 10 users. </p>
                        <ul>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Quality checked by envato
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Future updates
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Technical Support
                          </li>
                          <li className="inactive">
                            <i className="feather-x-circle" />
                            Add Listing{" "}
                          </li>
                          <li className="inactive">
                            <i className="feather-x-circle" />
                            Approval of Listing
                          </li>
                        </ul>
                      </div>
                      <div className="price-choose">
                        <Link to="#" className="btn viewdetails-btn">
                          Choose Plan
                        </Link>
                      </div>
                      <div className="price-footer">
                        <p>
                          Use, by you or one client, in a single end product
                          which end users. charged for. The total price includes
                          the item price and a buyer fee.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /Price Card */}
                </div>
                <div className="col-lg-4 d-flex col-md-6">
                  {/* Price Card */}
                  <div className="price-card flex-fill">
                    <div className="price-head expert-price">
                      <ImageWithBasePath
                        src="/assets/img/icons/price-02.svg"
                        alt="Price"
                      />
                      <h3>Expert</h3>
                      <span>Recommended</span>
                    </div>
                    <div className="price-body">
                      <div className="per-month">
                        <h2>
                          <sup>$</sup>
                          <span>60.00</span>
                        </h2>
                        <span>Per Month</span>
                      </div>
                      <div className="features-price-list">
                        <h5>Features</h5>
                        <p>Everything in our free Upto 10 users. </p>
                        <ul>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Quality checked by envato
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Future updates
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Technical Support
                          </li>
                          <li className="inactive">
                            <i className="feather-x-circle" />
                            Add Listing{" "}
                          </li>
                          <li className="inactive">
                            <i className="feather-x-circle" />
                            Approval of Listing
                          </li>
                        </ul>
                      </div>
                      <div className="price-choose active-price">
                        <Link to="#" className="btn viewdetails-btn">
                          Choose Plan
                        </Link>
                      </div>
                      <div className="price-footer">
                        <p>
                          Use, by you or one client, in a single end product
                          which end users. charged for. The total price includes
                          the item price and a buyer fee.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /Price Card */}
                </div>
                <div className="col-lg-4 d-flex col-md-6">
                  {/* Price Card */}
                  <div className="price-card flex-fill">
                    <div className="price-head">
                      <ImageWithBasePath
                        src="/assets/img/icons/price-03.svg"
                        alt="Price"
                      />
                      <h3>Enterprise</h3>
                    </div>
                    <div className="price-body">
                      <div className="per-month">
                        <h2>
                          <sup>$</sup>
                          <span>990.00</span>
                        </h2>
                        <span>Per Month</span>
                      </div>
                      <div className="features-price-list">
                        <h5>Features</h5>
                        <p>Everything in our free Upto 10 users. </p>
                        <ul>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Quality checked by envato
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Included : Future updates
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Technical Support
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Add Listing{" "}
                          </li>
                          <li className="active">
                            <i className="feather-check-circle" />
                            Approval of Listing
                          </li>
                        </ul>
                      </div>
                      <div className="price-choose">
                        <Link to="#" className="btn viewdetails-btn">
                          Choose Plan
                        </Link>
                      </div>
                      <div className="price-footer">
                        <p>
                          Use, by you or one client, in a single end product
                          which end users. charged for. The total price includes
                          the item price and a buyer fee.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* /Price Card */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Featured Plans */}
        {/* Latest News */}
        <section className="section featured-venues latest-news">
          <div className="container">
            <div className="section-heading">
              <h2>
                The Latest <span>News</span>
              </h2>
              <p className="sub-title">
                Get the latest buzz from the badminton world- stay informed and
                inspired by the thrilling updates and remarkable achievements in
                the sport.
              </p>
            </div>
            <div className="row">
              <div className="featured-slider-group ">
                <div className="featured-venues-slider owl-theme">
                  <Slider {...featuredVenuesSlider}>
                    {/* News */}
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-07.jpg"
                              className="img-fluid"
                              alt="Venues"
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
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-01.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                              Orlando Waters
                              <span>
                                <i className="feather-calendar" />
                                15 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              Badminton Gear Guide: Must-Have Equipment for
                              Every Player
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
                                className="img-fluid"
                                alt="Icon"
                              />
                              10 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /News */}
                    {/* News */}
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-08.jpg"
                              className="img-fluid"
                              alt="Venues"
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
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-06.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                              Claire Nichols
                              <span>
                                <i className="feather-calendar" />
                                16 Jun 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              Badminton Techniques: Mastering the Smash, Drop
                              Shot, and Clear
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
                                className="img-fluid"
                                alt="Icon"
                              />
                              12 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /News */}
                    {/* News */}
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-09.jpg"
                              className="img-fluid"
                              alt="Venues"
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
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-02.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                              Joanna Le
                              <span>
                                <i className="feather-calendar" />
                                11 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title">
                            <Link to="#">
                              The Evolution of Badminton:From Backyard Fun to
                              Olympic Sport
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
                                className="img-fluid"
                                alt="Icon"
                              />
                              14 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /News */}
                    {/* News */}
                    <div className="featured-venues-item">
                      <div className="listing-item mb-0">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="/assets/img/venues/venues-08.jpg"
                              className="img-fluid"
                              alt="Venues"
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
                              <ImageWithBasePath
                                src="/assets/img/profiles/avatar-03.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                              Mart Sublin
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
                                <i className="feather-heart" />
                                35
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="/assets/img/icons/clock.svg"
                                className="img-fluid"
                                alt="Icon"
                              />
                              12 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /News */}
                  </Slider>
                </div>
              </div>
            </div>
            {/* View More */}
            <div className="view-all text-center">
              <Link to={routes.blogList} className="btn btn-secondary btn-icon">
                View All News
                <i className="feather-arrow-right-circle ms-2" />
              </Link>
            </div>
            {/* View More */}
          </div>
        </section>
        {/* /Latest News */}
        {/* Newsletter */}
        <section className="section newsletter-sport">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div className="subscribe-style">
                  <div className="banner-blk">
                    <ImageWithBasePath
                      src="/assets/img/subscribe-bg.jpg"
                      className="img-fluid"
                      alt="Banner"
                    />
                  </div>
                  <div className="banner-info ">
                    <ImageWithBasePath
                      src="/assets/img/icons/subscribe.svg"
                      className="img-fluid"
                      alt="Banner"
                    />
                    <h2>Subscribe to Newsletter</h2>
                    <p>Just for you, exciting badminton news updates.</p>
                    <div className="subscribe-blk bg-white">
                      <div className="input-group align-items-center">
                        <i className="feather-mail" />
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Email Address"
                          aria-label="email"
                        />
                        <div className="subscribe-btn-grp">
                          <input
                            type="submit"
                            className="btn btn-secondary"
                            defaultValue="Subscribe"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Newsletter */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default AboutUs;
