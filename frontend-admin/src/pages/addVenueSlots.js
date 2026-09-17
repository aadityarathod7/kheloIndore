import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/ApiUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import './addVenueSlots.css';

const parseSlotDate = (value) => {
    if (!value) return null;
    const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) {
        const [, year, month, day] = dateOnly;
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const applyTime = (date, time) => {
    const match = String(time || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
};

const halfHourTimes = Array.from({ length: 48 }, (_, index) => {
    const hours = String(Math.floor(index / 2)).padStart(2, '0');
    const minutes = index % 2 === 0 ? '00' : '30';
    return `${hours}:${minutes}`;
});

export default function AddVenueSlots() {
    const today = new Date().toLocaleDateString('en-CA');
    const [venueName, setVenueName] = useState("");
    const [slots, setSlots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [formData, setFormData] = useState({
        dateFrom: today,
        dateTo: today,
        startTime: "",
        endTime: "",
        price: "",
        available: true,
    });
    const { _id } = useParams();
    const navigate = useNavigate();
    const [slotId, setSlotId] = useState("");
    const [dateId, setDateId] = useState("");
    const [updateFormData, setUpdateFormData] = useState({
        startTime: "",
        endTime: "",
        isBooked: false,
        isOfflineBlocked: false,
        price: "",
        _id: slotId,
    });

    const [currentView, setCurrentView] = useState('timeGridWeek');
    const [showCarryForwardModal, setShowCarryForwardModal] = useState(false);
    const [carryForwardData, setCarryForwardData] = useState({
        sourceDate: today,
        targetDateFrom: today,
        targetDateTo: today,
    });

    const handleCarryForward = async () => {
        try {
            Swal.fire({
                title: 'Processing...',
                text: 'Carrying forward slots...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await axios.post(`${API_URL}/slot/carry-forward/${_id}`, carryForwardData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data && response.data.success) {
                Swal.fire({ icon: "success", title: "Slots carried forward", timer: 1500, showConfirmButton: false });
                fetchVenueSlots();
                setShowCarryForwardModal(false);
            } else {
                Swal.fire({ icon: "error", title: "Failed", text: response.data.message || "Could not carry forward slots." });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong while carrying forward slots.",
            });
        }
    };

    const fetchVenueDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/venue/individual/${_id}`);
            if (response.data && response.data.venue) {
                setVenueName(response.data.venue.name);
            }
        } catch (error) {
            
        }
    };



    useEffect(() => {
        fetchVenueDetails(); // Fetch venue details when the component mounts
    }, [_id]);

    const fetchVenueSlots = async () => {
        try {
            const response = await fetch(`${API_URL}/venue/fetch-all-slot/${_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSlots(Array.isArray(data.data) ? data.data : []);
            } else {
                
            }
        } catch (error) {
            
        }
    };
    useEffect(() => {
        fetchVenueSlots();
    }, [_id]);


    const mapSlotsToEvents = () => {
        return slots.flatMap((slot) => {
            const slotDate = parseSlotDate(slot?.date);
            if (!slotDate || !Array.isArray(slot?.slots)) return [];

            return slot.slots.flatMap((innerSlot) => {
                const eventStartTime = applyTime(slotDate, innerSlot?.startTime);
                const eventEndTime = applyTime(slotDate, innerSlot?.endTime);
                if (!eventStartTime || !eventEndTime || eventEndTime <= eventStartTime) {
                    
                    return [];
                }

                return [{
                    title: innerSlot.isBooked ? `Booked - ₹ ${innerSlot.price}` : `₹ ${innerSlot.price}`,
                    start: eventStartTime.toISOString(),
                    end: eventEndTime.toISOString(),
                    description: `Price: ₹${innerSlot.price} | ${innerSlot.isBooked ? 'Booked' : 'Available'}`,
                    backgroundColor: innerSlot.isOfflineBlocked ? '#dc2626' : (innerSlot.isBooked ? '#475569' : '#097e52'),
                    textColor: 'white',
                    extendedProps: {
                        price: innerSlot.price,
                        isBooked: innerSlot.isBooked,
                        isOfflineBlocked: innerSlot.isOfflineBlocked,
                        id: innerSlot._id,
                        date_id: slot._id
                    }
                }];
            });
        });
    };


    const handleDateClick = (info) => {
        const clickedDate = new Date(info.dateStr);
        
        const formattedDate = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
        

        setFormData({
            ...formData,
            dateFrom: formattedDate,
            dateTo: formattedDate,
            startTime: info.dateStr.split('T')[1]?.slice(0, 5),
            endTime: info.dateStr.split('T')[1] ? calculateEndTime(info.dateStr.split('T')[1].slice(0, 5)) : "",
            price: '',
        });
        setShowModal(true);
        setSlotId("")
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleQuickDateChange = (e) => {
        setFormData((prev) => ({ ...prev, dateFrom: e.target.value, dateTo: e.target.value }));
    };
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const calculateEndTime = (startTime) => {
        const startDate = new Date(`2023-01-01T${startTime}:00`);
        startDate.setMinutes(startDate.getMinutes() + 30);
        const hours = startDate.getHours().toString().padStart(2, '0');
        const minutes = startDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    const handleAddSlot = async (offlineBlocked = false) => {
        const { dateFrom, dateTo, startTime, endTime, price } = formData;

        const startDate = parseSlotDate(dateFrom);
        const endDate = parseSlotDate(dateTo);

        const startDateTime = applyTime(startDate, startTime);
        const endDateTime = applyTime(startDate, endTime);
        if (!startDate || !endDate || !startDateTime || !endDateTime || endDateTime <= startDateTime || startDate > endDate || price === "" || Number(price) < 0) {
            Swal.fire({ icon: "error", title: "Invalid slot details", text: "Choose a date, start time, later end time, and valid price." });
            return;
        }

        const slotsArray = [];
        let current = new Date(`2023-01-01T${startTime}:00`);
        const end = new Date(`2023-01-01T${endTime}:00`);
        while (current < end) {
            const next = new Date(current.getTime() + 30 * 60 * 1000);
            const startHours = current.getHours().toString().padStart(2, '0');
            const startMins = current.getMinutes().toString().padStart(2, '0');
            const endHours = next.getHours().toString().padStart(2, '0');
            const endMins = next.getMinutes().toString().padStart(2, '0');
            
            slotsArray.push({
                startTime: `${startHours}:${startMins}`,
                endTime: `${endHours}:${endMins}`,
                price: price / 2,
                isBooked: offlineBlocked,
                isOfflineBlocked: offlineBlocked
            });
            current = next;
        }

        const payload = {
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            slots: slotsArray,
        };

        try {
            const response = await axios.post(`${API_URL}/slot/add/${_id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data) {
                Swal.fire({ icon: "success", title: offlineBlocked ? "Offline slot blocked" : "Slot added", timer: 1400, showConfirmButton: false })
                fetchVenueSlots();
            }
        } catch (error) {
            
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while adding the slot.",
            });
        }

        setShowModal(false);

        setFormData((prev) => ({ ...prev, price: "" }));
    };


    const handleEventClick = (info) => {
        setSlotId(info.event._def.extendedProps.id)
        setUpdateFormData((prevData) => ({
            ...prevData,
            _id: info.event._def.extendedProps.id,
        }));
        setDateId(info.event._def.extendedProps.date_id)
        const event = info.event;
        setSelectedEvent(event);
        setNewPrice(event.extendedProps.price);
        setShowModal(true);
    };

    useEffect(() => {

        const fetchSlotById = async () => {
            try {
                const response = await axios.get(`${API_URL}/slot/get/${slotId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const slotData = response?.data?.data?.slot
                setUpdateFormData((prevData) => ({
                    ...prevData,
                    startTime: slotData.startTime,
                    endTime: slotData.endTime,
                    isBooked: slotData.isBooked,
                    isOfflineBlocked: Boolean(slotData.isOfflineBlocked),
                    price: slotData.price,
                }));
            } catch (error) {
                
            }
        };

        if (slotId) {
            fetchSlotById()
        }

    }, [slotId])


    const handleCloseModal = () => {
        setShowModal(false);
    };


    const handleSave = async () => {
        const payload = { slotsToUpdate: [updateFormData] };

        try {
            // Make the PUT request using axios
            const response = await axios.put(
                `${API_URL}/slot/update-add/${dateId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            
            setShowModal(false);
            fetchVenueSlots();
        } catch (error) {
            
        }
    };

    const handleOfflineBlockToggle = async () => {
        const isOfflineBlocked = !updateFormData.isOfflineBlocked;
        try {
            // Keep isBooked in sync for legacy availability queries which only
            // understand this flag. isOfflineBlocked preserves the reason.
            await axios.put(`${API_URL}/slot/update-add/${dateId}`, { slotsToUpdate: [{ ...updateFormData, isOfflineBlocked, isBooked: isOfflineBlocked }] }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
            });
            setShowModal(false);
            fetchVenueSlots();
            Swal.fire({ icon: 'success', title: isOfflineBlocked ? 'Slot blocked' : 'Slot available', text: isOfflineBlocked ? 'Reserved for an offline booking.' : 'Customers can book this slot online.', timer: 1600, showConfirmButton: false });
        } catch (error) {
            
            Swal.fire({ icon: 'error', title: 'Could not update slot', text: 'Please try again.' });
        }
    };

    const handleDelete = async () => {
        try {
            // Show confirmation popup
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                // Show loading popup
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the slot.',
                    icon: 'info',
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    },
                });

                // Perform the API request and store the response
                const response = await axios.put(`${API_URL}/slot/delete-by-slotid/${slotId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                if (response?.data.success) {
                    Swal.close();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your slot has been deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    handleCloseModal();
                    fetchVenueSlots();
                }
                // Close modal and fetch updated slot list

            }
        } catch (error) {
            // Show error popup
            Swal.close();
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue deleting the slot. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });

            // Close modal and fetch slot list in case of error
            handleCloseModal();
            fetchVenueSlots();
        }
    };



    const handleAddWholeDaySlots = async (offlineBlocked = false) => {
        const { dateFrom, dateTo, startTime, endTime, price } = formData;

        const startDate = parseSlotDate(dateFrom);
        const endDate = parseSlotDate(dateTo);

        if (!startDate || !endDate || !startTime || !endTime || startTime >= endTime || startDate > endDate || price === "" || Number(price) < 0) {
            Swal.fire({ icon: "error", title: "Invalid slot details", text: "Choose a date range, start time, later end time, and valid price." });
            return;
        }

        Swal.fire({
            title: 'Generating Slots...',
            text: 'Creating slots for the whole day.',
            icon: 'info',
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
        });

        const slotsArray = [];
        let current = new Date(`2023-01-01T${startTime}:00`);
        const end = new Date(`2023-01-01T${endTime}:00`);
        
        while (current < end) {
            const next = new Date(current.getTime() + 30 * 60 * 1000);
            const startHours = current.getHours().toString().padStart(2, '0');
            const startMins = current.getMinutes().toString().padStart(2, '0');
            const endHours = next.getHours().toString().padStart(2, '0');
            const endMins = next.getMinutes().toString().padStart(2, '0');
            
            slotsArray.push({
                startTime: `${startHours}:${startMins}`,
                endTime: `${endHours}:${endMins}`,
                price: price / 2,
                isBooked: offlineBlocked,
                isOfflineBlocked: offlineBlocked
            });
            current = next;
        }

        const payload = {
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            slots: slotsArray,
        };

        try {
            const response = await axios.post(`${API_URL}/slot/add/${_id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            Swal.close();
            if (response.data) {
                Swal.fire({ icon: "success", title: "Whole day slots added", timer: 1400, showConfirmButton: false });
                handleCloseModal();
                fetchVenueSlots();
            }
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error adding slots",
                text: error?.response?.data?.message || error.message
            });
        }
    };

    return (
        <div className="venue-slots-page">
            <div className="venue-slots-header">
                <div>
                    <h3 className="mb-1 title">Manage slots</h3>
                    <p className="venue-slots-help">{venueName || 'Loading venue...'}</p>
                </div>
                <div className="slot-legend"><span><i className="legend-available" />Available</span><span><i className="legend-booked" />Booked</span><span><i className="legend-blocked" />Offline block</span></div>
            </div>

            <p className="slot-action-hint">Click an empty 30-minute time to add a slot. Click an existing slot to change its price or block it for an offline booking.</p>

            <Form className="quick-slot-form" onSubmit={(e) => { e.preventDefault(); handleAddSlot(false); }}>
                <strong>Quick add</strong>
                <Form.Control type="date" value={formData.dateFrom} onChange={handleQuickDateChange} required />
                <Form.Select value={formData.startTime} onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value, endTime: calculateEndTime(e.target.value) }))} required>
                    <option value="">Start time</option>
                    {halfHourTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
                <Form.Select value={formData.endTime} onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))} required aria-label="End time">
                    <option value="">End time</option>
                    {halfHourTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
                <Form.Control type="number" min="0" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} required />
                <Button variant="success" type="submit">Add Available</Button>
                <Button variant="success" type="button" onClick={() => handleAddWholeDaySlots(false)}>Add Whole Day</Button>
                <Button variant="outline-danger" type="button" onClick={() => handleAddSlot(true)}>Block Offline</Button>
                <Button variant="outline-primary" type="button" onClick={() => setShowCarryForwardModal(true)}>Carry Forward Slots</Button>
            </Form>

            <Modal show={showCarryForwardModal} onHide={() => setShowCarryForwardModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Carry Forward Slots</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formSourceDate">
                            <Form.Label>Source Date (Copy slots from this date)</Form.Label>
                            <Form.Control
                                type="date"
                                value={carryForwardData.sourceDate}
                                onChange={(e) => setCarryForwardData(prev => ({ ...prev, sourceDate: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTargetDateFrom">
                            <Form.Label>Target Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={carryForwardData.targetDateFrom}
                                onChange={(e) => setCarryForwardData(prev => ({ ...prev, targetDateFrom: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTargetDateTo">
                            <Form.Label>Target End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={carryForwardData.targetDateTo}
                                onChange={(e) => setCarryForwardData(prev => ({ ...prev, targetDateTo: e.target.value }))}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCarryForwardModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCarryForward}>
                        Carry Forward
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid className="venue-calendar-card">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    events={mapSlotsToEvents()}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    editable={true}
                    slotDuration="00:30:00"
                    slotLabelInterval="00:30:00"
                    snapDuration="00:30:00"
                    allDaySlot={false}
                    eventContent={(arg) => {
                        const { event } = arg;
                        const startTime = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const endTime = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const slotLabel = event.extendedProps.isOfflineBlocked ? 'Offline blocked' : (event.extendedProps.isBooked ? 'Booked online' : event.title);

                        return {
                            html: `
                                <div class="venue-slot-event-content">
                                    <div>${slotLabel}</div>
                                    <div>${startTime} - ${endTime}</div>
                                </div>
                            `,
                        };
                    }}
                    validRange={{
                        start: new Date().toISOString().split('T')[0]
                    }}
                    viewDidMount={(info) => {
                        setCurrentView(info.view.type);
                    }}
                    viewWillUnmount={() => {
                        setCurrentView('');
                    }}
                />
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                {
                    slotId ? (<>
                        <Modal.Header closeButton>
                            <Modal.Title>Manage slot</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formStartTime">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="startTime"
                                        value={updateFormData.startTime}
                                        onChange={handleFormChange}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEndTime">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="endTime"
                                        value={updateFormData.endTime}
                                        onChange={handleFormChange}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={updateFormData.price}
                                        onChange={handleUpdateChange}
                                    />
                                </Form.Group>
                                <div className={`offline-block-status ${updateFormData.isOfflineBlocked ? 'is-blocked' : ''}`}>
                                    <strong>{updateFormData.isOfflineBlocked ? 'Blocked for offline booking' : (updateFormData.isBooked ? 'Already booked online' : 'Available online')}</strong>
                                    <span>{updateFormData.isOfflineBlocked ? 'Customers cannot book this slot online.' : (updateFormData.isBooked ? 'This slot cannot be changed while its online booking is active.' : 'Reserve it instantly for a walk-in or phone booking.')}</span>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-danger" type='button' onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            {(!updateFormData.isBooked || updateFormData.isOfflineBlocked) && <Button variant={updateFormData.isOfflineBlocked ? "outline-success" : "danger"} type='button' onClick={handleOfflineBlockToggle}>
                                {updateFormData.isOfflineBlocked ? 'Make Available' : 'Block for Offline Booking'}
                            </Button>}
                            <Button variant="primary" type='button' onClick={handleSave} disabled={updateFormData.isBooked}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </>) : (
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title>{'Add New Slot'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formStartTime">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dateFrom"
                                            value={formData.dateFrom}
                                            onChange={handleFormChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEndDate">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dateTo"
                                            value={formData.dateTo}
                                            onChange={handleFormChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formStartTime">
                                        <Form.Label>Start Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleFormChange}
                                            disabled={currentView !== 'dayGridMonth'}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEndTime">
                                        <Form.Label>End Time</Form.Label>
                                        <Form.Select
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleFormChange}
                                        >
                                            <option value="">Select end time</option>
                                            {halfHourTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="formPrice">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleFormChange}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                                <Button variant="outline-success" type='button' onClick={() => handleAddWholeDaySlots(false)} disabled={!formData.price || !formData.startTime || !formData.endTime}>
                                    Add Whole Day Slots
                                </Button>
                                <Button variant="primary" type='button' onClick={() => handleAddSlot(false)} disabled={!formData.price || !formData.startTime || !formData.endTime}>
                                    Add Slot
                                </Button>
                            </Modal.Footer>
                        </>
                    )
                }
            </Modal>
        </div>
    );
}
