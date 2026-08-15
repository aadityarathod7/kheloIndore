import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import { all_routes } from '../router/all_routes';

interface JwtPayload {
  first_name: any;
}

export default function PaymentSuccess() {
  const routes = all_routes;
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [searchParams] = useSearchParams();

  const txnId = searchParams.get("txnId") || "T" + Date.now().toString().slice(0, 12);
  const amount = searchParams.get("amount");

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserData(decodedToken);
      }
    };
    getTokenFromStorage();
  }, []);

  const styles = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(17, 156, 89, 0.4); }
      70% { box-shadow: 0 0 0 20px rgba(17, 156, 89, 0); }
      100% { box-shadow: 0 0 0 0 rgba(17, 156, 89, 0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cashfree-wrapper {
      background: linear-gradient(135deg, #16A34A 0%, #0F766E 100%) !important;
      min-height: 85vh !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 60px 20px !important;
      font-family: 'Inter', sans-serif !important;
    }
    .cashfree-card {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      background: #FFFFFF !important;
      border-radius: 24px !important;
      width: 100% !important;
      max-width: 380px !important;
      overflow: hidden !important;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2) !important;
      margin: auto !important;
    }
    .pp-title {
      color: #119C59 !important;
      font-weight: 700 !important;
      font-size: 24px !important;
      margin: 0 0 8px 0 !important;
    }
    .pp-subtitle {
      color: #64748B !important;
      font-size: 15px !important;
      margin: 0 0 24px 0 !important;
    }
    .pp-amount {
      color: #0F172A !important;
      font-weight: 800 !important;
      font-size: 40px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
    }
    .pp-label {
      color: #64748B !important;
      font-size: 14px !important;
    }
    .pp-value {
      color: #0F172A !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      user-select: all !important;
    }
    .pp-status-badge {
      color: #D97706 !important;
      background: #FEF3C7 !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      padding: 6px 12px !important;
      border-radius: 20px !important;
    }
  `;

  return (
    <div className="cashfree-wrapper">
      <style>{styles}</style>
      
      <div className="cashfree-card">
        
        {/* Top Section - Success Info */}
        <div style={{ padding: "40px 20px 30px", textAlign: "center", borderBottom: "2px dashed #E2E8F0" }}>
          
          <div style={{
            width: "88px", height: "88px", borderRadius: "50%", background: "#119C59", 
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 10px rgba(17, 156, 89, 0.2), 0 0 0 20px rgba(17, 156, 89, 0.1)",
            margin: "0 auto 32px auto",
            animation: "pulse 2s infinite"
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h2 className="pp-title">
            Payment Successful
          </h2>
          <p className="pp-subtitle">
            Your booking request has been placed securely.
          </p>
          
          <h1 className="pp-amount">
            {amount ? `₹${amount}` : <span style={{ fontSize: "28px", color: "#0F172A" }}>Booking Confirmed</span>}
          </h1>
        </div>

        {/* Details Section */}
        <div style={{ padding: "24px", background: "#F8FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="pp-label">Transaction ID</span>
            <span className="pp-value">{txnId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="pp-label">Paid By</span>
            <span className="pp-value">{userData?.first_name || "Customer"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="pp-label">Paid To</span>
            <span className="pp-value">Khelo Indore</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="pp-label">Status</span>
            <span className="pp-status-badge">
              Pending Approval
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "24px", background: "#FFFFFF" }}>
          <Link 
            to={routes.home} 
            style={{ 
              display: "block",
              background: "#5f259f", 
              color: "#FFFFFF", 
              padding: "16px", 
              borderRadius: "14px", 
              textAlign: "center", 
              textDecoration: "none", 
              fontWeight: "600", 
              fontSize: "16px", 
              transition: "background 0.2s" 
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#4a1c7e"}
            onMouseOut={(e) => e.currentTarget.style.background = "#5f259f"}
          >
            Done
          </Link>
        </div>
        
      </div>
      
    </div>
  )
}
