import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import OverviewCards from "../components/staff/OverviewCards";
import ComplaintList from "../components/staff/ComplaintList";
import Notifications from "../components/staff/Notifications";

import { getAllComplaints } from "../api/complaintApi";

import "../styles/staff.css";

export default function StaffDashboard() {

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [notifications] = useState([
    "New complaint assigned",
  ]);

  // ✅ REDUX
  const { user } = useSelector(
    (state) => state.auth
  );

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

      console.log(
        "ALL COMPLAINTS:",
        data
      );

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

  // 🧪 DEBUG
  useEffect(() => {

    console.log(
      "LOGGED IN USER:",
      user
    );

    console.log(
      "USER ID:",
      loggedInUserId
    );

    console.log(
      "FULL COMPLAINTS DATA:",
      complaints
    );

  }, [
    complaints,
    user,
    loggedInUserId,
  ]);

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

    <div className="staff-container">

      {/* 🧭 Navbar */}
      <div className="staff-navbar">

        <h2>CiviTrack</h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >

          <span>Staff Panel</span>

          {/* ✅ LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </div>

      {/* 📦 CONTENT */}
      <div className="staff-content">

        <h1>
          Staff Dashboard
        </h1>

        {loading ? (

          <p>
            Loading complaints...
          </p>

        ) : (

          <>

            {/* 📊 OVERVIEW */}
            <OverviewCards
              complaints={
                activeComplaints
              }
            />

            {/* 🔔 NOTIFICATIONS */}
            <Notifications
              notifications={
                notifications
              }
            />

            {/* 📋 WORK */}
            <h2
              style={{
                marginTop: "30px",
              }}
            >
              Assigned Work
            </h2>

            {activeComplaints.length === 0 ? (

              <p>
                No active complaints 🎉
              </p>

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