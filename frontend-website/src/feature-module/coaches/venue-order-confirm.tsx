import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from "sweetalert2";

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
  contact_number: string;
}

const VenueOrderConfirm = () => {
  const routes = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const {
    selectedDate,
    selectedSlots,
    timeSlots,
    bookData,
    newSelectedTimeId,
    formatSeletedDate,
    data,
  } = state || {};
  const { id } = useParams<{ id: string }>();
  const selectedTimeSlots = selectedSlots
    ? selectedSlots.filter((slot: any) => slot.isChecked)
    : [];
  const [slotIds, setSlotIds] = useState([]);
  const [slotITime, setSlotTime] = useState([]);
  const [formattedDate, setFormattedDate] = useState([]);
  const totalPrice = selectedTimeSlots.reduce(
    (total: number, slot: any) => total + (slot.price || 0),
    0
  );

  useEffect(() => {
    const slotId = selectedTimeSlots.map((slot: any) => slot._id);
    setSlotIds(slotId);
  }, []);

  useEffect(() => {
    const localDate = new Date(selectedDate);
    const formattedDate = localDate.toLocaleDateString("en-CA");
    setFormattedDate(formattedDate);
  }, [selectedDate]);

  // useEffect(() => {
  //   const slotIds = selectedTimeSlots.map((slot:any) => slot._id);

  //   return slotIds; // Note: Returning from useEffect doesn't work as expected for further use
  // }, [selectedTimeSlots])

  const bookingData = data;
  const venueId = bookingData?.venue_id;
  const userId = bookingData?.user_id;
  const slotId = bookingData?.slotsBooked;
  const date = bookingData?.date;
  const total_Price = bookingData?.totalPrice;

  //   const openNewWindow = () => {
  //     window.open('https://mercury-uat.phonepe.com/transact/simulator?token=3GobA5RNrRCwUWUccUBeyTBSCransuCxvBXLOIZMWZVrgKGdyyuZJ', '_blank');
  // };

  useEffect(() => {
    const fetchVenueId = async () => {
      try {
        const response = await axios.get(`${API_URL}/venue/individual/${id}`);
        const venueData = response.data.venue;
        setVenueData(venueData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenueId();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/venue/payment`, {
        user_id: userId,
        venue_id: venueId,
        date: formattedDate,
        slotsBooked: slotIds,
        total_price: totalPrice,
      });

      if (response && response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("The response does not contain a URL");
      }
    } catch (error) {
      console.error("An error occurred while processing the payment:", error);
      Swal.fire("Error", `An error occurred while processing the payment`, "error");
    }

    // Uncomment if you want to show a success message and then navigate
    // Swal.fire({
    //   title: 'Order Confirmed',
    //   text: 'Your order is confirmed.',
    //   icon: 'success',
    //   confirmButtonText: 'OK'
    // }).then(() => {
    //   navigate(`/sportsvenue/venue-payment/${id}`, {
    //     state: { selectedDate, timeSlots, bookData, newSelectedTimeId, responseData },
    //   });
    // });
  };

  return (
    <div>
      <>
        {/* Breadcrumb */}
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
        {/* /Breadcrumb */}
        <section className="booking-steps py-30">
          <div className="container">
            <ul className="d-xl-flex justify-content-center align-items-center">
              <li>
                <h5>
                  <Link to={``}>
                    <span>1</span>Time &amp; Date
                  </Link>
                </h5>
              </li>
              <li className="active">
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
        {/* Page Content */}
        <div className="content">
          <div className="container">
            {/* <section className="card mb-40">
              <div className="text-center mb-40">
                <h3 className="mb-1">Order Confirmation</h3>
                <p className="sub-title">
                  Booking confirmed. Contact support for changes/inquiries.
                  Enjoy your Venues experience with us.
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
                      <h3 className="mb-2">{venueData?.name}</h3>
                      <p>
                        Certified venues with a deep understanding of the
                        sport&apos;s strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
            <section className="card booking-order-confirmation">
              <h5 className="mb-3">Booking Details</h5>

              <ul className="booking-info d-lg-flex justify-content-between align-items-center w-100">
                <li>
                  <h6>Venue Name</h6>
                  <p>{venueData?.name}</p>
                </li>
                <li>
                  <h6>Booking Date</h6>
                  <p>
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString()
                      : ""}
                  </p>
                </li>
                <li>
                  <h6>Time Slots</h6>
                  <ul>
                    {selectedTimeSlots.length > 0 ? (
                      selectedTimeSlots.map((slot: any, index: number) => (
                        <li key={index}>
                          {slot.startTime} - {slot.endTime}
                        </li>
                      ))
                    ) : (
                      <li>No time slots selected</li>
                    )}
                  </ul>
                </li>
              </ul>

              <h5 className="mb-3">Payment Information</h5>
              <ul className="payment-info d-lg-flex justify-content-start align-items-center">
                <li>
                  <h6>Total Price </h6>
                  <p className="primary-text">{`₹${totalPrice}`}</p>
                </li>
              </ul>
            </section>
            <div className="text-center btn-row">
              <Link
                className="btn btn-primary me-3 btn-icon"
                to={`/sports-venue/venue-timedate/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>

              <button
                className="btn btn-secondary btn-icon"
                // onClick={openNewWindow}
                onClick={handleSubmit}
              >
                Pay Now <i className="feather-arrow-right-circle ms-1" />
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

export default VenueOrderConfirm;
