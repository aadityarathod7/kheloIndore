import FullCalendar from '@fullcalendar/react'
import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/ApiUrl';
import Swal from 'sweetalert2';

export default function AddTrainerSlots() {
    const id = useParams()
    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
    })

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [events, setEvents] = useState([]);

    const handleDateClick = (info) => {
        const clickedDate = new Date(info.dateStr);
        const formattedDate = clickedDate.toISOString().split('T')[0];

        setFormData({
            ...formData,
            start_date: formattedDate,
            end_date: formattedDate,
            start_time: info.dateStr.split('T')[1]?.slice(0, 5),
            end_time: '',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSlot = async () => {
        // Validate the form data
        const { start_date, end_date, start_time, end_time } = formData;

        if (!start_date || !end_date || !start_time || !end_time) {
            alert("Please fill all fields!");
            return;
        }

        // Optionally check if the start date and time is before the end date and time
        const startDateTime = new Date(`${start_date}T${start_time}`);
        const endDateTime = new Date(`${end_date}T${end_time}`);

        if (startDateTime >= endDateTime) {
            alert("Start date/time must be before the end date/time!");
            return;
        }

        const newSlot = {
            start_date,
            end_date,
            start_time,
            end_time,
        };

        console.log("Slot added:", newSlot);
        try {
            let response = await axios.post(`${API_URL}/pt/slots/add/${id._id}`, newSlot);
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "success!",
                    text: "Slot added successfully",
                }).then(() => {
                    getAllSlots()
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: response.data.message,
                })
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add slot. Please try again later.",
            });
        }

        setFormData({
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: ''
        });

        setShowModal(false);
    };

    const handleDeleteSlot = async () => {
        // Validate the form data
        const { start_date, end_date, start_time, end_time } = formData;

        if (!start_date || !end_date || !start_time || !end_time) {
            alert("Please fill all fields!");
            return;
        }

        // Optionally check if the start date and time is before the end date and time
        const startDateTime = new Date(`${start_date}T${start_time}`);
        const endDateTime = new Date(`${end_date}T${end_time}`);

        if (startDateTime >= endDateTime) {
            alert("Start date/time must be before the end date/time!");
            return;
        }

        const newSlot = {
            trainerId: id._id,
            start_date,
            end_date,
            start_time,
            end_time,
        };

        console.log("Slot added:", newSlot);
        try {
            const loadingSwal = Swal.fire({
                title: "Adding slot...",
                text: "Please wait while the slot is being Delete.",
                icon: "info",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            let response = await axios.put(`${API_URL}/pt/slot/delete`, newSlot);
            loadingSwal.close();
            if (response?.data?.success) {
                Swal.fire({
                    icon: "success",
                    title: "success!",
                    text: "Slot Deleted successfully",
                }).then(() => {
                    getAllSlots()
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: response.data.message,
                })
            }
        } catch (error) {
            console.error("Error:", error);
            console.log(error?.response?.data?.message)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message,
            });
        }

        setFormData({
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: ''
        });

        setShowDeleteModal(false);
    };

    const getAllSlots = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-all-pt-slot/${id._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const transformedEvents = response.data.data.map(slot => {
                return slot.slots.map(item => ({
                    title: item.isBooked ? 'Booked Slot' : 'Available Slot',
                    start: new Date(`${slot.start_date.split('T')[0]}T${item.start_time}:00`),
                    end: new Date(`${slot.start_date.split('T')[0]}T${item.end_time}:00`),
                    price: `Price: ${item.price}`,
                    isBooked: item.isBooked,
                    backgroundColor: item.isBooked ? 'black' : 'gray',
                }));
            }).flat();
            setEvents(transformedEvents);
            console.log(response);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };
    console.log(events, "events-=-=-=-=-=-=-")

    useEffect(() => {
        getAllSlots()
    }, [id._id])

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <div><h3 className="mb-4 title">Add Slots</h3></div>
                <div><button className='add-button' onClick={() => setShowDeleteModal(true)}>Delete Slot</button></div>
            </div>
            <Container>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    dateClick={handleDateClick}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    editable={true}
                    slotDuration="01:00:00"
                    allDaySlot={false}
                    events={events}
                />
            </Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{'Add New Slot'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStartTime">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartTime">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleFormChange}
                                min="0"
                                max="23"
                                step="3600"
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndTime">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleFormChange}
                                min="0"
                                max="23"
                                step="3600"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" type='button' onClick={handleAddSlot}>
                        Add Slot
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{'Add New Slot'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStartTime">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartTime">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleFormChange}
                                min="0"
                                max="23"
                                step="3600"
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndTime">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleFormChange}
                                min="0"
                                max="23"
                                step="3600"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Close
                    </Button>
                    <Button variant="primary" type='button' onClick={handleDeleteSlot}>
                        Delete Slot
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
