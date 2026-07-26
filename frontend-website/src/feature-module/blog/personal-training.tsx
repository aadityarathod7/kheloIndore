import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Dropdown } from "primereact/dropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
// import data from '../../../public/assets/img/featured'

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
  trainer_type: string;
}
interface FilterData {
  last_name: string;
  first_name: string;

  duration: string;
  focus_area: string;
  price: number;
  _id: number;
  profile_picture: string[];
  src: string;
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

const BlogList = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(9).fill(false));
  const [trainer, setTrainer] = useState<Trainer[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortCriteria | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterTrainer, setFilterTrainer] = useState<Trainer[]>([]);
  const [filterPriceOnly, setFilterPriceOnly] = useState<Trainer[]>([]);
  const [filterCategoryOnly, setFilterCategoryOnly] = useState<Trainer[]>([]);
  const [trainerPrice, setTrainerPrice] = useState<Trainer[]>([]);
  const [finalFilterTrainer, setFinalFilterTrainer] = useState<Trainer[]>([]);
  const [name, setName] = useState<Trainer[]>([]);
  const [data, setData] = useState([]);
  const [selectedlocation, setSelectedLocation] = useState<SortCriteria[]>([]);
  const [trainerByLocation, setTrainerByLocation] = useState<Trainer[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "personal-training"
  }, []);

  const navigate = useNavigate()

  const location = useLocation();
  const { selectedLocationSort } = location.state || {};

  useEffect(() => {
    setSelectedLocation(selectedLocationSort?.name);
  }, []);

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
          trainer_type: trainer.trainer_type,
        }));
        setTrainer(mappedData);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };

    fetchTrainer();
  }, []);

  useEffect(() => {
    const areaMap = trainer.map((t: any) => ({
      name: t.category,
    }));

    const allNames = areaMap.flatMap((item) => item.name);
    const updatedNames = allNames.filter(
      (item, index) => allNames.indexOf(item) === index
    );
    setName(updatedNames);
  }, [trainer]);

  const handleCategoryChange = (e: { value: string }) => {
    console.log("Selected Category:", e.value);  // Debugging line
    setSelectedCategory(e.value);  // Update selected category
  };

  useEffect(() => {
    console.log("Selected Category:", selectedCategory); // Debugging line
    let filteredData = trainer;

    if (selectedCategory) {
      filteredData = filteredData.filter((trainer) =>
        trainer.trainer_type
          ?.toLowerCase()
          .includes(selectedCategory.toLowerCase())
      );
    }

    console.log("Filtered Coaches:", filteredData); // Debugging line
    setFinalFilterTrainer(filteredData);
  }, [selectedCategory, trainer]);

  // useEffect(() => {
  //   if (location) {
  //     const filteredData = trainer.filter((t: any) =>
  //       t.near_by_location?.includes(selectedlocation)
  //     );
  //     setTrainerByLocation(filteredData);
  //     setFinalFilterTrainer(filteredData);
  //   }
  // }, [selectedlocation, trainer]);

  // useEffect(() => {
  //   if (selectedSort) {
  //     if (selectedCategory) {
  //       if (selectedSort.name === "low price") {
  //         const filterData = filterCategoryOnly.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setTrainerPrice(filterData);
  //         setFinalFilterTrainer(filterData);
  //       } else {
  //         const filterData = filterCategoryOnly.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setTrainerPrice(filterData);
  //         setFinalFilterTrainer(filterData);
  //       }
  //     } else {
  //       if (selectedSort.name === "low price") {
  //         const filterData = trainer.filter(
  //           (trainer: any) => trainer.price <= 50
  //         );
  //         setFilterTrainer(filterData);
  //         setFinalFilterTrainer(filterData);
  //       } else {
  //         const filterData = trainer.filter(
  //           (trainer: any) => trainer.price > 50
  //         );
  //         setFilterTrainer(filterData);
  //         setFinalFilterTrainer(filterData);
  //       }
  //     }
  //   }

  //   if (selectedSort?.name === "low price") {
  //     const filterData = trainer.filter((trainer: any) => trainer.price <= 50);
  //     setFilterPriceOnly(filterData);
  //   } else {
  //     const filterData = trainer.filter((trainer: any) => trainer.price > 50);
  //     setFilterPriceOnly(filterData);
  //   }
  // }, [selectedSort]);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     if (selectedSort) {
  //       const filteredData = filterPriceOnly.filter((t: any) =>
  //         t.category.includes(selectedCategory)
  //       );
  //       setFilterTrainer(filteredData);
  //       setFinalFilterTrainer(filteredData);
  //     } else {
  //       const filteredData = trainer.filter((t: any) =>
  //         t.category.includes(selectedCategory)
  //       );
  //       setFilterTrainer(filteredData);
  //       setFinalFilterTrainer(filteredData);
  //     }
  //   }

  //   if (selectedCategory) {
  //     const filteredData = trainer.filter((t: any) =>
  //       t.category.includes(selectedCategory)
  //     );
  //     setFilterCategoryOnly(filteredData);
  //     setFinalFilterTrainer(filteredData);
  //   }
  // }, [selectedCategory]);
  // const handleCategoryChange = (selectedOption: { value: string }) => {
  //   setSelectedCategory(selectedOption ? selectedOption.value : null);
  // };

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const sortOptions = [{ name: "low price" }, { name: "high price" }];
  const sortLocation = [{ location: "location" }, { location: "location" }];

  const checkToken = (Id: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(`/personal-training/training-timedate/${Id}`);
    } else {
      navigate("/login",
        { state: { URL: location.pathname } }
      )
    }
  }

  return (
    <div>
      <section className="breadcrumb breadcrumb-list mb-0 top-margin">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Personal Trainer</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Personal Trainer</li>
          </ul>
        </div>
      </section>

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sortby-section">
                <div className="sorting-info">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-4 col-lg-3 col-sm-12 col-12">
                      <div className="count-search">
                        <p>
                          <span>
                            {selectedCategory ||
                              selectedSort ||
                              selectedlocation
                              ? finalFilterTrainer.length
                              : trainer.length}
                          </span>{" "}
                          Trainer are listed
                        </p>
                      </div>
                    </div>
                    <div className="col-xl-8 col-lg-9 col-sm-12 col-12">
                      <div className="sortby-filter-group" >
                        <div className="grid-listview">
                          <ul className="nav">
                            {/* <li>
                              <span>View as</span>
                            </li>
                            <li>
                              <Link to={""} className="active">
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

                            {/* <div className="sorting-select">
                              <Dropdown
                                value={setSelectedLocation}
                                // onChange={handleCategoryChange}
                                options={sortLocation}
                                placeholder={<ImageWithBasePath
                                  src="assets/img/icons/sort-03.svg"
                                  alt="Icon"
                                />}
                                className="select custom-select-list w-100"
                              />
                            </div> */}
                          </ul>
                        </div>
                        <div className="sortbyset">
                          <div className="sorting-select">
                            <Dropdown
                              value={selectedCategory}
                              onChange={(e) => handleCategoryChange(e)}
                              options={options}
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

          <div className="row justify-content-center">
            {selectedCategory || selectedSort || selectedlocation
              ? (
                finalFilterTrainer.length > 0 ? (finalFilterTrainer.map((trainer, index) => (
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
                            to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                          >
                            <ImageWithBasePath
                              src={
                                trainer.profile_picture[0]?.src
                                  ? `${IMG_URL}${trainer.profile_picture[0].src}`
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
                              {trainer?.trainer_type}
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
                            ₹{trainer.price}/month <span></span>
                          </h5>
                        </div> */}
                        </div>
                        <div className="listing-content">
                          <h3 className="listing-title">
                            <Link
                              to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                            >
                              {trainer.first_name}
                              {trainer.last_name}
                            </Link>
                          </h3>
                          {/* <ul className="mb-2">
                          <li>
                            <span><i className="feather-map-pin me-2" /> {trainer.near_by_location}</span>
                          </li>
                        </ul> */}
                          <div className="listing-details-group">
                            <p> Specializations: {trainer.specializations}</p>
                          </div>
                          <div className="coach-btn">
                            <ul>
                              <li>
                                <Link
                                  to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                                  className="btn btn-primary w-100"
                                >
                                  <i className="feather-eye me-2" />
                                  View Profile
                                </Link>
                              </li>
                              <li>
                              <div onClick={() => checkToken(trainer._id)}>
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
                  <p>No trainer found for the selected category.</p>
                )
              ) : (trainer.map((trainer, index) => (
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
                          to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                        >
                          <ImageWithBasePath
                            src={
                              trainer?.profile_picture[0]?.src
                                ? `${IMG_URL}${trainer.profile_picture[0].src}`
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
                            {trainer?.trainer_type}
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
                            ₹{trainer.price}/month <span></span>
                          </h5>
                        </div> */}
                      </div>
                      <div className="listing-content">
                        <h3 className="listing-title">
                          <Link
                            to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                          >
                            {trainer.first_name}&nbsp;&nbsp;
                            {trainer.last_name}
                          </Link>
                        </h3>
                        {/* <ul className="mb-2">
                          <li>
                            <span><i className="feather-map-pin me-2" /> {trainer.near_by_location}</span>
                          </li>
                        </ul> */}
                        <div className="listing-details-group">
                          <p> Specializations: {trainer.specializations}</p>
                        </div>
                        <div className="coach-btn">
                          <ul>
                            <li>
                              <Link
                                to={`/personal-training/trainer/${trainer.first_name?.replace(/\s+/g, "-").toLowerCase()}/${trainer._id}`}
                                className="btn btn-primary w-100"
                              >
                                <i className="feather-eye me-2" />
                                View Profile
                              </Link>
                            </li>
                            <li>
                              <div onClick={() => checkToken(trainer._id)}>
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
              )))}
          </div>
          {/* <div className="col-12 text-center mt-3">
            <Link to="#" className="btn btn-load">
              Load More Personal Trainers{" "}
              <ImageWithBasePath
                src="assets/img/icons/u_plus-square.svg"
                className="ms-2"
                alt="Icon"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
