import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNotifications } from "../../context/NotificationContext";

const Navbar = () => {
  const { notifications } = useNotifications();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

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

        {/* 🔔 Notifications */}
        <div className="relative">
          <NavLink
            to="/admin/notifications"
            className="text-white text-xl hover:scale-110 transition-transform duration-200"
          >
            <FaBell />
          </NavLink>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* PROFILE + LOGOUT */}
      <div className="flex items-center gap-4 text-white">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <FaUserCircle size={28} />
        )}
        <span className="text-sm font-medium">{user?.name || "Admin"}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    end={to === "/admin"}
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

export default Navbar;