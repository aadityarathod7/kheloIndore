import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Table,
} from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";

const VenueAdminCRM = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Customer details
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_mobile: "",
    customer_email: "",
  });

  // Booking details
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch venues owned by this venue admin (vendor)
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get(`${API_URL}/venue/getVenue`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.venues || res.data?.data || [];
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  // Fetch slots for the selected venue + date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedVenueId || !selectedDate) return;
      setLoadingSlots(true);
      setSlots([]);
      setSelectedSlots([]);
      try {
        const res = await axios.get(
          `${API_URL}/venue/fetch-slot/${selectedVenueId}?date=${selectedDate}`
        );
        const data = res.data?.slots || res.data?.data || [];
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedVenueId, selectedDate]);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find(
        (s) => String(s._id) === String(slot._id)
      );
      if (exists) return prev.filter((s) => String(s._id) !== String(slot._id));
      return [...prev, slot];
    });
  };

  const totalSelectedPrice = selectedSlots.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVenueId) {
      return Swal.fire({ icon: "warning", title: "Select a venue first" });
    }
    if (!selectedDate) {
      return Swal.fire({ icon: "warning", title: "Select a booking date" });
    }
    if (selectedSlots.length === 0) {
      return Swal.fire({ icon: "warning", title: "Select at least one time slot" });
    }
    if (!/^\d{10}$/.test(customer.customer_mobile)) {
      return Swal.fire({
        icon: "warning",
        title: "Enter a valid 10-digit customer mobile number",
      });
    }

    setSubmitting(true);
    try {
      const payload = {
        venue_id: selectedVenueId,
        date: selectedDate,
        slotsBooked: selectedSlots.map((s) => s._id),
        customer_name: customer.customer_name,
        customer_mobile: customer.customer_mobile,
        customer_email: customer.customer_email,
        amount_paid: amountPaid || "",
        payment_mode: paymentMode,
        notes: notes,
      };
      const res = await axios.post(`${API_URL}/booking/manual/add`, payload);
      Swal.fire({
        icon: "success",
        title: "Booking Added!",
        text: res.data?.message || "Manual booking created successfully",
        confirmButtonColor: "#22C55E",
      }).then(() => {
        setSelectedSlots([]);
        setAmountPaid("");
        setNotes("");
        setCustomer({ customer_name: "", customer_mobile: "", customer_email: "" });
      });
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to add the manual booking";
      Swal.fire({ icon: "error", title: "Booking Failed", text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="mb-4 title">Venue Admin CRM — Manual Booking Entry</h3>
      <p className="text-muted mb-4" style={{ fontSize: "13px" }}>
        Add bookings that come directly to your venue (walk-in / phone). Select
        the venue, date and time slots, then enter the customer details.
      </p>
      <Container fluid>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Left column: venue, date, slots */}
            <Col lg={7}>
              <Card className="mb-4" style={{ borderRadius: "14px" }}>
                <Card.Body>
                  <h5 className="mb-3 fw-bold">1. Venue &amp; Date</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Venue</Form.Label>
                      <Form.Select
                        value={selectedVenueId}
                        onChange={(e) => setSelectedVenueId(e.target.value)}
                      >
                        <option value="">Select Venue</option>
                        {venues.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Booking Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <h5 className="mb-3 fw-bold mt-2">2. Select Time Slots</h5>
                  {loadingSlots ? (
                    <p className="text-muted">Loading slots...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-muted">
                      {selectedVenueId && selectedDate
                        ? "No slots found for the selected date."
                        : "Select a venue and date to see available slots."}
                    </p>
                  ) : (
                    <div
                      className="d-flex flex-wrap gap-2"
                      style={{ maxHeight: "360px", overflowY: "auto" }}
                    >
                      {slots.map((slot, idx) => {
                        const isBooked = slot.isBooked;
                        const isSelected = selectedSlots.some(
                          (s) => String(s._id) === String(slot._id)
                        );
                        return (
                          <button
                            type="button"
                            key={slot._id || idx}
                            disabled={isBooked}
                            onClick={() => toggleSlot(slot)}
                            className="btn btn-sm"
                            style={{
                              borderRadius: "10px",
                              border: isBooked
                                ? "1px dashed #E2E8F0"
                                : isSelected
                                ? "2px solid #22C55E"
                                : "1px solid #E2E8F0",
                              background: isBooked
                                ? "#F1F5F9"
                                : isSelected
                                ? "#F0FDF4"
                                : "#FFFFFF",
                              color: isBooked ? "#94A3B8" : isSelected ? "#16A34A" : "#334155",
                              fontWeight: "600",
                              cursor: isBooked ? "not-allowed" : "pointer",
                              opacity: isBooked ? 0.6 : 1,
                              padding: "10px 16px",
                            }}
                          >
                            <i
                              className={`me-1 ${
                                isBooked
                                  ? "feather-lock"
                                  : isSelected
                                  ? "feather-check-circle"
                                  : "feather-clock"
                              }`}
                            />
                            {slot.startTime} - {slot.endTime}
                            <span className="ms-2" style={{ fontSize: "12px" }}>
                              ₹{slot.price || 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedSlots.length > 0 && (
                    <Table size="sm" bordered className="mt-3 mb-0">
                      <thead>
                        <tr>
                          <th>Time Slot</th>
                          <th className="text-end">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSlots.map((s) => (
                          <tr key={s._id}>
                            <td>
                              {s.startTime} - {s.endTime}
                            </td>
                            <td className="text-end">₹{s.price || 0}</td>
                          </tr>
                        ))}
                        <tr className="fw-bold">
                          <td>Total</td>
                          <td className="text-end">₹{totalSelectedPrice}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Right column: customer + payment */}
            <Col lg={5}>
              <Card className="mb-4" style={{ borderRadius: "14px" }}>
                <Card.Body>
                  <h5 className="mb-3 fw-bold">3. Customer Details</h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customer.customer_name}
                      onChange={(e) =>
                        setCustomer({ ...customer, customer_name: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Mobile Number <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={customer.customer_mobile}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer_mobile: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                    />
                    <Form.Text className="text-muted">
                      If the customer is not registered, an account is created
                      automatically.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email (optional)</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="customer@email.com"
                      value={customer.customer_email}
                      onChange={(e) =>
                        setCustomer({ ...customer, customer_email: e.target.value })
                      }
                    />
                  </Form.Group>

                  <h5 className="mb-3 fw-bold mt-4">4. Payment (optional)</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Amount Paid</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder={`₹${totalSelectedPrice || 0}`}
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Leave empty to mark as pending.
                      </Form.Text>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Payment Mode</Form.Label>
                      <Form.Select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Any notes about this booking"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-100 py-2 fw-bold"
                    style={{ background: "#22C55E", border: "none", borderRadius: "10px" }}
                  >
                    {submitting ? "Adding Booking..." : "Add Manual Booking"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default VenueAdminCRM;
