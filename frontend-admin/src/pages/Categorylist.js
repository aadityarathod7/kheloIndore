import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DownloadOutlined, EditOutlined, DeleteOutlined, InfoOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Table, Form, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import '../Style/List.css';
import { CSVLink } from 'react-csv';
import { Pagination, Tooltip } from 'antd';
import { API_URL } from '../utils/ApiUrl';
import { ColorRing } from 'react-loader-spinner';
import { Popover, Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

function Categorylist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [csvData, setCsvData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [pdfContent, setPdfContent] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    formatCsvData();
  }, [data]);

  const fetchData = async () => {
    try {
      const apiUrl = `${API_URL}/category/fetch?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`;
      const response = await fetch(apiUrl,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (response.ok) {
        setData(result.categories);
      } else {
        
      }

      setLoading(false);
    } catch (error) {
      
      setLoading(false);
    }
  };

  const formatCsvData = () => {
    const formattedData = data.map(row => ({
      "category": row.category_name,
      "Parent Category": row.parent_category_name,
      "Status": row.status ? "Active" : "Inactive"
    }));

    setCsvData(formattedData);
  };

  const generatePdfContent = (rowData) => (
    <Document>
      <Page>
        <Text>Category: {rowData.category_name}</Text>
        <Text>Parent Category: {rowData.parent_category_name}</Text>
      </Page>
    </Document>
  );


  const handleColumnFilter = (columnName, value) => {
    setCurrentPage(1); 
    setSearchQuery(''); 
    if (columnName === 'status') {
      if (value === 'all') {
        fetchData();
      } else {
        const filteredData = data.filter((row) => {
          if (value === 'active') {
            return row.status === true;
          } else if (value === 'inactive') {
            return row.status === false;
          }
          return true; 
        });
        setData(filteredData);
      }
    } 
    else {
      // Handle filtering for other columns if needed
      const filteredData = data.filter((row) =>
        row[columnName].toLowerCase().includes(value.toLowerCase())
      );
      setData(filteredData);
    }

    setIsPopoverOpen(false); // Close popover after filtering
  };

  const { Option } = Select;  
  

  const handlePdf = async (row) => {
    
    try {
      // Fetch detail data
      const detailResponse = await fetch(`${API_URL}/category/fetch-ind/${row._id}`);
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
      const detailResponse = await fetch(`${API_URL}/category/fetch-ind/${row._id}`);
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
      const response = await fetch(`${API_URL}/category/update/${row._id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category_name: row.category_name,
          parent_category_name: row.parent_category_name,
          status: row.status
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
      const apiUrl = `${API_URL}/category/delete/${row._id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        Swal.fire('Deactivated!', 'Category has been Deactivated.', 'success');
        fetchData();
      } else {
        
        Swal.fire('Error', 'Failed to delete category.', 'error');
      }
    } catch (error) {
      
      Swal.fire('Error', 'An error occurred while deleting the category.', 'error');
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
  const currentItems = data && data
    .filter((row) => row.category_name.toLowerCase().includes(searchText.toLowerCase()))
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <h3 className="mb-4 title">Categories</h3>
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

          <Col sm={6} className="d-flex justify-content-end ">
            <div>
              <Link to="/categories/add">
                <button className="add-button mr-2">Add Category</button>
              </Link>
              <CSVLink data={csvData} filename={"category_list.csv"}>
                <button
                  className="down-button"
                >
                  Download
                </button>
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
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />
              <p>Loading...</p>
            </div>
          ) : (
            <Table className='custom-table'>
              <thead>
                <tr>
                  <th style={{ width: '7%' }}>S.No.</th>
                  <th style={{ width: '32%' }}>
                  Category{' '}
                  <Popover
                      placement="bottom"
                      title="Filter by Category"
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('category_name', e.target.value)} />}
                      trigger="click"
                    >
                      {/* <FilterOutlined style={{ cursor: 'pointer' }} /> */}
                    </Popover>
                  </th>
                  <th style={{ width: '32%' }}>
                  Parent Category{' '}
                  <Popover
                      placement="bottom"
                      title="Filter by parent category"
                      content={<Input placeholder="Search..." onChange={(e) => handleColumnFilter('parent_category_name', e.target.value)} />}
                      trigger="click"
                    >
                      {/* <FilterOutlined style={{ cursor: 'pointer' }} /> */}
                    </Popover>
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
                      {/* <FilterOutlined style={{ cursor: 'pointer' }} /> */}
                    </Popover>
                  </th>
                  <th style={{ width: '15%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.map((row, index) => (
                  <tr key={row._id}>
                    <td>{index + 1 + indexOfFirstItem}</td>
                    <td>{row.category_name}</td>
                    <td>{row.parent_category_name}</td>
                    <td style={{ color: row.status ? "#4fd104" : "#ff0000", fontWeight: "bold" }}>
                      {row.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <div style={{ display: 'flex' }}>
                      <Tooltip
                        title={
                          <span style={{ whiteSpace: 'pre-line' }}>
                            {`Download`}
                          </span>
                        }
                        arrow
                      >
                      <PDFDownloadLink
                            document={generatePdfContent(row)}
                            fileName={`categorylist_details.pdf`}
                            style={{marginRight: '5%'}}
                          >
                            <DownloadOutlined
                              className='download_icon'
                              onClick={() => handlePdf(row)}
                            />
                          </PDFDownloadLink>
                          </Tooltip>

                        <Tooltip title={
                          <span style={{ whiteSpace: 'pre-line' }}>
                          {`Category: ${row.category_name}\nParent Category: ${row.parent_category_name}`}
                          </span>
                        }
                        arrow
                          >
                          <InfoOutlined
                           className='info_icon'
                            onClick={() => handleInfo(row)}
                          />
                        </Tooltip>
                        <Tooltip
                        title={
                          <span style={{ whiteSpace: 'pre-line' }}>
                            {`Edit`}
                          </span>
                        }
                        arrow
                      >
                        <Link to={`/categories/edit/${row._id}`} style={{ marginLeft: '1%' }}>
                          <EditOutlined
                            className='edit_icon'
                            onClick={() => handleEdit(row)}
                          />
                        </Link>
                        </Tooltip>
                       <Tooltip
                        title={
                          <span style={{ whiteSpace: 'pre-line' }}>
                            {`Delete`}
                          </span>
                        }
                        arrow
                      >
                     <DeleteOutlined
                          className='delete_icon'
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
          pageSizeOptions={["5", "10", "20", "50"]}
          showSizeChanger={true}
          showQuickJumper={true}
          total={data ? data.length : 0}
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

export default Categorylist;
