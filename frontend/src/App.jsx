import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import useSessionTimeout from "./hooks/useSessionTimeout";

import Home from "./components/Home";
import NewUser from "./components/NewUser";
import ManageCountries from "./components/ManageCountries";
import SearchUser from "./components/SearchUser";
import DeleteUsers from "./components/DeleteUsers";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function AppRoutes() {
  const minutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES) || 30;
  useSessionTimeout(minutes * 60 * 1000);
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/new" element={<ProtectedRoute><NewUser /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchUser /></ProtectedRoute>} />
      <Route path="/manage/:userId" element={<ProtectedRoute><ManageCountries /></ProtectedRoute>} />
      <Route path="/delete-users" element={<ProtectedRoute><DeleteUsers /></ProtectedRoute>} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
