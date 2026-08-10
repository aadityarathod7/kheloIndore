import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import { EditOutlined, DeleteOutlined, InfoOutlined, DownloadOutlined, CheckOutlined, CloseOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import { API_URL } from "../utils/ApiUrl";
import { Tooltip, Pagination, Popover, Select } from "antd";
import { Link } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import "../../src/Userlist.css";
import "../Style/List.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";

export default function VenueAdminList() {
    const [venueAdmin, setVenueAdmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const role = localStorage.getItem('role');

    const [filterStatus, setFilterStatus] = useState('all');

    const csvData = venueAdmin.map((row, index) => ({
        "S.No.": index + 1 + (currentPage - 1) * itemsPerPage,
        "First Name": row.first_name,
        "Last Name": row.last_name,
        "E-mail": row.email,
        "Role": row.role,
        "Mobile Number": row.mobile,
        "Status": row.status ? "Active" : "Inactive",
    }));

    const fetchVenueAdmin = async (search = "") => {
        try {
            let url = `${API_URL}/super-admin/venuadmin-list`;
            if (search.length > 0) {
                url = `${url}?search=${search}`;
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setVenueAdmin(response.data.data);
            setLoading(false);
        } catch (error) {
            
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenueAdmin();
    }, []);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchValue(searchTerm);
        fetchVenueAdmin(searchTerm);
    };

    const handleDelete = async (row) => {
        setLoading(true)
        try {
            const apiUrl = `${API_URL}/user/delete/${row._id}`;

            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setLoading(false)
                Swal.fire(
                    "Deactivated!",
                    "Venue Admin has been deactivated.",
                    "success"
                );
                fetchVenueAdmin();
            } else {
                setLoading(false)
                
                Swal.fire("Error", "Failed to delete User.", "error");
            }
        } catch (error) {
            setLoading(false)
            
            Swal.fire("Error", "An error occurred while deleting the User.", "error");
        }
    };

    const { Option } = Select;
    const filteredData = venueAdmin.filter(row => {
        if (filterStatus === 'all') return true;
        return filterStatus === 'active' ? row.status : !row.status;
    });

    const handleColumnFilter = (column, value) => {
        if (column === 'status') {
            setFilterStatus(value);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePagination = (page, pageSize) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);
    };

    const handleUpdateAccess = async (venueAdminId, isAdminAccess) => {
        try {
            const confirmation = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to Approve venue admin?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "No, cancel",
            });

            if (confirmation.isConfirmed) {
                setLoading(true)
                const response = await axios.put(
                    `${API_URL}/super-admin/update-admin-status`,
                    {
                        id: venueAdminId,
                        is_admin_access: isAdminAccess,
                        role: "Venue Admin"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoading(false)
                    Swal.fire(
                        "Success!",
                        "Admin access updated successfully.",
                        "success"
                    );
                    fetchVenueAdmin();
                } else {
                    setLoading(false)
                    Swal.fire("Error", "Failed to update admin access.", "error");
                }
            } else {
                setLoading(false)
                Swal.fire("Cancelled", "No changes were made.", "info");
            }
        } catch (error) {
            setLoading(false)
            
            Swal.fire(
                "Error",
                "An error occurred while updating admin access.",
                "error"
            );
        }
    };

    const handleActive = async (venueAdmin) => {
        try {
            const response = await axios.put(
                `${API_URL}/super-admin/update-user/${venueAdmin._id}`,
                {
                    status: true
                }
            );
            Swal.fire({
                icon: "success",
                title: "Venue Admin Activated!",
                text:"Venue Admin Activated successfully",
            });
            fetchVenueAdmin();
        } catch (error) {
            
        }
    }



    return (
        <div>
            <h3 className="mb-4 title">Venue Admin</h3>
            <div className="cnt">
                <Form.Group as={Row} className="mb-3 align-items-center">
                    {role === 'Super Admin' && (
                        <Col sm={6}>
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                                value={searchValue}
                                onChange={handleSearch}
                            />
                        </Col>
                    )}
                    <Col sm={6} className="d-flex justify-content-end align-items-center">
                        <div>
                            {role === 'Super Admin' && (
                                <>
                                    <Link to="/venue-admin/add">
                                        <button className="add-button">Add Venue Admin</button>
                                    </Link>
                                    <CSVLink data={csvData} filename={"user_list.csv"}>
                                        <button className="down-button">Download</button>
                                    </CSVLink>
                                </>
                            )}
                        </div>
                    </Col>
                </Form.Group>

                <div className="table-container">
                    {loading ? (
                        <div className="text-center">
                            <ColorRing
                                visible={true}
                                height="50"
                                width="50"
                                ariaLabel="color-ring-loading"
                                wrapperClass="color-ring-wrapper"
                                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                            />
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <Table className="custom-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "7%" }}>S.No.</th>
                                    <th style={{ width: "10%" }}>First Name</th>
                                    <th style={{ width: "10%" }}>Last Name</th>
                                    <th style={{ width: "10%" }}>E-mail</th>
                                    <th style={{ width: "10%" }}>Mobile Number</th>
                                    <th style={{ width: "10%" }}>Status
                                        <Popover
                                            placement="bottom"
                                            content={
                                                <Select
                                                    placeholder="Select status"
                                                    onChange={(value) => handleColumnFilter('status', value)}
                                                    style={{ width: 190 }}
                                                >
                                                    <Option value="all">All</Option>
                                                    <Option value="active">Active</Option>
                                                    <Option value="inactive">Inactive</Option>
                                                </Select>
                                            }
                                            trigger="click"
                                        >
                                            <FilterOutlined style={{ cursor: 'pointer' }} />
                                        </Popover>
                                    </th>
                                    <th style={{ width: "10%" }}>Action</th>
                                    {role === 'Super Admin' && <th style={{ width: "10%" }}>Confirmation</th>}

                                </tr>
                            </thead>

                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td>{row.first_name}</td>
                                        <td>{row.last_name}</td>
                                        <td>{row.email}</td>
                                        <td>{row.mobile}</td>
                                        <td style={{
                                            color: row.status ? "#4fd104" : "#ff0000",
                                            fontWeight: "bold",
                                        }}>
                                            {row.status ? "Active" : "Inactive"}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {role === 'Super Admin' && (
                                                    <Tooltip title={`Download`} arrow>
                                                        <PDFDownloadLink
                                                            fileName={`user_details.pdf`}
                                                            style={{ marginRight: "5%" }}
                                                        >
                                                            <DownloadOutlined className="download_icon" />
                                                        </PDFDownloadLink>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title={`Edit`} arrow>
                                                    <Link
                                                        to={`/venue-admin/update/${row._id}`}
                                                        style={{ marginLeft: "1%" }}
                                                    >
                                                        <EditOutlined className="edit_icon" />
                                                    </Link>
                                                </Tooltip>
                                                {
                                                    row.status ?
                                                        <Tooltip title={`Deactivate`} arrow>
                                                            <DeleteOutlined
                                                                className="delete_icon"
                                                                onClick={() => handleDelete(row)}
                                                            />
                                                        </Tooltip>
                                                        :
                                                        <Tooltip title={`Activate`} arrow>
                                                            <ReloadOutlined
                                                                className="delete_icon"
                                                                onClick={() => handleActive(row)}
                                                            />
                                                        </Tooltip>
                                                }
                                            </div>
                                        </td>

                                        {role === 'Super Admin' && <td>
                                            <div className="d-flex">
                                                {row.is_admin_access === 2 ? (
                                                    <button
                                                        className="submit-button p-1"
                                                        onClick={() => handleUpdateAccess(row._id, 1)}
                                                    >Reverify</button>
                                                ) : row.is_admin_access === 0 ? (
                                                    <>
                                                        <CheckOutlined
                                                            className="edit_icon"
                                                            onClick={() => handleUpdateAccess(row._id, 1)}
                                                        />
                                                        <CloseOutlined
                                                            className="delete_icon"
                                                            onClick={() => handleUpdateAccess(row._id, 2)}
                                                        />
                                                    </>
                                                ) : null}
                                            </div>
                                            {row.is_admin_access === 1 ? (
                                                <span>Approved</span>
                                            ) : row.is_admin_access === 2 ? (
                                                <span>Rejected</span>
                                            ) : row.is_admin_access === 0 ? (
                                                <span>Pending</span>
                                            ) : null}
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>

                <Pagination
                    pageSizeOptions={["5", "10", "20", "50"]}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    total={venueAdmin.length}
                    pageSize={itemsPerPage}
                    current={currentPage}
                    onChange={handlePagination}
                    onShowSizeChange={(current, size) => {
                        setCurrentPage(1);
                        setItemsPerPage(size);
                    }}
                />
            </div>
        </div>
    );
}
