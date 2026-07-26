import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { coachWallet } from "../../core/data/json/coach_wallet";
import { coachWallets } from "../../core/data/interface/model";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const CoachWallet = () => {
  const routes = all_routes;
  const [searchInput, setSearchInput] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedSort, setSelectedSort] = useState();
  const filteredData = coachWallet.filter((datas) => {
    const values = Object.values(datas).map((value) =>
      value.toString().toLowerCase()
    );
    return values.some((value) => value.includes(searchInput.toLowerCase()));
  });
  const courtNameRender = (res: coachWallets) => {
    return (
      <td>
        <Link to={routes.invoice} className="text-primary">
          {res.refID}
        </Link>
      </td>
    );
  };
  const courtTransactionRender = (res: coachWallets) => {
    return (
      <h2 className="table-avatar">
        <Link to="#" className="avatar avatar-sm flex-shrink-0">
          <ImageWithBasePath className="avatar-img" src={res.img} alt="User" />
        </Link>
        <span className="table-head-name table-name-user flex-grow-1">
          <Link to="#">{res.transactionFor}</Link>
        </span>
      </h2>
    );
  };
  const courtdateRender = (res: coachWallets) => {
    return (
      <td className="table-date-time">
        <h4>
          {res.date}
          <span>{res.time}</span>
        </h4>
      </td>
    );
  };
  const courtstatusRender = (res: coachWallets) => {
    return (
      <td>
        <span
          className={`badge ${
            res.status === "Paid"
              ? "bg-success"
              : res.status === "Pending"
                ? "bg-info"
                : res.status === "Failed"
                  ? "bg-danger"
                  : "" // Add a default class or leave it empty for other statuses
          }`}
        >
          <i className="feather-check-square me-1"></i>
          {res.status}
        </span>
      </td>
    );
  };
  const courtActionRender = () => {
    return (
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
            <Link className="dropdown-item" to="#">
              <i className="feather-briefcase"></i>Refund
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="feather-trash"></i>Delete
            </Link>
          </div>
        </div>
      </td>
    );
  };
  const [checkboxes, setCheckboxes] = useState([
    { id: "value", label: "Add Value 1", price: "$80", checked: false },
    { id: "value1", label: "Add Value 2", price: "$60", checked: false },
    { id: "value2", label: "Add Value 3", price: "$120", checked: false },
    { id: "value3", label: "Add Value 4", price: "$120", checked: false },
  ]);
  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];
  const sortOptions = [
    { name: "All Transactions" },
    { name: "This Week" },
    { name: "One Day" },
  ];

  return (
    <div>
      <>
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
                      <Link to={routes.coachEarning}>
                        <ImageWithBasePath
                          src="assets/img/icons/invoice-icon.svg"
                          alt="Icon"
                        />
                        <span>Earnings</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachWallet} className="active">
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
                      <Link to="#" className="btn btn-transfer">
                        Transfer
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
                        src="assets/img/icons/visa-icon.svg"
                        alt="Icon"
                      />
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
                                Digital wallets facilitate secure payments for
                                coaching services.
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-7">
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
                              <div className="request-coach-list select-filter">
                                <div className="sortby-filter-group court-sortby">
                                  <div className="sortbyset m-0">
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
                            field="refID"
                            body={courtNameRender}
                            header="RefID"
                          ></Column>
                          <Column
                            sortable
                            field="transactionFor"
                            body={courtTransactionRender}
                            header="Transaction For"
                          ></Column>
                          <Column
                            sortable
                            field="date"
                            body={courtdateRender}
                            header="Date&Time"
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
                          <Column body={courtActionRender}></Column>
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
        <>
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
                        {checkboxes.map((checkbox) => (
                          <li
                            key={checkbox.id}
                            className={checkbox.checked ? "active" : ""}
                          >
                            <div className="add-wallet-checkbox">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={checkbox.id}
                                checked={checkbox.checked}
                                onChange={() =>
                                  handleCheckboxChange(checkbox.id)
                                }
                              />
                              <label htmlFor={checkbox.id}>
                                {checkbox.label}
                              </label>
                            </div>
                            <div className="add-wallet-price">
                              <span>+ {checkbox.price}</span>
                            </div>
                          </li>
                        ))}
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
                        <div className="form-check form-check-inline mb-3">
                          <input
                            className="form-check-input default-check me-1"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio4"
                            defaultValue="Paypal"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio4"
                          >
                            Paypal
                          </label>
                        </div>
                        <div className="form-check form-check-inline mb-0">
                          <input
                            className="form-check-input default-check me-1"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio5"
                            defaultValue="Paypal"
                            defaultChecked=""
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio5"
                          >
                            Wallet
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
          {/* Add new Modal */}
          <div
            className="modal custom-modal fade payment-modal"
            id="add-new-card"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="form-header modal-header-title">
                    <h4 className="mb-0">Add New Card</h4>
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
                  <form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="input-space">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="CardNumber"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-space">
                          <label className="form-label">
                            Name On Card Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Sport"
                          />
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="input-space">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="06/2023"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-space">
                          <label className="form-label">CVV </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-check policy d-flex align-items-center">
                          <div className="d-inline-block">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="policy"
                            />
                          </div>
                          <label className="form-check-label" htmlFor="policy">
                            Save for Next Payment
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <div className="table-accept-btn">
                    <Link to="#" className="btn btn-secondary">
                      Reset
                    </Link>
                    <Link to="#" className="btn btn-primary">
                      Submit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Add new Modal */}
        </>
      </>
    </div>
  );
};

export default CoachWallet;
