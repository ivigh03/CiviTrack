import React, { useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import CitizenDashboard from "./pages/CitizenDashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import StaffDashboard from "./pages/StaffDashboard";
import ComplaintForm from "./pages/ComplaintForm";

// 🧠 Simple Admin Dashboard
const AdminDashboard = () => <h1>Admin Dashboard</h1>;

// ✅ MAIN APP (Single Entry Point)
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🏠 Complaint Form (default landing after login ideally) */}
        <Route path="/complaintForm" element={<ComplaintForm />} />

        {/* 🔐 Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen"
          element={
            <ProtectedRoute role="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/complaint/:id" element={<ComplaintDetail />} />

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;