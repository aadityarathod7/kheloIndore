import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

function Gym({ onChange, vendorDetails, errors }) {
  const [gym, setGym] = useState({
    number_of_trainers: "",
    total_area_in_sq_feet: "",
    female_timing: "",
    male_timing: "",
    price_per_month: "",
    price_per_quarter: "",
    price_per_year: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setGym({
        number_of_trainers: vendorDetails.number_of_trainers || "", // Number of trainers
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "", // Total area of the gym
        female_timing: vendorDetails.female_timing || "", // Female gym timings
        male_timing: vendorDetails.male_timing || "", // Male gym timings
        price_per_month: vendorDetails.price_per_month || "", // Monthly price
        price_per_quarter: vendorDetails.price_per_quarter || "", // Quarterly price
        price_per_year: vendorDetails.price_per_year || "", // Yearly price
      });
    }
  }, [vendorDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGym({ ...gym, [name]: value });
    onChange({ ...gym, [name]: value });
  };

  return (
    <>
      <Col md={4}>
        <Form.Group controlId="formNumberOfTrainers">
          <Form.Label className="heading">
            Number of Trainers <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of trainers"
            name="number_of_trainers"
            value={gym.number_of_trainers}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_trainers}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_trainers}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTotalAreaSquareFeet">
          <Form.Label className="heading">
            Total Area (Square Feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={gym.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.total_area_in_sq_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formFemaleTiming">
          <Form.Label className="heading">
            Female Timing <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter female timing"
            name="female_timing"
            value={gym.female_timing}
            onChange={handleChange}
            isInvalid={!!errors?.female_timing}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.female_timing}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formMaleTiming">
          <Form.Label className="heading">
            Male Timing <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter male timing"
            name="male_timing"
            value={gym.male_timing}
            onChange={handleChange}
            isInvalid={!!errors?.male_timing}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.male_timing}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      {/* <Col md={4}>
        <Form.Group controlId="formPricePerMonth">
          <Form.Label className="heading">
            Price per Month <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price per month"
            name="price_per_month"
            value={gym.price_per_month}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPricePerQuarter">
          <Form.Label className="heading">
            Price per Quarter <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price per quarter"
            name="price_per_quarter"
            value={gym.price_per_quarter}
            onChange={handleChange}
          />
        </Form.Group>
      </Col> */}

      <Col md={4}>
        <Form.Group controlId="formPricePerYear">
          <Form.Label className="heading">
            Price per Year <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price per year"
            name="price_per_year"
            value={gym.price_per_year}
            onChange={handleChange}
            isInvalid={!!errors?.price_per_year}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.price_per_year}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}
export default Gym;
