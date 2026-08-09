import { useEffect, useRef } from "react";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

/**
 * Auto-logout hook: logs the user out after INACTIVITY_LIMIT of no
 * mouse/keyboard/scroll/touch activity. Uses localStorage token presence so it
 * only activates for logged-in users.
 */
const useAutoLogout = (onLogout?: () => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isLoggedIn = () =>
      !!localStorage.getItem("token") || !!localStorage.getItem("token2");

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const resetTimer = () => {
      clearTimer();
      if (!isLoggedIn()) return;
      timerRef.current = setTimeout(() => {
        // Only auto-logout if the user is still logged in
        if (!isLoggedIn()) return;
        localStorage.removeItem("token");
        localStorage.removeItem("token2");
        localStorage.removeItem("userName");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        if (typeof onLogout === "function") {
          onLogout();
        } else {
          window.location.href = "/login";
        }
      }, INACTIVITY_LIMIT);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );
    resetTimer();

    return () => {
      clearTimer();
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [onLogout]);
};

export default useAutoLogout;
