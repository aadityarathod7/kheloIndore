import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoOutlined,
  AppstoreAddOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { ColorRing } from "react-loader-spinner";
import { CSVLink } from "react-csv";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { Table, Form, Row, Col, Button } from "react-bootstrap";
//import '../../Userlist.css';
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import { API_URL } from "../utils/ApiUrl";
import { Pagination, Tooltip } from "antd";
import { Popover, Input, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import axios from "axios";

function PersonalTraininglist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Initialize itemsPerPage state
  const [csvData, setCsvData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [showAcceptReject, setShowAcceptReject] = useState({});

  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    formatCsvData();
  }, [data]);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (userRole == "Super Admin") {
      setIsSuperAdmin("Super Admin");
    }
  }, [])

  const fetchData = async () => {
    try {
      const apiUrl = `${API_URL}/PersonalTraining/fetchAll`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatCsvData = () => {
    const formattedData = data.map((row) => ({
      "Trainer Name": `${row.first_name} ${row.last_name}`,
      Duration: row.duration,
      "Focus Area": row.focus_area,
      Price: row.price,
      Status: row.status ? "Active" : "Inactive",
    }));

    setCsvData(formattedData);
  };

  const generatePdfContent = (rowData) => (
    <Document>
      <Page>
        <Text>Trainer Name: {rowData.trainer_name}</Text>
        <Text>Gender: {rowData.gender}</Text>
        <Text>Age: {rowData.age}</Text>
        <Text>Mobile Number: {rowData.mobile}</Text>
        <Text>Available: {rowData.availability}</Text>
        <Text>specializations: {rowData.Specializations}</Text>
        <Text>Language: {rowData.language}</Text>
        <Text>Experience: {rowData.experience}</Text>
        <Text>Address: {rowData.address}</Text>
        <Text>State: {rowData.state}</Text>
        <Text>City: {rowData.city}</Text>
        <Text>Zipcode: {rowData.zipcode}</Text>
      </Page>
    </Document>
  );

  const filteredData = data.filter(row => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? row.status : !row.status;
  });

  const handleColumnFilter = (column, value) => {
    if (column === 'status') {
      setFilterStatus(value);
    }
  };
  const { Option } = Select;

  const handlePdf = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(
        `${API_URL}/PersonalTraining/fetch/${row.id}`
      );
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
        setPdfContent(generatePdfContent(detailResult.data));
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const handleInfo = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(
        `${API_URL}/PersonalTraining/fetch/${row.id}`
      );
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const handleEdit = async (row) => {
    try {
      const response = await fetch(
        `${API_URL}/PersonalTraining/fetch/${row._id}`
      );
      if (response.ok) {
        const data = await response.json();
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const handleDeactivate = async (row) => {
    const result = await Swal.fire({
      title: "Deactivate Trainer?",
      text: "This will hide the trainer from the public website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      confirmButtonColor: "#e53e3e",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.post(
        `${API_URL}/admin/rejectTrainer/${row._id}`,
        { reason: "Deactivated by admin" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("Deactivated!", "Personal Trainer has been deactivated.", "success");
      fetchData();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to deactivate.", "error");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handlePagination = (page, pageSize) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData
    .filter((row) =>
      row.first_name.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handleUpdateAccess = async (isAdminAccess, coachId) => {
    // Show confirmation popup
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to update Trainer admin access?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    });

    // If user confirms, proceed with the API call
    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/super-admin/update-admin-status`, {
          id: coachId,
          is_admin_access: isAdminAccess,
          role: "Personal Trainer"
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          Swal.fire("Success!", `Trainer admin access updated successfully.`, "success");
          fetchData()
        } else {
          Swal.fire("Error", `Failed to update Trainer admin access.`, "error");
        }
      } catch (error) {
        
        Swal.fire("Error", `An error occurred while updating Trainer admin access.`, "error");
      }
    } else {
      // If user cancels, show a cancellation message
      Swal.fire("Cancelled", `No changes were made to Trainer admin access.`, "info");
    }
  };

  const handleActive = async (UpdatepersonalTrainerID) => {
    try {
      await axios.post(
        `${API_URL}/admin/approveTrainer/${UpdatepersonalTrainerID._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Trainer Activated!",
        text: "Trainer profile approved and is now active.",
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Activate",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  }


  return (
    <>
      <h3 className="mb-4 title">Trainers</h3>
      <div className="cnt">
        <Form.Group as={Row} className="mb-3">
          <Col sm={6}>
            <Form.Control
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchInputChange}
            />
          </Col>
          {
            isSuperAdmin && <Col sm={6} className="d-flex justify-content-end align-items-center">
              <div className="mr-3">
                <Link to="/personal-training/add">
                  <button className="add-button mr-2">
                    Add Trainer
                  </button>
                </Link>
              </div>
              <div>
                <CSVLink data={csvData} filename={"user_list.csv"}>
                  <button className="down-button">Download</button>
                </CSVLink>
              </div>
            </Col>
          }

        </Form.Group>
        <div className="table-container">
          {loading ? (
            <div className="text-center">
              <ColorRing
                visible={true}
                height="50"
                width="50"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
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
                  <th style={{ width: "10%" }}>
                    Name{" "}
                    {/* <Popover
                      placement="bottom"
                      title="Filter by First Name"
                      content={
                        <Input
                          placeholder="Search..."
                          onChange={(e) =>
                            handleColumnFilter("first_name", e.target.value)
                          }
                        />
                      }
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: "pointer" }} />
                    </Popover> */}
                  </th>
                  <th style={{ width: "14%" }}>
                    Mobile Number{" "}
                    {/* <Popover
                      placement="bottom"
                      title="Filter by Mobile Number"
                      content={
                        <Input
                          placeholder="Search..."
                          onChange={(e) =>
                            handleColumnFilter("mobile", e.target.value)
                          }
                        />
                      }
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: "pointer" }} />
                    </Popover> */}
                  </th>
                  <th style={{ width: "10%" }}>
                    Email{" "}
                    {/* <Popover
                      placement="bottom"
                      title="Filter by Specializations"
                      content={
                        <Input
                          placeholder="Search..."
                          onChange={(e) =>
                            handleColumnFilter(
                              "specializations",
                              e.target.value
                            )
                          }
                        />
                      }
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: "pointer" }} />
                    </Popover> */}
                  </th>
                  <th style={{ width: "10%" }}>
                    Status{" "}
                    <Popover
                      placement="bottom"
                      content={
                        <Select
                          placeholder="Select status"
                          onChange={(value) =>
                            handleColumnFilter("status", value)
                          }
                          style={{ width: 190 }}
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
                  <th style={{ width: "15%" }}>Action</th>
                  <th>Confirmation</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td><div>{row.first_name} {row.last_name}</div><small className="text-muted">{row.provider_public_id || "ID pending"}</small></td>
                    <td>{row.mobile}</td>
                    <td>{row.email}</td>
                    <td
                      style={{
                        color: row.status ? "#4fd104" : "#ff0000",
                        fontWeight: "bold",
                      }}
                    >
                      {row.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Download`}
                            </span>
                          }
                          arrow
                        >
                          <PDFDownloadLink
                            document={generatePdfContent(row)}
                            fileName={`coachlist_details.pdf`}
                            style={{ marginRight: "3%" }}
                          >
                            <DownloadOutlined
                              className="download_icon"
                              onClick={() => handlePdf(row)}
                            />
                          </PDFDownloadLink>
                        </Tooltip> */}

                        {/* <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Full Name: ${row.first_name} ${row.last_name}\nGender: ${row.gender}\nAge: ${row.age}\nEmail: ${row.email}\nMobile No: ${row.mobile}\nAvailability: ${row.availability}\nSpecializations: ${row.specializations}\nBio: ${row.bio}`}
                            </span>
                          }
                          arrow
                        >
                          <InfoOutlined
                            className="info_icon"
                            onClick={() => handleInfo(row)}
                          />
                        </Tooltip> */}
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Edit`}
                            </span>
                          }
                          arrow
                        >
                          <Link
                            to={`/personal-training/edit/${row._id}`}
                            style={{ marginLeft: "1%" }}
                          >
                            <EditOutlined
                              className="edit_icon"
                              onClick={() => handleEdit(row)}
                            />
                          </Link>
                        </Tooltip>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Add slots`}
                            </span>
                          }
                          arrow
                        >
                          <Link to={`/personal-training/slots-add/${row._id}`}>
                            <AppstoreAddOutlined
                              className='edit_icon'
                            />
                          </Link>
                        </Tooltip>
                        {isSuperAdmin && (
                          row.status ?
                            <Tooltip title={`Deactivate`} arrow>
                              <DeleteOutlined
                                className="delete_icon"
                                onClick={() => handleDeactivate(row)}
                              />
                            </Tooltip>
                            :
                            <Tooltip title={`Activate`} arrow>
                              <ReloadOutlined
                                className="delete_icon"
                                onClick={() => handleUpdateAccess(1, row._id)}
                              />
                            </Tooltip>
                        )}
                      </div>
                    </td>
                    <td>

                      {isSuperAdmin && (
                        <>
                          {row.is_admin_access === 2 ? (
                            <button
                              className="submit-button p-1"
                              onClick={() => handleUpdateAccess(1, row._id)}
                            >
                              Reverify
                            </button>
                          ) : row.is_admin_access === 0 ? (
                            <div className="d-flex">
                              <CheckOutlined className='edit_icon' onClick={() => handleUpdateAccess(1, row._id)} />
                              <CloseOutlined className='delete_icon' onClick={() => handleUpdateAccess(2, row._id)} />
                            </div>
                          ) : null}
                        </>
                      )}
                      <div>
                        {(() => {
                          if (row.is_admin_access === 0) {
                            return "Pending";
                          } else if (row.is_admin_access === 1) {
                            return "Accepted";
                          } else if (row.is_admin_access === 2) {
                            return "Rejected";
                          }
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        <Pagination
          pageSizeOptions={["5", "10", "20", "50"]} // Available page sizes
          showSizeChanger={true} // Show the page size changer dropdown
          showQuickJumper={true} // Show quick jumper
          total={data.length} // Total number of items
          pageSize={itemsPerPage} // Items per page
          current={currentPage} // Current page
          onChange={handlePagination}
          onShowSizeChange={(current, size) => {
            setCurrentPage(1);
            setItemsPerPage(size);
          }}
        />
      </div>
    </>
  );
}

export default PersonalTraininglist;
