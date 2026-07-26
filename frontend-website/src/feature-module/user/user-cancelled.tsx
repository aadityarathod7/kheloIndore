import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { usercancelleddata } from "../../core/data/json/user_cancelledata";
import { Dropdown } from "primereact/dropdown";

const UserCancelled = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [days, setDays] = useState();
  const [price, setPrice] = useState();

  const day = [{ name: "This Week" }, { name: "One Day" }];
  const sortby = [{ name: "Relevance" }, { name: "Price" }];
  

  const filteredData = usercancelleddata.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });
  const courtNameRender = (res: userCancelledInterface) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img} alt="User" />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#">{res.courtName}</Link>
          <span>{res.courtNo}</span>
        </span>
      </h2>
    );
  };

  const Render = () => {
    return (
      <span className="badge bg-danger">
        <ImageWithBasePath
          src="assets/img/icons/delete.svg"
          alt="Icon"
          className="me-1"
        />
        Cancelled
      </span>
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
          <Link
            className="dropdown-item"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#cancel-court"
          >
            <i className="feather-briefcase"></i>Refund
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
                            <Link to={routes.userOngoing}>On Going</Link>
                          </li>
                          <li>
                            <Link className="active" to={routes.userCancelled}>
                              Cancelled
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-sm-12 col-12">
                      <div className="sortby-filter-group court-sortby">
                        <div className="sortbyset week-bg">
                          <div className="sorting-select">
                            <span className="select-icon">
                              <ImageWithBasePath
                                src="assets/img/icons/calendar-icon.svg"
                                alt="Icon"
                              />
                            </span>
                            <Dropdown
                              value={days}
                              onChange={(e) => setDays(e.value)}
                              options={day}
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
                              value={price}
                              onChange={(e) => setPrice(e.value)}
                              options={sortby}
                              optionLabel="name"
                              placeholder="Relevance"
                              className="select-bg w-100"
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
                              Track and manage your cancelled court bookings
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
                            <div className="request-coach-list">
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
                              field="courtName"
                              header="Court Name"
                              body={courtNameRender}
                            ></Column>
                            <Column
                              sortable
                              field="dateandTime"
                              header="Data & Time"
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
                              body={Render}
                              className="table-inset-btn"
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
                        <div className="table-responsive table-datatble">
                          <table className="table  datatable">
                            <thead className="thead-light">
                              <tr>
                                <th>Coach Name</th>
                                <th>Booking Type</th>
                                <th>Date &amp; Time</th>
                                <th>Payment</th>
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
                                      className="avatar avatar-sm flex-shrink-0"
                                    >
                                      <ImageWithBasePath
                                        className="avatar-img"
                                        src="assets/img/featured/featured-05.jpg"
                                        alt="User"
                                      />
                                    </Link>
                                    <span className="table-head-name flex-grow-1">
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#cancel-coach"
                                      >
                                        Kevin Anderson
                                      </Link>
                                      <span className="book-active">
                                        Booked on : 25 May 2023
                                      </span>
                                    </span>
                                  </h2>
                                </td>
                                <td>Onetime</td>
                                <td className="table-date-time">
                                  <h4>
                                    Mon, Jul 11<span>06:00 PM - 08:00 PM</span>
                                  </h4>
                                </td>
                                <td>
                                  <span className="pay-dark fs-16">$150</span>
                                </td>
                                <td>
                                  <span className="badge bg-danger">
                                    <ImageWithBasePath
                                      src="assets/img/icons/delete.svg"
                                      alt="Icon"
                                      className="me-1"
                                    />
                                    Cancelled
                                  </span>
                                </td>
                                <td className="text-end">
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
                                      <Link
                                        className="dropdown-item"
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#cancel-coach-modal"
                                      >
                                        <i className="feather-briefcase" />
                                        Refund
                                      </Link>
                                      <Link
                                        className="dropdown-item"
                                        to="#"
                                      >
                                        <i className="feather-trash" />
                                        Delete
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
  );
};

export default UserCancelled;
