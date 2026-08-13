import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Turf({ onChange, vendorDetails, errors }) {
  const [turf, setTurf] = useState({
    total_area_in_sq_feet: "",
    length_in_feet: "",
    height_in_feet: "",
    width_in_feet: "",
    surface_type: "",
    size: "",
    grass_type: "",
    dimension: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setTurf({
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        height_in_feet: vendorDetails.height_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        surface_type: vendorDetails.surface_type || "",
        size: vendorDetails.size || "",
        grass_type: vendorDetails.grass_type || "",
        dimension: vendorDetails.dimension || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    const updated = {
      ...turf,
      [name]: value,
    };
    setTurf(updated);
    onChange(updated);
  }

  return (
    <>
      <hr></hr>
      <Col md={4}>
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
        
        <Form.Group controlId="formHeightInFeet" className="mb-2">
          <Form.Label className="heading">
            Height (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter Height In Feet"
            name="height_in_feet"
            value={turf.height_in_feet}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.height_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.height_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTurfSize" className="mb-2">
          <Form.Label className="heading">
            Turf Size <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            as="select"
            name="size"
            value={turf.size}
            onChange={handleChange}
            isInvalid={!!errors?.size}
          >
            <option value="">Select Turf Size</option>
            <option value="5v5">5v5</option>
            <option value="7v7">7v7</option>
            <option value="9v9">9v9</option>
            <option value="11v11">11v11</option>
            <option value="Other">Other</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors?.size}
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
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="formSurfaceType" className="mb-2">
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

        <Form.Group controlId="formGrassType" className="mb-2">
          <Form.Label className="heading">
            Grass Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            as="select"
            name="grass_type"
            value={turf.grass_type}
            onChange={handleChange}
            isInvalid={!!errors?.grass_type}
          >
            <option value="">Select Grass Type</option>
            <option value="Artificial Grass">Artificial Grass</option>
            <option value="Natural Grass">Natural Grass</option>
            <option value="Hybrid Grass">Hybrid Grass</option>
            <option value="Other">Other</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors?.grass_type}
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
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            isInvalid={!!errors?.width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDimension" className="mb-2">
          <Form.Label className="heading">
            Dimension (e.g. 100x70 ft) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Dimension (e.g. 100x70 ft)"
            name="dimension"
            value={turf.dimension}
            onChange={handleChange}
            isInvalid={!!errors?.dimension}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.dimension}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Turf;
