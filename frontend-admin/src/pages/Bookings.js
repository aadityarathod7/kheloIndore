import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  InfoOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Form,
  Row,
  Col,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import "../Style/List.css";
import { CSVLink } from "react-csv";
import { API_URL } from "../utils/ApiUrl";
import { Pagination, Tooltip } from "antd";
import { Popover, Input, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";

function BookingList({ listType }) {
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [csvData, setCsvData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");
  const [coachBooking, setCoachBooking] = useState([]);
  const [trainerBooking, setTrainerBooking] = useState([]);
  const [transformedBookings, setTransformedBookings] = useState([]);
  const [transformedTrainerBookings, setTransformedTrainerBookings] = useState(
    []
  );
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");

  const [showModal, setShowModal] = useState(false);

  const userRole = localStorage.getItem("role");
  const [refunedBooking, setRefunedBooking] = useState();
  const [refundAmount, setRefundAmount] = useState();
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (userRole == "Super Admin") {
      setSelectedItem("Venue");
      setIsSuperAdmin("Super Admin");
    } else if (userRole == "Venue Admin") {
      setSelectedItem("Venue");
    } else if (userRole == "Coach") {
      setSelectedItem("Coach");
    } else {
      setSelectedItem("trainer");
    }
    
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  const fetchData = async () => {
    try {
      const apiUrl = `${API_URL}/booking/get?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setTotalCount(result.totalCount);
      } else {
        
      }
      setLoading(false);
    } catch (error) {
      
      setLoading(false);
    }
  };
  const fetchCoachesBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/coach/booking/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json(); // Parse the JSON data

        setCoachBooking(data.data);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchCoachesBooking();
  }, []);

  const fetchTrainerBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/pt/booking/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json(); // Parse the JSON data
        setTrainerBooking(data.data);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchTrainerBooking();
  }, []);

  const openrefunedmodel = (id) => {
    setRefunedBooking(id);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}/refund/${refunedBooking}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          refundAmount: refundAmount,
          reason: reason,
        }),
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok && data.success !== false) {
        setShowModal(false);
        fetchData();
        Swal.fire({
          title: "Success",
          text: data.message || "Refund Processed Successfully",
          icon: "success",
          confirmButtonText: "Close",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.details?.message || "Failed to process refund",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred while processing the refund",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleColumnFilter = (columnName, value) => {
    setCurrentPage(1);
    setSearchQuery("");
    if (columnName === "status") {
      if (value === "all") {
        fetchData();
      } else {
        const filteredData = data.filter((row) => {
          if (value === "active") {
            return row.info.user_id.status === true;
          } else if (value === "inactive") {
            return row.info.user_id.status === false;
          }
          return true;
        });
        setData(filteredData);
      }
    } else if (columnName === "date") {
      // Assuming 'date' is the column name for date values
      const selectedDate = new Date(value); // Convert the input date string to a Date object
      const filteredData = data.filter((row) => {
        const rowDate = new Date(row.date); // Assuming row.date contains date values
        // Compare the year, month, and day of the selected date with the row's date
        return (
          rowDate.getFullYear() === selectedDate.getFullYear() &&
          rowDate.getMonth() === selectedDate.getMonth() &&
          rowDate.getDate() === selectedDate.getDate()
        );
      });
      setData(filteredData);
    } else {
      // Handle filtering for other columns if needed
      const filteredData = data.filter((row) =>
        row[columnName].toLowerCase().includes(value.toLowerCase())
      );
      setData(filteredData);
    }

    setIsPopoverOpen(false);
  };

  const { Option } = Select;

  const handleInfo = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/event/get/${row._id}`);
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
      const response = await fetch(`${API_URL}/event/get/${row._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: data.event_name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location,
          status: data.status,
        }),
      });

      if (response.ok) {
      } else {
        const responseData = await response.json();
        
      }
    } catch (error) {
      
    }
  };

  const handleDelete = async (row) => {
    try {
      const apiUrl = `${API_URL}/event/delete/${row._id}`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire("Deactivated!", "Profile has been Deactivated.", "success");
        // Update your state or refetch data to reflect the deletion
        fetchData();
      } else {
        
        Swal.fire("Error", "Failed to delete event.", "error");
      }
    } catch (error) {
      
      Swal.fire(
        "Error",
        "An error occurred while deleting the event.",
        "error"
      );
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handlePagination = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : "";
  // .filter((row) =>
  //   row.user_id.first_name.toLowerCase().includes(searchText.toLowerCase())
  // )
  // .slice(indexOfFirstItem, indexOfLastItem);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  useEffect(() => {
    const transformed = coachBooking
      ? coachBooking.map((booking) => ({
          id: booking._id,
          startDate: booking.startDate,
          first_name: booking.coachId.first_name,
          last_name: booking.coachId.last_name,
          user_first_name: booking.userId.first_name,
          user_last_name: booking.userId.last_name,
          mobile: booking.userId.mobile,
          package_type: booking.packageType,
          payment: booking.total_price,
          payment_state: booking.paymentState,
          verification_status: booking.verification_status,
          cancellation_status: booking.cancellation_status,
        }))
      : "";

    setTransformedBookings(transformed);
  }, [coachBooking]);

  useEffect(() => {
    
    const transformed = trainerBooking.map((booking) => ({
      id: booking._id,
      startDate: booking.startDate,
      first_name: booking.pt_id.first_name,
      last_name: booking.pt_id.last_name,
      user_first_name: booking.user_id.first_name,
      user_last_name: booking.user_id.last_name,
      mobile: booking.user_id.mobile,
      payment: booking.total_price,
      payment_state: booking.paymentState,
      verification_status: booking.verification_status,
      cancellation_status: booking.cancellation_status,
    }));
    
    setTransformedTrainerBookings(transformed);
  }, [trainerBooking]);

  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    if (selectedItem == "Coach") {
      const data = transformedBookings;
      setBookingData(data);
    } else {
      const data = transformedTrainerBookings;
      setBookingData(data);
    }
  }, [selectedItem, transformedBookings]);

  useEffect(() => {
    const venueCsvData = currentItems
      ? currentItems.map((data) => ({
          "User name": `${data.info.user_id.first_name} ${data.info.user_id.last_name}`,
          "Venue name": data.info.venue_id.name,
          "Slot time": data.slots
            .map((slot) => `${slot.startTime} - ${slot.endTime}`)
            .join(", "),
          Category: data.info.venue_id.category,
          Payment: `${data.info.total_price}`,
          Date: data.info.date,
          Status: data.info.paymentState,
        }))
      : "";

    const coachCsvData = transformedBookings
      ? transformedBookings.map((data) => ({
          "User name": `${data.user_first_name} ${data.user_last_name}`,
          "User mobile": data.mobile,
          "Coach name": `${data.first_name} ${data.last_name}`,
          Category: data.package_type,
          Date: data.date,
          Status: data.payment_state,
        }))
      : "";

    if (selectedItem == "Coach") {
      setCsvData(coachCsvData);
    } else {
      setCsvData(venueCsvData);
    }
  }, []);

  const updateStatus = async (status, id) => {
    const bookingId = id;

    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to update the status?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel",
      });

      if (confirmation.isConfirmed) {
        setVerifyStatus(status);

        const loadingSwal = Swal.fire({
          title: "Updating status...",
          text: "Please wait while we update the booking status.",
          icon: "info",
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch(
          `${API_URL}/verify/booking/status/${bookingId}/${status}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data?.success) {
          // Close loader and show success message
          loadingSwal.close();
          Swal.fire(
            "Success!",
            "Booking status updated successfully.",
            "success"
          );
          fetchData();
          fetchCoachesBooking();
          fetchTrainerBooking();
        } else {
          // Close loader and show error message
          loadingSwal.close();
          Swal.fire("Error", "Failed to update booking status.", "error");
        }
      } else {
        Swal.fire("Cancelled", "No changes were made.", "info");
      }
    } catch (error) {
      
      Swal.fire(
        "Error",
        "An error occurred while updating the booking status.",
        "error"
      );
    }
  };

  return (
    <>
      {listType == "dashboard" ? (
        <h3 className="mb-4 title">Recent Booking</h3>
      ) : (
        <h3 className="mb-4 title">Bookings</h3>
      )}

      <div className="cnt">
        <Form.Group as={Row} className="mb-3">
          {/* {listType != "dashboard" && ( */}
          <Col xs={12} sm={6}>
            <Form.Control
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchInputChange}
            />
          </Col>
          {/* )} */}
          <Col sm={6} className="d-flex justify-content-end align-items-center">
            <CSVLink data={csvData} filename={"Bookings_list.csv"}>
              <button className="down-button my-0">Download</button>
            </CSVLink>

            {isSuperAdmin && (
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedItem ? selectedItem : "Venue"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Venue">Venue</Dropdown.Item>
                  <Dropdown.Item eventKey="Coach">Coach</Dropdown.Item>
                  <Dropdown.Item eventKey="Personal Trainer">
                    Trainer
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
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
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
              <p>Loading...</p>
            </div>
          ) : selectedItem === "Venue" ? (
            <div>
              <Table className="custom-table admin-bookings-table">
                <thead>
                  <tr>
                    <th style={{ width: "7%" }}>S.No.</th>
                    <th style={{ width: "25%" }}>
                      User Name{" "}
                      {/* <Popover
                        placement="bottom"
                        title="Filter by User Name"
                        content={
                          <Input
                            placeholder="Search..."
                            onChange={(e) =>
                              handleColumnFilter(
                                "info.user_id.first_name",
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
                    {listType == "dashboard" && (
                      <th style={{ width: "10%" }}>Mobile</th>
                    )}
                    <th style={{ width: "25%" }}>
                      Venue Name{" "}
                      {/* <Popover
                        placement="bottom"
                        title="Filter by Venue Name"
                        content={
                          <Input
                            type="date"
                            onChange={(e) =>
                              handleColumnFilter("start_date", e.target.value)
                            }
                          />
                        }
                        trigger="click"
                      >
                        <FilterOutlined style={{ cursor: "pointer" }} />
                      </Popover> */}
                    </th>
                    {listType != "dashboard" && (
                      <th style={{ width: "13%" }}>
                        Slot{" "}
                        {/* <Popover
                          placement="bottom"
                          title="Filter by Slot"
                          content={
                            <Input
                              type="date"
                              onChange={(e) =>
                                handleColumnFilter("end_date", e.target.value)
                              }
                            />
                          }
                          trigger="click"
                        >
                          <FilterOutlined style={{ cursor: "pointer" }} />
                        </Popover> */}
                      </th>
                    )}

                    <th style={{ width: "10%" }}>Category</th>
                    <th style={{ width: "10%" }}>Payment</th>

                    <th style={{ width: "10%" }}>Date</th>
                    <th style={{ width: "10%" }}>
                      Status{" "}
                      {/* <Popover
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
                      </Popover> */}
                    </th>
                    <th style={{ width: "10%" }}>Confirm</th>
                    <th style={{ width: "10%" }}>Refund</th>
                    {/* {listType != "dashboard" && (
                  <th style={{ width: "7%" }}>Action</th>
                )} */}
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((row, index) => {
                    const slotTimesArray = row.slots.map(
                      (slot) => `${slot?.startTime} to ${slot?.endTime}`
                    );
                    return (
                      <tr key={index}>
                        <td>{index + 1 + indexOfFirstItem}</td>
                        <td className="admin-booking-user">
                          {row?.info?.user_id?.first_name}{" "}
                          {row?.info?.user_id?.last_name}
                        </td>
                        {listType == "dashboard" && (
                          <td>{row.info.user_id.mobile}</td>
                        )}
                        <td className="admin-booking-venue">{row.info.venue_id.name}</td>
                        {listType != "dashboard" && (
                          <td className="admin-booking-slots">{slotTimesArray.join(", ")}</td>
                        )}
                        <td>{row.info.venue_id.vendor_type}</td>
                        <td>{row.info.total_price}</td>
                        <td>{formatDate(row.info.date)}</td>
                        <td
                          className="admin-booking-status"
                          style={{
                            color:
                              row.info.cancellation_status === 1
                                ? "#ff0000"
                                : row.info.paymentState === "COMPLETED"
                                ? "#4fd104"
                                : "#ff0000",
                            fontWeight: "bold",
                          }}
                        >
                          {(() => {
                            if (row.info.cancellation_status === 1) {
                              return "CANCELLED";
                            } else {
                              return row.info.paymentState;
                            }
                          })()}
                        </td>
                        <td className="admin-booking-actions">
                          <div>
                            {(() => {
                              if (row.info.verification_status === 0) {
                                return "Pending";
                              } else if (row.info.verification_status === 1) {
                                return "Accepted";
                              } else if (row.info.verification_status === 2) {
                                return "Rejected";
                              }
                            })()}
                          </div>
                          {row.info.cancellation_status !== 1 &&
                            row.info.verification_status === 0 && (
                              <div className="d-flex">
                                <CheckOutlined
                                  className="edit_icon"
                                  onClick={() => updateStatus(1, row.info._id)}
                                />
                                <CloseOutlined
                                  className="delete_icon"
                                  onClick={() => updateStatus(2, row.info._id)}
                                />
                              </div>
                            )}
                        </td>
                        <td className="admin-booking-actions">
                          {row.info.cancellation_status === 1 ? (
                            <span className="badge bg-success" style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "6px" }}>
                              Refunded
                            </span>
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => openrefunedmodel(row.info._id)}
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <Table className="custom-table admin-bookings-table">
              <thead>
                <tr>
                  <th style={{ width: "7%" }}>S.No.</th>
                  <th style={{ width: "25%" }}>
                    User Name{" "}
                    {/* <Popover
                          placement="bottom"
                          title="Filter by User Name"
                          content={
                            <Input
                              placeholder="Search..."
                              onChange={(e) =>
                                handleColumnFilter(
                                  "info.user_id.first_name",
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
                  <th style={{ width: "25%" }}>
                    {selectedItem === "Coach" ? `Coach Name ` : `Trainer Name `}
                    {/* <Popover
                          placement="bottom"
                          title="Filter by Venue Name"
                          content={
                            <Input
                              type="date"
                              onChange={(e) =>
                                handleColumnFilter("start_date", e.target.value)
                              }
                            />
                          }
                          trigger="click"
                        >
                          <FilterOutlined style={{ cursor: "pointer" }} />
                        </Popover> */}
                  </th>
                  {/* <th style={{ width: "13%" }}>
                        Slot{" "}
                        <Popover
                          placement="bottom"
                          title="Filter by Slot"
                          content={
                            <Input
                              type="date"
                              onChange={(e) =>
                                handleColumnFilter("end_date", e.target.value)
                              }
                            />
                          }
                          trigger="click"
                        >
                          <FilterOutlined style={{ cursor: "pointer" }} />
                        </Popover>
                      </th> */}
                  <th style={{ width: "10%" }}>Starting Date</th>
                  <th style={{ width: "10%" }}>Payment</th>
                  <th style={{ width: "10%" }}>
                    Status{" "}
                    {/* <Popover
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
                        </Popover> */}
                  </th>
                  <th style={{ width: "10%" }}>confirm</th>
                  <th style={{ width: "10%" }}>Refund</th>
                  {/* {listType != "dashboard" && (
                  <th style={{ width: "7%" }}>Action</th>
                )} */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(bookingData) && bookingData.length > 0
                  ? bookingData.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1 + indexOfFirstItem}</td>
                        <td>
                          {row.user_first_name} {row.user_last_name}
                        </td>
                        <td>
                          {row.first_name} {row.last_name}
                        </td>
                        {listType != "dashboard" &&
                          // <td>{slotTimesArray.join(", ")}</td>
                          ""}
                        <td>{formatDate(row.startDate)}</td>
                        <td>{row.payment}</td>
                        <td
                          style={{
                            color:
                              row.cancellation_status === 1
                                ? "#ff0000"
                                : row.payment_state === "COMPLETED"
                                ? "#4fd104"
                                : "#ff0000",
                            fontWeight: "bold",
                          }}
                        >
                          {row.cancellation_status === 1
                            ? "CANCELLED"
                            : row.payment_state}
                        </td>
                        {undefined}
                        <td>
                          {row.verification_status === 0 && (
                            <div className="d-flex">
                              <CheckOutlined
                                className="edit_icon"
                                onClick={() => updateStatus(1, row.id)}
                              />
                              <CloseOutlined
                                className="delete_icon"
                                onClick={() => updateStatus(2, row.id)}
                              />
                            </div>
                          )}
                          <div>
                            {(() => {
                              if (row.verification_status === 0) {
                                return "Pending";
                              } else if (row.verification_status === 1) {
                                return "Accepted";
                              } else if (row.verification_status === 2) {
                                return "Rejected";
                              }
                            })()}
                          </div>
                        </td>
                        <td>
                          {row.cancellation_status === 1 ? (
                            <span className="badge bg-success" style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "6px" }}>
                              Refunded
                            </span>
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => openrefunedmodel(row.id)}
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  : "no data"}
              </tbody>
            </Table>
          )}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Refund</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to refund this transaction?</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Refund Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="btn btn-danger">
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Pagination
          pageSizeOptions={["5", "10", "20", "50"]}
          showSizeChanger={true}
          showQuickJumper={true}
          total={data ? data.length : ""}
          pageSize={itemsPerPage}
          current={currentPage}
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

export default BookingList;
