import "../../src/Category.css";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUpload, FiX } from "react-icons/fi";
import { API_URL } from "../utils/ApiUrl";
import Select from "react-select";

function Category() {
  const [input, setInput] = useState({
    category_name: "",
    images: [],
    status: true,
    parent_category_name: "Select Parent Category",
  });

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [parentCategories, setParentCategories] = useState([]);
  
  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/parent-category/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setParentCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleParentCategoryChange = (selectedOption) => {
    setInput({ ...input, parent_category_name: selectedOption.label });
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setInput((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  
  const handleRemovePhoto = (index) => {
    setInput((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const uploadImage = async (fileArray) => {
    try {
      const formData = new FormData();
      fileArray.forEach((file) => {
        formData.append("uploadFile", file); // Make sure the key here is 'uploadFile'
      });

      const response = await axios.post(`${API_URL}/upload-file?types=category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response); // Debug: Check the response
      return response;
    } catch (error) {
      console.error("Upload API Error:", error);
      return null;
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/categories");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
  
    if (!input.category_name.trim()) {
      validationErrors.category_name = "Category name is required";
    }
  
    if (input.parent_category_name === "Select Parent Category") {
      validationErrors.parent_category_name = "Parent category is required";
    }
  
    if (!input.images || input.images.length === 0) {
      validationErrors.images = "Please select at least one image";
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      console.log("Uploading images:", input.images);  // Debugging line
  
      const uploadResponses = await uploadImage(input.images);
      if (uploadResponses && uploadResponses.data && uploadResponses.data.file_data) {
        const formData = new FormData();
        formData.append("parent_category_name", input.parent_category_name);
        formData.append("category_name", input.category_name);
        formData.append("status", input.status);
  
        uploadResponses.data.file_data.forEach((file) => {
          formData.append("images", file);
        });
  
        console.log("Submitting category with data:", formData);  // Debugging line
  
        const response = await axios.post(
          `${API_URL}/category/create`,
          {
            parent_category_name: input.parent_category_name,
            category_name: input.category_name,
            status: input.status,
            images: uploadResponses.data.file_data,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        Swal.fire({
          title: "Submitted!",
          text: "Category added successfully!",
          icon: "success",
        }).then(() => {
          navigate("/categories");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to upload one or more images",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        title: "Error!",
        text: "Failed to add category",
        icon: "error",
      });
    }
  };
  

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <>
      <h3 className="mb-2 title">Category</h3>
      <div className="form">
        <Form.Group controlId="formParentCategory" style={{ width: "67.5%" }}>
          <Form.Label className="heading">
          <h7>Parent Category<span className="text-danger">*</span></h7>
          </Form.Label>
          <Select
            name="parent_category_name"
            value={input.parent_category_name}
            options={parentCategories.map((category) => ({
              label: category.name,
              value: category.name,
            }))}
            onChange={handleParentCategoryChange}
            placeholder={input.parent_category_name}
          />
          {errors.parent_category_name && (
            <div style={{ color: "red", fontSize: "0.875em", marginTop: "0.25rem" }}>
              {errors.parent_category_name}
            </div>
          )}
        </Form.Group>

        <div className="mb-3 mt-2">
          <h7>Category<span className="text-danger">*</span></h7>

          <Form.Control
            type="text"
            id="text"
            name="category_name"
            placeholder="Enter Category"
            className="form-control-sm"
            value={input.category_name}
            onChange={handleChange}
            style={{ marginTop: "10px" }}
          />
          {errors.category_name && (
            <div style={{ color: "red", fontSize: "0.875em", marginTop: "0.25rem" }}>
              {errors.category_name}
            </div>
          )}
        </div>

        <div className="mb-3">
          <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Upload Photo<span className="text-danger">*</span></h6>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              setInput((prevState) => ({
                ...prevState,
                images: [
                  ...prevState.images,
                  ...files.filter((file) => file.type.startsWith("image/")),
                ],
              }));
              setErrors((prevErrors) => ({
                ...prevErrors,
                images: "",
              }));
            }}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: errors.images ? "2px dashed red" : "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3 style={{ fontSize: "18px" }}>Drag & Drop here</h3>
            <div style={{ marginBottom: "10px" }}>
              <FiUpload
                style={{ fontSize: "48px", marginBottom: "10px" }}
                onClick={handleButtonClick}
              />
              <input
                type="file"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
                ref={fileInputRef}
                multiple
              />
              <button className="btn3" onClick={handleButtonClick}>
                Or Click to Select
              </button>
            </div>
            <div>
              {input.images.map((photo, index) => (
                <div key={index} style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index}`}
                    style={{ width: "100px", height: "100px", margin: "5px" }}
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {errors.images && (
            <div style={{ color: "red", fontSize: "0.875em", marginTop: "0.25rem" }}>
              {errors.images}
            </div>
          )}
        </div>

        <Form.Group controlId="formCheckbox">
          <div className="checkbox-container">
            <Form.Check
              type="checkbox"
              id="statusCheckbox"
              name="status"
              className="checkbox-input"
              checked={input.status || false}
              onChange={(e) => setInput({ ...input, status: e.target.checked })}
            />
          </div>
          <Form.Label className="checkbox-label">Status</Form.Label>
        </Form.Group>

        <div className="mb-3">
          <form>
            <button className="btn1" type="submit" onClick={handleSubmit}>
              Save
            </button>
            <button className="btn2" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Category;
