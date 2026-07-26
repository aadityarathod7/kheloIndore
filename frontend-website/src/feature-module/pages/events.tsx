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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Fetch event data from API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/event/fetchAll`);
        const eventData = response.data.data;
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
      }
    };

    fetchEvents();
  }, []);
  return (
    <>
      <div className=" events-page innerpagebg top-margin">
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Events</h1>
            <ul>
              <li>
                <Link to={route.home}>Home</Link>
              </li>
              <li>Events</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content">
          <div className="container">
            <section className="services">
              <div className="row">
                {events.map((event, index) => (
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4" key={index}>
                    <div className="listing-item">
                      <div className="listing-img">
                        <Link to={`/events/event-details/${event._id}`}>
                          <ImageWithBasePath
                     
                            src={
                              event?.images[0]?.src
                                ? `${IMG_URL}${event.images[0].src}`
                                : 
                                "/assets/img/no-img.png"
                            }
                            className="img-fluid"
                            alt="Event"
                          />
                        </Link>
                        <div className="date-info text-center">
                          <h6>{event?(new Date(event.start_date)).toISOString().split('T')[0] : ''}</h6>
                        </div>
                      </div>
                      <div className="listing-content">
                        <ul className="d-flex justify-content-start align-items-center">
                          {/* <li>
                            <i className="feather-clock" />
                            06:20 AM
                          </li> */}
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
                ))}

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








