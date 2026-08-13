import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../ApiUrl";
import { all_routes } from "../router/all_routes";

type Transaction = { _id: string; type: "credit" | "debit" | "refund"; amount: number; description?: string; reference?: string; createdAt: string };
type Wallet = { balance: number; credit: number; debit: number; transactionCount: number };
const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function UserWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/wallet/me`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(({ data }) => { setWallet(data.wallet); setTransactions(data.transactions || []); })
      .catch(() => setError("Wallet data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  return <div className="content court-bg py-5"><div className="container">
    <nav className="mb-4 small"><Link to={all_routes.userDashboard}>Dashboard</Link><span className="mx-2">/</span>Wallet</nav>
    <h1 className="mb-4">Wallet</h1>
    {loading ? <p>Loading wallet…</p> : error ? <div className="alert alert-warning">{error}</div> : <>
      <div className="row g-3 mb-4">
        {[["Available balance", wallet?.balance || 0], ["Total credit", wallet?.credit || 0], ["Total debit", wallet?.debit || 0]].map(([label, amount]) => <div className="col-md-4" key={String(label)}><div className="bg-white shadow-sm rounded-3 p-4 h-100"><small className="text-muted">{label}</small><h2 className="mt-2 mb-0">{money(Number(amount))}</h2></div></div>)}
      </div>
      <div className="bg-white shadow-sm rounded-3 p-4"><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="mb-0">Transaction history</h4><small className="text-muted">{wallet?.transactionCount || 0} transactions</small></div>
        {transactions.length === 0 ? <p className="text-muted mb-0">No wallet transactions yet. Your balance will update when a wallet payment, credit, or refund is recorded.</p> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Date</th><th>Description</th><th>Reference</th><th className="text-end">Amount</th></tr></thead><tbody>{transactions.map((transaction) => <tr key={transaction._id}><td>{new Date(transaction.createdAt).toLocaleDateString("en-IN")}</td><td>{transaction.description || "Wallet transaction"}</td><td>{transaction.reference || "—"}</td><td className={`text-end fw-bold ${transaction.type === "debit" ? "text-danger" : "text-success"}`}>{transaction.type === "debit" ? "−" : "+"}{money(transaction.amount)}</td></tr>)}</tbody></table></div>}
      </div>
    </>}
  </div></div>;
}
