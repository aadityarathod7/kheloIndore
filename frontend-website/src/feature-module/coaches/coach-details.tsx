import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const CoachDetails = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const activateTab = (index: React.SetStateAction<number>) => {
    setActiveTabIndex(index);
  };

  const isTabActive = (index: number) => {
    return activeTabIndex === index;
  };

  const routes = all_routes;
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
        <span className="primary-right-round" />
        <div className="container">
          <ul className="d-xl-flex justify-content-center align-items-center">
            {/* <li className="active">
              <h5>
                <Link to={routes.coachDetails}>
                  <span>1</span>Type of Booking
                </Link>
              </h5>
            </li> */}
            <li className="active">
              <h5>
                <Link to={routes.CoachTimeDate}>
                  <span>1</span>Time &amp; Date
                </Link>
              </h5>
            </li>
            {/* <li>
              <h5>
                <Link to={routes.coachPersonalInfo}>
                  <span>3</span>Personal Information
                </Link>
              </h5>
            </li> */}
            <li>
              <h5>
                <Link to={routes.CoachOrderConfirm}>
                  <span>2</span>Order Confirmation
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.CoachPayment}>
                  <span>3</span>Payment
                </Link>
              </h5>
            </li>
          </ul>
        </div>
      </section>
      {/* Page Content */}
      <div className="content book-cage">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">Book A Coach</h3>
              <p className="sub-title">
                Unlock Your Potential with a Personal Coach
              </p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="d-sm-flex justify-content-between align-items-center">
                <div className="d-sm-flex justify-content-start align-items-center">
                  <Link to="#">
                    <ImageWithBasePath
                      className="corner-radius-10"
                      src="/assets/img/profiles/avatar-02.png"
                      alt="Venue"
                    />
                  </Link>
                  <div className="info">
                    <div className="d-flex justify-content-start align-items-center mb-3">
                      <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                        4.5
                      </span>
                      <span>300 Reviews</span>
                    </div>
                    {/* <h3 className="mb-2">Kevin Anderson</h3>
                    <p>
                      Certified Badminton Coach with a deep understanding of the
                      sport&apos;s strategies.
                    </p> */}
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
          <section className="text-center coach-types">
            <div className="border-block">
              <h3 className="mb-2">How do you prefer to book your Coach?</h3>
              <p>Please Select the Options below </p>
              <ul className="d-flex justify-content-center align-items-center">
                <li
                  className={`d-flex justify-content-between align-items-center me-4 ${isTabActive(0) ? "active" : ""}`}
                  onClick={() => activateTab(0)}
                >
                  <p className="d-inline-block">
                    Only Book a Coach for Session
                  </p>
                  <i className="fa-solid fa-angle-right" />
                </li>
                <li
                  className={`d-flex justify-content-between align-items-center coach-and-lessons ${isTabActive(1) ? "active" : ""}`}
                  id="lesson"
                  onClick={() => activateTab(1)}
                >
                  <p className="d-inline-block">
                    Commit To Training With Coach &amp; Lessons
                  </p>
                  <i className="fa-solid fa-angle-right" />
                </li>
              </ul>
            </div>
            <div className="text-center btn-row">
              <Link className="btn btn-primary me-3 btn-icon" to="#">
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <Link
                className="btn btn-secondary btn-icon change-url"
                to={routes.CoachTimeDate}
              >
                Next <i className="feather-arrow-right-circle ms-1" />
              </Link>
            </div>
          </section>
        </div>
        {/* /Container */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CoachDetails;
