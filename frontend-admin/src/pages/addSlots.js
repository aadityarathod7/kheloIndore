import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";
import { Link, useNavigate, useParams } from "react-router-dom";
import '../../src/Venue.css';

const AddSlot = () => {
  const { _id } = useParams(); 
  const id = _id;
  const [formData, setFormData] = useState({
    dateFrom: "",
    dateTo: "",
    startTime: "",
    endTime: "",
    available: true,
  });

  const [slots, setslots] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      generateslots(formData.startTime, formData.endTime);
    }
  }, [formData.startTime, formData.endTime]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.dateFrom.trim()) {
      validationErrors.dateFrom = "Date From is required";
    }
    if (!formData.dateTo.trim()) {
      validationErrors.dateTo = "Date To is required";
    }
    if (!formData.startTime.trim()) {
      validationErrors.startTime = "Start time is required";
    }
    if (!formData.endTime.trim()) {
      validationErrors.endTime = "End time is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    function convertTo24HourFormat(time) {
      const [hours, minutes] = time.split(':');
      const period = time.slice(-2);
      let adjustedHours = parseInt(hours, 10);
    
      if (period === 'PM' && adjustedHours !== 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && adjustedHours === 12) {
        adjustedHours = 0;
      }
    
      return `${String(adjustedHours).padStart(2, '0')}:${minutes.slice(0, 2)}`;
    }
    
    const formattedData = {
      dateFrom: new Date(formData.dateFrom).toISOString().split('T')[0],
      dateTo: new Date(formData.dateTo).toISOString().split('T')[0],
      slots: slots.map((slot) => ({
        startTime: convertTo24HourFormat(slot.time.split(" - ")[0]),
        endTime: convertTo24HourFormat(slot.time.split(" - ")[1]),
        price: slot.price,
      })),
    };
    
    

    try {
      const response = await axios.post(`${API_URL}/slot/add/${id}`, formattedData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Slot added successfully",
      }).then(() => {
        navigate("/venues");
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add slot. Please try again later.",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      dateFrom: "",
      dateTo: "",
      startTime: "",
      endTime: "",
      available: true,
    });
    setErrors({});
    setslots([]);
  };

  const generateslots = (start, end) => {
    const startHour = new Date(`1970-01-01T${convertTo24HourFormat(start)}`);
    let endHour = new Date(`1970-01-01T${convertTo24HourFormat(end)}`);
    
    if (endHour <= startHour) {
      endHour.setDate(endHour.getDate() + 1);
    }

    let slots = [];

    for (let hour = new Date(startHour); hour < endHour; hour.setHours(hour.getHours() + 1)) {
      const time = convertTo12HourFormat(
        `${hour.getHours().toString().padStart(2, "0")}:00`
      );
      const nextHour = new Date(hour);
      nextHour.setHours(nextHour.getHours() + 1);
      const nextTime = convertTo12HourFormat(
        `${nextHour.getHours().toString().padStart(2, "0")}:00`
      );

      slots.push({
        time: `${time} - ${nextTime}`,
        price: 0,
      });
    }

    setslots(slots);
  };

  const handlePriceChange = (index, e) => {
    const { value } = e.target;
    const updatedSlots = [...slots];
    updatedSlots[index].price = value;
    setslots(updatedSlots);
  };

  const hours = generate12HourTimes();

  return (
    <>
      <h3 className="mb-4 title">Add Slots</h3>
      <div className="view_bnt d-flex justify-content-end">
        <Link className="SubmitButton" to={`/venues/slots/${id}`}>View Slots</Link>
      </div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formDateFrom">
                <Form.Label>
                  Date From<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleChange}
                  isInvalid={!!errors.dateFrom}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateFrom}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formDateTo">
                <Form.Label>
                  Date To<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleChange}
                  isInvalid={!!errors.dateTo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateTo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formStartTime">
                <Form.Label>
                  Start Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  isInvalid={!!errors.startTime}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.startTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEndTime">
                <Form.Label>
                  End Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  isInvalid={!!errors.endTime}
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.endTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row><br></br>
          <Row>
            <Col md={12}>
              <h6>Time Slots</h6>
              <Row>
                {slots.map((slot, index) => (
                  <Col key={index} md={2} style={{ marginBottom: "10px", textAlign: "center" }}>
                    <div
                      className="slot-container"
                    >
                      {slot.time}
                      <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={slot.price}
                        onChange={(e) => handlePriceChange(index, e)}
                        className="slot-input"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
          <Form.Group controlId="formAvailable">
                <Form.Check
                  type="checkbox"
                  label="Available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
              </Form.Group>
            <Col md={12}>
              <div className="d-flex justify-content-start">
                <button type="submit" className="SubmitButton">
                  Add
                </button>
                <button
                  type="button"
                  className="CancelButton"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

const generate12HourTimes = () => {
  const times = [];
  for (let hour = 1; hour <= 12; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    times.push(`${formattedHour}:00 AM`);
  }
  for (let hour = 1; hour <= 12; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    times.push(`${formattedHour}:00 PM`);
  }
  return times;
};

const convertTo24HourFormat = (time) => {
  if (!time || typeof time !== "string") {
    return "";
  }

  const matchResult = time.match(/(\d+):(\d+) (AM|PM)/);
  if (!matchResult) {
    return ""; // Handle invalid time format
  }

  const [_, hour, minute, period] = matchResult;
  let hours24 = parseInt(hour, 10);
  if (period === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours24 === 12) {
    hours24 = 0;
  }
  return `${hours24.toString().padStart(2, "0")}:${minute}`;
};

const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":");
  const period = +hours < 12 || +hours === 24 ? "AM" : "PM";
  const hour = +hours % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minutes} ${period}`;
};

export default AddSlot;
