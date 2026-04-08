import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaMapMarkedAlt,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-8 py-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-700 shadow-lg">
      
      {/* LOGO */}
      <div className="text-white text-xl font-bold tracking-wide">
        CiviTrack
      </div>

      {/* NAV LINKS */}
      <div className="flex gap-8">
        
        <NavItem to="/admin" label="Dashboard" />
        <NavItem to="/admin/users" label="Users" />
        <NavItem to="/admin/complaints" label="Complaints" />
        <NavItem to="/admin/heatmap" label="Heatmap" />
        <NavItem to="/admin/notifications" icon={<FaBell />} label="Notifications" />
      </div>
      

      {/* PROFILE */}
      <div className="flex items-center gap-2 text-white">
        <FaUserCircle size={28} />
        <span className="text-sm font-medium">Admin User</span>
      </div>
      
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 text-sm transition-all duration-200 ${
          isActive
            ? "text-white border-b-2 border-white pb-1"
            : "text-gray-200 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default Navbar;