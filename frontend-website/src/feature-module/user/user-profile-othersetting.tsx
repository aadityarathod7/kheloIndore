import React from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const UserProfileOtherSetting = () => {
    const routes = all_routes
  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">User Profile</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>User Profile</li>
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
                    <Link to={routes.userInvoice}>
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
                    <Link to={routes.userProfile} className="active">
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
          <div className="coach-court-list profile-court-list">
          <ul className="nav">
                <li>
                  <Link  to={routes.userProfile}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={routes.userSettingPassword}>Change Password</Link>
                </li>
                <li>
                  <Link to={routes.userProfileOtherSetting} className="active">Other Settings</Link>
                </li>
              </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="card ">
                  <form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="appoint-head">
                          <h4>Change Email</h4>
                        </div>
                        <div className="input-space other-setting-form">
                          <label className="form-label">
                            {" "}
                            Enter New Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter New Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="appoint-head">
                          <h4>Change Phone Number</h4>
                        </div>
                        <div className="input-space other-setting-form">
                          <label className="form-label">New Phone Number</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter New  Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="deactivate-account-blk">
                          <div className="deactivate-detail">
                            <h4>Deactivate Account</h4>
                            <p>Click delete button to deactivate the account</p>
                          </div>
                          <Link
                            to="#"
                            className="btn deactive-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#deactive"
                          >
                            <i className="feather-zap-off" />
                            Deactive Account
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="save-changes text-end">
                  <Link
                    to="#"
                    className="btn btn-primary reset-profile"
                  >
                    Reset
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-secondary save-profile"
                    data-bs-toggle="modal"
                    data-bs-target="#success-mail"
                  >
                    Save Change
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Deactive Modal */}
      <div
        className="modal custom-modal fade deactive-modal"
        id="deactive"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <Link to="#"className="close" data-bs-dismiss="modal" aria-label="Close">
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Deactive Account */}
              <div className="account-deactive">
                <ImageWithBasePath src="assets/img/icons/deactive-profile.svg" alt="Icon" />
                <h3>Are You Sure You Want to Deactive Account</h3>
                <p>If yes please click “Yes” button</p>
                <div className="convenient-btns">
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-primary d-inline-flex align-items-center"
                  >
                    Yes{" "}
                    <span>
                      <i className="feather-arrow-right-circle ms-2" />
                    </span>
                  </Link>
                  <Link
                    to="#"
                    data-bs-dismiss="modal"
                    className="btn btn-secondary d-inline-flex align-items-center"
                  >
                    No{" "}
                    <span>
                      <i className="feather-arrow-right-circle ms-2" />
                    </span>
                  </Link>
                </div>
              </div>
              {/* /Deactive Account */}
            </div>
          </div>
        </div>
      </div>
      {/* /Deactive Modal */}
      {/* Email Success */}
      <div
        className="modal custom-modal fade deactive-modal"
        id="success-mail"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <Link to = "#"className="close" data-bs-dismiss="modal" aria-label="Close">
                <span className="align-center" aria-hidden="true">
                  <i className="feather-x" />
                </span>
              </Link>
            </div>
            <div className="modal-body">
              {/* Deactive Account */}
              <div className="account-deactive">
                <ImageWithBasePath src="assets/img/icons/email-success.svg" alt="Icon" />
                <h3>Email Changed Successfully</h3>
                <p>Check your email on the confirmation</p>
                <div className="convenient-btns">
                  <Link
                    to="#"
                    className="btn btn-primary d-inline-flex align-items-center me-0"
                  >
                    <span>
                      <i className="feather-arrow-left-circle me-2" />
                    </span>
                    Back to Dashboard
                  </Link>
                </div>
              </div>
              {/* /Email Success */}
            </div>
          </div>
        </div>
      </div>
      {/* /Deactive Modal */}
    </>
  );
};

export default UserProfileOtherSetting;
