import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

function Basketball({ onChange, vendorDetails, errors }) {
  const [basketball, setBasketball] = useState({
    number_of_courts: "",
    length_in_feet: "",
    height_in_feet: "",
    width_in_feet: "",
    court_size: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setBasketball({
        number_of_courts: vendorDetails.number_of_courts || "", // Number of courts
        length_in_feet: vendorDetails.length_in_feet || "", // Length of court in feet
        height_in_feet: vendorDetails.height_in_feet || "", // Height of the court in feet
        width_in_feet: vendorDetails.width_in_feet || "", // Width of the court in feet
        court_size: vendorDetails.court_size || "", // Court size (may be a specific measurement)
      });
    }
  }, [vendorDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBasketball({ ...basketball, [name]: value });
    onChange({ ...basketball, [name]: value }); // Notify parent component of change
  };

  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formNumberOfCourts">
          <Form.Label className="heading">
            Number of Courts <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of courts"
            name="number_of_courts"
            value={basketball.number_of_courts}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_courts}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_courts}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLengthInFeet">
          <Form.Label className="heading">
            Length in Feet <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter length in feet"
            name="length_in_feet"
            value={basketball.length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formHeightInFeet">
          <Form.Label className="heading">
            Height in Feet <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter height in feet"
            name="height_in_feet"
            value={basketball.height_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.height_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.height_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formWidthInFeet">
          <Form.Label className="heading">
            Width in Feet <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter width in feet"
            name="width_in_feet"
            value={basketball.width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formCourtSize">
          <Form.Label className="heading">
            Court Size <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter court size"
            name="court_size"
            value={basketball.court_size}
            onChange={handleChange}
            isInvalid={!!errors?.court_size}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.court_size}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Basketball;
