import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";
import { Link, useNavigate, useParams } from "react-router-dom";
import '../../src/Venue.css';
import { DeleteOutlined } from '@ant-design/icons';


const AddCoachSlot = () => {
  const { _id } = useParams();
  const id = _id;
  const [formData, setFormData] = useState({
    batchName: "",
    package_type: "",
    batchDate: "",
    batchSize: "",
    slots: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const addSlot = () => {
    if (formData.startTime && formData.endTime && formData.price) {
      const newSlot = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: parseFloat(formData.price)
      };
      setFormData({
        ...formData,
        slots: [...formData.slots, newSlot],
        startTime: "",
        endTime: "",
        price: ""
      });
    }
  };

  const handleDelete = (index) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((_, i) => i !== index)
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.batchName.trim()) {
      validationErrors.batchName = "Batch name is required";
    }
    if (!formData.package_type.trim()) {
      validationErrors.batchName = "Batch type is required";
    }
    if (!formData.batchDate.trim()) {
      validationErrors.batchDate = "Start date is required";
    }
    if (!formData.batchSize.trim()) {
      validationErrors.batchSize = "Batch size is required"; // New validation
    }
    if (formData.slots.length === 0) {
      validationErrors.slots = "At least one slot is required"; // Validate slots
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let response = await axios.post(`${API_URL}/coach-slot/add/${id}`, formData);
      if(response.data.status==200){
        Swal.fire({
          icon: "success",
          title: "success!",
          text: "Slot added successfully",
        }).then(() => {
          navigate(`/coaches/slots/${id}`);
        });
      }else{
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response.data.message,
        })
      }
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add slot. Please try again later.",
      });
    }
  };


  return (
    <>
      <h3 className="mb-4 title">Add Slots</h3>
      <div className="view_bnt d-flex justify-content-end">
        <Link className="SubmitButton" to={`/coaches/slots/${id}`}>View Slots</Link>
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formBatchName">
                <Form.Label>
                  Batch Name<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleChange}
                  isInvalid={!!errors.batchName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.batchName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formpackage_type">
                <Form.Label>
                  Batch Type<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="package_type"
                  value={formData.package_type}
                  onChange={handleChange}
                  isInvalid={!!errors.package_type}
                >
                  <option value="">Select Batch Type</option>
                  <option value="annual">Annual</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  {/* Add other options as needed */}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.package_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formbatchDate">
                <Form.Label>
                  Start Date<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="batchDate"
                  value={formData.batchDate}
                  onChange={handleChange}
                  isInvalid={!!errors.batchDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.batchDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBatchSize">
                <Form.Label>
                  Batch Size<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="batchSize"
                  value={formData.batchSize}
                  onChange={handleChange}
                  isInvalid={!!errors.batchSize}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.batchSize}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row><br></br>
          <Row>
            <Col md={4}>
              <Form.Group controlId="formStartTime">
                <Form.Label>
                  Start Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  isInvalid={!!errors.startTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formEndTime">
                <Form.Label>
                  End Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  isInvalid={!!errors.endTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formPrice">
                <Form.Label>
                  Price<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  isInvalid={!!errors.price}
                  min="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row><br></br>
          <Row>
            <Col md={12}>
              <div className="d-flex justify-content-start">
                <button
                  type="button"
                  className="SubmitButton"
                  onClick={addSlot}
                >
                  Add Slot
                </button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="my-3">
              {formData.slots.length > 0 && (
                <table>
                  <thead>
                    <tr className="slots_table">
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.slots.map((slot, index) => (
                      <tr key={index} className="slots_table">
                        <td>{slot.startTime}</td>
                        <td>{slot.endTime}</td>
                        <td>₹ {slot.price}</td>
                        <td>
                          <DeleteOutlined
                            className='delete_icon'
                            onClick={() => handleDelete(index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
            <Col md={12}>
              <div className="d-flex justify-content-start">
                <button type="submit" className="SubmitButton">
                  Add Batch
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default AddCoachSlot;
