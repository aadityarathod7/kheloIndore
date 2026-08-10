import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";
import axios from 'axios';

export default function ViewVenueSlots() {
    const [slots, setSlots] = useState([]);
    const [transformedSlots, setTransformedSlots] = useState([]);
    const [updatedSlots, setUpdatedSlots] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const { _id } = useParams();

    const getAllSlots = () => {
        const fetchVenueSlots = async () => {
            try {
                const response = await fetch(`${API_URL}/get/venue/fetch-slot/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSlots(data.data);
                } else {
                    
                }
            } catch (error) {
                
            }
        };

        fetchVenueSlots();
    }

    useEffect(() => {
        getAllSlots();
    }, [_id]);

    useEffect(() => {
        const data = slots.slots;
        if (Array.isArray(data)) {
            const transformed = data.map((booking) => ({
                id: booking._id,
                startTime: booking.startTime,
                endTime: booking.endTime,
                price: booking.price,
                isBooked: booking.isBooked,
            }));

            setTransformedSlots(transformed);
        }
    }, [slots]);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        const payload = { slotsToUpdate: updatedSlots };
        
    
        try {
            // Make the PUT request using axios
            const response = await axios.put(
                `${API_URL}/slot/update-add/${_id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json', // Ensure that it's JSON
                    },
                }
            );
    
            // Handle the response
            
        } catch (error) {
            
        }
    
        // After updating, reset state and fetch the updated slots
        setIsEditing(false);
        getAllSlots();
    };

    const handlePriceChange = (id, value, isBooked) => {
        setTransformedSlots((prevSlots) =>
            prevSlots.map((slot) =>
                slot.id === id ? { ...slot, price: value } : slot
            )
        );

        setUpdatedSlots((prevUpdatedSlots) => {
            const existingIndex = prevUpdatedSlots.findIndex((slot) => slot._id === id);
            const updatedSlot = {
                _id: id,
                startTime: transformedSlots.find((slot) => slot.id === id).startTime,
                endTime: transformedSlots.find((slot) => slot.id === id).endTime,
                price: Number(value),
                isBooked,
            };

            if (existingIndex !== -1) {
                const updatedArray = [...prevUpdatedSlots];
                updatedArray[existingIndex] = updatedSlot;
                return updatedArray;
            } else {
                return [...prevUpdatedSlots, updatedSlot];
            }
        });
    };

    return (
        <div>
            <h3>View Venue Slots</h3>
            <div className="view_bnt d-flex justify-content-end mb-3">
                {isEditing ? (
                    <button className="SubmitButton" onClick={handleSave}>
                        Save Changes
                    </button>
                ) : (
                    <button className="SubmitButton" onClick={handleEditClick}>
                        Edit Slots
                    </button>
                )}
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transformedSlots.map((slot, index) => (
                        <tr key={index}>
                            <td>{slot.startTime}</td>
                            <td>{slot.endTime}</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={slot.price}
                                        onChange={(e) =>
                                            handlePriceChange(slot.id, e.target.value, slot.isBooked)
                                        }
                                    />
                                ) : (
                                    `₹ ${slot.price}`
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
