import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type Plan = { name: string; months: number; price: number; priority?: string; discount?: string; support?: string };

export default function MembershipPlans({
  providerType,
  providerId,
  plans = [],
  providerData,
}: {
  providerType: "coach" | "trainer";
  providerId?: string;
  plans?: Plan[];
  providerData?: Record<string, unknown> | null;
}) {
  const navigate = useNavigate();
  const validPlans = plans.filter((plan) => plan?.name && Number(plan.months) > 0 && Number(plan.price) > 0);
  if (!providerId || !validPlans.length) return null;

  const selectPlan = (plan: Plan, planIndex: number) => {
    const targetUrl = providerType === "coach"
      ? `/coaches/coach-order-confirm/${providerId}`
      : `/trainers/training-order-confirm/${providerId}`;

    const bookingState = {
      isMembership: true,
      providerType,
      providerId,
      providerData,
      coachData: providerType === "coach" ? providerData : undefined,
      trainerData: providerType === "trainer" ? providerData : undefined,
      planIndex,
      membershipPlan: plan,
      plan,
      total_Price: Number(plan.price),
      totalPrice: Number(plan.price),
      selectedDate: new Date().toISOString(),
      bookingData: {
        isMembership: true,
        planIndex,
        planName: plan.name,
        months: plan.months,
        total_price: Number(plan.price),
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("pendingBooking", JSON.stringify({
        targetUrl,
        state: bookingState,
        type: providerType,
        timestamp: Date.now(),
      }));

      Swal.fire({
        title: "Login to continue",
        text: `Please log in to review and confirm your ${plan.name} membership.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login / Register",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#22C55E",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", {
            state: {
              URL: targetUrl,
              bookingState,
              returnTo: targetUrl,
            },
          });
        }
      });
      return;
    }

    sessionStorage.setItem("activeBookingConfirmation", JSON.stringify(bookingState));
    navigate(targetUrl, { state: bookingState });
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
            <button type="button" className="ki-membership-select" onClick={() => selectPlan(plan, index)}>Choose {plan.name}</button>
          </article>;
        })}
      </div>
    </section>
  );
}
