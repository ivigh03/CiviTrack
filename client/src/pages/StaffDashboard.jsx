import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import OverviewCards from "../components/staff/OverviewCards";
import ComplaintList from "../components/staff/ComplaintList";
import Notifications from "../components/staff/Notifications";
import { getAllComplaints } from "../api/complaintApi";
import "../styles/staff.css";

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const loggedInUserId = user?.user?.id;

  
   

  const [notifications] = useState([
    "New complaint assigned",
  ]);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
  if (user) {
    fetchData();
  }
}, [user]);

useEffect(() => {
  console.log("FULL COMPLAINTS DATA:", complaints);
}, [complaints]);

  // ✅🔥 FINAL FIXED FILTER (ObjectId safe)
  const activeComplaints = complaints
  .filter((c) => {
    if (!c.assignedTo || !loggedInUserId) return false;

    const assignedId =
      typeof c.assignedTo === "object"
        ? c.assignedTo._id
        : c.assignedTo;

    return String(assignedId) === String(loggedInUserId);
  })
  .filter((c) => c.status !== "resolved");
  return (
    <div className="staff-container">
      {/* 🧭 Navbar */}
      <div className="staff-navbar">
        <h2>CiviTrack</h2>
        <span>Staff Panel</span>
      </div>

      <div className="staff-content">
        <h1>Staff Dashboard</h1>

        {loading ? (
          <p>Loading complaints...</p>
        ) : (
          <>
            {/* 📊 Overview */}
            <OverviewCards complaints={activeComplaints} />

            {/* 🔔 Notifications */}
            <Notifications notifications={notifications} />

            {/* 📋 Work Section */}
            <h2 style={{ marginTop: "30px" }}>Assigned Work</h2>

            {activeComplaints.length === 0 ? (
              <p>No active complaints 🎉</p>
            ) : (
              <ComplaintList
                complaints={activeComplaints}
                setComplaints={setComplaints}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}


