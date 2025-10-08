import { useState } from "react";
import OverviewCards from "../components/staff/OverviewCards";
import ComplaintList from "../components/staff/ComplaintList";
import Notifications from "../components/staff/Notifications";
import dummyStaffComplaints from "../data/dummyStaffComplaints";
import "../styles/staff.css";

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState(dummyStaffComplaints);

  const [notifications, setNotifications] = useState([
    "New complaint assigned",
  ]);

  return (
    <div className="staff-container">
      <div className="staff-navbar">
        <h2>CiviTrack</h2>
        <span>Staff Panel</span>
      </div>

      <div className="staff-content">
        <h1>Staff Dashboard</h1>

        <OverviewCards complaints={complaints} />

        {/* 🔔 Notifications */}
        <Notifications notifications={notifications} />

        <h2 style={{ marginTop: "30px" }}>Assigned Work</h2>

        <ComplaintList
          complaints={complaints}
          setComplaints={setComplaints}
        />
      </div>
    </div>
  );
}