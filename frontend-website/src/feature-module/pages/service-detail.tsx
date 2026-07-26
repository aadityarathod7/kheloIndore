import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const ServiceDetail = () => {
  const route = all_routes;
  return (
    <>
      <div className="main-wrapper services-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Service Detail</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Service Detail</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <div className="service-detail">
              <div className="banner">
                <ImageWithBasePath
                  src="assets/img/services/service-11.jpg"
                  className="img-fluid"
                  alt="Service"
                />
              </div>
              <h2>Sports Performance Training</h2>
              <p className="mb-0">
               KheloIndore offers tailored sports performance training programs
                designed to enhance your athletic performance in badminton.
                Improve your physical conditioning, agility, speed, and strength
                through targeted exercises and specialized training techniques.{" "}
              </p>
              <div className="dull-bg text-center">
                <p className="mb-0">
                  typesetting industry. Lorem Ipsum has been the ndustry
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
              </div>
              <div className="our-benefits">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    <div className="banner">
                      <ImageWithBasePath
                        src="assets/img/services/service-12.jpg"
                        className="img-fluid"
                        alt="Service"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    <div className="info">
                      <h3>Our Benefits</h3>
                      <p>
                        Our experienced trainers will help you develop the
                        necessary attributes to excel on the badminton court.
                      </p>
                      <ul>
                        <li>
                          <i className="fa-solid fa-bolt" />{" "}
                          <span>
                            Tailored sports performance training enhances
                            endurance, agility, and flexibility.
                          </span>
                        </li>
                        <li>
                          <i className="fa-solid fa-bolt" />{" "}
                          <span>
                            Improve footwork, reaction time, and court
                            maneuverability.
                          </span>
                        </li>
                        <li>
                          <i className="fa-solid fa-bolt" />{" "}
                          <span>
                            Develop strength and power for stronger, precise
                            shots.
                          </span>
                        </li>
                        <li>
                          <i className="fa-solid fa-bolt" />{" "}
                          <span>
                            Knowledgeable trainers guide proper technique and
                            progression.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p>
                Boost physical capabilities, gain confidence, and a competitive
                edge through our inclusive sports performance training programs.
                Suitable for all levels, from beginners to advanced players
                seeking peak performance in badminton.
              </p>
            </div>
            <div className="pagination d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="prev d-flex justify-content-center align-items-center">
                  <i className="feather-arrow-left" />
                </div>
                <Link
                  to="#"
                  className="info text-left d-none d-sm-none d-md-block"
                >
                  <h4>Previous</h4>
                  <p>
                    Alteration in some form by injected
                    <br />
                    humour or randomised
                  </p>
                </Link>
              </div>
              <div className="icon">
                <Link to={route.services}>
                  <ImageWithBasePath
                    src="assets/img/icons/detail-pagination.svg"
                    className="img-fluid"
                    alt="Icon"
                  />
                </Link>
              </div>
              <div className="d-flex align-items-center">
                <Link
                  to="#"
                  className="info text-right d-none d-sm-none d-md-block"
                >
                  <h4>Next</h4>
                  <p>
                    Alteration in some form by injected
                    <br />
                    humour or randomised
                  </p>
                </Link>
                <div className="next d-flex justify-content-center align-items-center">
                  <i className="feather-arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default ServiceDetail;
