import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Slider from "react-slick";

interface EventData {
  event_name: string;
  location: any;
  description: string;
  start_date: number;
  end_date: number;
  terms_and_conditions: string;
  _id: number;
  price: number;
  organized_by: string;
  images: string[];
}

const EventDetails = (_props: { id: any }) => {
  const route = all_routes;
  const [eventData, setEventData] = useState<EventData>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Fetch event data from API
    const fetchEventsId = async () => {
      try {
        const response = await axios.get(`${API_URL}/event/get/${id}`);
        const eventData = response.data.data;
        setEventData(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventsId();
  }, []);


  return (
    <>
      <div className="main-wrapper event-details-page top-margin">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Event Details</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Event Details</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <section className="detail-info">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 offset-md-1 col-md-10 col-lg-10">
                  <div className="wrapper">
                    <div className="banner">
                      <div className="text-center">
                        <ImageWithBasePath
                          src="assets/img/events/banner-01.jpg"
                          className="img-fluid"
                          alt="Banner"
                        />
                      </div>
                      <div className="white-bg info d-lg-flex justify-content-between align-items-center">
                        <div className="description">
                          <h6>{eventData?.event_name}</h6>
                        </div>
                        <div className="d-flex align-items-center time">
                          <i className="feather-clock d-flex justify-content-center align-items-center" />
                          <div className="text">
                            <h6>
                              {/* {eventData?.start_date} <br /> To{" "}
                              {eventData?.end_date} */}
                               {new Date(eventData?.start_date).toLocaleDateString("en-IN")} <br/> To{" "} <br/>
                               {new Date(eventData?.end_date).toLocaleDateString("en-IN")}{" "}
                            </h6>
                            {/* <span>08:00 AM</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center address">
                          <i className="feather-map-pin d-flex justify-content-center align-items-center" />
                          <div className="text">
                            <h6>
                              {/* 66 Broklyn Golden Street <br /> New York, USA */}
                              {eventData?.location}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="seat-booking">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                          <h3>{eventData?.event_name}</h3>
                          <p>{eventData?.description}</p>
                          <p>
                            {" "}
                            Price: &nbsp;
                            {eventData?.price}
                          </p>
                          <p>
                            {" "}
                            Location: &nbsp;
                            {eventData?.location}
                          </p>
                          <p>
                            {" "}
                            Organized by: &nbsp;
                            {eventData?.organized_by}
                          </p>
                          <p>
                            {" "}
                            Terms and Conditions: &nbsp;
                            {eventData?.terms_and_conditions}
                          </p>
                          <button type="button" className="btn btn-primary">
                            Book A Seat
                          </button>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                          <div className="google-maps">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2967.8862835683544!2d-73.98256668525309!3d41.93829486962529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89dd0ee3286615b7%3A0x42bfa96cc2ce4381!2s132%20Kingston%20St%2C%20Kingston%2C%20NY%2012401%2C%20USA!5e0!3m2!1sen!2sin!4v1670922579281!5m2!1sen!2sin"
                              height={600}
                              style={{ border: 0 }}
                              allowFullScreen={true}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="gallery-heading">
              <h2 className="row justify-content-center">Sneak Peek into the Excitement Ahead</h2>
            </div>
            <div className="row event-img">
              {eventData?.images.map((data,index)=>(
                <ImageWithBasePath
                key={index}
                src={`${IMG_URL}${data.src}`}
                className="col-md-4 col-lg-4 img-fluid event-img-data"
                alt="Banner"
                />
              ))}
            </div>
          </section>
          {/* <section className="section event-booking">
            <div className="container">
              <div className="row">
                <div className="col-12 offset-sm-12 offset-md-2 col-md-8 col-lg-8">
                  <div className="text-center mb-40">
                    <h3>Book an Event</h3>
                    <p>
                      Hi, we are always open for cooperation and suggestions,{" "}
                      <br /> contact us in one of the ways below
                    </p>
                  </div>
                  <form>
                    <div className="card">
                      <h3 className="border-bottom">Enter Details</h3>
                      <div className="mb-10">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Enter Name"
                        />
                      </div>
                      <div className="mb-10">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter Email Address"
                        />
                      </div>
                      <div className="mb-10">
                        <label htmlFor="name" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="phonenumber"
                          placeholder="Enter Phone Number"
                        />
                      </div>
                      <div className="mb-10">
                        <label htmlFor="name" className="form-label">
                          Your Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="Enter Address"
                        />
                      </div>
                      <div>
                        <label htmlFor="comments" className="form-label">
                          Comments
                        </label>
                        <textarea
                          className="form-control"
                          id="comments"
                          rows={3}
                          placeholder="Enter Comments"
                          defaultValue={""}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          to={route.cagedetails}
                          className="btn btn-secondary btn-icon"
                        >
                          Pay Now
                          <i className="feather-arrow-right-circle ms-1" />
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section> */}
          <section className="section">
            <div className="container">
              <h3 className="mb-40 text-center">Events Sponsor</h3>
              {/* Testimonials Slide */}
              <div className="brand-slider-group">
                <div className="owl-carousel testimonial-brand-slider owl-theme">
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-01.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-04.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-03.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-04.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-05.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-03.svg"
                      alt="Icon"
                    />
                  </div>
                  <div className="brand-logos">
                    <ImageWithBasePath
                      src="/assets/img/testimonial-icon-04.svg"
                      alt="Icon"
                    />
                  </div>
                </div>
              </div>
              {/* /Testimonials Slide */}
            </div>
          </section>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default EventDetails;
