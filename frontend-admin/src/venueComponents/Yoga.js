import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Yoga({ onChange, vendorDetails, errors }) {
  const [yoga, setYoga] = useState({
    class_types: "",
    class_focus: "",
    virtual_class: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setYoga({
        class_types: vendorDetails.class_types || "",
        class_focus: vendorDetails.class_focus || "",
        virtual_class: vendorDetails.virtual_class || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setYoga({ ...yoga, [name]: value });
    onChange({ ...yoga, [name]: value });
  }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formClassTypes">
          <Form.Label className="heading">
            Class Types <span style={{ color: "red" }}>*</span>{" "}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter class types"
            name="class_types"
            value={yoga.class_types}
            onChange={handleChange}
            isInvalid={!!errors?.class_types}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.class_types}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formClassFocus">
          <Form.Label className="heading">
            Class Focus <span style={{ color: "red" }}>*</span>{" "}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter class focus"
            name="class_focus"
            value={yoga.class_focus}
            onChange={handleChange}
            isInvalid={!!errors?.class_focus}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.class_focus}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group controlId="formVirtualClass">
          <Form.Label className="heading">
            Virtual Class <span style={{ color: "red" }}>*</span>{" "}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter virtual class details"
            name="virtual_class"
            value={yoga.virtual_class}
            onChange={handleChange}
            isInvalid={!!errors?.virtual_class}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.virtual_class}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Yoga;
