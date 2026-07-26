import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Soccer({ onChange, vendorDetails, errors }) {
  const [soccer, setSoccer] = useState({
    total_area_in_sq_feet: "",
    length_in_feet: "",
    width_in_feet: "",
    surface_type: [],
  });

  useEffect(() => {
    if (vendorDetails) {
      setSoccer({
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        surface_type: vendorDetails.surface_type || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setSoccer({ ...soccer, [name]: value });
    onChange({ ...soccer, [name]: value });
  }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        {/* <Form.Group controlId="formNumberOfTurfs">
          <Form.Label className="heading">
            Number of Turfs <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of turfs"
            name="number_of_turfs"
            value={soccer.number_of_turfs}
            onChange={handleChange}
          />
        </Form.Group> */}

        <Form.Group controlId="formSoccerTotalArea">
          <Form.Label className="heading">
            Total Area (in square feet) <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={soccer.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSoccerLength">
          <Form.Label className="heading">
            Length (in feet) <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter length in feet"
            name="length_in_feet"
            value={soccer.length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSoccerWidth">
          <Form.Label className="heading">
            Width (in feet) <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter width in feet"
            name="width_in_feet"
            value={soccer.width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formSoccerSurfaceType">
          <Form.Label className="heading">
            Surface Type <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Check
            type="checkbox"
            label="Grass"
            name="surface_type"
            value="Grass"
            checked={soccer.surface_type.includes("Grass")}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
          <Form.Check
            type="checkbox"
            label="Artificial Turf"
            name="surface_type"
            value="Artificial Turf"
            checked={soccer.surface_type.includes("Artificial Turf")}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Soccer;
