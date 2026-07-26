import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
function Zumba({ onChange, vendorDetails, errors }) {
  const [zumba, setZumba] = useState({
    class_types: "",
    class_focus: "",
    virtual_class: "",
    female_class_time: "",
  });

  useEffect(() => {
    if (vendorDetails) {
      setZumba({
        class_types: vendorDetails.class_types || "",
        class_focus: vendorDetails.class_focus || "",
        virtual_class: vendorDetails.virtual_class || "",
        female_class_time: vendorDetails.female_class_time || "",
      });
    }
  }, [vendorDetails]);

  function handleChange(event) {
    const { name, value } = event.target;
    setZumba({ ...zumba, [name]: value });
    onChange({ ...zumba, [name]: value });
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
            value={zumba.class_types}
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
            value={zumba.class_focus}
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
            value={zumba.virtual_class}
            onChange={handleChange}
            isInvalid={!!errors?.virtual_class}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.virtual_class}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFemaleClassTime">
          <Form.Label className="heading">
            Female Class Time <span style={{ color: "red" }}>*</span>{" "}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter female class time"
            name="female_class_time"
            value={zumba.female_class_time}
            onChange={handleChange}
            isInvalid={!!errors?.female_class_time}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.female_class_time}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Zumba;
