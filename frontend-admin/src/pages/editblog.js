import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { FiUpload, FiArrowLeft, FiCheck, FiImage, FiFileText, FiGlobe, FiExternalLink } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL, Image_URL } from "../utils/ApiUrl";
import { Editor } from "@tinymce/tinymce-react";
import "../Style/blog-editor.css";

export default function EditBlog() {
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
  const [slugUrl, setSlugUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fileInputRef = useRef(null);
  const { slugName } = useParams();
  const navigate = useNavigate();

  // Fetch Blog Details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/blog/getBlogById?slug_url=${slugName}`
        );
        if (response.data.success) {
          const data = response.data.data;
          setEditTitle(data.blog_title || "");
          setEditDescription(data.blog_description || "");
          setEditMetaKey(
            Array.isArray(data.meta_keywords)
              ? data.meta_keywords.join(", ")
              : data.meta_keywords || ""
          );
          setEditCanonical(data.canonical_url || "");
          setBlogImage(data.blog_image || null);
          setImageAlt(data.blog_image_alt || data.blog_title || "");
          setStatus(data.status === "active");
          setSlugUrl(data.slug_url || "");
          setEditMetaDescription(data.meta_description || "");
          setEditMetaTitle(data.meta_title || "");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load blog details.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slugName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    let valid = true;
    const newErrors = {};

    if (!editTitle?.trim()) {
      newErrors.title = "Blog title is required.";
      valid = false;
    }
    if (!editDescription?.trim()) {
      newErrors.description = "Blog description is required.";
      valid = false;
    }
    if (!editMetaDescription?.trim()) {
      newErrors.meta_description = "Meta description is required.";
      valid = false;
    }
    if (!blog_image) {
      newErrors.image = "Featured image is required.";
      valid = false;
    }
    if (!slugUrl?.trim()) {
      newErrors.slug_url = "Slug URL is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      blog_title: editTitle,
      blog_description: editDescription,
      meta_keywords: Array.isArray(editMetaKey)
        ? editMetaKey
        : editMetaKey.split(",").map((k) => k.trim()).filter(Boolean),
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

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${API_URL}/blog/updateBlog?slug_url=${slugName}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Blog Updated!",
          text: "Your changes have been saved successfully.",
          timer: 1800,
          showConfirmButton: false,
        }).then(() => navigate(`/blog`));
      } else {
        throw new Error(response.data.message || "Failed to update blog.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update the blog. Please try again.",
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

      const formData = new FormData();
      formData.append("uploadFile", file);

      try {
        const response = await axios.post(
          `${API_URL}/upload-file?types=blog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const imageSrc = response.data.file_data[0]?.src;
        if (imageSrc) {
          setBlogImage(imageSrc);
          setErrors((prev) => ({ ...prev, image: "" }));
        } else {
          setErrors((prev) => ({ ...prev, image: "Image upload did not return a file." }));
        }
      } catch (error) {
        setImagePreview(null);
        setErrors((prev) => ({
          ...prev,
          image: error.response?.data?.message || "Image upload failed. Please try again.",
        }));
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const metaLength = editMetaDescription?.length || 0;
  const metaStatusClass =
    metaLength === 0 ? "" : metaLength <= 160 ? "safe" : metaLength <= 200 ? "warning" : "over";

  const resolvedImageSrc = imagePreview
    ? imagePreview
    : blog_image
    ? blog_image.startsWith("http")
      ? blog_image
      : `${Image_URL}${blog_image}`
    : null;

  if (loading) {
    return (
      <div className="blog-editor-page d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#ff5f15", width: "42px", height: "42px" }} />
          <p className="mt-3 text-muted font-weight-500">Loading blog details...</p>
        </div>
      </div>
    );
  }

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
              <span>Edit Blog</span>
            </div>
            <h1 className="blog-editor-heading">Update Blog Post</h1>
            <p className="blog-editor-subheading">
              Editing: <strong className="text-dark">{editTitle || slugName}</strong>
            </p>
          </div>

          <div className="blog-editor-top-actions">
            {status && (
              <a
                href={`${Image_URL}/blog/${slugUrl || slugName}`}
                target="_blank"
                rel="noreferrer"
                className="btn-editor-cancel"
              >
                <FiExternalLink /> View Live
              </a>
            )}
            <Link to="/blog" className="btn-editor-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-editor-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" /> Saving...
                </>
              ) : (
                <>
                  <FiCheck /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <Row>
          {/* Main Column */}
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
                  placeholder="Enter Title"
                  className="blog-input blog-input-title"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  isInvalid={!!errors.title}
                />
                {errors.title && (
                  <div className="text-danger mt-1 font-size-12">{errors.title}</div>
                )}
              </div>

              {/* Description / TinyMCE */}
              <div className="blog-field-group mb-0">
                <label className="blog-field-label">
                  Blog Description & Content <span className="required-star">*</span>
                </label>
                <Editor
                  tinymceScriptSrc={`${process.env.PUBLIC_URL || ""}/tinymce/tinymce.min.js`}
                  value={editDescription}
                  onEditorChange={(content) => {
                    setEditDescription(content);
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: "" }));
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
                {errors.description && (
                  <div className="text-danger mt-2 font-size-12">{errors.description}</div>
                )}
              </div>
            </div>

            {/* Card 2: SEO Settings */}
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
                  className="blog-input"
                  value={editMetaTitle}
                  onChange={(e) => setEditMetaTitle(e.target.value)}
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
                  className="blog-input"
                  value={editMetaDescription}
                  onChange={(e) => {
                    setEditMetaDescription(e.target.value);
                    if (errors.meta_description)
                      setErrors((prev) => ({ ...prev, meta_description: "" }));
                  }}
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
                        placeholder="sports-daily-life-indore"
                        value={slugUrl}
                        onChange={(e) => {
                          setSlugUrl(e.target.value);
                          if (errors.slug_url)
                            setErrors((prev) => ({ ...prev, slug_url: "" }));
                        }}
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
                      className="blog-input"
                      placeholder="/blog/sports-daily-life-indore"
                      value={editCanonical}
                      onChange={(e) => setEditCanonical(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>

              {/* Meta Keywords */}
              <div className="blog-field-group mb-0">
                <label className="blog-field-label">Meta Keywords</label>
                <Form.Control
                  type="text"
                  className="blog-input"
                  placeholder="sports, Indore fitness, outdoor arenas, coaching"
                  value={editMetaKey}
                  onChange={(e) => setEditMetaKey(e.target.value)}
                />
                <span className="blog-field-hint">Comma separated list of keywords</span>
              </div>
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col lg={4}>
            {/* Card 1: Publish Settings */}
            <div className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-card-title">Publish Settings</h3>
                <span
                  className={`status-indicator-badge ${
                    status ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {status ? "Active" : "Draft"}
                </span>
              </div>

              <div className="blog-status-box">
                <div className="blog-status-meta">
                  <span className="blog-status-title">Visible on Website</span>
                  <span className="blog-status-desc">
                    {status
                      ? "Publicly readable by visitors"
                      : "Hidden from website users"}
                  </span>
                </div>
                <Form.Check
                  type="switch"
                  id="edit-blog-publish-switch"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              </div>

              <button
                type="submit"
                className="btn-editor-submit w-100 justify-content-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" /> Saving...
                  </>
                ) : (
                  <>
                    <FiCheck /> Save Changes
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
                id="edit-blog-featured-image-upload"
              />

              {resolvedImageSrc ? (
                <div className="blog-preview-wrapper">
                  <img
                    src={resolvedImageSrc}
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

              {errors.image && (
                <div className="text-danger mt-2 font-size-12">{errors.image}</div>
              )}

              {/* Alt Text */}
              <div className="blog-field-group mt-3 mb-0">
                <label className="blog-field-label">Image Alt Text</label>
                <Form.Control
                  type="text"
                  className="blog-input"
                  placeholder="Describe the image for screen readers & SEO"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
