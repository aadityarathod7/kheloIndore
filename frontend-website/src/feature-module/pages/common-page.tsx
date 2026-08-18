import React, { useEffect, useState } from 'react'
import { API_URL, IMG_URL } from '../../ApiUrl';
import axios from "axios";
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath';

interface Trainer {
    first_name: string;
    last_name: string;
    near_by_location: string;
    category: string;
    price: number;
    _id: number;
    profile_picture: any;
    src: string;
    specializations: string;
}
interface Coach {
    first_name: string;
    last_name: string;
    location: Location;
    experience: string;
    availability: string;
    specializations: string[];
    bio: string;
    _id: number;
    price: number;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    profile_picture: any;
    src: string;
    orgname: string;
    // profile:string;
    category: string;
    near_by_location: string;
    age: number;
}
interface Venues {
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    activities: string;
    category: string;
    _id: string;
    images: any;
    src: any;
    near_by_location: string;
    vendor_type: any;
}

export default function CommonPage() {

    const [selected, setSelected] = useState(null);
    const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
    const [trainer, setTrainer] = useState<Trainer[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [venues, setVenues] = useState<Venues[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleButtonClick = (label: any) => {
        setSelected(label);
    };

    useEffect(() => {

        const fetchTrainer = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/web/PersonalTraining/fetchAll`
                );
                const trainerData = response.data.data;
                const mappedData = trainerData.map((trainer: any) => ({
                    first_name: trainer.first_name,
                    last_name: trainer.last_name,
                    near_by_location: trainer.near_by_location,
                    category: trainer.category,
                    price: trainer.price,
                    _id: trainer._id,
                    specializations: trainer.specializations,
                    profile_picture: trainer.profile_picture,
                }));
                setTrainer(mappedData);

            } catch {
        // The request failure is handled by the surrounding UI state.
      }
        };

        fetchTrainer();

    }, []);

    useEffect(() => {
        // Fetch coach data from API
        const fetchCoaches = async () => {
            try {
                const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
                const coachData = response.data.data;
                const mappedData = coachData.map((coach: any) => ({
                    first_name: coach.first_name,
                    last_name: coach.last_name,
                    location: coach.location,
                    experience: coach.experience,
                    availability: coach.availability,
                    specializations: coach.specializations,
                    bio: coach.bio,
                    _id: coach._id,
                    price: coach.price,
                    profile_picture: coach.profile_picture,
                    category: coach.category,
                    near_by_location: coach.near_by_location,
                }));
                setCoaches(mappedData);
            } catch {
        // The request failure is handled by the surrounding UI state.
      }
        };

        fetchCoaches();
    }, []);

    useEffect(() => {
        // Fetch coach data from API
        const fetchVenues = async () => {
            try {
                const response = await axios.get(`${API_URL}/web/venue/getVenue`);
                const venuesData = response.data.venue;
                const mappedData = venuesData.map((venues: any) => ({
                    name: venues.name,
                    address: venues.address,
                    city: venues.city,
                    state: venues.state,
                    zipcode: venues.zipcode,
                    activities: venues.activities,
                    images: venues.images,
                    category: venues.category,
                    _id: venues._id,
                    near_by_location: venues.near_by_location,
                    vendor_type: venues.vendor_type,
                    // profile: coach.profile
                }));
                setVenues(mappedData);
            } catch {
        // The request failure is handled by the surrounding UI state.
      }
        };

        fetchVenues();
    }, []);

    const handleItemClick = (index: number) => {
        setSelectedItems((prevSelectedItems) => {
            const updatedSelectedItems = [...prevSelectedItems];
            updatedSelectedItems[index] = !updatedSelectedItems[index];
            return updatedSelectedItems;
        });
    };

    return (
        <>
            <div className='container ' style={{
                marginTop: "10%"
            }}>
                <div className='row text-center my-4'>
                    <div className='col-lg-4 col-md-4'>
                        <div className='btn btn-primary m-auto' onClick={() => handleButtonClick('Sports Venue')}>
                            Sports Venue
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4'>
                        <div className='btn btn-primary' onClick={() => handleButtonClick('Coaches')}>
                            Coaches
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4'>
                        <div className='btn btn-primary' onClick={() => handleButtonClick('Trainer')}>
                            Trainer
                        </div>
                    </div>
                </div>
                <div className='my-5'>
                    {selected === 'Sports Venue' ? (
                        <div className='row justify-content-center'>
                            <div className="col-sm-12 col-md-8 col-lg-8">
                                {venues.map((venue, index) => (
                                    <div className="featured-venues-item" key={index}>
                                        <div className="listing-item venue-page">
                                            <div className="listing-img">
                                                <Link
                                                    to={`/sports-venue/${venue?.vendor_type?.replace(/\s+/g, '-').toLowerCase()}/${venue?.name?.replace(/\s+/g, '-').toLowerCase()}/${venue._id}`}
                                                >
                                                    <ImageWithBasePath
                                                        // src="/assets/img/blog/blog-01.jpg"
                                                        src={
                                                            venue.images
                                                                ? `${IMG_URL}${venue.images[0]?.src}`
                                                                : "assets/img/venues/venues-01.jpg"
                                                        }
                                                        className="img-fluid"
                                                        alt="Venue"
                                                    />
                                                </Link>
                                                <div className="fav-item-venues news-sports">
                                                    <span className="tag tag-blue">
                                                        {venue?.vendor_type.replace('_', ' ')}
                                                    </span>
                                                    <div className="list-reviews coche-star">
                                                        <Link
                                                            to="#"
                                                            className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                                                            key={3}
                                                            onClick={() => handleItemClick(3)}
                                                        >
                                                            <i className="feather-heart" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="listing-content news-content">
                                                <div className="listing-venue-owner">
                                                    <div className="navigation">
                                                        <span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <h3 className="listing-title">
                                                    <Link
                                                        to={`/sports-venue/${venue?.vendor_type?.replace(/\s+/g, '-').toLowerCase()}/${venue?.name?.replace(/\s+/g, '-').toLowerCase()}/${venue._id}`}
                                                    >
                                                        {venue.name}{" "}
                                                    </Link>
                                                </h3>
                                                <p>
                                                    <i className="feather-map-pin me-2" />
                                                    {venue.near_by_location}
                                                </p>
                                                <div className="listing-button read-new">
                                                    <ul className="nav">
                                                        <li>
                                                            <Link to="#">
                                                                <i className="feather-heart" />
                                                                45
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#">
                                                                <i className="feather-message-square" />
                                                                40
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                    <span>
                                                        {/* <ImageWithBasePath
                              src="assets/img/icons/clock.svg"
                              alt=""
                            />
                            10 Min To Read */}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* /Blog */}
                            </div>
                        </div>
                    ) : selected === 'Coaches' ? (
                        <div className="row justify-content-center">
                            {
                                coaches.map((coach, index) => (
                                    <div className="col-lg-4 col-md-6" key={index}>
                                        <div className="featured-venues-item">
                                            <div className="listing-item listing-item-grid">
                                                <div className="listing-img" style={{ height: "316px" }}>
                                                    <Link to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, '-').toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, '-').toLowerCase()}/${coach._id}`}>

                                                        <ImageWithBasePath
                                                            // src="assets/img/featured/featured-05.jpg"
                                                            src={
                                                                coach.profile_picture?.[0]?.src
                                                                    ? `${IMG_URL}${coach.profile_picture?.[0]?.src}`
                                                                    : "/assets/img/profiles/avatar-06.jpg"
                                                            }
                                                            alt="user"
                                                        />
                                                    </Link>
                                                    <div
                                                        className="fav-item-venues"
                                                        onClick={() => handleItemClick(index)}
                                                    >
                                                        <span className="tag tag-blue">{coach.category}</span>
                                                        <div className="list-reviews coche-star">
                                                            <Link
                                                                to="#"
                                                                className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                                                    }`}
                                                            >
                                                                <i className="feather-heart" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="hour-list">
                                                        <h5 className="tag tag-primary">
                                                            From ₹{coach.price} <span>/month</span>
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="listing-content">
                                                    <h3 className="listing-title">
                                                        <Link to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, '-').toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, '-').toLowerCase()}/${coach._id}`}>
                                                            {coach.first_name} {coach.last_name}
                                                        </Link>
                                                    </h3>
                                                    <ul className="mb-2">
                                                        <li>
                                                            <span>
                                                                <i className="feather-map-pin me-2" />
                                                                {coach.near_by_location}


                                                            </span>
                                                        </li>
                                                    </ul>
                                                    <div className="listing-details-group">
                                                        {/* <p>{coach.bio}</p> */}
                                                        <p>
                                                            Specializations: {coach.specializations.join(", ")}
                                                        </p>
                                                    </div>
                                                    <div className="coach-btn">
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    // to={
                                                                    //   routes.coachDetail
                                                                    // }
                                                                    to={`/coaches/${(coach?.category || "coach").replace(/\s+/g, '-').toLowerCase()}/${(coach?.first_name || "coach").replace(/\s+/g, '-').toLowerCase()}/${coach._id}`}
                                                                    className="btn btn-primary w-100"
                                                                >
                                                                    <i className="feather-eye me-2" />
                                                                    View Profile
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link to={`/coaches/coach-timedate/${coach._id}`} className="btn btn-secondary w-100">
                                                                    <i className="feather-calendar me-2" />
                                                                    Book Now
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="avalbity-review">
                                                        <ul>
                                                            <li>
                                                                <div className="avalibity-date">
                                                                    <span>
                                                                        <i className="feather-calendar" />
                                                                    </span>
                                                                    <div className="avalibity-datecontent">
                                                                        <h6>Next Availability</h6>
                                                                        <h5>{coach.availability}</h5>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="list-reviews mb-0">
                                                                    <div className="d-flex align-items-center">
                                                                        <span className="rating-bg">4.5</span>
                                                                        <span>80 Reviews</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : selected === 'Trainer' ? (
                        <div className="row justify-content-center">
                            {trainer.map((trainer, index) => (
                                <div className="col-lg-4 col-md-6" key={index}>
                                    <div className="featured-venues-item">
                                        <div className="listing-item listing-item-grid">
                                            <div className="listing-img" style={{ height: "316px" }}>
                                                {/* <Link to={routes.coachDetail}>
                        <ImageWithBasePath
                          src={`assets/img/featured/${coach.profile}`}
                          alt="Venue"
                        />
                      </Link> */}

                                                <Link to={`/trainers/trainer/${trainer.first_name.replace(/\s+/g, '-').toLowerCase()}/${trainer._id}`}>
                                                    <ImageWithBasePath
                                                        src={
                                                            // trainer.profile_picture
                                                            //     ? `${IMG_URL}${trainer.profile_picture[0].src}`
                                                            //     :
                                                            "/assets/img/featured/featured-06.jpg"

                                                        }
                                                        alt="user"
                                                    />
                                                </Link>

                                                <div
                                                    className="fav-item-venues"
                                                    onClick={() => handleItemClick(index)}
                                                >
                                                    <span className="tag tag-blue">{trainer.category}</span>
                                                    <div className="list-reviews coche-star">
                                                        <Link
                                                            to="#"
                                                            className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                                                }`}
                                                        >
                                                            <i className="feather-heart" />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="hour-list">
                                                    <h5 className="tag tag-primary">
                                                        ₹{trainer.price} <span></span>
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="listing-content">
                                                <h3 className="listing-title">
                                                    <Link to={`/trainers/trainer/${trainer.first_name.replace(/\s+/g, '-').toLowerCase()}/${trainer._id}`}>
                                                        {trainer.first_name}&nbsp;&nbsp;{trainer.last_name}
                                                    </Link>
                                                </h3>
                                                <ul className="mb-2">
                                                    <li>
                                                        <span><i className="feather-map-pin me-2" /> {trainer.near_by_location}</span>
                                                    </li>
                                                </ul>
                                                <div className="listing-details-group">
                                                    <p> Specializations: {trainer.specializations}</p>
                                                </div>
                                                <div className="coach-btn">
                                                    <ul>
                                                        <li>
                                                            <Link
                                                                to={`/trainers/trainer/${trainer.first_name.replace(/\s+/g, '-').toLowerCase()}/${trainer._id}`}
                                                                className="btn btn-primary w-100"
                                                            >
                                                                <i className="feather-eye me-2" />
                                                                View Profile
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to={`/trainers/training-timedate/${trainer._id}`}
                                                                className="btn btn-secondary w-100"
                                                            >
                                                                <i className="feather-calendar me-2" />
                                                                Book Now
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="avalbity-review">
                                                    <ul>
                                                        <li>
                                                            <div className="avalibity-date">
                                                                <span>
                                                                    <i className="feather-calendar" />
                                                                </span>
                                                                <div className="avalibity-datecontent">
                                                                    <h6>Next Availability</h6>
                                                                    {/* <h5>{coach.availability}</h5> */}
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="list-reviews mb-0">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="rating-bg">4.5</span>
                                                                    <span>80 Reviews</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    ) : (
                        <p className='text-center my-4'>Please select an option</p>
                    )}
                </div>
            </div>
        </>
    )
}
