import React, { useState, useRef } from "react";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { FiUpload, FiArrowLeft, FiCheck, FiImage, FiFileText, FiGlobe, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import slugify from "slugify";
import { API_URL } from "../utils/ApiUrl";
import { Editor } from "@tinymce/tinymce-react";
import "../Style/blog-editor.css";

export default function Createblog() {
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
    blog_image_alt: "",
    status: "active",
  });

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let validationErrors = {};
    if (!formData.blog_title?.trim()) validationErrors.blog_title = "Blog title is required.";
    if (!formData.meta_description?.trim()) validationErrors.meta_description = "Meta description is required.";
    if (!formData.blog_description?.trim()) validationErrors.blog_description = "Blog description is required.";
    if (!formData.slug_url?.trim()) validationErrors.slug_url = "Slug URL is required.";
    if (!formData.blog_image) validationErrors.blog_image = "Featured image is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      meta_keywords: formData.meta_keywords
        ? formData.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
      blog_image_alt: formData.blog_image_alt,
      status: formData.status,
    };

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/blog/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Blog Published!",
        text: "Your blog post has been created successfully.",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/blog`);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Publish Failed",
        text: error.response?.data?.message || "Unable to create the blog. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsUploadingImage(true);

      const formDataFile = new FormData();
      formDataFile.append("uploadFile", file);

      try {
        const response = await axios.post(
          `${API_URL}/upload-file?types=blog`,
          formDataFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const imageSrc = response.data.file_data[0]?.src;
        if (imageSrc) {
          setFormData((prev) => ({
            ...prev,
            blog_image: imageSrc,
          }));
          setErrors((prev) => ({ ...prev, blog_image: "" }));
        } else {
          setErrors((prev) => ({ ...prev, blog_image: "Image upload did not return a file." }));
        }
      } catch (error) {
        setImagePreview(null);
        setErrors((prev) => ({
          ...prev,
          blog_image: error.response?.data?.message || "Image upload failed. Please try again.",
        }));
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "blog_title") {
      const slug = slugify(value, { lower: true, strict: true });
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug_url: slug,
        canonical_url: prev.canonical_url || `/blog/${slug}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const metaLength = formData.meta_description?.length || 0;
  const metaStatusClass =
    metaLength === 0 ? "" : metaLength <= 160 ? "safe" : metaLength <= 200 ? "warning" : "over";

  return (
    <div className="blog-editor-page">
      <Form onSubmit={handleSubmit}>
        {/* Top bar */}
        <div className="blog-editor-topbar">
          <div>
            <div className="blog-editor-breadcrumb">
              <Link to="/blog">
                <FiArrowLeft /> Blogs
              </Link>
              <span>/</span>
              <span>Create New Post</span>
            </div>
            <h1 className="blog-editor-heading">Create Blog Post</h1>
            <p className="blog-editor-subheading">
              Write rich, SEO-friendly stories and updates for Khelo Indore.
            </p>
          </div>

          <div className="blog-editor-top-actions">
            <Link to="/blog" className="btn-editor-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-editor-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" /> Publishing...
                </>
              ) : (
                <>
                  <FiCheck /> Publish Post
                </>
              )}
            </button>
          </div>
        </div>

        <Row>
          {/* Main Column - Article Content & SEO */}
          <Col lg={8}>
            {/* Card 1: Article Content */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">
                  <FiFileText className="card-icon" /> Article Content
                </h3>
                <span className="blog-card-badge">Main</span>
              </div>

              {/* Title */}
              <div className="blog-field-group">
                <label className="blog-field-label">
                  Blog Title <span className="required-star">*</span>
                </label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 5 Simple Ways to Make Sports a Part of Your Daily Life in Indore"
                  name="blog_title"
                  className="blog-input blog-input-title"
                  value={formData.blog_title}
                  onChange={handleChange}
                  isInvalid={!!errors.blog_title}
                />
                {errors.blog_title && (
                  <div className="text-danger mt-1 font-size-12">{errors.blog_title}</div>
                )}
              </div>

              {/* Description / TinyMCE */}
              <div className="blog-field-group mb-0">
                <label className="blog-field-label">
                  Blog Description & Content <span className="required-star">*</span>
                </label>
                <Editor
                  tinymceScriptSrc={`${process.env.PUBLIC_URL || ""}/tinymce/tinymce.min.js`}
                  value={formData.blog_description}
                  onEditorChange={(content) => {
                    setFormData((prev) => ({ ...prev, blog_description: content }));
                    if (errors.blog_description) {
                      setErrors((prev) => ({ ...prev, blog_description: "" }));
                    }
                  }}
                  init={{
                    height: 520,
                    menubar: "file edit view insert format tools table help",
                    license_key: "gpl",
                    plugins: [
                      "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                      "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                      "insertdatetime", "media", "table", "help", "wordcount"
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | " +
                      "bold italic underline strikethrough | forecolor backcolor | " +
                      "link image media table | alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat | code fullscreen help",
                    link_default_target: "_blank",
                    link_assume_external_targets: "https",
                    block_formats:
                      "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Preformatted=pre",
                    content_style:
                      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #1e293b; padding: 14px; }",
                  }}
                />
                {errors.blog_description && (
                  <div className="text-danger mt-2 font-size-12">{errors.blog_description}</div>
                )}
              </div>
            </div>

            {/* Card 2: SEO & Meta Settings */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">
                  <FiGlobe className="card-icon" /> Search Engine Optimization (SEO)
                </h3>
                <span className="blog-card-badge">Google Preview</span>
              </div>

              {/* Meta Title */}
              <div className="blog-field-group">
                <label className="blog-field-label">Meta Title</label>
                <Form.Control
                  type="text"
                  placeholder="Custom title tag for search engines"
                  name="meta_title"
                  className="blog-input"
                  value={formData.meta_title}
                  onChange={handleChange}
                />
                <span className="blog-field-hint">
                  Appears as the clickable headline in Google search results.
                </span>
              </div>

              {/* Meta Description */}
              <div className="blog-field-group">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="blog-field-label mb-0">
                    Meta Description <span className="required-star">*</span>
                  </label>
                  <span className={`char-counter ${metaStatusClass}`}>
                    {metaLength} / 160 characters
                  </span>
                </div>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="meta_description"
                  className="blog-input"
                  value={formData.meta_description}
                  onChange={handleChange}
                  maxLength={320}
                  placeholder="Summarize the article in 1-2 compelling sentences for searchers..."
                  isInvalid={!!errors.meta_description}
                />
                {errors.meta_description && (
                  <div className="text-danger mt-1 font-size-12">{errors.meta_description}</div>
                )}
              </div>

              <Row>
                {/* Slug URL */}
                <Col md={6}>
                  <div className="blog-field-group">
                    <label className="blog-field-label">
                      Slug URL <span className="required-star">*</span>
                    </label>
                    <div className="slug-input-wrapper">
                      <span className="slug-prefix">/blog/</span>
                      <Form.Control
                        type="text"
                        name="slug_url"
                        placeholder="sports-daily-life-indore"
                        value={formData.slug_url}
                        onChange={handleChange}
                        isInvalid={!!errors.slug_url}
                      />
                    </div>
                    {errors.slug_url && (
                      <div className="text-danger mt-1 font-size-12">{errors.slug_url}</div>
                    )}
                  </div>
                </Col>

                {/* Canonical URL */}
                <Col md={6}>
                  <div className="blog-field-group">
                    <label className="blog-field-label">Canonical URL</label>
                    <Form.Control
                      type="text"
                      name="canonical_url"
                      className="blog-input"
                      placeholder="/blog/sports-daily-life-indore"
                      value={formData.canonical_url}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>

              {/* Meta Keywords */}
              <div className="blog-field-group mb-0">
                <label className="blog-field-label">Meta Keywords</label>
                <Form.Control
                  type="text"
                  name="meta_keywords"
                  className="blog-input"
                  placeholder="sports, Indore fitness, outdoor arenas, coaching"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                />
                <span className="blog-field-hint">Comma separated list of keywords</span>
              </div>
            </div>
          </Col>

          {/* Right Sidebar - Publishing, Image, Author */}
          <Col lg={4}>
            {/* Card 1: Publish Settings */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">Publish Settings</h3>
                <span
                  className={`status-indicator-badge ${
                    formData.status === "active" ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {formData.status === "active" ? "Active" : "Draft"}
                </span>
              </div>

              <div className="blog-status-box">
                <div className="blog-status-meta">
                  <span className="blog-status-title">Visible on Website</span>
                  <span className="blog-status-desc">
                    {formData.status === "active"
                      ? "Publicly readable by visitors"
                      : "Hidden from website users"}
                  </span>
                </div>
                <Form.Check
                  type="switch"
                  id="blog-publish-switch"
                  checked={formData.status === "active"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.checked ? "active" : "inactive",
                    }))
                  }
                />
              </div>

              <button
                type="submit"
                className="btn-editor-submit w-100 justify-content-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" /> Publishing...
                  </>
                ) : (
                  <>
                    <FiCheck /> Publish Post
                  </>
                )}
              </button>
            </div>

            {/* Card 2: Featured Image */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">
                  <FiImage className="card-icon" /> Featured Image <span className="required-star">*</span>
                </h3>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="blog-featured-image-upload"
              />

              {imagePreview || formData.blog_image ? (
                <div className="blog-preview-wrapper">
                  <img
                    src={imagePreview || formData.blog_image}
                    alt="Blog Cover Preview"
                    className="blog-preview-img"
                  />
                  <div className="blog-preview-actions">
                    <button
                      type="button"
                      className="btn-preview-change"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? "Uploading..." : "Replace Image"}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="blog-upload-zone"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <div className="blog-upload-icon">
                    <FiUpload />
                  </div>
                  <div className="blog-upload-text">
                    {isUploadingImage ? "Uploading image..." : "Upload Cover Image"}
                  </div>
                  <div className="blog-upload-subtext">PNG, JPG, WebP up to 5MB</div>
                </div>
              )}

              {errors.blog_image && (
                <div className="text-danger mt-2 font-size-12">{errors.blog_image}</div>
              )}

              {/* Alt Text */}
              <div className="blog-field-group mt-3 mb-0">
                <label className="blog-field-label">Image Alt Text</label>
                <Form.Control
                  type="text"
                  name="blog_image_alt"
                  className="blog-input"
                  placeholder="Describe the image for screen readers & SEO"
                  value={formData.blog_image_alt}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Card 3: Author */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">
                  <FiUser className="card-icon" /> Author & Attribution
                </h3>
              </div>

              <div className="blog-field-group mb-0">
                <label className="blog-field-label">Author Name</label>
                <Form.Control
                  type="text"
                  name="author"
                  className="blog-input"
                  placeholder="e.g. Khelo Indore Editorial Team"
                  value={formData.author}
                  onChange={handleChange}
                />
                <span className="blog-field-hint">
                  Displayed under the article title on the website.
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
