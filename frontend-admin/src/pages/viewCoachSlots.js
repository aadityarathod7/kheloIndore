import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";

export default function ViewCoachSlots() {
    const [slots, setSlots] = useState([])
    const [transformedSlots, setTransformedSlots] = useState([])

    const { _id } = useParams();

    useEffect(() => {
        const fetchCoachSlots = async () => {
            try {
                const response = await fetch(`${API_URL}/get-all-coach-slot/${_id}`,
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

        fetchCoachSlots();
    }, [])

    useEffect(() => {
        const transformed = slots.map((booking) => ({
            id: booking._id,
            batchDate: booking.batchDate,
            package_type: booking.package_type,
            batchSize: booking.batchSize,
            batchName: booking.batchName,
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
            <h3>View Coach Slots</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Batch Name</th>
                        <th>Batch Size</th>
                        <th>Package type</th>
                        <th>Batch Date</th>
                        <th>Slots</th>
                    </tr>
                </thead>
                <tbody>
                    {transformedSlots.map((slot, index) => (
                        <tr key={index}>
                            <td>{slot.batchName}</td>
                            <td>{slot.batchSize}</td>
                            <td>{slot.package_type}</td>
                            <td>{formatDate(slot.batchDate)}</td>
                            <td><Link to={`/coaches/slots-details/${slot.id}`} className=''>view</Link></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
