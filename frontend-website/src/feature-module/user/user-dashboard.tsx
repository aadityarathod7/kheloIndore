import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { jwtDecode} from "jwt-decode";
import { API_URL } from "../../ApiUrl";
import axios from "axios";

interface JwtPayload {
  userID:number;
}

interface UserData{
  last_name: "string",
  first_name:"string",
  email:"string",
  mobile:"number",
  booking_count:"number",
}

const UserDashboard = () => {
  const routes = all_routes;
  const [userDataId, setUserDataId] = useState<JwtPayload | null>(null);
  const [userData,setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserDataId(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, []);

  const user_id = userDataId?.userID

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/fetch-user-by-id/${user_id}`);
        const userData = response.data.data;
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  },[user_id]);


  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">User Dashboard</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>User Dashboard</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Dashboard Menu */}
      <div className="dashboard-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-menu">
                <ul>
                  <li>
                    <Link to={routes.userDashboard} className="active">
                      <ImageWithBasePath
                        src="/assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userBookings}>
                      <ImageWithBasePath src="/assets/img/icons/booking-icon.svg" alt="Icon" />
                      <span>My Bookings</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to={routes.userChat}>
                      <ImageWithBasePath src="/assets/img/icons/chat-icon.svg" alt="Icon" />
                      <span>Chat</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to={routes.userInvoice}>
                      <ImageWithBasePath src="/assets/img/icons/invoice-icon.svg" alt="Icon" />
                      <span>Invoices</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to={routes.userWallet}>
                      <ImageWithBasePath src="/assets/img/icons/wallet-icon.svg" alt="Icon" />
                      <span>Wallet</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to={routes.userProfile}>
                      <ImageWithBasePath src="/assets/img/icons/profile-icon.svg" alt="Icon" />
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
      <div className="content">
        <div className="container">
          {/* Statistics Card */}
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
                          src="/assets/img/profile-icon.jpg"
                          alt="Useeer"
                        />
                      </div>
                      <div className="user-profile-detail">
                        <h4>{userData?.first_name} {userData?.last_name}</h4>
                        <ul>
                          {/* <li>
                            <ImageWithBasePath
                              src="assets/img/icons/profile-icon-01.svg"
                              alt="Icon"
                            />
                            Rank : Expert
                          </li> */}
                        </ul>
                      </div>
                    </div>
                    <div className="convenient-btns">
                      <Link
                        to={routes.userProfile}
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
              <div className="col-lg-12">
                <div className="card profile-user-view mb-4">
                  <div className="profile-info-box">
                    <h4>Contact Information</h4>
                    <div className="profile-contact-info justify-content-start gap-5">
                      <div className="contact-information">
                        <h6>Email Address</h6>
                        <span>{userData?.email}</span>
                      </div>
                      <div className="contact-information">
                        <h6>Phone Number</h6>
                        <span>{userData?.mobile}</span>
                      </div>
                      {/* <div className="contact-information">
                        <h6>Address</h6>
                        <span>1653 Davisson Street,Indianapolis, IN 46225</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card statistics-card">
                <div className="card-header">
                  <h4>Statistics</h4>
                  <p>Boost your game with stats and goals tailored to you</p>
                </div>
                <div className="row">
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>78</h3>
                        <p>Total Court Booked</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-01.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>45</h3>
                        <p>Total Coaches Booked</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-02.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>06</h3>
                        <p>Total Lessons</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-03.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>$45,056</h3>
                        <p>Payments</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="/assets/img/icons/statistics-04.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Statistics Card */}
          {/* Appointment */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card">
                <div className="card-header">
                  <h4>Todays Appointment</h4>
                  <p>Your Personal Badminton Schedule</p>
                </div>
                <div className="appointment-info">
                  <ul>
                    <li>
                      <div className="appointment-item">
                        <div className="appointment-img">
                          <ImageWithBasePath
                            src="/assets/img/booking/booking-01.jpg"
                            alt="Appointment"
                          />
                        </div>
                        <div className="appointment-content">
                          <h6>Court Name</h6>
                          <p>Standard Synthetic Court 1</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <h6>Appointment Date</h6>
                      <p>Mon, Jul 11</p>
                    </li>
                    <li>
                      <h6>Start Time</h6>
                      <p>05:25 AM</p>
                    </li>
                    <li>
                      <h6>Appointment End Time</h6>
                      <p>06:25 AM</p>
                    </li>
                    <li>
                      <h6>Additional Guests</h6>
                      <p>4</p>
                    </li>
                    <li>
                      <h6>Location</h6>
                      <p>Sant Marco</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Appointment */}
          {/* Dashboard Table */}
          <div className="row">
            <div className="col-xl-7 col-lg-12 d-flex">
              <div className="card dashboard-card flex-fill">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>My Bookings</h4>
                    <p>Court Reservations Made Easy</p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Court-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Court"
                          type="button"
                          role="tab"
                          aria-controls="nav-Court"
                          aria-selected="true"
                        >
                          Sports Venue
                        </button>
                        <button
                          className="nav-link"
                          id="nav-Coaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Coaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-Coaching"
                          aria-selected="false"
                        >
                          Coach
                        </button>
                        <button
                          className="nav-link"
                          id="nav-Coaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Coaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-Coaching"
                          aria-selected="false"
                        >
                          Personal Trainer
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Court"
                    role="tabpanel"
                    aria-labelledby="nav-Court-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-02.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
                                      Leap Sports Academy
                                    </Link>
                                  </h6>
                                  <span>Court 1</span>
                                  <ul>
                                    <li>Guests : 4</li>
                                    <li>2 Hrs</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Mon, Jul 11</p>
                              <p>06:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h4>$400</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court" to={""}                                    >
                                      Wing Sports Academy
                                    </Link>
                                  </h6>
                                  <span>Court 2</span>
                                  <ul>
                                    <li>Guests : 3</li>
                                    <li>1 Hr</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Tue, Jul 12</p>
                              <p>07:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h4>$240</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court" to={""}                                    >
                                      Feather Badminton
                                    </Link>
                                  </h6>
                                  <span>Court 1</span>
                                  <ul>
                                    <li>Guests : 1</li>
                                    <li>4 Hrs</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Wen, Jul 13</p>
                              <p>10:00 PM - 11:00 PM</p>
                            </td>
                            <td>
                              <h4>$320</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court" to={""}                                    >
                                      Bwing Sports Academy
                                    </Link>
                                  </h6>
                                  <span>Court 3</span>
                                  <ul>
                                    <li>Guests : 5</li>
                                    <li>6 Hrs</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Thu, Jul 14</p>
                              <p>09:00 AM - 10:00 AM</p>
                            </td>
                            <td>
                              <h4>$710</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court" to={""}                                    >
                                      Marsh Academy
                                    </Link>
                                  </h6>
                                  <span>Court 2</span>
                                  <ul>
                                    <li>Guests : 3</li>
                                    <li>2 Hrs</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Fri, Jul 15</p>
                              <p>11:00 AM - 12:00 PM</p>
                            </td>
                            <td>
                              <h4>$820</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-Coaching"
                    role="tabpanel"
                    aria-labelledby="nav-Coaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Kevin Anderson
                                    </Link>
                                  </h6>
                                  <span className="mb-0">Onetime</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Mon, Jul 11</p>
                              <p>06:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h4>$400</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Angela Roudrigez
                                    </Link>
                                  </h6>
                                  <span className="mb-0">Single Lesson</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Tue, Jul 12</p>
                              <p>07:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h4>$240</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-07.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Evon Raddick
                                    </Link>
                                  </h6>
                                  <span className="mb-0">Onetime</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Wen, Jul 13</p>
                              <p>10:00 PM - 11:00 PM</p>
                            </td>
                            <td>
                              <h4>$320</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-08.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Harry Richardson
                                    </Link>
                                  </h6>
                                  <span className="mb-0">Onetime</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Thu, Jul 14</p>
                              <p>09:00 AM - 10:00 AM</p>
                            </td>
                            <td>
                              <h4>$710</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-09.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Pete Hill
                                    </Link>
                                  </h6>
                                  <span className="mb-0">Onetime</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h6>Date &amp; Time</h6>
                              <p>Fri, Jul 15</p>
                              <p>11:00 AM - 12:00 PM</p>
                            </td>
                            <td>
                              <h4>$820</h4>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-12 d-flex flex-column">
              <div className="card payment-card ">
                <div className="payment-info ">
                  <div className="payment-content">
                    <p>Your Wallet Balance</p>
                    <h2>$4,544</h2>
                  </div>
                  <div className="payment-btn">
                    <Link
                      to="#"
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#add-payment"
                    >
                      Add Payment
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card dashboard-card upcoming-card">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>Upcoming Appointment</h4>
                    <p>Manage all your upcoming court bookings.</p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Appointment-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Appointment"
                          type="button"
                          role="tab"
                          aria-controls="nav-Appointment"
                          aria-selected="true"
                        >
                          Court
                        </button>
                        <button
                          className="nav-link"
                          id="nav-AppointmentCoaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-AppointmentCoaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-AppointmentCoaching"
                          aria-selected="false"
                        >
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Appointment"
                    role="tabpanel"
                    aria-labelledby="nav-Appointment-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-02.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court" to={""}                                    >
                                      Leap Sports Academy
                                    </Link>
                                  </h6>
                                  <ul>
                                    <li>Court 1</li>
                                    <li>
                                      <i className="feather-clock" /> 06:00 PM
                                      to 08:00 PM
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-AppointmentCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-AppointmentCoaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach" to={""}                                    >
                                      Kevin Anderson
                                    </Link>
                                  </h6>
                                  <ul>
                                    <li>Single Lesson</li>
                                    <li>
                                      <i className="feather-clock" /> 06:00 PM
                                      to 08:00 PM
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-x-circle" /> Cancel
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card dashboard-card academy-card">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>My Favourites</h4>
                    <p>My favourite court lists </p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Favourites-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Favourites"
                          type="button"
                          role="tab"
                          aria-controls="nav-Favourites"
                          aria-selected="true"
                        >
                          Court
                        </button>
                        <button
                          className="nav-link"
                          id="nav-FavouritesCoaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-FavouritesCoaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-FavouritesCoaching"
                          aria-selected="false"
                        >
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Favourites"
                    role="tabpanel"
                    aria-labelledby="nav-Favourites-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Wing Sports Academy
                                    </Link>
                                  </h6>
                                  <p>10 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Feather Badminton
                                    </Link>
                                  </h6>
                                  <p>20 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/booking/booking-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Bwing Sports Academy
                                    </Link>
                                  </h6>
                                  <p>30 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-FavouritesCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-FavouritesCoaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive dashboard-table-responsive">
                      <table className="table dashboard-card-table">
                        <tbody>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Kevin Anderson
                                    </Link>
                                  </h6>
                                  <p>10 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Angela Roudrigez
                                    </Link>
                                  </h6>
                                  <p>20 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-info">
                                <Link
                                  to={routes.userBookings}
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="/assets/img/featured/featured-07.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link to={routes.userBookings}>
                                      Evon Raddick
                                    </Link>
                                  </h6>
                                  <p>30 Bookings</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="academy-icon">
                                <Link to={routes.userBookings}>
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card dashboard-card mb-0">
                <div className="card-header card-header-info border-0">
                  <div className="card-header-inner">
                    <h4>Recent Invoices</h4>
                    <p>Access recent invoices related to court bookings </p>
                  </div>
                  <div className="card-header-btns">
                    <nav>
                      <div className="nav nav-tabs" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-Recent-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-Recent"
                          type="button"
                          role="tab"
                          aria-controls="nav-Recent"
                          aria-selected="true"
                        >
                          Court
                        </button>
                        <button
                          className="nav-link"
                          id="nav-RecentCoaching-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-RecentCoaching"
                          type="button"
                          role="tab"
                          aria-controls="nav-RecentCoaching"
                          aria-selected="false"
                        >
                          Coaching
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="nav-Recent"
                    role="tabpanel"
                    aria-labelledby="nav-Recent-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive table-datatble">
                      <table className="table table-borderless dashboard-card-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Court Name</th>
                            <th>Date &amp; Time</th>
                            <th>Payment</th>
                            <th>Paid On</th>
                            <th>Status</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-02.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-court" to={""}                                  >
                                    Leap Sports Academy
                                  </Link>
                                  <span>Court 1</span>
                                </span>
                              </h2>
                            </td>
                            <td>
                              <p>Mon, Jul 11</p>
                              <p>06:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h6>$800</h6>
                            </td>
                            <td>Jul 11, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-court" to={""}                                  >
                                    Wing Sports Academy
                                  </Link>
                                  <span>Court 2</span>
                                </span>
                              </h2>
                            </td>
                            <td>
                              <p>Tue, Jul 12</p>
                              <p>05:00 PM - 06:00 PM</p>
                            </td>
                            <td>
                              <h6>$120</h6>
                            </td>
                            <td>Jul 12, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-court" to={""}                                  >
                                    Feather Badminton
                                  </Link>
                                  <span>Court 3</span>
                                </span>
                              </h2>
                            </td>
                            <td>
                              <p>Wed, Jul 13</p>
                              <p>10:00 AM - 11:00 AM</p>
                            </td>
                            <td>
                              <h6>$470</h6>
                            </td>
                            <td>Jul 13, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-court"
                                  >
                                    Bwing Sports Academy
                                  </Link>
                                  <span>Court 4</span>
                                </span>
                              </h2>
                            </td>
                            <td>
                              <p>Thu, Jul 14</p>
                              <p>12:00 PM - 01:00 PM</p>
                            </td>
                            <td>
                              <h6>$200</h6>
                            </td>
                            <td>Jul 14, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-court"
                                  >
                                    Marsh Academy
                                  </Link>
                                  <span>Court 5</span>
                                </span>
                              </h2>
                            </td>
                            <td>
                              <p>Fri, Jul 15</p>
                              <p>08:00 AM - 09:00 AM</p>
                            </td>
                            <td>
                              <h6>$150</h6>
                            </td>
                            <td>Jul 15, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-RecentCoaching"
                    role="tabpanel"
                    aria-labelledby="nav-RecentCoaching-tab"
                    tabIndex={0}
                  >
                    <div className="table-responsive table-datatble">
                      <table className="table table-borderless dashboard-card-table">
                        <thead className="thead-light">
                          <tr>
                            <th>Court Name</th>
                            <th>Invoice</th>
                            <th>Date &amp; Time</th>
                            <th>Payment</th>
                            <th>Paid On</th>
                            <th>Status</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-coach"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/featured/featured-05.jpg"
                                    alt="Venue"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-coach"
                                  >
                                    Kevin Anderson
                                  </Link>
                                  <span>Booked on : 25 May 2023</span>
                                </span>
                              </h2>
                            </td>
                            <td>Onetime</td>
                            <td>
                              <p>Mon, Jul 11</p>
                              <p>06:00 PM - 08:00 PM</p>
                            </td>
                            <td>
                              <h6>$800</h6>
                            </td>
                            <td>Jul 11, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-coach"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/featured/featured-06.jpg"
                                    alt="Venue"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-coach" to={""}                                  >
                                    Angela Roudrigez
                                  </Link>
                                  <span>Booked on : 26 May 2023</span>
                                </span>
                              </h2>
                            </td>
                            <td>Single Lesson</td>
                            <td>
                              <p>Tue, Jul 12</p>
                              <p>05:00 PM - 06:00 PM</p>
                            </td>
                            <td>
                              <h6>$120</h6>
                            </td>
                            <td>Jul 12, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-coach"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/featured/featured-07.jpg"
                                    alt="Venue"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-coach"
                                  >
                                    Evon Raddickz
                                  </Link>
                                  <span>Booked on : 27 May 2023</span>
                                </span>
                              </h2>
                            </td>
                            <td>Onetime</td>
                            <td>
                              <p>Wed, Jul 13</p>
                              <p>10:00 AM - 11:00 AM</p>
                            </td>
                            <td>
                              <h6>$470</h6>
                            </td>
                            <td>Jul 13, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  data-bs-target="#upcoming-coach"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-coach"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/featured/featured-08.jpg"
                                    alt="Venue"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#upcoming-coach"
                                  >
                                    Harry Richardson
                                  </Link>
                                  <span>Booked on : 28 May 2023</span>
                                </span>
                              </h2>
                            </td>
                            <td>Onetime</td>
                            <td>
                              <p>Thu, Jul 14</p>
                              <p>12:00 PM - 01:00 PM</p>
                            </td>
                            <td>
                              <h6>$200</h6>
                            </td>
                            <td>Jul 14, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to={routes.userInvoice}
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/featured/featured-09.jpg"
                                    alt="Venue"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to={routes.userInvoice}>Pete Hill</Link>
                                  <span>Booked on : 29 May 2023</span>
                                </span>
                              </h2>
                            </td>
                            <td>Onetime</td>
                            <td>
                              <p>08:00 AM - 09:00 AM</p>
                            </td>
                            <td>
                              <h6>$150</h6>
                            </td>
                            <td>Jul 15, 2023</td>
                            <td className="paid-edit">
                              <span>
                                <i className="feather-edit" /> Paid
                              </span>
                            </td>
                            <td>
                              <div className="dropdown dropdown-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fas fa-ellipsis" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-download" /> Download
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                  >
                                    <i className="feather-trash" /> Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Dashboard Table */}
        </div>
      </div>
      {/* /Page Content */}
      {/* upcoming Modal */}
      <div
        className="modal custom-modal fade request-modal"
        id="upcoming-coach"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">
                  Coach Booking Details
                  <span className="badge bg-info ms-2">Upcoming</span>
                </h4>
              </div>
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Court Request */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Court Information</h4>
                    </div>
                    <div className="appointment-info">
                      <ul className="appointmentset">
                        <li>
                          <div className="appointment-item">
                            <div className="appointment-img">
                              <ImageWithBasePath
                                src="/assets/img/featured/featured-06.jpg"
                                alt="Venue"
                              />
                            </div>
                            <div className="appointment-content">
                              <h6>Angela Roudrigez</h6>
                              <div className="table-rating">
                                <div className="rating-point">
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <i className="fas fa-star filled" />
                                  <span>30 Reviews</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <h6>Location</h6>
                          <p>Santa Monica, CA</p>
                        </li>
                        <li>
                          <h6>Price Per Hour</h6>
                          <p>$200.00 / hr</p>
                        </li>
                        <li>
                          <h6>Rank</h6>
                          <p>Expert</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Appointment Information</h4>
                    </div>
                    <div className="appointment-info appoin-border">
                      <ul className="appointmentset">
                        <li>
                          <h6>Booked On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Booking Type</h6>
                          <p>Onetime</p>
                        </li>
                        <li>
                          <h6>Date &amp; Time</h6>
                          <p>
                            Mon, Jul 14
                            <span>05:00 PM - 08:00 PM</span>
                          </p>
                        </li>
                        <li>
                          <h6>Total Number of Hours</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Payment Details</h4>
                    </div>
                    <div className="appointment-info appoin-border double-row">
                      <ul className="appointmentset">
                        <li>
                          <h6>Coaching Booking Amount</h6>
                          <p>$200</p>
                        </li>
                        <li>
                          <h6>Number of Hours</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>$20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentset">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">$180</p>
                        </li>
                        <li>
                          <h6>Paid On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Transaction ID</h6>
                          <p>#5464164445676781641</p>
                        </li>
                        <li>
                          <h6>Payment type</h6>
                          <p>Wallet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Court Request */}
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn cancel-table-btn"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /upcoming Modal */}
      {/* upcoming Modal */}
      <div
        className="modal custom-modal fade request-modal"
        id="upcoming-court"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">
                  Court Booking Details
                  <span className="badge bg-info ms-2">Upcoming</span>
                </h4>
              </div>
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Court Request */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Court Information</h4>
                    </div>
                    <div className="appointment-info">
                      <ul className="appointmentset">
                        <li>
                          <div className="appointment-item">
                            <div className="appointment-img">
                              <ImageWithBasePath
                                src="/assets/img/booking/booking-03.jpg"
                                alt="Appointment"
                              />
                            </div>
                            <div className="appointment-content">
                              <h6>Wing Sports Academy</h6>
                              <p className="color-green">Court 1</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <h6>Booked On</h6>
                          <p>$150 Upto 2 guests</p>
                        </li>
                        <li>
                          <h6>Price Per Guest</h6>
                          <p>$15</p>
                        </li>
                        <li>
                          <h6>Maximum Number of Guests</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Appointment Information</h4>
                    </div>
                    <div className="appointment-info appoin-border">
                      <ul className="appointmentset">
                        <li>
                          <h6>Booked On</h6>
                          <p>$150 Upto 2 guests</p>
                        </li>
                        <li>
                          <h6>Price Per Guest</h6>
                          <p>$15</p>
                        </li>
                        <li>
                          <h6>Maximum Number of Guests</h6>
                          <p>2</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card dashboard-card court-information">
                    <div className="card-header">
                      <h4>Payment Details</h4>
                    </div>
                    <div className="appointment-info appoin-border double-row">
                      <ul className="appointmentset">
                        <li>
                          <h6>Court Booking Amount</h6>
                          <p>$150</p>
                        </li>
                        <li>
                          <h6>Additional Guests</h6>
                          <p>2</p>
                        </li>
                        <li>
                          <h6>Amount Additional Guests</h6>
                          <p>$30</p>
                        </li>
                        <li>
                          <h6>Service Charge</h6>
                          <p>$20</p>
                        </li>
                      </ul>
                    </div>
                    <div className="appointment-info appoin-border ">
                      <ul className="appointmentsetview">
                        <li>
                          <h6>Total Amount Paid</h6>
                          <p className="color-green">$180</p>
                        </li>
                        <li>
                          <h6>Paid On</h6>
                          <p>Mon, Jul 14</p>
                        </li>
                        <li>
                          <h6>Transaction ID</h6>
                          <p>#5464164445676781641</p>
                        </li>
                        <li>
                          <h6>Payment type</h6>
                          <p>Wallet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Court Request */}
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn cancel-table-btn"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /upcoming Modal */}
      {/* Request Modal */}
      <div
        className="modal custom-modal fade payment-modal"
        id="add-payment"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div className="form-header modal-header-title">
                <h4 className="mb-0">Add Payment to Wallet</h4>
              </div>
              <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              <div className="wallet-wrap wallet-modal">
                <div className="wallet-amt">
                  <h5>Your Wallet Balance</h5>
                  <h2>$4,544</h2>
                </div>
              </div>
              <form>
                <div className="input-space">
                  <label className="form-label">Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Amount"
                  />
                </div>
                <div className="or-div">
                  <h6>OR</h6>
                </div>
                <div className="add-wallet-amount form-check">
                  <ul>
                    <li className="active">
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value"
                          defaultChecked
                        />
                        <label htmlFor="value">Add Value 1</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ $80</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value1"
                        />
                        <label htmlFor="value1">Add Value 2</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ $60</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value2"
                        />
                        <label htmlFor="value2">Add Value 3</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ $120</span>
                      </div>
                    </li>
                    <li>
                      <div className="add-wallet-checkbox">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="value3"
                        />
                        <label htmlFor="value3">Add Value 4</label>
                      </div>
                      <div className="add-wallet-price">
                        <span>+ $120</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="radio-setview">
                  <h6>Select Payment Gateway</h6>
                  <div className="radio">
                    <div className="form-check form-check-inline mb-3">
                      <input
                        className="form-check-input default-check me-1"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio3"
                        defaultValue="Credit Card"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check form-check-inline mb-0">
                      <input
                        className="form-check-input default-check me-1"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio4"
                        defaultValue="Paypal"
                        defaultChecked
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio4"
                      >
                        Paypal
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <div className="table-accept-btn">
                <Link
                  to="#"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Reset
                </Link>
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Request Modal */}

      <div>
        {/* upcoming Modal */}
        <div className="modal custom-modal fade request-modal" id="upcoming-coach" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Coach Booking Details<span className="badge bg-info ms-2">Upcoming</span></h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
                </Link>
              </div>
              <div className="modal-body">
                {/* Court Request */}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Court Information</h4>
                      </div>
                      <div className="appointment-info">
                        <ul className="appointmentset">
                          <li>
                            <div className="appointment-item">
                              <div className="appointment-img">
                                <img src="/assets/img/featured/featured-06.jpg" alt="Venue" />
                              </div>
                              <div className="appointment-content">
                                <h6>Angela Roudrigez</h6>
                                <div className="table-rating">
                                  <div className="rating-point">
                                    <i className="fas fa-star filled" />
                                    <i className="fas fa-star filled" />
                                    <i className="fas fa-star filled" />
                                    <i className="fas fa-star filled" />
                                    <i className="fas fa-star filled" />
                                    <span>30 Reviews</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <h6>Location</h6>
                            <p>Santa Monica, CA</p>
                          </li>
                          <li>
                            <h6>Price Per Hour</h6>
                            <p>$200.00 / hr</p>
                          </li>
                          <li>
                            <h6>Rank</h6>
                            <p>Expert</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Appointment Information</h4>
                      </div>
                      <div className="appointment-info appoin-border">
                        <ul className="appointmentset">
                          <li>
                            <h6>Booked On</h6>
                            <p>Mon, Jul 14</p>
                          </li>
                          <li>
                            <h6>Booking Type</h6>
                            <p>Onetime</p>
                          </li>
                          <li>
                            <h6>Date &amp; Time</h6>
                            <p>Mon, Jul 14
                              <span>05:00 PM - 08:00 PM</span></p>
                          </li>
                          <li>
                            <h6>Total Number of Hours</h6>
                            <p>2</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Payment Details</h4>
                      </div>
                      <div className="appointment-info appoin-border double-row">
                        <ul className="appointmentset">
                          <li>
                            <h6>Coaching Booking Amount</h6>
                            <p>$200</p>
                          </li>
                          <li>
                            <h6>Number of Hours</h6>
                            <p>2</p>
                          </li>
                          <li>
                            <h6>Service Charge</h6>
                            <p>$20</p>
                          </li>
                        </ul>
                      </div>
                      <div className="appointment-info appoin-border ">
                        <ul className="appointmentset">
                          <li>
                            <h6>Total Amount Paid</h6>
                            <p className="color-green">$180</p>
                          </li>
                          <li>
                            <h6>Paid On</h6>
                            <p>Mon, Jul 14</p>
                          </li>
                          <li>
                            <h6>Transaction ID</h6>
                            <p>#5464164445676781641</p>
                          </li>
                          <li>
                            <h6>Payment type</h6>
                            <p>Wallet</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Court Request */}
              </div>
              <div className="modal-footer">
                <div className="table-accept-btn">
                  <Link to="#" data-bs-dismiss="modal" className="btn cancel-table-btn">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /upcoming Modal */}
        {/* upcoming Modal */}
        <div className="modal custom-modal fade request-modal" id="upcoming-court" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Court Booking Details<span className="badge bg-info ms-2">Upcoming</span></h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
                </Link>
              </div>
              <div className="modal-body">
                {/* Court Request */}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Court Information</h4>
                      </div>
                      <div className="appointment-info">
                        <ul className="appointmentset">
                          <li>
                            <div className="appointment-item">
                              <div className="appointment-img">
                                <img src="/assets/img/booking/booking-03.jpg" alt="Appointment" />
                              </div>
                              <div className="appointment-content">
                                <h6>Wing Sports Academy</h6>
                                <p className="color-green">Court 1</p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <h6>Booked On</h6>
                            <p>$150 Upto 2 guests</p>
                          </li>
                          <li>
                            <h6>Price Per Guest</h6>
                            <p>$15</p>
                          </li>
                          <li>
                            <h6>Maximum Number of Guests</h6>
                            <p>2</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Appointment Information</h4>
                      </div>
                      <div className="appointment-info appoin-border">
                        <ul className="appointmentset">
                          <li>
                            <h6>Booked On</h6>
                            <p>$150 Upto 2 guests</p>
                          </li>
                          <li>
                            <h6>Price Per Guest</h6>
                            <p>$15</p>
                          </li>
                          <li>
                            <h6>Maximum Number of Guests</h6>
                            <p>2</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card dashboard-card court-information">
                      <div className="card-header">
                        <h4>Payment Details</h4>
                      </div>
                      <div className="appointment-info appoin-border double-row">
                        <ul className="appointmentset">
                          <li>
                            <h6>Court Booking Amount</h6>
                            <p>$150</p>
                          </li>
                          <li>
                            <h6>Additional Guests</h6>
                            <p>2</p>
                          </li>
                          <li>
                            <h6>Amount Additional Guests</h6>
                            <p>$30</p>
                          </li>
                          <li>
                            <h6>Service Charge</h6>
                            <p>$20</p>
                          </li>
                        </ul>
                      </div>
                      <div className="appointment-info appoin-border ">
                        <ul className="appointmentsetview">
                          <li>
                            <h6>Total Amount Paid</h6>
                            <p className="color-green">$180</p>
                          </li>
                          <li>
                            <h6>Paid On</h6>
                            <p>Mon, Jul 14</p>
                          </li>
                          <li>
                            <h6>Transaction ID</h6>
                            <p>#5464164445676781641</p>
                          </li>
                          <li>
                            <h6>Payment type</h6>
                            <p>Wallet</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Court Request */}
              </div>
              <div className="modal-footer">
                <div className="table-accept-btn">
                  <Link to="#" data-bs-dismiss="modal" className="btn cancel-table-btn">Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /upcoming Modal */}
        {/* Request Modal */}
        <div className="modal custom-modal fade payment-modal" id="add-payment" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Add Payment to Wallet</h4>
                </div>
                <Link className="close" data-bs-dismiss="modal" aria-label="Close" to={""}>
                  <span className="align-center" aria-hidden="true"><i className="feather-x" /></span>
                </Link>
              </div>
              <div className="modal-body">
                <div className="wallet-wrap wallet-modal">
                  <div className="wallet-amt">
                    <h5>Your Wallet Balance</h5>
                    <h2>$4,544</h2>
                  </div>
                </div>
                <form>
                  <div className="input-space">
                    <label className="form-label">Amount</label>
                    <input type="text" className="form-control" placeholder="Enter Amount" />
                  </div>
                  <div className="or-div">
                    <h6>OR</h6>
                  </div>
                  <div className="add-wallet-amount form-check">
                    <ul>
                      <li className="active">
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value" defaultChecked />
                          <label htmlFor="value">Add Value 1</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ $80</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value1" />
                          <label htmlFor="value1">Add Value 2</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ $60</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value2" />
                          <label htmlFor="value2">Add Value 3</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ $120</span>
                        </div>
                      </li>
                      <li>
                        <div className="add-wallet-checkbox">
                          <input type="checkbox" className="form-check-input" id="value3" />
                          <label htmlFor="value3">Add Value 4</label>
                        </div>
                        <div className="add-wallet-price">
                          <span>+ $120</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="radio-setview">
                    <h6>Select Payment Gateway</h6>
                    <div className="radio">
                      <div className="form-check form-check-inline mb-3">
                        <input className="form-check-input default-check me-1" type="radio" name="inlineRadioOptions" id="inlineRadio3" defaultValue="Credit Card" />
                        <label className="form-check-label" htmlFor="inlineRadio3">Credit Card</label>
                      </div>
                      <div className="form-check form-check-inline mb-0">
                        <input className="form-check-input default-check me-1" type="radio" name="inlineRadioOptions" id="inlineRadio4" defaultValue="Paypal" defaultChecked />
                        <label className="form-check-label" htmlFor="inlineRadio4">Paypal</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="table-accept-btn">
                  <Link to="#" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">Reset</Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Submit</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Request Modal */}
      </div>

    </div>
  );
};

export default UserDashboard;
