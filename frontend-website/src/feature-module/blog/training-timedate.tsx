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
        <div className="content py-4" style={{ backgroundColor: "#F8FAFC" }}>
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
            <div className="row text-start">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                
                {/* Card 1: Subscription Batch */}
                <div className="card time-date-card mb-4" style={{ padding: "24px", borderRadius: "16px" }}>
                  <h4 className="mb-4" style={{ color: "#0F172A", fontWeight: "700" }}>
                    <i className="feather-calendar me-2" style={{ color: "#22C55E" }} />
                    Select Subscription Batch
                  </h4>
                  <div className="row gap-3 px-3">
                    {['Monthly', 'Quarterly', 'Half-Yearly', 'Annually', 'Custom'].map((batchOption) => (
                      <div 
                        key={batchOption} 
                        className="col-auto p-0"
                      >
                        <input
                          type="radio"
                          className="btn-check"
                          name="batchOption"
                          id={batchOption}
                          value={batchOption}
                          checked={selectedBatch === batchOption}
                          onChange={handleRadioChange}
                        />
                        <label 
                          className={`btn ${selectedBatch === batchOption ? 'btn-success' : 'btn-outline-secondary'}`}
                          htmlFor={batchOption}
                          style={{
                            borderRadius: "10px", 
                            padding: "10px 20px", 
                            fontWeight: "600",
                            border: selectedBatch === batchOption ? "none" : "1px solid #E2E8F0",
                            background: selectedBatch === batchOption ? "#22C55E" : "#F8FAFC",
                            color: selectedBatch === batchOption ? "#FFFFFF" : "#475569"
                          }}
                        >
                          {batchOption}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: Date Range */}
                <div className="card time-date-card mb-4" style={{ padding: "24px", borderRadius: "16px", opacity: selectedBatch ? 1 : 0.5, pointerEvents: selectedBatch ? "auto" : "none" }}>
                  <h4 className="mb-4" style={{ color: "#0F172A", fontWeight: "700" }}>
                    <i className="feather-calendar me-2" style={{ color: "#22C55E" }} />
                    Select Date Range
                  </h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="startDate" className="form-label" style={{ fontWeight: "600", color: "#475569" }}>Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate || ''}
                        onChange={handleStartDateChange}
                        style={{ padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="endDate" className="form-label" style={{ fontWeight: "600", color: "#475569" }}>End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={endDate || ''}
                        onChange={handleEndDateChange}
                        disabled={selectedBatch !== 'Custom'}
                        style={{ padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", background: selectedBatch !== 'Custom' ? "#F1F5F9" : "#FFFFFF" }}
                      />
                    </div>
                  </div>
                  {startDate && (
                    <div className="mt-2 text-end">
                      <button
                        type="button"
                        className="ki-btn-secondary btn-sm"
                        style={{ padding: "6px 16px", fontSize: "14px" }}
                        onClick={() => getSlotById(dateId)}
                        disabled={isNextButtonDisabledTwo}
                      >
                        Find Available Slots <i className="feather-search ms-1"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Booking Disclaimer */}
                <div className="card time-date-card mb-4" style={{ padding: "20px", borderRadius: "16px", background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <h4 className="mb-3" style={{ color: "#92400E", fontWeight: "700", fontSize: "15px" }}>
                    <i className="feather-alert-triangle me-2" style={{ color: "#D97706" }} />
                    Important Booking Notice
                  </h4>
                  <p style={{ color: "#78350F", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                    If you book this Coach/Trainer directly or through any platform other than Khelo Indore, Khelo Indore will not be responsible for any issues, disputes, or losses arising from such bookings.
                  </p>
                </div>

                {/* Card 3: Available Time Slots */}
                <div className="card time-date-card mb-4" style={{ padding: "24px", borderRadius: "16px", opacity: (!isNextButtonDisabledTwo && timeSlot?.slots) ? 1 : 0.5 }}>
                  <h4 className="mb-4" style={{ color: "#0F172A", fontWeight: "700" }}>
                    <i className="feather-clock me-2" style={{ color: "#22C55E" }} />
                    Available Time Slots
                  </h4>
                  {timeSlot?.slots ? (
                    timeSlot.slots.length > 0 ? (
                      <div className="row">
                        {timeSlot.slots.map((slot: any) => (
                          <div key={slot.id} className="col-sm-6 col-md-4 mb-3">
                            <div
                              className={`slot-item ${slot.isBooked ? 'disabled' : ''} ${selectedTimeSlot?._id === slot._id ? 'selected' : ''}`}
                              onClick={() => !slot.isBooked && setSelectedTimeSlot(slot)}
                              style={{ 
                                padding: "12px", 
                                border: selectedTimeSlot?._id === slot._id ? "2px solid #22C55E" : "1px solid #E2E8F0", 
                                borderRadius: "12px",
                                background: selectedTimeSlot?._id === slot._id ? "#F0FDF4" : "#F8FAFC",
                                cursor: slot.isBooked ? "not-allowed" : "pointer",
                                opacity: slot.isBooked ? 0.5 : 1
                              }}
                            >
                              <div style={{ fontWeight: "600", color: selectedTimeSlot?._id === slot._id ? "#16A34A" : "#334155" }}>
                                <i className="feather-clock me-1"></i> {slot.start_time} - {slot.end_time}
                              </div>
                              <div style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                                Price: ₹{slot.price} / session
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted text-center py-4">No slots available for the selected start date.</div>
                    )
                  ) : (
                    <div className="text-muted text-center py-5">
                      <i className="feather-calendar" style={{ fontSize: "48px", color: "#94A3B8", display: "block", marginBottom: "16px" }} />
                      <span style={{ fontSize: "16px", fontWeight: "500", color: "#64748B" }}>
                        Select dates and click Find Available Slots to view times.
                      </span>
                    </div>
                  )}
                </div>

              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                <aside className="card booking-details" style={{ position: "sticky", top: "120px" }}>
                  <h3 className="border-bottom">Booking Details</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ padding: "12px 0", borderBottom: "1px dashed #E2E8F0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: "#64748B", fontSize: "13px" }}>Batch Type</span>
                      <strong style={{ color: "#0F172A", fontSize: "15px" }}>{selectedBatch || "Not selected"}</strong>
                    </li>
                    <li style={{ padding: "12px 0", borderBottom: "1px dashed #E2E8F0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: "#64748B", fontSize: "13px" }}>Date Range</span>
                      <strong style={{ color: "#0F172A", fontSize: "15px" }}>
                        <i className="feather-calendar me-2" style={{ color: "#22C55E" }} />
                        {startDate && endDate ? `${startDate} to ${endDate}` : "Select a date range"}
                      </strong>
                    </li>
                    <li style={{ padding: "12px 0", borderBottom: "1px dashed #E2E8F0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: "#64748B", fontSize: "13px" }}>Time Slot</span>
                      <strong style={{ color: "#0F172A", fontSize: "15px" }}>
                        <i className="feather-clock me-2" style={{ color: "#22C55E" }} />
                        {selectedTimeSlot
                          ? `${selectedTimeSlot?.start_time} to ${selectedTimeSlot?.end_time}`
                          : "Select a time slot"}
                      </strong>
                    </li>
                  </ul>
                  <div className="d-grid mt-4">
                    <div style={{ background: "#F0FDF4", padding: "16px", borderRadius: "12px", border: "1px solid #DCFCE7", textAlign: "center" }}>
                      <span style={{ display: "block", color: "#166534", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Total Amount</span>
                      <strong style={{ fontSize: "28px", color: "#16A34A", fontWeight: "800" }}>
                        ₹{selectedTimeSlot ? selectedTimeSlot.price * (daysDifference+1 || 1) : 0}
                      </strong>
                    </div>
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
