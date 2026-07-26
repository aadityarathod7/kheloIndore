import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { bookingCompletedData } from "../../core/data/json/booking_completed";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const BookingCompleted = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [data2, setData2] = useState([{}]);
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];

  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Bookings</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Bookings</li>
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
                          src="assets/img/icons/dashboard-icon.svg"
                          alt="Icon"
                        />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.allCourt}>
                        <ImageWithBasePath
                          src="assets/img/icons/court-icon.svg"
                          alt="Icon"
                        />
                        <span> Courts</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachRequest}>
                        <ImageWithBasePath
                          src="assets/img/icons/request-icon.svg"
                          alt="Icon"
                        />
                        <span>Requests</span>
                        <span className="court-notify">03</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachBooking} className="active">
                        <ImageWithBasePath
                          src="assets/img/icons/booking-icon.svg"
                          alt="Icon"
                        />
                        <span>Bookings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachChat}>
                        <ImageWithBasePath
                          src="assets/img/icons/chat-icon.svg"
                          alt="Icon"
                        />
                        <span>Chat</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachEarning}>
                        <ImageWithBasePath
                          src="assets/img/icons/invoice-icon.svg"
                          alt="Icon"
                        />
                        <span>Earnings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachWallet}>
                        <ImageWithBasePath
                          src="assets/img/icons/wallet-icon.svg"
                          alt="Icon"
                        />
                        <span>Wallet</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachProfile}>
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
            {/* Sort By */}
            <div className="row">
              <div className="col-lg-12">
                <div className="sortby-section court-sortby-section">
                  <div className="sorting-info">
                    <div className="row d-flex align-items-center">
                      <div className="col-xl-6 col-lg-6 col-sm-12 col-12">
                        <div className="coach-court-list">
                          <ul className="nav">
                            <li>
                              <Link to={routes.coachBooking}>Upcoming</Link>
                            </li>
                            <li>
                              <Link
                                className="active"
                                to={routes.bookingCompleted}
                              >
                                Completed
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.bookingCancelled}>Cancelled</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-sm-12 col-12">
                        <div className="sortby-filter-group court-sortby">
                          <div className="sortbyset week-bg">
                            <div className="sorting-select">
                              <span className="select-icon">
                               
                              </span>
                              <Dropdown
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.value)}
                                options={timeframeOptions}
                                optionLabel="name"
                                placeholder="One Day"
                                className="select custom-select-list "
                              />
                            </div>
                          </div>
                          <div className="sortbyset">
                            <span className="sortbytitle">Sort By</span>
                            <div className="sorting-select">
                            <Dropdown
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.value)}
                                options={timeframeOptions}
                                optionLabel="name"
                                placeholder="One Day"
                                className="select custom-select-list week-select"
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
              <div className="col-sm-12">
                <div className="court-tab-content">
                  <div className="card card-tableset">
                    <div className="card-body">
                      <div className="coache-head-blk">
                        <div className="row align-items-center">
                          <div className="col-lg-6">
                            <div className="court-table-head">
                              <h4>Bookings</h4>
                              <p>
                                Effortlessly track and manage your completed
                                bookings
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="coach-active-blk">
                            <div className="dataTables_filter">
                            <label>
                              <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search"
                                className="form-control"
                              />
                            </label>
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
                          </div>
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
                          <div className="table-responsive">
                            <DataTable
                              value={data}
                              className="table table-borderless datatable"
                              paginator
                              rows={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              currentPageReportTemplate="{first}"
                            >
                              <Column
                                sortable
                                field="courtName"
                                header="CourtName"
                                body={(rowData) => (
                                  <td>
                                    <h2 className="table-avatar">
                                     <Link
                                        to="#"
                                        className="avatar avatar-sm flex-shrink-0"
                                      >
                                        <ImageWithBasePath
                                          className="avatar-img"
                                          src={rowData.img1}
                                          alt="User"
                                        />
                                     </Link>
                                      <span className="table-head-name flex-grow-1">
                                       <Link to="#">{rowData.courtName}</Link>
                                        <span>
                                          {rowData.courtNumber}
                                          <span className="book-on-date">
                                            {rowData.bookingTime}
                                          </span>
                                        </span>
                                      </span>
                                    </h2>
                                  </td>
                                )}
                              ></Column>
                              <Column
                                sortable
                                field="playerName"
                                header="PlayerName"
                                body={(rowData) => (
                                  <td>
                                    <h2 className="table-avatar">
                                     <Link
                                        to={routes.myProfile}
                                        className="avatar avatar-sm  flex-shrink-0"
                                      >
                                        <ImageWithBasePath
                                          className="avatar-img"
                                          src={rowData.img2}
                                          alt="User"
                                        />
                                     </Link>
                                      <span className="table-head-name table-name-user flex-grow-1">
                                       <Link to={routes.myProfile}>
                                          {rowData.playerName}
                                       </Link>
                                      </span>
                                    </h2>
                                  </td>
                                )}
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                header="Date&Time"
                                body={(rowData) => (
                                  <td className="table-date-time">
                                    <h4>
                                      {rowData.date}
                                      <span>{rowData.time}</span>
                                    </h4>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                field="additionalGuests"
                                header="Additional Guests"
                              />
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              />
                              <Column
                                sortable
                                field="reviews"
                                header="Reviews"
                                body={() => (
                                  <td className="table-rating">
                                    <div className="rating-point">
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                    </div>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                field="details"
                                header="Details"
                                body={() => (
                                  <td className="text-pink view-detail-pink">
                                   <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#complete-court"
                                    >
                                      <i className="feather-eye"></i>View
                                      Details
                                   </Link>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                body={() => (
                                  <td className="text-end">
                                    <div className="dropdown dropdown-action table-drop-action">
                                     <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fas fa-ellipsis-h"></i>
                                     </Link>
                                      <div className="dropdown-menu dropdown-menu-end">
                                       <Link
                                          className="dropdown-item"
                                          to="#"
                                        >
                                          <i className="feather-edit"></i>
                                          Edit
                                       </Link>
                                       <Link
                                          className="dropdown-item"
                                          to="#"
                                        >
                                          <i className="feather-trash"></i>
                                          Delete
                                       </Link>
                                      </div>
                                    </div>
                                  </td>
                                )}
                              />
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
                          <div className="table-responsive">
                            <DataTable
                              value={data2}
                              className="table table-borderless datatable"
                              paginator
                              rows={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              currentPageReportTemplate="{first}"
                            >
                              <Column
                                sortable
                                field="courtName"
                                header="CourtName"
                                body={(rowData) => (
                                  <td>
                                    <h2 className="table-avatar">
                                     <Link
                                        to="#"
                                        className="avatar avatar-sm flex-shrink-0"
                                      >
                                        <ImageWithBasePath
                                          className="avatar-img"
                                          src={rowData.img1}
                                          alt="User"
                                        />
                                     </Link>
                                      <span className="table-head-name flex-grow-1">
                                       <Link to="#">{rowData.courtName}</Link>
                                        <span>
                                          {rowData.courtNumber}
                                          <span className="book-on-date">
                                            {rowData.bookingTime}
                                          </span>
                                        </span>
                                      </span>
                                    </h2>
                                  </td>
                                )}
                              ></Column>
                              <Column
                                sortable
                                field="playerName"
                                header="PlayerName"
                                body={(rowData) => (
                                  <td>
                                    <h2 className="table-avatar">
                                     <Link
                                        to={routes.myProfile}
                                        className="avatar avatar-sm  flex-shrink-0"
                                      >
                                        <ImageWithBasePath
                                          className="avatar-img"
                                          src={rowData.img2}
                                          alt="User"
                                        />
                                     </Link>
                                      <span className="table-head-name table-name-user flex-grow-1">
                                       <Link to={routes.myProfile}>
                                          {rowData.playerName}
                                       </Link>
                                      </span>
                                    </h2>
                                  </td>
                                )}
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                header="Date&Time"
                                body={(rowData) => (
                                  <td className="table-date-time">
                                    <h4>
                                      {rowData.date}
                                      <span>{rowData.time}</span>
                                    </h4>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                field="additionalGuests"
                                header="Additional Guests"
                              />
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              />
                              <Column
                                sortable
                                field="reviews"
                                header="Reviews"
                                body={() => (
                                  <td className="table-rating">
                                    <div className="rating-point">
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                      <i className="fas fa-star filled"></i>
                                    </div>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                field="details"
                                header="Details"
                                body={() => (
                                  <td className="text-pink view-detail-pink">
                                   <Link
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#complete-court"
                                    >
                                      <i className="feather-eye"></i>View
                                      Details
                                   </Link>
                                  </td>
                                )}
                              />
                              <Column
                                sortable
                                body={() => (
                                  <td className="text-end">
                                    <div className="dropdown dropdown-action table-drop-action">
                                     <Link
                                        to="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fas fa-ellipsis-h"></i>
                                     </Link>
                                      <div className="dropdown-menu dropdown-menu-end">
                                       <Link
                                          className="dropdown-item"
                                          to="#"
                                        >
                                          <i className="feather-edit"></i>
                                          Edit
                                       </Link>
                                       <Link
                                          className="dropdown-item"
                                          to="#"
                                        >
                                          <i className="feather-trash"></i>
                                          Delete
                                       </Link>
                                      </div>
                                    </div>
                                  </td>
                                )}
                              />
                            </DataTable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-footer">
                    <div className="row">
                      <div className="col-md-6">
                        <div id="tablelength" />
                      </div>
                      <div className="col-md-6">
                        <div id="tablepage" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <>
          {/* complete Modal */}
          <div
            className="modal custom-modal fade request-modal"
            id="complete-coach"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="form-header modal-header-title">
                    <h4 className="mb-0">
                      Coach Booking Details
                      <span className="badge bg-success ms-2">Complete</span>
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
                          <h4>Player Information</h4>
                        </div>
                        <div className="appointment-info">
                          <ul className="appointmentset">
                            <li>
                              <div className="appointment-item">
                                <div className="appointment-img">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-06.jpg"
                                    alt="User"
                                  />
                                </div>
                                <div className="appointment-content">
                                  <h6>Martina</h6>
                                  <p>Since 05/05/2023</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <h6>
                                Previosly Booked{" "}
                                <i className="feather-alert-circle ms-1" />
                              </h6>
                              <p>22 Jan 2023</p>
                            </li>
                            <li>
                              <h6>No of Bookings</h6>
                              <p>2</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="card dashboard-card court-information">
                        <div className="card-header">
                          <h4>Coach Information</h4>
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
                              <p>
                                <span className="color-green">$200.00</span> /
                                hr
                              </p>
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
                          <h4>Booking Days</h4>
                        </div>
                        <div className="booking-days">
                          <ul>
                            <li className="active">
                              <ImageWithBasePath
                                src="assets/img/icons/reset.svg"
                                className="me-2"
                                alt="Icon"
                              />
                              <i className="feather-check-circle me-2" />
                              14 May 2023 - 7:00 PM
                              <i className="fa fa-check-circle ms-2" />
                            </li>
                            <li className="active">
                              <ImageWithBasePath
                                src="assets/img/icons/reset.svg"
                                className="me-2"
                                alt="Icon"
                              />
                              <i className="feather-check-circle me-2" />
                              15 May 2023 - 7:00 PM
                              <i className="fa fa-check-circle ms-2" />
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
                      <div className="card dashboard-card court-information">
                        <div className="card-header">
                          <h4>Review Details</h4>
                        </div>
                        <div className="user-review-details">
                          <div className="user-review-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="User"
                            />
                          </div>
                          <div className="user-review-content">
                            <div className="table-rating">
                              <div className="rating-point">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span>5.0</span>
                              </div>
                            </div>
                            <span>
                              <i
                                className="fa fa-check me-2"
                                aria-hidden="true"
                              />
                              Yes, I would book again.
                            </span>
                            <h6>Absolutely perfect</h6>
                            <p>
                              If you are looking for a perfect place for
                              friendly matches with your friends or a
                              competitive match, It is the best place.
                            </p>
                            <h5>Sent on 11/03/2023</h5>
                          </div>
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
          {/* /complete Modal */}
          {/* complete Modal */}
          <div
            className="modal custom-modal fade request-modal"
            id="complete-court"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="form-header modal-header-title">
                    <h4 className="mb-0">
                      Court Booking Details
                      <span className="badge bg-success ms-2">Completed</span>
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
                                    alt="User"
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
                          <h4>Player Information</h4>
                        </div>
                        <div className="appointment-info">
                          <ul className="appointmentset">
                            <li>
                              <div className="appointment-item">
                                <div className="appointment-img">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-06.jpg"
                                    alt="User"
                                  />
                                </div>
                                <div className="appointment-content">
                                  <h6>Martina</h6>
                                  <p>Court 1</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <h6>
                                Previosly Booked{" "}
                                <i className="feather-alert-circle ms-1" />
                              </h6>
                              <p>22 Jan 2023</p>
                            </li>
                            <li>
                              <h6>No of Bookings</h6>
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
                              <p>Mon, Jul 14</p>
                            </li>
                            <li>
                              <h6>Date &amp; Time</h6>
                              <p>
                                Mon, Jul 14
                                <span className="d-block">
                                  05:00 PM - 08:00 PM
                                </span>
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
                      <div className="card dashboard-card court-information">
                        <div className="card-header">
                          <h4>Review Details</h4>
                        </div>
                        <div className="user-review-details">
                          <div className="user-review-img">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              alt="User"
                            />
                          </div>
                          <div className="user-review-content">
                            <div className="table-rating">
                              <div className="rating-point">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span>5.0</span>
                              </div>
                            </div>
                            <span>
                              <i
                                className="fa fa-check me-2"
                                aria-hidden="true"
                              />
                              Yes, I would book again.
                            </span>
                            <h6>Absolutely perfect</h6>
                            <p>
                              If you are looking for a perfect place for
                              friendly matches with your friends or a
                              competitive match, It is the best place.
                            </p>
                            <h5>Sent on 11/03/2023</h5>
                          </div>
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
          {/* /complete Modal */}
        </>
      </>
    </div>
  );
};

export default BookingCompleted;
