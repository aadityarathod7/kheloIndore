import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tooltip, Pagination, Select } from "antd";
import { Popover, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
import { ColorRing } from "react-loader-spinner";
import { API_URL } from "../utils/ApiUrl";
import axios from "axios";
import { CSVLink } from "react-csv";
import "../../src/Userlist.css";
import "../Style/List.css";
import Swal from "sweetalert2";

function Userlist() {
  const [userdata, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all", // Default to show all users
  });
  const role = localStorage.getItem('role');

  const fetchUserData = async (search = "") => {
    try {
      setLoading(true);
      let url = `${API_URL}/super-admin/user-list`;
      if (search.length > 0) {
        url = `${url}?search=${search}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchUserData(value);
  };

  const handlePagination = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const handleColumnFilter = (column, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Apply filters
  const filteredUserData = userdata?.filter((user) => {
    if (filters.status !== 'all' && user.status !== (filters.status === 'active')) {
      return false;
    }
    return true;
  });

  const currentUserData = filteredUserData?.slice(indexOfFirstItem, indexOfLastItem);

  const csvData = filteredUserData?.map(user => ({
    'First Name': user.first_name,
    'Last Name': user.last_name,
    'Role': user.role,
    'Mobile Number': user.mobile,
    'E-mail': user.email,
    'Status': user.status ? 'Active' : 'Inactive',
  }));

  const handleDelete = async (row) => {
    try {
      const apiUrl = `${API_URL}/user/delete/${row._id}`;
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        Swal.fire(
          "Deactivated!",
          "User has been deactivated.",
          "success"
        );
        fetchUserData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleActive = async (user) => {
    try {
      const response = await axios.put(
        `${API_URL}/super-admin/update-user/${user._id}`,
        {
          status: true
        }
      );
      if (response.status === 200) {
        Swal.fire(
          "Activated!",
          "User has been Activated.",
          "success"
        );
        fetchUserData();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  const { Option } = Select;

  return (
    <div>
      <h3 className="mb-4 title">Users</h3>
      <div className="cnt">
        <Form.Group as={Row} className="mb-3 align-items-center">
          {role === 'Super Admin' && (
            <Col sm={6}>
              <Form.Control
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Col>
          )}
          <Col sm={6} className="d-flex justify-content-end align-items-center">
            <div>
              {role === 'Super Admin' && (
                <>
                  <Link to="/users/add">
                    <button className="add-button">Add User</button>
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
                  <th style={{ width: "10%" }}>Bookings</th>
                  <th style={{ width: "10%" }}>
                    Status
                    <Popover
                      placement="bottom"
                      content={
                        <Select
                          placeholder="Select status"
                          onChange={(value) =>
                            handleColumnFilter("status", value)
                          }
                          style={{ width: 190 }}
                          value={filters.status}
                        >
                          <Option value="all">All</Option>
                          <Option value="active">Active</Option>
                          <Option value="inactive">Inactive</Option>
                        </Select>
                      }
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: "pointer" }} />
                    </Popover>
                  </th>
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentUserData?.map((user, index) => {
                  const serialNumber = index + 1 + (currentPage - 1) * itemsPerPage;
                  return (
                    <tr key={user.id}>
                      <td>{serialNumber}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.booking_count}</td>
                      <td style={{
                        color: user.status ? "#4fd104" : "#ff0000",
                        fontWeight: "bold",
                      }}>
                        {user.status ? "Active" : "Inactive"}
                      </td>
                      <td>
                        <div style={{ display: "flex" }}>
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
                          <Tooltip title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Full Name: ${user.first_name} ${user.last_name}\nRole: ${user.role}\nEmail: ${user.email}\nMobile: ${user.mobile}`}
                            </span>
                          } arrow>
                            <InfoOutlined className="info_icon" />
                          </Tooltip>
                          <Tooltip title={`Edit`} arrow>
                            <Link to={`/UpdateUser/${user._id}`} style={{ marginLeft: "1%" }}>
                              <EditOutlined className="edit_icon" />
                            </Link>
                          </Tooltip>
                          {user.status ?
                            <Tooltip title={`Deactivate`} arrow>
                              <DeleteOutlined
                                className="delete_icon"
                                onClick={() => handleDelete(user)}
                              />
                            </Tooltip>
                            :
                            <Tooltip title={`Activate`} arrow>
                              <ReloadOutlined
                                className="delete_icon"
                                onClick={() => handleActive(user)}
                              />
                            </Tooltip>
                          }
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>

        <Pagination
          pageSizeOptions={["5", "10", "20", "50"]}
          showSizeChanger={true}
          showQuickJumper={true}
          total={userdata.length}
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

export default Userlist;
