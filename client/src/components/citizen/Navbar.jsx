import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Navbar({ setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);

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

      {!collapsed && <h2>CiviTrack</h2>}

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

      <button className="logout">
        🚪 {!collapsed && "Logout"}
      </button>
    </motion.div>
  );
}