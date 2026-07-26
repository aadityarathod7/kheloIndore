import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Squash({ onChange, vendorDetails, errors }) {
  const [squash, setSquash] = useState({
    number_of_courts: "",
    total_area_in_sq_feet: "",
    length_in_feet: "",
    width_in_feet: "",
    surface_type: "",
    racket_rentals: "",
    ball_rentals: "",
    eye_protection: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setSquash({
        number_of_courts: vendorDetails.number_of_courts || "",
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        surface_type: vendorDetails.surface_type || "",
        racket_rentals: vendorDetails.racket_rentals || "",
        ball_rentals: vendorDetails.ball_rentals || "",
        eye_protection: vendorDetails.eye_protection || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setSquash({ ...squash, [name]: value });
    onChange({ ...squash, [name]: value });
  }
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
            value={squash.number_of_courts}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_courts}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_courts}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSquashTotalArea">
          <Form.Label className="heading">
            Total Area (in square feet)<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={squash.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSquashLength">
          <Form.Label className="heading">
            Length (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter length in feet"
            name="length_in_feet"
            value={squash.length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSquashWidth">
          <Form.Label className="heading">
            Width (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter width in feet"
            name="width_in_feet"
            value={squash.width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSquashSurfaceType">
          <Form.Label className="heading">
            Surface Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={squash.surface_type}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formRacketRentals">
          <Form.Label className="heading">
            Racket Rentals<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter racket rentals information"
            name="racket_rentals"
            value={squash.racket_rentals}
            onChange={handleChange}
            isInvalid={!!errors?.racket_rentals}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.racket_rentals}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formBallRentals">
          <Form.Label className="heading">
            Ball Rentals <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ball rentals information"
            name="ball_rentals"
            value={squash.ball_rentals}
            onChange={handleChange}
            isInvalid={!!errors?.ball_rentals}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.ball_rentals}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEyeProtection">
          <Form.Label className="heading">
            Eye Protection <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter eye protection information"
            name="eye_protection"
            value={squash.eye_protection}
            onChange={handleChange}
            isInvalid={!!errors?.eye_protection}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.eye_protection}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Squash;
