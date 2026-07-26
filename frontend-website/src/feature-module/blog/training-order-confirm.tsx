

import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { API_URL, IMG_URL } from "../../ApiUrl";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import Swal from 'sweetalert2';

interface TrainerData {
  first_name: string;
  last_name: string;
  duration: string;
  focus_area: string[];
  price: number;
  profile_picture: any;
  src: string;
  email: string;
  mobile: number;
}

const TrainingOrderConfirm = (props: any) => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  const idData = useParams();
  const id = idData.id;
  const location = useLocation();
  const { bookingData } = location.state || {};
  console.log(bookingData, "lkajsdfhlksdafgh")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Fetch coach data from API
    const fetchTrainerId = async () => {
      try {
        const response = await axios.get(`${API_URL}/PersonalTraining/fetch/${id}`);
        const trainerDataId = response.data.personalTrainer;
        setTrainerData(trainerDataId);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainerId();
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
        `${API_URL}/personalTrainer/payment`,
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

  console.log(bookingData, "bookingDatabookingData")

  return (
    <div>
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb mb-0 top-margin">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Book Personal Trainer</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Book Personal Trainer</li>
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
            <div className="text-center mb-40">
              <h3 className="mb-1">Order Confirmation</h3>
              </div>
            {/* <section className="card mb-40">
              <div className="text-center mb-40">
                <h3 className="mb-1">Order Confirmation</h3>
                <p className="sub-title">
                  Booking confirmed. Contact support for changes/inquiries.
                  Enjoy your coaching experience with us.
                </p>
              </div>
              <div className="master-academy dull-whitesmoke-bg card">
                <div className="d-sm-flex justify-content-between align-items-center">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <Link to="#">
                      <ImageWithBasePath
                        className="corner-radius-100 coach-book-img"
                        src={trainerData?.profile_picture ? `${IMG_URL}${trainerData.profile_picture[0].src}` : "/assets/img/featured/featured-06.jpg"}
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
                      <h3 className="mb-2">{trainerData?.first_name} {trainerData?.last_name}</h3>
                      <p>
                        Certified Coach with a deep understanding of
                        the sport&apos;s strategies.
                      </p>
                    </div>
                  </div>
                  <div className="white-bg">
                    <p className="mb-1">Starts From</p>
                    <h3 className="d-inline-block primary-text mb-0">₹{trainerData?.price}</h3>
                    <span>/hr</span>
                  </div> 
                </div>
              </div>
            </section> */}
            <section className="card booking-order-confirmation">
              <h5 className="mb-3">Booking Details</h5>
              <ul className="booking-info d-lg-flex justify-content-between align-items-center">
                <li>
                  <h6>Coach Name</h6>
                  <p>{trainerData?.first_name} {trainerData?.last_name}</p>
                </li>
                <li>
                  <h6>Appointment Date</h6>
                  <p>{bookingData ? `${new Date(bookingData.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                   -${new Date(bookingData.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}` : "N/A"}</p>
                </li>
                <li>
                  <h6>Appointment time</h6>
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
                  <p>{trainerData?.first_name} {trainerData?.last_name}</p>
                </li>
                <li>
                  <h6>Contact Email Address</h6>
                  <p>{trainerData?.email}</p>
                </li>
                <li>
                  <h6>Phone Number</h6>
                  <p>{trainerData?.mobile}</p>
                </li>
              </ul>
              {/* <h5 className="mb-3">Payment Information</h5>
              <ul className="payment-info d-lg-flex justify-content-start align-items-center">
                <li>
                  <h6>Subtotal</h6>
                  <p className="primary-text">₹{""}</p>
                </li>
              </ul> */}
            </section>
            <div className="text-center btn-row">
              <Link
                className="btn btn-primary me-3 btn-icon"
                to={`/personal-training/training-timedate/${id}`}
              >
                <i className="feather-arrow-left-circle me-1" /> Back
              </Link>
              <button
                type="button"
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

export default TrainingOrderConfirm;
