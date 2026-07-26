import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const UserSettingPassword = () => {
    const routes = all_routes
  return (
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
                  <Link to={routes.userProfile}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={routes.userSettingPassword} className="active">Change Password</Link>
                </li>
                <li>
                  <Link to={routes.userProfileOtherSetting}>Other Settings</Link>
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
                          <label className="form-label">Confirm Password</label>
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
  );
};

export default UserSettingPassword;
