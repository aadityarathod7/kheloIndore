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

export default function AddVenueSlots() {
    const [venueName, setVenueName] = useState("");
    const [slots, setSlots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [formData, setFormData] = useState({
        dateFrom: "",
        dateTo: "",
        startTime: "",
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
        price: "",
        _id: slotId,
    });

    const [currentView, setCurrentView] = useState('timeGridWeek');


    const fetchVenueDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/venue/individual/${_id}`);
            if (response.data && response.data.venue) {
                setVenueName(response.data.venue.name);
            }
        } catch (error) {
            console.error("Error fetching venue details:", error);
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
                setSlots(data.data);
            } else {
                console.error("Response not ok:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };
    useEffect(() => {
        fetchVenueSlots();
    }, [_id]);


    const mapSlotsToEvents = () => {
        return slots.map(slot => {
            return slot.slots.map(innerSlot => {
                const slotDate = new Date(slot.date);
                const eventStartTime = new Date(slotDate);
                eventStartTime.setHours(innerSlot.startTime.split(":")[0]);
                eventStartTime.setMinutes(innerSlot.startTime.split(":")[1] || 0);

                const eventEndTime = new Date(slotDate);
                eventEndTime.setHours(innerSlot.endTime.split(":")[0]);
                eventEndTime.setMinutes(innerSlot.endTime.split(":")[1] || 0);

                return {
                    title: innerSlot.isBooked ? `Booked - ₹ ${innerSlot.price}` : `₹ ${innerSlot.price}`,
                    start: eventStartTime.toISOString(),
                    end: eventEndTime.toISOString(),
                    description: `Price: ₹${innerSlot.price} | ${innerSlot.isBooked ? 'Booked' : 'Available'}`,
                    backgroundColor: innerSlot.isBooked ? 'black' : 'gray',
                    textColor: 'white',
                    extendedProps: {
                        price: innerSlot.price,
                        isBooked: innerSlot.isBooked,
                        id: innerSlot._id,
                        date_id: slot._id
                    }
                };
            });
        }).flat();
    };


    const handleDateClick = (info) => {
        const clickedDate = new Date(info.dateStr);
        console.log(clickedDate)
        const formattedDate = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
        console.log(formattedDate)

        setFormData({
            ...formData,
            dateFrom: formattedDate,
            dateTo: formattedDate,
            startTime: info.dateStr.split('T')[1]?.slice(0, 5),
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
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const calculateEndTime = (startTime) => {
        const startDate = new Date(`2023-01-01T${startTime}:00`);
        startDate.setHours(startDate.getHours() + 1);
        const hours = startDate.getHours().toString().padStart(2, '0');
        const minutes = startDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    const handleAddSlot = async () => {
        const { dateFrom, dateTo, startTime, price } = formData;

        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);

        const newSlots = [];


        while (startDate <= endDate) {
            const slotEndTime = calculateEndTime(startTime);

            const newSlot = {
                date: startDate.toISOString().split('T')[0],
                slots: [{
                    startTime,
                    endTime: slotEndTime,
                    price,
                    isBooked: false,
                }]
            };
            newSlots.push(newSlot);
            startDate.setDate(startDate.getDate() + 1);
        }

        // setSlots(prevSlots => [...prevSlots, ...newSlots]);

        const payload = {
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            slots: newSlots[0].slots,
        };

        try {
            const response = await axios.post(`${API_URL}/slot/add/${_id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Slot added successfully",
                })
                fetchVenueSlots();
            }
        } catch (error) {
            console.error("Error adding slot:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while adding the slot.",
            });
        }

        setShowModal(false);

        setFormData({
            dateFrom: "",
            dateTo: "",
            startTime: "",
            price: "",
            available: true,
        });
    };


    const handleEventClick = (info) => {
        // console.log('event click', info.event._def.extendedProps.isBooked);
        setSlotId(info.event._def.extendedProps.id)
        setUpdateFormData((prevData) => ({
            ...prevData,
            _id: info.event._def.extendedProps.id,
        }));
        setDateId(info.event._def.extendedProps.date_id)
        const event = info.event;
        setSelectedEvent(event);
        setNewPrice(event.extendedProps.price);
        if (info.event._def.extendedProps.isBooked) {
            setShowModal(false)
        } else {
            setShowModal(true);
        }
    };

    useEffect(() => {
        // console.log(slotId, "slotId-=-=-=-")

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
                // console.log(slotData, "response-=-=response");
                setUpdateFormData((prevData) => ({
                    ...prevData,
                    startTime: slotData.startTime,
                    endTime: slotData.endTime,
                    isBooked: slotData.isBooked,
                    price: slotData.price,
                }));
            } catch (error) {
                console.error("Error fetching slot:", error);
            }
        };

        if (slotId) {
            fetchSlotById()
        }

    }, [slotId])

    // console.log(selectedEvent, "selectedEvent-=-=-=-")
    // console.log(showModal, "showModal-=-=-=-")

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // console.log(dateId,"date id-=-=-=-=-=")
    // console.log(updateFormData, "update form data-=-=-=-")

    const handleSave = async () => {
        const payload = { slotsToUpdate: [updateFormData] };
        // console.log(payload);

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

            console.log("Successfully updated:", response.data);
            setShowModal(false);
            fetchVenueSlots();
        } catch (error) {
            console.error("Error updating slots:", error);
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
                const response = await axios.put(`${API_URL}/slot/delete-by-slotid/${slotId}`, {});
                console.log(response?.data.success)
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



    return (
        <div>
            <div className="d-flex mb-4">
                <h3 className="mb-0 title" style={{ marginRight: '30%' }}>Add Slots</h3>
                <h1 className="mb-0 title">{venueName}</h1>
            </div>

            <Container>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={mapSlotsToEvents()}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    editable={true}
                    slotDuration="01:00:00"
                    allDaySlot={false}
                    eventContent={(arg) => {
                        const { event } = arg;
                        const startTime = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const endTime = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return {
                            html: `
                                <div style="font-size: 12px; font-weight: bold;">
                                    <div>${event.title}</div>
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

            <Modal show={showModal} onHide={handleCloseModal}>
                {
                    slotId ? (<>
                        <Modal.Header closeButton>
                            <Modal.Title>{'Edit Slot Price'}</Modal.Title>
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
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type='button' onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" type='button' onClick={handleSave}>
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
                                <Button variant="primary" type='button' onClick={handleAddSlot} disabled={!formData.price}>
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
