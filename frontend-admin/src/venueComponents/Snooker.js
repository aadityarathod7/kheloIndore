import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";

function Snooker({ onChange, vendorDetails, errors }) {
  const [snooker, setSnooker] = useState({
    number_of_tables: "",
    table_type: "",
    table_length_in_feet: "",
    table_width_in_feet: "",
    price_per_month: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setSnooker({
        number_of_tables: vendorDetails.number_of_tables || "",
        table_type: vendorDetails.table_type || "",
        table_length_in_feet: vendorDetails.table_length_in_feet || "",
        table_width_in_feet: vendorDetails.table_width_in_feet || "",
        price_per_month: vendorDetails.price_per_month || "",
      });
    }
  }, [vendorDetails]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSnooker({ ...snooker, [name]: value });
    onChange({ ...snooker, [name]: value }); // Notify parent component of change
  };

  return (
    <>
      <Col md={4}>
        <Form.Group controlId="formNumberOfTables">
          <Form.Label className="heading">
            Number of Tables <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter number of tables"
            name="number_of_tables"
            value={snooker.number_of_tables}
            onChange={handleChange}
            isInvalid={!!errors?.number_of_tables}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.number_of_tables}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTableType">
          <Form.Label className="heading">
            Table Type <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter table type"
            name="table_type"
            value={snooker.table_type}
            onChange={handleChange}
            isInvalid={!!errors?.table_type}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.table_type}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formTableLength">
          <Form.Label className="heading">
            Table Length (in feet)<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter table length in feet"
            name="table_length_in_feet"
            value={snooker.table_length_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.table_length_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.table_length_in_feet}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTableWidth">
          <Form.Label className="heading">
            Table Width (in feet) <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter table width in feet"
            name="table_width_in_feet"
            value={snooker.table_width_in_feet}
            onChange={handleChange}
            isInvalid={!!errors?.table_width_in_feet}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.table_width_in_feet}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formPricePerMonth">
          <Form.Label className="heading">
            Price Per Month <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price per month"
            name="price_per_month"
            value={snooker.price_per_month}
            onChange={handleChange}
            isInvalid={!!errors?.price_per_month}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.price_per_month}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Snooker;
