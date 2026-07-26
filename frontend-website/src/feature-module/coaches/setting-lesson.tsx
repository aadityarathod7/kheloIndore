import React from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";

const SettingLesson = () => {
  const route = all_routes;
  const location = useLocation();
  const isLinkActive = (route: string) => {
    // Check if the current location matches the given route
    return location.pathname === route;
  };
  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Lesson</h1>
          <ul>
            <li>
              <Link to={route.home}>Home</Link>
            </li>
            <li>Lesson</li>
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
                    <Link to={route.coachDashboard}>
                      <ImageWithBasePath
                        src="assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.allCourt}>
                      <ImageWithBasePath
                        src="assets/img/icons/court-icon.svg"
                        alt="Icon"
                      />
                      <span> Courts</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachRequest}>
                      <ImageWithBasePath
                        src="assets/img/icons/request-icon.svg"
                        alt="Icon"
                      />
                      <span>Requests</span>
                      <span className="court-notify">03</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachBooking}>
                      <ImageWithBasePath
                        src="assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachChat}>
                      <ImageWithBasePath
                        src="assets/img/icons/chat-icon.svg"
                        alt="Icon"
                      />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachEarning} >
                      <ImageWithBasePath
                        src="assets/img/icons/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Earnings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachWallet}>
                      <ImageWithBasePath
                        src="assets/img/icons/wallet-icon.svg"
                        alt="Icon"
                      />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.coachProfile} className="active">
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
                  to={route.coachProfile}
                  className={isLinkActive(route.coachProfile) ? "active" : ""}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to={route.settingLesson}
                  className={isLinkActive(route.settingLesson) ? "active" : ""}
                >
                  Lesson
                </Link>
              </li>
              <li>
                <Link
                  to={route.settingAvalibilty}
                  className={
                    isLinkActive(route.settingAvalibilty) ? "active" : ""
                  }
                >
                  Availability
                </Link>
              </li>
              <li>
                <Link
                  to={route.settingPassword}
                  className={
                    isLinkActive(route.settingPassword) ? "active" : ""
                  }
                >
                  Change Password
                </Link>
              </li>
              <li>
                <Link
                  to={route.profileOtherSetting}
                  className={
                    isLinkActive(route.profileOtherSetting) ? "active" : ""
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
                  <div className="preference-head">
                    <h4>Choose your Preferences</h4>
                  </div>
                  <div className="prefer-role">
                    <div className="prefer-list">
                      <div className="role-selection active">
                        <label>
                          <span className="role-name">Single Lesson</span>
                          <span className="role-check">
                            <i className="fa-solid fa-circle-check" />
                          </span>
                        </label>
                      </div>
                      <div className="less-info">
                        <h6>
                          3 Days * 1 hour <span>@ $150.00</span>
                        </h6>
                      </div>
                    </div>
                    <div className="interset-btn">
                      <div className="status-toggle d-inline-flex align-items-center">
                        <input
                          type="checkbox"
                          id="status_1"
                          className="check"
                        />
                        <label htmlFor="status_1" className="checktoggle">
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="prefer-role">
                    <div className="prefer-list">
                      <div className="role-selection">
                        <label>
                          <span className="role-name">2 Player Lesson</span>
                          <span className="role-check">
                            <i className="fa-solid fa-circle-check" />
                          </span>
                        </label>
                      </div>
                      <div className="less-info">
                        <h6>
                          4 Days * 1 hour <span>@ $150.00</span>
                        </h6>
                        <p>*2 players of similar age and ability</p>
                      </div>
                    </div>
                    <div className="interset-btn">
                      <div className="status-toggle d-inline-flex align-items-center">
                        <input
                          type="checkbox"
                          id="status_2"
                          className="check"
                        />
                        <label htmlFor="status_2" className="checktoggle">
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className=" prefer-role">
                    <div className="prefer-list">
                      <div className="role-selection">
                        <label>
                          <span className="role-name">Group Lesson</span>
                          <span className="role-check">
                            <i className="fa-solid fa-circle-check" />
                          </span>
                        </label>
                      </div>
                      <div className="less-info">
                        <h6>
                          2 Days * 1 hour @ <span>$200.00</span>
                        </h6>
                        <p> *4 players of similar age and ability</p>
                      </div>
                    </div>
                    <div className="interset-btn">
                      <div className="status-toggle d-inline-flex align-items-center">
                        <input
                          type="checkbox"
                          id="status_3"
                          className="check"
                          defaultChecked={true}
                        />
                        <label htmlFor="status_3" className="checktoggle">
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="save-changes text-end">
                  <Link to="#" className="btn btn-primary reset-profile">
                    Reset
                  </Link>
                  <Link to="#" className="btn btn-secondary save-profile">
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

export default SettingLesson;
