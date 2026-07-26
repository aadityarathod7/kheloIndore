import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DownloadOutlined, EditOutlined, DeleteOutlined, InfoOutlined, AppstoreAddOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Table, Form, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
import { ColorRing } from 'react-loader-spinner';
import '../Style/List.css';
import { Pagination, Tooltip } from 'antd';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import { CSVLink } from 'react-csv';
import { API_URL } from '../utils/ApiUrl';
import { Popover, Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from "axios";


function Coachlist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [csvData, setCsvData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [showAcceptReject, setShowAcceptReject] = useState({});
  const [isverified, setIsverified] = useState("");

  const [filterStatus, setFilterStatus] = useState('all');


  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, searchText]);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (userRole == "Super Admin") {
      setIsSuperAdmin("Super Admin");
    }
  }, [])

  useEffect(() => {
    formatCsvData();
  }, [data]);

  const fetchData = async () => {
    try {
      const apiUrl = `${API_URL}/fetch-all-coaches`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (response.ok) {
        setData(result.data);

      } else {
        console.error('Failed to fetch data:', result.error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  const formatCsvData = () => {
    if (Array.isArray(data)) {
      const formattedData = data.map(row => ({
        "First Name": row.first_name,
        "Last Name": row.last_name,
        // "Specializations": row.specializations.join(', '), // Join array to string if needed
        // "Location": `${row.location?.address || ''}, ${row.location?.city || ''}, ${row.location?.state || ''}`,
        // "Experience(yr)": row.experience,
        // "Status": row.status ? "Active" : "Inactive"
      }));

      setCsvData(formattedData);
    } else {
      console.error('Data is not an array:', data);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };


  const generatePdfContent = (rowData) => (
    <Document>
      <Page>
        <Text>First Name: {rowData.first_name}</Text>
        <Text>Last Name: {rowData.last_name}</Text>
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


  const handleActive = async (coachId) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/coach/${coachId._id}`,
        {
          status: true
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Coach Updated!",
        text: "Coach Activated successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating the coach:", error);
    }
  }


  const { Option } = Select;

  const handlePdf = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/fetch-coach/${row._id}`);
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
        setPdfContent(generatePdfContent(detailResult.data));
      } else {
        console.error('Failed to fetch detail data:', detailResult.error);
      }
    } catch (error) {
      console.error('Error fetching detail data:', error);
    }
  };


  const handleInfo = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/fetch-coach/${row._id}`);
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
      } else {
        console.error('Failed to fetch detail data:', detailResult.error);
      }
    } catch (error) {
      console.error('Error fetching detail data:', error);
    }
  };

  const handleEdit = async (row) => {
    try {
      const response = await fetch(`${API_URL}/update-coach/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        })
      });

      if (response.ok) {
      } else {
        const responseData = await response.json();
        console.error('Failed to update category name:', responseData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating category name:', error);
    }
  };

  const handleDelete = async (row) => {
    try {
      const apiUrl = `${API_URL}/delete-coach/${row._id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire('Deactivated!', 'Coach Profile has been Deactivated.', 'success');
        fetchData();
      } else {
        console.error('Failed to delete category:', response.statusText);
        Swal.fire('Error', 'Failed to delete category.', 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire('Error', 'An error occurred while deleting the category.', 'error');
    }
  };


  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleColumnFilter = (column, value) => {
    if (column === 'status') {
      setFilterStatus(value);
    }
  };

  const filteredData = data.filter(row => {
    // Apply status filter
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? row.status : !row.status;
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredData
    .filter(row => row.first_name.toLowerCase().includes(searchText.toLowerCase()))
    .slice(indexOfFirstItem, indexOfLastItem);


  const updateStatus = async (status, id) => {
    setIsverified(id)
    const coachId = id;
    setShowAcceptReject((prevState) => ({
      ...prevState,
      [id]: false,
    }));

    try {
      const response = await fetch(`${API_URL}/verify/coach/${coachId}/${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleIconClick = (status, coachId) => {
    Swal.fire({
      title: 'Confirm Action',
      text: `Are you sure you want to ${status === 1 ? 'accept' : 'reject'} this coach?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(status, coachId);
      } else {
        console.log('Action canceled');
      }
    });
  };


  const handleUpdateAccess = async (isAdminAccess, coachId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to update Coach admin access?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`${API_URL}/super-admin/update-admin-status`, {
          id: coachId,
          is_admin_access: isAdminAccess,
          role: "Coach"
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          Swal.fire("Success!", `Coach admin access updated successfully.`, "success");
          fetchData()
        } else {
          Swal.fire("Error", `Failed to update Coach admin access.`, "error");
        }
      } catch (error) {
        console.error(`Error updating Coach admin access:`, error);
        Swal.fire("Error", `An error occurred while updating Coach admin access.`, "error");
      }
    } else {
      // If user cancels, show a cancellation message
      Swal.fire("Cancelled", `No changes were made to Coach admin access.`, "info");
    }
  };


  console.log(data, "data")



  return (
    <>
      <h3 className="mb-4 title">Coach</h3>
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
          <Col sm={6} className="d-flex justify-content-end">
            <Link to="/coach/add">
              {
                isSuperAdmin && <button className="add-button mr-2">Add Coach</button>
              }
            </Link>
            <CSVLink data={csvData} filename={"user_list.csv"}>
              <button
                className="down-button"
              >
                Download
              </button>
            </CSVLink>
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
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />
              <p>Loading...</p>
            </div>
          ) : (
            <Table className='custom-table'>
              <thead>
                <tr>
                  <th style={{ width: '7%' }}>S.No.</th>
                  <th style={{ width: '10%' }}>
                    Name{' '}
                  </th>
                  <th style={{ width: '10%' }}>
                    Mobile Number{' '}
                  </th>
                  <th style={{ width: '10%' }}>
                    Email{' '}

                  </th>
                  <th style={{ width: '10%' }}>
                    Status{' '}
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
                  <th style={{ width: '19%' }}>Action</th>
                  <th>Confirmation</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{row.full_name ? row.full_name : (row.first_name + ' ' + row.last_name)}</td>

                    <td>{row.mobile}</td>
                    <td>{row.email}</td>
                    <td style={{ color: row.status ? "#4fd104" : "#ff0000", fontWeight: "bold" }}>
                      {row.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <div style={{ display: 'flex' }}>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: "pre-line" }}>
                              {`Edit`}
                            </span>
                          }
                          arrow
                        >
                          <Link to={`/coaches/update/${row._id}`} style={{ marginRight: '2%' }}>
                            <EditOutlined
                              className='edit_icon'
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
                          <Link to={`/coaches/slots-add/${row._id}`}>
                            <AppstoreAddOutlined
                              className='edit_icon'
                            />
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
                    <td>

                      {isSuperAdmin && (
                        <>
                          {row.is_admin_access === 2 && (
                            <button
                              className="submit-button p-1"
                              onClick={() => handleUpdateAccess(1, row._id)}
                            >
                              Reverify
                            </button>
                          )}

                          {row.is_admin_access === 0 && (
                            <div className="d-flex">
                              <CheckOutlined className='edit_icon' onClick={() => handleUpdateAccess(1, row._id)} />
                              <CloseOutlined className='delete_icon' onClick={() => handleUpdateAccess(2, row._id)} />
                            </div>
                          )}
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
          total={data.length} // Total number of items in data
          current={currentPage} // Current page
          pageSize={itemsPerPage} // Items per page
          pageSizeOptions={["10", "20", "30"]} // Page size options
          onChange={handlePaginationChange} // Handle page change
          showSizeChanger={true} // Allow user to change page size
          onShowSizeChange={(current, size) => setItemsPerPage(size)} // Handle size change
        />
      </div>
    </>
  );
}

export default Coachlist;
