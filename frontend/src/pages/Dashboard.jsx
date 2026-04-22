import { useAuth } from "../context/AuthContext";
import useSessionTimeout from "../hooks/useSessionTimeout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const minutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES) || 30;
  useSessionTimeout(minutes * 60 * 1000);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;