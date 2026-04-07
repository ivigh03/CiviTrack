import { useState } from "react";
import { useSelector } from "react-redux";
import StatsCards from "../components/dashboard/StatsCards";
import ComplaintList from "../components/dashboard/ComplaintList";
import Filters from "../components/dashboard/Filters";
import "../styles/dashboard.css";

export default function CitizenDashboard() {
  const { complaints } = useSelector((state) => state.complaints);

  const [filters, setFilters] = useState({
    category: "",
    area: "",
    date: "",
  });

  const filtered = complaints.filter((c) => {
    return (
      (!filters.category || c.category === filters.category) &&
      (!filters.area || c.area.toLowerCase().includes(filters.area.toLowerCase())) &&
      (!filters.date || c.createdAt === filters.date)
    );
  });

  return (
    <div className="dashboard-container">
      {/* 🧭 Navbar */}
      <div className="navbar">
        <h2>CiviTrack</h2>
        <span>Citizen</span>
      </div>

      <div className="dashboard">
        <h1>Dashboard</h1>

        <StatsCards complaints={filtered} />

        <Filters filters={filters} setFilters={setFilters} />

        <ComplaintList complaints={filtered} />
      </div>
    </div>
  );
}