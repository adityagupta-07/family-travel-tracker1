import React, { useState, useEffect } from "react";
import "../styles/main.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import UserSelector from "./UserSelector";
import AddCountryForm from "./AddCountryForm";
import Map from "./Map";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3000";

function Home() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [error, setError] = useState(null);
  const [pinnedUsers, setPinnedUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data`);
      const allUsers = response.data.users || [];
      setUsers(allUsers);
      // response = {
      //   data: {              // ← object
      //     users: [...],      // ← array
      //     countries: [...],  // ← array
      //     currentUser: {}    // ← object
      //   }
      // }

      setPinnedUsers((prev) => {
        if (prev.length === 0) return allUsers.slice(0, 5);
        // keep existing pinned, update their data (name/color might change)
        return prev
          .map((p) => allUsers.find((u) => u.id === p.id))
          .filter(Boolean);
      });

      const user =
        allUsers.find((u) => u.id === response.data.currentUser?.id) ||
        allUsers[0] ||
        null;
      setCurrentUser(user);
      setVisitedCountries(response.data.countries || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setUsers([]);
      setCurrentUser(null);
      setVisitedCountries([]);
    }
  };

  const handlePinnedUsersChange = (newPinned) => {
    setPinnedUsers(newPinned);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.newPinned) {
      const newPinned = location.state.newPinned;
      setPinnedUsers(newPinned);

      const stillPinned = newPinned.find((u) => u.id === currentUser?.id);
      if (!stillPinned && newPinned.length > 0) {
        handleUserChange(newPinned[0].id);
      }

      window.history.replaceState({}, "");
    }
  }, [location.state?.newPinned]);

  const handleUserChange = async (userId) => {
    try {
      await axios.post(`${API_URL}/user`, { user: userId });
      fetchData();
    } catch (err) {
      console.error("Error switching user:", err);
    }
  };

  const handleAddCountry = async (countryName) => {
    if (!currentUser) return;
    try {
      await axios.post(`${API_URL}/add`, { country: countryName });
      setError(null);
      fetchData();
    } catch (err) {
      setError("Country name does not exist or already added.");
    }
  };

  return (
    <div className="home-container">
      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>
      {users.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h2>Please add a family member first.</h2>
          <button onClick={() => navigate("/new")}>Add a family member</button>
        </div>
      ) : (
        <>
          <UserSelector
            // users={users} //all users
            users={pinnedUsers} //only pinned users
            currentUserId={currentUser?.id} //currentUser id
            onSelect={handleUserChange}
            onAddNew={() => navigate("/new")}
            onManageCountries={() =>
              navigate(`/manage/${currentUser?.id}`, {
                state: { color: currentUser?.color, name: currentUser?.name },
              })
            }
            onSearchUser={() =>
              navigate("/search", {
                state: { pinnedUsers, allUsers: users },
              })
            }
            showSearch={users.length > 5}
          />

          <AddCountryForm
            onAdd={handleAddCountry}
            color={currentUser?.color || "black"}
            error={error}
          />

          <Map
            visitedCountries={visitedCountries}
            userColor={currentUser?.color || "black"}
          />

          <h2 className="total-count">
            Total Countries: {visitedCountries.length}
          </h2>
        </>
      )}
    </div>
  );
}

export default Home;
