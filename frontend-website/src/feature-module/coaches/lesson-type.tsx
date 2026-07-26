import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Link } from "react-router-dom";

const LessonType = () => {
  const routes = all_routes;
  const [activeButton, setActiveButton] = useState(0);

  const setActiveCheckbox = (buttonNumber: React.SetStateAction<number>) => {
    setActiveButton(buttonNumber);
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
            <li className="active">
              <h5>
                <Link to={routes.lessonType}>
                  <span>2</span>Leeson Type
                </Link>
              </h5>
            </li>
            <li>
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
              <h3 className="mb-1">Lesson Type</h3>
              <p className="sub-title">
                Enhance your badminton skills with personalized lessons. Book a
                coach and elevate your game.
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
                      Certified Badminton Coach with a deep understanding of the
                      sport&apos;s strategies.
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
          <section className="card">
            <ul className="d-flex lesson-types">
              <li className={activeButton === 1 ? "active" : ""}>
                <Link className="btn" onClick={() => setActiveCheckbox(1)}>
                  <h6>
                    Single Lesson<i className="fa-regular fa-check-circle"></i>
                  </h6>
                </Link>
                <p>
                  3 Days * 1 hour @{" "}
                  <span className="primary-text">$150.00</span>
                </p>
              </li>

              <li className={activeButton === 2 ? "active" : ""}>
                <Link to="#" className="btn" onClick={() => setActiveCheckbox(2)}>
                  <h6>
                    2 Player Lesson
                    <i className="fa-regular fa-check-circle"></i>
                  </h6>
                </Link>
                <p>
                  4 Days * 1 hour @{" "}
                  <span className="primary-text">$150.00</span>
                  <br /> *2 players of similar age and ability
                </p>
              </li>

              <li className={activeButton === 3 ? "active" : ""}>
                <Link to="#"className="btn" onClick={() => setActiveCheckbox(3)}>
                  <h6>
                    Group Lesson<i className="fa-regular fa-check-circle"></i>
                  </h6>
                </Link>
                <p>
                  2 Days * 1 hour @{" "}
                  <span className="primary-text">$200.00</span>
                  <br /> *4 players of similar age and ability
                </p>
              </li>
            </ul>
          </section>
          <div className="text-center btn-row">
            <Link
              className="btn btn-primary me-3 btn-icon"
              to={routes.coachDetails}
            >
              <i className="feather-arrow-left-circle me-1" /> Back
            </Link>
            <Link
              className="btn btn-secondary btn-icon"
              to={routes.lessonTimeDate}
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

export default LessonType;
