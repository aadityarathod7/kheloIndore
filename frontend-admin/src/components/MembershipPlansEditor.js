import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const newPlan = () => ({
  name: "Monthly",
  months: 1,
  price: "",
  priority: "Standard Booking",
  discount: "Flexible plan",
  support: "Basic support",
  includes_coaching: false,
});

const MembershipPlansEditor = ({ plans = [], onChange }) => {
  const updatePlan = (index, field, value) => {
    const nextPlans = [...plans];
    nextPlans[index] = { ...nextPlans[index], [field]: value };
    onChange(nextPlans);
  };

  return (
    <section className="mb-4 border rounded p-3 bg-light">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <Form.Label className="heading mb-0">Recurring Membership Plans</Form.Label>
          <div className="text-muted" style={{ fontSize: "12px" }}>Set monthly or longer plans for this provider.</div>
        </div>
        <Button type="button" variant="outline-success" onClick={() => onChange([...plans, newPlan()])}>+ Add plan</Button>
      </div>
      {!plans.length && <p className="text-muted mb-0">No membership plans yet.</p>}
      {plans.map((plan, index) => (
        <div key={index} className="mb-2">
          <Row className="g-2 align-items-end">
            <Col md={3}><Form.Control value={plan.name || ""} placeholder="Plan name" onChange={(event) => updatePlan(index, "name", event.target.value)} /></Col>
            <Col md={2}><Form.Control type="number" min="1" value={plan.months ?? ""} placeholder="Months" onChange={(event) => updatePlan(index, "months", Number(event.target.value))} /></Col>
            <Col md={2}><Form.Control type="number" min="0" value={plan.price ?? ""} placeholder="Price (₹)" onChange={(event) => updatePlan(index, "price", Number(event.target.value))} /></Col>
            <Col md={3}><Form.Control value={plan.priority || ""} placeholder="Priority booking benefit" onChange={(event) => updatePlan(index, "priority", event.target.value)} /></Col>
            <Col md={2}><Button type="button" variant="outline-danger" className="w-100" onClick={() => onChange(plans.filter((_, planIndex) => planIndex !== index))}>Remove</Button></Col>
          </Row>
        </div>
      ))}
    </section>
  );
};

export default MembershipPlansEditor;
