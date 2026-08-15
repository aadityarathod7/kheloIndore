import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DownloadOutlined, EditOutlined, DeleteOutlined, InfoOutlined, AppstoreAddOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';
import { Pagination, Tooltip } from 'antd';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import '../Style/List.css';
import { API_URL } from '../utils/ApiUrl';
import { Popover, Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';


function VenueList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [csvData, setCsvData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [detailData, setDetailData] = useState(null);
  const [pdfContent, setPdfContent] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [showAcceptReject, setShowAcceptReject] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfirmation, setFilterConfirmation] = useState('all');


  const userRole = localStorage.getItem('role');
  
  useEffect(() => {
    if (userRole == "Super Admin") {
      setIsSuperAdmin("Super Admin");

      // setShowAcceptReject(false);
    }
  }, [])


  // let role = "Super Admin";
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const decode = jwt_decode(token)
    // id = decode.userID
    // role = decode.role
    fetchData();

  }, [currentPage, searchQuery]);




  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('id');
      const role = localStorage.getItem('role');
      let apiUrl;
      if (role === "Super Admin") {
        apiUrl = `${API_URL}/venue/getVenue?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      } else if (role === "Venue Admin") {

        if (userId) {
          apiUrl = `${API_URL}/venue/get/admin-id/${userId}`;
        } else {
          throw new Error("User ID is not defined");
        }
        // apiUrl = `${API_URL}venue/get/admin-id/${userId}?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      // return

      if (response.ok) {
        setRecords(result.venue); // Update to setRecords(result.venue)
      } else {
        
      }

      setLoading(false);
    } catch (error) {
      
      setLoading(false);
    }
  };




  const generatePdfContent = (rowData) => (
    <Document>
      <Page>
        <Text>Venue Name: {rowData.name}</Text>
        <Text>Address: {rowData.address}</Text>
        <Text>State: {rowData.state}</Text>
        <Text>City: {rowData.city}</Text>
        <Text>Zipcode: {rowData.zipcode}</Text>
        <Text>Amenities: {rowData.amenities}</Text>
        <Text>Activities: {rowData.activities}</Text>
        <Text>Category: {rowData.category}</Text>
      </Page>
    </Document>
  );


  const handlePdf = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/user/fetch-user-by-id/${row._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
        setPdfContent(generatePdfContent(detailResult.data));
      } else {
        
      }
    } catch (error) {
      
    }
  };

  // const filteredData = records?.filter(row => {
  //   if (filterStatus === 'all') return true;
  //   return filterStatus === 'active' ? row.status : !row.status;
  // });

  const filteredData = records?.filter(row => {
    // const statusMatch = filterStatus === 'all' || filterStatus === 'active' ? row.status : !row.status;
    const statusMatch = filterStatus === 'all' || (filterStatus === 'active' ? row.status : !row.status);
    const confirmationMatch = filterConfirmation === 'all' ||
      (filterConfirmation === 'Pending' && row.verification_status === 0) ||
      (filterConfirmation === 'Accepted' && row.verification_status === 1) ||
      (filterConfirmation === 'Rejected' && row.verification_status === 2);
    return statusMatch && confirmationMatch;
  });
  
  const handleColumnFilter = (column, value) => {
    if (column === 'status') {
      setFilterStatus(value);
    }
  };


  const handleColumnApprovedFilter = (column, value) => {
    if (column === 'Confirmation') {
      setFilterConfirmation(value);
    }
  };

  const { Option } = Select;

  const formatCsvData = () => {
    const formattedData = filteredData?.map(row => ({
      "Venue Name": row.name,
      "Address":row.address,
      "Status": row.status ? "Active" : "Inactive",
      "Confirmation": row.verification_status === 0 ? "Pending" : row.verification_status === 1 ? "Accepted" : "Rejected",
    }));

    setCsvData(formattedData);
  };

  // useEffect(() => {
  //   formatCsvData();
  // }, []);

  const handleInfo = async (row) => {
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/venue/individual/${row._id}`);
      const detailResult = await detailResponse.json();
      if (detailResponse.ok) {
        setDetailData(detailResult.data);
        
      } else {
        
      }
    } catch (error) {
      
    }
  };

  const handleEdit = async (venue) => {
    try {
      const response = await fetch(`${API_URL}/venue/individual/${venue._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: venue.name,
          address: venue.address,
          state: venue.state,
          zipcode: venue.zipcode,
          city: venue.city,
          amenities: venue.amenities,
          category: venue.category,
          activities: venue.activities,
          images: venue.images,
          status: venue.status
        })
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
      const apiUrl = `${API_URL}/venue/delete/${row._id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire('Deactivated!', 'Venue has been Deactivated.', 'success');
        fetchData();
      } else {
        
        Swal.fire('Error', 'Failed to delete venue.', 'error');
      }
    } catch (error) {
      
      Swal.fire('Error', 'An error occurred while deleting the venue.', 'error');
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
  // const currentVenues = records.slice(indexOfFirstItem, indexOfLastItem);

  const currentVenues = filteredData
    ?.filter((row) => {
      
      return row?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) &&
        (searchQuery === '' ||
          (searchQuery === 'active' && row.status === true) ||
          (searchQuery === 'inactive' && row.status === false)
        );
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  




  // const filteredVenues = currentVenues.filter((venue) =>
  //   venue._id.includes(idFilter) &&
  //   venue.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
  //   venue.category.toLowerCase().includes(categoryFilter.toLowerCase()) &&
  //   (statusFilter === '' || (statusFilter === 'Active' && venue.status) || (statusFilter === 'Inactive' && !venue.status))
  // );
  const updateStatus = async (status, id) => {
    const venueId = id;
    setShowAcceptReject((prevState) => ({
      ...prevState,
      [id]: false,
    }));
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify/venue/${venueId}/${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      fetchData();
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      
    }
  };


  const handleIconClick = (status, venueId) => {
    Swal.fire({
      title: 'Confirm Action',
      text: `Are you sure you want to ${status === 1 ? 'accept' : 'reject'} this venue?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(status, venueId);
      } else {
        
      }
    });
  };


  const handleActive = async (venue) => {
    try {
      const response = await axios.patch(
        `${API_URL}/venues/${venue._id}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Venue activated successfully",
        });
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add venue",
      });
    }
  }




  return (
    <>
      <h3 className="mb-4 title">Venues</h3>
      <div className="cnt">
        <Form.Group as={Row} className="mb-3">
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchInputChange}
              className="search-input"
            />
          </Col>
          <Col sm={6} className="d-flex justify-content-end">

            <Link to="/venues/add">
              <button className="add-button mr-2">Add Venue</button>
            </Link>
            <CSVLink data={csvData} filename={"venue_list.csv"}>
              <button className="down-button" onClick={formatCsvData}>Download</button>
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
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
              <p>Loading...</p>
            </div>
          ) : (
            <Table className='custom-table'>
              <thead>
                <tr>
                  <th style={{ width: '7%' }}>S.No.
                  </th>
                  <th style={{ width: '12%' }}>
                    Venue Name{' '}

                  </th>
                  <th style={{ width: '22%' }}>
                    Address{' '}
                  </th>
                  <th style={{ width: '10%' }}>
                    Status{' '}
                    <Popover
                      placement="bottom"
                      content={
                        <Select
                          placeholder="Select status"
                          onChange={(value) => handleColumnFilter('status', value)} // Trigger column filter
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
                  <th style={{ width: '15%' }}>Action</th>
                  {/* {
                  isSuperAdmin && */}
                  <th style={{ width: '10%' }}>Confirmation
                    <Popover
                      placement="bottom"
                      content={
                        <Select
                          placeholder="Select status"
                          onChange={(value) => handleColumnApprovedFilter('Confirmation', value)} // Trigger column filter
                          style={{ width: 190 }}
                        >
                          <Option value="all">All</Option>
                          <Option value="Accepted">Accepted</Option>
                          <Option value="Pending">Pending</Option>
                          <Option value="Rejected">Rejected</Option>
                        </Select>
                      }
                      trigger="click"
                    >
                      <FilterOutlined style={{ cursor: 'pointer' }} />
                    </Popover>
                  </th>
                  {/* } */}
                </tr>
              </thead>
              <tbody>
                {currentVenues && currentVenues.map((venue, index) => (
                  <tr key={venue._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td><div>{venue.name}</div><small className="text-muted">{venue.provider_public_id || "ID pending"}</small></td>
                    {/* <td>{venue.category}</td> */}
                    <td>{venue.address}</td>
                    <td style={{ color: venue.status ? "#4fd104" : "#ff0000", fontWeight: "bold" }}>
                      {venue.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: 'pre-line' }}>
                              {`Edit`}
                            </span>
                          }
                          arrow
                        >
                          <Link to={`/venues/edit/${venue._id}`}>
                            <EditOutlined
                              className='edit_icon'
                              onClick={() => handleEdit(venue)}
                            />
                          </Link>
                        </Tooltip>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: 'pre-line' }}>
                              {`Add Slots`}
                            </span>
                          }
                          arrow
                        >
                          <Link to={`/venues/add/slots/${venue._id}`}>
                            <AppstoreAddOutlined
                              className='edit_icon'
                            />
                          </Link>
                        </Tooltip>
                        {
                          venue.status ?
                            <Tooltip title={`Deactivate`} arrow>
                              {undefined}
                              <DeleteOutlined
                                className="delete_icon"
                                onClick={() => handleDelete(venue)}
                              />
                            </Tooltip>
                            :
                            <Tooltip title={`Activate`} arrow>
                              <ReloadOutlined
                                className="delete_icon"
                                onClick={() => handleActive(venue)}
                              />
                            </Tooltip>
                        }
                      </div>
                    </td>
                    <td>

                      <div>
                        {(() => {
                          if (venue.verification_status === 0) {
                            return "Pending";
                          } else if (venue.verification_status === 1) {
                            return "Accepted";
                          } else if (venue.verification_status === 2) {
                            return "Rejected";
                          }
                        })()}
                      </div>

                      {isSuperAdmin && (showAcceptReject[venue._id] ?? (venue.verification_status === 0)) && (
                        <div className="d-flex">
                          <CheckOutlined
                            className='edit_icon'
                            onClick={() => handleIconClick(1, venue._id)}
                          />
                          <CloseOutlined
                            className='delete_icon'
                            onClick={() => handleIconClick(2, venue._id)}
                          />
                        </div>
                      )}
                      {isSuperAdmin && (showAcceptReject[venue._id] ?? (venue.verification_status === 2)) && (
                        <div className="d-flex">
                          {/* <CheckOutlined
                            className='edit_icon'
                            onClick={() => handleIconClick(1, venue._id)}
                          /> */}
                          <button
                            className="submit-button p-1"
                            onClick={() => handleIconClick(1, venue._id)}
                          >Reverify</button>
                          {/* <CloseOutlined
                            className='delete_icon'
                            onClick={() => handleIconClick(2, venue._id)}
                          /> */}
                        </div>
                      )}


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
          total={records.length}
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

export default VenueList;
