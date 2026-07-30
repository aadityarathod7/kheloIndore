import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, useParams, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { all_routes } from "../router/all_routes";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from 'sweetalert2';


interface TrainerData {
  first_name: string;
  last_name: string;
  duration: string;
  focus_area: string[];
  price: number;
  profile_picture: any;
  src: string;
  _id: string;
}

interface BatchData {
  id: any;
  _id: string;
  Personal_trainer_id: string;
  batch_date: string;
  batch_name: string;
  package_type: string;
}

interface SlotData {
  _id: string;
  startTime: string;
  endTime: string;
  price: number;
  isBooked: boolean;
}

interface JwtPayload {
  first_name: string;
  userID: string;
}

const TrainingTimeDate = (props: any) => {
  const routes = all_routes;
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [batchData, setBatchData] = useState<BatchData[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // -=-=-=-=-=-=-=-=-=-=-=-=-New Code -=-=-=-=-=-=-=-=-=--
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
      const response = await axios.get(`${API_URL}/get-all-pt-slot/${id}`,
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
      const response = await axios.get(`${API_URL}/get-pt-slot-by-date/${dateId}`,
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
  // -=-=-=-=-=-=-=-=-=-=-=-=-New Code -=-=-=-=-=-=-=-=-=--

  useEffect(() => {
    const fetchTrainerId = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/PersonalTraining/fetch/${id}`
        );
        const trainerDataId = response.data.personalTrainer;
        setTrainerData(trainerDataId);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchTrainerId();
  }, [id]);

  useEffect(() => {
    const fetchBatchId = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/pt/batch/${id}`
        );
        const batchDataId = response.data.data;
        setBatchData(batchDataId);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatchId();
  }, [id]);

  useEffect(() => {
    const fetchSlotId = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/pt/batch/slot/${selectedBatch?.id}`
        );
        const slotDataId = response.data.data;
        setSlotData(slotDataId);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
    fetchSlotId();
  }, [selectedBatch]);


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
        title: 'Not Logged in',
        text: 'You need to be login to book a Personal Trainer. Click OK to login.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    if (!selectedTimeSlot || !selectedBatch) {
      alert("Please select a batch and a time slot.");
      return;
    }

    const bookingData = {
      user_id: userData?.userID,
      trainerId: id,
      start_date: startDate,
      end_date: endDate,
      start_time: selectedTimeSlot?.start_time,
      end_time: selectedTimeSlot?.end_time,
    };

    console.log(bookingData, "data for booking")

    try {
      navigate(`/personal-training/training-order-confirm/${id}`, {
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


  return (
    <div>
      <>
      <style dangerouslySetInnerHTML={{__html: `
        /* High contrast text and layout standardisation */
        .booking-steps {
          background-color: #FFFFFF !important;
          border-bottom: 1px solid #E2E8F0 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01) !important;
        }
        .booking-steps li a {
          color: #475569 !important;
          font-weight: 500 !important;
        }
        .booking-steps li.active a {
          color: #22C55E !important;
          font-weight: 700 !important;
        }
        .booking-steps li.active a span {
          background-color: #22C55E !important;
          color: #FFFFFF !important;
        }
        .booking-steps li a span {
          background-color: #F1F5F9 !important;
          color: #475569 !important;
        }
        
        /* Time & Date selector customisations */
        .time-date-card {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
          padding: 30px !important;
        }
        .booking-details {
          background-color: #FFFFFF !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
          padding: 24px !important;
        }
        .booking-details h3 {
          color: #0F172A !important;
          font-weight: 700 !important;
          border-bottom: 1px solid #E2E8F0 !important;
          padding-bottom: 15px !important;
          margin-bottom: 20px !important;
        }
        .booking-details li {
          color: #334155 !important;
          font-weight: 500 !important;
        }
        
        /* Modals and forms text color overrides */
        .modal-content {
          border-radius: 16px !important;
          border: none !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .modal-header h5 {
          color: #0F172A !important;
          font-weight: 700 !important;
        }
        .modal-body label {
          color: #334155 !important;
          font-weight: 600 !important;
        }
        
        /* Select Batch and confirm button overrides */
        .btn-success {
          background-color: #22C55E !important;
          border-color: #22C55E !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          border-radius: 10px !important;
        }
        .btn-success:hover {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
        }
        .btn-primary {
          background-color: #22C55E !important;
          border-color: #22C55E !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
        }
        .btn-primary:hover {
          background-color: #16A34A !important;
          border-color: #16A34A !important;
          color: #FFFFFF !important;
        }
        .btn-secondary {
          background-color: #F1F5F9 !important;
          border-color: #E2E8F0 !important;
          color: #475569 !important;
          font-weight: 600 !important;
          border-radius: 10px !important;
        }
        .btn-secondary:hover {
          background-color: #E2E8F0 !important;
          color: #334155 !important;
        }
        
        /* Custom buttons styling overrides */
        .ki-btn-primary {
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%) !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 50px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          padding: 12px 30px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3) !important;
          text-decoration: none !important;
          cursor: pointer !important;
        }
        .ki-btn-primary:hover {
          background: linear-gradient(135deg, #16A34A 0%, #15803D 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4) !important;
        }
        .ki-btn-primary * {
          color: #FFFFFF !important;
        }
        
        .ki-btn-secondary {
          background: #FFFFFF !important;
          color: #475569 !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: 50px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          padding: 12px 30px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
          text-decoration: none !important;
          cursor: pointer !important;
        }
        .ki-btn-secondary:hover {
          background: #F8FAFC !important;
          border-color: #94A3B8 !important;
          color: #0F172A !important;
        }
        .ki-btn-secondary * {
          color: #475569 !important;
        }
        
        /* Slots items selector styling */
        .slot-item {
          border: 1px solid #E2E8F0 !important;
          border-radius: 12px !important;
          padding: 16px !important;
          margin-bottom: 16px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          background-color: #F8FAFC !important;
          color: #334155 !important;
          font-weight: 500 !important;
        }
        .slot-item:hover:not(.disabled) {
          border-color: #22C55E !important;
          background-color: #F0FDF4 !important;
        }
        .slot-item.selected {
          border-color: #22C55E !important;
          background-color: #22C55E !important;
          color: #FFFFFF !important;
        }
        .slot-item.disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
      `}} />
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Book <span style={{ color: "#22C55E", marginLeft: "12px" }}>Trainer</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Select your preferred time slot and schedule your training session</p>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Book Personal Trainer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <section className="booking-steps py-30">
          <div className="container">
            <ul className="d-xl-flex justify-content-center align-items-center">
              <li className="active">
                <h5>
                  <Link to={``}>
                    <span>1</span>Time &amp; Date
                  </Link>
                </h5>
              </li>
              <li>
                <h5>
                  <Link to={``}>
                    <span>2</span>Order Confirmation
                  </Link>
                </h5>
              </li>
              {/* <li>
                <h5>
                  <Link to={`/personal-training/training-payment/${id}`}>
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
              <div className="master-academy dull-whitesmoke-bg card">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-100 coach-book-img"
                        src={
                          trainerData?.profile_picture
                            ? `${IMG_URL}${trainerData?.profile_picture[0]?.src}`
                            : "/assets/img/featured/featured-06.jpg"
                        }
                        alt="User"
                      />
                    </Link>
                    <div className="info">
                      <h3 className="mb-2">{trainerData?.first_name} {trainerData?.last_name}</h3>
                      <p>
                        Certified Coach with a deep understanding of
                        the sport&apos;s strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="row text-center">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                <div className="card time-date-card">
                  <section className="booking-date">
                    <div className="list-unstyled owl-carousel date-slider owl-theme mb-40">
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
                          {batchData && batchData.length > 0 ? (
                            batchData.map((batch) => (
                              <Dropdown.Item
                                key={batch._id}
                                onClick={() => setSelectedBatch(batch)}
                              >
                                {batch.batch_name}
                              </Dropdown.Item>
                            ))
                          ) : (
                            <Dropdown.Item>No available batches</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown> */}

                      {/* {selectedBatch ? (
                        <div className="trainer-slots-data">
                          <div className="trainer-slot-name">
                            <div className="trainer-slot-name-data">Batch Name : {selectedBatch?.batch_name}</div>
                            <div className="trainer-slot-name-data">
                              Start On : {new Date(
                                selectedBatch?.batch_date
                              ).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                          {slotData.map((slot) => (
                            <div
                              key={slot._id}
                              className="time-slot"
                              onClick={() => setSelectedTimeSlot(slot)}
                              style={{
                                cursor: "pointer",
                                padding: "10px",
                                border: "2px solid",
                                marginBottom: "10px",
                                color:
                                  selectedTimeSlot?._id === slot._id 
                                    ? "#ff5f1f"
                                    : "#4a4242",
                                borderColor:
                                  selectedTimeSlot?._id === slot._id
                                    ? "#ff5f1f"
                                    : "#8b8a89",
                              }}
                            >
                              <p>
                                Time : {slot.startTime} - {slot.endTime}
                              </p>
                              <p>Price: ₹{slot.price}</p>
                              <p>{slot.isBooked ? "Booked" : "Available"}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )} */}
                    </div>
                  </section>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                <aside className="card booking-details">
                  <h3 className="border-bottom">Booking Details</h3>
                  <ul>
                    <li>
                      <i className="feather-calendar me-2" />
                      <span>{startDate ? `${startDate} To ${endDate}`:"Select a date"}</span>
                    </li>
                    <li>
                      <i className="feather-clock me-2" />
                      <span>
                        {selectedTimeSlot
                          ? `${selectedTimeSlot?.start_time} - ${selectedTimeSlot?.end_time}`
                          : "None"}
                      </span>
                    </li>
                  </ul>
                  <div className="d-grid btn-block">
                    <button type="button" className="btn btn-primary">
                      Subtotal :
                      <span>
                        ₹{selectedTimeSlot ? selectedTimeSlot.price * (daysDifference+1 || 1) : 0}
                      </span>
                    </button>
                  </div>
                </aside>
              </div>

              <div className="text-center btn-row">
                <Link
                  className="ki-btn-secondary me-3"
                  to={trainerData ? `/personal-training/trainer/${(trainerData.first_name + '-' + (trainerData.last_name || '')).replace(/\s+/g, '-').toLowerCase()}/${id}` : '/personal-training'}
                >
                  <i className="feather-arrow-left-circle me-1" /> Back
                </Link>
                <button
                  className="ki-btn-primary"
                  onClick={handleBooking}
                >
                  Next <i className="feather-arrow-right-circle ms-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* /Page Content */}
      </>
    </div>
  );
};

export default TrainingTimeDate;
