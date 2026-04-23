import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const rules = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    id: "upper",
    label: "At least one uppercase",
    test: (p) => /[A-Z]/.test(p),
  },
  { id: "number", label: "At least one number", test: (p) => /[0-9]/.test(p) },
  {
    id: "special",
    label: "At least one special character (!@#$%^&*)",
    test: (p) => /[!@#$%^&*]/.test(p),
  },
];

const getStrength = (passed) => {
  if (passed === 4) return { color: "#2ecc71", label: "Strong", width: "100%" };
  if (passed === 3) return { color: "#f39c12", label: "Medium", width: "75%" };
  if (passed === 2) return { color: "#e67e22", label: "Weak", width: "50%" };
  if (passed === 1)
    return { color: "#e74c3c", label: "Too Weak", width: "25%" };
  return { color: "#444", label: "", width: "0%" };
};

const ResetPassword = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const otp = state?.otp || "";
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  const passed = rules.filter((r) => r.test(newPassword)).length;
  const strength = getStrength(passed);
  const allPassed = passed === 4;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allPassed) {
      setError("Please meet all password requirements.");
      return;
    }
    setError("");
    try {
      await api.post("/api/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#21252b",
        color: "white",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Reset Password</h2>
      {message && <p style={{ color: "#2ecc71", marginBottom: "10px" }}>{message}</p>}
      {error   && <p style={{ color: "#e74c3c", marginBottom: "10px" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "320px",
        }}
      >
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setTouched(true); }}
          required
          autoFocus
          style={{ padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }}
        />


        {/* <button type="submit">Reset Password</button> */}
        {touched && newPassword.length > 0 && (
          <div>
            <div style={{
              height: "6px", borderRadius: "4px", backgroundColor: "#333",
              overflow: "hidden", marginBottom: "6px",
            }}>
              <div style={{
                height: "100%", width: strength.width,
                backgroundColor: strength.color,
                transition: "width 0.4s ease, background-color 0.4s ease",
                borderRadius: "4px",
              }} />
            </div>
            <p style={{
              fontSize: "12px", color: strength.color,
              textAlign: "right", margin: "0 0 6px 0",
              transition: "color 0.3s ease",
            }}>
              {strength.label}
            </p>
          </div>
        )}

        {/* Checklist */}
        {touched && newPassword.length > 0 && (
          <div style={{
            backgroundColor: "#2c313a", borderRadius: "8px",
            padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px",
          }}>
            {rules.map((rule) => {
              const ok = rule.test(newPassword);
              return (
                <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: ok ? "#2ecc71" : "#444",
                    border: ok ? "none" : "2px solid #666",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "background-color 0.3s ease, transform 0.2s ease",
                    transform: ok ? "scale(1.15)" : "scale(1)",
                  }}>
                    {ok && <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: "13px",
                    color: ok ? "#2ecc71" : "#aaa",
                    transition: "color 0.3s ease",
                  }}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={!allPassed}
          style={{
            padding: "12px", borderRadius: "8px", border: "none",
            backgroundColor: allPassed ? "teal" : "#444",
            color: allPassed ? "white" : "#888",
            fontWeight: "bold", fontSize: "16px",
            cursor: allPassed ? "pointer" : "not-allowed",
            transition: "background-color 0.3s ease",
          }}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;