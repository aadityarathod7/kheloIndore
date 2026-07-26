import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import Loader from "../loader/loader";

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
  price_per_hr: any;
}
interface Category {
  category_name: string;
}

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

const BlogListSidebarLeft = (_props: { id: any; name: any }) => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [venues, setVenues] = useState<Venues[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueByLocation, setVenueByLocation] = useState<Venues[]>([]);
  const [seacrhCategory, setSearchCategory] = useState("");
  const [searchCategoryData, setSearchCategoryData] = useState<Venues[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  

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

  const location = useLocation();
  const { selectedLocationSort } = location.state || {};

  useEffect(() => {
    setSelectedLocation(selectedLocationSort?.name);
  }, [location]);
  // useEffect(() => {
  //   document.title = "sports-venue"
  // }, []);

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
          price_per_hr: venues.price_per_hr,
        }));
        setVenues(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setLoading(false);
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

  const venueType = [
    ...new Set(
      venues.map((venue, _index) => venue.vendor_type.replace("_", " "))
    ),
  ];

  const searchingCategories = (e:any) => {
    const value = e.target.value;
    setSearchCategory(value);
    if (value.trim() === "") {
      setSearchCategoryData([]);
    } else {
      setSearchCategoryData(
        venueType.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    if (location) {
      const filteredData = venues.filter((t: any) =>
        t.near_by_location?.includes(selectedLocation)
      );
      setVenueByLocation(filteredData);
    }
  }, [location, venues]);

  const handleCategoryClick = (categoryName: any) => {
    setSelectedCategory(categoryName);

  };
  console.log(selectedCategory,'dsflksjldkfjs')

  useEffect(() => {
    if (selectedCategory) {
      document.title = `Sports Venue - ${selectedCategory}`;
    } else {
      document.title = "Sports Venue"; 
    }
  }, [selectedCategory]); 

  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 5;
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues =
    venueByLocation.length > 0
      ? venueByLocation.slice(indexOfFirstVenue, indexOfLastVenue)
      : venues.slice(indexOfFirstVenue, indexOfLastVenue);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {/* Breadcrumb */}
          <div className="breadcrumb breadcrumb-list mb-0 top-margin">
            <span className="primary-right-round" />
            <div className="container">
              <h1 className="text-white">Sports Venue</h1>
              <ul>
                <li>
                  <Link to={routes.home}>Home</Link>
                </li>
                <li>Sports Venue</li>
              </ul>
            </div>
          </div>
          {/* /Breadcrumb */}
          {/* Page Content */}
          <div className="content blog-grid">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 col-md-8 col-lg-8">
                  {currentVenues.map((venue, index) => (
                    <div className="featured-venues-item" key={index}>
                      <div className="listing-item venue-page">
                        <div className="listing-img">
                          <div
                            className="background-image"
                            style={{
                              backgroundImage: `url(${venue?.images[0]?.src
                                  ? `${IMG_URL}${venue?.images[0]?.src}`
                                  : "/assets/img/no-img.png"
                                })`,
                            }}
                          ></div>
                          <Link
                            to={`/sports-venue/${venue.vendor_type.replace(/\s+/g, "-").toLowerCase()}/${venue.name.replace(/\s+/g, "-").toLowerCase()}/${venue._id}`}
                          >
                            <ImageWithBasePath
                              src={
                                venue?.images[0]?.src
                                  ? `${IMG_URL}${venue?.images[0]?.src}`
                                  : "/assets/img/no-img.png"
                              }
                              className="img-fluid foreground-image"
                              alt="Venueeeeee"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">
                              {venue?.vendor_type.replace("_", " ")}
                            </span>
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
                          <div className="listing-button read-new">
                            {/* <ul className="nav">
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
                          </ul> */}
                            <p>
                              <i className="feather-map-pin me-2" />
                              {venue.near_by_location}
                            </p>
                            {/* <span>
                              <ImageWithBasePath
                              src="assets/img/icons/clock.svg"
                              alt=""
                            />
                              Starting from : ₹{venue.price_per_hr}
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <ul className="pagination">
                    {venues.length > venuesPerPage &&
                      Array(Math.ceil(venues.length / venuesPerPage))
                        .fill()
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
                        Categories
                      </h4>

                      <input
                        type="text"
                        placeholder="Search"
                        style={{
                          marginBottom: "0px",
                          borderRadius: "10px",
                          border: "2px solid #ababab",
                          padding: "6px",
                          fontSize: "small",
                        }}
                        value={seacrhCategory}
                        onChange={(e) => searchingCategories(e)}
                      />

                      <hr />
                      <ul className="categories">
                        {/* {category.map((category, index) => ( */}
                        {(searchCategoryData.length > 0
                          ? searchCategoryData
                          : venueType
                        ).map((venue, index) => (
                          <li key={index}>
                            <h6>
                              <Link
                                to={{
                                  pathname: `/sports-venue/${venue.toLowerCase().replace(/\s+/g, "-")}`,
                                  state: { thisCategory: venue },
                                }}
                                onClick={() => handleCategoryClick(venue)}
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
      )}
    </div>
  );
};

export default BlogListSidebarLeft;
