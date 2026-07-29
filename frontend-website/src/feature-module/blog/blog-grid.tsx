import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

const BlogGrid = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [blog, setBlog] = useState<Event[]>([]);

  useEffect(() => {
      window.scrollTo(0, 0);
      document.title = "blog"
    }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/blog/getAllActiveBlog`);
        const eventData = response?.data?.data;
        console.log(eventData)
        const mappedData = eventData?.map((event: any) => ({
          id: event?._id,
          slug_url:event?.slug_url,
          title: event?.blog_title,
          picture: `${IMG_URL}${event?.blog_image}`,
        }));
        setBlog(mappedData);
        console.log(mappedData, "maooed data");
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <div>
      <>
        <>
          {/* Hero Section */}
          <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "110px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
            {/* Blended Background Turf Graphics */}
            <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>
            
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div className="row align-items-center">
                <div className="col-lg-7 text-start">
                  <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>BOOK. PLAY. ENJOY</span>
                  <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "56px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                    Latest <span style={{ color: "#22C55E", marginLeft: "12px" }}>Blogs</span>
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "20px", marginBottom: "24px", fontWeight: "500", maxWidth: "480px" }}>Stay updated with the latest sports news and tips</p>
                  
                  {/* Breadcrumb pill */}
                  <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                    <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="feather-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                    <span style={{ margin: "0 10px", color: "#64748B" }}><i className="feather-chevron-right" style={{ fontSize: "12px", color: "#64748B" }} /></span>
                    <span style={{ color: "#22C55E", fontWeight: "600" }}>Blog</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Hero Section */}
          {/* Page Content */}
          <div className="content blog-grid" style={{ backgroundColor: "#F8FAFC", padding: "32px 0 60px 0" }}>
            <div className="container">
              <div className="row">
                
                {
                  blog.map((event:any, index) => (
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4" key={event?.id}>
                  <div className="listing-item ki-card-hover">
                    <div className="listing-img">
                      <Link to={`/blog/${event?.slug_url}`}>
                        <ImageWithBasePath
                          src={event?.picture && event?.picture.includes('/uploads/blog/') ? event?.picture : "/assets/img/no-img.png"}
                          className="img-fluid blog-images"
                          alt="Venue"
                        />
                      </Link>
                   
                    </div>
                    <div className="listing-content news-content">
                      
                      <h3 className="listing-title blog-title text-center" style={{ fontSize: "16px", fontWeight: "600", padding: "10px 0" }}>
                        <Link to={`/blog/${event?.slug_url}`} style={{ color: "#17222D" }}>
                         {event?.title}
                        </Link>
                      </h3>
                      
                    </div>
                  </div>
                  {/* /Blog */}
                </div>))}

             
              </div>
              {/*Pagination*/}
              {/* <div className="blog-pagination">
                <nav>
                  <ul className="pagination justify-content-center pagination-center">
                    <li className="page-item previtem">
                      <Link className="page-link" to="#">
                        <i className="feather-chevrons-left" />
                      </Link>
                    </li>
                    <li className="page-item previtem">
                      <Link className="page-link" to="#">
                        <i className="feather-chevron-left" />
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link active" to="#">
                        1
                      </Link>
                    </li>
                    <li className="page-item active">
                      <Link className="page-link" to="#">
                        2
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        3
                      </Link>
                    </li>
                    <li className="page-item nextlink">
                      <Link className="page-link" to="#">
                        {" "}
                        <i className="feather-chevron-right" />
                      </Link>
                    </li>
                    <li className="page-item nextlink">
                      <Link className="page-link" to="#">
                        {" "}
                        <i className="feather-chevrons-right" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div> */}
              {/*Pagination*/}
            </div>
          </div>
          {/* /Page Content */}
        </>
      </>
    </div>
  );
};

export default BlogGrid;
