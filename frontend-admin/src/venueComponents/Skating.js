import React, { useEffect, useState } from 'react'
import { Col, Form } from "react-bootstrap";
function Skating({onChange,vendorDetails, errors}) {
  const [skating, setSkating] = useState({
    number_of_rinks: "",
    total_area_in_sq_feet: "",
    surface_type: "",
    skate_rentals: "",
    lockers: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setSkating({
        number_of_rinks: vendorDetails.number_of_rinks || "",
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        surface_type: vendorDetails.surface_type || "",
        skate_rentals: vendorDetails.skate_rentals || "",
        lockers: vendorDetails.lockers || "",
      });
    }
  }, [vendorDetails]);

   function handleChange(event) {
     const { name, value } = event.target;
     setSkating({ ...skating, [name]: value });
     onChange({ ...skating, [name]: value });
   }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formSkatingNumberOfRinks">
          <Form.Label className="heading">
            Skating Number of Rinks <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of rinks"
            name="number_of_rinks"
            value={skating.number_of_rinks}
            onChange={handleChange}
           isInvalid={!!errors?.number_of_rinks}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors?.number_of_rinks}
                              </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSkatingTotalArea">
          <Form.Label className="heading">
            Skating Total Area (in square feet){" "}
            <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={skating.total_area_in_sq_feet}
            onChange={handleChange}
           isInvalid={!!errors?.total_area_in_sq_feet}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors?.total_area_in_sq_feet}
                              </Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col md={4}>
        <Form.Group controlId="formSkatingSurfaceType">
          <Form.Label className="heading">
            Skating Surface Type <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={skating.surface_type}
            onChange={handleChange}
           isInvalid={!!errors?.surface_type}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors?.surface_type}
                              </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSkatingRentals">
          <Form.Label className="heading">
            Skate Rentals <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter skate rentals information"
            name="skate_rentals"
            value={skating.skate_rentals}
            onChange={handleChange}
           isInvalid={!!errors?.skate_rentals}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors?.skate_rentals}
                              </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSkatingLockers">
          <Form.Label className="heading">
            Lockers <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter lockers information"
            name="lockers"
            value={skating.lockers}
            onChange={handleChange}
           isInvalid={!!errors?.lockers}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors?.lockers}
                              </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Skating
