import React, { useState, useEffect } from "react";
import { ColorRing} from "react-loader-spinner";
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.css"; 
import { Table, Form, Row, Col } from "react-bootstrap";
import { API_URL } from "../utils/ApiUrl";
import { Pagination } from 'antd';
import { Popover, Input} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from "axios";

function Enquirylist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [previousData, setPreviousData] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const interval = setInterval(fetchData, 3000); // Fetch data every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array to run only once on component mount

  useEffect(() => {
    checkNewEnquiry();
  }, [data, searchQuery]);

  const fetchData = async () => {
    try {
      const apiUrl = `${API_URL}/contactUs/fetchAll?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setLoading(false);
      } else {
        
        setLoading(false);
      }
    } catch (error) {
      
      setLoading(false);
    }
  };

  const checkNewEnquiry = () => {
    // Check if searchQuery is empty to avoid showing the alert during active search
    if (previousData.length > 0 && data.length > previousData.length && searchQuery === '') {
      // No longer showing the alert
    }
    setPreviousData(data);
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

  const handleResolve = async (row) => {
    const confirmation = await Swal.fire({
      title: `Resolve ${row.ticket_number || "this enquiry"}?`,
      text: "This marks the enquiry as resolved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Resolve",
    });
    if (!confirmation.isConfirmed) return;
    try {
      await axios.put(
        `${API_URL}/contactUs/${row._id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchData();
      Swal.fire("Resolved", "The enquiry has been marked as resolved.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Unable to resolve this enquiry.", "error");
    }
  };

  const handleColumnFilter = (columnName, value) => {
    setCurrentPage(1); 
    setSearchQuery('');
    // Handle filtering for other columns if needed
    const filteredData = data.filter((row) =>
      row[columnName].toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
    setIsPopoverOpen(false); // Close popover after filtering
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data
    .filter((row) =>
      [row.ticket_number, row.first_name, row.last_name, row.full_name, row.email, row.mobile, row.subject]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <h3 className="mb-4 title">Enquiries</h3>
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
                  <th style={{ width: "6%" }}>S.No.</th>
                  <th style={{ width: "13%" }}>Ticket No.</th>
                  <th style={{ width: "13%" }}>
                  Name{' '}
                  <Popover
                      placement="bottom"
                      title="Filter by First Name"
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('first_name', e.target.value)} />}
                      trigger="click"
                    >
                      {/* <FilterOutlined style={{ cursor: 'pointer' }} /> */}
                    </Popover>
                  </th>
                  <th style={{ width: "14%" }}>
                  Email{' '}
                  {/* <Popover
                      placement="bottom"
                      title="Filter by Email"
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('email', e.target.value)} />}
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: 'pointer' }} />
                    </Popover> */}
                  </th>
                  <th style={{ width: "12%" }}>
                  Phone Number{' '}
                  {/* <Popover
                      placement="bottom"
                      title="Filter by Phone Number  "
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('mobile', e.target.value)} />}
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: 'pointer' }} />
                  </Popover> */}
                  </th>
                  <th style={{ width: "12%" }}>
                  Subject{' '}
                  {/* <Popover
                      placement="bottom"
                      title="Filter by Subject"
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('subject', e.target.value)} />}
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: 'pointer' }} />
                  </Popover> */}
                  </th>
                  <th style={{ width: "14%" }}>Comment</th>
                  <th style={{ width: "8%" }}>Status</th>
                  <th style={{ width: "8%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td><strong>{row.ticket_number || "—"}</strong></td>
                
                    <td>
  {row.full_name ? 
    row.full_name : 
    (row.first_name ? row.first_name + (row.last_name ? ' ' + row.last_name : '') : 'No name available')}
</td>

                    <td>{row.email}</td>
                    <td>{row.mobile}</td>
                    <td>{row.subject}</td>
                    <td>
                      {(row.comments || "").length > 30 ? (
                        <>
                          {`${row.comments.substring(0, 30)}... `}
                          <span
                            style={{
                              color: "black",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                            onClick={() => {
                              Swal.fire({
                                title: "Comment",
                                text: row.comments,
                              });
                            }}
                          >
                            View More
                          </span>
                        </>
                      ) : (
                        row.comments || "—"
                      )}
                    </td>
                    <td>
                      <span className={`badge ${row.status === "Resolved" ? "bg-success" : "bg-warning text-dark"}`}>
                        {row.status || "Open"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        disabled={row.status === "Resolved"}
                        onClick={() => handleResolve(row)}
                      >
                        {row.status === "Resolved" ? "Resolved" : "Resolve"}
                      </button>
                    </td>
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
          total={data.length}
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

export default Enquirylist;
