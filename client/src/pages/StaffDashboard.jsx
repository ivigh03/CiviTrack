import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, PartyPopper, Sun, Moon } from "lucide-react";

import OverviewCards from "../components/staff/OverviewCards";
import ComplaintList from "../components/staff/ComplaintList";
import Notifications from "../components/staff/Notifications";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useTheme } from "../context/ThemeContext";

import { getAllComplaints } from "../api/complaintApi";

export default function StaffDashboard() {

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ✅ REDUX
  const { user } = useSelector(
    (state) => state.auth
  );

  const { theme, toggleTheme } = useTheme();

  // ✅ SUPPORT BOTH STRUCTURES
  const loggedInUserId =
    user?.user?.id ||
    user?.user?._id ||
    user?.id ||
    user?._id;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ✅ LOGOUT
  const handleLogout = () => {

    // Clear storage
    localStorage.clear();

    sessionStorage.clear();

    // Optional redux cleanup
    dispatch({
      type: "auth/logout",
    });

    // Redirect
    navigate("/login");
  };

  // 🔥 FETCH DATA
  const fetchData = async () => {

    try {

      const data =
        await getAllComplaints();

      setComplaints(data);

    } catch (err) {

      console.error(
        "Error fetching complaints:",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  // ✅ FETCH ON LOGIN
  useEffect(() => {

    if (user) {
      fetchData();
    }

  }, [user]);

  // ✅ FILTER STAFF COMPLAINTS
  const activeComplaints =
    complaints

      .filter((c) => {

        if (
          !c.assignedTo ||
          !loggedInUserId
        ) {
          return false;
        }

        const assignedId =

          typeof c.assignedTo ===
          "object"

            ? c.assignedTo._id

            : c.assignedTo;

        return (
          String(assignedId) ===
          String(loggedInUserId)
        );
      })

      .filter(
        (c) =>
          c.status !== "resolved"
      );

  return (

    <div className="min-h-screen bg-background">

      {/* 🧭 Navbar */}
      <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-8">

        <h2 className="text-lg font-semibold text-foreground">CiviTrack</h2>

        <div className="flex items-center gap-3">

          <span className="hidden text-sm text-muted sm:inline">Staff Panel</span>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-elevated hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* ✅ LOGOUT BUTTON */}
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

        </div>

      </div>

      {/* 📦 CONTENT */}
      <div className="px-4 py-6 sm:px-8">

        <h1 className="mb-6 text-xl font-semibold text-foreground">
          Staff Dashboard
        </h1>

        {loading ? (

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

        ) : (

          <>

            {/* 📊 OVERVIEW */}
            <OverviewCards
              complaints={
                activeComplaints
              }
            />

            {/* 🔔 NOTIFICATIONS */}
            <div className="mt-8">
              <Notifications />
            </div>

            {/* 📋 WORK */}
            <h2 className="mb-4 mt-8 text-lg font-semibold text-foreground">
              Assigned Work
            </h2>

            {activeComplaints.length === 0 ? (

              <EmptyState
                icon={PartyPopper}
                title="No active complaints"
                description="You're all caught up — nothing assigned to you right now."
              />

            ) : (

              <ComplaintList
                complaints={
                  activeComplaints
                }
                setComplaints={
                  setComplaints
                }
              />

            )}

          </>

        )}

      </div>

    </div>
  );
}
