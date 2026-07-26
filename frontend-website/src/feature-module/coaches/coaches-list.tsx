import React, {useState} from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const CoachesList = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [selectedSort, setSelectedSort] = useState();

  
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];


  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Coaches List Without Sidebar</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Coaches List</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
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
                          <span>150</span> coaches are listed
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
                              <Link to={routes.coachesGrid}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-01.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.coachesList} className="active">
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-02.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.coachesMap}>
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
          <div className="row">
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-05.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={1} onClick={() => handleItemClick(1)}>
                      <span className="tag tag-blue">Professional</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[1] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>300 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $250 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Kevin Anderson</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Port Alsworth, AK
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Certified Badminton Coach with a deep understanding of
                        the sport&apos;s techniques and strategies.
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>20 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-06.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={2} onClick={() => handleItemClick(2)}>
                      <span className="tag tag-blue">Rookie</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[2] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $120 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Angela Roudrigez</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Guysville, OH
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Experienced coach dedicated to enhancing your badminton
                        skills and unlocking your full potential.
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>21 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-07.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={3} onClick={() => handleItemClick(3)}>
                      <span className="tag tag-blue">Professional</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $750 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Evon Raddick</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Little Rock, AR
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Passionate Badminton Coach unlocking players&apos; potential
                        through strategic gameplay
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>22 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-08.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={4} onClick={() => handleItemClick(4)}>
                      <span className="tag tag-blue">Intermediate</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[4] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $550 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Harry Richardson</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Roanoke, VA
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Experienced Coach passionate about elevating players&apos;
                        skills and fostering a love for the game.
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>23 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-09.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={5} onClick={() => handleItemClick(5)}>
                      <span className="tag tag-blue">Professional</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[5] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $550 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Pete Hill</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Huntsville, AL
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Dedicated Badminton Coach refining players skills and
                        techniques to ignite the game
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>24 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-10.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={6} onClick={() => handleItemClick(6)}>
                      <span className="tag tag-blue">Intermediate</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[6] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $350 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Victor Newman</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Sacramento, CA
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Badminton coach with a passion for improving players&apos;
                        abilities and tactics.
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>24 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link to="#" className="btn btn-primary w-100">
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="btn btn-secondary w-100">
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-11.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={7} onClick={() => handleItemClick(7)}>
                      <span className="tag tag-blue">Herman</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[7] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $350 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Washington, MD</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Port Alsworth, AK
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Dedicated badminton expert meticulously perfecting
                        techniques for best results
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>24 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-12.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={8} onClick={() => handleItemClick(8)}>
                      <span className="tag tag-blue">Professional</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[8] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $180 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Joshua Rogers</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Port Alsworth, AK
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Detail-oriented badminton enthusiast with a patient
                        coaching approach.
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>24 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            {/* Featured Item */}
            <div className="col-lg-12">
              <div className="featured-venues-item">
                <div className="listing-item listing-item-grid coach-listview">
                  <div className="listing-img">
                    <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src="assets/img/featured/featured-13.jpg"
                        alt="Venue"
                      />
                    </Link>
                    <div className="fav-item-venues" key={9} onClick={() => handleItemClick(9)}>
                      <span className="tag tag-blue">Professional</span>
                      <div className="list-reviews coche-star">
                        <Link to="#" className={`fav-icon ${selectedItems[9] ? "selected" : ""}`}>
                          <i className="feather-heart" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="listing-content">
                    <div className="list-reviews near-review near-review-list">
                      <div className="d-flex align-items-center">
                        <span className="rating-bg">4.2</span>
                        <span>80 Reviews</span>
                      </div>
                      <span className="mile-away">
                        <span>From</span> $150 <span>/hr</span>
                      </span>
                    </div>
                    <h3 className="listing-title">
                      <Link to={routes.coachDetail}>Jamal Dean</Link>
                    </h3>
                    <ul className="mb-2">
                      <li>
                        <span>
                          <i className="feather-map-pin me-2" />
                          Roseau, MN
                        </span>
                      </li>
                    </ul>
                    <div className="listing-details-group">
                      <p>
                        Meticulous badminton enthusiast with a gentle coaching
                        style
                      </p>
                    </div>
                    <div className="avalbity-review avalbity-review-list">
                      <ul>
                        <li>
                          <div className="avalibity-date">
                            <span>
                              <i className="feather-calendar" />
                            </span>
                            <div className="avalibity-datecontent">
                              <h6>Next Availabilty</h6>
                              <h5>24 May 2023</h5>
                            </div>
                          </div>
                        </li>
                      </ul>
                      <ul className="profile-coache-list">
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-primary w-100"
                          >
                            <i className="feather-eye me-2" /> View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={routes.coachDetail}
                            className="btn btn-secondary w-100"
                          >
                            <i className="feather-calendar me-2" /> Book Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Featured Item */}
            <div className="col-12 text-center mt-3">
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
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CoachesList;
