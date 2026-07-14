import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useSessionTimeout = (timeoutMs = 30 * 60 * 1000) => {
  const { logout, user } = useAuth(); // ← add isAuthenticated (or whatever your AuthContext exposes)
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logoutRef = useRef(logout);
  const navigateRef = useRef(navigate);
  useEffect(() => { logoutRef.current = logout; }, [logout]);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  useEffect(() => {

    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await logoutRef.current();
        navigateRef.current("/login");
      }, timeoutMs);
    };

    resetTimer();

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [user, timeoutMs]); 
};

export default useSessionTimeout;