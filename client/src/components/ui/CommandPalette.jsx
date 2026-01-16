import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LayoutDashboard, LogOut, Moon, Sun, FilePlus2, Home } from "lucide-react";
import { useKeyboardShortcuts } from "../../lib/useKeyboardShortcuts";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../features/auth/authSlice";
import { DASHBOARD_PATH } from "../../constants/roles";
import "./command-palette.css";

// Global quick-access palette (Ctrl/Cmd+K). Only ever calls existing
// navigation/auth functions — no new routes, no new state.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);

  useKeyboardShortcuts({ k: () => setOpen((prev) => !prev) });

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const run = (fn) => {
    fn();
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="command-palette"
    >
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {user && (
          <Command.Group heading="Navigate">
            <Command.Item onSelect={() => run(() => navigate(DASHBOARD_PATH[user.role] || "/citizen"))}>
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Command.Item>
            {user.role === "citizen" && (
              <Command.Item onSelect={() => run(() => navigate("/complaintForm"))}>
                <FilePlus2 className="h-4 w-4" />
                Report a new issue
              </Command.Item>
            )}
            <Command.Item onSelect={() => run(() => navigate("/welcome"))}>
              <Home className="h-4 w-4" />
              Welcome page
            </Command.Item>
          </Command.Group>
        )}

        <Command.Group heading="Preferences">
          <Command.Item onSelect={() => run(toggleTheme)}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Command.Item>
        </Command.Group>

        {user && (
          <Command.Group heading="Account">
            <Command.Item onSelect={() => run(() => { dispatch(logout()); navigate("/login", { replace: true }); })}>
              <LogOut className="h-4 w-4" />
              Log out
            </Command.Item>
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
