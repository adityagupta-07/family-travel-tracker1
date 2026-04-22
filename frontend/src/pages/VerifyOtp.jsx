import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const VerifyOtp = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#21252b",
      color: "white",
      fontFamily: "Roboto, sans-serif"
    }}>
      <h2>Enter OTP</h2>
      <p>OTP sent to: {email}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "320px",
      }}>
        <input type="text" placeholder="6-digit OTP" value={otp}
          onChange={(e) => setOtp(e.target.value)} maxLength={6} required autoFocus/>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;