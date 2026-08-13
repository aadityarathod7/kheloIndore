import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { all_routes } from "../router/all_routes";

type Token = { userID: string };
type Invoice = { id: string; provider: string; service: string; date?: string; amount: number; status: string; pdfUrl?: string };
const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function UserInvoice() {
  const [invoices, setInvoices] = useState<Invoice[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token"); if (!token) { setLoading(false); return; }
    const userId = jwtDecode<Token>(token).userID;
    axios.get(`${API_URL}/get/venue-coach-pt-booking/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(({ data }) => {
      const source = data?.data || {};
      const from = (items: any[], service: string, name: (item: any) => string) => (items || []).filter((item) => item.pdf_url || ["COMPLETED", "SUCCESS"].includes(String(item.paymentState).toUpperCase())).map((item) => ({ id: item._id, provider: name(item), service, date: item.date || item.startDate || item.createdAt, amount: Number(item.total_price) || 0, status: item.paymentState || "Pending", pdfUrl: item.pdf_url }));
      setInvoices([...from(source.venueAdmin, "Venue booking", (item) => item.venue_id?.name || "Venue"), ...from(source.coach, "Coaching", (item) => `${item.coachId?.first_name || ""} ${item.coachId?.last_name || ""}`.trim() || "Coach"), ...from(source.personalTrainer, "Personal training", (item) => `${item.pt_id?.first_name || ""} ${item.pt_id?.last_name || ""}`.trim() || "Trainer")].sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0)));
    }).finally(() => setLoading(false));
  }, []);
  return <div className="content court-bg py-5"><div className="container"><nav className="mb-4 small"><Link to={all_routes.userDashboard}>Dashboard</Link><span className="mx-2">/</span>Invoices</nav><h1 className="mb-4">Invoices</h1>{loading ? <p>Loading invoices…</p> : invoices.length === 0 ? <div className="alert alert-light border">No paid bookings or generated invoices are available yet.</div> : <div className="bg-white rounded-3 shadow-sm p-3 table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Booking</th><th>Service</th><th>Date</th><th>Status</th><th className="text-end">Amount</th><th /></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td>{invoice.provider}</td><td>{invoice.service}</td><td>{invoice.date ? new Date(invoice.date).toLocaleDateString("en-IN") : "—"}</td><td><span className="badge bg-success">{invoice.status}</span></td><td className="text-end fw-bold">{money(invoice.amount)}</td><td className="text-end">{invoice.pdfUrl ? <a className="btn btn-sm btn-outline-primary" href={invoice.pdfUrl.startsWith("http") ? invoice.pdfUrl : `${IMG_URL}${invoice.pdfUrl}`} target="_blank" rel="noreferrer">PDF</a> : "—"}</td></tr>)}</tbody></table></div>}</div></div>;
}
