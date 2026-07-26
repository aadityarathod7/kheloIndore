import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { userCoachesData } from "../../core/data/json/user_coaches";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { Dropdown } from "primereact/dropdown";
import { userCoaches } from "../../core/data/interface/model";

const UserCoaches = () => {
  const routes = all_routes;
  const [selectedHours7, setSelectedHours7] = useState();
  const [sortby, setSortby] = useState();
  const [selectedStatus, setSelectedStatus] = useState();

  const hoursOptions7 = [{ name: "This Week" }, { name: "One Day" }];
  const relevence = [{ name: "Revelence" }, { name: "Price" }];
  const statusOptions = [
    { name: "All Invoices" },
    { name: "Completed" },
    { name: "In Progress" },
  ];

  //filter function
  const [searchInput, setSearchInput] = useState("");
  const filteredData = userCoachesData.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });
  const Render = () => {
    return (
      <td className="table-accept-btn text-end">
        <Link to="#" className="badge bg-info">
          <i className="feather-check-circle me-1"></i>Accepted
        </Link>
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
  const renderCoachName = (res: userCoaches) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm  flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img} alt="User" />
        </Link>
        <span className="table-head-name flex-grow-1">
          <Link to="#">{res.coachName}</Link>
          <span className="book-active">{res.bookedOn}</span>
        </span>
      </h2>
    );
  };
  const dataandTime = (res: userCoaches) => {
    return (
      <div className="table-date-time">
        <span>
          <Link to="#">{res.dateAndTime}</Link>
          <span className="book-active">{res.time}</span>
        </span>
      </div>
    );
  };
  return (
    <>
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
                        src="assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userBookings}>
                      <ImageWithBasePath src="assets/img/icons/booking-icon.svg" alt="Icon" />
                      <span>My Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userChat}>
                      <ImageWithBasePath src="assets/img/icons/chat-icon.svg" alt="Icon" />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userInvoice} className="active">
                      <ImageWithBasePath src="assets/img/icons/invoice-icon.svg" alt="Icon" />
                      <span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userWallet}>
                      <ImageWithBasePath src="assets/img/icons/wallet-icon.svg" alt="Icon" />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userProfile}>
                      <ImageWithBasePath src="assets/img/icons/profile-icon.svg" alt="Icon" />
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
                            <Link to={routes.userInvoice}>Courts</Link>
                          </li>
                          <li>
                            <Link className="active" to={routes.userCoaches}>
                              Coaches
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-sm-12 col-12">
                      <div className="sortby-filter-group court-sortby">
                        <div className="sortbyset week-bg">
                          <div className="sorting-select">
                            <Dropdown
                              value={selectedHours7}
                              onChange={(e) => setSelectedHours7(e.value)}
                              options={hoursOptions7}
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
                              value={sortby}
                              onChange={(e) => setSortby(e.value)}
                              options={relevence}
                              optionLabel="name"
                              placeholder="Relevance"
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
                        <div className="col-md-5">
                          <div className="court-table-head">
                            <h4>Invoices</h4>
                            <p>Easy Access to Your Billing History</p>
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
                          className="text-primary"
                          field="id"
                          header="ID"
                        ></Column>
                        <Column
                          sortable
                          field="coachName"
                          header="Coach Name"
                          body={renderCoachName}
                        ></Column>
                        <Column
                          sortable
                          field="invoice"
                          header="Invoice"
                        ></Column>
                        <Column
                          sortable
                          field="dateAndTime"
                          header="Date&Time"
                          body={dataandTime}
                        ></Column>
                        <Column
                          sortable
                          field="payment"
                          header="Payment"
                        ></Column>
                        <Column
                          sortable
                          field="paidon"
                          header="Paid On"
                        ></Column>

                        <Column
                          sortable
                          field="status"
                          header="Status"
                          body={Render}
                          className="table-inset-btn"
                        ></Column>
                        <Column body={actionRender} header="Action"></Column>
                      </DataTable>
                      <Column
                        sortable
                        field="download"
                        header="Download"
                      ></Column>
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

export default UserCoaches;
