


import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Swal from 'sweetalert2';


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
  profile_picture: any;
  src: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  _id: string;
  email: any;
  mobile: number;
}

const CoachOrderConfirm = (props: any) => {
  const routes = all_routes;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [coachData, setCoachData] = useState<CoachData | null>(null);
  const { id } = useParams<{ id: string }>();

  const { bookingData, selectedTimeSlot } = state || {};

  console.log(bookingData, "confirm data")
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetch-coach/${id}`);
        const coachDataId = response.data.coach;
        setCoachData(coachDataId);
      } catch (error) {
        console.error("Error fetching coach data:", error);
      }
    };
    fetchCoachData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alert("Order is Confirmed");
    // navigate(`/coaches/coach-payment/${id}`, {
    //   state: {  selectedBatch, selectedTimeSlot, subtotal},
    // });

    // Swal.fire({
    //   title: 'Order Confirmed',
    //   text: 'Your order is confirmed.',
    //   icon: 'success',
    //   confirmButtonText: 'OK'
    // }).then(() => {
    //   navigate(`/coaches/coach-payment/${id}`, {
    //     state: { bookingData },
    //   });
    // });
    try {
      const response = await axios.post(
        `${API_URL}/coach/payment`,
        bookingData
      );

      if (response && response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error('The response does not contain a URL');
      }
      // navigate(`/coaches/coach-order-confirm/${id}`, {
      //   state: {
      //     bookingData,selectedTimeSlot
      //   },
      // });
    } catch (error) {
      console.error("Error making the booking:", error);
      Swal.fire({
        title: "Error",
        text: "Error in booking",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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
              <li>
                <h5>
                  {/* <Link to={`/coaches/coach-timedate/${id}`}> */}
                  <Link to={``}>
                    <span>1</span>Time & Date
                  </Link>
                </h5>
              </li>
              <li className="active">
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
            <div className="text-center mb-40">

            <h3 className="mb-1">Order Confirmation</h3>
            </div> 
            {/* <section className="card mb-40">
              <div className="text-center mb-40">
                 <p className="sub-title">
                  Booking confirmed. Contact support for changes/enquiries.
                  Enjoy your coaching experience with us.
                </p>  
              </div>
              <div className="master-academy dull-whitesmoke-bg card">
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
                        the sport&#39;s strategies.
                      </p>
                    </div> 
                  </div>
                   <div className="white-bg">
                    <p className="mb-1">Starts From</p>
                    <h3 className="d-inline-block primary-text mb-0">
                      ₹{coachData?.price}
                    </h3>
                    <span>/hr</span>
                  </div> 
                </div>
              </div> 
            </section> */}
            <section className="card booking-order-confirmation">
              <h5 className="mb-3">Booking Details</h5>
              <ul className="booking-info d-lg-flex justify-content-between align-items-center W-100">
                <li>
                  <h6>Coach Name</h6>
                  <p>
                    {coachData?.first_name} {coachData?.last_name}
                  </p>
                </li>
                <li>
                  <h6>Date</h6>
                  <p>{bookingData ? `${new Date(bookingData.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                   -${new Date(bookingData.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}` : "N/A"}</p>
                </li>
                <li>
                  <h6>Time</h6>
                  <p>
                    {bookingData
                      ? `${bookingData.start_time} to ${bookingData.end_time}`
                      : "N/A"}
                  </p>
                </li>
              </ul>
              <h5 className="mb-3">Contact Information</h5>
              <ul className="contact-info d-lg-flex justify-content-between align-items-center">
                <li>
                  <h6>Name</h6>
                  <p>  {coachData?.first_name} {coachData?.last_name}</p>
                </li>
                <li>
                  <h6>Contact Email Address</h6>
                  <p>{coachData?.email}</p>
                </li>
                <li>
                  <h6>Phone Number</h6>
                  <p>{coachData?.mobile}</p>
                  <p></p>
                </li>
              </ul>
              {/* <h5 className="mb-3">Payment Information</h5>
              <ul className="payment-info d-lg-flex justify-content-start align-items-center">
                <li>
                  <h6>Subtotal</h6>
                  <p className="primary-text">₹{bookingData?.total_price}</p>
                </li>
              </ul> */}
            </section>
            <div className="text-center btn-row">
              <Link
                className="btn btn-primary me-3 btn-icon"
                to={`/coaches/coach-timedate/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <button
                className="btn btn-secondary btn-icon"
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

export default CoachOrderConfirm;
