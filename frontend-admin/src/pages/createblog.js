import React, { useState, useRef } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { FiUpload } from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import slugify from "slugify"; // Import slugify

const API_URL = "http://127.0.0.1:3037/api";

export default function Createblog() {
  // State to store blog data (form payload)
  const [formData, setFormData] = useState({
    blog_title: "",
    meta_keywords: "",
    meta_title: "",
    blog_description: "",
    meta_description: "",
    blog_image: null,
    author: "",
    canonical_url: "",
    slug_url: "",
  });

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [imagePreview, setImagePreview] = useState(null); // Local preview state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validation checks
    let validationErrors = {};
    if (!formData.blog_title) validationErrors.blog_title = "Title is required.";
    else if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(formData.canonical_url)) {
      validationErrors.canonical_url = "Canonical URL must be a valid URL.";
    }
    if (!formData.meta_description) validationErrors.meta_description = "Description is required.";
    if (!formData.blog_image) validationErrors.blog_image = "Image is required.";

    // If there are validation errors, set the error state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      blog_title: formData.blog_title,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      blog_description: formData.blog_description,
      blog_image: formData.blog_image,
      canonical_url: formData.canonical_url,
      slug_url: formData.slug_url,
      author: formData.author,
    };

    try {
      const response = await axios.post(`${API_URL}/blog/create`, payload, {
        headers: {
          "Content-Type": "application/json", // Ensure content type is JSON
        },
      });

      // Handle success response
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog created successfully",
      }).then(() => {
        navigate(`/blog`);
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message,
      });
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show image preview locally
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const formDataFile = new FormData();
      formDataFile.append("uploadFile", file); // Append file to FormData with 'uploadFile' as key

      try {
        // Step 1: Upload the image
        const response = await axios.post(
          `${API_URL}/upload-file?types=blog`,
          formDataFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Step 2: Extract the 'src' from the response
        const imageSrc = response.data.file_data[0]?.src;
        if (imageSrc) {
          console.log("Uploaded image path:", imageSrc);
          setFormData((prev) => ({
            ...prev,
            blog_image: imageSrc, // Update the state with the uploaded image URL
          }));
        } else {
          console.error("Image upload failed, src is undefined.");
        }
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is 'blog_title' and update 'slug_url' automatically
    if (name === "blog_title") {
      const slug = slugify(value, { lower: true, strict: true }); // Use slugify to generate the slug
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug_url: slug, // Set the slug_url field
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <>
      <h2>Create Blog</h2>
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
                  name="blog_title"
                  value={formData.blog_title}
                  onChange={handleChange}
                  isInvalid={!!errors.blog_title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.blog_title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Meta Title"
                  name="meta_title"
                  value={formData.meta_title}
                  isInvalid={!!errors.meta_title}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.meta_Keywords}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Canonical URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter URL"
                  name="canonical_url"
                  isInvalid={!!errors.canonical_url}
                  value={formData.canonical_url}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.canonical_url}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  Meta Description<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <ReactQuill
                  value={formData.meta_description}
                  onChange={(value) => setFormData({ ...formData, meta_description: value })}
                  placeholder="Enter Meta Description"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      ["link"],
                      [{ align: [] }],
                      ["image"],
                      ["blockquote", "code-block"],
                    ],
                  }}
                  style={{
                    height: "100px",
                    backgroundColor: "#ffffff",
                    borderColor: "#cccccc",
                  }}
                />
              </Form.Group>

              {errors.meta_description && (
                <div className="text-danger" style={{ marginTop: "40px" }}>
                  {errors.meta_description}
                </div>
              )}
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Image<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <div className="d-flex align-items-center flex-column">
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="upload-image"
                  />
                  <Button
                    as="label"
                    htmlFor="upload-image"
                    variant="outline-secondary"
                    className="d-flex align-items-center mb-3"
                  >
                    <FiUpload className="me-2" />
                    Upload Image
                  </Button>
                  {imagePreview && (
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
                  )}
                  {formData.blog_image && !imagePreview && (
                    <div className="mb-3">
                      <img
                        src={formData.blog_image}
                        alt="Uploaded"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author's name"
                    isInvalid={!!errors.author}
                  />
                </div>
              </Form.Group>
              {errors.blog_image && (
                <div className="text-danger">{errors.blog_image}</div>
              )}
            </Col>
          </Row>

          <Row className="mb-3 mt-5">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Slug URL<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="slug_url"
                  placeholder="Enter Slug URL"
                  value={formData.slug_url}
                  onChange={handleChange}
                />
                {errors.slug_url && <div className="text-danger">{errors.slug_url}</div>}
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  Description
                </Form.Label>
                <ReactQuill
                  value={formData.blog_description}
                  onChange={(value) => setFormData({ ...formData, blog_description: value })}
                  placeholder="Enter description here"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["bold", "italic", "underline"],
                      ["link"],
                      [{ align: [] }],
                      ["image"],
                      ["blockquote", "code-block"],
                    ],
                  }}
                  style={{
                    height: "100px",
                    backgroundColor: "#ffffff",
                    borderColor: "#cccccc",
                  }}
                />
              </Form.Group>

              {/* Show the error message outside the description box */}
              {errors.blog_description && (
                <div className="text-danger" style={{ marginTop: "40px" }}>
                  {errors.blog_description}
                </div>
              )}
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="mt-5"
            style={{ backgroundColor: "#FF5F15", borderColor: "#FF5F15" }}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
