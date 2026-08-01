import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

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
  src: string;
  near_by_location: string;
  vendor_type: any;
}

interface Category {
  category_name: string;
}

const getVenueImage = (images: any): string => {
  if (!images || !Array.isArray(images) || images.length === 0) return "assets/img/venues/venue-01.jpg";
  const first = images[0];
  const imgStr = typeof first === "string" ? first : (first?.src || first?.url || "");
  if (!imgStr) return "assets/img/venues/venue-01.jpg";
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) return imgStr;
  return `${IMG_URL}${imgStr}`;
};

interface FilterData {
  vendor_type: any;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  activities: string;
  category: string;
  _id: string;
  images: any;
  src: string;
  near_by_location: any;
}

export default function VenueByCategory(props: any) {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [venues, setVenues] = useState<Venues[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [locationName, setLocationName] = useState("");
  const [categoryVenue, setCategoryVenue] = useState<FilterData[]>([]);
  const [locationVenue, setLocationVenue] = useState<FilterData[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationData, setSearchLocationData] = useState<Venues[]>([]);

  const thisCategory = useParams<{ thisCategory: string }>();
  const categorySelected = thisCategory?.type;

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
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
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/fetch`);
        const categoyrData = response.data.categories;
        const mappedData = categoyrData.map((category: any) => ({
          category_name: category.category_name,
          _id: category._id,
        }));
        setCategory(mappedData);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchCategory();

    fetchVenues();
  }, []);

  // const venueType = [...new Set(venues.map((venue, _index) => venue.vendor_type.replace('_', ' ')))]
  const venueLocation = [
    ...new Set(
      venues.map((venue, _index) => venue.near_by_location.replace("_", " "))
    ),
  ];

  const searchingLocations = (e) => {
    const value = e.target.value;
    setSearchLocation(value);
    if (value.trim() === "") {
      setSearchLocationData([]);
    } else {
      setSearchLocationData(
        venueLocation.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleLocationClick = (locationName: any) => {
    setLocationName(locationName);
  };

  useEffect(() => {
    if (categorySelected && venues.length > 0) {
      let filteredData;
      if (categorySelected.toLowerCase() === "other-sports") {
        filteredData = venues.filter((t: any) => {
          const vt = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
          const cat = (t.category || "").toLowerCase().replace(/_/g, " ").trim();
          const name = (t.name || "").toLowerCase();
          const desc = (t.description || "").toLowerCase();

          const isCricket = vt.includes("cricket") || cat.includes("cricket") || name.includes("cricket") || desc.includes("cricket") || vt.includes("turf") || cat.includes("turf");
          const isBadminton = vt.includes("badminton") || cat.includes("badminton") || name.includes("badminton");
          const isSwimming = vt.includes("swim") || cat.includes("swim") || name.includes("swim");
          const isFootball = vt.includes("football") || cat.includes("football") || name.includes("football");
          const isPickleball = vt.includes("pickle") || cat.includes("pickle") || name.includes("pickle");
          const isTennis = (vt.includes("tennis") || cat.includes("tennis") || name.includes("tennis")) && !vt.includes("table") && !cat.includes("table") && !name.includes("table");
          const isBasketball = vt.includes("basketball") || cat.includes("basketball") || name.includes("basketball");
          const isTableTennis = vt.includes("table tennis") || cat.includes("table tennis") || name.includes("table tennis");

          return !(isCricket || isBadminton || isSwimming || isFootball || isPickleball || isTennis || isBasketball || isTableTennis);
        });
      } else {
        const targetCat = categorySelected.toLowerCase().replace(/-/g, " ").trim();
        filteredData = venues.filter((t: any) => {
          const vendorType = (t.vendor_type || "").toLowerCase().replace(/_/g, " ").trim();
          const category = (t.category || "").toLowerCase().replace(/_/g, " ").trim();

          return (
            vendorType.includes(targetCat) ||
            category.includes(targetCat) ||
            targetCat.includes(vendorType) ||
            targetCat.includes(category)
          );
        });
      }
      setCategoryVenue(filteredData.length > 0 ? filteredData : venues);
    } else {
      setCategoryVenue(venues);
    }
  }, [venues, categorySelected]);

  useEffect(() => {
    if (locationName) {
      const filteredData = categoryVenue.filter((t: any) => {
        const formattedLocation = (t.near_by_location || "").replace("_", " ");
        return formattedLocation.includes(locationName);
      });
      setLocationVenue(filteredData);
    }
  }, [locationName]);

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 10;
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = categoryVenue.slice(
    indexOfFirstVenue,
    indexOfLastVenue
  );
  const currentLocationVenues = locationVenue.slice(
    indexOfFirstVenue,
    indexOfLastVenue
  );

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0 top-margin">
          <span className="primary-right-round" />
          <div className="container text-center">
            <h1 className="text-white">
              {thisCategory.type
                .split("-")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}{" "}
              Venues
            </h1>
            {/* <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>{thisCategory.type.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}</li>
            </ul> */}
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content blog-grid">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-8 col-lg-8">
                {locationName
                  ? currentLocationVenues.map((venue, index) => (
                      <div className="featured-venues-item" key={index}>
                        <div className="listing-item venue-page">
                          <div className="listing-img">
                            <Link
                              to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
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
                                {/* {venue.category &&
                                  venue.category
                                    .split(",")
                                    .map((category) => category.trim())
                                    .join(", ")} */}
                                {venue?.vendor_type.replace("_", " ")}
                              </span>
                              {/* <div className="list-reviews coche-star">
                            <Link
                              to="#"
                              className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                              key={3}
                              onClick={() => handleItemClick(3)}
                            >
                              <i className="feather-heart" />
                            </Link>
                          </div> */}
                            </div>
                          </div>
                          <div className="listing-content news-content">
                            <div className="listing-venue-owner">
                              <div className="navigation">
                                {/* <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                alt="User"
                              />
                              Orlando Waters
                            </Link> */}
                                {/* {venue.activities} */}
                                <span>
                                  {/* <i className="feather-calendar" />
                              15 May 2023 */}
                                </span>
                              </div>
                            </div>
                            <h3 className="listing-title">
                              <Link
                                to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              >
                                {venue.name}{" "}
                              </Link>
                            </h3>
                            <p>
                              <i className="feather-map-pin me-2" />
                              {venue.near_by_location}
                            </p>
                            {/* <div className="listing-button read-new">
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
                            <ImageWithBasePath
                              src="assets/img/icons/clock.svg"
                              alt=""
                            />
                            10 Min To Read
                          </span>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    ))
                  : currentVenues.map((venue, index) => (
                      <div className="featured-venues-item" key={index}>
                        <div className="listing-item venue-page">
                          <div className="listing-img">
                            <Link
                              to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                            >
                              {getVenueImage(venue?.images).startsWith("http") ? (
                                <img
                                  src={getVenueImage(venue?.images)}
                                  className="img-fluid"
                                  alt={venue.name}
                                  style={{ height: "180px", width: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <ImageWithBasePath
                                  src={getVenueImage(venue?.images)}
                                  className="img-fluid"
                                  alt={venue.name}
                                  style={{ height: "180px", width: "100%", objectFit: "cover" }}
                                />
                              )}
                            </Link>
                            <div className="fav-item-venues news-sports">
                              <span className="tag tag-blue">
                                {/* {venue.category &&
                                  venue.category
                                    .split(",")
                                    .map((category) => category.trim())
                                    .join(", ")} */}
                                {venue?.vendor_type.replace("_", " ")}
                              </span>
                              {/* <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                                key={3}
                                onClick={() => handleItemClick(3)}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div> */}
                            </div>
                          </div>
                          <div className="listing-content news-content">
                            <div className="listing-venue-owner">
                              <div className="navigation">
                                {/* <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                alt="User"
                              />
                              Orlando Waters
                            </Link> */}
                                {/* {venue.activities} */}
                                <span>
                                  {/* <i className="feather-calendar" />
                              15 May 2023 */}
                                </span>
                              </div>
                            </div>
                            <h3 className="listing-title">
                              <Link
                                to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                              >
                                {venue.name}{" "}
                              </Link>
                            </h3>
                            <p>
                              <i className="feather-map-pin me-2" />
                              {venue.near_by_location}
                            </p>
                            {/* <div className="listing-button read-new">
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
                              <ImageWithBasePath
                              src="assets/img/icons/clock.svg"
                              alt=""
                            />
                            10 Min To Read
                            </span>
                          </div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                <ul className="pagination">
                  {categoryVenue.length > venuesPerPage &&
                    Array(Math.ceil(venues.length / venuesPerPage))
                      // .fill()
                      .map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                </ul>

                {/* /Blog */}
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 blog-sidebar theiaStickySidebar">
                <div className="stickybar">
                  <div className="card">
                    <h4
                      style={{
                        borderBottom: "none",
                        paddingBottom: "0px",
                        marginBottom: "20px",
                      }}
                    >
                      Location
                    </h4>

                    <input
                      type="text"
                      placeholder="Search"
                      style={{
                        marginBottom: "0px",
                        borderRadius: "10px",
                        border: "2px solid rgb(171, 171, 171)",
                        padding: "6px",
                        fontSize: "small",
                      }}
                      value={searchLocation}
                      onChange={(e) => searchingLocations(e)}
                    />

                    <hr />

                    <ul className="categories">
                      {(searchLocationData.length > 0
                        ? searchLocationData
                        : venueLocation
                      ).map((venue, index) => (
                        <li key={index}>
                          <h6>
                            <Link
                              to="#"
                              onClick={() => handleLocationClick(venue)}
                            >
                              {" "}
                              {venue}
                            </Link>
                          </h6>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
}
