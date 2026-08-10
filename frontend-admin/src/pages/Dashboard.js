import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Empty, Spin, Tooltip } from "antd";
import {
  ArrowUpOutlined,
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";
import "./Dashboard.css";
import ProviderDashboard from "./ProviderDashboard";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({});
  const [earnings, setEarnings] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [filter, setFilter] = useState("week");
  const [updatingAnalytics, setUpdatingAnalytics] = useState(false);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  const loadDashboard = useCallback(async (selectedFilter, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      const [countRes, growthRes, analyticsRes, earningsRes, settlementsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/count`, { headers }),
        axios.get(`${API_URL}/user-growth-graph`, { headers }),
        axios.get(`${API_URL}/dashboard/analytics`, { headers, params: { filter: selectedFilter } }),
        axios.get(`${API_URL}/earnings/summary`, { headers }),
        axios.get(`${API_URL}/earnings/vendor-settlements`, { headers }),
      ]);
      setCounts(countRes.data?.data || {});
      setGrowth((growthRes.data?.data || []).map((item) => ({ name: item.month, users: item.count })));
      setAnalytics(analyticsRes.data || null);
      setEarnings(earningsRes.data?.data || {});
      setSettlements((settlementsRes.data?.data || []).filter((item) => Number(item.payableAmount) > 0));
    } catch (requestError) {
      
      setError(requestError.response?.data?.message || "Unable to load the dashboard. Please refresh and try again.");
    } finally {
      setLoading(false);
      setUpdatingAnalytics(false);
    }
  }, []);

  useEffect(() => { loadDashboard("week"); }, [loadDashboard]);

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter);
    setUpdatingAnalytics(true);
    loadDashboard(nextFilter, false);
  };

  const downloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/analytics/download`, { headers, params: { filter }, responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `khelo-indore-${filter}-report.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError("Could not download the report. Please try again.");
    }
  };

  const cards = [
    { label: "Customers", value: counts.userCount, icon: <UserOutlined />, tone: "blue", note: "Registered users" },
    { label: "Total venues", value: counts.venueCount, icon: <EnvironmentOutlined />, tone: "green", note: `${counts.venueAdminCount || 0} venue owners` },
    { label: "Total bookings", value: counts.totalBookingCount, icon: <CalendarOutlined />, tone: "amber", note: "Across all services" },
    { label: "Net collections", value: money(earnings.totalEarnings), icon: <DollarOutlined />, tone: "violet", note: `After ${money(earnings.totalRefunded)} refunds` },
  ];

  if (loading) return <div className="super-dashboard-loading"><Spin size="large" /><span>Loading Super Admin dashboard…</span></div>;

  return <div className="super-dashboard">
    <section className="super-dashboard-hero">
      <div>
        <p className="super-dashboard-eyebrow">SUPER ADMIN COMMAND CENTER</p>
        <h1>Good overview, better decisions.</h1>
        <p>Manage venues, content, bookings, and vendor payouts from one place.</p>
      </div>
      <div className="super-dashboard-hero-actions">
        <Tooltip title="Refresh all dashboard data"><Button icon={<ReloadOutlined />} onClick={() => loadDashboard(filter)} className="hero-secondary">Refresh</Button></Tooltip>
        <Button type="primary" icon={<DownloadOutlined />} onClick={downloadReport} className="hero-primary">Download report</Button>
      </div>
    </section>

    {error && <Alert message={error} type="error" showIcon closable onClose={() => setError("")} className="super-dashboard-alert" />}

    <section className="super-dashboard-kpis">
      {cards.map((card) => <Card key={card.label} bordered={false} className={`super-kpi super-kpi--${card.tone}`}>
        <div className="super-kpi-icon">{card.icon}</div><div><span>{card.label}</span><strong>{card.value ?? 0}</strong><small>{card.note}</small></div>
      </Card>)}
    </section>

    <section className="super-dashboard-actions">
      <div><p className="section-kicker">QUICK ACTIONS</p><h2>Keep the platform moving</h2></div>
      <div className="quick-action-list">
        <Button icon={<PlusOutlined />} onClick={() => navigate("/venues/add")}>Add venue</Button>
        <Button icon={<CalendarOutlined />} onClick={() => navigate("/event/add")}>Create event</Button>
        <Button icon={<FileTextOutlined />} onClick={() => navigate("/add-blog")}>Write blog</Button>
        <Button icon={<TeamOutlined />} onClick={() => navigate("/venue-admin")}>Venue owners</Button>
      </div>
    </section>

    <section className="super-dashboard-grid">
      <Card bordered={false} className="super-panel super-growth-panel" title={<div><p className="section-kicker">COMMUNITY GROWTH</p><h2>Customer registrations</h2></div>}>
        {growth.length ? <ResponsiveContainer width="100%" height={280}><BarChart data={growth} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e7edf2" strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fill: "#718096", fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fill: "#718096", fontSize: 12 }} /><ChartTooltip cursor={{ fill: "#f1faf5" }} formatter={(value) => [value, "New customers"]} /><Bar dataKey="users" fill="#0b8a5a" radius={[7, 7, 0, 0]} maxBarSize={42} /></BarChart></ResponsiveContainer> : <Empty description="No registration data yet" />}
      </Card>

      <Card bordered={false} className="super-panel super-period-panel" title={<div><p className="section-kicker">PERIOD PERFORMANCE</p><h2>Bookings & collections</h2></div>} extra={<div className="period-tabs">{["day", "week", "month"].map((item) => <button key={item} onClick={() => changeFilter(item)} className={filter === item ? "active" : ""}>{item}</button>)}</div>}>
        {updatingAnalytics ? <div className="inline-loader"><Spin /> Updating…</div> : <><div className="period-metrics"><div><span>Bookings</span><strong>{analytics?.totalBookings || 0}</strong></div><div><span>Collections</span><strong>{money(analytics?.totalRevenue)}</strong></div></div><div className="period-breakdown">{(analytics?.summary ? [["Venue", analytics.summary.venue], ["Coach", analytics.summary.coach], ["Personal trainer", analytics.summary.trainer]] : []).map(([name, data]) => <div key={name}><span>{name}</span><strong>{data.bookings || 0} bookings</strong><small>{money(data.revenue)}</small></div>)}</div></>}
      </Card>
    </section>

    <section className="super-dashboard-grid super-dashboard-grid--bottom">
      <Card bordered={false} className="super-panel super-payout-panel" title={<div><p className="section-kicker">PAYOUTS</p><h2>Payments to release</h2></div>} extra={<Button type="link" onClick={() => navigate("/earnings")}>Open payout register <ArrowUpOutlined /></Button>}>
        {settlements.length ? <div className="dashboard-payout-list">{settlements.slice(0, 4).map((item) => <div className="dashboard-payout" key={item.key}><div><strong>{item.vendorName}</strong><span>{item.venueName}</span><small>{item.vendorMobile}</small></div><b>{money(item.payableAmount)}</b></div>)}</div> : <div className="dashboard-empty-state"><DollarOutlined /><span>No vendor payments are due right now.</span></div>}
      </Card>

      <Card bordered={false} className="super-panel super-service-panel" title={<div><p className="section-kicker">PLATFORM INVENTORY</p><h2>Services at a glance</h2></div>}>
        <div className="service-tally"><div><EnvironmentOutlined /><span>Venues</span><strong>{counts.venueCount || 0}</strong></div><div><TeamOutlined /><span>Coaches</span><strong>{counts.coachCount || 0}</strong></div><div><UserOutlined /><span>Trainers</span><strong>{counts.personalTrainerCount || 0}</strong></div><div><FileTextOutlined /><span>Blogs</span><strong>{counts.blogCount || 0}</strong></div><div><CalendarOutlined /><span>Events</span><strong>{counts.eventCount || 0}</strong></div></div>
      </Card>
    </section>
  </div>;
};

const Dashboard = () => {
  const role = localStorage.getItem("role");
  return ["Venue Admin", "Coach", "Personal Trainer"].includes(role)
    ? <ProviderDashboard role={role} />
    : <SuperAdminDashboard />;
};

export default Dashboard;
