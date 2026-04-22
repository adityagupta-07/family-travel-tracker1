import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useSessionTimeout = (timeoutMs = 30 * 60 * 1000) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const timeoutMsRef = useRef(timeoutMs);

  useEffect(() => {
    timeoutMsRef.current = timeoutMs;
  }, [timeoutMs]);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await logout();
        navigate("/login");
      }, timeoutMsRef.current);
    };

    // Start timer immediately
    resetTimer();

    // Track ALL these events
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);
};

export default useSessionTimeout;