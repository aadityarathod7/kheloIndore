import React, { useEffect, useState } from 'react'
import { Col, Form } from "react-bootstrap";
function Hockey({onChange,vendorDetails, errors}) {

  const [hockey, setHockey] = useState({
    number_of_rinks: "",
    total_area_in_sq_feet: "",
    rink_dimensions: "",
    surface_type: "",
    skate_rentals: "",
    equipment_rentals: "",
    lockers: "",
  });

  useEffect(() => {
      if (vendorDetails) {
        setHockey({
          number_of_rinks: vendorDetails.number_of_rinks || "", 
          total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
          rink_dimensions: vendorDetails.rink_dimensions || "",  
          surface_type: vendorDetails.surface_type || "", 
          skate_rentals: vendorDetails.skate_rentals || "", 
          equipment_rentals: vendorDetails.equipment_rentals || "", 
          lockers: vendorDetails.lockers || "",  
        });
      }
    }, [vendorDetails]); 

   function handleChange(event) {
     const { name, value } = event.target;
     setHockey({ ...hockey, [name]: value });
     onChange({ ...hockey, [name]: value });
   }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formNumberOfRinks">
          <Form.Label className="heading">
            Number of Rinks <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of rinks"
            name="number_of_rinks"
            value={hockey.number_of_rinks}
            onChange={handleChange}
           isInvalid={!!errors?.number_of_rinks}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.number_of_rinks}
                    </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTotalArea">
          <Form.Label className="heading">
            Total Area (in square feet) <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={hockey.total_area_in_sq_feet}
            onChange={handleChange}
           isInvalid={!!errors?.total_area_in_sq_feet}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.total_area_in_sq_feet}
                    </Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col md={4}>
        <Form.Group controlId="formRinkDimensions">
          <Form.Label className="heading">
            Rink Dimensions <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter rink dimensions"
            name="rink_dimensions"
            value={hockey.rink_dimensions}
            onChange={handleChange}
           isInvalid={!!errors?.rink_dimensions}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.rink_dimensions}
                    </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSurfaceType">
          <Form.Label className="heading">
            Surface Type <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surface type"
            name="surface_type"
            value={hockey.surface_type}
            onChange={handleChange}
           isInvalid={!!errors?.surface_type}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.surface_type}
                    </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formSkateRentals">
          <Form.Label className="heading">
            Skate Rentals <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter skate rentals information"
            name="skate_rentals"
            value={hockey.skate_rentals}
            onChange={handleChange}
           isInvalid={!!errors?.skate_rentals}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.skate_rentals}
                    </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEquipmentRentals">
          <Form.Label className="heading">
            Equipment Rentals <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter equipment rentals information"
            name="equipment_rentals"
            value={hockey.equipment_rentals}
            onChange={handleChange}
           isInvalid={!!errors?.equipment_rentals}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.equipment_rentals}
                    </Form.Control.Feedback>
        </Form.Group>
        </Col>
        <Col md={4}>
        <Form.Group controlId="formLockers">
          <Form.Label className="heading">
            Lockers <span className="StarSymbol">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter lockers information"
            name="lockers"
            value={hockey.lockers}
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

export default Hockey
