import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const ListingGridSidebar = () => {
  const [selectedItems, setSelectedItems] = useState(Array(8).fill(false));
  const [selectedSort, setSelectedSort] = useState();
  const [selectedLesson, setSelectedLesson] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [date, setDate] = useState(null);
  const routes = all_routes;

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];
  const lessonOptions = [
    { name: "Lesson 1" },
    { name: "Lesson 2" },
    { name: "Lesson 3" },
  ];
  const locationOptions = [
    { name: "Select Location" },
    { name: "Location 1" },
    { name: "Location 2" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Venue Grid With Sidebar</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Venue Grid With Sidebar</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content listing-page">
        <div className="container">
          {/* Sort By */}
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section">
                <div className="sorting-info">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-4 col-lg-3 col-sm-12 col-12">
                      <div className="count-search">
                        <p>
                          <span>400</span> venues are listed
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-8 col-lg-9 col-sm-12 col-12">
                      <div className="sortby-filter-group">
                        <div className="grid-listview">
                          <ul className="nav">
                            <li>
                              <span>View as</span>
                            </li>
                            <li>
                              <Link
                                to={routes.listingGridSidebar}
                                className="active"
                              >
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-01.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.listingListSidebar}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-02.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.listingMapSidebar}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-03.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="sortbyset">
                          <span className="sortbytitle">Sort By</span>
                          <div className="sorting-select">
                          <Dropdown
                              value={selectedSort}
                              onChange={(e) => setSelectedSort(e.value)}
                              options={sortOptions}
                              optionLabel="name"
                              placeholder="Relevance"
                              className="select custom-select-list"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sort By */}
          {/* Listing Content Group*/}
          <div className="listing-list-sidebar">
            <div className="row">
              <div className="col-lg-4 theiaStickySidebar">
                <div className="stickybar">
                  <div className="listing-filter-group listing-item">
                    <form
                      action="#"
                      autoComplete="off"
                      className="listing-content"
                    >
                      {/* Customer */}
                      <div className="sidebar-heading">
                        <h3>
                          Advanced <span>Search</span>
                        </h3>
                        <p>
                          <Link to="#">Clear All</Link>
                        </p>
                      </div>
                      <div className="listing-search">
                        <div className="form-custom">
                          <input
                            type="text"
                            className="form-control"
                            id="member_search1"
                            placeholder="What are you looking for"
                          />
                          <button className="btn">
                            <span>
                              <i className="feather-search" />
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="accordion" id="accordionMain1">
                        <div className="card-header-new" id="headingOne">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Lesson type
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseOne"
                          className="collapse show"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionExample1"
                        >
                          <div className="card-body-chat">
                            <div className="sorting-select">
                              <span>
                                <i className="feather-list" />
                              </span>
                              <Dropdown
                                value={selectedLesson}
                                onChange={(e) => setSelectedLesson(e.value)}
                                options={lessonOptions}
                                optionLabel="name"
                                placeholder="Lesson 1"
                                className="select-bg w-100 list-sidebar-select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Customer */}
                      <div className="accordion" id="accordionMain2">
                        <div className="card-header-new" id="headingTwo">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="true"
                              aria-controls="collapseTwo"
                            >
                              Location
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseTwo"
                          className="collapse"
                          aria-labelledby="headingTwo"
                          data-bs-parent="#accordionExample2"
                        >
                          <div className="card-body-chat">
                            <div className="sorting-select">
                              <span>
                                <i className="feather-map-pin" />
                              </span>
                              <Dropdown
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.value)}
                                options={locationOptions}
                                optionLabel="name"
                                placeholder="Select Location"
                                className="select-bg w-100 list-sidebar-select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* By Status */}
                      <div className="accordion" id="accordionMain3">
                        <div className="card-header-new" id="headingThree">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-expanded="true"
                              aria-controls="collapseThree"
                            >
                              Radius
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseThree"
                          className="collapse"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordionExample3"
                        >
                          <div className="card-body-chat">
                            <div className="filter-range">
                            <Slider
                                className="input-range"
                                min={0}
                                max={100}
                                defaultValue={[0, 50]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /By Status */}
                      {/* Category */}
                      <div className="accordion" id="accordionMain4">
                        <div className="card-header-new" id="headingFour">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFour"
                              aria-expanded="true"
                              aria-controls="collapseFour"
                            >
                              Price Range
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseFour"
                          className="collapse"
                          aria-labelledby="headingFour"
                          data-bs-parent="#accordionExample4"
                        >
                          <div className="card-body-chat range-price">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form-custom">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Min Price"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-custom">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Max Price"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Category */}
                      {/* Guests */}
                      <div className="accordion" id="accordionMain5">
                        <div className="card-header-new" id="headingFive">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFive"
                              aria-expanded="true"
                              aria-controls="collapseFive"
                            >
                              Guests
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseFive"
                          className="collapse"
                          aria-labelledby="headingFive"
                          data-bs-parent="#accordionExample5"
                        >
                          <div className="card-body-chat">
                            <div id="checkBoxes5">
                              <div className="selectBox-cont">
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  0-2
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" /> 2-4
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" /> 4-5
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" /> More than 5+
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Guests */}
                      {/* Reviews */}
                      <div className="accordion" id="accordionMain6">
                        <div className="card-header-new" id="headingSix">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseSix"
                              aria-expanded="true"
                              aria-controls="collapseSix"
                            >
                              Reviews
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseSix"
                          className="collapse"
                          aria-labelledby="headingSix"
                          data-bs-parent="#accordionExample6"
                        >
                          <div className="card-body-chat">
                            <div id="checkBoxes4">
                              <div className="selectBox-cont">
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled " />
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled " />
                                  <i className="fas fa-star filled" />
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled text-warning" />
                                  <i className="fas fa-star filled " />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                </label>
                                <div className="view-content">
                                  <div className="viewall-Two">
                                    <label className="custom_check w-100">
                                      <input type="checkbox" name="username" />
                                      <span className="checkmark" />
                                      <i className="fas fa-star filled text-warning" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Reviews */}
                      {/* Amenities */}
                      <div className="accordion" id="accordionMain7">
                        <div className="card-header-new" id="headingSeven">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseSeven"
                              aria-expanded="true"
                              aria-controls="collapseSeven"
                            >
                              Availability
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseSeven"
                          className="collapse"
                          aria-labelledby="headingSeven"
                          data-bs-parent="#accordionExample7"
                        >
                          <div className="card-body-chat datepicker-calendar">
                            <div id="checkBoxes7">
                              <div className="selectBox-cont">
                                <div className="card-body">
                                <div
                                    id="calendar-doctor"
                                    className="calendar-container"
                                  >
                                    <Calendar
                                      value={date}
                                      onChange={(e) => setDate(e.value)}
                                      inline
                                      showWeek
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Amenities */}
                      {/* Amenities */}
                      <div className="accordion" id="accordionMain8">
                        <div className="card-header-new" id="headingEight">
                          <h5 className="filter-title">
                            <Link
                              to="#"
                              className="w-100 collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseEight"
                              aria-expanded="true"
                              aria-controls="collapseEight"
                            >
                              Amenities
                              <span className="accordion-arrow">
                                <i className="fa-solid fa-chevron-down" />
                              </span>
                            </Link>
                          </h5>
                        </div>
                        <div
                          id="collapseEight"
                          className="collapse"
                          aria-labelledby="headingEight"
                          data-bs-parent="#accordionExample8"
                        >
                          <div className="card-body-chat">
                            <div id="checkBoxes8">
                              <div className="selectBox-cont">
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  Waiting Area
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  Waiting Area
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  Clothes
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  Wi-fi
                                </label>
                                <label className="custom_check w-100">
                                  <input type="checkbox" name="category" />
                                  <span className="checkmark" />
                                  Parking
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /Amenities */}
                      <button
                        type="submit"
                        className="search-btn btn w-100 btn-primary"
                      >
                        <span>
                          <i className="feather-search me-2" />
                        </span>
                        Search Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                {/* Listing Content */}
                <div className="row justify-content-center">
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-01.jpg"
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
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[1] ? "selected" : ""}`}
                              key={1}
                              onClick={() => handleItemClick(1)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
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
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    21 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-01.jpg"
                                  alt="User"
                                />
                                Mart Sublin
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-02.jpg"
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
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[2] ? "selected" : ""}`}
                              key={2}
                              onClick={() => handleItemClick(2)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              Badminton Academy
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Unleash your badminton potential at our premier
                              Badminton Academy, where champions are made.
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
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    15 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-02.jpg"
                                  alt="User"
                                />
                                Rebecca
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-03.jpg"
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
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                              key={3}
                              onClick={() => handleItemClick(3)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              Manchester Academy
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Manchester Academy: Where dreams meet excellence
                              in sports education and training.
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
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    16 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-03.jpg"
                                  alt="Venue"
                                />
                                Andrew
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-04.jpg"
                              className="img-fluid"
                              alt="Venues"
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <h5 className="tag tag-primary">
                              $100<span>/hr</span>
                            </h5>
                          </div>
                        </div>
                        <div className="listing-content">
                          <div className="list-reviews">
                            <div className="d-flex align-items-center">
                              <span className="rating-bg">5.0</span>
                              <span>100 Reviews</span>
                            </div>
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[4] ? "selected" : ""}`}
                              key={4}
                              onClick={() => handleItemClick(4)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              NG Sports Academy
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Achieve your badminton goals at NG Sports. Book
                              your training session now in our futuristic
                              facility.
                            </p>
                            <ul>
                              <li>
                                <span>
                                  <i className="feather-map-pin" />
                                  Roanoke, VA
                                </span>
                              </li>
                              <li>
                                <span>
                                  <i className="feather-calendar" />
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    20 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-05.jpg"
                                  alt="User"
                                />{" "}
                                Jerry
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-05.jpg"
                              className="img-fluid"
                              alt="Venues"
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <h5 className="tag tag-primary">
                              $540<span>/hr</span>
                            </h5>
                          </div>
                        </div>
                        <div className="listing-content">
                          <div className="list-reviews">
                            <div className="d-flex align-items-center">
                              <span className="rating-bg">4.5</span>
                              <span>80 Reviews</span>
                            </div>
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[5] ? "selected" : ""}`}
                              key={5}
                              onClick={() => handleItemClick(5)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              Rivan Badminton Academy
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Rivan Badminton Academy: Where dreams soar through
                              excellence in badminton training.
                            </p>
                            <ul>
                              <li>
                                <span>
                                  <i className="feather-map-pin" />
                                  Huntsville, AL
                                </span>
                              </li>
                              <li>
                                <span>
                                  <i className="feather-calendar" />
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    19 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-06.jpg"
                                  alt="User"
                                />{" "}
                                Connie
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-06.jpg"
                              className="img-fluid"
                              alt="Venues"
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <h5 className="tag tag-primary">
                              $780<span>/hr</span>
                            </h5>
                          </div>
                        </div>
                        <div className="listing-content">
                          <div className="list-reviews">
                            <div className="d-flex align-items-center">
                              <span className="rating-bg">4.2</span>
                              <span>140 Reviews</span>
                            </div>
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[6] ? "selected" : ""}`}
                              key={6}
                              onClick={() => handleItemClick(6)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>Russ Badminton</Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Russ Badminton : Nurturing excellence in badminton
                              education &amp; training.
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
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    18 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-04.jpg"
                                  alt="User"
                                />{" "}
                                Melvin
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-07.jpg"
                              className="img-fluid"
                              alt="Venues"
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <h5 className="tag tag-primary">
                              $550<span>/hr</span>
                            </h5>
                          </div>
                        </div>
                        <div className="listing-content">
                          <div className="list-reviews">
                            <div className="d-flex align-items-center">
                              <span className="rating-bg">5.0</span>
                              <span>120 Reviews</span>
                            </div>
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[7] ? "selected" : ""}`}
                              key={7}
                              onClick={() => handleItemClick(7)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              Andy’s Sports Academy
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Unlock your athletic potential at Andy&apos;s
                              Sport Academy. Book now at our state-of-the-art
                              facility.
                            </p>
                            <ul>
                              <li>
                                <span>
                                  <i className="feather-map-pin" />
                                  Washington, MD
                                </span>
                              </li>
                              <li>
                                <span>
                                  <i className="feather-calendar" />
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    19 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-07.jpg"
                                  alt="User"
                                />{" "}
                                Richard
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/* Featured Item */}
                  <div className="col-lg-6 col-md-6">
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div className="listing-img">
                          <Link to={routes.venueDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-08.jpg"
                              className="img-fluid"
                              alt="Venues"
                            />
                          </Link>
                          <div className="fav-item-venues">
                            <h5 className="tag tag-primary">
                              $740<span>/hr</span>
                            </h5>
                          </div>
                        </div>
                        <div className="listing-content">
                          <div className="list-reviews">
                            <div className="d-flex align-items-center">
                              <span className="rating-bg">4.5</span>
                              <span>470 Reviews</span>
                            </div>
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[8] ? "selected" : ""}`}
                              key={8}
                              onClick={() => handleItemClick(8)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div>
                          <h3 className="listing-title">
                            <Link to={routes.venueDetails}>
                              Herique Badminton
                            </Link>
                          </h3>
                          <div className="listing-details-group">
                            <p>
                              Herique Badminton: Elevate your game. Train with
                              passion at our exclusive facility.{" "}
                            </p>
                            <ul>
                              <li>
                                <span>
                                  <i className="feather-map-pin" />
                                  Indianapolis, IN
                                </span>
                              </li>
                              <li>
                                <span>
                                  <i className="feather-calendar" />
                                  Next availablity :{" "}
                                  <span className="primary-text">
                                    16 May 2023
                                  </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="listing-button">
                            <div className="listing-venue-owner">
                              <Link className="navigation">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-08.jpg"
                                  alt="User"
                                />{" "}
                                Wayne
                              </Link>
                            </div>
                            <Link
                              to={routes.venueDetails}
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
                  </div>
                  {/* /Featured Item */}
                  {/*Pagination*/}
                  <div className="pagination-group">
                    <nav>
                      <ul className="pagination page-item justify-content-center">
                        <li className="previtem">
                          <Link className="page-link" to="#">
                            <span>
                              <i className="feather-chevrons-left" />
                            </span>
                          </Link>
                        </li>
                        <li className="justify-content-center pagination-center">
                          <div className="page-group">
                            <ul>
                              <li className="page-item">
                                <Link className="page-link" to="#">
                                  <span>
                                    <i className="feather-chevron-left" />
                                  </span>
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link className="page-link" to="#">
                                  1
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link className="active page-link" to="#">
                                  2{" "}
                                  <span className="visually-hidden">
                                    (current)
                                  </span>
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link className="page-link" to="#">
                                  3
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link className="page-link" to="#">
                                  4
                                </Link>
                              </li>
                              <li className="page-item">
                                <Link className="page-link" to="#">
                                  <span>
                                    <i className="feather-chevron-right" />
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="nextlink">
                          <Link className="page-link" to="#">
                            <span>
                              <i className="feather-chevrons-right" />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  {/*/Pagination*/}
                </div>
                {/* /Listing Content */}
              </div>
            </div>
          </div>
          {/* Listing Content Group*/}
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default ListingGridSidebar;
