import React, { useState } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const AppointmentDetails = () => {
  const routes = all_routes;
  const [selectedCurrency, setSelectedCurrency] = useState();

  const currencyOptions = [{ name: "USD" }, { name: "Euro" }];

  const [images, setImages] = useState([true, true, true]);

  const removeImg = (index) => {
    const newImages = [...images];
    newImages[index] = !newImages[index];
    setImages(newImages);
  };

  return (
    <div>
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
                <Link className="active" to={routes.coachProfile}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to={routes.settingLesson}>Lesson</Link>
              </li>
              <li>
                <Link to={routes.settingAvailability}>Availability</Link>
              </li>
              <li>
                <Link to={routes.settingPassword}>Change Password</Link>
              </li>
              <li>
                <Link to={routes.profileOtherSetting}>Other Settings</Link>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-blk">
                <ul>
                  <li>
                    <Link to={routes.coachProfile}>Profile Details </Link>
                  </li>
                  <li className="active">
                    <Link to={routes.appointmentDetails}>Appointment Details</Link>
                  </li>
                </ul>
              </div>
              <div className="profile-detail-group">
                <div className="card ">
                  <form>
                    <div className="row">
                      <div className="appoint-head">
                        <h4>Amount</h4>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space link-apoint">
                          <label className="form-label">
                            Select Currency type
                          </label>
                          <Dropdown
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.value)}
                            options={currencyOptions}
                            optionLabel="name"
                            placeholder="USD"
                            className="select-bg w-100"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space link-apoint">
                          <label className="form-label">
                            For Onetime Appointment (USD)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            placeholder="Enter Amount"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="appoint-head coach-top">
                          <h4>Your Coaching Images</h4>
                        </div>
                        <div className="file-upload-text appointment-upload">
                          <div className="file-upload">
                            <ImageWithBasePath
                              src="assets/img/icons/upload-icon.svg"
                              className="img-fluid"
                              alt="Upload"
                            />
                            <p>Upload Coaching Gallery </p>
                            <input type="file" id="file-input" />
                          </div>
                          <div className="upload-show-img">
                            <div className={`upload-images ${images[0] ? '' : 'd-none'}`}>
                              <ImageWithBasePath
                                src="assets/img/booking/booking-01.jpg"
                                alt="Uploader"
                              />
                              <Link
                                to="#"
                                className="btn btn-icon logo-hide-btn btn-sm" onClick={() => removeImg(0)}
                              >
                                <i className="far fa-trash-alt" />
                              </Link>
                            </div>
                            <div className={`upload-images ${images[1] ? '' : 'd-none'}`}>
                              <ImageWithBasePath
                                src="assets/img/booking/booking-02.jpg"
                                alt="Uploader"
                              />
                              <Link
                                to="#"
                                className="btn btn-icon logo-hide-btn btn-sm"onClick={() => removeImg(1)}
                              >
                                <i className="far fa-trash-alt" />
                              </Link>
                            </div>
                            <div className={`upload-images ${images[2] ? '' : 'd-none'}`}>
                              <ImageWithBasePath
                                src="assets/img/booking/booking-03.jpg"
                                alt="Uploader"
                              />
                              <Link
                                to="#"
                                className="btn btn-icon logo-hide-btn btn-sm" onClick={() => removeImg(2)}
                              >
                                <i className="far fa-trash-alt" />
                              </Link>
                            </div>
                          </div>
                          <h5>
                            Image Should be minimum 152 * 152 Supported File
                            format JPG,PNG,SVG
                          </h5>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="appoint-head">
                          <h4>Video</h4>
                        </div>
                        <div className="input-space link-apoint">
                          <label className="form-label"> Link</label>
                          <div className="input-box">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              placeholder="Enter Video Link"
                            />
                            <p>Video Supported File format MP4 Format</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="appoint-head">
                          <h4>Short Bio</h4>
                        </div>
                        <div className="info-about">
                          <label className="form-label">Enter Bio</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter Bio"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="appoint-head">
                          <h4>Lesson With Me</h4>
                        </div>
                        <div className="info-about">
                          <label className="form-label">Enter Content</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter Content"
                            defaultValue={""}
                          />
                          <div className="check-single-lesson">
                            <div className="similar-player">
                              <div className="form-check d-flex align-items-center policy">
                                <div className="d-inline-block">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue
                                  />
                                </div>
                                <label className="form-check-label">
                                  Single Lesson
                                </label>
                              </div>
                              <ul>
                                <li>
                                  3 Days * 1 hour @ <span>$150.00</span>
                                </li>
                              </ul>
                            </div>
                            <div className="similar-player">
                              <div className="form-check d-flex align-items-center policy">
                                <div className="d-inline-block">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue
                                  />
                                </div>
                                <label className="form-check-label">
                                  2 Player Lesson
                                </label>
                              </div>
                              <ul>
                                <li>
                                  3 Days * 1 hour @ <span>$150.00</span>
                                </li>
                                <li> *4 players of similar age and ability</li>
                              </ul>
                            </div>
                            <div className="similar-player">
                              <div className="form-check d-flex align-items-center policy">
                                <div className="d-inline-block">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultValue
                                  />
                                </div>
                                <label className="form-check-label">
                                  Small Group Lesson
                                </label>
                              </div>
                              <ul>
                                <li>
                                  2 Days * 1 hour @ <span>$200.00</span>
                                </li>
                                <li> *4 players of similar age and ability</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="appoint-head">
                          <h4>Coaching</h4>
                        </div>
                        <div className="info-about p-0 m-0 border-bottom-0">
                          <label className="form-label">Enter Bio</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter Bio"
                            defaultValue={""}
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
    </div>
  );
};

export default AppointmentDetails;
