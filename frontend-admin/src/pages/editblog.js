import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { FiUpload } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
import { API_URL, Image_URL } from "../utils/ApiUrl";

export default function EditBlog() {
  const [editBlogDetails, setEditBlogDetails] = useState({});
  const [editTitle, setEditTitle] = useState("");
  const [editMetaTitle, setEditMetaTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMetaDescription, setEditMetaDescription] = useState("");
  const [editMetaKey, setEditMetaKey] = useState("");
  const [editCanonical, setEditCanonical] = useState("");
  const [blog_image, setBlogImage] = useState(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    meta_description: "",
    metaKeywords: "",
    meta_title: "",
    canonicalUrl: "",
    image: "",
    slug_url: "",
  });
  const [slugUrl, setSlugUrl] = useState(""); // Added slug_url state

  const { slugName } = useParams();
  

  const navigate = useNavigate();

  // Fetch Blog Details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/blog/getBlogById?slug_url=${slugName}`
        );
        if (response.data.success) {
          const data = response.data.data;
          setEditBlogDetails(data);
          setEditTitle(data.blog_title || "");
          setEditDescription(data.blog_description || "");
          setEditMetaKey(data.meta_keywords || "");
          setEditCanonical(data.canonical_url || "");
          setBlogImage(data.blog_image || null);
          setImageAlt(data.blog_image_alt || data.blog_title || "");
          setStatus(data.status === "active");
          setSlugUrl(data.slug_url || "");
          setEditMetaDescription(data.meta_description || "");
          setEditMetaTitle(data.meta_title || "");
        }
      } catch (error) {
        
      }
    };
    fetchBlogDetails();
  }, [slugName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      title: "",
      description: "",
      meta_description: "",
      metaKeywords: "",
      meta_title: "",
      canonicalUrl: "",
      image: "",
      slug_url: "",
    });

    // Validation logic
    let valid = true;
    const newErrors = {};

    if (!editTitle) {
      newErrors.title = "Title is required.";
      valid = false;
    }
    if (!editDescription) {
      newErrors.description = "Description is required.";
      valid = false;
    }
    if (!blog_image) {
      newErrors.image = "Image is required.";
      valid = false;
    }
    if (!slugUrl) {
      newErrors.slug_url = "Slug URL is required."; // Added validation for slug_url
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    const payload = {
      blog_title: editTitle,
      blog_description: editDescription,
      meta_keywords: Array.isArray(editMetaKey) ? editMetaKey : editMetaKey.split(",").map((keyword) => keyword.trim()).filter(Boolean),
      canonical_url: editCanonical || `/blog/${slugUrl}`,
      blog_image_alt: imageAlt,
      status: status ? "active" : "inactive",
      slug_url: slugUrl,
      meta_description: editMetaDescription,
      meta_title: editMetaTitle,
    };

    if (blog_image) {
      payload.blog_image = blog_image;
    }

    try {
      const response = await axios.put(
        `${API_URL}/blog/updateBlog?slug_url=${slugName}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Blog updated successfully.",
        }).then(() => navigate(`/blog`));
      } else {
        throw new Error(response.data.message || "Failed to update blog.");
      }
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the blog. Please try again.",
      });
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const formData = new FormData();
      formData.append("uploadFile", file);

      try {
        const response = await axios.post(
          `${API_URL}/upload-file?types=blog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const imageSrc = response.data.file_data[0]?.src;
        if (imageSrc) {
          setBlogImage(imageSrc);
          setImagePreview(null);
        } else {
          
        }
      } catch (error) {
        
      }
    }
  };

  const handleCheckboxChange = () => {
    setStatus(!status);
  };

  return (
    <>
      <h2>Update Blog</h2>
      <Container className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Title<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                {errors.title && (
                  <div className="text-danger">{errors.title}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Meta title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Keywords"
                  value={editMetaTitle}
                  onChange={(e) => setEditMetaTitle(e.target.value)}
                />
                {errors.meta_title && (
                  <div className="text-danger">{errors.meta_title}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Canonical URL <small className="text-muted">(defaults to slug)</small></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="/blog/my-blog-slug"
                  value={editCanonical}
                  onChange={(e) => setEditCanonical(e.target.value)}
                />
                {errors.canonicalUrl && (
                  <div className="text-danger">{errors.canonicalUrl}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  Meta Description <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Editor
                  value={editMetaDescription}
                  onEditorChange={setEditMetaDescription}
                  placeholder="Enter description here"
                  init={{ height: 180, menubar: false, plugins: "lists link image code", toolbar: "undo redo | blocks | bold italic | bullist numlist | link image | code" }}
                />
                {errors.meta_description && (
                  <div className="text-danger" style={{ marginTop: "40px" }}>
                    {errors.meta_description}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <span style={{ color: "red" }}>*</span>
                <div className="d-flex align-items-center flex-column">
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="upload-image"
                  />
                  <label
                    htmlFor="upload-image"
                    className="btn btn-outline-secondary mb-3"
                  >
                    <FiUpload className="me-2" />
                    Upload Image
                  </label>

                  {imagePreview ? (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : blog_image ? (
                    <div className="mb-3">
                      <img
                        src={`${Image_URL}${blog_image}`}
                        alt="Existing Image"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <p>No image selected.</p>
                  )}
                  <Form.Label className="mt-2">Image alt text</Form.Label>
                  <Form.Control
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe the blog image"
                  />
                </div>
                {errors.image && (
                  <div className="text-danger">{errors.image}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Slug URL<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Slug URL"
                  value={slugUrl}
                  onChange={(e) => setSlugUrl(e.target.value)}
                />
                {errors.slug_url && (
                  <div className="text-danger">{errors.slug_url}</div>
                )}
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  Description<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Editor
                  value={editDescription}
                  onEditorChange={setEditDescription}
                  placeholder="Enter description here"
                  init={{ height: 360, menubar: false, plugins: "lists link image code", toolbar: "undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code", block_formats: "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4" }}
                />
                {errors.description && (
                  <div className="text-danger" style={{ marginTop: "40px" }}>
                    {errors.description}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Form.Group controlId="formCheckbox">
              <div className="checkbox-container">
                <Form.Check
                  type="checkbox"
                  id="statusCheckbox"
                  name="status"
                  aria-label="option 1"
                  className="checkbox-input"
                  checked={status}
                  onChange={handleCheckboxChange}
                />
              </div>
              <Form.Label className="checkbox-label">Status</Form.Label>
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            style={{ backgroundColor: "#FF5F15", borderColor: "#FF5F15" }}
          >
            Update
          </Button>
        </Form>
      </Container>
    </>
  );
}
