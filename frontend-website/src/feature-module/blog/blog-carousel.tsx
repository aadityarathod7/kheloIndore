import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const BlogCarousel = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
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
          <h1 className="text-white">Blog Carousal</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Blog Carousal</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content blog-grid carousal-blog">
        <div className="container">
          <div className="featured-slider-group p-0">
            <div className="blog-slider owl-theme">
              <Slider {...featuredVenuesSlider}>
                {/* Blog */}
                <div className="featured-venues-item">
                  <div className="listing-item mb-0">
                    <div className="listing-img">
                      <Link to={routes.blogDetails}>
                        <ImageWithBasePath
                          src="assets/img/venues/venues-07.jpg"
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
                              src="assets/img/profiles/avatar-01.jpg"
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
                            src="assets/img/icons/clock.svg"
                            alt="Icon"
                          />
                          10 Min To Read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Blog */}
                {/* Blog */}
                <div className="featured-venues-item">
                  <div className="listing-item mb-0">
                    <div className="listing-img">
                      <Link to={routes.blogDetails}>
                        <ImageWithBasePath
                          src="assets/img/venues/venues-08.jpg"
                          alt="Venue"
                        />
                      </Link>
                      <div
                        className="fav-item-venues news-sports"
                        key={2}
                        onClick={() => handleItemClick(2)}
                      >
                        <span className="tag tag-blue">Sports Activites</span>
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
                              src="assets/img/profiles/avatar-06.jpg"
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
                          Sports Make Us A Lot Stronger And Healthier Than We
                          Think
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
                            src="assets/img/icons/clock.svg"
                            alt="Icon"
                          />
                          12 Min To Read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Blog */}
                {/* Blog */}
                <div className="featured-venues-item">
                  <div className="listing-item mb-0">
                    <div className="listing-img">
                      <Link to={routes.blogDetails}>
                        <ImageWithBasePath
                          src="assets/img/venues/venues-09.jpg"
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
                              src="assets/img/profiles/avatar-06.jpg"
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
                            src="assets/img/icons/clock.svg"
                            alt="Icon"
                          />
                          14 Min To Read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Blog */}
                {/* Blog */}
                <div className="featured-venues-item">
                  <div className="listing-item mb-0">
                    <div className="listing-img">
                      <Link to={routes.blogDetails}>
                        <ImageWithBasePath
                          src="assets/img/venues/venues-08.jpg"
                          alt="Venue"
                        />
                      </Link>
                      <div
                        className="fav-item-venues news-sports"
                        key={4}
                        onClick={() => handleItemClick(4)}
                      >
                        <span className="tag tag-blue">Sports Activites</span>
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
                              src="assets/img/profiles/avatar-01.jpg"
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
                          Sports Make Us A Lot Stronger And Healthier Than We
                          Think
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
                            src="assets/img/icons/clock.svg"
                            alt="Icon"
                          />
                          12 Min To Read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Blog */}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default BlogCarousel;
