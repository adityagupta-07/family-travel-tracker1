import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "320px",
      }}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoFocus
          style={{ padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{ padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }} />
        <button type="submit" disabled={loading}
          style={{ padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "teal", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;