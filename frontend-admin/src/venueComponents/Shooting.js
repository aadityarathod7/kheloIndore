import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Shooting({ onChange, vendorDetails, errors }) {
  const [shooting, setShooting] = useState({
    number_of_ranges: "",
    target_distance: "",
    caliber_restrictions: "",
    safety_equipment: "",
    instruction: "",
    ammunition: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setShooting({
        number_of_ranges: vendorDetails.number_of_ranges || "",
        target_distance: vendorDetails.target_distance || "",
        caliber_restrictions: vendorDetails.caliber_restrictions || "",
        safety_equipment: vendorDetails.safety_equipment || "",
        instruction: vendorDetails.instruction || "",
        ammunition: vendorDetails.ammunition || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setShooting({ ...shooting, [name]: value });
    onChange({ ...shooting, [name]: value });
  }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formNumberOfRanges">
          <Form.Label className="heading">
            Number of Ranges <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of ranges"
            name="number_of_ranges"
            value={shooting.number_of_ranges}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_ranges}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_ranges}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTargetDistance">
          <Form.Label className="heading">
            Target Distance <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter target distance"
            name="target_distance"
            value={shooting.target_distance}
            onChange={handleChange}
            isInvalid={!!errors?.target_distance}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.target_distance}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formCaliberRestrictions">
          <Form.Label className="heading">
            Caliber Restrictions <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter caliber restrictions"
            name="caliber_restrictions"
            value={shooting.caliber_restrictions}
            onChange={handleChange}
            isInvalid={!!errors?.caliber_restrictions}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.caliber_restrictions}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSafetyEquipment">
          <Form.Label className="heading">
            Safety Equipment <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter safety equipment"
            name="safety_equipment"
            value={shooting.safety_equipment}
            onChange={handleChange}
            isInvalid={!!errors?.safety_equipment}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.safety_equipment}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formInstruction">
          <Form.Label className="heading">
            Instruction <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter instruction details"
            name="instruction"
            value={shooting.instruction}
            onChange={handleChange}
            isInvalid={!!errors?.instruction}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.instruction}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formAmmunition">
          <Form.Label className="heading">
            Ammunition <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter ammunition details"
            name="ammunition"
            value={shooting.ammunition}
            onChange={handleChange}
            isInvalid={!!errors?.ammunition}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.ammunition}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Shooting;
