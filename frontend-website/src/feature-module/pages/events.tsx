import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

interface Event {
  event_name: string;
  location: any;
  description: string;
  start_date: number;
  end_date: number;
  terms_and_conditions: string;
  _id: number;
  price: number;
  organized_by: string;
  images: any;
  src: any;
}

const Events = () => {
  const route = all_routes;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Fetch event data from API
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/event/fetchAll`);
        const eventData = Array.isArray(response.data?.data) ? response.data.data : [];
        const mappedData = eventData.map((event: any) => ({
          event_name: event.event_name,
          location: event.location,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          terms_and_conditions: event.terms_and_conditions,
          organized_by: event.organized_by,
          _id: event._id,
          price: event.price,
          images: event.images,
        }));
        setEvents(mappedData);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  return (
    <>
      <div className="events-page" style={{ backgroundColor: "#F8FAFC" }}>
        {/* Hero Header */}
        <div
          className="hero-booking-section"
          style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
            paddingTop: "120px",
            paddingBottom: "36px",
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <div
            className="hero-artwork-blend"
            style={{
              position: "absolute",
              right: "-60px",
              top: 0,
              bottom: 0,
              width: "55%",
              backgroundImage: "url('/assets/img/bg/banner-illustration.png')",
              backgroundSize: "cover",
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
              maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              opacity: 0.9,
            }}
          />

          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-7 text-start">
                <span
                  className="font-weight-bold"
                  style={{
                    fontSize: "13px",
                    letterSpacing: "1.5px",
                    display: "block",
                    marginBottom: "8px",
                    color: "#22C55E",
                    fontWeight: "700",
                  }}
                >
                  DISCOVER WHAT&apos;S COMING UP
                </span>
                <h1
                  className="d-flex align-items-center flex-wrap"
                  style={{
                    fontSize: "44px",
                    fontWeight: "800",
                    color: "#0F172A",
                    lineHeight: "1.1",
                    marginBottom: "12px",
                  }}
                >
                  Upcoming <span style={{ color: "#22C55E", marginLeft: "10px" }}>Events</span>
                </h1>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: "18px",
                    marginBottom: "16px",
                    fontWeight: "500",
                    maxWidth: "480px",
                  }}
                >
                  Explore exciting sports activities, tournaments, and community events in Indore.
                </p>

                <div
                  className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm"
                  style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}
                >
                  <Link to={route.home} style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}>
                    <i className="feather-home me-1" style={{ color: "#64748B" }} /> Home
                  </Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}>
                    <i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} />
                  </span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>Events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Hero Header */}
        {/* Page Content */}
        <div className="content" style={{ backgroundColor: "#F8FAFC", paddingTop: "28px", paddingBottom: "40px" }}>
          <div className="container px-3 px-lg-4">
            <section className="services">
              <div className="row">
                {loading ? (
                  <div className="col-12">
                    <div className="text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8F0" }}>
                      <div className="spinner-border text-success mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h4 className="fw-bold text-dark mb-2">Loading events...</h4>
                      <p className="text-muted mb-0">Please wait while we fetch the latest events.</p>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="col-12">
                    <div className="text-center py-5 bg-white rounded-4 border" style={{ borderColor: "#E2E8F0" }}>
                      <i className="feather-calendar text-muted mb-3 d-block" style={{ fontSize: "48px" }} />
                      <h4 className="fw-bold text-dark mb-2">No events found</h4>
                      <p className="text-muted mb-0">There are no events available right now. Please check back soon.</p>
                    </div>
                  </div>
                ) : (
                  events.map((event, index) => (
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4" key={index}>
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={`/events/event-details/${event._id}`}>
                            <ImageWithBasePath
                              src={
                                event?.images[0]?.src
                                  ? `${IMG_URL}${event.images[0].src}`
                                  : "/assets/img/no-img.png"
                              }
                              className="img-fluid"
                              alt="Event"
                            />
                          </Link>
                          <div className="date-info text-center">
                            <h6>{event ? new Date(event.start_date).toISOString().split("T")[0] : ""}</h6>
                          </div>
                        </div>
                        <div className="listing-content">
                          <ul className="d-flex justify-content-start align-items-center">
                            <li>
                              <i className="feather-map-pin" />
                              {event?.location}
                            </li>
                          </ul>
                          <h4 className="listing-title">
                            <Link to={`/events/event-details/${event._id}`}>{event?.event_name}</Link>
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="listing-item">
                    <div className="listing-img">
                      <Link to={route.eventdetails}>
                        <ImageWithBasePath
                          src="/assets/img/events/event-02.jpg"
                          className="img-fluid"
                          alt="Event"
                        />
                      </Link>
                      <div className="date-info text-center">
                        <h2>19</h2>
                        <h6>Sep, 2023</h6>
                      </div>
                    </div>
                    <div className="listing-content">
                      <ul className="d-flex justify-content-start align-items-center">
                        <li>
                          <i className="feather-clock me-1" />
                          06:20 AM
                        </li>
                        <li>
                          <i className="feather-map-pin me-1" />
                          152, 1st Street New York
                        </li>
                      </ul>
                      <h4 className="listing-title">
                        <Link to={route.eventdetails}>Rise to Victory</Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="listing-item">
                    <div className="listing-img">
                      <Link to={route.eventdetails}>
                        <ImageWithBasePath
                          src="/assets/img/events/event-03.jpg"
                          className="img-fluid"
                          alt="Event"
                        />
                      </Link>
                      <div className="date-info text-center">
                        <h2>18</h2>
                        <h6>Sep, 2023</h6>
                      </div>
                    </div>
                    <div className="listing-content">
                      <ul className="d-flex justify-content-start align-items-center">
                        <li>
                          <i className="feather-clock" />
                          06:20 AM
                        </li>
                        <li>
                          <i className="feather-map-pin" />
                          152, 1st Street New York
                        </li>
                      </ul>
                      <h4 className="listing-title">
                        <Link to={route.eventdetails}>Shuttle Storm</Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="listing-item">
                    <div className="listing-img">
                      <Link to={route.eventdetails}>
                        <ImageWithBasePath
                          src="/assets/img/events/event-04.jpg"
                          className="img-fluid"
                          alt="Event"
                        />
                      </Link>
                      <div className="date-info text-center">
                        <h2>17</h2>
                        <h6>Sep, 2023</h6>
                      </div>
                    </div>
                    <div className="listing-content">
                      <ul className="d-flex justify-content-start align-items-center">
                        <li>
                          <i className="feather-clock" />
                          06:20 AM
                        </li>
                        <li>
                          <i className="feather-map-pin" />
                          152, 1st Street New York
                        </li>
                      </ul>
                      <h4 className="listing-title">
                        <Link to={route.eventdetails}>
                          Flight of the Feathers
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="listing-item">
                    <div className="listing-img">
                      <Link to={route.eventdetails}>
                        <ImageWithBasePath
                          src="/assets/img/events/event-05.jpg"
                          className="img-fluid"
                          alt="Event"
                        />
                      </Link>
                      <div className="date-info text-center">
                        <h2>16</h2>
                        <h6>Sep, 2023</h6>
                      </div>
                    </div>
                    <div className="listing-content">
                      <ul className="d-flex justify-content-start align-items-center">
                        <li>
                          <i className="feather-clock" />
                          06:20 AM
                        </li>
                        <li>
                          <i className="feather-map-pin" />
                          152, 1st Street New York
                        </li>
                      </ul>
                      <h4 className="listing-title">
                        <Link to={route.eventdetails}>Battle at the Net</Link>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <div className="listing-item">
                    <div className="listing-img">
                      <Link to={route.eventdetails}>
                        <ImageWithBasePath
                          src="/assets/img/events/event-06.jpg"
                          className="img-fluid"
                          alt="Event"
                        />
                      </Link>
                      <div className="date-info text-center">
                        <h2>15</h2>
                        <h6>Sep, 2023</h6>
                      </div>
                    </div>
                    <div className="listing-content">
                      <ul className="d-flex justify-content-start align-items-center">
                        <li>
                          <i className="feather-clock" />
                          06:20 AM
                        </li>
                        <li>
                          <i className="feather-map-pin" />
                          152, 1st Street New York
                        </li>
                      </ul>
                      <h4 className="listing-title">
                        <Link to={route.eventdetails}>Badminton Fusion</Link>
                      </h4>
                    </div>
                  </div>
                </div> */}
              </div>
            </section>
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </>
  );
};

export default Events;








