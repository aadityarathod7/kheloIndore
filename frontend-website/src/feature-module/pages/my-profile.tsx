import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MyProfile = () => {
  const [open, setOpen] = React.useState(false);
  const routes = all_routes;
  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Profile</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Profile</li>
            </ul>
          </div>
        </section>
        {/* /Breadcrumb */}
        {/* Dashboard Menu */}
        <div className="dashboard-section coach-dash-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="dashboard-menu coaurt-menu-dash">
                  <ul>
                    <li>
                      <Link to={routes.coachDashboard}>
                        <ImageWithBasePath
                          src="/assets/img/icons/dashboard-icon.svg"
                          alt="Icon"
                        />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.allCourt}>
                        <ImageWithBasePath
                          src="/assets/img/icons/court-icon.svg"
                          alt="Icon"
                        />
                        <span> Courts</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachRequest}>
                        <ImageWithBasePath
                          src="/assets/img/icons/request-icon.svg"
                          alt="Icon"
                        />
                        <span>Requests</span>
                        <span className="court-notify">03</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachBooking}>
                        <ImageWithBasePath
                          src="/assets/img/icons/booking-icon.svg"
                          alt="Icon"
                        />
                        <span>Bookings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachChat}>
                        <ImageWithBasePath
                          src="/assets/img/icons/chat-icon.svg"
                          alt="Icon"
                        />
                        <span>Chat</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachEarning}>
                        <ImageWithBasePath
                          src="/assets/img/icons/invoice-icon.svg"
                          alt="Icon"
                        />
                        <span>Earnings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachWallet}>
                        <ImageWithBasePath
                          src="/assets/img/icons/wallet-icon.svg"
                          alt="Icon"
                        />
                        <span>Wallet</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachProfile} className="active">
                        <ImageWithBasePath
                          src="/assets/img/icons/profile-icon.svg"
                          alt="Icon"
                        />
                        <span>Profile Setting</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Dashboard Menu */}
        {/* Page Content */}
        <div className="content court-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="my-profile-box">
                  <h3>My Profile</h3>
                  <div className="card profile-user-view">
                    <div className="profile-groups">
                      <div className="profile-detail-box">
                        <div className="profile-img">
                          <ImageWithBasePath
                            className="rounded-circle"
                            src="/assets/img/profiles/avatar-01.jpg"
                            alt="User"
                          />
                        </div>
                        <div className="user-profile-detail">
                          <h4>Henriques</h4>
                          <p>KheloIndore Badminton Since 05/05/2023</p>
                          <ul>
                            <li>
                              <ImageWithBasePath
                                src="/assets/img/icons/profile-icon-01.svg"
                                alt="Icon"
                              />
                              Rank : Expert
                            </li>
                            <li>
                              <ImageWithBasePath
                                src="/assets/img/icons/profile-icon-02.svg"
                                alt="Icon"
                              />
                              Santamanica, United States
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="convenient-btns">
                        <Link
                          to={routes.coachProfile}
                          className="btn btn-secondary d-inline-flex align-items-center"
                        >
                          <span>
                            <i className="feather-edit" />
                          </span>
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card profile-user-view">
                  <div className="appointment-detail">
                    <h4>Appointment Details</h4>
                    <Link to="#">Edit</Link>
                  </div>
                  <div className="appointment-available">
                    <div className="amount-hour">
                      <h6>Amount </h6>
                      <h4>
                        $250<span>/hr</span>
                      </h4>
                    </div>
                  </div>
                  <div className="appointment-available profile-availability">
                    <h6>Availability</h6>
                    <ul className="day-list">
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_1"
                            name="day"
                            defaultChecked=""
                          />
                          <label htmlFor="select_days_1">Mon</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_2"
                            name="day"
                          />
                          <label htmlFor="select_days_2">Tues</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_3"
                            name="day"
                          />
                          <label htmlFor="select_days_3">Wed</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_4"
                            name="day"
                          />
                          <label htmlFor="select_days_4">Thur</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_5"
                            name="day"
                          />
                          <label htmlFor="select_days_5">Fri</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_6"
                            name="day"
                          />
                          <label htmlFor="select_days_6">Sat</label>
                        </div>
                      </li>
                      <li>
                        <div className="day-selection ">
                          <input
                            type="checkbox"
                            defaultValue="attach_link"
                            id="select_days_7"
                            name="day"
                          />
                          <label className="mb-0" htmlFor="select_days_7">
                            Sun
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="appointment-available">
                    <h6>Lesson Type </h6>
                    <ul className="lesson-type">
                      <li>
                        <i className="feather-check-square" />
                        Single Lesson
                      </li>
                      <li>
                        <i className="feather-check-square" />2 Player Lesson
                      </li>
                      <li>
                        <i className="feather-check-square" />
                        Small group Lesson
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="card profile-user-view mb-0">
                  <div className="profile-info-box">
                    <h4>Contact Information</h4>
                    <div className="profile-contact-info">
                      <div className="contact-information">
                        <h6>Email Address</h6>
                        <span>contact@example.com</span>
                      </div>
                      <div className="contact-information">
                        <h6>Phone Number</h6>
                        <span>+1 56565 556558</span>
                      </div>
                      <div className="contact-information">
                        <h6>Address</h6>
                        <span>1653 Davisson Street,Indianapolis, IN 46225</span>
                      </div>
                    </div>
                  </div>
                  <div className="profile-info-box">
                    <h4>Short Bio</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Varius consectetur a at est diam ultricies. Egestas eros
                      leo dapibus tellus neque turpis. Nec in morbi adipiscing
                      pretium accumsan urna ac,Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Varius consectetur a at est
                      diam ultricies. Egestas eros leo dapibus tellus neque
                      turpis. Nec in morbi adipiscing pretium accumsan urna
                      ac,Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit. Varius consectetur a at est diam ultricies. Egestas
                      eros leo dapibus tellus neque turpis. Nec in morbi
                      adipiscing pretium accumsan urna ac,
                    </p>
                  </div>
                  <div className="profile-info-box">
                    <h4>Lesson With Me</h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap into electronic
                      typesetting, remaining essentially unchanged. It was
                      popularised in the 1960s with the release of Letraset
                      sheets containing Lorem Ipsum passages, and more recently
                      with desktop publishing software like Aldus PageMaker
                      including versions of Lorem Ipsum
                    </p>
                  </div>
                  <div className="profile-info-box">
                    <h4>Coaching</h4>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap into electronic
                      typesetting, remaining essentially unchanged. It was
                      popularised in the 1960s with the release of Letraset
                      sheets containing Lorem Ipsum passages, and more recently
                      with desktop publishing software like Aldus PageMaker
                      including versions of Lorem Ipsum
                    </p>
                  </div>
                  <div className="profile-info-box">
                    <h4>Gallery</h4>
                    <ul className="review-gallery clearfix">
                      <Lightbox
                        open={open}
                        close={() => setOpen(false)}
                        slides={[
                          { src: "/assets/img/booking/booking-01.jpg" },
                          { src: "/assets/img/booking/booking-02.jpg" },
                          { src: "/assets/img/booking/booking-03.jpg" },
                        ]}
                      />
                      <li>
                        <Link
                          to="assets/img/booking/booking-01.jpg"
                          data-fancybox="gallery"
                          onClick={() => setOpen(true)}
                        >
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Image"
                            src="/assets/img/booking/booking-01.jpg"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="assets/img/booking/booking-02.jpg"
                          data-fancybox="gallery"
                          onClick={() => setOpen(true)}
                        >
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Image"
                            src="/assets/img/booking/booking-02.jpg"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/assets/img/booking/booking-03.jpg"
                          data-fancybox="gallery"
                        >
                          <ImageWithBasePath
                            className="img-fluid"
                            alt="Image"
                            src="/assets/img/booking/booking-03.jpg"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="profile-info-box">
                    <h4>Video</h4>
                    <div className="badminton-img">
                      <iframe
                        height={315}
                        src="https://www.youtube.com/embed/DTq53SuQ_eo"
                        title="video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default MyProfile;
