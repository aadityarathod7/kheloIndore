import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import axios from "axios";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { sanitizeHtml } from "../../utils/sanitize";
import { Helmet } from "react-helmet";

const BlogDetailsSidebarLeft = () => {
  const routes = all_routes;
  const [blogDetails, setBlogDetails] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  const blogSlug = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Read progress bar
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      setReadProgress(Math.min(100, scrolled));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (blogDetails?.blog_title) {
      document.title = `${blogDetails.blog_title} | Khelo Indore`;
    }
  }, [blogDetails]);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/blog/getBlogById?slug_url=${blogSlug.slugName}&public=true`
        );
        if (response.data.success) {
          const data = response.data.data;
          data.blog_image = /^https?:\/\//i.test(data.blog_image || "")
            ? data.blog_image
            : `${IMG_URL}${data.blog_image}`;
          setBlogDetails(data);
        }
      } catch {
        // handled by UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [blogSlug.slugName]);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blog/getAllActiveBlog`);
        const data = response?.data?.data;
        if (data) {
          const mapped = data
            .filter((b: any) => b.slug_url !== blogSlug.slugName)
            .slice(0, 4)
            .map((b: any) => ({
              id: b._id,
              slug_url: b.slug_url,
              title: b.blog_title,
              picture: /^https?:\/\//i.test(b.blog_image || "")
                ? b.blog_image
                : `${IMG_URL}${b.blog_image}`,
              created_at: b.created_at,
            }));
          setRecentBlogs(mapped);
        }
      } catch {
        // handled silently
      }
    };
    fetchRecentBlogs();
  }, [blogSlug.slugName]);

  const canonicalPath = blogDetails?.canonical_url || `/blog/${blogSlug.slugName}`;
  const canonicalUrl = /^https?:\/\//i.test(canonicalPath)
    ? canonicalPath
    : `${window.location.origin}${canonicalPath.startsWith("/") ? canonicalPath : `/blog/${canonicalPath}`}`;
  const metaDescription = (blogDetails?.meta_description || "").replace(/<[^>]*>/g, "").trim();
  const blogSchema = blogDetails?.blog_title
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blogDetails.blog_title,
        description: metaDescription,
        image: blogDetails.blog_image || undefined,
        mainEntityOfPage: canonicalUrl,
        datePublished: blogDetails.created_at,
        dateModified: blogDetails.updated_at || blogDetails.created_at,
        author: { "@type": "Organization", name: "Khelo Indore" },
        publisher: { "@type": "Organization", name: "Khelo Indore" },
      }
    : null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>{blogDetails?.meta_title || blogDetails?.blog_title || "Blog | Khelo Indore"}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        <link rel="canonical" href={canonicalUrl} />
        {blogSchema && (
          <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        )}
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Merriweather:wght@400;700&display=swap');

        .bd-wrapper { font-family: 'Inter', sans-serif; }

        /* Read Progress */
        .read-progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #22C55E, #4ADE80);
          z-index: 9999;
          transition: width 0.1s linear;
          box-shadow: 0 0 10px rgba(34,197,94,0.5);
        }

        /* Hero — matches site-wide standard */
        .bd-hero {
          background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
          padding-top: 110px;
          padding-bottom: 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #E5E7EB;
        }
        .bd-hero-badge {
          font-size: 13px;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 12px;
          color: #22C55E;
          font-weight: 700;
        }
        .bd-hero-title {
          font-size: 40px;
          font-weight: 800;
          color: #0F172A !important;
          line-height: 1.2;
          margin-bottom: 16px;
          max-width: 720px;
        }
        .bd-hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .bd-hero-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: #475569 !important;
          font-weight: 500;
        }
        .bd-hero-meta-item i { color: #16A34A !important; }
        .bd-breadcrumb {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 8px 12px;
          border-radius: 100px;
          font-size: 13px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .bd-breadcrumb a { color: #64748B !important; text-decoration: none; font-weight: 500; }
        .bd-breadcrumb a:hover { color: #16A34A !important; }
        .bd-breadcrumb .sep { color: #94A3B8 !important; margin: 0 10px; }
        .bd-breadcrumb .cur { color: #16A34A !important; font-weight: 600; }

        /* Main Content */
        .bd-content-area {
          padding: 48px 0 60px 0;
        }
        .bd-article-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 4px 30px rgba(0,0,0,0.06);
        }
        .bd-article-image {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }
        .bd-article-body {
          padding: 40px 44px;
        }
        @media (max-width: 768px) {
          .bd-article-body { padding: 24px 20px; }
          .bd-hero-title { font-size: 28px; }
        }

        /* Rich content styling */
        .bd-rich-content {
          font-family: 'Inter', sans-serif !important;
          font-size: 16.5px !important;
          line-height: 1.85 !important;
          color: #334155 !important;
        }
        .bd-rich-content h1,
        .bd-rich-content h2 {
          font-size: 26px !important;
          font-weight: 800 !important;
          color: #0F172A !important;
          margin: 36px 0 16px !important;
          line-height: 1.3 !important;
        }
        .bd-rich-content h3 {
          font-size: 20px !important;
          font-weight: 700 !important;
          color: #0F172A !important;
          margin: 28px 0 12px !important;
        }
        .bd-rich-content h4,
        .bd-rich-content h5,
        .bd-rich-content h6 {
          font-size: 17px !important;
          font-weight: 700 !important;
          color: #0F172A !important;
          margin: 22px 0 10px !important;
        }
        .bd-rich-content p {
          margin-bottom: 18px !important;
          color: #334155 !important;
        }
        .bd-rich-content ul, .bd-rich-content ol {
          padding-left: 24px !important;
          margin-bottom: 18px !important;
          color: #334155 !important;
        }
        .bd-rich-content li { margin-bottom: 8px !important; color: #334155 !important; }
        .bd-rich-content img {
          max-width: 100% !important;
          border-radius: 12px !important;
          margin: 20px 0 !important;
        }
        .bd-rich-content a { color: #16A34A !important; text-decoration: underline !important; }
        .bd-rich-content blockquote {
          border-left: 4px solid #22C55E !important;
          margin: 24px 0 !important;
          padding: 16px 20px !important;
          background: #F0FDF4 !important;
          border-radius: 0 12px 12px 0 !important;
          font-style: italic !important;
          color: #1E293B !important;
        }
        .bd-rich-content strong, .bd-rich-content b { color: #0F172A !important; font-weight: 700 !important; }
        .bd-rich-content table { width: 100% !important; margin: 20px 0 !important; border-collapse: collapse !important; }
        .bd-rich-content th { background: #F1F5F9 !important; color: #0F172A !important; font-weight: 700 !important; padding: 10px 14px !important; border: 1px solid #CBD5E1 !important; }
        .bd-rich-content td { color: #334155 !important; padding: 10px 14px !important; border: 1px solid #E2E8F0 !important; }

        /* Divider */
        .bd-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #E2E8F0, transparent);
          margin: 32px 0;
        }

        /* Share section */
        .bd-share-section {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .bd-share-label {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .bd-share-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid #E2E8F0;
          color: #475569 !important;
          background: #FFFFFF;
        }
        .bd-share-btn:hover {
          transform: translateY(-2px);
          border-color: #22C55E !important;
          color: #22C55E !important;
          box-shadow: 0 4px 12px rgba(34,197,94,0.2);
        }

        /* Sidebar */
        .bd-sidebar-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          margin-bottom: 24px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.04);
        }
        .bd-sidebar-header {
          padding: 18px 22px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bd-sidebar-header-icon {
          width: 32px;
          height: 32px;
          background: rgba(34,197,94,0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bd-sidebar-header-icon i { color: #22C55E; font-size: 14px; }
        .bd-sidebar-header h5 {
          font-size: 14px;
          font-weight: 700;
          color: #0F172A !important;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .bd-sidebar-body { padding: 16px 22px 20px; }

        /* Recent blog items in sidebar */
        .bd-recent-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #F8FAFC;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .bd-recent-item:last-child { border-bottom: none; padding-bottom: 0; }
        .bd-recent-item:hover .bd-recent-title { color: #16A34A !important; }
        .bd-recent-thumb {
          width: 70px;
          height: 56px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bd-recent-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .bd-recent-meta { flex: 1; min-width: 0; }
        .bd-recent-title {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A !important;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
          margin-bottom: 4px;
        }
        .bd-recent-date {
          font-size: 11px;
          color: #64748B !important;
        }
        .bd-recent-date i { color: #22C55E !important; margin-right: 4px; }

        /* Back button */
        .bd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          color: #16A34A !important;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-bottom: 24px;
        }
        .bd-back-btn:hover {
          background: rgba(34,197,94,0.15);
          color: #16A34A !important;
          transform: translateX(-3px);
        }

        /* Skeleton */
        .bd-skeleton-line {
          height: 16px;
          border-radius: 8px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 12px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* CTA card */
        .bd-cta-card {
          background: linear-gradient(135deg, #0A1628 0%, #16A34A 100%);
          border-radius: 20px;
          padding: 28px 22px;
          text-align: center;
          color: #FFFFFF !important;
          position: relative;
          overflow: hidden;
        }
        .bd-cta-card::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .bd-cta-card h5 { font-size: 18px; font-weight: 800; margin-bottom: 10px; color: #FFFFFF !important; }
        .bd-cta-card p { font-size: 13px; color: #FFFFFF !important; opacity: 0.9 !important; margin-bottom: 18px; line-height: 1.6; }
        .bd-cta-btn {
          display: inline-block;
          background: #FFFFFF !important;
          color: #16A34A !important;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 24px;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .bd-cta-btn:hover {
          background: #F0FDF4 !important;
          color: #16A34A !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}} />

      {/* Read progress bar */}
      <div
        className="read-progress-bar"
        style={{ width: `${readProgress}%` }}
      />

      <div className="bd-wrapper">
        {/* Hero */}
        <div className="bd-hero hero-booking-section standard-page-hero">
          {/* Blended background artwork */}
          <div style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.86 }} />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row">
              <div className="col-lg-9">
                <span className="bd-hero-badge">BLOG POST</span>
                {isLoading ? (
                  <>
                    <div style={{ height: 36, width: "75%", borderRadius: 8, background: "#E2E8F0", marginBottom: 16 }} />
                    <div style={{ height: 14, width: "40%", borderRadius: 6, background: "#E2E8F0" }} />
                  </>
                ) : (
                  <>
                    <h1 className="bd-hero-title" style={{ color: "#0F172A" }}>
                      {blogDetails?.blog_title || "Blog Article"}
                    </h1>
                    <div className="bd-hero-meta">
                      <span className="bd-hero-meta-item">
                        <i className="feather-user" />
                        By Admin
                      </span>
                      <span className="bd-hero-meta-item">
                        <i className="feather-calendar" />
                        {formatDate(blogDetails?.created_at)}
                      </span>
                      <span className="bd-hero-meta-item">
                        <i className="feather-clock" />
                        {Math.ceil((blogDetails?.blog_description?.replace(/<[^>]*>/g, "")?.split(/\s+/)?.length || 300) / 200)} min read
                      </span>
                    </div>
                  </>
                )}
                <div className="bd-breadcrumb">
                  <Link to="/"><i className="feather-home me-1" style={{ color: "#64748B" }} />Home</Link>
                  <span className="sep"><i className="feather-chevron-right" style={{ fontSize: 12 }} /></span>
                  <Link to="/blog" style={{ color: "#64748B" }}>Blog</Link>
                  <span className="sep"><i className="feather-chevron-right" style={{ fontSize: 12 }} /></span>
                  <span className="cur">Article</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bd-content-area">
          <div className="container">
            <div className="row g-4">
              {/* Main Article */}
              <div className="col-lg-8">
                <Link to="/blog" className="bd-back-btn">
                  <i className="feather-arrow-left" />
                  Back to Blog
                </Link>

                {isLoading ? (
                  <div className="bd-article-card">
                    <div style={{ height: 320, background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    <div style={{ padding: "40px 44px" }}>
                      {[80, 65, 90, 55, 75, 60].map((w, i) => (
                        <div key={i} className="bd-skeleton-line" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bd-article-card">
                    {blogDetails?.blog_image && (
                      <img
                        src={blogDetails.blog_image}
                        alt={blogDetails?.blog_image_alt || blogDetails?.blog_title || "Blog image"}
                        className="bd-article-image"
                        onError={(e: any) => { e.target.style.display = "none"; }}
                      />
                    )}

                    <div className="bd-article-body">
                      <div
                        className="bd-rich-content"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(
                            blogDetails?.blog_description
                              ? blogDetails.blog_description
                                  .replace(/&lt;/g, "<")
                                  .replace(/&gt;/g, ">")
                                  .replace(/<h1\b/gi, "<h2")
                                  .replace(/<\/h1>/gi, "</h2>")
                              : "<p style='color:#94A3B8;'>No content available for this article.</p>"
                          ),
                        }}
                      />

                      <div className="bd-divider" />

                      {/* Share */}
                      <div className="bd-share-section">
                        <span className="bd-share-label">Share:</span>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="bd-share-btn"
                        >
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(blogDetails?.blog_title || "")}`}
                          target="_blank" rel="noopener noreferrer"
                          className="bd-share-btn"
                        >
                          <i className="fa-brands fa-twitter" />
                        </a>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="bd-share-btn"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </a>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent((blogDetails?.blog_title || "") + " " + canonicalUrl)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="bd-share-btn"
                        >
                          <i className="fa-brands fa-whatsapp" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                {/* CTA Card */}
                <div className="bd-cta-card mb-4">
                  <h5>🏆 Book a Sports Venue</h5>
                  <p>Find and book the best sports venues in Indore. Play your favorite sport today!</p>
                  <Link to="/sports-venue" className="bd-cta-btn">
                    Explore Venues
                  </Link>
                </div>

                {/* Recent Articles */}
                <div className="bd-sidebar-card">
                  <div className="bd-sidebar-header">
                    <div className="bd-sidebar-header-icon">
                      <i className="feather-trending-up" />
                    </div>
                    <h5>Recent Articles</h5>
                  </div>
                  <div className="bd-sidebar-body">
                    {recentBlogs.length === 0 ? (
                      [1, 2, 3].map((i) => (
                        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #F8FAFC" }}>
                          <div style={{ width: 70, height: 56, borderRadius: 10, background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div className="bd-skeleton-line" style={{ height: 11, width: "90%" }} />
                            <div className="bd-skeleton-line" style={{ height: 11, width: "60%" }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      recentBlogs.map((b) => (
                        <Link key={b.id} to={`/blog/${b.slug_url}`} className="bd-recent-item">
                          <div className="bd-recent-thumb">
                            <img
                              src={b.picture || "/assets/img/no-img.png"}
                              alt={b.title}
                              onError={(e: any) => { e.target.src = "/assets/img/no-img.png"; }}
                            />
                          </div>
                          <div className="bd-recent-meta">
                            <div className="bd-recent-title">{b.title}</div>
                            <div className="bd-recent-date">
                              <i className="feather-calendar" />
                              {formatDate(b.created_at)}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bd-sidebar-card">
                  <div className="bd-sidebar-header">
                    <div className="bd-sidebar-header-icon">
                      <i className="feather-tag" />
                    </div>
                    <h5>Popular Tags</h5>
                  </div>
                  <div className="bd-sidebar-body">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {["Sports", "Fitness", "Badminton", "Cricket", "Football", "Indore", "Venues", "Health"].map((tag) => (
                        <Link
                          key={tag}
                          to="/blog"
                          style={{
                            display: "inline-block",
                            padding: "5px 14px",
                            borderRadius: 100,
                            background: "rgba(34,197,94,0.07)",
                            border: "1px solid rgba(34,197,94,0.2)",
                            color: "#16A34A",
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e: any) => { e.target.style.background = "#22C55E"; e.target.style.color = "#FFFFFF"; }}
                          onMouseLeave={(e: any) => { e.target.style.background = "rgba(34,197,94,0.07)"; e.target.style.color = "#16A34A"; }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
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
