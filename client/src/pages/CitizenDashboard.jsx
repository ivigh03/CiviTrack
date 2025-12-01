import { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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

  // ✅ COMPLAINTS STATE
  const complaintsState =
    useSelector(
      (state) => state.complaints
    );

  // ✅ AUTH STATE
  const authState =
    useSelector(
      (state) => state.auth
    );

  // ✅ CURRENT USER
  const user =
    authState?.user;

  // ✅ HANDLE BOTH id AND _id
  const currentUserId =

    user?._id ||

    user?.id ||

    user?.user?._id ||

    user?.user?.id;

  console.log(
    "AUTH STATE:",
    authState
  );

  console.log(
    "CURRENT USER:",
    user
  );

  console.log(
    "CURRENT USER ID:",
    currentUserId
  );

  // ✅ ALL COMPLAINTS
  const complaints =

    complaintsState?.complaints ||

    complaintsState?.data ||

    [];

  const loading =
    complaintsState?.loading ||
    false;

  console.log(
    "ALL COMPLAINTS:",
    complaints
  );

  // ✅ ACTIVE TAB
  const [activeTab, setActiveTab] =
    useState("home");

  // ✅ FILTERS
  const [filters, setFilters] =
    useState({
      category: "",
      area: "",
      date: "",
    });

  // 🔥 FETCH COMPLAINTS
  useEffect(() => {

    dispatch(
      fetchComplaints()
    );

  }, [dispatch]);

  // ✅ ALL FILTERS
  const filtered =
    complaints.filter((c) => {

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
    });

  // ✅ MY COMPLAINTS
  const myComplaints =
    complaints.filter((c) => {

      if (!c.user) {
        return false;
      }

      console.log(
        "COMPLAINT USER:",
        c.user
      );

      // ✅ HANDLE ALL POSSIBLE FORMATS
      const complaintUserId =

        c.user?._id ||

        c.user?.id ||

        c.user;

      console.log(
        "COMPLAINT USER ID:",
        complaintUserId
      );

      return (

        String(complaintUserId) ===

        String(currentUserId)

      );
    });

  console.log(
    "MY COMPLAINTS:",
    myComplaints
  );

  // 🔥 PAGE RENDER
  const renderPage = () => {

    if (loading) {

      return (
        <p>Loading...</p>
      );
    }

    switch (activeTab) {

      // 🏠 HOME
      case "home":

        return (
          <Home
            complaints={complaints}
          />
        );

      // 👤 MY COMPLAINTS
      case "my":

        return (
          <MyComplaints
            complaints={myComplaints}
          />
        );

      // 🌍 ALL COMPLAINTS
      case "all":

        return (
          <AllComplaints
            complaints={filtered}
            filters={filters}
            setFilters={setFilters}
          />
        );

      // 🗺️ HEATMAP
      case "heatmap":

        return <Heatmap />;

      // 🔔 NOTIFICATIONS
      case "notifications":

        return <Notifications />;

      // 🔁 DEFAULT
      default:

        return (
          <Home
            complaints={complaints}
          />
        );
    }
  };

  return (

    <div className="citizen-container">

      {/* 🧭 NAVBAR */}
      <Navbar
        setActiveTab={setActiveTab}
      />

      {/* 🔥 CONTENT */}
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