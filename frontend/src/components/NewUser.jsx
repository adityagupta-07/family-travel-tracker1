import React, { useState, useEffect } from "react";
import "../styles/new.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2000); // start fade after 2s
    const doneTimer = setTimeout(() => onDone(), 2500); // remove after fade
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      style={{
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
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

const COLORS = [
  "red",
  "green",
  "yellow",
  "olive",
  "orange",
  "indigo",
  "blue",
  "violet",
  "purple",
  "pink",
];

function NewUser() {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("red");
  const [deleteName, setDeleteName] = useState("");
  const [toast, setToast] = useState(null); // ← single toast state
  const navigate = useNavigate();

  const showToast = (message) => setToast(message);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/new", {
        name,
        color: selectedColor,
      });
      showToast("Member added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/delete", {
        name: deleteName,
      });
      showToast("Member deleted successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        showToast("User not found.");
      } else {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <div className="new-user-container" style={{ position: "relative" }}>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: "20px", left: "20px" }}
      >
        ← Back to Home
      </button>

      <h1>Add or delete a Family Member</h1>

      <form onSubmit={handleSubmit}>
        <p>Add a family member:</p>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <p>Pick a color:</p>
        <div className="color-picker">
          {COLORS.map((color) => (
            <React.Fragment key={color}>
              <input
                type="radio"
                id={color}
                name="color"
                value={color}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
              <label htmlFor={color}>
                <span style={{ backgroundColor: color }}></span>
              </label>
            </React.Fragment>
          ))}
        </div>
        <button type="submit">Add</button>
      </form>

      <form onSubmit={handleDelete}>
        <p>Delete a family member:</p>
        <input
          type="text"
          placeholder="Enter name"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
          required
        />
        <button type="submit">Delete</button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/delete-users")}
        style={{
          marginTop: "20px",
          width: "320px",
          backgroundColor: "#c0392b",
        }}
      >
        🗑 Delete Multiple Users
      </button>
    </div>
  );
}

export default NewUser;
