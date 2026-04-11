import React from "react";
import { NavLink } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

import { useNotifications } from "../../context/NotificationContext";

const Navbar = () => {
  const { notifications } = useNotifications();

  const unreadCount =
    notifications?.filter((n) => !n.read)?.length || 0;

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-700 shadow-lg">

      {/* LOGO */}
      <div className="text-white text-xl font-bold tracking-wide">
        CiviTrack
      </div>

      {/* NAV LINKS */}
      <div className="flex gap-8 items-center">

        <NavItem to="/admin" label="Dashboard" />
        <NavItem to="/admin/users" label="Users" />
        <NavItem to="/admin/complaints" label="Complaints" />
        <NavItem to="/admin/heatmap" label="Heatmap" />

        {/* 🔔 NOTIFICATION ICON */}
        <div className="relative">
          <NavLink to="/admin/notifications" className="text-white text-lg">
            <FaBell />
          </NavLink>

          {/* 🔥 BADGE */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

      </div>

      {/* PROFILE */}
      <div className="flex items-center gap-2 text-white">
        <FaUserCircle size={28} />
        <span className="text-sm font-medium">Admin User</span>
      </div>

    </div>
  );
};

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm transition-all duration-200 ${
          isActive
            ? "text-white border-b-2 border-white pb-1"
            : "text-gray-200 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default Navbar;