import '../../src/Category.css';
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiX } from 'react-icons/fi';
import { API_URL } from '../utils/ApiUrl';
import { Image_URL } from '../utils/ApiUrl';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

function Category() {
  const { _id } = useParams();
  const [input, setInput] = useState({
    category_name: "",
    images: [],
    status: true,
    parent_category_name: "Select Parent Category",
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [newFile, setNewFile] = useState({ new_images: [] });
  const [filePreview, setFilePreview] = useState();
  const navigate = useNavigate();

  // Fetch Parent Categories on component mount
  useEffect(() => {
    fetchParentCategories();
  }, []);

  // Fetch category details when _id is present
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${API_URL}/category/fetch-ind/${_id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const category = response.data.category;
        
        setInput({
          category_name: category.category_name,
          status: category.status,
          parent_category_name: category.parent_category_name,
          images: category.images
        });
  
        if (category.images.length > 0) {
          setFilePreview(category.images);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };
  
    fetchCategory();
  }, [_id]);

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/parent-category/fetch`);
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
    setNewFile(prevState => ({
      ...prevState,
      new_images: [...prevState.new_images, ...files],
    }));
  };

  const handleRemovePreviousImages = (index) => {
    setFilePreview(prevState => prevState.filter((_, i) => i !== index));
  };

  const handleRemovePhoto = (index) => {
    setNewFile(prevState => ({
      ...prevState,
      new_images: prevState.new_images.filter((_, i) => i !== index),
    }));
  };

  // Upload image function
  const uploadImage = async (fileArray) => {
    try {
      const formData = new FormData();
      fileArray.forEach((newFile) => {
        formData.append(`uploadFile`, newFile);
      });
      const response = await axios.post(
        `${API_URL}/upload-file?type=category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/categories');
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.category_name.trim() === '') {
      Swal.fire({
        title: "Validation Error!",
        text: "Category name is required",
        icon: "error"
      });
    } else {
      try {
        let mergedImages = input.images;

        // Only upload images if new files are selected
        if (newFile.new_images.length > 0) {
          const uploadResponses = await uploadImage(newFile.new_images);
          if (uploadResponses) {
            mergedImages = input.images.concat(uploadResponses.data.file_data);
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to upload one or more images",
              icon: "error"
            });
            return;
          }
        }

        // Update category API call
        const response = await axios.put(
          `${API_URL}/category/update/${_id}`,
          {
            'parent_category_name': input.parent_category_name,
            'category_name': input.category_name,
            'status': input.status,
            'images': mergedImages
          },
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        Swal.fire({
          title: "Submitted!",
          text: "Category updated successfully!",
          icon: "success"
        }).then(() => {
          navigate("/categories");
        });
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        Swal.fire({
          title: "Error!",
          text: "Failed to update category",
          icon: "error"
        });
      }
    }
  };

  return (
    <>
      <h3 className="mb-4 title">Update Category</h3>
      <div className="form">
        <Form.Group controlId="formParentCategory" style={{ width: '67.5%' }}>
          <Form.Label className="heading">
            Parent Category<span className="text-danger">*</span>
          </Form.Label>
          <Select
            name="parent_category_name"
            value={input.parent_category_name}
            options={parentCategories.map(category => ({
              label: category.name,
              value: category.name
            }))}
            onChange={handleParentCategoryChange}
            placeholder={input.parent_category_name}
          />
        </Form.Group>
        <br />
        <div className="mb-3">
          <h7 style={{ marginTop: '10px' }}>Category<span className="text-danger">*</span></h7>
   
          <Form.Control
            type="text"
            id="text"
            name="category_name"
            aria-describedby="passwordHelpBlock"
            className="form-control-sm"
            value={input.category_name}
            onChange={(e) => setInput({ ...input, category_name: e.target.value })}
            style={{ marginTop: '10px' }}
          />
        </div>

        <div className="mb-3">
          <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Upload Photo<span className="text-danger">*</span></h6>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              setInput(prevState => ({
                ...prevState,
                images: [...prevState.images, ...files.filter(file => file.type.startsWith('image/'))],
              }));
            }}
            onDragOver={(e) => e.preventDefault()}
            style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', width: '300px' }}
          >
            <h3 style={{ fontSize: '18px' }}>Drag & Drop here</h3>
            <div style={{ marginBottom: '10px' }}>
              <FiUpload style={{ fontSize: '48px', marginBottom: '10px' }} />
              <input type="file" multiple onChange={handleFileInputChange} style={{ display: 'none' }} />
              <button className='btn3' onClick={() => document.querySelector('input[type=file]').click()}> Or Click to Select </button>
            </div>
            <div>
              {filePreview && (
                <div>
                  {filePreview.map((ele, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={`${Image_URL}${ele.src}`} alt="Selected Photo" style={{ width: '100px', height: '100px', margin: '5px' }} />
                      <button
                        onClick={() => handleRemovePreviousImages(index)}
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {newFile.new_images.map((photo, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={URL.createObjectURL(photo)} alt={`Photo ${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Form.Group controlId="formCheckbox">
          <div className="checkbox-container">
            <Form.Check
              type="checkbox"
              id="statusCheckbox"
              name="status"
              aria-label="option 1"
              className="checkbox-input"
              checked={input.status || false}
              onChange={e => setInput({ ...input, status: e.target.checked })}
            />
          </div>
          <Form.Label className="checkbox-label">Status</Form.Label>
        </Form.Group>

        <div className="mb-3">
          <form>
            <button className="btn1" type="submit" onClick={handleSubmit}>Update</button>
            <button className="btn2" type="button" onClick={handleCancel}>Cancel</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Category;
