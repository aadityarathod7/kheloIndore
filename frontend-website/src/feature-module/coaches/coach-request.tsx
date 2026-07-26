import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import { coachRequests } from "../../core/data/interface/model";
import { coachRequest } from "../../core/data/json/coach_request";
import { all_routes } from "../router/all_routes";

const CoachRequest = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedSort, setSelectedSort] = useState();
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];
  const sortOptions = [
    { name: "All Transactions" },
    { name: "This Week" },
    { name: "One Day" },
  ];

  const filteredData = coachRequest.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });
  const courtNameRender = (res: coachRequests) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img1} alt="User" />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#">{res.courtName}</Link>
          <span>{res.courtNo}</span>
        </span>
      </h2>
    );
  };
  const courtPlayerRender = (res: coachRequests) => {
    return (
      <h2 className="table-avatar">
        <Link to={routes.myProfile} className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img2} alt="User" />
        </Link>
        <span className="table-head-name table-name-user flex-grow-1">
          <Link to={routes.myProfile}>{res.playerName}</Link>
        </span>
      </h2>
    );
  };
  const courtdateRender = (res: coachRequests) => {
    return (
      <td className="table-date-time">
        <h4>
          {res.date}
          <span>{res.time}</span>
        </h4>
      </td>
    );
  };
  const courtstatusRender = () => {
    return (
      <td className="paid-edit">
        <span>
          <i className="feather-edit"></i>Paid
        </span>
      </td>
    );
  };
  const courtStatusRender = () => {
    return (
      <td className="table-accept-btn text-end">
        <Link to="#" className="btn accept-btn">
          <i className="feather-check-circle"></i>Accept
        </Link>
        <Link
          to="#"
          className="btn cancel-table-btn"
          data-bs-toggle="modal"
          data-bs-target="#request-reject"
        >
          <i className="feather-x-circle"></i>Cancel
        </Link>
      </td>
    );
  };

  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Requests</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Requests</li>
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
                      <Link to={routes.coachRequest} className="active">
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
                      <Link to={routes.coachProfile}>
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
            {/* Sort By */}
            <div className="row">
              <div className="col-lg-12">
                <div className="sortby-section court-sortby-section">
                  <div className="sorting-info">
                    <div className="row d-flex align-items-center">
                      <div className="col-xl-12 col-sm-12 col-auto">
                        <div className="sortby-filter-group court-sortby">
                          <div className="sortbyset week-bg">
                            <div className="sorting-select">
                            <Dropdown
                                          value={selectedTimeframe}
                                          onChange={(e) =>
                                            setSelectedTimeframe(e.value)
                                          }
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
                                        onChange={(e) =>
                                          setSelectedSort(e.value)
                                        }
                                        options={sortOptions}
                                        optionLabel="name"
                                        placeholder="All Transaction"
                                        className="select custom-select-list"
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
                              <h4>Requests</h4>
                              <p>
                                Efficiently manage and respond to booking
                                requests
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
                                    onChange={(e) =>
                                      setSearchInput(e.target.value)
                                    }
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
                                field="playerName"
                                body={courtPlayerRender}
                                header="Player Name"
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                body={courtdateRender}
                                header="Date&Time"
                              ></Column>
                              <Column
                                sortable
                                field="additionalGuests"
                                header="Additional Guests"
                              ></Column>
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              ></Column>
                              <Column
                                sortable
                                field="status"
                                body={courtstatusRender}
                                header="Status"
                                className="table-inset-btn"
                              ></Column>
                              <Column body={courtStatusRender}></Column>
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
                              paginator
                              rows={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              currentPageReportTemplate="{first}"
                            >
                              
                              <Column
                                sortable
                                field="playerName"
                                body={courtPlayerRender}
                                header="Player Name"
                              ></Column>
                              <Column
                                sortable
                                field="date"
                                body={courtdateRender}
                                header="Date&Time"
                              ></Column>
                              <Column
                                sortable
                                field="additionalGuests"
                                header="Additional Guests"
                              ></Column>
                              <Column
                                sortable
                                field="payment"
                                header="Payment"
                              ></Column>
                              <Column
                                sortable
                                field="status"
                                body={courtstatusRender}
                                header="Status"
                                className="table-inset-btn"
                              ></Column>
                              <Column body={courtStatusRender}></Column>
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
    </div>
  );
};

export default CoachRequest;
