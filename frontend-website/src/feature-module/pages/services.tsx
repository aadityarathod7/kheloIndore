import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const Services = () => {
  const route = all_routes;
  return (
    <>
      <div className="main-wrapper services-page innerpagebg">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Services</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Services</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <section className="services">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-all-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-all"
                    type="button"
                    role="tab"
                    aria-controls="pills-all"
                    aria-selected="true"
                  >
                    All Services
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-coaching-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-coaching"
                    type="button"
                    role="tab"
                    aria-controls="pills-coaching"
                    aria-selected="false"
                  >
                    Coaching
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-lessons-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-lessons"
                    type="button"
                    role="tab"
                    aria-controls="pills-lessons"
                    aria-selected="false"
                  >
                    Lessons
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-coaches-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-coaches"
                    type="button"
                    role="tab"
                    aria-controls="pills-coaches"
                    aria-selected="false"
                  >
                    Coaches
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-all"
                  role="tabpanel"
                  aria-labelledby="pills-all-tab"
                >
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-05.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Court Rent</Link>
                          </h3>
                          <p>
                            Rent a premium court for your sports activities.
                            Check availability, reserve easily, and enjoy
                            state-of-the-art facilities at competitive rates.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-06.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Group Lesson</Link>
                          </h3>
                          <p>
                            Discover the thrill of group lessons in badminton,
                            where you can enhance your skills, connect with
                            others, and enjoy the sport to the fullest.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-07.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Training Program
                            </Link>
                          </h3>
                          <p>
                            Our badminton training program provides a holistic
                            approach to promote your performance and maximize
                            your potential on the court.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-08.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Private Lessons
                            </Link>
                          </h3>
                          <p>
                            Discover the thrill of group lessons in badminton,
                            where you can enhance your skills, connect with
                            others, and enjoy the sport to the fullest.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-09.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Court Rent</Link>
                          </h3>
                          <p>
                            Rent a premium court for your sports activities.
                            Check availability, reserve easily, and enjoy
                            state-of-the-art facilities at competitive rates.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-10.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Group Lesson</Link>
                          </h3>
                          <p>
                            Discover the thrill of group lessons in badminton,
                            where you can enhance your skills, connect with
                            others, and enjoy the sport to the fullest.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-coaching"
                  role="tabpanel"
                  aria-labelledby="pills-coaching-tab"
                >
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-05.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Sports Performance Training
                            </Link>
                          </h3>
                          <p>
                            KheloIndore  offers tailored sports performance
                            training programs designed to enhance your athletic
                            performance in badminton.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-06.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Sports Science and Technology
                            </Link>
                          </h3>
                          <p>
                            Utilize advanced technology, such as video analysis
                            and motion sensors, to evaluate and improve your
                            technique.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-07.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Sports Performance Training
                            </Link>
                          </h3>
                          <p>
                            Discover the thrill of group lessons in badminton,
                            where you can enhance your skills, connect with
                            others, and enjoy the sport to the fullest.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-lessons"
                  role="tabpanel"
                  aria-labelledby="pills-lessons-tab"
                >
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-08.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Service 4</Link>
                          </h3>
                          <p>
                            Lorem ipsum is simply free text dolor sit am adipi
                            we help you ensure everyone.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-09.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Service 5</Link>
                          </h3>
                          <p>
                            Lorem ipsum is simply free text dolor sit am adipi
                            we help you ensure everyone.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-10.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Service 6</Link>
                          </h3>
                          <p>
                            Lorem ipsum is simply free text dolor sit am adipi
                            we help you ensure everyone.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-coaches"
                  role="tabpanel"
                  aria-labelledby="pills-coaches-tab"
                >
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-05.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>
                              Elite Badminton
                            </Link>
                          </h3>
                          <p>
                            Our team of experienced and qualified coaches is
                            dedicated to helping you achieve your goals.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-06.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Service 2</Link>
                          </h3>
                          <p>
                            Our team of experienced and qualified coaches is
                            dedicated to helping you achieve your goals.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={route.serviceDetail}>
                            <ImageWithBasePath
                              src="assets/img/services/service-07.jpg"
                              className="img-fluid"
                              alt="Service"
                            />
                          </Link>
                        </div>
                        <div className="listing-content text-center">
                          <h3 className="listing-title">
                            <Link to={route.serviceDetail}>Service 3</Link>
                          </h3>
                          <p>
                            Our team of experienced and qualified coaches is
                            dedicated to helping you achieve your goals.
                          </p>
                          <Link
                            to={route.serviceDetail}
                            className="btn btn-secondary"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default Services;
