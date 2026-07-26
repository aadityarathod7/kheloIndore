import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import ReactApexChart from "react-apexcharts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

const CoachDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState();

  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];

  const PaidOn = (res) => {
    return (
      <div className="paid-edit">
        <span>
          <i className="feather-edit"></i>
          {res.Status}
        </span>
      </div>
    );
  };
  const DateTime = (res) => {
    return (
      <div>
        <p>{res.dateTime[0]}</p>
        <p>{res.dateTime[1]}</p>
      </div>
    );
  };

  const courtNameRender = (res) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img} alt="User" />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#">{res.courtName}</Link>
          <span>{res.CourtNo}</span>
        </span>
      </h2>
    );
  };

  const courtNameRenderTwo = (res) => {
    return (
      <h2 className="table-avatar">
        <Link
          to="#"
          data-bs-toggle="modal"
          data-bs-target="#upcoming-coach"
          className="avatar avatar-sm flex-shrink-0"
        >
          <ImageWithBasePath
            src={res.img}
            className="avatar-img"
            alt="Feature"
          />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link data-bs-toggle="modal" data-bs-target="#upcoming-coach">
            {res.courtName}
          </Link>
          <span>Booked on : {res.bookedOn}</span>
        </span>
      </h2>
    );
  };
  const actionRender = () => {
    return (
      <div className="dropdown dropdown-action table-drop-action">
        <Link
          to="#"
          className="action-icon dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-ellipsis-h" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <Link className="dropdown-item" to="#">
            <i className="feather-edit" />
            Edit
          </Link>
          <Link className="dropdown-item" to="#">
            <i className="feather-trash" />
            Delete
          </Link>
        </div>
      </div>
    );
  };
  const radialChartOptions = {
    chart: {
      height: 250,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#AAF40C", "#097E52"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "14px",
          },
          value: {
            fontSize: "20px",
          },
          total: {
            show: true,
            label: "Total Earnings",
            formatter: function () {
              return 4050;
            },
          },
        },
      },
    },
    series: [44, 55],
    labels: ["Cages", "Coaching"],
  };
  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Coach Dashboard</h1>
          <ul>
            <li>
              <Link to="index">Home</Link>
            </li>
            <li>Coach Dashboard</li>
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
                    <Link to="coach-dashboard" className="active">
                      <ImageWithBasePath
                        src="assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="all-court">
                      <ImageWithBasePath
                        src="assets/img/icons/court-icon.svg"
                        alt="Icon"
                      />
                      <span> Courts</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-request">
                      <ImageWithBasePath
                        src="assets/img/icons/request-icon.svg"
                        alt="Icon"
                      />
                      <span>Requests</span>
                      <span className="court-notify">03</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-booking">
                      <ImageWithBasePath
                        src="assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-chat">
                      <ImageWithBasePath
                        src="assets/img/icons/chat-icon.svg"
                        alt="Icon"
                      />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-earning">
                      <ImageWithBasePath
                        src="assets/img/icons/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Earnings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-wallet">
                      <ImageWithBasePath
                        src="assets/img/icons/wallet-icon.svg"
                        alt="Icon"
                      />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coach-profile">
                      <ImageWithBasePath
                        src="assets/img/icons/profile-icon.svg"
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
          {/* Statistics Card */}
          <div className="row">
            <div className="col-xl-6 col-lg-6">
              <div className="card dashboard-card statistic-simply">
                <div className="card-header">
                  <h4>Statistics</h4>
                  <p>Track progress and improve coaching performance </p>
                </div>
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>78</h3>
                        <p>Total Courts Booked</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/statistics-01.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>06</h3>
                        <p>Upcoming Bookings</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/statistics-03.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>45</h3>
                        <p>Total Lessons Taken</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/statistics-02.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
                    <div className="statistics-grid flex-fill">
                      <div className="statistics-content">
                        <h3>$45,056</h3>
                        <p>Payments</p>
                      </div>
                      <div className="statistics-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/statistics-04.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 d-flex">
              <div className="card dashboard-card statistic-simply">
                <div className="card-header">
                  <h4>Profile</h4>
                  <p>Impress potential students with an interesting profile </p>
                </div>
                <div className="dash-coach-profile">
                  <div className="track-statistics">
                    <div className="statistic-head">
                      <h5>Today</h5>
                      <p>100%</p>
                    </div>
                    <div className="progress mb-0">
                      <div
                        className="progress-bar bg-today"
                        role="progressbar"
                        style={{ width: "72.17%" }}
                        aria-valuenow="72.17"
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                  <div className="progress-titles">
                    <h5>Completed </h5>
                    <ul>
                      <li>
                        <i className="fa-solid fa-check-double" />
                        Basic Details
                      </li>
                      <li>
                        <i className="fa-solid fa-check-double" />
                        Payment Setup
                      </li>
                      <li>
                        <i className="fa-solid fa-check-double" />
                        Availability
                      </li>
                    </ul>
                  </div>
                  <div className="progress-titles">
                    <h5>Need to Complete </h5>
                    <ul className="need-complete">
                      <li>
                        <i className="feather-x-circle" />
                        Setup level for your Profile
                      </li>
                      <li>
                        <i className="feather-x-circle" />
                        Add Lesson type
                      </li>
                    </ul>
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
                <div className="card-header going-appoinment">
                  <div className="on-going-blk">
                    <h4>Ongoing Appointment</h4>
                    <p>
                      Manage appointments with our convenient scheduling system
                    </p>
                  </div>
                  <div className="complete-btn">
                    <Link to="#" className="btn btn-primary">
                      <i className="feather-user-check" />
                      Complete
                    </Link>
                  </div>
                </div>
                <div className="appointment-info">
                  <ul>
                    <li>
                      <div className="appointment-item">
                        <div className="appointment-img">
                          <ImageWithBasePath
                            src="assets/img/booking/booking-01.jpg"
                            alt="User"
                          />
                        </div>
                        <div className="appointment-content">
                          <h6>Leap Sports Academy</h6>
                          <p>Standard Synthetic Court 1</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="appointment-item">
                        <div className="appointment-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="User"
                          />
                        </div>
                        <div className="appointment-content">
                          <h6 className="mb-0">Harry</h6>
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
                      <h6>End Time</h6>
                      <p>06:25 AM</p>
                    </li>
                    <li>
                      <h6>Additional Guests</h6>
                      <p>4</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Appointment */}
          {/* Booking Requests */}
          <div className="row">
            <div className="col-xl-5 col-lg-12 d-flex">
              <div className="card dashboard-card ">
                <div className="card-header card-header-info">
                  <div className="card-header-inner request-book">
                    <h4>
                      Booking Requests <span className="request-point">03</span>
                    </h4>
                    <p>Easily handle court booking requests</p>
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
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
                                      Wing Sports Academy
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
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
                                      Feather Badminton
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
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-02.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
                                      Bwing Sports Academy
                                    </Link>
                                  </h6>
                                  <ul>
                                    <li>Court 3</li>
                                    <li>
                                      <i className="feather-clock" /> 06:00 PM
                                      to 08:00 PM
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
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
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
                                      Kevin Anderson
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
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
                                      Kevin Anderson
                                    </Link>
                                  </h6>
                                  <ul>
                                    <li>Court 2</li>
                                    <li>
                                      <i className="feather-clock" /> 06:00 PM
                                      to 08:00 PM
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
                                  <i className="feather-chevron-right" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="academy-info academy-coach-info">
                                <Link
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
                                      Kevin Anderson
                                    </Link>
                                  </h6>
                                  <ul>
                                    <li>Court 3</li>
                                    <li>
                                      <i className="feather-clock" /> 06:00 PM
                                      to 08:00 PM
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>Date: Tue, Jul 11</td>
                            <td>
                              <div className="academy-new-icon">
                                <Link to="coach-booking">
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
            <div className="col-xl-4 col-lg-12 d-flex">
              <div className="card dashboard-card ">
                <div className="card-header card-header-info view-all-fav">
                  <div className="card-header-inner">
                    <h4>My Favourites</h4>
                    <p>Lorem Ipsum is simply</p>
                  </div>
                  <Link to="#">View All</Link>
                </div>
                <div className="table-responsive dashboard-table-responsive">
                  <table className="table dashboard-card-table">
                    <tbody>
                      <tr>
                        <td>
                          <div className="academy-info academy-coach-info">
                            <Link to="coach-booking" className="academy-img">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                alt="Booking"
                              />
                            </Link>
                            <div className="academy-content">
                              <h6>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                >
                                  Harry
                                </Link>
                              </h6>
                              <ul>
                                <li>10 Bookings</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td>Date: Tue, Jul 11</td>
                        <td>
                          <div className="academy-new-icon">
                            <Link to="coach-booking">
                              <i className="feather-chevron-right" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="academy-info academy-coach-info">
                            <Link to="coach-booking" className="academy-img">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-03.jpg"
                                alt="Booking"
                              />
                            </Link>
                            <div className="academy-content">
                              <h6>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                >
                                  Johnson
                                </Link>
                              </h6>
                              <ul>
                                <li>15 Bookings</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td>Date: Wed, Jul 10</td>
                        <td>
                          <div className="academy-new-icon">
                            <Link to="coach-booking">
                              <i className="feather-chevron-right" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="academy-info academy-coach-info">
                            <Link to="coach-booking" className="academy-img">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-06.jpg"
                                alt="Booking"
                              />
                            </Link>
                            <div className="academy-content">
                              <h6>
                                <Link
                                  data-bs-toggle="modal"
                                  data-bs-target="#upcoming-court"
                                >
                                  Andy
                                </Link>
                              </h6>
                              <ul>
                                <li>12 Bookings</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td>Date: Fri, Jul 13</td>
                        <td>
                          <div className="academy-new-icon">
                            <Link to="coach-booking">
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
            <div className="col-xl-3 col-lg-12 d-flex">
              {/* Chart */}
              <div className="card dashboard-card statistic-simply">
                <div className="card-header card-header-info view-all-fav">
                  <div className="card-header-inner">
                    <h4>Earnings</h4>
                  </div>
                  <div className="sortby-section invoice-sort">
                    <div className="sorting-info">
                      <div className="sortby-filter-group court-sortby">
                        <div className="sortbyset week-bg me-0">
                          <div className="sorting-select">
                            <Dropdown
                              value={selectedTimeframe}
                              onChange={(e) => setSelectedTimeframe(e.value)}
                              options={timeframeOptions}
                              optionLabel="name"
                              placeholder="This Week"
                              className="select custom-select-list week-select"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {/* <div id="radial-chart" /> */}
                  <ReactApexChart
                    options={radialChartOptions}
                    series={radialChartOptions.series}
                    type="radialBar"
                    height={250}
                  />
                </div>
              </div>
              {/* /Chart */}
            </div>
          </div>
          {/* /Booking Requests */}
          {/* Availability */}
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="card dashboard-card">
                <div className="card-header card-header-info">
                  <div className="court-table-head">
                    <h4>My Availability</h4>
                    <p>
                      Easily communicate your availability for a seamless
                      coaching experience.
                    </p>
                  </div>
                  <div className="my-availability">
                    <div className="sortby-section invoice-sort">
                      <div className="sorting-info">
                        <div className="sortby-filter-group court-sortby">
                          <div className="sortbyset week-bg me-0">
                            <div className="sorting-select">
                              <Dropdown
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.value)}
                                options={timeframeOptions}
                                optionLabel="name"
                                placeholder="This Week"
                                className="select custom-select-list week-select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="edit-availability">
                      <Link to="#" className="btn btn-secondary">
                        <i className="feather-edit" />
                        Edit Availability
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="availability-group">
                  <div className="row">
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>23 Jul 2023</h6>
                          <span>Monday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>24 Jul 2023</h6>
                          <span>Tuesday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>25 Jul 2023</h6>
                          <span>Wednesday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>26 Jul 2023</h6>
                          <span>Thursday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>27 Jul 2023</h6>
                          <span>Friday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4">
                      <div className="availability-box">
                        <div className="available-date">
                          <h6>28 Jul 2023</h6>
                          <span>Saturday</span>
                        </div>
                        <div className="available-time">
                          <span>Time</span>
                          <h5>09:00 AM to 7:00 PM</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Availability */}
          {/* Dashboard Table */}
          <div className="row">
            <div className="col-xl-7 col-lg-12 d-flex">
              <div className="card dashboard-card flex-fill">
                <div className="card-header card-header-info">
                  <div className="card-header-inner">
                    <h4>My Bookings</h4>
                    <p>Expertly manage court bookings </p>
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
                          Court
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
                          Coaching
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-02.jpg"
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-04.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-03.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/booking/booking-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6>
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-court"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-05.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-07.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-06.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-08.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                                  to="coach-booking"
                                  className="academy-img"
                                >
                                  <ImageWithBasePath
                                    src="assets/img/featured/featured-09.jpg"
                                    alt="Booking"
                                  />
                                </Link>
                                <div className="academy-content">
                                  <h6 className="mb-1">
                                    {" "}
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#upcoming-coach"
                                    >
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
                                  <Link className="dropdown-item" to="#">
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
                <div className="card-header card-header-info view-all-fav">
                  <div className="card-header-inner">
                    <h4>Notifications </h4>
                    <p>Lorem Ipsum is simply </p>
                  </div>
                  <Link to="#">Mark all as read</Link>
                </div>
                <div className="notification-coach">
                  <div className="notify-box">
                    <div className="avatar flex-shrink-0">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/profiles/avatar-01.jpg"
                          alt="User"
                        />
                      </Link>
                    </div>
                    <div className="notify-detail flex-grow-1">
                      <h5>
                        John Smith{" "}
                        <span> has booked an appointment on Mon, Jul 11 </span>
                      </h5>
                      <span className="hour-notify">1h ago</span>
                      <div className="notify-btn-group">
                        <Link to="#" className="btn btn-primary">
                          Accept
                        </Link>
                        <Link to="#" className="btn btn-secondary">
                          Decline
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="notify-box">
                    <div className="avatar flex-shrink-0">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/booking/booking-02.jpg"
                          alt="Booking"
                        />
                      </Link>
                    </div>
                    <div className="notify-detail flex-grow-1">
                      <h5>
                        Admin <span> has Approved your </span>“Marsh Academy”
                      </h5>
                      <span className="hour-notify">1h ago</span>
                      <div className="notify-btn-group">
                        <Link
                          to="#"
                          className="btn btn-primary view-detail-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card dashboard-card academy-card">
                <div className="card-header card-header-info view-all-fav">
                  <div className="card-header-inner">
                    <h4>Recent Chats</h4>
                    <p>Lorem Ipsum is simply </p>
                  </div>
                  <Link to="coach-chat">Go to Chat</Link>
                </div>
                <div className="table-responsive dashboard-table-responsive">
                  <table className="table dashboard-card-table">
                    <tbody>
                      <tr>
                        <td>
                          <div className="academy-info academy-info">
                            <Link
                              to="coach-chat"
                              className="academy-img recent-chat-img"
                            >
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                alt="Booking"
                              />
                              <span className="green-active" />
                            </Link>
                            <div className="academy-content">
                              <h6>
                                <Link to="coach-chat">Harry</Link>
                              </h6>
                              <ul>
                                <li>10 Bookings</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td>2 min ago</td>
                      </tr>
                      <tr>
                        <td>
                          <div className="academy-info academy-info">
                            <Link
                              to="coach-chat"
                              className="academy-img recent-chat-img"
                            >
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-03.jpg"
                                alt="Booking"
                              />
                              <span className="green-active" />
                            </Link>
                            <div className="academy-content">
                              <h6>
                                <Link to="coach-chat">Johnson</Link>
                              </h6>
                              <ul>
                                <li>15 Bookings</li>
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td>2 min ago</td>
                      </tr>
                    </tbody>
                  </table>
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
                    <p>Lorem Ipsum is simply dummy text of the printing</p>
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
                      <DataTable
                        className="table datatable"
                      >
                        <Column
                          sortable
                          field="courtName"
                          body={courtNameRender}
                          header="Court Name"
                        ></Column>
                        <Column
                          sortable
                          field="dateTime"
                          body={DateTime}
                          header="Date & Time"
                        ></Column>
                        <Column
                          sortable
                          field="Payment"
                          header="Payment"
                        ></Column>
                        <Column
                          sortable
                          field="paidOn"
                          header="Paid On"
                        ></Column>
                        <Column
                          sortable
                          field="paidOn"
                          body={PaidOn}
                          header="Status"
                        ></Column>

                        <Column body={actionRender} header="Action"></Column>
                      </DataTable>
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
                      <DataTable
                        className="table datatable"
                      >
                        <Column
                          sortable
                          field="courtName"
                          body={courtNameRenderTwo}
                          header="Court Name"
                        ></Column>
                        <Column
                          sortable
                          field="Invoice"
                          header="Invoice"
                        ></Column>
                        <Column
                          sortable
                          field="dateTime"
                          body={DateTime}
                          header="Date & Time"
                        ></Column>
                        <Column
                          sortable
                          field="Payment"
                          header="Payment"
                        ></Column>
                        <Column
                          sortable
                          field="paidOn"
                          header="Paid On"
                        ></Column>
                        <Column
                          sortable
                          field="paidOn"
                          body={PaidOn}
                          header="Status"
                        ></Column>

                        <Column body={actionRender} header="Action"></Column>
                      </DataTable>
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

      <div>
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
                <Link
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
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
                                  src="assets/img/featured/featured-06.jpg"
                                  alt="Feature"
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
                <Link
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
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
                                  src="assets/img/booking/booking-03.jpg"
                                  alt="Booking"
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
        {/* /Upcoming Modal */}
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
                <Link
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
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
      </div>
    </div>
  );
};

export default CoachDashboard;
