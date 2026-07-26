import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { coachEarningData } from "../../core/data/json/coach_earning";
import { coachEarning } from "../../core/data/interface/model";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { all_routes } from "../router/all_routes";

const CoachEarning = () => {
  const routes = all_routes;
  const [selectedSort, setSelectedSort] = useState();
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedStatus, setSelectedStatus] = useState();

  const sortOptions = [{ name: "Relevance" }, { name: "Price" }];
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];
  const statusOptions = [
    { name: "All Invoices" },
    { name: "Completed" },
    { name: "In Progress" },
  ];


  const [searchInput, setSearchInput] = useState("");


  const optionsBar = {
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: "#6F42C1",
            },
            {
              from: 101,
              to: 200,
              color: "#333333",
            },
          ],
        },
        horizontal: false,
        barHeight: "80%",
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    series: [
      {
        name: "Series 1",
        color: "#AAF40C",
        data: [420, 532, 516, 575, 519, 517, 454, 392, 262, 383, 446, 551],
      },
      {
        name: "Series 2",
        color: "#097E52",
        data: [336, 612, 344, 647, 345, 563, 256, 344, 323, 300, 455, 456],
      },
    ],
    xaxis: {},
    yaxis: {
      labels: {
        style: {
          colors: "#777",
        },
      },
      tickAmount: 4,
      min: 0,
      max: 800,
    },
    title: {
      text: "",
      align: "left",
      style: {
        fontSize: "18px",
      },
    },
  };  

  const filteredData = coachEarningData.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });

  const courtNameRender = (res: coachEarning) => {
    return (
      <h2 className="table-avatar">
      <Link to="#" className="avatar avatar-sm flex-shrink-0"><ImageWithBasePath className="avatar-img" src={res.img1} alt="User" /></Link>
      <span className="table-head-name flex-grow-1">
        <Link to="#">{res.courtName}</Link>
        <span>{res.courtNo} <span className="book-on-date">{res.bookingDate}</span></span>
      </span>
    </h2>
    );
  };
  const actionRender = () => {
    return (
      <div className="dropdown dropdown-action table-drop-action">
        <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-ellipsis-h" /></Link>
        <div className="dropdown-menu dropdown-menu-end">
          <Link className="dropdown-item" to="#"><i className="feather-edit" />Edit</Link>
          <Link className="dropdown-item" to="#"><i className="feather-trash" />Delete</Link>
        </div>
      </div>
    );
  };
  const playerNameRender = (res: coachEarning) => {
    return (
      <h2 className="table-avatar">
        <Link to={routes.myProfile} className="avatar avatar-sm flex-shrink-0"><ImageWithBasePath className="avatar-img" src={res.img2} alt="User" /></Link>
        <span className="table-head-name table-name-user flex-grow-1">
          <Link to={routes.myProfile}>{res.playerName}</Link>
        </span>
      </h2>
    );
  };
  const dateTimeRender = (res: coachEarning) => {
    return (
      <h4>{res.dateTime1}<span>{res.dateTime2}</span></h4>
    );
  };
  const paymentRender = (res: coachEarning) => {
    return (
      <span className="pay-dark">{res.payment}</span>
    );
  };
  const downloadRender = (res: coachEarning) => {
    return (
      <Link to="#"><i className="feather-download" />{res.download}</Link>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Earnings</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Earnings</li>
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
                    <Link to={routes.coachEarning} className="active">
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
                            <Link className="active" to={routes.coachEarning}>
                              Court
                            </Link>
                          </li>
                          <li>
                            <Link to={routes.earningCoaching}>Coaching</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-sm-12 col-12">
                      <div className="sortby-filter-group">
                        <div className="sortbyset">
                          <span className="sortbytitle">Sort By</span>
                          <div className="sorting-select">
                            <Dropdown
                              value={selectedSort}
                              onChange={(e) => setSelectedSort(e.value)}
                              options={sortOptions}
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
            <div className="col-md-12 col-lg-12">
              {/* Chart */}
              <div className="card card-chart-blk">
                <div className="coache-head-blk">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="court-table-head">
                        <h4>Invoices</h4>
                        <p>Effortlessly manage court booking earnings</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="sortby-section invoice-sort">
                        <div className="sorting-info">
                          <div className="sortby-filter-group court-sortby">
                            <div className="sortbyset week-bg me-0">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                <div id="bar">
                    <ReactApexChart
                      options={optionsBar}
                      series={optionsBar.series}
                      type="bar"
                      height={350}
                      width="100%"
                    />
                  </div>
                </div>
              </div>
              {/* /Chart */}
            </div>
          </div>
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
                              Lorem Ipsum is simply dummy text of the printing
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
                              onChange={(e) => setSearchInput(e.target.value)}
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
                    <div className="table-responsive">
                    <DataTable className="table table-borderless datatable" value={filteredData} paginator rows={10} rowsPerPageOptions={[10, 25, 50]} currentPageReportTemplate="{first}">
                        <Column sortable field="courtName" body={courtNameRender} header="Court Name"></Column>
                        <Column sortable field="playerName" body={playerNameRender} header="Player Name"></Column>
                        <Column sortable field="Date & Time" header="Date & Time" body={dateTimeRender} className="table-date-time"></Column>
                        <Column sortable field="Payment" header="Payment" body={paymentRender}></Column>
                        <Column sortable field="additionalGuests" header="Additional Guests"></Column>
                        <Column sortable field="paidOn" header="Paid On" ></Column>
                        <Column sortable field="download" header="Download" className="text-pink view-detail-pink" body={downloadRender}></Column>
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

export default CoachEarning;
