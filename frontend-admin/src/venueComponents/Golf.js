import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

function Golf({ onChange, vendorDetails, errors }) {
  const [golf, setGolf] = useState({
    total_area_in_sq_feet: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setGolf({
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "", // Number of courts
      });
    }
  }, [vendorDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGolf({ ...golf, [name]: value });
    onChange({ ...golf, [name]: value }); // Notify parent component of change
  };

  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formTotalAreaSquareFeet">
          <Form.Label className="heading">
            Total Area (Square Feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={golf.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Golf;
