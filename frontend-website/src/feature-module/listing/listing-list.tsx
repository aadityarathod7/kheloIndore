import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const ListingList = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(8).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const [selectedSort, setSelectedSort] = useState();

  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Venue List Without Sidebar</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Venue List Without Sidebar</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content listing-list-page">
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
                              <Link to={routes.listingGrid}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-01.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.listingList} className="active">
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-02.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.listingMap}>
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
          {/* Listing Content */}
          <div className="row justify-content-center">
            {/* Featured Item */}
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
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
                        key={1}
                        onClick={() => handleItemClick(1)}
                        className={`fav-icon ${selectedItems[1] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>Sarah Sports Academy</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Elevate your athletic journey at Sarah Sports Academy,
                        where excellence meets opportunity.
                      </p>
                      <ul className="listing-details-info">
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
                            <span className="primary-text">21 May 2023</span>
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
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
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
                        key={2}
                        onClick={() => handleItemClick(2)}
                        className={`fav-icon ${selectedItems[2] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>Badminton Academy</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Unleash your badminton potential at our premier
                        Badminton Academy, where champions are made.
                      </p>
                      <ul className="listing-details-info">
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
                            <span className="primary-text">16 May 2023</span>
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
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
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
                        key={9}
                        onClick={() => handleItemClick(9)}
                        className={`fav-icon ${selectedItems[9] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>Manchester Academy</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Manchester Academy: Where dreams meet excellence in
                        sports education and training.
                      </p>
                      <ul className="listing-details-info">
                        <li>
                          <span>
                            <i className="feather-map-pin" />
                            Little Rock, AR
                          </span>
                        </li>
                        <li>
                          <span>
                            <i className="feather-calendar" />
                            Next availablity :{" "}
                            <span className="primary-text">17 May 2023</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="listing-button">
                      <div className="listing-venue-owner">
                        <Link className="navigation">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-03.jpg"
                            alt="User"
                          />
                          Andrew
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-10.jpg"
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
                        key={3}
                        onClick={() => handleItemClick(3)}
                        className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>NG Sports Academy</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Achieve your badminton goals at NG Sports. Book your
                        training session now in our futuristic facility.
                      </p>
                      <ul className="listing-details-info">
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
                            <span className="primary-text">20 May 2023</span>
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
                          />
                          Jerry
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-11.jpg"
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
                        key={4}
                        onClick={() => handleItemClick(4)}
                        className={`fav-icon ${selectedItems[4] ? "selected" : ""}`}
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
                      <ul className="listing-details-info">
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
                            <span className="primary-text">19 May 2023</span>
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
                          />
                          Connie
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-12.jpg"
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
                        key={5}
                        onClick={() => handleItemClick(5)}
                        className={`fav-icon ${selectedItems[5] ? "selected" : ""}`}
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
                      <ul className="listing-details-info">
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
                            <span className="primary-text">18 May 2023</span>
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
                          />
                          Melvin
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-13.jpg"
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
                        <span>140 Reviews</span>
                      </div>
                      <Link
                        to="#"
                        key={6}
                        onClick={() => handleItemClick(6)}
                        className={`fav-icon ${selectedItems[6] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>Andy’s Sports Academy</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Unlock your athletic potential at Andy&apos;s Sport
                        Academy. Book now at our state-of-the-art facility.
                      </p>
                      <ul className="listing-details-info">
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
                            <span className="primary-text">15 May 2023</span>
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
                          />
                          Richard
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-13.jpg"
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
                        <span>140 Reviews</span>
                      </div>
                      <Link
                        to="#"
                        key={7}
                        onClick={() => handleItemClick(7)}
                        className={`fav-icon ${selectedItems[7] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>Herique Badminton</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        Herique Badminton: Elevate your game. Train with passion
                        at our exclusive facility.{" "}
                      </p>
                      <ul className="listing-details-info">
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
                            <span className="primary-text">16 May 2023</span>
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
                          />
                          Wayne
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-lg-12 col-md-12">
              <div className="featured-venues-item venue-list-item">
                <div className="listing-item listing-item-grid">
                  <div className="listing-img">
                    <Link to={routes.venueDetails}>
                      <ImageWithBasePath
                        src="assets/img/venues/venues-14.jpg"
                        className="img-fluid"
                        alt="Venues"
                      />
                    </Link>
                    <div className="fav-item-venues">
                      <h5 className="tag tag-primary">
                        $470<span>/hr</span>
                      </h5>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>70 Reviews</span>
                      </div>
                      <Link
                        to="#"
                        key={8}
                        onClick={() => handleItemClick(8)}
                        className={`fav-icon ${selectedItems[8] ? "selected" : ""}`}
                      >
                        <i className="feather-heart" />
                      </Link>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.venueDetails}>AG Sports</Link>
                    </h3>
                    <div className="listing-details-group">
                      <p>
                        AG Sports: Ignite your sporting journey. Train with
                        dedication at our premier facility.
                      </p>
                      <ul className="listing-details-info">
                        <li>
                          <span>
                            <i className="feather-map-pin" />
                            Roseau, MN
                          </span>
                        </li>
                        <li>
                          <span>
                            <i className="feather-calendar" />
                            Next availablity :{" "}
                            <span className="primary-text">17 May 2023</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="listing-button">
                      <div className="listing-venue-owner">
                        <Link className="navigation">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-09.jpg"
                            alt="User"
                          />
                          Philip
                        </Link>
                      </div>
                      <Link to={routes.venueDetails} className="user-book-now">
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
            <div className="col-12 text-center">
              <div className="more-details">
                <Link to="#" className="btn btn-load">
                  Load More Coaches{" "}
                  <ImageWithBasePath
                    src="assets/img/icons/u_plus-square.svg"
                    className="ms-2"
                    alt="Icon"
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* /Listing Content */}
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default ListingList;
