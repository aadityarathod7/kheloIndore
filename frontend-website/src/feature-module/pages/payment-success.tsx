import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { IMG_URL } from "../../ApiUrl";

interface JwtPayload {
  first_name?: string;
  last_name?: string;
  userID?: number;
  id?: string;
}

export default function PaymentSuccess() {
  const routes = all_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [countdown, setCountdown] = useState<number>(8);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const txnId = searchParams.get("txnId") || "KI-" + Date.now().toString().slice(-8);
  const bookingId = searchParams.get("bookingId") || "";
  const amount = searchParams.get("amount") || "";
  const service = searchParams.get("service") || "venue";
  const name =
    searchParams.get("name") ||
    (service === "coach"
      ? "Coach Session"
      : service === "trainer"
      ? "Personal Training"
      : "Sports Venue Booking");
  const date = searchParams.get("date") || "";
  const slots = searchParams.get("slots") || "";
  const rawPdfUrl = searchParams.get("pdf") || "";
  const pdfUrl = rawPdfUrl
    ? rawPdfUrl.startsWith("http")
      ? rawPdfUrl
      : `${IMG_URL}${rawPdfUrl}`
    : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserData(decoded);
      } catch {
        // Ignore token decoding error
      }
    }
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      navigate("/user/user-bookings?booking=success");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, navigate]);

  const handleCopyId = () => {
    const textToCopy = bookingId || txnId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="booking-success-page">
      <style>{`
        .booking-success-page {
          min-height: 90vh;
          background: linear-gradient(145deg, #064E3B 0%, #0F766E 50%, #065F46 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .success-modal-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 520px;
          overflow: hidden;
          animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .success-header-section {
          background: linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%);
          padding: 36px 24px 20px;
          text-align: center;
          position: relative;
        }

        .pulse-icon-wrapper {
          width: 86px;
          height: 86px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.2), 0 0 0 20px rgba(16, 185, 129, 0.08);
          animation: pulseGreen 2.4s infinite;
        }

        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 0 0 10px rgba(16, 185, 129, 0.15); }
          70% { box-shadow: 0 0 0 18px rgba(16, 185, 129, 0), 0 0 0 32px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0), 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .success-main-title {
          font-size: 26px;
          font-weight: 800;
          color: #065F46;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .success-sub-text {
          font-size: 14px;
          color: #4B5563;
          margin: 0 0 16px;
        }

        .amount-highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 8px 18px;
          border-radius: 999px;
          color: #047857;
          font-weight: 700;
          font-size: 18px;
        }

        .details-box {
          padding: 20px 24px;
          background: #F9FAFB;
          border-top: 1px dashed #E5E7EB;
          border-bottom: 1px dashed #E5E7EB;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
        }

        .detail-item:not(:last-child) {
          border-bottom: 1px solid #F3F4F6;
        }

        .detail-label {
          color: #6B7280;
          font-weight: 500;
        }

        .detail-value {
          color: #111827;
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .badge-status {
          display: inline-block;
          background: #DCFCE7;
          color: #15803D;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .copy-chip {
          background: #E5E7EB;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          font-size: 11px;
          padding: 2px 6px;
          margin-left: 6px;
          color: #374151;
          font-weight: 600;
        }

        .copy-chip:hover {
          background: #D1D5DB;
        }

        .redirect-notice-bar {
          background: #EFF6FF;
          border: 1px solid #DBEAFE;
          border-radius: 12px;
          padding: 10px 14px;
          margin: 16px 24px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #1E40AF;
        }

        .timer-progress {
          font-weight: 700;
          color: #1D4ED8;
        }

        .pause-btn {
          background: transparent;
          border: none;
          color: #2563EB;
          font-size: 12px;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
        }

        .actions-container {
          padding: 20px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-view-bookings {
          background: #10B981;
          color: #FFFFFF !important;
          padding: 13px 20px;
          border-radius: 12px;
          text-align: center;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
          text-decoration: none;
        }

        .btn-view-bookings:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
        }

        .btn-download-pdf {
          background: #F3F4F6;
          color: #374151 !important;
          padding: 11px 18px;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          border: 1px solid #E5E7EB;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
        }

        .btn-download-pdf:hover {
          background: #E5E7EB;
          color: #111827 !important;
        }

        .btn-home-link {
          text-align: center;
          color: #6B7280;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          margin-top: 4px;
        }

        .btn-home-link:hover {
          color: #111827;
          text-decoration: underline;
        }
      `}</style>

      <div className="success-modal-card">
        {/* Top Celebration Section */}
        <div className="success-header-section">
          <div className="pulse-icon-wrapper">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 className="success-main-title">
            Booking Successful! 🎉
          </h1>
          <p className="success-sub-text">
            Payment verified & your booking request has been registered.
          </p>

          {amount && (
            <div className="amount-highlight-pill">
              <span>Paid: ₹{amount}</span>
              <span style={{ fontSize: "11px", background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: "10px" }}>
                COMPLETED
              </span>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="details-box">
          <div className="detail-item">
            <span className="detail-label">Service / Venue</span>
            <span className="detail-value">{name}</span>
          </div>

          {(bookingId || txnId) && (
            <div className="detail-item">
              <span className="detail-label">Reference ID</span>
              <span className="detail-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                {bookingId || txnId}
                <button
                  type="button"
                  className="copy-chip"
                  onClick={handleCopyId}
                  title="Copy Reference ID"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </span>
            </div>
          )}

          {date && (
            <div className="detail-item">
              <span className="detail-label">Booking Date</span>
              <span className="detail-value">{date}</span>
            </div>
          )}

          {slots && (
            <div className="detail-item">
              <span className="detail-label">Time Slot</span>
              <span className="detail-value">{slots}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">Customer</span>
            <span className="detail-value">
              {userData?.first_name ? `${userData.first_name} ${userData.last_name || ""}`.trim() : "Khelo Indore User"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Booking Status</span>
            <span className="detail-value">
              <span className="badge-status">Booking Confirmed</span>
            </span>
          </div>
        </div>

        {/* Auto-redirect countdown notice */}
        <div className="redirect-notice-bar">
          <div>
            {!isPaused ? (
              <span>
                Redirecting to bookings in <strong className="timer-progress">{countdown}s</strong>...
              </span>
            ) : (
              <span>Auto-redirect paused.</span>
            )}
          </div>
          <button
            type="button"
            className="pause-btn"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? "Resume" : "Stay on page"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="actions-container">
          <button
            type="button"
            className="btn-view-bookings"
            onClick={() => navigate("/user/user-bookings?booking=success")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Go to My Bookings
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-download-pdf"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Invoice / Receipt
            </a>
          )}

          <Link to={routes.home} className="btn-home-link">
            Return to Khelo Indore Home
          </Link>
        </div>
      </div>
    </div>
  );
}
