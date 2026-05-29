import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaints } from "../features/complaints/complaintSlice";
import { motion } from "framer-motion";

import Navbar from "../components/citizen/Navbar";
import Home from "../components/citizen/Home";
import MyComplaints from "../components/citizen/MyComplaints";
import AllComplaints from "../components/citizen/AllComplaints";
import Heatmap from "../components/citizen/Heatmap";
import Notifications from "../components/citizen/Notifications";

import "../styles/citizen.css";

export default function CitizenDashboard() {
  const dispatch = useDispatch();

  // ✅ SAFE FALLBACK
  const {
    complaints = [],
    loading,
  } = useSelector((state) => state.complaints);

  const [activeTab, setActiveTab] =
    useState("home");

  const [filters, setFilters] = useState({
    category: "",
    area: "",
    date: "",
  });

  // 🔥 FETCH DATA
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // ✅ SAFE FILTER
  const filtered =
    complaints?.filter((c) => {
      return (
        (!filters.category ||
          c.category ===
            filters.category) &&

        (!filters.area ||
          c.address
            ?.toLowerCase()
            .includes(
              filters.area.toLowerCase()
            )) &&

        (!filters.date ||
          c.createdAt?.slice(0, 10) ===
            filters.date)
      );
    }) || [];

  // 🔥 PAGE RENDERER
  const renderPage = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    switch (activeTab) {
      case "home":
        return (
          <Home complaints={complaints} />
        );

      case "my":
        return (
          <MyComplaints
            complaints={filtered}
          />
        );

      case "all":
        return (
          <AllComplaints
            complaints={filtered}
            filters={filters}
            setFilters={setFilters}
          />
        );

      case "heatmap":
        return <Heatmap />;

      case "notifications":
        return <Notifications />;

      default:
        return (
          <Home complaints={complaints} />
        );
    }
  };

  return (
    <div className="citizen-container">
      <Navbar
        setActiveTab={setActiveTab}
      />

      {/* 🔥 Animated Page */}
      <motion.div
        key={activeTab}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="citizen-content"
      >
        {renderPage()}
      </motion.div>
    </div>
  );
}