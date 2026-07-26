import React from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const ProfileOtherSetting = () => {
  const routes = all_routes;
  const location = useLocation();
  const isLinkActive = (route: string) => {
    // Check if the current location matches the given route
    return location.pathname === route;
  };
  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Other Settings</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Other Settings</li>
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
                      <Link to={routes.coachWallet}>
                        <ImageWithBasePath
                          src="assets/img/icons/wallet-icon.svg"
                          alt="Icon"
                        />
                        <span>Wallet</span>
                      </Link>
                    </li>
                    <li>
                      <Link to={routes.coachProfile} className="active">
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
            <div className="coach-court-list profile-court-list">
              <ul className="nav">
                <li>
                  <Link
                    to={routes.coachProfile}
                    className={isLinkActive(routes.coachProfile) ? "active" : ""}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={routes.settingLesson}
                    className={
                      isLinkActive(routes.settingLesson) ? "active" : ""
                    }
                  >
                    Lesson
                  </Link>
                </li>
                <li>
                  <Link
                    to={routes.settingAvalibilty}
                    className={
                      isLinkActive(routes.settingAvalibilty) ? "active" : ""
                    }
                  >
                    Availability
                  </Link>
                </li>
                <li>
                  <Link
                    to={routes.settingPassword}
                    className={
                      isLinkActive(routes.settingPassword) ? "active" : ""
                    }
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link
                    to={routes.profileOtherSetting}
                    className={
                      isLinkActive(routes.profileOtherSetting) ? "active" : ""
                    }
                  >
                    Other Settings
                  </Link>
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
                              type="text"
                              className="form-control"
                              id="password"
                              placeholder="Enter New Email Address"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="appoint-head">
                            <h4>Change Phone Number</h4>
                          </div>
                          <div className="input-space other-setting-form">
                            <label className="form-label">
                              New Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Enter New  Phone Number"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="deactivate-account-blk">
                            <div className="deactivate-detail">
                              <h4>Deactivate Account</h4>
                              <p>
                                Click delete button to deactivate the account
                              </p>
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
      </>
      <>
        {/* Deactive Modal */}
        <div
          className="modal custom-modal fade deactive-modal"
          id="deactive"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <Link to ="#"
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
                {/* Deactive Account */}
                <div className="account-deactive">
                  <ImageWithBasePath
                    src="assets/img/icons/deactive-profile.svg"
                    alt="Icon"
                  />
                  <h3>Are You Sure You Want to Deactive Account</h3>
                  <p>If yes please click “Yes” button</p>
                  <div className="convenient-btns">
                    <Link
                      to="#;"
                      data-bs-dismiss="modal"
                      className="btn btn-primary d-inline-flex align-items-center"
                    >
                      Yes{" "}
                      <span>
                        <i className="feather-arrow-right-circle ms-2" />
                      </span>
                    </Link>
                    <Link
                      to="#;"
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
                <Link to="#"
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
                {/* Deactive Account */}
                <div className="account-deactive">
                  <ImageWithBasePath
                    src="assets/img/icons/email-success.svg"
                    alt="Icon"
                  />
                  <h3>Email Changed Successfully</h3>
                  <p>Check your email on the confirmation</p>
                  <div className="convenient-btns">
                    <Link
                      to={routes.coachDashboard}
                      className="btn btn-primary d-inline-flex align-items-center me-0"
                    >
                      <span>
                        <i className="feather-arrow-left-circle me-2" />
                      </span>
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
                {/* /Deactive Account */}
              </div>
            </div>
          </div>
        </div>
        {/* /Deactive Modal */}
      </>
    </div>
  );
};

export default ProfileOtherSetting;
