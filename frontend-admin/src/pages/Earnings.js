import React, { useState, useEffect } from "react";
import { Table, Card, Row, Col, Statistic, Spin, Alert } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarOutlined, CalendarOutlined, LineChartOutlined, PercentageOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";

const Earnings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, monthlyRes, recentRes] = await Promise.all([
          axios.get(`${API_URL}/earnings/summary`, { headers }),
          axios.get(`${API_URL}/earnings/monthly`, { headers }),
          axios.get(`${API_URL}/earnings/recent-bookings`, { headers })
        ]);

        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (monthlyRes.data.success) setMonthlyData(monthlyRes.data.data);
        if (recentRes.data.success) setRecentBookings(recentRes.data.data);

      } catch (err) {
        console.error("Error fetching earnings data:", err);
        setError(err.response?.data?.message || "Failed to load earnings dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 70
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user"
    },
    {
      title: "Service/Booking",
      dataIndex: "service",
      key: "service"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`badge ${status === "Success" ? "bg-success" : "bg-danger"}`}>
          {status}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "350px" }}>
        <Spin size="large" tip="Loading Earnings Dashboard..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon className="my-3" />;
  }

  return (
    <div className="container-fluid p-0">
      <h3 className="mb-4 title" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}>
        Earnings Dashboard
      </h3>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Total Earnings"
              value={summary?.totalEarnings}
              precision={2}
              valueStyle={{ color: "#097e52", fontWeight: 700 }}
              prefix={<DollarOutlined />}
              suffix="INR"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Statistic
              title="This Month's Revenue"
              value={summary?.thisMonthEarnings}
              precision={2}
              valueStyle={{ color: "#0ea5e9", fontWeight: 700 }}
              prefix={<CalendarOutlined />}
              suffix="INR"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Total Bookings"
              value={summary?.totalBookings}
              valueStyle={{ color: "#f59e0b", fontWeight: 700 }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm border-0" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Avg. Booking Value"
              value={summary?.avgBookingValue}
              precision={2}
              valueStyle={{ color: "#8b5cf6", fontWeight: 700 }}
              prefix={<PercentageOutlined />}
              suffix="INR"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts & Graphs */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24}>
          <Card
            title={<span style={{ fontWeight: 600 }}>Earnings Trend (Last 6 Months)</span>}
            bordered={false}
            className="shadow-sm border-0"
            style={{ borderRadius: "12px" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#097e52" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#097e52" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Earnings"]} />
                  <Area type="monotone" dataKey="earnings" stroke="#097e52" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Table */}
      <Card
        title={<span style={{ fontWeight: 600 }}>Recent Transactions</span>}
        bordered={false}
        className="shadow-sm border-0"
        style={{ borderRadius: "12px" }}
      >
        <Table
          columns={columns}
          dataSource={recentBookings}
          rowKey="id"
          pagination={false}
          className="border-0"
        />
      </Card>
    </div>
  );
};

export default Earnings;
