import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { all_routes } from "../router/all_routes";

import { Dropdown } from "primereact/dropdown";
import { userOngoingdata } from "../../core/data/json/user_ongoing";

const UserOngoing = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedSort, setSelectedSort] = useState();

  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];

  const filteredData = userOngoingdata.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });
  const courtNameRender = (res: userOngoing) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm flex-shrink-0">
          <ImageWithBasePath
            className="avatar-img"
            src={res.image}
            alt="User"
          />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#" data-bs-toggle="modal" data-bs-target="#profile-court">
            {res.content}
          </Link>
          <span>{res.court} </span>
        </span>
      </h2>
    );
  };
  const courtcoachRender = (res: userOngoing) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm flex-shrink-0">
          <ImageWithBasePath
            className="avatar-img"
            src={res.image2}
            alt="User"
          />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#" data-bs-toggle="modal" data-bs-target="#profile-court">
            {res.coachName}
          </Link>
          <span>{res.bookeddata} </span>
        </span>
      </h2>
    );
  };
  const dateRender = (res: userOngoing) => {
    return (
      <td className="table-date-time">
        <h4>
          {res.date}
          <span>{res.time}</span>
        </h4>
      </td>
    );
  };
  const bookingRender = (res: userOngoing) => {
    return <td className="table-date-time">{res.bookingtype}</td>;
  };
  const detailsRender = () => {
    return (
      <td className="text-pink view-detail-pink">
        <Link to="#" data-bs-toggle="modal" data-bs-target="#complete-court">
          <i className="feather-eye"></i>View Details
        </Link>
      </td>
    );
  };
  const statusRender = (res: userOngoing) => {
    return (
      <span className="badge bg-warning">
        <i className="feather-check-square me-1"></i>
        {res.status}
      </span>
    );
  };
  const reviewRender = () => {
    return (
      <td className="table-rating">
        <div className="rating-point">
          <i className="fas fa-star filled"></i>
          <i className="fas fa-star filled"></i>
          <i className="fas fa-star filled"></i>
          <i className="fas fa-star filled"></i>
          <i className="fas fa-star"></i>
        </div>
      </td>
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
          <i className="fas fa-ellipsis-h"></i>
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <Link className="dropdown-item" to="#">
            <i className="feather-star"></i>Write Review
          </Link>
          <Link className="dropdown-item" to="#">
            <i className="feather-trash"></i>Delete
          </Link>
        </div>
      </div>
    );
  };
  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">User Bookings</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>User Bookings</li>
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
                      <Link to={routes.userDashboard}>
                        <ImageWithBasePath
                          src="assets/img/icons/dashboard-icon.svg"
                          alt="Icon"
                        />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.userBookings} className="active">
                        <ImageWithBasePath
                          src="assets/img/icons/booking-icon.svg"
                          alt="Icon"
                        />
                        <span>My Bookings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.userChat}>
                        <ImageWithBasePath
                          src="assets/img/icons/chat-icon.svg"
                          alt="Icon"
                        />
                        <span>Chat</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.userInvoice}>
                        <ImageWithBasePath
                          src="assets/img/icons/invoice-icon.svg"
                          alt="Icon"
                        />
                        <span>Invoices</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.userWallet}>
                        <ImageWithBasePath
                          src="assets/img/icons/wallet-icon.svg"
                          alt="Icon"
                        />
                        <span>Wallet</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.userProfile}>
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
                      <div className="col-xl-7 col-lg-7 col-sm-12 col-12">
                        <div className="coach-court-list">
                          <ul className="nav">
                            <li>
                              <Link to={routes.userBookings}>Upcoming</Link>
                            </li>
                            <li>
                              <Link to={routes.userComplete}>Completed</Link>
                            </li>
                            <li>
                              <Link className="active" to={routes.userOngoing}>
                                On Going
                              </Link>
                            </li>
                            <li>
                              <Link to={routes.userCancelled}>Cancelled</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-xl-5 col-lg-5 col-sm-12 col-12">
                        <div className="sortby-filter-group court-sortby">
                          <div className="sortbyset week-bg">
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
                          <div className="sortbyset">
                            <span className="sortbytitle">Sort By</span>
                            <div className="sorting-select">
                              <Dropdown
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.value)}
                                options={sortOptions}
                                optionLabel="name"
                                placeholder="Relevance"
                                className="select custom-select-list w-100"
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
                          <div className="col-md-5">
                            <div className="court-table-head">
                              <h4>My Bookings</h4>
                              <p>
                                Track and manage your Ongoing court bookings
                              </p>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <div className="table-search-top">
                              <div className="dataTables_filter">
                                <label>
                                  <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) =>
                                      setSearchInput(e.target.value)
                                    }
                                    placeholder="Search"
                                    className="form-control"
                                  />
                                </label>
                              </div>
                              <div id="tablefilter" />
                              <div className="request-coach-list">
                                <div className="card-header-btns">
                                  <nav>
                                    <div
                                      className="nav nav-tabs"
                                      role="tablist"
                                    >
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
                                        Courts
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
                                        Coaches
                                      </button>
                                    </div>
                                  </nav>
                                </div>
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
                          <div className="table-responsive table-datatble">
                            <DataTable
                              className="table datatable"
                              value={filteredData}
                              paginator
                              rows={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              currentPageReportTemplate="{first}"
                            >
                              <Column
                                sortable
                                field="coachName"
                                body={courtcoachRender}
                                header="Coach Name"
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                body={dateRender}
                                header="Date & Time"
                              ></Column>
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              ></Column>
                              <Column
                                sortable
                                field="details"
                                body={detailsRender}
                                header="Details"
                              ></Column>
                              <Column
                                sortable
                                field="review"
                                body={reviewRender}
                                header="Review"
                              ></Column>
                              <Column
                                sortable
                                field="status"
                                header="Status"
                                body={statusRender}
                                className="table-inset-btn"
                              ></Column>
                              <Column sortable body={actionRender}></Column>
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
                              value={filteredData}
                              paginator
                              rows={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              currentPageReportTemplate="{first}"
                            >
                              <Column
                                sortable
                                field="courtName"
                                body={courtNameRender}
                                header="Court Name"
                              ></Column>
                              <Column
                                sortable
                                field="bookingtype"
                                body={bookingRender}
                                header="BookingType"
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                body={dateRender}
                                header="Date & Time"
                              ></Column>
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              ></Column>
                              <Column
                                sortable
                                field="status"
                                header="Status"
                                body={statusRender}
                                className="table-inset-btn"
                              ></Column>
                              <Column
                                sortable
                                field="details"
                                body={detailsRender}
                                header="Details"
                              ></Column>

                              <Column
                                sortable
                                field="review"
                                body={reviewRender}
                                header="Review"
                              ></Column>

                              <Column sortable body={actionRender}></Column>
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
      </>
      <>
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
                    <span className="badge bg-warning ms-2">On Going</span>
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
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
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
          id="complete-coach"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">
                    Coach Booking Details
                    <span className="badge bg-warning ms-2">On Going</span>
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
                            If you are looking for a perfect place for friendly
                            matches with your friends or a competitive match, It
                            is the best place.
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
        {/* profile Modal */}
        <div
          className="modal custom-modal fade request-modal"
          id="profile-coach"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Coach Profile</h4>
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
                      <div className="profile-set">
                        <div className="profile-set-image">
                          <ImageWithBasePath
                            src="assets/img/featured/featured-05.jpg"
                            alt="Venue"
                          />
                        </div>
                        <div className="profile-set-content">
                          <h3>Kevin Anderson</h3>
                          <div className="rating-city">
                            <div className="profile-set-rating">
                              <span>4.5</span>
                              <h6>300 Reviews</h6>
                            </div>
                            <div className="profile-set-img">
                              <ImageWithBasePath
                                src="assets/img/flag/usa.png"
                                alt="Profile"
                              />
                              <h6>Santamanica, United states</h6>
                            </div>
                          </div>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.industry&apos;s
                          </p>
                          <ul>
                            <li>
                              <ImageWithBasePath
                                src="assets/img/icons/rank.svg"
                                alt="Icon"
                              />
                              <h6>Rank : Expert</h6>
                            </li>
                            <li>
                              <ImageWithBasePath
                                src="assets/img/icons/process.svg"
                                alt="Icon"
                              />
                              <h6>Sessions Completed : 25</h6>
                            </li>
                            <li>
                              <ImageWithBasePath
                                src="assets/img/icons/calendar-alt.svg"
                                alt="Icon"
                              />
                              <h6>
                                With Dreamsport since<span> Apr 5, 2023</span>
                              </h6>
                            </li>
                          </ul>
                        </div>
                        <div className="price-set-price">
                          <h6>Start’s From</h6>
                          <h5>
                            $250<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="profile-tab">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#profile"
                            type="button"
                            role="tab"
                            aria-selected="true"
                          >
                            Profile Info
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="appointment-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#appointment"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Appointment Details
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="reviews-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#reviews"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Reviews
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="previous-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#previous"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Previous Booking
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="profile"
                          role="tabpanel"
                          aria-labelledby="profile-tab"
                        >
                          <div className="profile-card mb-0">
                            <div className="profile-card-title">
                              <h4>Contact Information</h4>
                            </div>
                            <div className="profile-contact-details">
                              <ul>
                                <li>
                                  <span>Email Address</span>
                                  <h6>contact@example.com</h6>
                                </li>
                                <li>
                                  <span>Phone Number</span>
                                  <h6>+1 56565 556558</h6>
                                </li>
                                <li>
                                  <span> Address</span>
                                  <h6>
                                    1653 Davisson Street,Indianapolis, IN 46225
                                  </h6>
                                </li>
                              </ul>
                            </div>
                            <div className="profile-card-title">
                              <h4>Short Bio</h4>
                            </div>
                            <div className="profile-card-content">
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Varius consectetur a at est
                                diam ultricies. Egestas eros leo dapibus tellus
                                neque turpis. Nec in morbi adipiscing pretium
                                accumsan urna ac,Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Varius consectetur
                                a at est diam ultricies. Egestas eros leo
                                dapibus tellus neque turpis. Nec in morbi
                                adipiscing pretium accumsan urna ac,Lorem ipsum
                                dolor sit amet, consectetur adipiscing elit.
                                Varius consectetur a at est diam ultricies.
                                Egestas eros leo dapibus tellus neque turpis.
                                Nec in morbi adipiscing pretium accumsan urna
                                ac,
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="appointment"
                          role="tabpanel"
                          aria-labelledby="appointment-tab"
                        >
                          {/* Accordian Contents */}
                          <div className="accordion" id="accordionPanel">
                            <div className="accordion-item mb-4" id="short-bio">
                              <h4
                                className="accordion-header"
                                id="panelsStayOpen-short-bio"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#panelsStayOpen-collapseOne"
                                  aria-expanded="true"
                                  aria-controls="panelsStayOpen-collapseOne"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/short-bio.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Short Bio
                                </button>
                              </h4>
                              <div
                                id="panelsStayOpen-collapseOne"
                                className="accordion-collapse collapse show"
                                aria-labelledby="panelsStayOpen-short-bio"
                              >
                                <div className="accordion-body">
                                  <div className="text show-more-height">
                                    <p>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book. It has survived not only
                                      five centuries, but also the leap into
                                      electronic typesetting, remaining
                                      essentially unchanged. It was popularised
                                      in the 1960s with the release of Letraset
                                      sheets containing Lorem Ipsum passages,
                                      and more recently with desktop publishing
                                      software like Aldus PageMaker including
                                      versions of Lorem Ipsum
                                    </p>
                                    <ul>
                                      <li>
                                        4 years of high school (3 years varsity)
                                      </li>
                                      <li>
                                        3 years of college club badminton at
                                        Loyola Marymount
                                      </li>
                                      <li>
                                        I grew up at North Venice Little League
                                        and represented
                                      </li>
                                      <li>
                                        Southern California in 2017 for Senior
                                        State Champs.
                                      </li>
                                      <li>
                                        3 years on Varsity at Venice High
                                        School. Venice Varsity
                                      </li>
                                      <li>
                                        badminton Western League Champs 2017.
                                      </li>
                                      <li>
                                        2 years of Loyola Marymount University
                                        Club badminton.
                                      </li>
                                    </ul>
                                    <p>
                                      It was popularised in the 1960s with the
                                      release of Letraset sheets containing
                                      Lorem Ipsum passages, and more recently
                                      with desktop publishing software like
                                      Aldus PageMaker including versions of
                                      Lorem Ipsum
                                    </p>
                                    <p>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book. It has survived not only
                                      five centuries, but also the leap into
                                      electronic typesetting, remaining
                                      essentially unchanged. It was popularised
                                      in the 1960s with the release of Letraset
                                      sheets containing Lorem Ipsum passages,
                                      and more recently with desktop publishing
                                      software like Aldus PageMaker including
                                      versions of Lorem Ipsum
                                    </p>
                                    <p>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book. It has survived not only
                                      five centuries, but also the leap into
                                      electronic typesetting, remaining
                                      essentially unchanged.
                                    </p>
                                    <p>
                                      It was popularised in the 1960s with the
                                      release of Letraset sheets containing
                                      Lorem Ipsum passages, and more recently
                                      with desktop publishing software like
                                      Aldus PageMaker including versions of
                                      Lorem Ipsum
                                    </p>
                                  </div>
                                  <div className="show-more d align-items-center primary-text">
                                    <i className="feather-plus-circle" />
                                    Show More
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="accordion-item mb-4"
                              id="lesson-with-me"
                            >
                              <h4
                                className="accordion-header"
                                id="panelsStayOpen-lesson-with-me"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#panelsStayOpen-collapseTwo"
                                  aria-expanded="false"
                                  aria-controls="panelsStayOpen-collapseTwo"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/lesson-with-me.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Lesson With me
                                </button>
                              </h4>
                              <div
                                id="panelsStayOpen-collapseTwo"
                                className="accordion-collapse collapse show"
                                aria-labelledby="panelsStayOpen-lesson-with-me"
                              >
                                <div className="accordion-body">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry&apos;s standard
                                    dummy text ever since the 1500s, when an
                                    unknown printer took a galley of type and
                                    scrambled it to make a type specimen book.
                                    It has survived not only five centuries, but
                                    also the leap into electronic typesetting,
                                    remaining essentially unchanged. It was
                                    popularised in the 1960s with the release of
                                    Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop
                                    publishing software like Aldus PageMaker
                                    including versions of Lorem Ipsum
                                  </p>
                                  <ul>
                                    <li>
                                      <i className="feather-check-square" />
                                      Single Lesson
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />2
                                      Player Lesson
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Small group Lesson
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4" id="coaching">
                              <h4
                                className="accordion-header"
                                id="panelsStayOpen-coaching"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#panelsStayOpen-collapseThree"
                                  aria-expanded="false"
                                  aria-controls="panelsStayOpen-collapseThree"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/coaching.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Coaching
                                </button>
                              </h4>
                              <div
                                id="panelsStayOpen-collapseThree"
                                className="accordion-collapse collapse show"
                                aria-labelledby="panelsStayOpen-coaching"
                              >
                                <div className="accordion-body">
                                  <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry&apos;s standard
                                    dummy text ever since the 1500s, when an
                                    unknown printer took a galley of type and
                                    scrambled it to make a type specimen book.
                                    It has survived not only five centuries, but
                                    also the leap into electronic typesetting,
                                    remaining essentially unchanged. It was
                                    popularised in the 1960s with the release of
                                    Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop
                                    publishing software like Aldus PageMaker
                                    including versions of Lorem Ipsum
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4" id="gallery">
                              <h4
                                className="accordion-header"
                                id="panelsStayOpen-gallery"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#panelsStayOpen-collapseFive"
                                  aria-expanded="false"
                                  aria-controls="panelsStayOpen-collapseFive"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/gallery.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Gallery
                                </button>
                              </h4>
                              <div
                                id="panelsStayOpen-collapseFive"
                                className="accordion-collapse collapse show"
                                aria-labelledby="panelsStayOpen-gallery"
                              >
                                <div className="accordion-body">
                                  <div className="owl-carousel gallery-slider owl-theme">
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-15.jpg"
                                      />
                                    </div>
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-16.jpg"
                                      />
                                    </div>
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-17.jpg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item" id="location">
                              <h4
                                className="accordion-header"
                                id="panelsStayOpen-location"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#panelsStayOpen-collapseSeven"
                                  aria-expanded="false"
                                  aria-controls="panelsStayOpen-collapseSeven"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/location.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Location
                                </button>
                              </h4>
                              <div
                                id="panelsStayOpen-collapseSeven"
                                className="accordion-collapse collapse show"
                                aria-labelledby="panelsStayOpen-location"
                              >
                                <div className="accordion-body">
                                  <div className="google-maps">
                                    <iframe
                                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                                      height={170}
                                      style={{ border: 0 }}
                                      allowFullScreen=""
                                      loading="lazy"
                                      referrerPolicy="no-referrer-when-downgrade"
                                    />
                                  </div>
                                  <div className="dull-bg d-flex justify-content-start align-items-center mb-3">
                                    <div className="white-bg me-2">
                                      <i className="fas fa-location-arrow" />
                                    </div>
                                    <div className="">
                                      <h6>Our Venue Location</h6>
                                      <p>70 Bright St New York, USA</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Accordian Contents */}
                        </div>
                        <div
                          className="tab-pane fade"
                          id="reviews"
                          role="tabpanel"
                          aria-labelledby="reviews-tab"
                        >
                          <div className="review-box review-box-user d-flex">
                            <div className="review-profile">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                            </div>
                            <div className="review-info">
                              <h6 className="mb-2 tittle">
                                Amanda Booked on 06/04/2023
                              </h6>
                              <div className="rating">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span className="">5.0</span>
                              </div>
                              <span className="success-text">
                                <i className="feather-check" />
                                Yes, I would book again.
                              </span>
                              <h6>Absolutely perfect</h6>
                              <p>
                                If you are looking for a perfect place for
                                friendly matches with your friends or a
                                competitive match, It is the best place.
                              </p>
                              <ul className="review-gallery">
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-01.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-01.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-02.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-02.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-03.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-03.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-04.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-04.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-05.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-05.jpg"
                                    />
                                  </Link>
                                </li>
                              </ul>
                              <span className="post-date">
                                Sent on 11/03/2023
                              </span>
                            </div>
                          </div>
                          <div className="review-box review-box-user d-flex">
                            <div className="review-profile">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                            </div>
                            <div className="review-info">
                              <h6 className="mb-2 tittle">
                                Amanda Booked on 06/04/2023
                              </h6>
                              <div className="rating">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span className="">5.0</span>
                              </div>
                              <h6>Awesome. Its very convenient to play.</h6>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry&apos;s standard dummy text ever
                                since the 1500s, when an unknown printer took a
                                galley of type and scrambled it to make a type
                                specimen book. It has survived not only five
                                centuries, but also the leap into electronic!!
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="previous"
                          role="tabpanel"
                          aria-labelledby="previous-tab"
                        >
                          <div className="preview-tab">
                            <ul>
                              <li>
                                <div className="preview-tabcontent">
                                  <div className="preview-tabimg">
                                    <ImageWithBasePath
                                      src="assets/img/services/service-01.jpg"
                                      alt="Service"
                                    />
                                  </div>
                                  <div className="preview-tabname">
                                    <h4>Leap Sports Academy</h4>
                                    <h5>Court 1</h5>
                                    <ul>
                                      <li>
                                        <span>Guests : 4</span>
                                      </li>
                                      <li>
                                        <span>2 Hrs</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <h6>Date &amp; Time</h6>
                                <span className="d-block">Mon, Jul 11</span>
                                <span>06:00 PM - 08:00 PM</span>
                              </li>
                              <li>
                                <h6>$400</h6>
                              </li>
                            </ul>
                          </div>
                          <div className="preview-tab">
                            <ul>
                              <li>
                                <div className="preview-tabcontent">
                                  <div className="preview-tabimg">
                                    <ImageWithBasePath
                                      src="assets/img/services/service-02.jpg"
                                      alt="Service"
                                    />
                                  </div>
                                  <div className="preview-tabname">
                                    <h4>Marsh Academy</h4>
                                    <h5>Court 1</h5>
                                    <ul>
                                      <li>
                                        <span>Guests : 4</span>
                                      </li>
                                      <li>
                                        <span>2 Hrs</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <h6>Date &amp; Time</h6>
                                <span className="d-block">Mon, Jul 11</span>
                                <span>06:00 PM - 08:00 PM</span>
                              </li>
                              <li>
                                <h6>$300</h6>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Court Request */}
              </div>
            </div>
          </div>
        </div>
        {/* /upcoming Modal */}
        {/* profile Modal */}
        <div
          className="modal custom-modal fade request-modal"
          id="profile-court"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <div className="form-header modal-header-title">
                  <h4 className="mb-0">Coach Profile</h4>
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
                    <div className="master-academy dull-whitesmoke-bg card master-academyview">
                      <div className="row d-flex align-items-center justify-content-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                          <div className="d-sm-flex justify-content-start align-items-center">
                            <Link to="javascript:void(0);">
                              <ImageWithBasePath
                                className="corner-radius-10"
                                src="assets/img/master-academy.png"
                                alt="Academy"
                              />
                            </Link>
                            <div className="info">
                              <h3 className="mb-2">Manchester Academy</h3>
                              <div className="profile-set-content w-100 p-0">
                                <ul className="bg-transparent p-0">
                                  <li>
                                    <ImageWithBasePath
                                      src="assets/img/icons/location.svg"
                                      alt="Icon"
                                    />
                                    <h6> 70 Bright St New York, USA</h6>
                                  </li>
                                  <li>
                                    <ImageWithBasePath
                                      src="assets/img/icons/call.svg"
                                      alt="Icon"
                                    />
                                    <h6>+3 80992 31212</h6>
                                  </li>
                                  <li>
                                    <ImageWithBasePath
                                      src="assets/img/icons/mail.svg"
                                      alt="Icon"
                                    />
                                    <h6> yourmail@example.com</h6>
                                  </li>
                                </ul>
                              </div>
                              <div className="coach-profile-set">
                                <ul className="bg-transparent p-0">
                                  <li>
                                    <div className="coach-profile-set-img">
                                      <ImageWithBasePath
                                        src="assets/img/icons/indoor.svg"
                                        alt="Icon"
                                      />
                                    </div>
                                    <div className="coach-profile-set-contemt">
                                      <h5>Venue </h5>
                                      <span> Indoor</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="coach-profile-set-img ">
                                      <ImageWithBasePath
                                        src="assets/img/profiles/avatar-01.jpg"
                                        alt="User"
                                      />
                                    </div>
                                    <div className="coach-profile-set-contemt">
                                      <h5>Venue </h5>
                                      <span> Indoor</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                          <ul className="d-sm-flex align-items-center justify-content-evenly">
                            <li>
                              <h3 className="d-inline-block">$150</h3>
                              <span>/hr</span>
                              <p>up to 1 guests</p>
                            </li>
                            <li>
                              <span>
                                <i className="feather-plus" />
                              </span>
                            </li>
                            <li className="text-center">
                              <h3 className="d-inline-block">$5</h3>
                              <span>/hr</span>
                              <p>
                                each additional guest <br />
                                up to 4 guests max
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="profile-tab">
                      <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="profile-tab1"
                            data-bs-toggle="tab"
                            data-bs-target="#profile1"
                            type="button"
                            role="tab"
                            aria-selected="true"
                          >
                            Profile Info
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="appointment-tab1"
                            data-bs-toggle="tab"
                            data-bs-target="#appointment1"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Appointment Details
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="reviews-tab1"
                            data-bs-toggle="tab"
                            data-bs-target="#reviews1"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Reviews
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="previous-tab1"
                            data-bs-toggle="tab"
                            data-bs-target="#previous1"
                            type="button"
                            role="tab"
                            aria-selected="false"
                          >
                            Previous Booking
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="profile1"
                          role="tabpanel"
                          aria-labelledby="profile-tab1"
                        >
                          <div className="profile-card mb-0">
                            <div className="profile-card-title">
                              <h4>Contact Information</h4>
                            </div>
                            <div className="profile-contact-details mb-0">
                              <ul>
                                <li>
                                  <span>Email Address</span>
                                  <h6>contact@example.com</h6>
                                </li>
                                <li>
                                  <span>Phone Number</span>
                                  <h6>+1 56565 556558</h6>
                                </li>
                                <li>
                                  <span> Address</span>
                                  <h6>
                                    1653 Davisson Street,Indianapolis, IN 46225
                                  </h6>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="appointment1"
                          role="tabpanel"
                          aria-labelledby="appointment-tab1"
                        >
                          {/* Accordian Contents */}
                          <div className="accordion">
                            <div className="accordion-item mb-4">
                              <h4 className="accordion-header">
                                <button
                                  className="accordion-button"
                                  type="button"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/Black.svg"
                                      alt="Icon"
                                    />
                                  </span>
                                  Overview
                                </button>
                              </h4>
                              <div className="accordion-collapse ">
                                <div className="accordion-body">
                                  <div className="text">
                                    <p>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book. It has survived not only
                                      five centuries, but also the leap into
                                      electronic typesetting, remaining
                                      essentially unchanged. It was popularised
                                      in the 1960s with the release of Letraset
                                      sheets containing Lorem Ipsum passages,
                                      and more recently with desktop publishing
                                      software like Aldus PageMaker including
                                      versions of Lorem Ipsum
                                    </p>
                                    <p>
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book. It has survived not only
                                      five centuries, but also the leap into
                                      electronic typesetting, remaining
                                      essentially unchanged.
                                    </p>
                                    <p>
                                      It was popularised in the 1960s with the
                                      release of Letraset sheets containing
                                      Lorem Ipsum passages, and more recently
                                      with desktop publishing software like
                                      Aldus PageMaker including versions of
                                      Lorem IpsumLorem Ipsum is simply dummy
                                      text of the printing and typesetting
                                      industry. Lorem Ipsum has been the
                                      industry&apos;s standard dummy text ever
                                      since the 1500s, when an unknown printer
                                      took a galley of type and scrambled it to
                                      make a type specimen book. It has survived
                                      not only five centuries, but also the leap
                                      into electronic typesetting, remaining
                                      essentially unchanged.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4">
                              <h4 className="accordion-header">
                                <button
                                  className="accordion-button"
                                  type="button"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/lesson-with-me.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Rules
                                </button>
                              </h4>
                              <div className="accordion-collapse ">
                                <div className="accordion-body">
                                  <p>
                                    <i className="feather-alert-octagon text-danger me-2" />
                                    Non Marking Shoes are recommended not
                                    mandatory for Badminton.
                                  </p>
                                  <p>
                                    <i className="feather-alert-octagon text-danger me-2" />
                                    A maximum number of members per booking per
                                    badminton court is admissible fixed by Venue
                                    Vendors
                                  </p>
                                  <p>
                                    <i className="feather-alert-octagon text-danger me-2" />
                                    No pets, no seeds, no gum, no glass, no
                                    hitting or swinging outside of the cage
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4">
                              <h4 className="accordion-header">
                                <button
                                  className="accordion-button"
                                  type="button"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/lesson-with-me.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Amenities
                                </button>
                              </h4>
                              <div className="accordion-collapse">
                                <div className="accordion-body">
                                  <ul className="amenities-set">
                                    <li>
                                      <span>
                                        <i
                                          className="fa fa-check-circle text-success me-2"
                                          aria-hidden="true"
                                        />
                                        Parking
                                      </span>
                                    </li>
                                    <li>
                                      <span>
                                        <i
                                          className="fa fa-check-circle text-success me-2"
                                          aria-hidden="true"
                                        />
                                        Drinking Water
                                      </span>
                                    </li>
                                    <li>
                                      <span>
                                        <i
                                          className="fa fa-check-circle text-success me-2"
                                          aria-hidden="true"
                                        />
                                        First Aid
                                      </span>
                                    </li>
                                    <li>
                                      <span>
                                        <i
                                          className="fa fa-check-circle text-success me-2"
                                          aria-hidden="true"
                                        />
                                        Change Room
                                      </span>
                                    </li>
                                    <li>
                                      <span>
                                        <i
                                          className="fa fa-check-circle text-success me-2"
                                          aria-hidden="true"
                                        />
                                        Shower
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4">
                              <h4 className="accordion-header">
                                <button
                                  className="accordion-button"
                                  type="button"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/includes1.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Includes
                                </button>
                              </h4>
                              <div className="accordion-collapse ">
                                <div className="accordion-body includes-set">
                                  <ul>
                                    <li>
                                      <i className="feather-check-square" />
                                      Badminton Racket Unlimited
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Bats
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Hitting Machines
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Multiple Courts
                                    </li>
                                  </ul>
                                  <ul>
                                    <li>
                                      <i className="feather-check-square" />
                                      Spare Players
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Instant Racket
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Hitting Machines
                                    </li>
                                    <li>
                                      <i className="feather-check-square" />
                                      Green Turfs
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item mb-4">
                              <h4 className="accordion-header">
                                <button
                                  className="accordion-button"
                                  type="button"
                                >
                                  <span className="icon-bg">
                                    <ImageWithBasePath
                                      src="assets/img/icons/gallery.svg"
                                      alt="Icon"
                                    />
                                  </span>{" "}
                                  Gallery
                                </button>
                              </h4>
                              <div className="accordion-collapse">
                                <div className="accordion-body">
                                  <div className="owl-carousel gallery-slider owl-theme">
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-18.jpg"
                                      />
                                    </div>
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-19.jpg"
                                      />
                                    </div>
                                    <div>
                                      <ImageWithBasePath
                                        className="img-fluid"
                                        alt="Image"
                                        src="assets/img/gallery/gallery4/gallery-20.jpg"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Accordian Contents */}
                        </div>
                        <div
                          className="tab-pane fade"
                          id="reviews1"
                          role="tabpanel"
                          aria-labelledby="reviews-tab1"
                        >
                          <div className="review-box review-box-user d-flex">
                            <div className="review-profile">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                            </div>
                            <div className="review-info">
                              <h6 className="mb-2 tittle">
                                Amanda Booked on 06/04/2023
                              </h6>
                              <div className="rating">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span className="">5.0</span>
                              </div>
                              <span className="success-text">
                                <i className="feather-check" />
                                Yes, I would book again.
                              </span>
                              <h6>Absolutely perfect</h6>
                              <p>
                                If you are looking for a perfect place for
                                friendly matches with your friends or a
                                competitive match, It is the best place.
                              </p>
                              <ul className="review-gallery">
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-01.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-01.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-02.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-02.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-03.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-03.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-04.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-04.jpg"
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="assets/img/gallery/gallery-05.jpg"
                                    data-fancybox="gallery"
                                  >
                                    <ImageWithBasePath
                                      className="img-fluid"
                                      alt="Image"
                                      src="assets/img/gallery/gallery-05.jpg"
                                    />
                                  </Link>
                                </li>
                              </ul>
                              <span className="post-date">
                                Sent on 11/03/2023
                              </span>
                            </div>
                          </div>
                          <div className="review-box review-box-user d-flex">
                            <div className="review-profile">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                className="img-fluid"
                                alt="User"
                              />
                            </div>
                            <div className="review-info">
                              <h6 className="mb-2 tittle">
                                Amanda Booked on 06/04/2023
                              </h6>
                              <div className="rating">
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <i className="fas fa-star filled" />
                                <span className="">5.0</span>
                              </div>
                              <h6>Awesome. Its very convenient to play.</h6>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry&apos;s standard dummy text ever
                                since the 1500s, when an unknown printer took a
                                galley of type and scrambled it to make a type
                                specimen book. It has survived not only five
                                centuries, but also the leap into electronic!!
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="previous1"
                          role="tabpanel"
                          aria-labelledby="previous-tab1"
                        >
                          <div className="preview-tab">
                            <ul>
                              <li>
                                <div className="preview-tabcontent">
                                  <div className="preview-tabimg">
                                    <ImageWithBasePath
                                      src="assets/img/featured/featured-05.jpg"
                                      alt="Venue"
                                    />
                                  </div>
                                  <div className="preview-tabname">
                                    <h4>Kevin Anderson</h4>
                                    <h5>Onetime</h5>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <h6>Date &amp; Time</h6>
                                <span className="d-block">Mon, Jul 11</span>
                                <span>06:00 PM - 08:00 PM</span>
                              </li>
                              <li>
                                <h6>$400</h6>
                              </li>
                            </ul>
                          </div>
                          <div className="preview-tab">
                            <ul>
                              <li>
                                <div className="preview-tabcontent">
                                  <div className="preview-tabimg">
                                    <ImageWithBasePath
                                      src="assets/img/featured/featured-06.jpg"
                                      alt="Venue"
                                    />
                                  </div>
                                  <div className="preview-tabname">
                                    <h4>Evon Raddick</h4>
                                    <h5>Onetime</h5>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <h6>Date &amp; Time</h6>
                                <span className="d-block">Mon, Jul 11</span>
                                <span>06:00 PM - 08:00 PM</span>
                              </li>
                              <li>
                                <h6>$300</h6>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Court Request */}
              </div>
            </div>
          </div>
        </div>
        {/* /profile Modal */}
      </>
    </div>
  );
};

export default UserOngoing;
