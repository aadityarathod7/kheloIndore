import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const UserWallet = () => {
  const routes = all_routes;
  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Wallet</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Wallet</li>
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
                        src="/assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userBookings}>
                      <ImageWithBasePath
                        src="/assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>My Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userChat}>
                      <ImageWithBasePath
                        src="/assets/img/icons/chat-icon.svg"
                        alt="Icon"
                      />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userInvoice}>
                      <ImageWithBasePath
                        src="/assets/img/icons/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userWallet} className="active">
                      <ImageWithBasePath
                        src="/assets/img/icons/wallet-icon.svg"
                        alt="Icon"
                      />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userProfile}>
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
            {/* Wallet Balance */}
            <div className="col-md-12 col-lg-5 d-flex">
              <div className="wallet-wrap flex-fill">
                <div className="wallet-bal">
                  <div className="wallet-img">
                    <div className="wallet-amt">
                      <h5>Your Wallet Balance</h5>
                      <h2>$4,544</h2>
                    </div>
                  </div>
                  <div className="payment-btn">
                    <Link
                      to="#"
                      className="btn balance-add"
                      data-bs-toggle="modal"
                      data-bs-target="#add-payment"
                    >
                      Add Payment
                    </Link>
                  </div>
                </div>
                <ul>
                  <li>
                    <h6>Total Credit</h6>
                    <h3>$350.40</h3>
                  </li>
                  <li>
                    <h6>Total Debit</h6>
                    <h3>$50.40</h3>
                  </li>
                  <li>
                    <h6>Total transaction</h6>
                    <h3>$480.40</h3>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Wallet Balance */}
            {/* Wallet Card */}
            <div className="col-md-12 col-lg-7 d-flex">
              <div className="your-card">
                <div className="your-card-head">
                  <h3>Your Cards</h3>
                  <Link
                    to="#"
                    className="btn btn-secondary d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add-new-card"
                  >
                    Add New Card
                  </Link>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="debit-card-blk">
                      <div className="debit-card-balence">
                        <span>Debit card</span>
                        <h5>Balance in card : 1,234</h5>
                        <div className="card-number">
                          <h4>123145546655</h4>
                        </div>
                      </div>
                      <div className="debit-card-img">
                        <ImageWithBasePath
                          src="/assets/img/icons/visa-icon.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="debit-card-blk">
                      <div className="debit-card-balence">
                        <span>Debit card</span>
                        <h5>Balance in card : 1,234</h5>
                        <div className="card-number">
                          <h4>314555884554</h4>
                        </div>
                      </div>
                      <div className="debit-card-img">
                        <ImageWithBasePath
                          src="/assets/img/icons/master-card.svg"
                          alt="Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Wallet Card */}
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="court-tab-content">
                <div className="card card-tableset">
                  <div className="card-body">
                    <div className="coache-head-blk">
                      <div className="row align-items-center">
                        <div className="col-lg-5">
                          <div className="court-table-head">
                            <h4>Transaction</h4>
                            <p>
                              Reserve courts, buy equipment, and pay coaching
                              fees with just a few taps.
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-7">
                          <div className="table-search-top invoice-search-top">
                            <div id="tablefilter" />
                            <div className="sortby-section invoice-sort">
                              <div className="sorting-info">
                                <div className="sortby-filter-group court-sortby">
                                  <div className="sortbyset week-bg me-0">
                                    <div className="sorting-select">
                                      <select className="form-control select">
                                        <option>This Week</option>
                                        <option>One Day</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="request-coach-list select-filter">
                              <div className="sortby-filter-group court-sortby">
                                <div className="sortbyset m-0">
                                  <div className="sorting-select">
                                    <select className="form-control select">
                                      <option>All Transactions</option>
                                      <option>One Month</option>
                                      <option>Two Month</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive table-datatble">
                      <table className="table datatable">
                        <thead className="thead-light">
                          <tr>
                            <th>Ref ID</th>
                            <th>Transaction for</th>
                            <th>Date &amp; Time</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Link
                                to={routes.invoice}
                                className="text-primary"
                              >
                                #CO14
                              </Link>
                            </td>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/profiles/avatar-01.jpg"
                                    alt="User"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to="#">Kevin Anderson</Link>
                                </span>
                              </h2>
                            </td>
                            <td className="table-date-time">
                              <h4>
                                Mon, Jul 11<span>04:00 PM - 06:00 PM</span>
                              </h4>
                            </td>
                            <td>
                              <span className="pay-dark fs-16">$150</span>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                <i className="feather-check-square me-1" />
                                Paid
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
                                  <Link className="dropdown-item" to="#">
                                    <i className="feather-trash" />
                                    Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                to={routes.invoice}
                                className="text-primary"
                              >
                                #CO15
                              </Link>
                            </td>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/profiles/avatar-06.jpg"
                                    alt="User"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to="#">Angela Roudrigez</Link>
                                </span>
                              </h2>
                            </td>
                            <td className="table-date-time">
                              <h4>
                                Mon, Jul 11<span>01:00 PM - 04:00 PM</span>
                              </h4>
                            </td>
                            <td>
                              <span className="pay-dark fs-16">$200</span>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                <i className="feather-check-square me-1" />
                                Pending
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
                                  <Link className="dropdown-item" to="#">
                                    <i className="feather-trash" />
                                    Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                to={routes.invoice}
                                className="text-primary"
                              >
                                #CO16
                              </Link>
                            </td>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-03.jpg"
                                    alt="User"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to="#">Wing Sports Academy</Link>
                                </span>
                              </h2>
                            </td>
                            <td className="table-date-time">
                              <h4>
                                Mon, Jul 11<span>05:00 PM - 08:00 PM</span>
                              </h4>
                            </td>
                            <td>
                              <span className="pay-dark fs-16">$150</span>
                            </td>
                            <td>
                              <span className="badge bg-danger">
                                <i className="feather-check-square me-1" />
                                Failed
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
                                  <Link className="dropdown-item" to="#">
                                    <i className="feather-trash" />
                                    Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                to={routes.invoice}
                                className="text-primary"
                              >
                                #CO17
                              </Link>
                            </td>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/booking/booking-04.jpg"
                                    alt="User"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to="#">Feather Badminton</Link>
                                </span>
                              </h2>
                            </td>
                            <td className="table-date-time">
                              <h4>
                                Mon, Jul 11<span>01:00 PM - 04:00 PM</span>
                              </h4>
                            </td>
                            <td>
                              <span className="pay-dark fs-16">$90</span>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                <i className="feather-check-square me-1" />
                                Paid
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
                                  <Link className="dropdown-item" to="#">
                                    <i className="feather-trash" />
                                    Delete
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Link
                                to={routes.invoice}
                                className="text-primary"
                              >
                                #CO18
                              </Link>
                            </td>
                            <td>
                              <h2 className="table-avatar">
                                <Link
                                  to="#"
                                  className="avatar avatar-sm flex-shrink-0"
                                >
                                  <ImageWithBasePath
                                    className="avatar-img"
                                    src="/assets/img/profiles/avatar-07.jpg"
                                    alt="User"
                                  />
                                </Link>
                                <span className="table-head-name flex-grow-1">
                                  <Link to="#">Pete Hill</Link>
                                </span>
                              </h2>
                            </td>
                            <td className="table-date-time">
                              <h4>
                                Mon, Jul 11<span>03:00 PM - 08:00 PM</span>
                              </h4>
                            </td>
                            <td>
                              <span className="pay-dark fs-16">$180</span>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                <i className="feather-check-square me-1" />
                                Paid
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
                                  <Link className="dropdown-item" to="#">
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
    </div>
  );
};

export default UserWallet;
