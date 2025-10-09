import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComplaints,
  updateStatus,
  assignStaff,
} from "../../features/complaint/complaintSlice";
import ComplaintCard from "../../components/admin/ComplaintCard";

const Complaints = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.complaints);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchComplaints());
  }, []);

  if (loading) return <p>Loading...</p>;

  const filtered = data
    .filter((c) =>
      c.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) =>
      statusFilter === "ALL" ? true : c.status === statusFilter
    );

  return (
    <div>
      <h1 className="text-2xl mb-4">Complaints</h1>

      {/* 🔍 FILTERS */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* 📋 LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            onStatusChange={(id, status) =>
              dispatch(updateStatus({ id, status }))
            }
            onAssign={(id, staffId) =>
              dispatch(assignStaff({ id, staffId }))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Complaints;