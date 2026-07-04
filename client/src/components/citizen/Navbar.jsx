import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Folder,
  Globe2,
  Flame,
  Bell,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import Drawer from "../ui/Drawer";
import Tooltip from "../ui/Tooltip";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "my", label: "My Complaints", icon: Folder },
  { key: "all", label: "All Complaints", icon: Globe2 },
  { key: "heatmap", label: "Heatmap", icon: Flame },
  { key: "notifications", label: "Notifications", icon: Bell },
];

function NavButton({ item, active, collapsed, onClick }) {
  const button = (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-card"
          : "text-muted hover:bg-elevated hover:text-foreground"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && item.label}
    </button>
  );

  return collapsed ? <Tooltip content={item.label} side="right">{button}</Tooltip> : button;
}

function SidebarContent({ collapsed, activeTab, setActiveTab, user, onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleSelect = (key) => {
    setActiveTab(key);
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col gap-1 p-3">
      {!collapsed && (
        <div className="mb-4 flex items-center gap-3 px-2 py-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">CiviTrack</p>
            {user?.name && <p className="truncate text-xs text-muted">{user.name}</p>}
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={activeTab === item.key}
            collapsed={collapsed}
            onClick={() => handleSelect(item.key)}
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
        <Tooltip content={collapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : null} side="right">
          <button
            onClick={toggleTheme}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-foreground ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            {!collapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
          </button>
        </Tooltip>

        <Tooltip content={collapsed ? "Logout" : null} side="right">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && "Logout"}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default function CitizenNavbar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-foreground hover:bg-elevated"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold text-foreground">CiviTrack</p>
        <div className="w-9" />
      </div>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title="CiviTrack" widthClassName="w-64">
        <SidebarContent
          collapsed={false}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface md:flex md:flex-col"
      >
        <SidebarContent collapsed={collapsed} activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-3 mb-3 flex items-center justify-center rounded-xl border border-border py-2 text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </motion.aside>
    </>
  );
}
