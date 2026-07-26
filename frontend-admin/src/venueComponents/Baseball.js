import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Baseball({ onChange, vendorDetails, errors }) {
  const [baseball, setBaseball] = useState({
    number_of_fields: "",
    total_area_in_sq_feet: "",
    field_dimensions: "",
    surface_type: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setBaseball({
        number_of_fields: vendorDetails.number_of_fields || "", // Set number of fields
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "", // Set total area in square feet
        field_dimensions: vendorDetails.field_dimensions || "", // Set field dimensions
        surface_type: vendorDetails.surface_type || "", // Set surface type
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    setBaseball({
      ...baseball,
      [event.target.name]: event.target.value,
    });
    onChange({ ...baseball, [event.target.name]: event.target.value });
  }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formNumberOfFields">
          <Form.Label className="heading">
            Number of Fields <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of fields"
            name="number_of_fields"
            value={baseball.number_of_fields}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_fields}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_fields}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBaseballTotalArea">
          <Form.Label className="heading">
            Total Area (in square feet) <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={baseball.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formFieldDimensions">
          <Form.Label className="heading">
            Field Dimensions <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter field dimensions"
            name="field_dimensions"
            value={baseball.field_dimensions}
            onChange={handleChange}
            isInvalid={!!errors?.field_dimensions}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.field_dimensions}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBaseballSurfaceType">
          <Form.Label className="heading">
            Surface Type <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={baseball.surface_type}  
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

export default Baseball;
