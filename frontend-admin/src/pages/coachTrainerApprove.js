import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function CoachTrainerApprove() {

    const navigate = useNavigate();
    const adminId = useParams();

    const handleRoute = () => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate(`/approve-trainer-coach/${adminId?.id}`);
        } else {
            navigate('/login', { state: { userId: adminId?.id ,role:"coachTrainer"} });
        }
    }

    useEffect(() => {
        handleRoute()
    }, [])


    return (
        <div>

        </div>
    )
}
