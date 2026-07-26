import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { all_routes } from "../router/all_routes";

const AddCourt = () => {
  const [isChecked1, setChecked1] = useState(true);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [isChecked4, setChecked4] = useState(false);
  const [isChecked5, setChecked5] = useState(false);
  const [isChecked6, setChecked6] = useState(false);
  const [isChecked7, setChecked7] = useState(false);

  const [selectedCourt, setSelectedCourt] = useState();
  const [selectedHours1, setSelectedHours1] = useState();
  const [selectedHours2, setSelectedHours2] = useState();
  const [selectedHours3, setSelectedHours3] = useState();
  const [selectedHours4, setSelectedHours4] = useState();
  const [selectedHours5, setSelectedHours5] = useState();
  const [selectedHours6, setSelectedHours6] = useState();
  const [selectedHours7, setSelectedHours7] = useState();

  const [addRules1, setAddRules1] = useState(true);

  const addRulesContent = () => {
    setAddRules1(!addRules1);
  };

  const [images, setImages] = useState([true, true, true]);

  const removeImg = (index) => {
    const newImages = [...images];
    newImages[index] = !newImages[index];
    setImages(newImages);
  };

  // dayjs.extend(customParseFormat);
  // const onChange = (time: Dayjs, timeString: string) => {
  // };

  const courtOptions = [
    { name: "Select Court Type" },
    { name: "Toronto" },
    { name: "Texas" },
  ];
  const hoursOptions1 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions2 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions3 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions4 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions5 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions6 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const hoursOptions7 = [
    { name: "1 Hrs" },
    { name: "2 Hrs" },
    { name: "3 Hrs" },
  ];
  const scrollContent = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth", 
        block: "start",
        inline: "nearest",
      });
    }
  };
  const routes = all_routes;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">List Your Court</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>List Your Court</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        <div className="container">
          {/* Row */}
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="venue-options option-list-court white-bg">
                <ul className="clearfix">
                  <li className="active">
                    <Link onClick={() => scrollContent("basic-info")}>
                      Basic Info
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("venue-price")}>
                      Venue Price
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("availability")}>
                      Availability
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("overview")}>
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("includes")}>
                      Includes
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("rules")}>Rules</Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("amenities")}>
                      Amenities
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("gallery")}>
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => scrollContent("location")}>
                      Locations
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Accordian Contents */}
              <form action="#" className="accordion" id="accordionPanel">
                <div className="accordion-item mb-4" id="basic-info">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-basic-info"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      Basic Info
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-basic-info"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space mb-0">
                            <label htmlFor="court-name" className="form-label">
                              Court Name <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="court-name"
                              placeholder="Enter Court Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space mb-0">
                            <label className="form-label">
                              Court Type <span>*</span>
                            </label>
                            <Dropdown
                              value={selectedCourt}
                              onChange={(e) => setSelectedCourt(e.value)}
                              options={courtOptions}
                              optionLabel="name"
                              placeholder="Select Court Type"
                              className="select-bg w-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="venue-price">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-venue-price"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      Venue Price <span>(USD)</span>
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-venue-price"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label
                              htmlFor="starting-price"
                              className="form-label"
                            >
                              Starting Price (Per Hour)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="starting-price"
                              placeholder="Enter Price"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label htmlFor="name" className="form-label">
                              Max Guests
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="max-guests"
                              placeholder="Enter Max Number of Guests"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space mb-0">
                            <label
                              htmlFor="additional-guests"
                              className="form-label"
                            >
                              Additional Guests
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="additional-guests"
                              placeholder="No Additional Guests"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space mb-0">
                            <label htmlFor="name" className="form-label">
                              Price of Extra Guest (Per Hour)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              placeholder="Enter Price of Extra Guests"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="availability">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-availability"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      Availability
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-availability"
                  >
                    <div className="accordion-body">
                      {/* Profile Availability */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="profile-availability">
                            <div className="select-days">
                              <h4>Select Days</h4>
                              <ul className="day-list">
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_1"
                                      checked={isChecked1}
                                      onChange={() => setChecked1(!isChecked1)}
                                      name="day"
                                      defaultChecked
                                    />
                                    <label htmlFor="select_days_1">Mon</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_2"
                                      checked={isChecked2}
                                      onChange={() => setChecked2(!isChecked2)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_2">Tues</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_3"
                                      checked={isChecked3}
                                      onChange={() => setChecked3(!isChecked3)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_3">Wed</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_4"
                                      checked={isChecked4}
                                      onChange={() => setChecked4(!isChecked4)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_4">Thur</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_5"
                                      checked={isChecked5}
                                      onChange={() => setChecked5(!isChecked5)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_5">Fri</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_6"
                                      checked={isChecked6}
                                      onChange={() => setChecked6(!isChecked6)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_6">Sat</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="day-selection">
                                    <input
                                      type="checkbox"
                                      defaultValue="attach_link"
                                      id="select_days_7"
                                      checked={isChecked7}
                                      onChange={() => setChecked7(!isChecked7)}
                                      name="day"
                                    />
                                    <label htmlFor="select_days_7">Sun</label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="accordion setting-accordion">
                              {/* Monday */}
                              <div
                                className="accordion-item"
                                id="day-monday"
                                style={{
                                  display: isChecked1 ? "block" : "none",
                                }}
                              >
                                <div className="accordion-header">
                                  <div
                                    className="accordion-button collapsed"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#monday"
                                  >
                                    <div className="interset-btn empty-space">
                                      <div className="status-toggle d-inline-flex align-items-center">
                                        <input
                                          type="checkbox"
                                          id="status_1"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="status_1"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">Monday</span>
                                    <Link to="#">Edit</Link>
                                  </div>
                                </div>
                                <div
                                  id="monday"
                                  className="accordion-collapse collapse"
                                >
                                  <div className="accordion-body">
                                    <div className="row gx-2">
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Duration{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours1}
                                            onChange={(e) =>
                                              setSelectedHours1(e.value)
                                            }
                                            options={hoursOptions1}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              {/* /Monday */}
                              {/* Tuesday */}
                              <div
                                className="accordion-item"
                                id="day-tuesday"
                                style={{
                                  display: isChecked2 ? "block" : "none",
                                }}
                              >
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
                                          defaultChecked
                                        />
                                        <label
                                          htmlFor="status_2"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">
                                      Tuesday
                                    </span>
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
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours2}
                                            onChange={(e) =>
                                              setSelectedHours2(e.value)
                                            }
                                            options={hoursOptions2}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              <div
                                className="accordion-item"
                                id="day-wednesday"
                                style={{
                                  display: isChecked3 ? "block" : "none",
                                }}
                              >
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
                                        <label
                                          htmlFor="status_3"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">
                                      Wednesday
                                    </span>
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
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours3}
                                            onChange={(e) =>
                                              setSelectedHours3(e.value)
                                            }
                                            options={hoursOptions3}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              <div
                                className="accordion-item"
                                id="day-thursday"
                                style={{
                                  display: isChecked4 ? "block" : "none",
                                }}
                              >
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
                                        <label
                                          htmlFor="status_4"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">
                                      Thursday
                                    </span>
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
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours4}
                                            onChange={(e) =>
                                              setSelectedHours4(e.value)
                                            }
                                            options={hoursOptions4}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              <div
                                className="accordion-item"
                                id="day-friday"
                                style={{
                                  display: isChecked5 ? "block" : "none",
                                }}
                              >
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
                                        <label
                                          htmlFor="status_5"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">Friday</span>
                                    <Link to="#">Edit</Link>
                                  </div>
                                </div>
                                <div
                                  id="friday"
                                  className="accordion-collapse collapse"
                                >
                                  <div className="accordion-body">
                                    <div className="row gx-2">
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Duration{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours5}
                                            onChange={(e) =>
                                              setSelectedHours5(e.value)
                                            }
                                            options={hoursOptions5}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              <div
                                className="accordion-item"
                                id="day-saturday"
                                style={{
                                  display: isChecked6 ? "block" : "none",
                                }}
                              >
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
                                        <label
                                          htmlFor="status_6"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">
                                      Saturday
                                    </span>
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
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours6}
                                            onChange={(e) =>
                                              setSelectedHours6(e.value)
                                            }
                                            options={hoursOptions6}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                              <div
                                className="accordion-item"
                                id="day-sunday"
                                style={{
                                  display: isChecked7 ? "block" : "none",
                                }}
                              >
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
                                        <label
                                          htmlFor="status_7"
                                          className="checktoggle"
                                        >
                                          checkbox
                                        </label>
                                      </div>
                                    </div>
                                    <span className="accord-title">Sunday</span>
                                    <Link to="#">Edit</Link>
                                  </div>
                                </div>
                                <div
                                  id="sunday"
                                  className="accordion-collapse collapse"
                                >
                                  <div className="accordion-body">
                                    <div className="row gx-2">
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Duration{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <Dropdown
                                            value={selectedHours7}
                                            onChange={(e) =>
                                              setSelectedHours7(e.value)
                                            }
                                            options={hoursOptions7}
                                            optionLabel="name"
                                            placeholder="Select Hours"
                                            className="select-bg w-100"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            Start Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="duration-blk">
                                          <label className="form-control-label">
                                            End Time{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </label>
                                          <div className="form-icon">
                                            <TimePicker
                                              placeholder="Select Time"
                                              className="form-control datetimepicker1"
                                              onChange={onChange}
                                              defaultOpenValue={dayjs(
                                                "00:00:00",
                                                "HH:mm:ss"
                                              )}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <h4>Available Timings</h4>
                                        <div className="token-slot mt-2">
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                                          <div className="form-check-inline visits me-1">
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
                            <div className="save-changes text-sm-end">
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
                      {/* /Profile Availability */}
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="overview">
                  <h4 className="accordion-header" id="panelsStayOpen-overview">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFour"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseFour"
                    >
                      Venue Overview
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-overview"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-12">
                          <div className>
                            <label htmlFor="name" className="form-label">
                              Overview of Venue
                            </label>
                            <textarea
                              className="form-control"
                              id="venue-overview"
                              rows={9}
                              placeholder="Enter Overview"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="includes">
                  <h4 className="accordion-header" id="panelsStayOpen-includes">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      Includes
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-includes"
                  >
                    <div className="accordion-body">
                      <ul className="clearfix">
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes1"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes1"
                            >
                              Badminton Racket Unlimited
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes2"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes2"
                            >
                              Bats
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes3"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes3"
                            >
                              Hitting Machines
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes4"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes4"
                            >
                              Multiple Courts
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes5"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes5"
                            >
                              Spare Players
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes6"
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes6"
                            >
                              Instant Racket
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="includes7"
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="includes7"
                            >
                              Green Turfs
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="rules">
                  <h4 className="accordion-header" id="panelsStayOpen-rules">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSix"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseSix"
                    >
                      Venue Rules
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseSix"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-rules"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="input-space">
                            <input
                              type="text"
                              className="form-control rules-option"
                              id="add-rules"  
                              placeholder="Enter Rules"
                            />
                          </div>
                          <div className={`alert alert-danger error-add-rule ${!addRules1 ? 'd-block' : ''}`}>
                            Input filed doesn&apos;t empty, must fill out the
                            rule!
                          </div>
                          <ul className="rules-wraper" />
                          <Link className="align-items-center add-rules" onClick={addRulesContent}>
                            <i className="feather-plus-circle" />
                            Add Rules
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="amenities">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-amenities"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSeven"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseSeven"
                    >
                      Amenities
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseSeven"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-amenities"
                  >
                    <div className="accordion-body">
                      <ul className="d-md-flex align-items-center">
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="amenities1"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="amenities1"
                            >
                              Parking
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="amenities2"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="amenities2"
                            >
                              Drinking Water
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="amenities3"
                                defaultChecked
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="amenities3"
                            >
                              First Aid
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="amenities4"
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="amenities4"
                            >
                              Change Room
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="form-check d-flex justify-content-start align-items-center">
                            <div className="d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue
                                id="amenities5"
                              />
                            </div>
                            <label
                              className="form-check-label"
                              htmlFor="amenities5"
                            >
                              Shower
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="gallery">
                  <h4 className="accordion-header" id="panelsStayOpen-gallery">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseEight"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseEight"
                    >
                      Gallery
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseEight"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-gallery"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="file-upload-text appointment-upload">
                            <div className="input-space">
                              <label className="form-label">
                                Your Venue Images
                              </label>
                              <div className="file-upload">
                                <ImageWithBasePath
                                  src="assets/img/icons/upload-icon.svg"
                                  className="img-fluid"
                                  alt="upload"
                                />
                                <p>Upload Coaching Gallery </p>
                                <input
                                  type="file"
                                  id="file-input"
                                  className="image-upload"
                                />
                              </div>
                            </div>
                            <div className="upload-show-img">
                              <div className={`upload-images ${images[0] ? '' : 'd-none'}`} >
                                <ImageWithBasePath
                                  src="assets/img/booking/booking-01.jpg"
                                  alt="Image"
                                />
                                <Link
                                  to="#;"  onClick={() => removeImg(0)}
                                  className="btn btn-icon logo-hide-btn btn-sm"
                                >
                                  <i className="far fa-trash-alt" />
                                </Link>
                              </div>
                              <div className={`upload-images ${images[1] ? '' : 'd-none'}`} >
                                <ImageWithBasePath
                                  src="assets/img/booking/booking-02.jpg"
                                  alt="Image"
                                />
                                <Link
                                  to="#;"  onClick={() => removeImg(1)}
                                  className="btn btn-icon logo-hide-btn btn-sm"
                                >
                                  <i className="far fa-trash-alt" />
                                </Link>
                              </div>
                              <div className={`upload-images ${images[2] ? '' : 'd-none'}`} >
                                <ImageWithBasePath
                                  src="assets/img/booking/booking-03.jpg"
                                  alt="Image"
                                />
                                <Link
                                  to="#;"  onClick={() => removeImg(2)}
                                  className="btn btn-icon logo-hide-btn btn-sm"
                                >
                                  <i className="far fa-trash-alt" />
                                </Link>
                              </div>
                            </div>
                            <h5>
                              Put the main picture as first Image <br /> Image
                              Should be minimum 152 * 152 Supported File format
                              JPG,PNG,SVG
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item" id="location">
                  <h4 className="accordion-header" id="panelsStayOpen-location">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseNine"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseNine"
                    >
                      Location
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseNine"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-location"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label htmlFor="country" className="form-label">
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="country"
                              placeholder="Enter Country"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-space">
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              placeholder="Enter City"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-space">
                            <label
                              htmlFor="street-address"
                              className="form-label"
                            >
                              Street Address <span>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="street-address"
                              placeholder="Enter Street Address"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="name" className="form-label">
                          Map
                        </label>
                        <div className="google-maps">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                            height={445}
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center btn-row">
                  <Link
                    className="btn btn-secondary btn-icon"
                    to={routes.cageOrderConfirm}
                  >
                    Save Venue <i className="feather-arrow-right-circle ms-1" />
                  </Link>
                </div>
              </form>
              {/* Accordian Contents */}
            </div>
          </div>
          {/* /Row */}
        </div>
        {/* /Container */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default AddCourt;
