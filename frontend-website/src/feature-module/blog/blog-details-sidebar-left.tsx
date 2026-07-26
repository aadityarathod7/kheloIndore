import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

const BlogDetailsSidebarLeft = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const [blog_data, setBlog_data] = useState([]);

  const [blogDetails, setBlogDetails] = useState<any>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };

  const blogSlug = useParams();
  console.log(blogSlug.slugName)

  useEffect(() => {
    document.title = `${blogDetails?.blog_title}`;
  }, [blogDetails]);


  useEffect(() => {
    // Fetch event data from API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/blog/getBlogById?slug_url=${blogSlug.slugName}`
        );
        if (response.data.success) {
          const data = response.data.data;
          data.blog_image = `${IMG_URL}${data.blog_image}`;
          setBlogDetails(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  console.log(blogDetails);

  const featuredVenuesSlider = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 20,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb breadcrumb-list mb-0 top-margin">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Blog Details</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Blog Details</li>
          </ul>
        </div>
      </div>

      <div className="content">
        <section className="detail-info">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12 offset-md-1 col-md-10 col-lg-10">
                <div className="wrapper">
                  <div className="seat-booking">
                    <div
                      className="col-12 d-flex"
                      style={{ justifyContent: "center" }}
                    >
                      <div>
                        <img
                          src={blogDetails?.blog_image}
                          alt="blog-image"
                          style={{
                            display: "block",
                            margin: "0 auto",
                            width: "500px", // Set your desired width
                            height: "300px", // Set your desired height
                            objectFit: "cover", // Ensures the image scales properly
                          }}
                        />
                      </div>
                    </div>

                    <div className="row mt-3" key={blogDetails?._id}>
                      <div className="col-12 ">
                        <h1>{blogDetails?.blog_title}</h1>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: blogDetails?.blog_description
                              ? blogDetails?.blog_description.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                              : '',
                          }}
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CREATED AT BOX */}
            {/* <div className="created-at">
              <p>Created at: {blogDetails.created_at}</p>
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailsSidebarLeft;
