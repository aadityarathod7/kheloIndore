import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

const BlogGrid = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const [blog, setBlog] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const totalPages = Math.ceil(blog.length / blogsPerPage);

  const getPaginationPages = () => {
    const pages = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (start === 1) {
        end = maxPageButtons;
      } else if (end === totalPages) {
        start = totalPages - maxPageButtons + 1;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const paginationPages = getPaginationPages();

  useEffect(() => {
    setCurrentPage(1);
  }, [blog]);

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
              <div className="row justify-content-center">
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((event: any, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-12 mb-4 d-flex" key={event?.id}>
                      <div className="listing-item venue-page ki-card-hover w-100 d-flex flex-column justify-content-between" style={{ margin: 0, overflow: "hidden", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8E3", boxShadow: "0 4px 15px rgba(0,0,0,0.01)" }}>
                        <div className="listing-img" style={{ height: "140px", overflow: "hidden", position: "relative" }}>
                          <Link to={`/blog/${event?.slug_url}`} style={{ display: "block", height: "100%" }}>
                            <ImageWithBasePath
                              src={event?.picture && event?.picture.includes('/uploads/blog/') ? event?.picture : "/assets/img/no-img.png"}
                              className="img-fluid"
                              alt="Blog image"
                              style={{ height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </Link>
                        </div>
                        
                        <div className="listing-content news-content p-3 w-100 d-flex flex-column justify-content-between flex-grow-1" style={{ background: "#FFFFFF" }}>
                          <div>
                            <div className="d-flex align-items-center justify-content-between mb-1" style={{ fontSize: "11px" }}>
                              <span style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>
                                <i className="feather-tag me-1" style={{ color: "#3CAB4B", fontSize: "10px" }} />
                                Sports
                              </span>
                              <span style={{ fontSize: "10px", color: "#606D76", fontWeight: "600" }}>
                                <i className="feather-calendar me-1" style={{ color: "#3CAB4B", fontSize: "10px" }} />
                                July 2026
                              </span>
                            </div>
                            <h3 className="listing-title mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>
                              <Link to={`/blog/${event?.slug_url}`} className="text-truncate d-block" style={{ color: "#17222D" }}>
                                {event?.title}
                              </Link>
                            </h3>
                          </div>
                          
                          <div className="d-flex align-items-center justify-content-between pt-2 mt-auto" style={{ borderTop: "1px solid #E2E8E3" }}>
                            <span style={{ fontSize: "11px", color: "#64748B" }}>By Admin</span>
                            <Link 
                              to={`/blog/${event?.slug_url}`}
                              className="btn btn-outline-success btn-sm rounded-pill px-2.5 py-1"
                              style={{ fontSize: "10px", fontWeight: "600", borderColor: "#3CAB4B", color: "#3CAB4B" }}
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-lg-12 text-center py-5 bg-white rounded shadow-sm border">
                    <h5 className="text-muted" style={{ fontWeight: "500" }}>No blogs found</h5>
                  </div>
                )}
              </div>

              {/* Centered Pagination wrapper */}
              <div className="d-flex justify-content-center w-100 mt-4">
                <ul className="pagination">
                  {blog.length > blogsPerPage && (
                    <>
                      <li className={`page-item prev ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                          <i className="feather-chevron-left" />
                        </button>
                      </li>
                      {paginationPages.map((page, index) => (
                        <li
                          key={index}
                          className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
                        >
                          {page === "..." ? (
                            <span className="page-link" style={{ border: "none", background: "transparent", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center" }}>...</span>
                          ) : (
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )}
                        </li>
                      ))}
                      <li className={`page-item next ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                          <i className="feather-chevron-right" />
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Content */}
        </>
      </>
    </div>
  );
};

export default BlogGrid;
