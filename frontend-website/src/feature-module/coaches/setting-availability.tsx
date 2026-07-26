import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";

const SettingAvailability = () => {
  const route = all_routes;
  const [duration,setDuration]=useState('');
  const hours = [{ name: "1 Hrs" }, { name: "2 Hrs" },  { name: "3 Hrs" }];
 
  const location = useLocation();
  const isLinkActive = (route: string) => {
    // Check if the current location matches the given route
    return location.pathname === route;
  };
  const [dayVisibility, setDayVisibility] = useState({
    mon: true,
    tues: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });

  const toggleDayVisibility = (day: string) => {
    setDayVisibility((prevVisibility) => ({
      ...prevVisibility,
      [day]: !prevVisibility[day],
    }));
  };
  return (
    <div>
      <>
        {/* Breadcrumb */}
        <section className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Availability</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Availability</li>
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
                    className={
                      isLinkActive(route.settingLesson) ? "active" : ""
                    }
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
            {/* Profile Availability */}
            <div className="row">
              <div className="col-md-12">
                <div className="profile-availability">
                  <div className="select-days">
                    <h4>Select days</h4>
                    <ul className="day-list">
                      {/* Render checkboxes for each day */}
                      {Object.keys(dayVisibility).map((day) => (
                        <li key={day}>
                          <div className="day-selection">
                            <input
                              type="checkbox"
                              defaultValue="attach_link"
                              id={`select_days_${day}`}
                              name="day"
                              defaultChecked={dayVisibility[day]}
                              onClick={() => toggleDayVisibility(day)}
                            />
                            <label htmlFor={`select_days_${day}`}>{day}</label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="accordion setting-accordion">
                    {Object.keys(dayVisibility).map((day) => (
                      <div
                        key={`day-${day}`}
                        className={`accordion-item ${dayVisibility[day] ? "show" : ""}`}
                        id={`day-${day}`}
                      >
                        <div className="accordion-header">
                          <div
                            className={`accordion-button ${dayVisibility[day] ? "" : "collapsed"}`}
                            data-bs-toggle="collapse"
                            data-bs-target={`#${day}`}
                          >
                            <div className="interset-btn empty-space">
                              <div className="status-toggle d-inline-flex align-items-center">
                                <input
                                  type="checkbox"
                                  id={`status_${day}`}
                                  className="check"
                                />
                                <label
                                  htmlFor={`status_${day}`}
                                  className="checktoggle"
                                >
                                  checkbox
                                </label>
                              </div>
                            </div>
                            <span className="accord-title">{day}</span>
                            <Link to="#">Edit</Link>
                          </div>
                        </div>
                        <div
                          id={day}
                          className={`accordion-collapse collapse ${dayVisibility[day] ? "show" : ""}`}
                        >
                          <div className="accordion-body">
                            <div className="row gx-2">
                              <div className="col-md-3">
                                <div className="duration-blk">
                                  <label className="form-control-label">
                                    Duration{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                 
                                  <Dropdown
                              value={duration}
                              onChange={(e) => setDuration(e.value)}
                              options={hours}
                              optionLabel="name"
                              placeholder="Relevance"
                              className="select-bg w-100"
                            />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="duration-blk">
                                  <label className="form-control-label">
                                    Start Time{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="form-icon">
                                    <input
                                      type="text"
                                      className="form-control datetimepicker1"
                                      placeholder="Select time"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="duration-blk">
                                  <label className="form-control-label">
                                    End Time{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="form-icon">
                                    <input
                                      type="text"
                                      className="form-control datetimepicker1"
                                      placeholder="Select time"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <h4>Available Timings</h4>
                                <div className="token-slot mt-2">
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        defaultValue={18}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="06:00 AM"
                                      >
                                        06:00 AM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="15:00:00"
                                        data-end-time="15:20:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={19}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="07:00 AM"
                                      >
                                        07:00 AM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="15:20:00"
                                        data-end-time="15:40:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={20}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="08:00 AM"
                                      >
                                        08:00 AM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="15:40:00"
                                        data-end-time="16:00:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={21}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="09:00 AM"
                                      >
                                        09:00 AM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="16:00:00"
                                        data-end-time="16:20:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={22}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="10:00 AM"
                                      >
                                        10:00 AM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="16:20:00"
                                        data-end-time="16:40:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={23}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="11:00 PM"
                                      >
                                        11:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="16:40:00"
                                        data-end-time="17:00:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={24}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="12:00 PM"
                                      >
                                        12:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="17:00:00"
                                        data-end-time="17:20:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={25}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="01:00 PM"
                                      >
                                        01:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="17:20:00"
                                        data-end-time="17:40:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={26}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="02:00 PM"
                                      >
                                        02:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="17:40:00"
                                        data-end-time="18:00:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={27}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="03:00 PM"
                                      >
                                        03:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="18:00:00"
                                        data-end-time="18:20:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={28}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="04:00 PM"
                                      >
                                        04:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="18:20:00"
                                        data-end-time="18:40:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={29}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="05:00 PM"
                                      >
                                        05:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="18:40:00"
                                        data-end-time="19:00:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={30}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="06:00 PM"
                                      >
                                        06:00 PM
                                      </span>
                                    </label>
                                  </div>
                                  <div className="form-check-inline visits me-2">
                                    <label className="visit-btns">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        data-date="2021-05-21"
                                        data-timezone="Asia/Calcutta"
                                        data-start-time="19:00:00"
                                        data-end-time="19:20:00"
                                        data-session={1}
                                        name="token[]"
                                        defaultValue={31}
                                      />
                                      <span
                                        className="visit-rsn"
                                        data-bs-toggle="tooltip"
                                        title="07:00 PM"
                                      >
                                        07:00 PM
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div className=" save-time">
                                  <Link to="#">Save Timings</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Tuesday */}
                    <div className="accordion-item" id="day-tuesday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#tuesday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_2"
                                className="check"
                                defaultChecked={true}
                              />
                              <label htmlFor="status_2" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Tuesday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div
                        id="tuesday"
                        className="accordion-collapse collapse show"
                      >
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Tuesday */}
                    {/* Wednessday */}
                    <div className="accordion-item" id="day-wednesday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#wednesday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_3"
                                className="check"
                              />
                              <label htmlFor="status_3" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Wednesday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div
                        id="wednesday"
                        className="accordion-collapse collapse"
                      >
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Wednessday */}
                    {/* Thursday */}
                    <div className="accordion-item" id="day-thursday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#thursday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_4"
                                className="check"
                              />
                              <label htmlFor="status_4" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Thursday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div
                        id="thursday"
                        className="accordion-collapse collapse"
                      >
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className=" save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Thursday */}
                    {/* Friday */}
                    <div className="accordion-item" id="day-friday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#friday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_5"
                                className="check"
                              />
                              <label htmlFor="status_5" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Friday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div id="friday" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Friday */}
                    {/* Saturday */}
                    <div className="accordion-item" id="day-saturday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#saturday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_6"
                                className="check"
                              />
                              <label htmlFor="status_6" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Saturday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div
                        id="saturday"
                        className="accordion-collapse collapse"
                      >
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Saturday */}
                    {/* Sunday */}
                    <div className="accordion-item" id="day-sunday">
                      <div className="accordion-header">
                        <div
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#sunday"
                        >
                          <div className="interset-btn empty-space">
                            <div className="status-toggle d-inline-flex align-items-center">
                              <input
                                type="checkbox"
                                id="status_7"
                                className="check"
                              />
                              <label htmlFor="status_7" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                          <span className="accord-title">Sunday</span>
                          <Link to="#">Edit</Link>
                        </div>
                      </div>
                      <div id="sunday" className="accordion-collapse collapse">
                        <div className="accordion-body">
                          <div className="row gx-2">
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Duration{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>1 Hrs</option>
                                  <option>2 Hrs</option>
                                  <option>3 Hrs</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  Start Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="duration-blk">
                                <label className="form-control-label">
                                  End Time{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="form-icon">
                                  <input
                                    type="text"
                                    className="form-control datetimepicker1"
                                    placeholder="Select time"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <h4>Available Timings</h4>
                              <div className="token-slot mt-2">
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      defaultValue={18}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 AM"
                                    >
                                      06:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:00:00"
                                      data-end-time="15:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={19}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 AM"
                                    >
                                      07:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:20:00"
                                      data-end-time="15:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={20}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="08:00 AM"
                                    >
                                      08:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="15:40:00"
                                      data-end-time="16:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={21}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="09:00 AM"
                                    >
                                      09:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:00:00"
                                      data-end-time="16:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={22}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="10:00 AM"
                                    >
                                      10:00 AM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:20:00"
                                      data-end-time="16:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={23}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="11:00 PM"
                                    >
                                      11:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="16:40:00"
                                      data-end-time="17:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={24}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="12:00 PM"
                                    >
                                      12:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:00:00"
                                      data-end-time="17:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={25}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="01:00 PM"
                                    >
                                      01:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:20:00"
                                      data-end-time="17:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={26}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="02:00 PM"
                                    >
                                      02:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="17:40:00"
                                      data-end-time="18:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={27}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="03:00 PM"
                                    >
                                      03:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:00:00"
                                      data-end-time="18:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={28}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="04:00 PM"
                                    >
                                      04:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:20:00"
                                      data-end-time="18:40:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={29}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="05:00 PM"
                                    >
                                      05:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="18:40:00"
                                      data-end-time="19:00:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={30}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="06:00 PM"
                                    >
                                      06:00 PM
                                    </span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-2">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      data-date="2021-05-21"
                                      data-timezone="Asia/Calcutta"
                                      data-start-time="19:00:00"
                                      data-end-time="19:20:00"
                                      data-session={1}
                                      name="token[]"
                                      defaultValue={31}
                                    />
                                    <span
                                      className="visit-rsn"
                                      data-bs-toggle="tooltip"
                                      title="07:00 PM"
                                    >
                                      07:00 PM
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="save-time">
                                <Link to="#">Save Timings</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Sunday */}
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
            {/* /Profile Availability */}
          </div>
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default SettingAvailability;
