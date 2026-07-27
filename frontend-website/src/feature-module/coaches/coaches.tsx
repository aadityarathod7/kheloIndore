import React, { useState, useEffect, ReactNode } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
// import data from '../../../public/assets/img/featured'
interface Location {
  address: string;
  city: string;
  state: string;
  zipcode: number;
}

interface Coach {
  full_name: ReactNode;
  trainer_type: any;
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
interface FilterData {
  trainer_type: ReactNode;
  full_name: ReactNode;
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

interface SortCriteria {
  name: string;
  // other properties if needed
}

const options = [
  { value: "archery", label: "Archery" },
  { value: "badminton", label: "Badminton" },
  { value: "baseball", label: "Baseball" },
  { value: "basketball", label: "Basketball" },
  { value: "golf", label: "Golf" },
  { value: "hockey", label: "Hockey" },
  { value: "kabaddi", label: "Kabaddi" },
  { value: "shooting", label: "Shooting" },
  { value: "skating", label: "Skating" },
  { value: "snooker", label: "Snooker" },
  { value: "soccer", label: "Soccer" },
  { value: "squash", label: "Squash" },
  { value: "swimming", label: "Swimming" },
  { value: "tennis", label: "Tennis" },
  { value: "volleyball", label: "Volleyball" },
  { value: "yoga", label: "Yoga" },
  { value: "zumba", label: "Zumba" },
];

const CoachesGrid = (props: { id: any }) => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortCriteria>();

  const [name, setName] = useState<FilterData[]>([]);
  const [locationName, setLocationName] = useState<FilterData[]>([]);
  const [location, setLocation] = useState<string | null>(null);

  const [coachPrice, setCoachPrice] = useState<FilterData[]>([]);
  const [coachCategogy, setCoachCategory] = useState<FilterData[]>([]);
  const [coachByLocation, setCoachByLocation] = useState<FilterData[]>([]);
  const [finalFilterCoach, setFinalFilterCoach] = useState<FilterData[]>([]);
  const [selectedTrainerType, setSelectedTrainerType] = useState<string | null>(
    null
  );

  const { id } = props;

  const navigate = useNavigate();
  const locations = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "coaches "
  }, []);

  const locationByHome = useLocation();
  const { selectedLocationSort, selectedSport } = locationByHome.state || {};

  useEffect(() => {
    setLocation(selectedLocationSort?.name || "");
    setSelectedCategory(selectedSport?.name || null);
  }, [locationByHome, selectedLocationSort, selectedSport]);

  useEffect(() => {
    // Fetch coach data from API
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${API_URL}/web/fetch-all-coaches`);
        const coachData = response.data.data;
        const mappedData = coachData.map((coach: any) => ({
          first_name: coach.first_name,
          last_name: coach.last_name,

          _id: coach._id,

          full_name: coach.full_name, // Ensure full_name is included
          trainer_type: coach.trainer_type, // Ensure trainer_type is included
          specializations: coach.specializations,
          profile_picture: coach.profile_picture,
          category: coach.category,
          near_by_location: coach.near_by_location,
        }));
        setCoaches(mappedData);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({
      name: t.category,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setName(updatedNames);
  }, [coaches]);

  useEffect(() => {
    const areaMap = coaches.map((t: any) => ({
      name: t.near_by_location,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames
      .filter((item, index) => allNames.indexOf(item) === index)
      .filter((item) => item !== undefined);
    setLocationName(updatedNames);
  }, [coaches]);

  // Handle category change

  const handleCategoryChange = (e: { value: string }) => {
    console.log("Selected Category:", e.value);  // Debugging line
    setSelectedCategory(e.value);  // Update selected category
  };

  useEffect(() => {
    let filteredData = coaches;

    if (location) {
      filteredData = filteredData.filter((coach) =>
        coach.near_by_location?.toLowerCase()?.includes(location.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((coach) =>
        coach.category?.toLowerCase()?.includes(selectedCategory.toLowerCase()) ||
        coach.trainer_type?.toLowerCase()?.includes(selectedCategory.toLowerCase())
      );
    }

    setFinalFilterCoach(filteredData);
  }, [location, selectedCategory, coaches]);

  // Handle trainer type change (you can set options here as well)

  // useEffect(() => {
  //   if (location) {
  //     const filteredData = coaches.filter((t: any) =>
  //       t.near_by_location?.includes(location)
  //     );
  //     setCoachByLocation(filteredData);
  //     setFinalFilterCoach(filteredData);
  //   }
  // }, [location, coaches]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     if (selectedSort) {
  //       const filteredData = coachPrice.filter((t: any) =>
  //         t.category?.includes(selectedCategory)
  //       );
  //       // setFilterCoaches(filteredData);
  //       setFinalFilterCoach(filteredData);
  //     } else {
  //       const filteredData = coaches.filter((t: any) =>
  //         t.category?.includes(selectedCategory)
  //       );
  //       setCoachCategory(filteredData);
  //       setFinalFilterCoach(filteredData);
  //     }
  //   }

  //   if (selectedCategory) {
  //     const filteredData = coaches.filter((t: any) =>
  //       t.category?.includes(selectedCategory)
  //     );
  //     setCoachCategory(filteredData);
  //     setFinalFilterCoach(filteredData);
  //   }
  // }, [selectedCategory]);

  // useEffect(() => {
  //   if (selectedSort) {
  //     if (selectedCategory) {
  //       if (selectedSort.name === "low price") {
  //         const filterData = coachCategogy.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         // setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       } else {
  //         const filterData = coachCategogy.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         // setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       }
  //     } else {
  //       if (selectedSort.name === "low price") {
  //         const filterData = coaches.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       } else {
  //         const filterData = coaches.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setCoachPrice(filterData);
  //         setFinalFilterCoach(filterData);
  //       }
  //     }
  //   }
  // }, [selectedSort]);

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const sortOptions = [{ name: "low price" }, { name: "high price" }];
  // const locationOptions = [];

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/coaches/coach-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: locations.pathname } }
      )
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb breadcrumb-list mb-0 top-margin">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Coaches</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Coaches</li>
          </ul>
        </div>
      </section>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content">
        <div className="container">
          {/* Sort By */}
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section">
                <div className="sorting-info">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-4 col-lg-3 col-sm-12 col-12">
                      <div className="count-search">
                        <p>
                          <span>
                            {selectedCategory || selectedSort || location
                              ? finalFilterCoach.length
                              : coaches.length}
                          </span>{" "}
                          Coach are listed
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-8 col-lg-9 col-sm-12 col-12">
                      <div className="sortby-filter-group">
                        <div className="grid-listview">
                          <ul className="nav">
                            {/* <li>
                              <span>View as</span>
                            </li> */}
                            {/* <li>
                              <Link to={routes.coachesGrid} className="active">
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-01.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li> */}
                            {/* <li>
                              <Link to={routes.coachesList}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-02.svg"
                                  alt="Icon"
                                />
                              </Link>
                            </li> */}
                            <li>
                              {/* <Link to={routes.coachesMap}>
                                <ImageWithBasePath
                                  src="assets/img/icons/sort-03.svg"
                                  alt="Icon"
                                />
                              </Link> */}

                              {/* <div className="sorting-select">
                                <Dropdown
                                  
                                  onChange={(e) => setLocation(e.value)}
                                  options={locationName.map((coach, index) => ({
                                    value: coach,
                                    label: coach,
                                  }))}
                                  placeholder={
                                    <span>
                                      <ImageWithBasePath
                                        src="assets/img/icons/sort-03.svg"
                                        alt="Icon"
                                      />
                                    </span>
                                  }
                                  className="select custom-select-list w-100"
                                />
                              </div> */}
                            </li>
                          </ul>
                        </div>
                        <div className="sortbyset">
                          {/* <span className="sortbytitle">Sort By</span> */}
                          <div className="sorting-select">
                            <Dropdown
                              value={selectedCategory}
                              onChange={(e) => handleCategoryChange(e)}
                              options={options}
                              // optionLabel="name"
                              placeholder="Category"
                              className="select custom-select-list w-100"
                            />
                          </div>

                          {/* <div className="sorting-select">
                            <Dropdown
                              value={selectedSort}
                              onChange={(e) => setSelectedSort(e.value)}
                              options={sortOptions}
                              optionLabel="name"
                              placeholder="Price"
                              className="select custom-select-list w-100"
                            />
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sort By */}
          <div className="row justify-content-center">
            {selectedCategory || selectedSort || location ? (
              finalFilterCoach.length > 0 ? ( // Ensure there are filtered coaches
                finalFilterCoach.map((coach, index) => (
                  <div className="col-lg-4 col-md-6" key={index}>
                    <div className="featured-venues-item">
                      <div className="listing-item listing-item-grid">
                        <div
                          className="listing-img"
                          style={{ height: "316px" }}
                        >
                          {/* <Link to={routes.coachDetail}>
                      <ImageWithBasePath
                        src={`assets/img/featured/${coach.profile}`}
                        alt="Venue"
                      />
                    </Link> */}

                          <Link
                            to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                          >
                            <ImageWithBasePath
                              src={
                                coach.profile_picture[0]?.src
                                  ? `${IMG_URL}${coach.profile_picture[0]?.src}`
                                  : "assets/img/no-img.png"
                              }
                              alt="user"
                            />
                          </Link>
                          <> </>
                          <div
                            className="fav-item-venues"
                            onClick={() => handleItemClick(index)}
                          >
                            <span className="tag tag-blue">
                              {coach.trainer_type}
                            </span>
                            {/* <div className="list-reviews coche-star">
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                }`}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div> */}
                          </div>
                          {/* <div className="hour-list">
                          <h5 className="tag tag-primary">
                            From ₹{coach.price} <span>/month</span>
                          </h5>
                        </div> */}
                        </div>
                        <div className="listing-content">
                          <h3 className="listing-title">
                            <Link
                              to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                            >
                               {coach.full_name ? coach.full_name : coach.first_name}
                            </Link>
                          </h3>
                          <ul className="mb-2">
                            {/* <li>
                              <span>
                                <i className="feather-map-pin me-2" />
                                {coach.location?.address},{coach.location?.city},{" "}
                                {coach.location?.state}.{coach.location?.zipcode}
                                {coach.near_by_location}
                              </span>
                            </li> */}
                          </ul>
                          <div className="listing-details-group">
                            {/* <p>{coach.bio}</p> */}
                            <p>
                              Specializations:{" "}
                              {Array.isArray(coach?.specializations)
                                ? coach?.specializations.join(", ")
                                : coach?.specializations ||
                                "No specializations provided"}
                            </p>
                          </div>
                          <div className="coach-btn">
                            <ul>
                              <li>
                                <Link
                                  // to={
                                  //   routes.coachDetail
                                  // }
                                  to={`/coaches/${coach.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach._id}`}
                                  className="btn btn-primary w-100"
                                >
                                  <i className="feather-eye me-2" />
                                  View Profile
                                </Link>
                              </li>
                              <li>
                                <div onClick={() => checkToken(coach._id)}>
                                  <Link
                                    to={``}
                                    className="btn btn-secondary w-100"
                                  >
                                    <i className="feather-calendar me-2" />
                                    Book Now
                                  </Link>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No coaches found for the selected category.</p>
              )
            ) : (
              coaches.map((coach, index) => (
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

                        <Link
                          to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                        >
                          <ImageWithBasePath
                            // src="assets/img/featured/featured-05.jpg"
                            src={
                              coach.profile_picture[0]?.src
                                ? `${IMG_URL}${coach.profile_picture[0]?.src}`
                                : "/assets/img/no-img.png"
                            }
                            alt="user"
                          />
                        </Link>
                        <div
                          className="fav-item-venues"
                          onClick={() => handleItemClick(index)}
                        >
                          <span className="tag tag-blue">
                            {coach?.trainer_type}
                          </span>
                          {/* <div className="list-reviews coche-star">
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[index] ? "selected" : ""
                                }`}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div> */}
                        </div>
                        {/* <div className="hour-list">
                          <h5 className="tag tag-primary">
                            From ₹{coach.price} <span>/month</span>
                          </h5>
                        </div> */}
                      </div>
                      <div className="listing-content">
                        <h3 className="listing-title">
                          <Link
                            to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                          >
                            {coach?.full_name}
                          </Link>
                        </h3>
                        {/* <ul className="mb-2">
                            <li>
                              <span>
                                <i className="feather-map-pin me-2" />
                                {coach?.near_by_location}
                              </span>
                            </li>
                          </ul> */}
                        <div className="listing-details-group">
                          {/* <p>{coach.bio}</p> */}
                          <p>
                            Specializations:{" "}
                            {Array.isArray(coach?.specializations)
                              ? coach?.specializations.join(", ")
                              : coach?.specializations ||
                              "No specializations provided"}
                          </p>
                        </div>
                        <div className="coach-btn">
                          <ul>
                            <li>
                              <Link
                                // to={
                                //   routes.coachDetail
                                // }
                                to={`/coaches/${coach?.trainer_type?.replace(/\s+/g, "-").toLowerCase()}/${coach?.first_name?.replace(/\s+/g, "-").toLowerCase()}/${coach?._id}`}
                                className="btn btn-primary w-100"
                              >
                                <i className="feather-eye me-2" />
                                View Profile
                              </Link>
                            </li>
                            <li>
                              <div onClick={() => checkToken(coach?._id)}>
                                <Link
                                  to={``}
                                  className="btn btn-secondary w-100"
                                >
                                  <i className="feather-calendar me-2" />
                                  Book Now
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                        {/* <div className="avalbity-review">
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* <div className="col-12 text-center mt-3">
            <Link to="#" className="btn btn-load">
              Load More Coaches{" "}
              <ImageWithBasePath
                src="assets/img/icons/u_plus-square.svg"
                className="ms-2"
                alt="Icon"
              />
            </Link>
          </div> */}
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CoachesGrid;
