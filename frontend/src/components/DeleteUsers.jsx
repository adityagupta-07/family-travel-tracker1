import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DeleteUsers() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/api/data").then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((u) => u.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        selected.map((id) => {
          const user = users.find((u) => u.id === id);
          return axios.post("http://localhost:3000/api/delete", {
            name: user.name,
          });
        }),
      );
      setUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
      setSelected([]);
      setToast(`${selected.length} member(s) deleted!`);
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setToast("Something went wrong.");
      setTimeout(() => setToast(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <button onClick={() => navigate("/new")} style={styles.backBtn}>
        ← Back
      </button>

      <h1 style={styles.title}>Delete Family Members</h1>
      <p style={styles.subtitle}>
        {users.length} member{users.length !== 1 ? "s" : ""} total
      </p>

      {users.length === 0 ? (
        <p style={{ color: "#aaa" }}>No family members found.</p>
      ) : (
        <div style={styles.card}>
          {/* Select All */}
          <div style={styles.selectAllRow} onClick={selectAll}>
            <div
              style={{
                ...styles.checkbox,
                backgroundColor:
                  selected.length === users.length ? "teal" : "transparent",
                borderColor: selected.length === users.length ? "teal" : "#555",
              }}
            >
              {selected.length === users.length && (
                <span style={styles.tick}>✓</span>
              )}
            </div>
            <span style={styles.selectAllLabel}>
              {selected.length === users.length ? "Deselect All" : "Select All"}
            </span>
          </div>

          <div style={styles.divider} />

          {/* User list */}
          <div style={styles.scrollArea}>
            {users.map((user) => {
              const isChecked = selected.includes(user.id);
              return (
                <div
                  key={user.id}
                  style={{
                    ...styles.row,
                    backgroundColor: isChecked ? "#2a2f38" : "transparent",
                  }}
                  onClick={() => toggleSelect(user.id)}
                >
                  <div
                    style={{
                      ...styles.checkbox,
                      backgroundColor: isChecked ? "teal" : "transparent",
                      borderColor: isChecked ? "teal" : "#555",
                    }}
                  >
                    {isChecked && <span style={styles.tick}>✓</span>}
                  </div>
                  <div
                    style={{
                      ...styles.colorDot,
                      backgroundColor: user.color,
                    }}
                  />
                  <span style={styles.name}>{user.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <button
          onClick={handleDeleteSelected}
          disabled={loading}
          style={styles.deleteBtn}
        >
          {loading
            ? "Deleting..."
            : `🗑 Delete ${selected.length} Selected User${selected.length > 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#21252b",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "Roboto, sans-serif",
    position: "relative",
  },
  scrollArea: {
    overflowY: "auto",
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "teal",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#aaa",
    marginBottom: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#2c313a",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "60vh",
  },
  selectAllRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    gap: "14px",
  },
  selectAllLabel: {
    fontSize: "0.9rem",
    color: "#aaa",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  divider: {
    height: "1px",
    backgroundColor: "#3a3f4b",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "14px 18px",
    cursor: "pointer",
    gap: "14px",
    transition: "background-color 0.15s ease",
    borderBottom: "1px solid #3a3f4b",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "2px solid #555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.15s ease",
  },
  tick: {
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
  },
  colorDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  name: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  deleteBtn: {
    position: "sticky",
    bottom: "20px",
    marginTop: "24px",
    padding: "14px 28px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#c0392b",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 -4px 15px rgba(0,0,0,0.4)",
  },
  toast: {
    position: "fixed",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    zIndex: 9999,
  },
};

export default DeleteUsers;
