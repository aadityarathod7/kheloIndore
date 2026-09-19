import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";

// Allows a Super Admin to either choose a password or receive a securely
// generated temporary password for a managed account.
export default function ManagedPasswordButton({ accountType, account }) {
  const updatePassword = async () => {
    const result = await Swal.fire({
      title: "Set account password",
      text: "Leave this blank to generate a temporary password.",
      input: "password",
      inputPlaceholder: "Minimum 8 characters",
      showCancelButton: true,
      confirmButtonText: "Save password",
      inputValidator: (value) => value && value.trim().length < 8
        ? "Password must be at least 8 characters."
        : undefined,
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(
        `${API_URL}/super-admin/accounts/${accountType}/${account._id}/password`,
        { new_password: result.value || "" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const generated = response.data?.temporaryPassword;
      await Swal.fire({
        icon: "success",
        title: "Password updated",
        html: generated
          ? `Temporary password: <strong>${generated}</strong><br/><small>Copy it now and share it securely. It will not be shown again.</small>`
          : "The account password has been updated.",
      });
    } catch (error) {
      Swal.fire("Unable to update password", error.response?.data?.message || "Please try again.", "error");
    }
  };

  return (
    <button
      type="button"
      className="account-password-button account-set-password-button"
      onClick={updatePassword}
      title="Set a password manually or generate a temporary password"
    >
      Set password
    </button>
  );
}
