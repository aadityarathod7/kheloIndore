declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: "_self" | "_blank" | "_top" }) => Promise<unknown> | void;
    };
  }
}

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

const loadCashfreeSdk = () => new Promise<void>((resolve, reject) => {
  if (window.Cashfree) return resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[data-cashfree-sdk="true"]');
  if (existing) {
    existing.addEventListener("load", () => resolve(), { once: true });
    existing.addEventListener("error", () => reject(new Error("Unable to load Cashfree checkout.")), { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = CASHFREE_SDK_URL;
  script.async = true;
  script.dataset.cashfreeSdk = "true";
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Unable to load Cashfree checkout."));
  document.head.appendChild(script);
});

export const openCashfreeCheckout = async (paymentSessionId: string) => {
  if (!paymentSessionId) throw new Error("Cashfree payment session is missing.");
  await loadCashfreeSdk();
  if (!window.Cashfree) throw new Error("Cashfree checkout could not be initialized.");
  const mode: "sandbox" | "production" = process.env.REACT_APP_CASHFREE_ENV === "production" ? "production" : "sandbox";
  await window.Cashfree({ mode }).checkout({ paymentSessionId, redirectTarget: "_self" });
};