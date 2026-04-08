import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
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

// ✅ NAVBAR
import Navbar from "./components/admin/Navbar";

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
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;