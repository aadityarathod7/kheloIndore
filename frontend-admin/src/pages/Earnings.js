import React, { useState, useEffect } from "react";
import { Table, Card, Statistic, Spin, Alert, Button, Input, Modal, message } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { WalletOutlined, CalendarOutlined, LineChartOutlined, PercentageOutlined, UndoOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../utils/ApiUrl";
import "./Earnings.css";

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const Earnings = () => {
  const isSuperAdmin = localStorage.getItem("role") === "Super Admin";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [vendorSettlements, setVendorSettlements] = useState([]);
  const [settlementTotals, setSettlementTotals] = useState(null);
  const [settlementNote, setSettlementNote] = useState("");
  const [payoutTarget, setPayoutTarget] = useState(null);
  const [payoutForm, setPayoutForm] = useState({ amount: "", payoutDate: new Date().toISOString().slice(0, 10), reference: "", note: "" });
  const [savingPayout, setSavingPayout] = useState(false);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const requests = [
          axios.get(`${API_URL}/earnings/summary`, { headers }),
          axios.get(`${API_URL}/earnings/monthly`, { headers }),
          axios.get(`${API_URL}/earnings/recent-bookings`, { headers }),
        ];
        if (isSuperAdmin) requests.push(axios.get(`${API_URL}/earnings/vendor-settlements`, { headers }));

        const [summaryRes, monthlyRes, recentRes, settlementsRes] = await Promise.all(requests);
        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (monthlyRes.data.success) setMonthlyData(monthlyRes.data.data);
        if (recentRes.data.success) setRecentBookings(recentRes.data.data);
        if (settlementsRes?.data?.success) {
          setVendorSettlements(settlementsRes.data.data);
          setSettlementTotals(settlementsRes.data.totals);
          setSettlementNote(settlementsRes.data.note || "");
        }
      } catch (err) {
        
        setError(err.response?.data?.message || "Failed to load earnings dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEarningsData();
  }, []);

  const columns = [
    { title: "S.No", key: "index", render: (_, __, index) => index + 1, width: 70 },
    { title: "Customer", dataIndex: "user", key: "user" },
    ...(isSuperAdmin ? [{
      title: "Booking owner", dataIndex: "owner", key: "owner", width: 180,
      render: (owner, row) => <div className="transaction-owner"><strong>{owner || "Not assigned"}</strong>{row.ownerContact && <small>{row.ownerContact}</small>}</div>,
    }] : []),
    { title: "Service/Booking", dataIndex: "service", key: "service" },
    { title: "Gross", dataIndex: "amount", key: "amount", render: formatCurrency },
    {
      title: "Refunded", dataIndex: "refundAmount", key: "refundAmount",
      render: (amount) => amount > 0 ? <span style={{ color: "#dc2626", fontWeight: 700 }}>−{formatCurrency(amount)}</span> : "—",
    },
    { title: "Net", dataIndex: "netAmount", key: "netAmount", render: (amount) => <span style={{ color: "#097e52", fontWeight: 700 }}>{formatCurrency(amount)}</span> },
    {
      title: "Date", dataIndex: "date", key: "date",
      render: (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      },
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (status) => {
        const isPositive = ["success", "refunded"].includes(String(status || "").toLowerCase());
        return <span style={{ display: "inline-block", padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: isPositive ? "#dcfce7" : "#fee2e2", color: isPositive ? "#15803d" : "#b91c1c", border: `1px solid ${isPositive ? "#86efac" : "#fecaca"}` }}>{status}</span>;
      },
    },
  ];

  const vendorColumns = [
    {
      title: "Vendor & venue", key: "vendor", width: 260,
      render: (_, row) => <div className="settlement-vendor-cell"><strong>{row.vendorName}</strong><span>{row.venueName}</span><small>{row.city}</small></div>,
    },
    {
      title: "Contact", key: "contact", width: 190,
      render: (_, row) => <div className="settlement-contact"><span>{row.vendorMobile}</span><small>{row.vendorEmail}</small></div>,
    },
    { title: "Bookings", dataIndex: "bookings", align: "center", width: 95 },
    { title: "Gross collected", dataIndex: "grossCollections", render: formatCurrency, width: 140 },
    { title: "Refunded", dataIndex: "refundedAmount", render: (amount) => amount ? <span className="amount-refund">−{formatCurrency(amount)}</span> : "—", width: 120 },
    { title: "Net collection", dataIndex: "netCollections", render: (amount) => <strong>{formatCurrency(amount)}</strong>, width: 140 },
    {
      title: "Amount due", dataIndex: "pendingPayout", width: 150,
      render: (amount) => <span className="amount-payable">{formatCurrency(amount)}</span>,
    },
    { title: "Payout status", dataIndex: "payoutStatus", width: 145, render: (status) => <span className="payout-pending">{status}</span> },
    { title: "Action", key: "action", width: 140, render: (_, row) => Number(row.pendingPayout) > 0 ? <Button size="small" type="primary" onClick={() => { setPayoutTarget(row); setPayoutForm({ amount: String(row.pendingPayout), payoutDate: new Date().toISOString().slice(0, 10), reference: "", note: "" }); }}>Record payment</Button> : "—" },
  ];

  const recordPayout = async () => {
    if (!payoutTarget) return;
    if (!Number(payoutForm.amount) || !payoutForm.reference.trim() || !payoutForm.payoutDate) return message.error("Enter amount, payment date, and UTR/reference.");
    try {
      setSavingPayout(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.post(`${API_URL}/earnings/vendor-payouts`, { vendorId: payoutTarget.vendorId, venueId: payoutTarget.venueId, amount: Number(payoutForm.amount), payoutDate: payoutForm.payoutDate, reference: payoutForm.reference, note: payoutForm.note }, { headers });
      const paid = Number(payoutTarget.paidAmount || 0) + Number(payoutForm.amount);
      const pending = Math.max(0, Number(payoutTarget.payableAmount) - paid);
      setVendorSettlements((items) => items.map((item) => item.key === payoutTarget.key ? { ...item, paidAmount: paid, pendingPayout: pending, payoutStatus: pending === 0 ? "Settled" : "Partially paid" } : item));
      setSettlementTotals((totals) => ({ ...totals, payableAmount: Math.max(0, Number(totals?.payableAmount || 0) - Number(payoutForm.amount)) }));
      message.success("Payout record saved.");
      setPayoutTarget(null);
    } catch (err) { message.error(err.response?.data?.message || "Could not save payout."); }
    finally { setSavingPayout(false); }
  };

  if (loading) return <div className="d-flex flex-column align-items-center justify-content-center gap-3" style={{ minHeight: "350px" }}><Spin size="large" /><span>Loading Earnings Dashboard...</span></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon className="my-3" />;

  const kpis = [
    { label: "Net Earnings", value: summary?.totalEarnings, color: "#097e52", icon: <WalletOutlined />, className: "net", currency: true },
    { label: "Gross Collections", value: summary?.grossRevenue, color: "#0ea5e9", icon: <CalendarOutlined />, className: "gross", currency: true },
    { label: "Total Bookings", value: summary?.totalBookings, color: "#f59e0b", icon: <LineChartOutlined />, className: "bookings" },
    { label: "Refunded Amount", value: summary?.totalRefunded, color: "#dc2626", icon: <UndoOutlined />, className: "refund", currency: true },
    { label: "Avg. Booking Value", value: summary?.avgBookingValue, color: "#8b5cf6", icon: <PercentageOutlined />, className: "average", currency: true },
  ];
  if (isSuperAdmin) {
    kpis.splice(1, 0, { label: "Vendor Payout Due", value: settlementTotals?.payableAmount, color: "#0f766e", icon: <WalletOutlined />, className: "payable", currency: true });
  }
  const payoutsToRelease = vendorSettlements.filter((settlement) => Number(settlement.pendingPayout) > 0);

  return (
    <div className="earnings-dashboard">
      <div className="earnings-heading">
        <div><p className="earnings-eyebrow">{isSuperAdmin ? "PLATFORM FINANCE" : "FINANCIAL OVERVIEW"}</p><h3 className="title">{isSuperAdmin ? "Revenue & Vendor Payouts" : "Earnings Dashboard"}</h3></div>
        <p className="earnings-subtitle">{isSuperAdmin ? "See every venue owner’s collection and the amount due to them." : "Track venue revenue, refunds, and booking performance."}</p>
      </div>

      <div className="earnings-kpi-grid">
        {kpis.map((kpi) => <Card bordered={false} key={kpi.label} className={`earnings-kpi-card earnings-kpi-card--${kpi.className}`}>
          <Statistic title={kpi.label} value={kpi.value} precision={kpi.currency ? 2 : 0} valueStyle={{ color: kpi.color, fontWeight: 700 }} prefix={kpi.icon} suffix={kpi.currency ? "INR" : null} />
        </Card>)}
      </div>

      {isSuperAdmin && <Card title={<div><span className="settlement-card-title">Payments to release</span><span className="settlement-card-caption">Only venue owners with money due are shown here.</span></div>} bordered={false} className="earnings-section-card payouts-release-card">
        {payoutsToRelease.length ? <div className="payouts-release-grid">
          {payoutsToRelease.map((payout) => <div className="payout-release-item" key={payout.key}>
            <div className="payout-release-person"><span className="payout-release-avatar">{payout.vendorName.charAt(0).toUpperCase()}</span><div><strong>{payout.vendorName}</strong><span>{payout.venueName}</span><small>{payout.vendorMobile}</small></div></div>
            <div className="payout-release-amount"><span>Pay now</span><strong>{formatCurrency(payout.pendingPayout)}</strong></div>
          </div>)}
        </div> : <div className="payouts-release-empty"><WalletOutlined /><div><strong>No payments are due right now.</strong><span>All paid venue bookings have either been refunded or have no remaining vendor balance.</span></div></div>}
      </Card>}

      {isSuperAdmin && <Card title={<div><span className="settlement-card-title">Vendor payout register</span><span className="settlement-card-caption">{settlementTotals?.vendors || 0} vendors · {settlementTotals?.venues || 0} venues</span></div>} bordered={false} className="earnings-section-card earnings-settlement-card">
        <div className="settlement-explainer">
          <strong>Amount due is ready for settlement.</strong>
          <span>{settlementNote}</span>
        </div>
        <Table columns={vendorColumns} dataSource={vendorSettlements} rowKey="key" pagination={{ pageSize: 8, hideOnSinglePage: true }} locale={{ emptyText: "No paid venue bookings are available for settlement yet." }} scroll={{ x: 1210 }} />
      </Card>}

      <Card title={<span style={{ fontWeight: 600 }}>Net Earnings & Refund Trend (Last 6 Months)</span>} bordered={false} className="earnings-section-card earnings-chart-card">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs><linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#097e52" stopOpacity={0.2} /><stop offset="95%" stopColor="#097e52" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" /><YAxis />
              <Tooltip formatter={(value, name) => [formatCurrency(value), name === "refundedAmount" ? "Refunded" : "Net earnings"]} />
              <Area type="monotone" dataKey="refundedAmount" stroke="#dc2626" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="earnings" stroke="#097e52" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title={<span style={{ fontWeight: 600 }}>Recent Transactions & Refunds</span>} bordered={false} className="earnings-section-card earnings-transactions-card">
        <Table columns={columns} dataSource={recentBookings} rowKey="id" pagination={false} className="border-0" scroll={{ x: 820 }} />
      </Card>
      <Modal title={payoutTarget ? `Record payment to ${payoutTarget.vendorName}` : "Record payout"} open={Boolean(payoutTarget)} onCancel={() => setPayoutTarget(null)} onOk={recordPayout} okText="Save payout" confirmLoading={savingPayout}>
        <div className="payout-form"><label>Amount paid</label><Input type="number" min="0" value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} /><label>Payment date</label><Input type="date" value={payoutForm.payoutDate} onChange={(e) => setPayoutForm({ ...payoutForm, payoutDate: e.target.value })} /><label>UTR / payment reference</label><Input value={payoutForm.reference} onChange={(e) => setPayoutForm({ ...payoutForm, reference: e.target.value })} placeholder="e.g. UTR123456" /><label>Note (optional)</label><Input.TextArea value={payoutForm.note} onChange={(e) => setPayoutForm({ ...payoutForm, note: e.target.value })} rows={3} /></div>
      </Modal>
    </div>
  );
};

export default Earnings;
