import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Table, Form, Row, Col } from "react-bootstrap"; // Import Bootstrap components
import { ColorRing } from "react-loader-spinner";
import { CSVLink } from "react-csv";
import { API_URL } from "../utils/ApiUrl";
import { Pagination, Tooltip } from "antd";
import { Popover, Input, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "../Style/List.css";

function EventList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [csvData, setCsvData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    formatCsvData();
  }, [data]);

  const fetchData = async () => {
    try {
      // Replace the URL with your actual API endpoint
      const apiUrl = `${API_URL}/event/fetchAll?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      const response = await fetch(apiUrl,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      console.log("result.....->>>", result);
      if (response.ok) {
        setData(result.data);
      } else {
        console.error("Failed to fetch data:", result.error);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const formatCsvData = () => {
    const formattedData = data.map((row) => ({
      Name: row.event_name,
      "Start At": row.start_date,
      "End At": row.end_date,
      Location: row.location,
      Status: row.status ? "Active" : "Inactive",
    }));

    setCsvData(formattedData);
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
            return row.status === true;
          } else if (value === "inactive") {
            return row.status === false;
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

    setIsPopoverOpen(false); // Close popover after filtering
  };

  const { Option } = Select;

  const handleInfo = async (row) => {
    console.log("Info clicked for row:", row);
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/event/get/${row._id}`);
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
      } else {
        console.error("Failed to fetch detail data:", detailResult.error);
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
    }
  };

  const handleEdit = async (row) => {
    console.log("Edit clicked for row:", row);
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
        console.log("event name updated successfully");
      } else {
        const responseData = await response.json();
        console.error(
          "Failed to update event name:",
          responseData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating event name:", error);
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
        Swal.fire(
          "Deactivated!",
          "Your Profile has been Deactivated.",
          "success"
        );
        // Update your state or refetch data to reflect the deletion
        fetchData();
      } else {
        console.error("Failed to delete event:", response.statusText);
        Swal.fire("Error", "Failed to delete event.", "error");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    .filter((row) =>
      row.event_name.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <h3 className="mb-4 title">Events</h3>
      <div className="cnt">
        <Form.Group as={Row} className="mb-3">
          <Col xs={12} sm={6}>
            <Form.Control
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchInputChange}
            />
          </Col>
          <Col sm={6} className="d-flex justify-content-end align-items-center">
            <div className="mr-2">
              <Link to="/event/add">
                <button className="add-button">Add Events</button>
              </Link>
            </div>
            <div>
              <CSVLink data={csvData} filename={"user_list.csv"}>
                <button className="down-button">Download</button>
              </CSVLink>
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
                  <th style={{ width: "32%" }}>
                    Name{" "}
                    <Popover
                      placement="bottom"
                      title="Filter by Event Name"
                      content={
                        <Input
                          placeholder="Search..."
                          onChange={(e) =>
                            handleColumnFilter("event_name", e.target.value)
                          }
                        />
                      }
                      trigger="click"
                    >
                      {/* <FilterOutlined style={{ cursor: "pointer" }} /> */}
                    </Popover>
                  </th>
                  <th style={{ width: "10%" }}>
                    Start At{" "}
                    <Popover
                      placement="bottom"
                      title="Filter by Start Date"
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
                    </Popover>
                  </th>
                  <th style={{ width: "10%" }}>
                    End At{" "}
                    {/* <Popover
                      placement="bottom"
                      title="Filter by End Date"
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

                  <th style={{ width: "10%" }}>Location</th>
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
                  <th style={{ width: "7%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{row.event_name}</td>
                    <td>{formatDate(row.start_date)}</td>
                    <td>{formatDate(row.end_date)}</td>
                    <td>{row.location}</td>
                    <td
                      style={{
                        color: row.status ? "#4fd104" : "#ff0000",
                        fontWeight: "bold",
                      }}
                    >
                      {row.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <div style={{ display: "flex" }}>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Event Name: ${row.event_name}\nLocation: ${
                                row.location
                              }\nStart Date: ${formatDate(
                                row.start_date
                              )}\nEnd Date: ${formatDate(
                                row.end_date
                              )}\nDescription: ${row.description}`}
                            </span>
                          }
                          arrow
                        >
                          <InfoOutlined
                            className="info_icon"
                            onClick={() => handleInfo(row)}
                          />
                        </Tooltip>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                             {`Edit`}
                            </span>
                          }
                          arrow
                        >
                        <Link
                          to={`/event/edit/${row._id}`}
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
                            {`Delete`}
                            </span>
                          }
                          arrow
                        >
                        <DeleteOutlined
                          className="delete_icon"
                          onClick={() => handleDelete(row)}
                        />
                        </Tooltip>
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
            setCurrentPage(1); // Reset to first page when changing page size
            setItemsPerPage(size); // Update items per page
          }}
        />
      </div>
    </>
  );
}

export default EventList;
