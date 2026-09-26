import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";

const BlogGrid = () => {
  const routes = all_routes;
  const [blog, setBlog] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const filteredBlogs = blog.filter((b) =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const getPaginationPages = () => {
    const pages: any[] = [];
    const maxPageButtons = 5;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      if (start === 1) end = maxPageButtons;
      else if (end === totalPages) start = totalPages - maxPageButtons + 1;
      if (start > 1) { pages.push(1); if (start > 2) pages.push("..."); }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    }
    return pages;
  };

  const paginationPages = getPaginationPages();

  useEffect(() => { setCurrentPage(1); }, [blog, searchTerm]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blog | Khelo Indore";
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/blog/getAllActiveBlog`);
        const eventData = response?.data?.data;
        const mappedData = eventData?.map((event: any) => ({
          id: event?._id,
          slug_url: event?.slug_url,
          title: event?.blog_title,
          picture: /^https?:\/\//i.test(event?.blog_image || "") ? event.blog_image : `${IMG_URL}${event?.blog_image}`,
          imageAlt: event?.blog_image_alt || event?.blog_title || "Blog image",
          created_at: event?.created_at,
          category: event?.category || "Sports",
        }));
        setBlog(mappedData || []);
      } catch {
        // handled by UI state
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return "Recent"; }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .blog-page-wrapper { font-family: 'Inter', sans-serif; }

        /* Hero — matches site-wide standard */
        .blog-hero-section {
          background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
          padding-top: 110px;
          padding-bottom: 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #E5E7EB;
        }
        .blog-hero-badge {
          font-size: 13px;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 12px;
          color: #22C55E;
          font-weight: 700;
        }
        .blog-hero-title,
        h1.blog-hero-title {
          font-size: 56px;
          font-weight: 800;
          color: #0F172A !important;
          line-height: 1.1;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .blog-hero-title span,
        h1.blog-hero-title span {
          color: #22C55E !important;
          margin-left: 12px;
        }
        .blog-hero-subtitle {
          color: #475569 !important;
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 24px;
          max-width: 480px;
        }
        .blog-breadcrumb-pill {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 12px;
          border-radius: 100px;
          font-size: 13px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .blog-breadcrumb-pill a { color: #64748B; text-decoration: none; font-weight: 500; }
        .blog-breadcrumb-pill a:hover { color: #22C55E; }
        .blog-breadcrumb-pill .separator { color: #64748B; margin: 0 10px; }
        .blog-breadcrumb-pill .current { color: #22C55E; font-weight: 600; }
        .blog-hero-stats {
          display: flex;
          gap: 32px;
          margin-top: 24px;
        }
        .hero-stat { text-align: left; }
        .hero-stat-num {
          font-size: 24px;
          font-weight: 800;
          color: #22C55E;
          display: block;
        }
        .hero-stat-label {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Search bar */
        .blog-search-wrapper {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px 28px;
          margin: -28px 0 40px 0;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          border: 1px solid rgba(34,197,94,0.12);
          position: relative;
          z-index: 5;
        }
        .blog-search-input {
          width: 100%;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          padding: 13px 20px 13px 48px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: #0F172A !important;
          outline: none;
          transition: all 0.3s ease;
          background: #F8FAFC;
        }
        .blog-search-input::placeholder {
          color: #64748B !important;
          opacity: 1 !important;
        }
        .blog-search-input:focus {
          border-color: #22C55E;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.08);
        }
        .blog-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #16A34A !important;
          font-size: 16px;
        }

        /* Cards */
        .blog-card {
          background: #FFFFFF !important;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.12);
          border-color: rgba(34,197,94,0.3);
        }
        .blog-card-image-wrap {
          height: 200px;
          overflow: hidden;
          position: relative;
        }
        .blog-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .blog-card-image-wrap img {
          transform: scale(1.07);
        }
        .blog-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.4) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .blog-card:hover .blog-card-overlay { opacity: 1; }
        .blog-card-category {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #16A34A;
          color: #FFFFFF !important;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          z-index: 2;
        }
        .blog-card-featured-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #FFFFFF !important;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 4px 10px;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(245,158,11,0.35);
          z-index: 2;
        }
        .blog-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FFFFFF !important;
        }
        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 12px;
          color: #64748B !important;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .blog-card-meta span {
          color: #64748B !important;
        }
        .blog-card-meta i { color: #22C55E !important; }
        .blog-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A !important;
          line-height: 1.4;
          margin-bottom: 14px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-title a {
          color: #0F172A !important;
          text-decoration: none !important;
        }
        .blog-card-title a:hover {
          color: #16A34A !important;
        }
        .blog-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
          margin-top: auto;
          background: #FFFFFF !important;
        }
        .blog-card-author {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #475569 !important;
          font-weight: 600;
        }
        .blog-card-author span {
          color: #475569 !important;
        }
        .blog-card-author-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22C55E, #16A34A);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #FFFFFF !important;
          flex-shrink: 0;
        }
        .blog-read-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #22C55E, #16A34A);
          color: #FFFFFF !important;
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .blog-read-btn:hover {
          transform: translateX(3px);
          box-shadow: 0 4px 15px rgba(34,197,94,0.4);
          color: #FFFFFF !important;
        }

        /* Featured Card — Clean light theme with green accent */
        .blog-card-featured {
          background: #FFFFFF !important;
          border: 2px solid #22C55E !important;
          box-shadow: 0 10px 30px rgba(34,197,94,0.12) !important;
        }
        .blog-card-featured .blog-card-body {
          background: #FFFFFF !important;
        }
        .blog-card-featured .blog-card-title {
          font-size: 20px !important;
          font-weight: 800 !important;
          color: #0F172A !important;
          line-height: 1.35 !important;
        }
        .blog-card-featured .blog-card-title a {
          color: #0F172A !important;
        }
        .blog-card-featured .blog-card-title a:hover {
          color: #16A34A !important;
        }
        .blog-card-featured .blog-card-meta {
          font-size: 12px !important;
          color: #64748B !important;
        }
        .blog-card-featured .blog-card-meta span {
          color: #64748B !important;
        }
        .blog-card-featured .blog-card-footer {
          border-top-color: #E2E8F0 !important;
          background: #FFFFFF !important;
        }
        .blog-card-featured .blog-card-author {
          color: #475569 !important;
          font-weight: 600 !important;
        }
        .blog-card-featured .blog-card-author span {
          color: #475569 !important;
        }
        .blog-card-featured .blog-card-image-wrap { height: 240px; }

        /* Empty state */
        .blog-empty {
          text-align: center;
          padding: 80px 20px;
        }
        .blog-empty-icon {
          width: 80px;
          height: 80px;
          background: rgba(34,197,94,0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .blog-empty-icon i { font-size: 32px; color: #22C55E; }
        .blog-empty h5 { font-size: 20px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
        .blog-empty p { color: #64748B; font-size: 15px; }

        /* Skeleton loading */
        .skeleton-card {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
        }
        .skeleton-img {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-body { padding: 20px; }
        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 10px;
        }
        .skeleton-line.short { width: 60%; }
        .skeleton-line.medium { width: 80%; }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Pagination */
        .blog-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 48px;
        }
        .blog-page-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .blog-page-btn:hover:not(:disabled) {
          border-color: #22C55E;
          color: #22C55E;
          background: rgba(34,197,94,0.05);
        }
        .blog-page-btn.active {
          background: linear-gradient(135deg, #22C55E, #16A34A);
          border-color: transparent;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(34,197,94,0.35);
        }
        .blog-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .blog-page-btn.dots { cursor: default; border: none; background: transparent; }

        @media (max-width: 768px) {
          .blog-hero-title { font-size: 36px; }
          .blog-hero-stats { gap: 20px; }
          .hero-stat-num { font-size: 22px; }
        }
      `}} />

      <div className="blog-page-wrapper">
        {/* Hero */}
        <div className="blog-hero-section hero-booking-section standard-page-hero">
          {/* Blended background artwork */}
          <div style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/blog-hero.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.86 }} />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-7 text-start">
                <span className="blog-hero-badge">BOOK. PLAY. ENJOY</span>
                <h1 className="blog-hero-title" style={{ color: "#0F172A" }}>
                  Latest <span style={{ color: "#22C55E" }}>Blogs</span>
                </h1>
                <p className="blog-hero-subtitle">
                  Stay updated with the latest sports news, tips and stories from Indore
                </p>
                {blog.length > 0 && (
                  <div className="d-inline-flex align-items-center rounded-pill px-3 py-2 mb-4" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", color: "#166534", fontSize: "14px", fontWeight: "700" }}>
                    <i className="feather-file-text me-2" aria-hidden="true" />
                    {blog.length} articles published
                  </div>
                )}
                <div className="blog-breadcrumb-pill">
                  <Link to="/"><i className="feather-home me-1" style={{ color: "#64748B" }} />Home</Link>
                  <span className="separator"><i className="feather-chevron-right" style={{ fontSize: 12 }} /></span>
                  <span className="current">Blog</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container">
          {/* Search bar */}
          <div className="blog-search-wrapper">
            <div style={{ position: "relative" }}>
              <i className="feather-search blog-search-icon" />
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search blog articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="row g-4">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="col-lg-4 col-md-6">
                  <div className="skeleton-card">
                    <div className="skeleton-img" />
                    <div className="skeleton-body">
                      <div className="skeleton-line short" />
                      <div className="skeleton-line medium" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line short" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentBlogs.length > 0 ? (
            <div className="row g-4">
              {currentBlogs.map((event: any, index: number) => (
                <div
                  key={event?.id}
                  className={index === 0 && currentPage === 1 ? "col-lg-8 col-md-12" : "col-lg-4 col-md-6"}
                >
                  <div className={`blog-card ${index === 0 && currentPage === 1 ? "blog-card-featured" : ""}`}>
                    <div className="blog-card-image-wrap">
                      <Link to={`/blog/${event?.slug_url}`}>
                        <img
                          src={event?.picture || "/assets/img/no-img.png"}
                          alt={event?.imageAlt}
                          onError={(e: any) => { e.target.src = "/assets/img/no-img.png"; }}
                        />
                        <div className="blog-card-overlay" />
                      </Link>
                      <span className="blog-card-category">{event?.category || "Sports"}</span>
                      {index === 0 && currentPage === 1 && (
                        <span className="blog-card-featured-badge">
                          <i className="feather-star me-1" />Featured Story
                        </span>
                      )}
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span><i className="feather-calendar me-1" />{formatDate(event?.created_at)}</span>
                        <span><i className="feather-clock me-1" />3 min read</span>
                      </div>
                      <div className="blog-card-title">
                        <Link to={`/blog/${event?.slug_url}`}>{event?.title}</Link>
                      </div>
                      <div className="blog-card-footer">
                        <div className="blog-card-author">
                          <div className="blog-card-author-avatar">KI</div>
                          <span>Khelo Indore</span>
                        </div>
                        <Link to={`/blog/${event?.slug_url}`} className="blog-read-btn">
                          Read More <i className="feather-arrow-right" style={{ fontSize: 11 }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <div className="blog-empty-icon">
                <i className="feather-file-text" />
              </div>
              <h5>{searchTerm ? "No results found" : "No blogs yet"}</h5>
              <p>{searchTerm ? `No articles match "${searchTerm}". Try a different search.` : "Check back soon for the latest sports content."}</p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="blog-pagination">
              <button
                className="blog-page-btn"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="feather-chevron-left" />
              </button>
              {paginationPages.map((page, index) =>
                page === "..." ? (
                  <button key={index} className="blog-page-btn dots">···</button>
                ) : (
                  <button
                    key={index}
                    className={`blog-page-btn ${page === currentPage ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="blog-page-btn"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="feather-chevron-right" />
              </button>
            </div>
          )}

          <div style={{ height: 60 }} />
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
