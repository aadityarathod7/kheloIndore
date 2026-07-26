import React from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const SettingPassword = () => {
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
            <h1 className="text-white">Change Password</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Change Password</li>
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
                    <Link to={routes.coachEarning} >
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
                        <div className="col-lg-7 col-md-7">
                          <div className="input-space">
                            <label className="form-label">Old Password</label>
                            <input
                              type="text"
                              className="form-control"
                              id="password"
                              placeholder="Enter Old Password"
                            />
                          </div>
                        </div>
                        <div className="col-lg-7 col-md-7">
                          <div className="input-space">
                            <label className="form-label">New Password</label>
                            <input
                              type="text"
                              className="form-control"
                              id="new-password"
                              placeholder="Enter New Password"
                            />
                          </div>
                        </div>
                        <div className="col-lg-7 col-md-7">
                          <div className="input-space mb-0">
                            <label className="form-label">
                              Confirm Password
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="confirm-password"
                              placeholder="Enter Confirm Password"
                            />
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
    </div>
  );
};

export default SettingPassword;
