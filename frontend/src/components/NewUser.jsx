import React, { useState } from "react";
import "../styles/new.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/new", {
        name,
        color: selectedColor,
      });
      setAddSuccess(true);
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
      setDeleteSuccess(true);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("User not found.");
      } else {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <div className="new-user-container" style={{ position: "relative" }}>
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
            <>
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
            </>
          ))}
        </div>

        <button type="submit">Add</button>
      </form>
      {addSuccess && (
        <p style={{ color: "lightgreen" }}>Member added successfully!</p>
      )}

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
      {deleteSuccess && (
        <p style={{ color: "lightgreen" }}>Member deleted successfully!</p>
      )}
    </div>
  );
}

export default NewUser;
