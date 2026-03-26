import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/manage.css";

const API_URL = "http://localhost:3000";

function ManageCountries() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userColor = location.state?.color || "teal";
  const userName = location.state?.name || "User";

  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/countries/${userId}`);
        setCountries(res.data.countries);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, [userId]);

  const toggleSelect = (code) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    try {
      await axios.post(`${API_URL}/api/delete-countries`, {
        userId,
        countryCodes: selected,
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting countries:", err);
    }
  };

  return (
    <div className="manage-container">
      <h1>{userName}'s Visited Countries</h1>

      {countries.length === 0 ? (
        <p className="empty-msg">No countries visited yet.</p>
      ) : (
        <ul className="country-list">
          {countries.map((c) => (
            <li
              key={c.code}
              className={`country-item ${selected.includes(c.code) ? "selected" : ""}`}
              onClick={() => toggleSelect(c.code)}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(c.code)}
                  onChange={() => toggleSelect(c.code)}
                  style={{ accentColor: userColor }}
                />
                {c.name}
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="manage-actions">
        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={selected.length === 0}
          style={{ backgroundColor: userColor }}  // ← dynamic color here
        >
          Delete Selected ({selected.length})
        </button>

        <button className="btn-cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ManageCountries;