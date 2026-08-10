import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";

export default function ApproveCoachTrainer() {
    const [apiError, setApiError] = useState("");
    const { _id } = useParams();
    const navigate = useNavigate();
    const [coachTrainer, setCoachTrainer] = useState({});
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
    });
    const [role, setRole] = useState("");


    const fetchUserData = async (_id) => {
        Swal.fire({
            title: "Loading...",
            text: "Fetching data...",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            const response = await axios.get(`${API_URL}/user/fetch-user-by-id/${_id}`);
            const { data } = response.data;

            setCoachTrainer(data);
            setRole(data.role);
            setFormData({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                mobile: data.mobile,
            });
            if (data.is_admin_access !== 0) {
                if (data.role === 'Coach') {
                    navigate('/coaches');
                } else if (data.role === 'Personal Trainer') {
                    navigate('/personal-training');
                } else {
                    // Handle other roles or a default case, if needed
                    navigate('/dashboard'); // Replace with a fallback route
                }
            }
            Swal.close();
        } catch (error) {
            
            Swal.close();
        }
    };

    useEffect(() => {

        if (_id) {
            fetchUserData(_id);
        }
    }, [_id]);

    const handleUpdateAccess = async (isAdminAccess) => {
        try {
            const response = await axios.put(`${API_URL}/super-admin/update-admin-status`, {
                id: _id,
                is_admin_access: isAdminAccess,
                role: role
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                Swal.fire("Success!", `${role} access updated successfully.`, "success");
                if (role === 'Coach') {
                    navigate('/coaches');
                } else if (role === 'Personal Trainer') {
                    navigate('/personal-training');
                } else {
                    navigate('/dashboard');
                }
            } else {
                Swal.fire("Error", `Failed to update ${role} admin access.`, "error");
            }
        } catch (error) {
            
            Swal.fire("Error", `An error occurred while updating ${role} admin access.`, "error");
        }
    };


    return (
        <div>
            <>
                <h3 className="mb-4 title">Approve {role}</h3>
                <Container
                    style={{
                        maxWidth: "1000px",
                        boxShadow: "6px 0px 1px -8px rgba(0,0,0,0.75)",
                        marginBottom: "20px",
                        marginTop: "30px",
                    }}
                >
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>
                                        First Name<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formLastName">
                                    <Form.Label>
                                        Last Name<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label className="mt-3">Email Address
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formMobile">
                                    <Form.Label className="mt-3">
                                        Mobile Number<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        disabled
                                        placeholder="Enter Mobile Number"
                                        name="mobile"
                                        value={formData.mobile}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* {apiError && (
                            <Row className="mt-3">
                                <Col md={12}>
                                    <div className="alert alert-danger">{apiError}</div>
                                </Col>
                            </Row>
                        )} */}

                        <Row>
                            <Col md={12} className="d-flex justify-content-start mt-3">
                                <Button
                                    type="button"
                                    className="submit-button"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => handleUpdateAccess(1)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => handleUpdateAccess(2)}
                                >
                                    Reject
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </>
        </div>
    )
}
