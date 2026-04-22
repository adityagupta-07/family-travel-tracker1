import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const rules = [
  { id: "length",    label: "At least 8 characters",      test: (p) => p.length >= 8 },
  { id: "upper",     label: "At least one uppercase",      test: (p) => /[A-Z]/.test(p) },
  { id: "number",    label: "At least one number",         test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "At least one special character (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
];

const getStrength = (passed) => {
  if (passed === 4) return { color: "#2ecc71", label: "Strong",  width: "100%" };
  if (passed === 3) return { color: "#f39c12", label: "Medium",  width: "75%"  };
  if (passed === 2) return { color: "#e67e22", label: "Weak",    width: "50%"  };
  if (passed === 1) return { color: "#e74c3c", label: "Too Weak",width: "25%"  };
  return { color: "#444", label: "", width: "0%" };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [touched, setTouched]   = useState(false);

  const passed = rules.filter((r) => r.test(password)).length;
  const strength = getStrength(passed);
  const allPassed = passed === 4;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allPassed) {
      setError("Please meet all password requirements.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      backgroundColor: "#21252b", color: "white", fontFamily: "Roboto, sans-serif",
    }}>
      <h2 style={{ marginBottom: "20px" }}>Register</h2>

      {error && <p style={{ color: "#e74c3c", marginBottom: "10px" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column", gap: "12px", width: "320px",
      }}>
        <input
          type="email" placeholder="Email" value={email} autoFocus
          onChange={(e) => setEmail(e.target.value)} required
          style={{ padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => { setPassword(e.target.value); setTouched(true); }} required
          style={{ padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }}
        />

        {/* Strength bar */}
        {touched && password.length > 0 && (
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
        {touched && password.length > 0 && (
          <div style={{
            backgroundColor: "#2c313a", borderRadius: "8px",
            padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px",
          }}>
            {rules.map((rule) => {
              const ok = rule.test(password);
              return (
                <div key={rule.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
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

        <button type="submit" disabled={loading || !allPassed} style={{
          padding: "12px", borderRadius: "8px", border: "none",
          backgroundColor: allPassed ? "teal" : "#444",
          color: allPassed ? "white" : "#888",
          fontWeight: "bold", fontSize: "16px",
          cursor: allPassed ? "pointer" : "not-allowed",
          transition: "background-color 0.3s ease",
        }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/login" style={{ color: "teal" }}>Login</Link>
      </p>

      {/* Pop animation */}
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Register;