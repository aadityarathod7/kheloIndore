import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import { userInvoiceData } from "../../core/data/json/user_invoice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { userInvoice } from "../../core/data/interface/model";

const UserInvoice = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");

  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];
  const statusOptions = [
    { name: "All Invoices" },
    { name: "Completed" },
    { name: "In Progress" },
  ];

  const [selectedSort, setSelectedSort] = useState();
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedStatus, setSelectedStatus] = useState();

  const filteredData = userInvoiceData.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });

  const idRender = (res: userInvoice) => {
    return (
      <Link to={routes.invoice} className="text-primary">
        {res.id}
      </Link>
    );
  };
  const courtNameRender = (res: userInvoice) => {
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

  const statusRender = (res: userInvoice) => {
    return (
      <span
        className={`${res.status === "Paid" ? "badge bg-success" : res.status === "Pending" ? "badge bg-info" : res.status === "Failed" ? "badge bg-danger" : ""}`}
      >
        <i className="feather-check-square me-1" />
        {res.status}
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
          <Link className="dropdown-item" to="#">
            <i className="feather-edit" />
            Write Review
          </Link>
          <Link className="dropdown-item" to="#">
            <i className="feather-trash" />
            Delete
          </Link>
        </div>
      </div>
    );
  };

  const dateTimeRender = (res: userInvoice) => {
    return (
      <h4>
        {res.date}
        <span>{res.time}</span>
      </h4>
    );
  };
  const paymentRender = (res: userInvoice) => {
    return <span className="pay-dark fs-16">{res.payment}</span>;
  };
  const downloadRender = () => {
    return (
      <Link to="#">
        <i className="feather-download" />
        Download
      </Link>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Invoice</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Invoice</li>
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
                    <Link to={routes.userInvoice} className="active">
                      <ImageWithBasePath
                        src="/assets/img/ico/ns/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userWallet}>
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
                            <Link className="active" to={routes.userInvoice}>
                              Courts
                            </Link>
                          </li>
                          <li>
                            <Link to={routes.userCoaches}>Coaches</Link>
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
                        <div className="col-md-5">
                          <div className="court-table-head">
                            <h4>Invoices</h4>
                            <p>
                              Access recent invoices related to court bookings
                            </p>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div className="table-search-top invoice-search-top">
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
                            <div className="request-coach-list select-filter">
                              <div className="sortby-filter-group court-sortby">
                                <div className="sortbyset m-0">
                                  <div className="sorting-select">
                                    <Dropdown
                                      value={selectedStatus}
                                      onChange={(e) =>
                                        setSelectedStatus(e.value)
                                      }
                                      options={statusOptions}
                                      optionLabel="name"
                                      placeholder="All Invoices"
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
                          field="id"
                          body={idRender}
                          header="ID"
                        ></Column>
                        <Column
                          sortable
                          field="courtName"
                          body={courtNameRender}
                          header="Court Name"
                        ></Column>
                        <Column
                          sortable
                          field="location"
                          className="table-date-time"
                          body={dateTimeRender}
                          header="Date & Time"
                        ></Column>
                        <Column
                          sortable
                          field="payment"
                          body={paymentRender}
                          header="Payment"
                        ></Column>
                        <Column
                          sortable
                          field="paidOn"
                          header="Paid On"
                        ></Column>
                        <Column
                          sortable
                          field="status"
                          header="Status"
                          body={statusRender}
                          className="table-inset-btn"
                        ></Column>
                        <Column
                          className="text-pink view-detail-pink"
                          sortable
                          field="download"
                          header="Download"
                          body={downloadRender}
                        ></Column>
                        <Column body={actionRender} header="Action"></Column>
                      </DataTable>
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

export default UserInvoice;
