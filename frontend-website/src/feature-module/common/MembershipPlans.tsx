import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URL } from "../../ApiUrl";
import { openCashfreeCheckout } from "../../utils/cashfreeCheckout";

type Plan = { name: string; months: number; price: number; priority?: string; discount?: string; support?: string };

export default function MembershipPlans({ providerType, providerId, plans = [] }: { providerType: "coach" | "trainer"; providerId?: string; plans?: Plan[] }) {
  const navigate = useNavigate();
  const validPlans = plans.filter((plan) => plan?.name && Number(plan.months) > 0 && Number(plan.price) > 0);
  if (!providerId || !validPlans.length) return null;

  const checkout = async (planIndex: number) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login", { state: { returnTo: window.location.pathname } });
    try {
      const { data } = await axios.post(`${API_URL}/membership/checkout`, { provider_type: providerType, provider_id: providerId, plan_index: planIndex }, { headers: { Authorization: `Bearer ${token}` } });
      await openCashfreeCheckout(data.payment_session_id);
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Membership checkout unavailable", text: error.response?.data?.message || "Please try again." });
    }
  };

  return (
    <section className="ki-membership-plans">
      <div className="ki-membership-heading"><span><i className="fas fa-repeat" /></span><div><strong>Membership plans</strong><small>One-time payment · fixed access</small></div></div>
      <div className="ki-membership-plan-list">
        {validPlans.map((plan, index) => {
          const support = plan.support || (plan.months >= 12 ? "Premium support" : plan.months >= 3 ? "Member support" : "Basic support");
          const discount = plan.discount || (plan.months === 1 ? "Flexible plan" : "Member value");
          return <article className={`ki-membership-plan ${plan.months >= 12 ? "is-best-value" : ""}`} key={`${plan.name}-${plan.months}`}>
            <div className="ki-membership-plan-top"><div><strong>{plan.name}</strong><span>{plan.months} month{plan.months > 1 ? "s" : ""} access · {plan.priority || "Standard Booking"}</span></div><div className="ki-membership-price"><strong>₹{Number(plan.price).toLocaleString("en-IN")}</strong>{plan.months >= 12 && <small>Best value</small>}</div></div>
            <div className="ki-membership-benefits"><span><i className="fas fa-check-circle" />{discount}</span><span><i className="fas fa-headset" />{support}</span></div>
            <button type="button" className="ki-membership-select" onClick={() => checkout(index)}>Choose {plan.name}</button>
          </article>;
        })}
      </div>
    </section>
  );
}
