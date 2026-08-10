import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../utils/ApiUrl'

export default function VenueSlots() {

    const [slots, setSlots] = useState([])
    const [transformedSlots, setTransformedSlots] = useState([])

    const { _id } = useParams();

    useEffect(() => {
        const fetchVenueSlots = async () => {
            try {
                const response = await fetch(`${API_URL}/venue/fetch-all-slot/${_id}`,
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
                    
                }
            } catch (error) {
                
            }
        };

        fetchVenueSlots();
    }, [])

    useEffect(() => {
        const transformed = slots.map((booking) => ({
            id: booking._id,
            date: booking.date,
        }))

        setTransformedSlots(transformed);
    }, [slots]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <div>
            <h3>View Venue Slots</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>View Slots</th>
                    </tr>
                </thead>
                <tbody>
                    {transformedSlots.map((slot, index) => (
                        <tr key={index}>
                            <td>{formatDate(slot.date)}</td>
                            <td><Link to={`/venues/slots-details/${slot.id}`} className=''>view slots</Link></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
