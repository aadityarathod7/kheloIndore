import React, { useCallback, useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";
import "./addVenueSlots.css";

const currentDate = () => new Date().toLocaleDateString("en-CA");
const slotTimes = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const formatTimeLabel = (time) => {
  const [hourText, minutes] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minutes} ${suffix}`;
};
const dateKey = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function ProviderSlotsManager({ providerType }) {
  const { _id: providerId } = useParams();
  const isCoach = providerType === "coach";
  const label = isCoach ? "Coach" : "Trainer";
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCarryForward, setShowCarryForward] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ dateFrom: currentDate(), dateTo: currentDate(), startTime: "", endTime: "", price: "" });
  const [carryForward, setCarryForward] = useState({ sourceDate: currentDate(), targetDateFrom: currentDate(), targetDateTo: currentDate() });
  const endpoints = useMemo(() => ({
    list: isCoach ? `/get-all-coach-slot/${providerId}` : `/get-all-pt-slot/${providerId}`,
    add: isCoach ? `/coach-slot/add/${providerId}` : `/pt/slots/add/${providerId}`,
    carry: isCoach ? `/coach-slot/carry-forward/${providerId}` : `/pt/slots/carry-forward/${providerId}`,
  }), [isCoach, providerId]);

  const loadSlots = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}${endpoints.list}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setDocuments(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      setDocuments([]);
      Swal.fire({ icon: "error", title: "Could not load slots", text: error.response?.data?.message || "Please refresh and try again." });
    }
  }, [endpoints.list]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const events = useMemo(() => documents.flatMap((doc) => {
    const date = dateKey(doc.start_date);
    if (!date || !Array.isArray(doc.slots)) return [];
    return doc.slots.map((slot) => {
      const start = new Date(`${date}T${slot.start_time}:00`);
      let end = new Date(`${date}T${slot.end_time}:00`);
      if (end <= start) end = new Date(end.getTime() + 86400000);
      return { id: slot._id, title: slot.isOfflineBlocked ? "Offline block" : slot.isBooked ? "Booked" : `Available · ₹${slot.price ?? 0}`, start, end, backgroundColor: slot.isOfflineBlocked ? "#dc2626" : slot.isBooked ? "#475569" : "#097e52", borderColor: "transparent" };
    });
  }), [documents]);

  const set = (field, value) => setForm((state) => ({ ...state, [field]: value }));
  const openForDate = (info) => {
    const date = dateKey(info.dateStr);
    setForm({ dateFrom: date, dateTo: date, startTime: info.dateStr.includes("T") ? info.dateStr.slice(11, 16) : "", endTime: "", price: "" });
    setShowModal(true);
  };
  const save = async (event, offlineBlocked = false, fullDay = false) => {
    event?.preventDefault();
    const { dateFrom, dateTo, startTime, endTime, price } = form;
    const slotStartTime = fullDay ? "00:00" : startTime;
    const slotEndTime = fullDay ? "00:00" : endTime;
    if (!dateFrom || !dateTo || !slotStartTime || !slotEndTime || dateFrom > dateTo || (slotStartTime === slotEndTime && !fullDay)) {
      Swal.fire({ icon: "error", title: "Invalid slot", text: "Choose a valid date range and different start and end times." });
      return;
    }
    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}${endpoints.add}`, { start_date: dateFrom, end_date: dateTo, start_time: slotStartTime, end_time: slotEndTime, price: price === "" ? undefined : Number(price), offlineBlocked, fullDay }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!response.data?.success) throw new Error(response.data?.message || "Could not create slots.");
      setShowModal(false);
      await loadSlots();
      Swal.fire({ icon: "success", title: offlineBlocked ? "Offline time blocked" : "Slots added", text: `${label} slots were generated in 30-minute intervals.`, timer: 1600, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Could not add slots", text: error.response?.data?.message || error.message || "Please try again." });
    } finally { setSaving(false); }
  };

  const carrySlots = async () => {
    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}${endpoints.carry}`, carryForward, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (!response.data?.success) throw new Error(response.data?.message || "Could not carry forward slots.");
      setShowCarryForward(false); await loadSlots();
      Swal.fire({ icon: "success", title: "Slots carried forward", timer: 1500, showConfirmButton: false });
    } catch (error) { Swal.fire({ icon: "error", title: "Could not carry forward slots", text: error.response?.data?.message || error.message }); }
    finally { setSaving(false); }
  };

  const fields = <>
    <Form.Control type="date" value={form.dateFrom} min={currentDate()} onChange={(e) => set("dateFrom", e.target.value)} required />
    <Form.Control type="date" value={form.dateTo} min={form.dateFrom || currentDate()} onChange={(e) => set("dateTo", e.target.value)} required />
    <Form.Select value={form.startTime} onChange={(e) => set("startTime", e.target.value)} required><option value="">Start time</option>{slotTimes.map((time) => <option key={time} value={time}>{formatTimeLabel(time)}</option>)}</Form.Select>
    <Form.Select value={form.endTime} onChange={(e) => set("endTime", e.target.value)} required><option value="">End time</option>{slotTimes.map((time) => <option key={time} value={time}>{formatTimeLabel(time)}</option>)}</Form.Select>
    <Form.Control type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={(e) => set("price", e.target.value)} />
  </>;

  return <div className="venue-slots-page">
    <div className="venue-slots-header"><div><h3 className="mb-1 title">Manage {label} Slots</h3><p className="venue-slots-help">Add availability by date or date range. The configured {label.toLowerCase()} price is used when price is blank.</p></div><div className="slot-legend"><span><i className="legend-available" />Available</span><span><i className="legend-booked" />Booked</span><span><i className="legend-blocked" />Offline block</span></div></div>
    <p className="slot-action-hint">Click an empty 30-minute time to add a slot. Select 00:00 as the end time for a slot that ends at midnight.</p>
    <Form className="quick-slot-form" onSubmit={save}><strong>Quick add</strong>{fields}<Button variant="success" type="submit" disabled={saving}>{saving ? "Adding…" : "Add Available"}</Button><Button variant="success" type="button" disabled={saving} onClick={() => save(null, false, true)}>{saving ? "Adding…" : "Add Whole Day"}</Button><Button variant="outline-danger" type="button" disabled={saving} onClick={() => save(null, true)}>Block Offline</Button><Button variant="outline-primary" type="button" onClick={() => setShowCarryForward(true)}>Carry Forward Slots</Button></Form>
    <div className="venue-calendar-card"><FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="timeGridWeek" slotDuration="00:30:00" allDaySlot={false} height="auto" events={events} dateClick={openForDate} headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }} eventContent={(info) => <div className="venue-slot-event-content">{info.event.title}</div>} /></div>
    <Modal show={showModal} onHide={() => setShowModal(false)} centered><Modal.Header closeButton><Modal.Title>Add {label} slots</Modal.Title></Modal.Header><Form onSubmit={save}><Modal.Body><div className="d-grid gap-3">{fields}</div></Modal.Body><Modal.Footer><Button variant="outline-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="success" type="submit" disabled={saving}>{saving ? "Adding…" : "Add Slots"}</Button></Modal.Footer></Form></Modal>
    <Modal show={showCarryForward} onHide={() => setShowCarryForward(false)} centered><Modal.Header closeButton><Modal.Title>Carry Forward Slots</Modal.Title></Modal.Header><Modal.Body><div className="d-grid gap-3"><Form.Group><Form.Label>Source date</Form.Label><Form.Control type="date" value={carryForward.sourceDate} onChange={(e) => setCarryForward((value) => ({ ...value, sourceDate: e.target.value }))} /></Form.Group><Form.Group><Form.Label>Target start date</Form.Label><Form.Control type="date" value={carryForward.targetDateFrom} onChange={(e) => setCarryForward((value) => ({ ...value, targetDateFrom: e.target.value }))} /></Form.Group><Form.Group><Form.Label>Target end date</Form.Label><Form.Control type="date" value={carryForward.targetDateTo} onChange={(e) => setCarryForward((value) => ({ ...value, targetDateTo: e.target.value }))} /></Form.Group></div></Modal.Body><Modal.Footer><Button variant="outline-secondary" onClick={() => setShowCarryForward(false)}>Cancel</Button><Button variant="primary" onClick={carrySlots} disabled={saving}>{saving ? "Copying…" : "Carry Forward"}</Button></Modal.Footer></Modal>
  </div>;
}
