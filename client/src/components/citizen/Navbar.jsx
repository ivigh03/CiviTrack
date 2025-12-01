import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

export default function CitizenNavbar({ setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 240 }}
      className="citizen-navbar"
    >
      <button
        className="toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "👉" : "👈"}
      </button>

      {!collapsed && (
        <div className="navbar-user-info">
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="navbar-avatar" />
          )}
          <h2>CiviTrack</h2>
          {user?.name && (
            <p className="navbar-username">{user.name}</p>
          )}
        </div>
      )}

      <button onClick={() => setActiveTab("home")}>
        🏠 {!collapsed && "Home"}
      </button>

      <button onClick={() => setActiveTab("my")}>
        📂 {!collapsed && "My Complaints"}
      </button>

      <button onClick={() => setActiveTab("all")}>
        🌍 {!collapsed && "All Complaints"}
      </button>

      <button onClick={() => setActiveTab("heatmap")}>
        🔥 {!collapsed && "Heatmap"}
      </button>

      <button onClick={() => setActiveTab("notifications")}>
        🔔 {!collapsed && "Notifications"}
      </button>

      <button className="logout" onClick={handleLogout}>
        🚪 {!collapsed && "Logout"}
      </button>
    </motion.div>
  );
}