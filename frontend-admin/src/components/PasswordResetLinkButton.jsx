import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";

export default function PasswordResetLinkButton({ accountType, account }) {
  const [expiresAt, setExpiresAt] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!account?.password_reset_sent_at) return;
    const serverExpiry = new Date(account.password_reset_sent_at).getTime() + 60 * 1000;
    if (serverExpiry > Date.now()) setExpiresAt(serverExpiry);
  }, [account?.password_reset_sent_at]);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const updateRemaining = () => {
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) setExpiresAt(0);
    };
    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const sendLink = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/super-admin/accounts/${accountType}/${account._id}/reset-link`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setExpiresAt(Date.now() + (response.data.retryAfterSeconds || 60) * 1000);
      await Swal.fire("Link sent", response.data.message, "success");
    } catch (error) {
      const retryAfter = Number(error.response?.data?.retryAfterSeconds || 0);
      if (retryAfter) setExpiresAt(Date.now() + retryAfter * 1000);
      Swal.fire("Unable to send link", error.response?.data?.message || "Please try again.", "error");
    }
  };

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-success ms-1"
      onClick={sendLink}
      disabled={remaining > 0}
      title="Email a link so this account can create a new password"
    >
      {remaining ? `Link sent (${remaining}s)` : "Generate password link"}
    </button>
  );
}
