import React, { useState, useEffect } from "react";
import "../Style/blog.css"; // Import custom CSS for styling
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { EditOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined } from "@ant-design/icons";
import { Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_URL, Image_URL } from "../utils/ApiUrl";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10); // Number of blogs per page

  // Fetch blogs from the API
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/getAllBlog`);
      setBlogs(response.data.data); // Update this to match the "data" array from the API response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      await axios.put(`${API_URL}/blog/deleteBlog?id=${blogId}`);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, status: "inactive" } : blog
        )
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog Deactivated successfully.",
      })

    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) {
    return <div className="blog-container">Loading...</div>;
  }

  // Get current blogs to display
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleActive = async (editBlogId) => {
    try {
      const response = await axios.put(
        `${API_URL}/blog/updateBlog?id=${editBlogId}`,
        {
          status: "active"
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Blog Activated successfully.",
        })
        fetchBlogs();
      } else {
        throw new Error(response.data.message || "Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the blog. Please try again.",
      });
    }
  }

  return (
    <div className="blog-container">
      <div className="header">
        <h2>Blog List</h2>
        <Link to="/add-blog">
          <button className="add-button">Add New Blog</button>
        </Link>
      </div>
      <div className="table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ width: "13%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog, index) => (
              <tr key={blog._id}>
                <td>{indexOfFirstBlog + index + 1}</td>
                <td>{blog.blog_title}</td>
                <td>
                  {blog.blog_description.length > 50 ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${blog.blog_description.substring(0, 50)}...`,
                      }}
                    />
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: blog.blog_description,
                      }}
                    />
                  )}
                </td>
                <td
                  style={{
                    color: blog.status === "active" ? "#4fd104" : "#ff0000",
                    fontWeight: "bold",
                  }}
                >
                  {blog.status}
                </td>

                <td>
                  <div className="d-flex">
                    <Link
                      to={`/editblog/${blog.slug_url}`}
                      style={{ marginRight: "4%" }}
                    >
                      <EditOutlined className="edit_icon" />
                    </Link>
                    {blog.status === "active" ?
                      <Link
                        to={``}
                        style={{ marginRight: "4%" }}
                        onClick={() => handleDelete(blog.slug_url)}
                      >
                        <DeleteOutlined
                          className="delete_icon"
                          onClick={() => handleDelete(blog.slug_url)}
                        />
                      </Link>
                      :
                      <Link
                        to={``}
                        style={{ marginRight: "4%" }}
                        onClick={() => handleActive(blog.slug_url)}
                      >
                        <ReloadOutlined
                          className="delete_icon"
                          onClick={() => handleActive(blog.slug_url)}
                        />
                      </Link>
                    }
                    <div>
                      {blog.status === "active" ? (
                        <a
                          href={`${Image_URL}/blog/${blog.slug_url}`}
                          target="_blank"
                          style={{ color: '#ff5f15', textDecoration: 'none' }}
                        >
                          <LinkOutlined className="delete_icon" style={{ fontSize: '20px', cursor: 'pointer' }} />
                        </a>
                      ) : (
                        <LinkOutlined className="delete_icon" style={{ fontSize: '20px', color: '#ccc', cursor: 'not-allowed' }} />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>
          Showing {indexOfFirstBlog + 1} to{" "}
          {Math.min(indexOfLastBlog, blogs.length)} of {blogs.length} entries
        </span>
        <div className="pagination-controls">
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            First
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(blogs.length / blogsPerPage) },
            (_, i) => i + 1
          ).map((page) => (
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
            disabled={currentPage === Math.ceil(blogs.length / blogsPerPage)}
          >
            Next
          </button>
          <button
            onClick={() => paginate(Math.ceil(blogs.length / blogsPerPage))}
            disabled={currentPage === Math.ceil(blogs.length / blogsPerPage)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
