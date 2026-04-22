import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage("OTP sent to your email!");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
    } catch (err) {
        setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
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
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "320px",
      }}>
        <input type="email" placeholder="Your email" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoFocus/>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;