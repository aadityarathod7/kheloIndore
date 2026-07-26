import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Approve() {
    const navigate = useNavigate();
    const adminId = useParams();

    const handleRoute = () => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate(`/venue-admin/update/${adminId?.id}`);
        }else{
            navigate('/login', { state: { userId: adminId?.id ,role: "venueAdmin"} });
        }
    }

    useEffect(() => {
        handleRoute()
    }, [])

    return (
        <div className="approve-container">
            
        </div>
    );
}
