import React, { useEffect, useState } from 'react'
import { Col, Form } from "react-bootstrap";
function Playstation({onChange,vendorDetails, errors}) {
  const [playstation, setPlaystation] = useState({
    game_types: "",
    features: "",
  });

  useEffect(() => {
      if (vendorDetails) {
        setPlaystation({
          game_types: vendorDetails.game_types || "",
          features: vendorDetails.features || "",
        });
      }
    }, [vendorDetails]);

    function handleChange(event) {
      const { name, value } = event.target;
      setPlaystation({ ...playstation, [name]: value });
      onChange({ ...playstation, [name]: value });
    }
  return (
    <>
      <hr></hr>
      <Col md={4}>
        <Form.Group controlId="formGameTypes">
          <Form.Label className="heading">
            Game Types <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter game types"
            name="game_types"
            value={playstation.game_types}
            onChange={handleChange}
           isInvalid={!!errors?.game_types}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.game_types}
                    </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFeatures">
          <Form.Label className="heading">
            Features <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter features"
            name="features"
            value={playstation.features}
            onChange={handleChange}
           isInvalid={!!errors?.features}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.features}
                    </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </>
  );
}

export default Playstation;
