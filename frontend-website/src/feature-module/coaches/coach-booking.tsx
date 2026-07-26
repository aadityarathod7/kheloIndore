import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { coachBookingdataOne } from "../../core/data/json/coaches_bookingdata1";
import { all_routes } from "../router/all_routes";

const CoachBooking = () => {
  const [selectedSort, setSelectedSort] = useState();
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [searchInput, setSearchInput] = useState("");

  const routes = all_routes;

  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];

  const filteredData = coachBookingdataOne.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );

    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });

  const courtNameRender = (res) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath
            className="avatar-img"
            src={res.courtImg}
            alt="User"
          />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#">{res.courtName}</Link>
          <span>
            Court 1{" "}
            <span className="book-on-date">Booked on : {res.bookedOn}</span>
          </span>
        </span>
      </h2>
    );
  };

  const PlayerName = (res) => {
    return (
      <h2 className="table-avatar">
        <Link to={routes.myProfile} className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath
            className="avatar-img"
            src={res.playerImg}
            alt="User"
          />
        </Link>
        <span className="table-head-name table-name-user flex-grow-1">
          <Link to={routes.myProfile}>{res.playerName}</Link>
        </span>
      </h2>
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
  const Details = (res) => {
    return (
      <div className="text-pink view-detail-pink">
        <Link to="#" data-bs-toggle="modal" data-bs-target="#upcoming-court">
          <i className="feather-eye" />
          {res.Details}
        </Link>
      </div>
    );
  };
  const DetailsTwo = (res) => {
    return (
      <div className="text-pink view-detail-pink">
        <Link to="#" data-bs-toggle="modal" data-bs-target="#upcoming-coach">
          <i className="feather-eye" />
          {res.Details}
        </Link>
      </div>
    );
  };
  const Chat = () => {
    return (
      <div>
        <ImageWithBasePath
          src="assets/img/icons/chat-icon-01.svg"
          className="me-1"
          alt="Icon"
        />
        Chat
      </div>
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
  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Bookings</h1>
          <ul>
            <li>
              <Link to="index">Home</Link>
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
                    <Link to={routes.allCourt} className="active">
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
                    <Link to={routes.coachBooking}>
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
                            <Link className="active" to="coach-booking">
                              Upcoming
                            </Link>
                          </li>
                          <li>
                            <Link to="booking-completed">Completed</Link>
                          </li>
                          <li>
                            <Link to="booking-cancelled">Cancelled</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-sm-12 col-12">
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
                        <div className="col-md-6">
                          <div className="court-table-head">
                            <h4>Bookings</h4>
                            <p>
                              Effortlessly track and manage your completed
                              bookings
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
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
                            className="table datatable"
                            value={filteredData}
                          >
                            <Column
                              sortable
                              field="courtName"
                              body={courtNameRender}
                              header="Court Name"
                            ></Column>
                            <Column
                              sortable
                              field="playerName"
                              body={PlayerName}
                              header="Player Name"
                            ></Column>
                            <Column
                              sortable
                              field="dateTime"
                              body={DateTime}
                              header="Date & Time"
                            ></Column>
                            <Column
                              sortable
                              field="additionalGuests"
                              header="Additional Guests"
                            ></Column>
                            <Column
                              sortable
                              field="Payment"
                              header="Payment"
                            ></Column>
                            <Column
                              sortable
                              field="Details"
                              body={Details}
                              header="Details"
                            ></Column>
                            <Column
                              sortable
                              field="Details"
                              body={Chat}
                              header="Details"
                            ></Column>

                            <Column
                              body={actionRender}
                              header="Action"
                            ></Column>
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
                            className="table datatable"
                            value={filteredData}
                          >
                            <Column
                              sortable
                              field="courtName"
                              body={courtNameRender}
                              header="Court Name"
                            ></Column>
                            <Column
                              sortable
                              field="playerName"
                              body={PlayerName}
                              header="Player Name"
                            ></Column>
                            <Column
                              sortable
                              field="dateTime"
                              body={DateTime}
                              header="Date & Time"
                            ></Column>
                            <Column
                              sortable
                              field="additionalGuests"
                              header="Additional Guests"
                            ></Column>
                            <Column
                              sortable
                              field="Payment"
                              header="Payment"
                            ></Column>
                            <Column
                              sortable
                              field="Details"
                              body={DetailsTwo}
                              header="Details"
                            ></Column>
                            <Column
                              sortable
                              field="Details"
                              body={Chat}
                              header="Details"
                            ></Column>

                            <Column
                              body={actionRender}
                              header="Action"
                            ></Column>
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

      <div>
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
                            <p className="text-primary fw-semibold fs-16">
                              $200.00 / hr
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
                            <p>Single Lesson</p>
                            <p>
                              3 Days * 1 hour @{" "}
                              <span className="text-primary">$150.00</span>
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
                            <h6>Service Charge</h6>
                            <p>$20</p>
                          </li>
                          <li>
                            <h6>Total Amount Paid</h6>
                            <p className="text-primary fs-16">$420</p>
                          </li>
                        </ul>
                      </div>
                      <div className="appointment-info appoin-border ">
                        <ul className="appointmentset">
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
                            <p>Visa Card</p>
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
      </div>
    </div>
  );
};

export default CoachBooking;
