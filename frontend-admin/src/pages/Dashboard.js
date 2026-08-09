import React, { useState, useEffect } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Table, DatePicker } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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

  // Analytics (bookings/revenue breakdown with Day/Week/Month/Custom filters)
  const [analytics, setAnalytics] = useState(null);
  const [analyticsFilter, setAnalyticsFilter] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const PIE_COLORS = ["#22C55E", "#0EA5E9", "#F59E0B"];

  const fetchAnalytics = async (filter = analyticsFilter, from = customFrom, to = customTo) => {
    setAnalyticsLoading(true);
    try {
      const params = { filter };
      if (filter === "custom" && from && to) {
        params.fromDate = from;
        params.toDate = to;
      }
      const response = await axios.get(`${API_URL}/dashboard/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params,
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const downloadAnalyticsReport = async () => {
    try {
      const params = { filter: analyticsFilter };
      if (analyticsFilter === "custom" && customFrom && customTo) {
        params.fromDate = customFrom;
        params.toDate = customTo;
      }
      const response = await axios.get(`${API_URL}/dashboard/analytics/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `khelo-indore-report-${analyticsFilter}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics("week");
  }, []);


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
      {/* Analytics: Total Bookings & Total Revenue breakdown */}
      <div className="mt-4 bg-white p-4 rounded-3" style={{ border: "1px solid #E2E8F0" }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <h3 className="mb-0 title">Booking &amp; Revenue Analytics</h3>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {["day", "week", "month", "custom"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setAnalyticsFilter(f);
                  if (f !== "custom") fetchAnalytics(f);
                }}
                className="btn btn-sm"
                style={{
                  borderRadius: "50px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  background: analyticsFilter === f ? "#22C55E" : "#F1F5F9",
                  color: analyticsFilter === f ? "#FFFFFF" : "#475569",
                  border: "1px solid " + (analyticsFilter === f ? "#22C55E" : "#E2E8F0"),
                }}
              >
                {f}
              </button>
            ))}
            <button
              onClick={downloadAnalyticsReport}
              className="btn btn-sm"
              style={{
                borderRadius: "50px",
                fontWeight: "600",
                background: "#0F172A",
                color: "#FFFFFF",
                border: "none",
              }}
            >
              <i className="feather-download me-1" /> Download Report
            </button>
          </div>
        </div>

        {analyticsFilter === "custom" && (
          <div className="d-flex align-items-end gap-2 mb-3 flex-wrap">
            <div>
              <label className="fw-semibold mb-1 d-block" style={{ fontSize: "12px" }}>From</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="fw-semibold mb-1 d-block" style={{ fontSize: "12px" }}>To</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
            <button
              onClick={() => fetchAnalytics("custom", customFrom, customTo)}
              className="btn btn-sm"
              style={{ background: "#22C55E", color: "#FFFFFF", borderRadius: "8px", fontWeight: "600" }}
            >
              Apply
            </button>
          </div>
        )}

        {analyticsLoading ? (
          <p className="text-muted py-3 mb-0">Loading analytics...</p>
        ) : analytics ? (
          <div className="row g-4">
            {/* Totals */}
            <div className="col-12">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}>
                    <p className="mb-1" style={{ fontSize: "13px", opacity: 0.85 }}>Total Bookings</p>
                    <h3 className="mb-0 fw-bold">{analytics.totalBookings ?? 0}</h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 text-white" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
                    <p className="mb-1" style={{ fontSize: "13px", opacity: 0.85 }}>Total Revenue</p>
                    <h3 className="mb-0 fw-bold">₹ {Number(analytics.totalRevenue ?? 0).toLocaleString("en-IN")}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie charts */}
            <div className="col-md-6">
              <div className="p-3 rounded-3 text-center" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <h6 className="fw-bold mb-3">Total Bookings by Category</h6>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={analytics.bookingBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {analytics.bookingBreakdown.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded-3 text-center" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <h6 className="fw-bold mb-3">Total Revenue by Category</h6>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={analytics.revenueBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ₹${entry.value}`}
                    >
                      {analytics.revenueBreakdown.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted py-3 mb-0">No analytics data available.</p>
        )}
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