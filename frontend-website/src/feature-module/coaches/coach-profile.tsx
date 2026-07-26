import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const CoachProfile = () => {
  const routes = all_routes;
  const sortOptions = [{ name: "Expert" }, { name: "Experience" }];
  const [selectedSort, setSelectedSort] = useState();
  const timeframeOptions = [{ name: "This Week" }, { name: "One Day" }];
  const [selectedTimeframe, setSelectedTimeframe] = useState();
  const [selectedTimeframe1, setSelectedTimeframe1] = useState();
  const [selectedTimeframe2, setSelectedTimeframe2] = useState();
  const timeframeOptions1 = [{ name: "Country" }, { name: "Texas" }];
  const timeframeOptions2 = [{ name: "5" }, { name: "4" },{ name: "3" },{ name: "2" },{ name: "1" }];
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
            <h1 className="text-white">Profile Setting</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Profile Setting</li>
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
                      <Link to={routes.coachRequest}>
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
                      <Link to={routes.coachProfile} className="active">
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
                <div className="profile-detail-blk">
                  <ul>
                    <li className="active">
                      <Link to={routes.coachProfile}>Profile Details </Link>
                    </li>
                    <li>
                      <Link to={routes.appointmentDetails}>
                        Appointment Details
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="profile-detail-group">
                  <div className="card ">
                    <form>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="file-upload-text">
                            <div className="file-upload">
                              <ImageWithBasePath
                                src="/assets/img/icons/img-icon.svg"
                                className="img-fluid"
                                alt="Upload"
                              />
                              <p>Upload Photo</p>
                              <span>
                                <i className="feather-edit-3" />
                                <input type="file" id="file-input" />
                              </span>
                            </div>
                            <h5>
                              Upload a logo with a minimum size of 150 * 150
                              pixels (JPG, PNG, SVG).
                            </h5>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space">
                            <label htmlFor="name" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              placeholder="Enter Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space">
                            <label htmlFor="name" className="form-label">
                              Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Enter Email Address"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space">
                            <label htmlFor="name" className="form-label">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="Enter Phone Number"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label className="form-label">Select Level</label>
                            <Dropdown
                              value={selectedSort}
                              onChange={(e) => setSelectedSort(e.value)}
                              options={sortOptions}
                              optionLabel="name"
                              placeholder="Expert"
                              className="select custom-select-list"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label className="form-label">
                              Year Of Experience
                            </label>
                           
                            <Dropdown
                              value={selectedTimeframe2}
                              onChange={(e) => setSelectedTimeframe2(e.value)}
                              options={timeframeOptions2}
                              optionLabel="name"
                              placeholder="5"
                              className="select custom-select-list "
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label className="form-label">
                              Type of Appointments
                            </label>
                            <Dropdown
                              value={selectedTimeframe}
                              onChange={(e) => setSelectedTimeframe(e.value)}
                              options={timeframeOptions}
                              optionLabel="name"
                              placeholder="Both Onetime & Lesson Type"
                              className="select custom-select-list  week-select"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="info-about">
                            <label className="form-label">
                              Information about You
                            </label>
                            <textarea
                              className="form-control"
                              id="comments"
                              rows={3}
                              placeholder="About"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="address-form-head">
                          <h4>Address</h4>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="input-space">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              placeholder="Enter Address"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space">
                            <label className="form-label">State</label>
                            <input
                              type="text"
                              className="form-control"
                              id="state"
                              placeholder="Enter State"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              placeholder="Enter City"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                          <div className="input-space">
                            <label className="form-label">Country</label>
                           
                            <Dropdown
                              value={selectedTimeframe1}
                              onChange={(e) => setSelectedTimeframe1(e.value)}
                              options={timeframeOptions1}
                              optionLabel="name"
                              placeholder="Country"
                              className="select custom-select-list "
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-space mb-0">
                            <label className="form-label">Zipcode</label>
                            <input
                              type="text"
                              className="form-control"
                              id="zipcode"
                              placeholder="Enter Zipcode"
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

export default CoachProfile;
