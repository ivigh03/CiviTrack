import React from "react";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WelcomeSplash from "./pages/WelcomeSplash";
import ProtectedRoute from "./components/ProtectedRoute";

import CitizenDashboard from "./pages/CitizenDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import ComplaintForm from "./pages/ComplaintForm";


// ✅ ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import Complaints from "./pages/admin/Complaints";
import UsersPage from "./pages/admin/UsersPage";
import Heatmap from "./components/admin/Heatmap";
import ComplaintDetails from "./pages/admin/ComplaintDetail";
import Notifications from "./pages/admin/Notifcations";
import socket from "./socket";
// ✅ NAVBAR
import Navbar from "./components/admin/Navbar";

// ✨ Design system
import AppToaster from "./components/ui/Toast";
import CommandPalette from "./components/ui/CommandPalette";
import { TooltipProvider } from "./components/ui/Tooltip";

// ✅ Wrapper
const AdminWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

function App() {
  useEffect(() => {
  socket.on("newNotification", (data) => {
    console.log("Global:", data);
  });

  return () => socket.off("newNotification");
}, []);
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppToaster />
        <CommandPalette />
        <Routes>

        {/* 🔓 Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👋 Post-login landing page */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomeSplash />
            </ProtectedRoute>
          }
        />

        {/* 📝 Complaint Form */}
        {/* 📝 Complaint */}
        <Route path="/complaintForm" element={<ComplaintForm />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />

        {/* 🔐 Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <AdminDashboard />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="admin">
              <AdminWrapper>
                <Complaints />
              </AdminWrapper>
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/users"
  element={
    <ProtectedRoute role="admin">
      <AdminWrapper>
        <UsersPage />
      </AdminWrapper>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/heatmap"
  element={
    <ProtectedRoute role="admin">
      <AdminWrapper>
        <Heatmap />
      </AdminWrapper>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/complaints/:id"
  element={
    <ProtectedRoute role="admin">
      <AdminWrapper>
        <ComplaintDetails />
      </AdminWrapper>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/notifications"
  element={
    <ProtectedRoute role="admin">
      <AdminWrapper>
        <Notifications />
      </AdminWrapper>
    </ProtectedRoute>
  }
/>

        {/* 🔐 Staff */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute role="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Citizen */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute role="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Default */}
        {/* 🔁 Fallback */}
{/* HOME */}
<Route
  path="/"
  element={<Navigate to="/login" />}
/>

{/* FALLBACK */}
<Route
  path="*"
  element={<Navigate to="/" />}
/>

        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;