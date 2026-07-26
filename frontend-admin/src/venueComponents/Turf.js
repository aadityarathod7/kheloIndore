import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
function Turf({ onChange, vendorDetails, errors }) {
  const [turf, setTurf] = useState({
    total_area_in_sq_feet: "",
    length_in_feet: "",
    height_in_feet: "",
    width_in_feet: "",
    surface_type: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setTurf({
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        height_in_feet: vendorDetails.height_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        surface_type: vendorDetails.surface_type || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setTurf({
      ...turf,
      [name]: value,
    });
    onChange({ ...turf, [name]: value });
  }

  return (
    <>
      <hr></hr>
      <Col md={4}>
        {/* <Form.Group controlId="formTurfNumberOfTurfs" className="mb-2">
          <Form.Label className="heading">
            Number of Turfs  <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Number Of Turfs"
            name="number_of_turfs"
            value={turf.number_of_turfs}
            onChange={handleChange}
            maxLength={2}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          
          />
        </Form.Group> */}

        <Form.Group controlId="formTotalAreaSquareFeet" className="mb-2">
          <Form.Label className="heading">
            Total Area (Square Feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Total Area In Square Feet"
            name="total_area_in_sq_feet"
            value={turf.total_area_in_sq_feet}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formHeightInFeet">
          <Form.Label className="heading">
            Height (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Height In Feet"
            name="height_in_feet"
            value={turf.height_in_feet}
            onChange={handleChange}
            // maxLength={2}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.height_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.height_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSnookerTableLength" className="mb-2">
          <Form.Label className="heading">
            Length (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Length"
            name="length_in_feet"
            value={turf.length_in_feet}
            onChange={handleChange}
            // maxLength={2}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formSurfaceType">
          <Form.Label className="heading">
            Surface Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            as="select"
            name="surface_type"
            value={turf.surface_type}
            onChange={handleChange}
            isInvalid={!!errors?.surface_type}
          >
            <option value="">Select Surface Type</option>
            <option value="grass">Grass</option>
            <option value="turf">Turf</option>
            <option value="hardwood">Hardwood</option>
            <option value="clay">Clay</option>
            <option value="synthetic">Synthetic</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors?.surface_type}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSnookerTableWidth" className="mb-2">
          <Form.Label className="heading">
            Width (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Width"
            name="width_in_feet"
            value={turf.width_in_feet}
            onChange={handleChange}
            // maxLength={2}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Turf;
