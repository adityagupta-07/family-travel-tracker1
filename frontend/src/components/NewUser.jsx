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
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/new", {
        name: name,
        color: selectedColor,
      });
      navigate("/"); 
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/delete", {name: deleteName});
      navigate("/");
    } catch (err) {
      if (err.response?.status === 404) {
        alert("User not found.");
      } else {
        console.error("Error deleting user:", err);
      }
      navigate("/");
    }
  };


  return (
    <div className="new-user-container">
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
    </div>
  );
}

export default NewUser;
