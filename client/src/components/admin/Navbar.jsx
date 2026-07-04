import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Flame,
  Bell,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useNotifications } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import Drawer from "../ui/Drawer";
import { cn } from "../../lib/cn";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/complaints", label: "Complaints", icon: ClipboardList },
  { to: "/admin/heatmap", label: "Heatmap", icon: Flame },
];

const Navbar = () => {
  const { notifications } = useNotifications();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-elevated hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-lg font-bold tracking-wide text-foreground">
          CiviTrack <span className="text-primary">Admin</span>
        </span>
      </div>

      {/* NAV LINKS (desktop) */}
      <div className="hidden items-center gap-1 lg:flex">
        {LINKS.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <NavLink
            to="/admin/notifications"
            className="flex rounded-lg p-2 text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </NavLink>
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* PROFILE */}
        <div className="hidden items-center gap-2 sm:flex">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-7 w-7 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated text-xs font-semibold text-foreground">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{user?.name || "Admin"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg bg-elevated px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-danger hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* MOBILE NAV DRAWER */}
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left" title="Menu" widthClassName="w-64">
        <div className="flex flex-col gap-1 p-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-elevated hover:text-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted hover:bg-elevated hover:text-foreground"
      )
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

export default Navbar;
