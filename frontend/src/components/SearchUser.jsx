import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/search.css";
import { all } from "axios";

function SearchUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const allUsers = location.state?.allUsers || [];
  const pinnedUsers = location.state?.pinnedUsers || [];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // array of user objects

  const filtered = (
    query.trim() === ""
      ? allUsers
      : allUsers.filter((u) =>
          u.name.toLowerCase().startsWith(query.toLowerCase()),
        )  ).slice().sort((a, b) => a.name.localeCompare(b.name));

  const toggleSelect = (user) => {
    setSelected((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      if (prev.length >= 5) return prev; // max 5
      return [...prev, user];
    });
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;

    // replace from the right of pinnedUsers
    const newPinned = [...pinnedUsers];
    selected.forEach((user, i) => {
      const alreadyPinned = newPinned.findIndex((u) => u.id === user.id);
      if (alreadyPinned !== -1) return; // already in pinned, skip
      const replaceIndex = newPinned.length - 1 - i;
      if (replaceIndex >= 0) newPinned[replaceIndex] = user;
    });

    navigate("/", { state: { newPinned } });
  };

  return (
    <div className="search-container">
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: "20px", left: "20px" }}
      >
        ← Back to Home
      </button>

      <h1>Search User</h1>

      <div className="search-wrapper">
        <input
          type="text"
          className={`search-input ${filtered.length === 0 ? "no-results" : ""}`}
          placeholder="Type a name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <button
          className="search-confirm"
          onClick={handleConfirm}
          disabled={selected.length === 0}
        >
          Confirm ({selected.length})
        </button>
        {selected.length > 0 && (
          <div className="search-selected">
            <div className="search-chips">
              {selected.map((user) => (
                <span
                  key={user.id}
                  className="search-chip"
                  style={{ backgroundColor: user.color }}
                  onClick={() => toggleSelect(user)}
                >
                  {user.name} ✕
                </span>
              ))}
            </div>
          </div>
        )}
        
        {filtered.length > 0 && (
          <ul className="search-dropdown">
            {filtered.map((user) => {
              const isSelected = !!selected.find((u) => u.id === user.id);
              return (
                <li
                  key={user.id}
                  className={`search-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSelect(user)}
                >
                  <span
                    className="search-dot"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="search-name">{user.name}</span>
                  {isSelected && (
                    <span className="search-tick">
                      {selected.findIndex((u) => u.id === user.id) + 1}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* selected chips */}
      {selected.length > 0 && (
        <div className="search-selected">
          <p>Selected ({selected.length}/5):</p>
          <div className="search-chips">
            {selected.map((user) => (
              <span
                key={user.id}
                className="search-chip"
                style={{ backgroundColor: user.color }}
                onClick={() => toggleSelect(user)}
              >
                {user.name} ✕
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchUser;
