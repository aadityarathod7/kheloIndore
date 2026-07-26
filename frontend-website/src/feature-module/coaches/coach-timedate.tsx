import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../router/all_routes";
import { API_URL, IMG_URL } from "../../ApiUrl";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "react-bootstrap/Dropdown";
import { jwtDecode } from "jwt-decode";
import "../../style/css/custom.css";
import Swal from "sweetalert2";
import { log } from "console";

interface CoachData {
  first_name: string;
  last_name: string;
  location: string;
  experience: string;
  availability: string;
  specializations: string[];
  bio: string;
  package: string;
  price: number;
  package_type: string;
  name: string;
  duration: number;
  focus_area: string;
  number_of_sessions: number;
  profile_picture: { src: string }[];
  address: string;
  city: string;
  state: string;
  zipcode: string;
  _id: string;
}

interface BatchData {
  length: number;
  batchSize: number;
  _id: string;
  slots: SlotData[];
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
  personCount: number;
  batchDate: any;
  batchName: string;
}

interface SlotData {
  _id: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
  personCount: number;
  slots: any;
}

interface JwtPayload {
  first_name: string;
  userID: string;
}

const CoachTimeDate = (props: any) => {
  const routes = all_routes;
  const [coachData, setCoachData] = useState<CoachData | null>(null);
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const { id } = useParams();

  const navigate = useNavigate();
  // -=-=-=-=-=-=-=-=-=--=-=-new code-=-=-=-=-=-=-=-=-=-=-=-

  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [isNextButtonDisabledTwo, setIsNextButtonDisabledTwo] = useState(true);
  const [slotData, setSlotData] = useState<any[]>([]);
  const [dateId, setDateId] = useState<any[]>([]);
  const [timeSlot, setTimeSlot] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<SlotData | null>(null);
  const [daysDifference, setDaysDifference] = useState<number>(1);

  useEffect(() => {
    setIsNextButtonDisabled(selectedBatch === null);
  }, [selectedBatch]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBatch(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setStartDate(date);
    if (selectedBatch) {
      // If batch is already selected, calculate the end date based on the start date and batch
      calculateEndDate(date, selectedBatch);
    }
  };

  const calculateEndDate = (startDate: string, batch: string) => {
    const start = new Date(startDate);
    let end: Date;

    switch (batch) {
      case 'Monthly':
        end = new Date(start);
        end.setMonth(start.getMonth() + 1); // Add 1 month
        break;
      case 'Quarterly':
        end = new Date(start);
        end.setMonth(start.getMonth() + 3); // Add 3 months
        break;
      case 'Half-Yearly':
        end = new Date(start);
        end.setMonth(start.getMonth() + 6); // Add 6 months
        break;
      case 'Annually':
        end = new Date(start);
        end.setFullYear(start.getFullYear() + 1); // Add 1 year
        break;
      default:
        end = new Date(start); // Default: no change, or add logic for other cases
    }

    setEndDate(formatDate(end));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle end date change
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    setIsNextButtonDisabledTwo(!startDate || !endDate);
  }, [startDate, endDate]);

  console.log(selectedBatch, "selectedBatch-=-=-selectedBatch")
  console.log(startDate, "startDate-=-=-startDate")
  console.log(endDate, "endDate-=-=-endDate")

  const getAllSlots = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all-coach-slot/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.data);
      setSlotData(response?.data?.data)

    } catch (error) {
      console.error('Error fetching slots:', error);
      console.log(error, "error")
    }
  };

  useEffect(() => {
    getAllSlots()
  }, [id])

  const findMatchedSlotId = (startDateToCheck: string): any => {
    const matchedSlot = slotData.find((slot: any) => {
      const slotStartDate = slot.start_date.split('T')[0]; // Extract only the date part (yyyy-mm-dd)
      return slotStartDate === startDateToCheck;
    });
    console.log(matchedSlot, "slot for id")
    setDateId(matchedSlot ? matchedSlot.id : null)
  };

  useEffect(() => {
    findMatchedSlotId(startDate)
  }, [startDate])

  const getSlotById = async (dateId: any) => {
    try {
      const response = await axios.get(`${API_URL}/get-coach-slot-by-date/${dateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.data);
      setTimeSlot(response?.data?.data)
    } catch (error) {
      console.error('Error fetching slots:', error);
      console.log(error, "error")
    }
  }
  console.log(selectedTimeSlot, "sdjkafhkjalsdhf")

  const handleCalculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const timeDifference = end.getTime() - start.getTime();

      const days = timeDifference / (1000 * 3600 * 24);

      setDaysDifference(days);
    } else {
      setDaysDifference(1);
    }
  };

  useEffect(() => {
    handleCalculateDays();
  }, [startDate, endDate])

  // -=-=-=-=-=-=-=-=-=--=-=-new code-=-=-=-=-=-=-=-=-=-=-=-

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCoachId = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetch-coach/${id}`);
        const coachDataId = response.data.coach;
        setCoachData(coachDataId);
      } catch (error) {
        console.error("Error fetching coach data:", error);
      }
    };
    fetchCoachId();
  }, [id]);

  // useEffect(() => {
  //   const fetchBatchId = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/coach/batches/${id}`);
  //       const batchDataId = response.data.data;
  //       setBatchData(batchDataId);
  //     } catch (error) {
  //       console.error("Error fetching batches:", error);
  //     }
  //   };
  //   fetchBatchId();
  // }, [id]);

  // useEffect(() => {
  //   const fetchSlotId = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/coach-slot/fetch/${selectedBatch?._id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       const slotDataId = response.data.data;
  //       setSlotData(slotDataId);
  //     } catch (error) {
  //       console.error("Error fetching slots:", error);
  //     }
  //   };

  //   if (selectedBatch?._id) {
  //     fetchSlotId();
  //   }
  // }, [selectedBatch]);

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserData(decodedToken);
      } else {
        return;
      }
    };
    getTokenFromStorage();
  }, []);

  const handleBooking = async () => {
    if (!userData) {
      Swal.fire({
        title: "Not Logged in",
        text: "You need to be login to book a Personal Trainer. Click OK to login.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    if (!selectedTimeSlot || !selectedBatch) {
      Swal.fire({
        title: "Error",
        text: "Please select any slot.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const bookingData = {
      user_id: userData?.userID,
      coachId: id,
      start_date: startDate,
      end_date: endDate,
      start_time: selectedTimeSlot?.start_time,
      end_time: selectedTimeSlot?.end_time,
    }

    console.log(bookingData, "data for booking")

    try {
      navigate(`/coaches/coach-order-confirm/${id}`, {
        state: {
          bookingData,
          selectedTimeSlot,
        },
      });
    } catch (error) {
      console.error("Error making the booking:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during booking. Please select any slot.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  console.log(selectedTimeSlot, "time slot")

  return (
    <div>
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb mb-0 top-margin">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Book Coach</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Book Coach</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        <section className="booking-steps py-30">
          <div className="container">
            <ul className="d-xl-flex justify-content-center align-items-center">
              <li className="active">
                <h5>
                  {/* <Link to={`/coaches/coach-timedate/${id}`}> */}
                  <Link to={``}>
                    <span>1</span>Time &amp; Date
                  </Link>
                </h5>
              </li>
              <li>
                <h5>
                  {/* <Link to={`/coaches/coach-order-confirm/${id}`}> */}
                  <Link to={``}>
                    <span>2</span>Order Confirmation
                  </Link>
                </h5>
              </li>
              {/* <li>
                <h5>
                  <Link to={`/coaches/coach-payment/${id}`}>
                    <span>3</span>Payment
                  </Link>
                </h5>
              </li> */}
            </ul>
          </div>
        </section>
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <section className="card mb-40">
              <div className="text-center mb-40">
                <h3 className="mb-1">Time &amp; Date</h3>
                <p className="sub-title">
                  Book your training session at a time and date that suits your
                  needs.
                </p>
              </div>
              {/* <div className="master-academy dull-whitesmoke-bg card">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-100 coach-book-img"
                        src={
                          coachData?.profile_picture?.[0]?.src
                            ? `${IMG_URL}${coachData.profile_picture[0].src}`
                            : "/assets/img/profiles/avatar-06.jpg"
                        }
                        alt="User"
                      />
                    </Link>
                    <div className="info">
                      <div className="d-flex justify-content-start align-items-center mb-3">
                        <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                          4.5
                        </span>
                        <span>300 Reviews</span>
                      </div>
                      <h3 className="mb-2">
                        {coachData?.first_name} {coachData?.last_name}
                      </h3>
                      <p>
                        Certified Coach with a deep understanding of
                        the sport&apos;s strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
            </section>
            <div className="row text-center">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                <div className="card time-date-card">
                  <section className="booking-date">
                    <div className="list-unstyled date-slider mb-40">
                      <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#batchModal">
                        Select Batch
                      </button>
                      {/* -=-=-=-=-=-=-=-=-=-modal 1 -=-=-=-=-=-=-=-=-= */}
                      <div className="modal fade" id="batchModal" tabIndex={-1} aria-labelledby="batchModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="batchModalLabel">Select Batch</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                {['Monthly', 'Quarterly', 'Half-Yearly', 'Annually', 'Custom'].map((batchOption) => (
                                  <div key={batchOption} className="form-check d-flex gap-2 mb-3 align-items-center">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="batchOption"
                                      id={batchOption}
                                      value={batchOption}
                                      checked={selectedBatch === batchOption}
                                      onChange={handleRadioChange}
                                    />
                                    <label className="form-check-label" htmlFor={batchOption}>
                                      {batchOption}
                                    </label>
                                  </div>
                                ))}
                              </div>

                              <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#dateModal"
                                  data-bs-dismiss="modal"
                                  disabled={isNextButtonDisabled}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -=-=-=-=-=-=-=-=-=-modal 1 -=-=-=-=-=-=-=-=-= */}
                      {/* -=-=-=-=-=-=-=-=-=-modal 2 -=-=-=-=-=-=-=-=-= */}
                      <div className="modal fade" id="dateModal" tabIndex={-1} aria-labelledby="dateModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="dateModalLabel">Select Start and End Date</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label htmlFor="startDate" className="form-label">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="startDate"
                                  value={startDate || ''}
                                  onChange={handleStartDateChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">End Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="endDate"
                                  value={endDate || ''}
                                  onChange={handleEndDateChange}
                                  disabled={selectedBatch === 'Monthly' || selectedBatch === 'Quarterly' || selectedBatch === 'Annually' || selectedBatch === 'Half-Yearly'}
                                />
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#batchModal" data-bs-dismiss="modal">back</button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#slotModal"
                                data-bs-dismiss="modal"
                                disabled={isNextButtonDisabledTwo}
                                onClick={() => getSlotById(dateId)}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -=-=-=-=-=-=-=-=-=-modal 2 -=-=-=-=-=-=-=-=-= */}
                      {/* -=-=-=-=-=-=-=-=-=-modal 3 -=-=-=-=-=-=-=-=-= */}
                      <div className="modal fade" id="slotModal" tabIndex={-1} aria-labelledby="slotModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="slotModalLabel">Select Time Slot</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
                                {timeSlot?.slots?.map((slot: any) => (
                                  <div
                                    key={slot.id}
                                    className={`slot-item col-md-5 col-lg-5 ${slot.isBooked ? 'disabled' : ''} ${selectedTimeSlot?._id === slot._id ? "selected" : ""}`}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                  >
                                    <div>Time: {slot.start_time} - {slot.end_time}</div>
                                    <div>Price: ₹{slot.price}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#dateModal" data-bs-dismiss="modal">back</button>
                              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* -=-=-=-=-=-=-=-=-=-modal 3 -=-=-=-=-=-=-=-=-= */}

                      {/* <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Select Batch
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {batchData
                            ? batchData.map((batch) => (
                              <Dropdown.Item
                                key={batch._id}
                                onClick={() => setSelectedBatch(batch)}
                              >
                                {batch.batchName}-
                                {new Date(batch.batchDate).toLocaleDateString(
                                  "en-IN"
                                )}
                              </Dropdown.Item>
                            ))
                            : ""}
                        </Dropdown.Menu>
                      </Dropdown> */}
                    </div>
                    {/* {selectedBatch && (
                      <div className="slots">
                        <div className="batch-data">
                          <div className="batch-name">
                            Batch Name : {selectedBatch.batchName}
                          </div>
                          <div className="batch-name">
                            Start On :{" "}
                            {new Date(
                              selectedBatch.batchDate
                            ).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                        <div className="slots-data">
                          <h5>Available Slots</h5>
                          <div className="slot-list row">
                            {slotData?.slots?.map((slot: any) => (
                              <div
                                key={slot._id}
                                className={`slot-item col-md-5 col-lg-5 ${selectedTimeSlot?._id === slot._id ? "selected" : ""} ${slot.isBooked ? "disabled" : ""}`}
                                onClick={() => setSelectedTimeSlot(slot)}
                              >
                                <div>
                                  Time : {slot.startTime} - {slot.endTime}
                                </div>
                                <div>Price : ₹{slot.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )} */}
                    <div className="row"></div>
                  </section>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                <aside className="card booking-details">
                  <h3 className="border-bottom">Booking Details</h3>
                  <ul>
                    <li>
                      <i className="feather-calendar me-2" />
                      {startDate && endDate ? `${startDate} - ${endDate}` : "Select a date"}
                    </li>
                    <li>
                      <i className="feather-clock me-2" />
                      {selectedTimeSlot
                        ? `${selectedTimeSlot?.start_time} to ${selectedTimeSlot?.end_time}`
                        : "Select a time slot"}
                    </li>
                  </ul>
                  <div className="d-grid btn-block">
                    <button type="button" className="btn btn-primary">
                      Subtotal : ₹
                      {selectedTimeSlot ? selectedTimeSlot.price * (daysDifference+1 || 1) : 0}
                    </button>
                  </div>
                </aside>
              </div>
            </div>
            <div className="text-center btn-row">
              <Link
                className="btn btn-primary me-3 btn-icon"
                to={`/coaches/coach-timedate/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <button
                className="btn btn-secondary btn-icon"
                onClick={handleBooking}
              >
                Next <i className="feather-arrow-right-circle ms-1" />
              </button>
            </div>
          </div>
          {/* /Container */}
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default CoachTimeDate;
