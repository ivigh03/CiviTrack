import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaints } from "../features/complaints/complaintSlice";

import Navbar from "../components/citizen/Navbar";
import Home from "../components/citizen/Home";
import MyComplaints from "../components/citizen/MyComplaints";
import AllComplaints from "../components/citizen/AllComplaints";
import Heatmap from "../components/citizen/Heatmap";
import Notifications from "../components/citizen/Notifications";
import PageTransition from "../components/ui/PageTransition";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function CitizenDashboard() {
  const dispatch = useDispatch();

  const complaintsState = useSelector((state) => state.complaints);
  const authState = useSelector((state) => state.auth);

  const user = authState?.user;

  // ✅ HANDLE BOTH id AND _id
  const currentUserId = user?._id || user?.id || user?.user?._id || user?.user?.id;

  // ✅ ALL COMPLAINTS
  const complaints = complaintsState?.complaints || complaintsState?.data || [];
  const loading = complaintsState?.loading || false;

  // ✅ ACTIVE TAB
  const [activeTab, setActiveTab] = useState("home");

  // ✅ FILTERS
  const [filters, setFilters] = useState({
    category: "",
    area: "",
    date: "",
  });

  // 🔥 FETCH COMPLAINTS
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // ✅ ALL FILTERS
  const filtered = complaints.filter((c) => {
    return (
      (!filters.category || c.category === filters.category) &&
      (!filters.area || c.address?.toLowerCase().includes(filters.area.toLowerCase())) &&
      (!filters.date || c.createdAt?.slice(0, 10) === filters.date)
    );
  });

  // ✅ MY COMPLAINTS
  const myComplaints = complaints.filter((c) => {
    if (!c.user) return false;

    // ✅ HANDLE ALL POSSIBLE FORMATS
    const complaintUserId = c.user?._id || c.user?.id || c.user;

    return String(complaintUserId) === String(currentUserId);
  });

  // 🔥 PAGE RENDER
  const renderPage = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case "home":
        return <Home complaints={complaints} />;
      case "my":
        return <MyComplaints complaints={myComplaints} />;
      case "all":
        return <AllComplaints complaints={filtered} filters={filters} setFilters={setFilters} />;
      case "heatmap":
        return <Heatmap />;
      case "notifications":
        return <Notifications />;
      default:
        return <Home complaints={complaints} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PageTransition id={activeTab}>{renderPage()}</PageTransition>
      </main>
    </div>
  );
}
