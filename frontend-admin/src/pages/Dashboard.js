import React, { useState, useEffect } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Table, DatePicker } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from "axios";
import { API_URL } from '../utils/ApiUrl';
import BookingList from "../pages/Bookings"
const { RangePicker } = DatePicker;

const booking = [
  {
    title: "S.No",
    dataIndex: "key",
  },
  {
    title: "First Name",
    dataIndex: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
  },
  {
    title: "Booking Time",
    // dataIndex: "key",
  },
  {
    title: "Category",
    dataIndex: "category",
  },
  {
    title: "Booking ID",
    dataIndex: "booking_id ",
  },
  {
    title: "Role",
    dataIndex: "role",
  },
  {
    title: 'Date',
    dataIndex: 'date',
    render: date => {
      const formattedDate = new Date(date);
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1;
      const year = formattedDate.getFullYear();
      return `${day}-${month}-${year}`;
    }
  },
  {
    title: "Booking",
    dataIndex: "status",
    render: (status) => (status ? "Confirmed" : "Pending"),
  }
];


const visitor = [
  {
    title: 'S.No',
    dataIndex: 'key',
  },
  {
    title: 'First Name',
    dataIndex: 'first_name',
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    render: date => {
      const formattedDate = new Date(date);
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1;
      const year = formattedDate.getFullYear();
      return `${day}-${month}-${year}`;
    }
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Mobile Number',
    dataIndex: 'mobile',
  },
];


const data1 = [
  { name: 'Jan', OldUser: 32, NewUser: 41 },
  { name: 'Feb', OldUser: 44, NewUser: 34 },
  { name: 'Mar', OldUser: 11, NewUser: 15 },
  { name: 'Apr', OldUser: 65, NewUser: 75 },
  { name: 'May', OldUser: 57, NewUser: 2 },
  { name: 'Jun', OldUser: 58, NewUser: 38 },
  { name: 'Jul', OldUser: 50, NewUser: 18 },
  { name: 'Aug', OldUser: 53, NewUser: 58 },
  { name: 'Sep', OldUser: 25, NewUser: 78 },
  { name: 'Oct', OldUser: 65, NewUser: 18 },
  { name: 'Nov', OldUser: 25, NewUser: 38 },
  { name: 'Dec', OldUser: 85, NewUser: 68 },

];



const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [visitorData, setVisitorData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [userData, setUserData] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 150 });

  const [graphData, setGraphData] = useState([])
  const [revenueData, setRevenueData] = useState()


  useEffect(() => {
    // Fetch today's date
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);

    // Fetch counts from API
    axios.get(`${API_URL}/dashboard/count`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }
    )
      .then((response) => {
        setCount(response?.data?.data);
        setUserCount(response?.data?.userCount);
        setVenueCount(response?.data?.venueCount);
        setEventCount(response?.data?.eventCount);
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });


    // Fetch new users, old users data and all users...................

    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user-growth-graph`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setGraphData(response?.data?.data);
        console.log('User growth data:', response.data);
      } catch (error) {
        console.error('Error fetching user growth data:', error);
      }
    };

    fetchUserGrowthData();



    // const response = axios.get(`${API_URL}/user-growth-graph`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     }
    //   }
    // )
    //   .then((response) => {
    //     const data = response.data.data;

    //     const updatedUserData = [];

    //     data1.forEach((monthData) => {
    //       const updatedItem = {
    //         name: monthData.month,
    //         NewUser: monthData.NewUser,
    //         OldUser: monthData.OldUser,

    //       };
    //       updatedUserData.push(updatedItem);
    //     });

    //     setUserData(updatedUserData);

    //     const dynamicWidth = Math.max(300, updatedUserData.length * 80);
    //     const dynamicHeight = 200;
    //     setChartDimensions({ width: dynamicWidth, height: dynamicHeight });
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data:', error);
    //   });




    // VISITOR...
    axios.get(`${API_URL}/dashboard/fetch-visitors`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }
    )
      .then(response => {
        const formattedVisitorData = response?.data?.data?.map((item, index) => ({
          ...item,
          key: index + 1
        }));
        setVisitorData(formattedVisitorData);
      })
      .catch(error => {
        console.error('Error fetching visitor data:', error);
      });


    // Booking.....
    axios
      .get(`${API_URL}/booking/get`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      .then((response) => {
        const formattedBookingData = response?.data?.data?.map((item, index) => ({
          ...item,
          key: index + 1
        }));
        setBookingData(formattedBookingData);
      })
      .catch((error) => {
        console.error("Error fetching booking data:", error);
      });


  }, []);

  const transformedData = graphData?.map(item => ({
    name: item.month,
    // OldUser: item.count * 0.5,  // Example: 50% of the count is OldUser
    NewUser: item.count   // Example: 50% of the count is NewUser
  }));



  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const Revenue = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/revenue`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
      if(response.data.success){
        setRevenueData(response.data)
      }
    } catch (error) {
      console.error(error)
      console.log(error, "error")
    }
  }

  useEffect(() => {
    Revenue()
  }, [])


  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="row gap-3 ms-0 w-100">
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total User</p>
            <p className="fs-5 fw-bold mb-0">{count?.userCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total Blogs</p>
            <p className="fs-5 fw-bold mb-0">{count?.blogCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total Bookings</p>
            <p className="fs-5 fw-bold mb-0">{count?.totalBookingCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
      </div>
      <div className="row gap-3 ms-0 mt-3 w-100">
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total Venue</p>
            <p className="fs-5 fw-bold mb-0">{count?.venueCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total Coach</p>
            <p className="fs-5 fw-bold mb-0">{count?.coachCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
        <div className="col-md-3 bg-white p-3">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-6 fw-bold mb-0">Total personal Trainer</p>
            <p className="fs-5 fw-bold mb-0">{count?.personalTrainerCount}</p>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <p className="mb-0 desc" >{currentDate}</p>
          </div>
        </div>
      </div>
      {/* Registration */}
      <div className="mt-4">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 className="mb-4 title">Registration</h3>
          {/* <div>
            <RangePicker onChange={handleDateRangeChange} />
          </div> */}
        </div>
        <div>
          <BarChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            data={transformedData}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="OldUser" stackId="a" fill="#3d9c06" /> */}
            <Bar dataKey="NewUser" stackId="a" fill="#3d9c06" />
            {/* <Bar dataKey="All" fill="#ff5f15" /> */}
          </BarChart>
        </div>
      </div>
      {/* Recent Booking */}
      <div className="mt-4">
        <h3 className="mb-4 title">Revenue Report</h3>
        <div className="row gap-3 ms-0 w-100">
          <div className="col-md-6 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">Total Revenue</p>
              <p className="fs-5 fw-bold mb-0">₹ {revenueData?.totalRevenue}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div>
          {/* <div className="col-md-3 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">Total Blogs</p>
              <p className="fs-5 fw-bold mb-0">{count?.blogCount}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div> */}
          {/* <div className="col-md-3 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">Total Bookings</p>
              <p className="fs-5 fw-bold mb-0">{count?.totalBookingCount}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div> */}
        </div>
        <div className="row gap-3 ms-0 mt-3 w-100">
          <div className="col-md-3 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">Venue</p>
              <p className="fs-5 fw-bold mb-0">₹ {revenueData?.revenueBreakdown?.venueRevenue}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div>
          <div className="col-md-3 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">Coach</p>
              <p className="fs-5 fw-bold mb-0">₹ {revenueData?.revenueBreakdown?.coachRevenue}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div>
          <div className="col-md-3 bg-white p-3">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-6 fw-bold mb-0">personal Trainer</p>
              <p className="fs-5 fw-bold mb-0">₹ {revenueData?.revenueBreakdown?.trainerRevenue}</p>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <p className="mb-0 desc" >{currentDate}</p>
            </div>
          </div>
        </div>
        {/* <h3 className="mb-5 title">Recent Booking</h3> */}
        {/* <BookingList listType="dashboard" /> */}
        {/* <div>
          <Table
            columns={booking}
            dataSource={bookingData}
            pagination={{
              pageSizeOptions: ["5", "10", "20", "50"], // Available page sizes
              showSizeChanger: true, // Show the page size changer dropdown
              showQuickJumper: true, // Show quick jumper
            }}
          />
        </div> */}
      </div>
      {/* Recent Visitor */}
      <div className="mt-4">
        <h3 className="mb-5 title">Recent Visitor</h3>
        <div>
          <Table
            columns={visitor}
            dataSource={visitorData}
            pagination={{
              pageSizeOptions: ["5", "10", "20", "50"], // Available page sizes
              showSizeChanger: true, // Show the page size changer dropdown
              showQuickJumper: true, // Show quick jumper
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;