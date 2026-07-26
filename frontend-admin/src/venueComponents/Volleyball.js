import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Volleyball({ onChange, vendorDetails, errors }) {
  const [volleyball, setVolleyball] = useState({
    number_of_courts: "",
    total_area_in_sq_feet: "",
    length_in_feet: "",
    width_in_feet: "",
    surface_type: "",
    ball_rentals: "",
    net_setup: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setVolleyball({
        number_of_courts: vendorDetails.number_of_courts || "",
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        surface_type: vendorDetails.surface_type || "",
        ball_rentals: vendorDetails.ball_rentals || "",
        net_setup: vendorDetails.net_setup || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setVolleyball({ ...volleyball, [name]: value });
    onChange({ ...volleyball, [name]: value });
  }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formVolleyballNumberOfCourts">
          <Form.Label className="heading">
            Number of Courts <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of courts"
            name="number_of_courts"
            value={volleyball.number_of_courts}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_courts}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_courts}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formVolleyballTotalArea">
          <Form.Label className="heading">
            Total Area (in square feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={volleyball.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formVolleyballLength">
          <Form.Label className="heading">
            Length (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter length in feet"
            name="length_in_feet"
            value={volleyball.length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formVolleyballWidth">
          <Form.Label className="heading">
            Width (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter width in feet"
            name="width_in_feet"
            value={volleyball.width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formVolleyballSurfaceType">
          <Form.Label className="heading">
            Surface Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={volleyball.surface_type}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBallRentals">
          <Form.Label className="heading">
            Ball Rentals <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ball rentals information"
            name="ball_rentals"
            value={volleyball.ball_rentals}
            onChange={handleChange}
            isInvalid={!!errors?.ball_rentals}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.ball_rentals}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formNetSetup">
          <Form.Label className="heading">
            Net Setup <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter net setup information"
            name="net_setup"
            value={volleyball.net_setup}
            onChange={handleChange}
            isInvalid={!!errors?.net_setup}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.net_setup}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Volleyball;
