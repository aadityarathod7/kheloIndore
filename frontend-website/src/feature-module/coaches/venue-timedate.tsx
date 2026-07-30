import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, redirect, useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isWithinInterval } from "date-fns";
import { Slot } from "yet-another-react-lightbox/*";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Dropdown from "react-bootstrap/Dropdown";

interface BookData {
  _id: number;
  venue_id: number;
  date: string;
  slots: any;
}

type TimeSlot = {
  slot_id: any;
  time: string;
  isActive: boolean;
  isChecked: boolean;
  slots: any;
};

interface VenueData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  amenities: string;
  activities: string;
  category: string;
  images: any;
  src: string;
  _id: string;
  price_per_hr: number;
  vendor_type?: string;
}

interface JwtPayload {
  first_name: string;
  userID: string;
}

interface FormatedDate {
  id: any;
  date: any;
}

interface Slots {
  price: any;
  startTime: number;
  endTime: number;
}

const VenueTimeDate = () => {
  const routes = all_routes;
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  // const [startDate, setStartDate] = useState<Date | null>(new Date());
  const endDate = addDays(new Date(), 14);
  const [bookData, setBookData] = useState<BookData[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [newSelectedTimeId, setNewSelectedTimeId] = useState<number>();

  const [dateData, setDateData] = useState([]);
  const [formateDateData, setFormateDateData] = useState<FormatedDate[]>([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDateId, setSelectedDateId] = useState();
  const [slots, setSlots] = useState<Slots[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchSlots = async () => {
    try {
      const venue_id = id;

      const response = await axios.get(
        `${API_URL}/venue/fetch-all-slot/${venue_id}`
      );

      setDateData(response.data.data);

      const fetchVenueId = async () => {
        try {
          const response = await axios.get(`${API_URL}/venue/individual/${id}`);
          const venueData = response.data.venue;
          setVenueData(venueData);
        } catch (error) {
          console.error("Error fetching venues:", error);
        }
      };
      await fetchVenueId();

      const bookData = response.data.data;
      if (Array.isArray(bookData)) {
        const mappedData = bookData?.map((book) => ({
          date: book.date,
          _id: book.id,
          venue_id: book.venue_id,
          slots: book.slots,
        }));
        setBookData(mappedData);
      } else {
        setBookData(bookData);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  useEffect(() => {
    const formatedDate = dateData?.map((data: any) => ({
      id: data?._id,
      date: data?.date,
    }));
    setFormateDateData(formatedDate);
  }, [dateData]);

  const highlightDates = dateData.map((data: any) => new Date(data.date));

  const handleSelect = (id: any, date: any) => {
    setSelectedDate(date);
    setSelectedDateId(id);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    const fetchSlotsData = async () => {
      try {
        const slotId = selectedDateId;
        const response = await axios.get(
          `${API_URL}/get/venue/fetch-slot/${slotId}`
        );

        setSlots(response?.data?.data?.slots);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchSlotsData();
  }, [selectedDateId]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const selectedData = formateDateData.find(
        (data) => new Date(data.date).toDateString() === date.toDateString()
      );
      if (selectedData) {
        setSelectedDateId(selectedData.id);
      }
    }
  };


  console.log(selectedDate, "date-=-=-=-=-");
  console.log(selectedDateId, "id=-=-=-=-=idididid");
  console.log(formateDateData, "formateDateData");


  const handleSlotClick = (index: any) => {
    setSlots((prevSlots: any) =>
      prevSlots.map((slot: any, i: any) => ({
        ...slot,
        isChecked: i === index ? !slot.isChecked : slot.isChecked,
      }))
    );
  };

  // const handleSlotClick = (index: number) => {
  //   setSlots((prevSlots:any) =>
  //     prevSlots.map((slot:any, i:any) => {
  //       if (i === index && !slot.isBooked) { // Remove the isBooked condition
  //         return {
  //           ...slot,
  //                      isChecked: !slot.isChecked,
  //         };
  //       }
  //       return slot;
  //     })
  //   );
  // };

  const selectedSlots = slots.filter((slot: any) => slot.isChecked);

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

  useEffect(() => {
    const totalPrice = timeSlots
      .filter((slot: any) => slot.isChecked)
      .reduce((total: number, slot: TimeSlot) => {
        const slotIndex = timeSlots.findIndex((ts) => ts === slot);
        const price = parseFloat(bookData.slots[slotIndex]?.price || "0");
        return total + price;
      }, 0);

    setNewSelectedTimeId(totalPrice);
  }, [timeSlots]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [timeSlotId, setTimeSlotId] = useState<any[]>();

  useEffect(() => {
    const timeSlotId = timeSlots
      .filter((slot) => slot.isChecked)
      .map((slot) => slot.slot_id);

    setTimeSlotId(timeSlotId);
  }, [timeSlots]);

  // const todayDate = selectedDate?.toLocaleDateString("en-CA");
  const data = {
    user_id: userData?.userID,
    venue_id: venueData?._id,
    // date: todayDate,
    slotsBooked: timeSlotId,
    total_price: newSelectedTimeId,
  };
  const [inputData, setInputdata] = useState(data);

  const handleData = (e: any) => {
    setInputdata({ ...inputData, [e.target.name]: e.target.value });
  };

  const formatSeletedDate = formatDate(selectedDate);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    } else {
      if (selectedSlots.length > 0 && selectedDate) {
        navigate(`/sports-venue/venue-confirm/${id}`, {
          state: {
            venueData,
            selectedDate,
            timeSlots,
            bookData,
            newSelectedTimeId,
            data,
            selectedSlots,
          },
        });
      } else {
        Swal.fire({
          title: "",
          text: "Please select any slot",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        });
      }
    }
  };

  const featuredVenuesSlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate());

  console.log(minDate, "minDate=--=--=--=-=-");

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
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                Book <span style={{ color: "#22C55E", marginLeft: "12px" }}>Venue</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Pick your date, time slot, and book the perfect sports venue</p>
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Book Venue</span>
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
                  <Link to={`/sportsvenue/venue-payment/${id}`}>
                    <span>3</span>Payment
                  </Link>
                </h5>
              </li> */}
            </ul>
          </div>
        </section>

        <div className="content">
          <div className="container">
            {/* <section className="card mb-40">
              <div className="text-center mb-40">
                <h3 className="mb-1">Time &amp; Date</h3>
                <p className="sub-title">
                  Book your training session at a time and date that suits your
                  needs.
                </p>
              </div>
              <div className="master-academy dull-whitesmoke-bg card">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center1">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-10 imgwidth"
                        src={
                          venueData?.images[0]?.src
                            ? `${IMG_URL}${venueData?.images[0]?.src}`
                            : "/assets/img/venues/venues-01.jpg"
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
                      <h3 className="mb-2"> {venueData?.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
            <div className="row text-center">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8 text-start">
                
                {/* Card 1: Select Booking Date */}
                <div className="card time-date-card mb-4" style={{ padding: "24px", borderRadius: "16px" }}>
                  <h4 className="mb-3" style={{ color: "#0F172A", fontWeight: "700" }}>
                    <i className="feather-calendar me-2" style={{ color: "#22C55E" }} />
                    Select Booking Date
                  </h4>
                  <div className="d-flex justify-content-center align-items-center py-2" style={{ background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                    {dateData.length > 0 ? (
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        inline
                        minDate={minDate}
                        filterDate={(date) =>
                          highlightDates.some(
                            (highlightDate) =>
                              highlightDate.toDateString() === date.toDateString()
                          )
                        }
                      />
                    ) : (
                      <div className="text-muted py-4">No slots are available at the moment.</div>
                    )}
                  </div>
                </div>

                {/* Card 2: Available Time Slots */}
                <div className="card time-date-card" style={{ padding: "24px", borderRadius: "16px" }}>
                  <h4 className="mb-4" style={{ color: "#0F172A", fontWeight: "700" }}>
                    <i className="feather-clock me-2" style={{ color: "#22C55E" }} />
                    Available Time Slots
                  </h4>
                  <section className="booking-date">
                    {selectedDate ? (
                      slots && slots.length > 0 ? (
                        <div className="row">
                          {slots.map((slot: any, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-xl-3">
                              <div
                                className={`time-slot ${slot.isChecked ? "checked" : ""} ${slot.isBooked ? "disabled" : "active"}`}
                                onClick={() => handleSlotClick(index)}
                              >
                                <div className="booking-info">
                                  <span className="time">
                                    <i className="feather-clock me-1" />
                                    {slot?.startTime} - {slot?.endTime}
                                  </span>
                                  <div className="price-container">
                                    <span className="price">
                                      <span className="per-hour">₹</span>
                                      {slot?.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted text-center py-4">No slots available for the selected date.</div>
                      )
                    ) : (
                      <div className="text-muted text-center py-5">
                        <i className="feather-calendar" style={{ fontSize: "48px", color: "#94A3B8", display: "block", marginBottom: "16px" }} />
                        <span style={{ fontSize: "16px", fontWeight: "500", color: "#64748B" }}>
                          Please select a date from the calendar above to view available slots.
                        </span>
                      </div>
                    )}
                  </section>
                </div>

              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                <aside className="card booking-details">
                  <h3 className="border-bottom">Booking Details</h3>
                  <ul>
                    <li>
                      <i className="feather-calendar me-2" />
                      Date: {selectedDate ? formatDate(selectedDate) : ""}
                    </li>
                    <li>
                      <i className="feather-clock me-2" />
                      Slots:{" "}
                      {selectedSlots
                        ?.map((slot) => `${slot.startTime}-${slot.endTime}`)
                        .join(", ")}
                    </li>
                    <li>
                      <i className="feather-clock me-2" />
                      Total Hour: {selectedSlots?.length} Hrs
                    </li>
                    <li>
                      <i className="feather-credit-card me-2" />
                      Subtotal: ₹{" "}
                      {slots
                        .filter((slot: any) => slot.isChecked)
                        .reduce((total, slot) => {
                          // Assuming `slot` contains a `price` property
                          return (total += slot?.price || 0);
                        }, 0)}
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
            <div className="text-center btn-row">
              <Link
                className="ki-btn-secondary me-3"
                to={venueData ? `/sports-venue/${venueData.vendor_type || "cricket-turf"}/${venueData.name?.replace(/\s+/g, "-").toLowerCase()}/${id}` : `/sports-venue`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <Link
                className="ki-btn-primary"
                onClick={handleSubmit}
                to={""}
              >
                Next <i className="feather-arrow-right-circle ms-1" />
              </Link>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default VenueTimeDate;
