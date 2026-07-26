import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";

const TestimonialsCarousel = () => {
  const route = all_routes;
  const images = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="main-wrapper testimonials-carousel innerpagebg">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Testimonials Carousel</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Testimonials Carousel</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content carousel-content">
          <div className="container">
            <div className="featured-slider-group p-0">
              <div className="owl-carousel testimonials-slider owl-theme">
              <Slider {...images}>
                {/* Testimonials Item */}
                <div className="testimonial-group">
                  <div className="testimonial-review">
                    <div className="rating-point">
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      KheloIndore coaching services enhanced my badminton
                      skills. Personalized attention from knowledgeable coaches
                      propelled my game to new heights.
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-01.jpg"
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      KheloIndore advanced badminton equipment has greatly
                      improved my performance on the court. Their quality range
                      of rackets and shoes made a significant impact.
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-05.jpg"
                        alt="User"
                      />
                    </Link>
                    <div className="testimonial-content">
                      <h5>Mart Sublin</h5>
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      KheloIndore unmatched professionalism and service
                      excellence left a positive experience. Highly recommended
                      for court rentals and equipment purchases.
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-06.jpg"
                        alt="User"
                      />
                    </Link>
                    <div className="testimonial-content">
                      <h5>Rebecca</h5>
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-01.jpg"
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-05.jpg"
                        alt="User"
                      />
                    </Link>
                    <div className="testimonial-content">
                      <h5>Andrew</h5>
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-06.jpg"
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-01.jpg"
                        alt="User"
                      />
                    </Link>
                    <div className="testimonial-content">
                      <h5>Andrew</h5>
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-05.jpg"
                        alt="User"
                      />
                    </Link>
                    <div className="testimonial-content">
                      <h5>Rebecca</h5>
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
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <span> 5.0</span>
                    </div>
                    <h5>Finibus mauris. Aliquam consectetur</h5>
                    <p>
                      Finibus mauris. Aliquam consectetur, ex in gravida
                      porttitor. There are many variations of passagesnunc. In
                      sem leo, fermentum at lorem in, porta finibus mauris.
                      Aliquam consectetur, ex in gravida porttitor. There are
                      many variations of passages
                    </p>
                  </div>
                  <div className="listing-venue-owner">
                    <Link to="#" className="navigation">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-06.jpg"
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
                </Slider>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default TestimonialsCarousel;
