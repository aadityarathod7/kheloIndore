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
        <div className="breadcrumb mb-0 top-margin">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Book Venues</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Book Venues</li>
            </ul>
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
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                <div className="card time-date-card">
                  <section className="booking-date">
                    <div className="list-unstyled owl-carousel date-slider owl-theme mb-40">
                      <div className="booking-date-item">
                        {
                          dateData.length > 0 ? (<DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            className="form-control"
                            placeholderText="Select Date"
                            dateFormat="dd/MM/yyyy"
                            minDate={minDate}
                            // highlightDates={highlightDates}
                            filterDate={(date) =>
                              highlightDates.some(
                                (highlightDate) =>
                                  highlightDate.toDateString() === date.toDateString()
                              )
                            }
                          />):("No slots are available at the moment.")
                        }
                        {/* <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {selectedDate ? formatDate(selectedDate) : 'Select Date'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {
                              formateDateData?.map((data, index) => (
                                <Dropdown.Item key={index} onClick={() => handleSelect(data?.id, data?.date)}>
                                  {formatDate(data?.date)}
                                </Dropdown.Item>
                              ))
                            }
                          </Dropdown.Menu>
                        </Dropdown> */}
                      </div>
                    </div>
                    <div className="row">
                      {slots?.map((slot: any, index) => (
                        <div key={index} className="col-12 col-sm-4 col-md-3">
                          <div
                            className={`time-slot ${slot.isChecked ? "checked" : ""} ${slot.isBooked ? "disabled" : "active"}`}
                            onClick={() => handleSlotClick(index)}
                          >
                            <div className="booking-info">
                              <span className="time">
                                <i className="feather-clock me-2" />
                                {slot?.startTime}-{slot?.endTime}
                              </span>
                              <div className="price-container">
                                <span className="price">
                                  <span className="per-hour">₹</span>
                                  {slot?.price}
                                </span>
                              </div>
                            </div>
                            {/* <i className="fa-regular fa-check-circle" /> */}
                          </div>
                        </div>
                      ))}
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
                className="btn btn-primary me-3 btn-icon"
                to={`/sports-venue`}
              // to={`/sports-venue/venue-details/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <Link
                className="btn btn-secondary btn-icon"
                // to={`/coaches/coach-order-confirm/${id}`}
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
