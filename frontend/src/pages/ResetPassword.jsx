import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const ResetPassword = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const otp = state?.otp || "";
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
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
      <h2>Reset Password</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "320px",
      }}>
        <input type="password" placeholder="New password (min 6 chars)"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoFocus/>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;