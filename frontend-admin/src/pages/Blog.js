import React, { useState, useEffect } from "react";
import "../Style/blog.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  LinkOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_URL, Image_URL } from "../utils/ApiUrl";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/getAllBlog`);
      setBlogs(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogSlug) => {
    const result = await Swal.fire({
      title: "Deactivate Blog?",
      text: "This blog will no longer be visible on the public website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, deactivate",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/blog/deleteBlog?slug_url=${blogSlug}`);
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.slug_url === blogSlug ? { ...blog, status: "inactive" } : blog
          )
        );
        Swal.fire({
          icon: "success",
          title: "Deactivated",
          text: "Blog has been deactivated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to deactivate blog.", "error");
      }
    }
  };

  const handleActive = async (blogSlug) => {
    try {
      const response = await axios.put(
        `${API_URL}/blog/updateBlog?slug_url=${blogSlug}`,
        { status: "active" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Activated!",
          text: "Blog is now live on the website.",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchBlogs();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to activate blog.", "error");
    }
  };

  // Helper to extract clean plain text from HTML
  const getExcerpt = (htmlString, maxLength = 80) => {
    if (!htmlString) return "";
    const cleanText = htmlString.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText;
  };

  // Filtering
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      (blog.blog_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.slug_url || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="blog-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#ff5f15", width: "42px", height: "42px" }} />
          <p className="mt-3 text-muted font-weight-500">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      {/* Header */}
      <div className="blog-header">
        <div className="blog-header-left">
          <h2>Blog Management</h2>
          <p>Create, edit, and organize all published sports articles & updates.</p>
        </div>
        <Link to="/add-blog" className="add-blog-btn">
          <PlusOutlined /> Create New Blog
        </Link>
      </div>

      {/* Table Card */}
      <div className="blog-table-card">
        {/* Search & Filter Bar */}
        <div className="blog-table-toolbar">
          <div className="blog-search-box">
            <SearchOutlined className="blog-search-icon" />
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: "140px", borderRadius: "8px", border: "1.5px solid #e2e8f0" }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status ({blogs.length})</option>
              <option value="active">
                Active ({blogs.filter((b) => b.status === "active").length})
              </option>
              <option value="inactive">
                Inactive ({blogs.filter((b) => b.status === "inactive").length})
              </option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-container">
          {filteredBlogs.length === 0 ? (
            <div className="blog-empty-state">
              <h4>No blogs found</h4>
              <p>Try searching for a different keyword or create a new blog post.</p>
            </div>
          ) : (
            <table className="modern-blog-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>#</th>
                  <th>Article & Title</th>
                  <th>Excerpt</th>
                  <th style={{ width: "130px" }}>Status</th>
                  <th style={{ width: "150px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog, index) => {
                  const imageSrc = blog.blog_image
                    ? blog.blog_image.startsWith("http")
                      ? blog.blog_image
                      : `${Image_URL}${blog.blog_image}`
                    : null;

                  return (
                    <tr key={blog._id || index}>
                      <td>{indexOfFirstBlog + index + 1}</td>
                      <td>
                        <div className="blog-title-cell">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt=""
                              className="blog-thumb-img"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className="blog-thumb-img d-flex align-items-center justify-content-center bg-light text-muted font-size-11"
                            >
                              No Img
                            </div>
                          )}
                          <div>
                            <div className="blog-title-text">{blog.blog_title}</div>
                            <div className="blog-meta-slug">/blog/{blog.slug_url}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="blog-desc-cell">
                          {getExcerpt(blog.blog_description)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`blog-status-pill ${
                            blog.status === "active" ? "active" : "inactive"
                          }`}
                        >
                          <span className="pill-dot"></span>
                          {blog.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="blog-actions-wrap justify-content-end">
                          {/* Live link */}
                          {blog.status === "active" && (
                            <a
                              href={`${Image_URL}/blog/${blog.slug_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="blog-action-btn preview"
                              title="View on Website"
                            >
                              <LinkOutlined />
                            </a>
                          )}

                          {/* Edit */}
                          <Link
                            to={`/editblog/${blog.slug_url}`}
                            className="blog-action-btn edit"
                            title="Edit Blog"
                          >
                            <EditOutlined />
                          </Link>

                          {/* Activate / Deactivate */}
                          {blog.status === "active" ? (
                            <button
                              type="button"
                              className="blog-action-btn deactivate"
                              onClick={() => handleDelete(blog.slug_url)}
                              title="Deactivate Blog"
                            >
                              <DeleteOutlined />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="blog-action-btn activate"
                              onClick={() => handleActive(blog.slug_url)}
                              title="Activate Blog"
                            >
                              <ReloadOutlined />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {filteredBlogs.length > 0 && (
          <div className="blog-pagination-bar">
            <span>
              Showing {indexOfFirstBlog + 1} to{" "}
              {Math.min(indexOfLastBlog, filteredBlogs.length)} of {filteredBlogs.length} blogs
            </span>
            <div className="blog-pagination-controls">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={currentPage === page ? "active" : ""}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
