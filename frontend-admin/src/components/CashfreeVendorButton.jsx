import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/ApiUrl";
import "./CashfreeVendorButton.css";

// KYC and bank details are sent directly to Cashfree and are not retained by Khelo Indore.
export default function CashfreeVendorButton({ providerType, account }) {
  const onboard = async () => {
    const defaultBusinessType = providerType === "venue"
      ? "Travel and Hospitality"
      : "Professional Services (Doctors, Lawyers, Architects, CAs, and other Professionals)";
    const result = await Swal.fire({
      title: "Cashfree vendor onboarding",
      html: `
        <div class="cashfree-onboarding-form">
        <input id="cf-holder" class="swal2-input" placeholder="Account holder name">
        <input id="cf-account" class="swal2-input" inputmode="numeric" placeholder="Bank account number">
        <input id="cf-ifsc" class="swal2-input" style="text-transform:uppercase" placeholder="IFSC code">
        <input id="cf-pan" class="swal2-input" style="text-transform:uppercase" placeholder="PAN number">
        <label for="cf-account-type">Account type</label><select id="cf-account-type" class="swal2-select"><option value="INDIVIDUAL">Individual</option><option value="BUSINESS">Business</option></select>
        <label for="cf-business-type">Business type</label><select id="cf-business-type" class="swal2-select">
          <option value="">Select business type</option>
          ${["Grocery", "Jewellery", "Miscellaneous", "Web host/Domain seller", "E-commerce", "Online Gaming", "Society/Trust/Club/Association", "Mutual funds/Broking", "B2B", "Real Estate", "Housing", "Rentals", "Utilities", "Travel and Hospitality", "Education", "Food and Beverages", "NBFCs/Organizations into Lending", "Chit Funds", "Non Profit/NGO", "Financial Services", "Government", "Readymade", "SaaS", "Professional Services (Doctors, Lawyers, Architects, CAs, and other Professionals)", "Open and Semi Open Wallet", "Social Media and Entertainment", "Pan shop", "Telecom", "Digital Goods", "Insurance", "Pharmacy", "Healthcare", "Retail and Shopping", "Gaming", "Logistics"].map((type) => `<option value="${type}" ${type === defaultBusinessType ? "selected" : ""}>${type}</option>`).join("")}
        </select>
        <label for="cf-schedule">Settlement schedule</label><select id="cf-schedule" class="swal2-select"><option value="1">Standard settlement (T+1)</option><option value="8">Instant settlement option</option><option value="9">Instant settlement option</option></select>
        <input id="cf-gst" class="swal2-input" style="text-transform:uppercase" placeholder="GSTIN (optional / required for some businesses)">
        </div>
      `,
      customClass: { popup: "cashfree-onboarding-popup", htmlContainer: "cashfree-onboarding-html" },
      showCancelButton: true,
      confirmButtonText: "Submit to Cashfree",
      focusConfirm: false,
      preConfirm: () => {
        const get = (id) => document.getElementById(id)?.value.trim();
        const bank = { account_holder: get("cf-holder"), account_number: get("cf-account"), ifsc: get("cf-ifsc").toUpperCase() };
        const pan = get("cf-pan").toUpperCase();
        const business_type = get("cf-business-type");
        if (!bank.account_holder || !bank.account_number || !bank.ifsc || !pan || !business_type) {
          Swal.showValidationMessage("Account holder, account number, IFSC, PAN, and business type are required.");
          return false;
        }
        const kyc_details = { account_type: get("cf-account-type"), business_type, pan };
        const gst = get("cf-gst").toUpperCase();
        if (gst) kyc_details.gst = gst;
        return { bank, kyc_details, schedule_option: Number(get("cf-schedule")) };
      },
    });
    if (!result.isConfirmed) return;
    try {
      const response = await axios.post(`${API_URL}/super-admin/cashfree/vendors/${providerType}/${account._id}`, result.value, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      await Swal.fire("Vendor submitted", `Cashfree status: ${response.data.data.status}`, "success");
    } catch (error) { Swal.fire("Cashfree onboarding failed", error.response?.data?.message || "Please review the KYC and bank details.", "error"); }
  };
  const active = account.cashfree_vendor_status === "ACTIVE";
  return <button type="button" className={`account-password-button ${active ? "account-reset-button" : "account-set-password-button"}`} onClick={onboard} title="Submit provider bank and KYC details to Cashfree">{active ? "Cashfree active" : "Cashfree onboard"}</button>;
}
