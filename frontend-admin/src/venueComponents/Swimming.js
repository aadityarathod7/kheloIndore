import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

function Swimming({ onChange,vendorDetails, errors }) {
  const [swimming, setSwimming] = useState({
    number_of_pools: "",
    total_area_in_sq_feet: "",
    length_in_feet: "",
    width_in_feet: "",
    depth_in_feet: "",
    age_restrictions: "",
    female_timing: "",
    male_timing: "",
    water_quality: "",
  });


  useEffect(() => {
    if (vendorDetails) {
      setSwimming({
        number_of_pools: vendorDetails.number_of_pools || "",
        total_area_in_sq_feet: vendorDetails.total_area_in_sq_feet || "",
        length_in_feet: vendorDetails.length_in_feet || "",
        width_in_feet: vendorDetails.width_in_feet || "",
        depth_in_feet: vendorDetails.depth_in_feet || "",
        age_restrictions: vendorDetails.age_restrictions || "",
        female_timing: vendorDetails.female_timing || "",
        male_timing: vendorDetails.male_timing || "",
        water_quality: vendorDetails.water_quality || "",
      });
    }
  }, [vendorDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSwimming({ ...swimming, [name]: value });
    onChange({ ...swimming, [name]: value }); // Notify parent component of change
  };

  return (
    <>
      <Col md={4}>
        <Form.Group controlId="formNumberOfPools">
          <Form.Label className="heading">
            Number of Pools <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of pools"
            name="number_of_pools"
            value={swimming.number_of_pools}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_pools}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.number_of_pools}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTotalAreaSquareFeet">
          <Form.Label className="heading">
            Total Area (Square Feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter total area in square feet"
            name="total_area_in_sq_feet"
            value={swimming.total_area_in_sq_feet}
            onChange={handleChange}
            isInvalid={!!errors?.total_area_in_sq_feet}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.total_area_in_sq_feet}
            </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formLengthInFeet">
          <Form.Label className="heading">
            Length (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter length in feet"
            name="length_in_feet"
            value={swimming.length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.length_in_feet}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.length_in_feet}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formWidthInFeet">
          <Form.Label className="heading">
            Width (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter width in feet"
            name="width_in_feet"
            value={swimming.width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.width_in_feet }
            />
            <Form.Control.Feedback type="invalid">
              {errors?.width_in_feet}
            </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formDepthInFeet">
          <Form.Label className="heading">
            Depth (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter depth in feet"
            name="depth_in_feet"
            value={swimming.depth_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.depth_in_feet }
            />
            <Form.Control.Feedback type="invalid">
              {errors?.depth_in_feet}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formAgeRestrictions">
          <Form.Label className="heading">
            Age Restrictions <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter age restrictions"
            name="age_restrictions"
            value={swimming.age_restrictions}
            onChange={handleChange}
            isInvalid={!!errors?.age_restrictions }
            />
            <Form.Control.Feedback type="invalid">
              {errors?.age_restrictions}
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
            value={swimming.female_timing}
            onChange={handleChange}
            isInvalid={!!errors?.female_timing }
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
            value={swimming.male_timing}
            onChange={handleChange}
            isInvalid={!!errors?.male_timing }
            />
            <Form.Control.Feedback type="invalid">
              {errors?.male_timing}
            </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="formWaterQuality">
          <Form.Label className="heading">
            Water Quality <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter water quality"
            name="water_quality"
            value={swimming.water_quality}
            onChange={handleChange}
            isInvalid={!!errors?.water_quality}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.water_quality}
            </Form.Control.Feedback>
        </Form.Group>

        {/* <Form.Group controlId="formPricePerMonth">
          <Form.Label className="heading">
            Price Per Month <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price per month"
            name="price_per_month"
            value={swimming.price_per_month}
            onChange={handleChange}
          />
        </Form.Group> */}
      </Col>
    </>
  );
}

export default Swimming;
