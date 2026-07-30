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
    <div style={{ backgroundColor: "#F8FAFC" }}>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        {/* Blended Background Turf Graphics */}
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
        
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BLOG POST</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "40px", fontWeight: "800", color: "#0F172A", lineHeight: "1.2", marginBottom: "16px" }}>
                {blogDetails?.blog_title || "Blog Details"}
              </h1>
              
              {/* Breadcrumb pill */}
              <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                <span style={{ color: "#22C55E", fontWeight: "600" }}>Blogs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-md-10 col-sm-12">
              <div 
                className="shadow-sm border" 
                style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "30px", overflow: "hidden" }}
              >
                {/* Blog Image */}
                {blogDetails?.blog_image && (
                  <div className="mb-4" style={{ borderRadius: "14px", overflow: "hidden", maxHeight: "420px" }}>
                    <img
                      src={blogDetails.blog_image}
                      alt="blog-image"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "420px",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="blog-body mt-2">
                  <style dangerouslySetInnerHTML={{__html: `
                    .blog-body h2, .blog-body h2 * {
                      color: #0F172A !important;
                    }
                    .blog-rich-content, .blog-rich-content * {
                      color: #334155 !important;
                    }
                    .blog-metadata-item, .blog-metadata-item * {
                      color: #64748B !important;
                    }
                    .blog-metadata-item i {
                      color: #22C55E !important;
                    }
                  `}} />
                  <h2 className="mb-3" style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", fontFamily: "sans-serif" }}>
                    {blogDetails?.blog_title}
                  </h2>
                  
                  {/* Optional author/date metadata info bar */}
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom blog-metadata-item" style={{ fontSize: "13px", borderColor: "#F1F5F9" }}>
                    <span><i className="feather-user me-1" /> By Admin</span>
                    <span><i className="feather-calendar me-1" /> {blogDetails?.created_at ? new Date(blogDetails.created_at).toLocaleDateString() : "July 2026"}</span>
                  </div>

                  <div
                    className="blog-rich-content"
                    style={{ color: "#334155", fontSize: "16px", lineHeight: "1.8", fontWeight: "400" }}
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
    </div>
  );
};

export default BlogDetailsSidebarLeft;
