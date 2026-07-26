import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
function Archery({ onChange, vendorDetails, errors }) {
  const [archery, setArchery] = useState({
    number_of_ranges: "",
    total_area_in_sq_feet: "",
    target_distance: "",
    surface_type: "",
    safety_equipment: "",
    instruction: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setArchery({
        number_of_ranges: vendorDetails.number_of_ranges || "",
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        target_distance: vendorDetails.target_distance || "",
        surface_type: vendorDetails.surface_type || "",
        safety_equipment: vendorDetails.safety_equipment || "",
        instruction: vendorDetails.instruction || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setArchery({
      ...archery,
      [name]: value,
    });
    onChange({ ...archery, [name]: value });
  }

  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formNumberOfRanges">
          <Form.Label className="heading">
            Number of Ranges <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of ranges"
            name="number_of_ranges"
            value={archery.number_of_ranges}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_ranges}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_ranges}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTotalAreaInSqFeet">
          <Form.Label className="heading">
            Total Area in Square Feet <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={archery.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formTargetDistance">
          <Form.Label className="heading">
            Target Distance <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter target distance"
            name="target_distance"
            value={archery.target_distance}
            onChange={handleChange}
            isInvalid={!!errors?.target_distance}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.target_distance}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSurfaceType">
          <Form.Label className="heading">
            Surface Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={archery.surface_type}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSafetyEquipment">
          <Form.Label className="heading">
            Safety Equipment <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter safety equipment"
            name="safety_equipment"
            value={archery.safety_equipment}
            onChange={handleChange}
            isInvalid={!!errors?.safety_equipment}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.safety_equipment}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formInstruction">
          <Form.Label className="heading">
            Instruction <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter instruction details"
            name="instruction"
            value={archery.instruction}
            onChange={handleChange}
            isInvalid={!!errors?.instruction}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.instruction}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Archery;
