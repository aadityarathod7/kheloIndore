import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Dropdown } from "primereact/dropdown";
import { all_routes } from "../router/all_routes";

const CageDetails = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCity, setselectedCity] = useState();

  const routes = all_routes;
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(1);
  const [count3, setCount3] = useState(1);

  const increaseCount = () => {
    setCount(count + 1);
  };

  const decreaseCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };
  const increaseCount2 = () => {
    setCount2(count2 + 1);
  };

  const decreaseCount2 = () => {
    if (count2 > 0) {
      setCount2(count2 - 1);
    }
  };
  const increaseCount3 = () => {
    setCount3(count3 + 1);
  };

  const decreaseCount3 = () => {
    if (count3 > 0) {
      setCount3(count3 - 1);
    }
  };

  const courtOptions = [
    { name: "Select City" },
    { name: "Toronto" },
    { name: "Texas" },
  ];

  // dayjs.extend(customParseFormat);
  // const onChange = (time: Dayjs, timeString: string) => {
  // };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Book A Court</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Book A Court</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      <section className="booking-steps py-30">
        <div className="container">
          <ul className="d-lg-flex justify-content-center align-items-center">
            <li className="active">
              <h5>
                <Link to={routes.cagedetails}>
                  <span>1</span>Book a Court
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.cageordeconfirm}>
                  <span>2</span>Order Confirmation
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.cagepersonalinfo}>
                  <span>3</span>Personal Information
                </Link>
              </h5>
            </li>
            <li>
              <h5>
                <Link to={routes.cagecheckout}>
                  <span>4</span>Payment
                </Link>
              </h5>
            </li>
          </ul>
        </div>
      </section>
      {/* Page Content */}
      <div className="content book-cage">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">Book A Court</h3>
              <p className="sub-title mb-0">
                Hassle-free court bookings and state-of-the-art facilities.
              </p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        src="/assets/img/master-academy.png"
                        className="corner-radius-10"
                        alt="Venue"
                      />
                    </Link>
                    <div className="info">
                      <div className="d-flex justify-content-start align-items-center mb-3">
                        <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                          4.5
                        </span>
                        <span>300 Reviews</span>
                      </div>
                      <h3 className="mb-2">Manchester Academy</h3>
                      <p>
                        Manchester Academy: Where dreams meet excellence in
                        sports education and training.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <ul className="d-sm-flex align-items-center justify-content-evenly">
                    <li>
                      <h3 className="d-inline-block">$150</h3>
                      <span>/hr</span>
                      <p>up to 1 guests</p>
                    </li>
                    <li>
                      <span>
                        <i className="feather-plus" />
                      </span>
                    </li>
                    <li>
                      <h3 className="d-inline-block">$5</h3>
                      <span>/hr</span>
                      <p>
                        each additional guest <br />
                        up to 4 guests max
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-8">
              <section className="card booking-form">
                <h3 className="border-bottom">Booking Form</h3>
                <form>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      From
                    </label>
                    <div className="form-icon dropdown-designs">
                      {/* <input type="text" className="form-control datetimepicker" placeholder="Select Date" id="date" /> */}
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        type="date"
                        dateFormat="dd-MM-yyyy"
                        placeholder="Select Date"
                        className="form-control datetimepicker datepic"
                      />
                      <span className="cus-icon">
                        <i className="feather-calendar icon-date" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="start-time" className="form-label">
                      Start Time
                    </label>
                    <div className="form-icon dropdown-designs">
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker1 datepic"
                        onChange={onChange}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                      />
                      <span className="cus-icon">
                        <i className="feather-clock icon-time" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="end-time" className="form-label">
                      End Time
                    </label>
                    <div className="form-icon dropdown-designs">
                      {/* <input type="text" className="form-control timepicker" id="end-time" placeholder="Select End Time" /> */}
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker1 datepic"
                        onChange={onChange}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                      />
                      <span className="cus-icon">
                        <i className="feather-clock icon-time" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="court" className="form-label">
                      Court
                    </label>

                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setselectedCity(e.value)}
                      options={courtOptions}
                      optionLabel="name"
                      placeholder="Select City"
                      className="select-bg w-100"
                    />
                  </div>
                  <div className="select-guest">
                    <h5>Select Guest</h5>
                    <span className="primary-text"> (2 guests maximum)</span>
                    <label className="w-100">
                      The youngest age allowed at this court is 5 <span>*</span>
                    </label>
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="qty-item text-center">
                        <Link
                          to="#"
                          className="dec d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-minus-circle"
                            onClick={decreaseCount}
                          />
                        </Link>
                        <input
                          type="number"
                          className="form-control text-center"
                          name="qty"
                          id="adults"
                          value={count}
                          onChange={(e) => setCount(parseInt(e.target.value))}
                        />
                        <Link
                          to="#"
                          className="inc d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-plus-circle"
                            onClick={increaseCount}
                          />
                        </Link>
                        <label htmlFor="adults">
                          <span className="dark-text">Adults</span>
                          <span className="dull-text">Ages 13 and up</span>
                        </label>
                      </div>
                      <div className="qty-item text-center">
                        <Link
                          to="#"
                          className="dec d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-minus-circle"
                            onClick={decreaseCount2}
                          />
                        </Link>
                        <input
                          type="number"
                          className="form-control text-center"
                          name="qty"
                          id="children"
                          value={count2}
                          onChange={(e) => setCount2(parseInt(e.target.value))}
                        />
                        <Link
                          to="#"
                          className="inc d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-plus-circle"
                            onClick={increaseCount2}
                          />
                        </Link>
                        <label htmlFor="children">
                          <span className="dark-text">Children</span>
                          <span className="dull-text">Ages 6-12</span>
                        </label>
                      </div>
                      <div className="qty-item text-center">
                        <Link
                          to="#"
                          className="dec d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-minus-circle"
                            onClick={decreaseCount3}
                          />
                        </Link>
                        <input
                          type="number"
                          className="form-control text-center"
                          name="qty"
                          id="young-children"
                          value={count3}
                          onChange={(e) => setCount3(parseInt(e.target.value))}
                        />
                        <Link
                          to="#"
                          className="inc d-flex justify-content-center align-items-center"
                        >
                          <i
                            className="feather-plus-circle"
                            onClick={increaseCount3}
                          />
                        </Link>
                        <label htmlFor="young-children">
                          <span className="dark-text">Young Children</span>
                          <span className="dull-text">Under 6</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <aside className="card booking-details">
                <h3 className="border-bottom">Booking Details</h3>
                <ul>
                  <li>
                    <i className="fa-regular fa-building me-2" />
                    Standard Synthetic Court 1<span className="x-circle" />
                  </li>
                  <li>
                    <i className="feather-calendar me-2" />
                    27, April 2023
                  </li>
                  <li>
                    <i className="feather-clock me-2" />
                    01:00 PM to 03:00 PM
                  </li>
                  <li>
                    <i className="feather-users me-2" />2 Adults, 1 Children
                  </li>
                </ul>
                <div className="d-grid btn-block">
                  <button type="button" className="btn btn-primary">
                    Subtotal : $200
                  </button>
                </div>
              </aside>
            </div>
          </div>
          <div className="text-center btn-row">
            <Link className="btn btn-primary me-3 btn-icon" to="#">
              <i className="feather-arrow-left-circle me-1" /> Back
            </Link>
            <Link
              className="btn btn-secondary btn-icon"
              to={routes.cageordeconfirm}
            >
              Next <i className="feather-arrow-right-circle ms-1" />
            </Link>
          </div>
        </div>
        {/* /Container */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CageDetails;
