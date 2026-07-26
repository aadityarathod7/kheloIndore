import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";
import { all_routes } from "../router/all_routes";
import { Link } from "react-router-dom";

const LessonTimedate = () => {
  const [isChecked1, setIsChecked1] = useState(true);
  const [isChecked2, setIsChecked2] = useState(true);
  const [isChecked3, setIsChecked3] = useState(true);

  const handleToggle1 = () => {
    setIsChecked1(!isChecked1);
  };
  const handleToggle2 = () => {
    setIsChecked2(!isChecked2);
  };
  const handleToggle3 = () => {
    setIsChecked3(!isChecked3);
  };
  const routes = all_routes;
  const dateSlider = {
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
  const [selectedItems, setSelectedItems] = useState(Array(6).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Book A Coach</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Book A Coach</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      <section className="booking-steps py-30">
        <div className="container">
          <ul className="d-xl-flex justify-content-center align-items-center">
            <li>
              <h5>
                <Link to={routes.coachDetails}>
                  <span>1</span>Type of Booking
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.lessonType}>
                  <span>2</span>Leeson Type
                </Link>
              </h5>
            </li>
            <li className="active">
              <h5>
                <Link to={routes.lessonTimeDate}>
                  <span>3</span>Time &amp; Date
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.lessonPersonalInfo}>
                  <span>4</span>Personal Information
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.lessonOrderConfirm}>
                  <span>5</span>Order Confirmation
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.lessonPayment}>
                  <span>6</span>Payment
                </Link>
              </h5>
            </li>
          </ul>
        </div>
      </section>
      {/* Page Content */}
      <div className="content">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">Book A Coach</h3>
              <p className="sub-title">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="d-sm-flex justify-content-between align-items-center">
                <div className="d-sm-flex justify-content-start align-items-center">
                  <Link to="#">
                    <ImageWithBasePath
                      className="corner-radius-10"
                      src="assets/img/profiles/avatar-02.png"
                      alt="User"
                    />
                  </Link>
                  <div className="info">
                    <div className="d-flex justify-content-start align-items-center mb-3">
                      <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                        4.5
                      </span>
                      <span>300 Reviews</span>
                    </div>
                    <h3 className="mb-2">Kevin Anderson</h3>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                </div>
                <div className="white-bg">
                  <p className="mb-1">Starts From</p>
                  <h3 className="d-inline-block primary-text mb-0">$150</h3>
                  <span>/hr</span>
                </div>
              </div>
            </div>
          </section>
          <div
            className="alert alert-danger mb-40 text-center corner-radius-10"
            role="alert"
          >
            <p className="mb-0">
              Select Only 3 Days for <strong>Individual Lesson</strong>
            </p>
          </div>
          <div className="row text-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-8">
              <div className="card time-date-card">
                <section className="booking-date">
                  <div className="list-unstyled date-slider owl-theme mb-40">
                    <Slider {...dateSlider}>
                      <div className="booking-date-item">
                        <h6>Monday</h6>
                        <p>Apr 24</p>
                      </div>
                      <div className="booking-date-item">
                        <h6>Tuesday</h6>
                        <p>Apr 25</p>
                      </div>
                      <div className="booking-date-item">
                        <h6>Wednesday</h6>
                        <p>Apr 26</p>
                      </div>
                      <div className="booking-date-item">
                        <h6>Thursday</h6>
                        <p>Apr 27</p>
                      </div>
                      <div className="booking-date-item">
                        <h6>Friday</h6>
                        <p>Apr 28</p>
                      </div>
                      <div className="booking-date-item">
                        <h6>Saturday</h6>
                        <p>Apr 29</p>
                      </div>
                    </Slider>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>2:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>2:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>2:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>2:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>3:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>3:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>3:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>3:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>4:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>
                          4:00 PM
                          <i className="fa-regular fa-check-circle" />
                        </span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>4:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>4:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>5:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>5:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${isChecked1 ? "checked" : ""}`}
                        onClick={handleToggle1}
                      >
                        <span>5:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div className="time-slot">
                        <span>5:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[1] ? "checked" : ""}`}
                        key={1}
                        onClick={() => handleItemClick(1)}
                      >
                        <span>6:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[2] ? "checked" : ""}`}
                        key={2}
                        onClick={() => handleItemClick(2)}
                      >
                        <span>6:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[3] ? "checked" : ""}`}
                        key={3}
                        onClick={() => handleItemClick(3)}
                      >
                        <span>6:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${isChecked2 ? "checked" : ""}`}
                        onClick={handleToggle2}
                      >
                        <span>6:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[4] ? "checked" : ""}`}
                        key={4}
                        onClick={() => handleItemClick(4)}
                      >
                        <span>7:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${isChecked3 ? "checked" : ""}`}
                        onClick={handleToggle3}
                      >
                        <span>7:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[5] ? "checked" : ""}`}
                        key={5}
                        onClick={() => handleItemClick(5)}
                      >
                        <span>7:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <div
                        className={`time-slot active ${selectedItems[6] ? "checked" : ""}`}
                        key={6}
                        onClick={() => handleItemClick(6)}
                      >
                        <span>7:00 PM</span>
                        <i className="fa-regular fa-check-circle" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <aside className="card booking-details">
                <h3 className="border-bottom">Booking Details</h3>
                <ul>
                  <li>
                    <i className="me-2">
                      <ImageWithBasePath
                        src="assets/img/icons/lesson-types.svg"
                        alt="Icon"
                      />
                    </i>
                    27, April 2023
                  </li>
                  <li>
                    <i className="feather-calendar me-2" />
                    <div className="timing-points">
                      <p>Day 1 : 26, April 2023 - 7:00 PM</p>
                      <p>Day 2 : 27, April 2023 - 5:00 PM</p>
                      <p>Day 3 : 27, April 2023 - 6:00 PM</p>
                    </div>
                  </li>
                </ul>
                <div className="d-grid btn-block">
                  <button type="button" className="btn btn-primary">
                    Subtotal : $350
                  </button>
                </div>
              </aside>
            </div>
          </div>
          <div className="text-center btn-row">
            <Link
              className="btn btn-primary me-3 btn-icon"
              to={routes.lessonType}
            >
              <i className="feather-arrow-left-circle me-1" /> Back
            </Link>
            <Link
              className="btn btn-secondary btn-icon"
              to={routes.lessonPersonalInfo}
            >
              Next <i className="feather-arrow-right-circle ms-1" />
            </Link>
          </div>
        </div>
        {/* /Container */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default LessonTimedate;
