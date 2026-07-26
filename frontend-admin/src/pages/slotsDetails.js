import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../utils/ApiUrl';
import { array } from 'yup';

export default function SlotsDetails() {
    const [slots, setSlots] = useState([])
    const [transformedSlots, setTransformedSlots] = useState([])


    const { _id } = useParams();

    useEffect(() => {
        const fetchCoachSlots = async () => {
            try {
                const response = await fetch(`${API_URL}/coach-slot/fetch/${_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json(); // Parse the JSON data
                    setSlots(data.data)
                } else {
                    console.error("Response not ok:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };

        fetchCoachSlots();
    }, [])

    
    useEffect(() => {
        const data = slots.slots;
        if (Array.isArray(data)) {
            const transformed = data.map((booking) => ({
                id: booking._id,
                startTime: booking.startTime,
                endTime: booking.endTime,
                price: booking.price,
                personCount: booking.personCount,
            }));
            
            setTransformedSlots(transformed);
        }
    }, [slots]);

    return (
        <div>
            <h3>View Coach Slots</h3>
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
                            <td>₹ {slot.price}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
