import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Download, X } from "lucide-react";
import { fetchComplaints } from "../../features/complaints/complaintSlice";
import ComplaintCard from "../../components/admin/ComplaintCard";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { StaggerList, StaggerItem } from "../../components/ui/AnimatedContainer";
import axios from "../../api/axios";

const Complaints = () => {
  const dispatch = useDispatch();

  const { complaints = [], loading } = useSelector((state) => state.complaints);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const handleExportCSV = async () => {
    const res = await axios.get("/admin/complaints/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "complaints.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // 🔥 FETCH
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // 🔍 FILTER
  const categories = [...new Set(complaints.map((c) => c.category).filter(Boolean))];

  const filtered = complaints
    .filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => (statusFilter === "ALL" ? true : c.status === statusFilter))
    .filter((c) => (categoryFilter === "ALL" ? true : c.category === categoryFilter));

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-foreground">Complaints</h1>

      {/* FILTER BAR */}
      <Card className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px] flex-1">
          <Input
            label="Search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="min-w-[160px]">
          <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>

        <div className="min-w-[160px]">
          <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); }}>
          <X className="h-4 w-4" />
          Clear
        </Button>

        <Button onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </Card>

      {/* COUNT */}
      <p className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Search className="h-3.5 w-3.5" />
        Found {filtered.length} complaints
      </p>

      {/* GRID */}
      {filtered.length === 0 ? (
        <EmptyState title="No complaints found" description="Try adjusting your filters." />
      ) : (
        <StaggerList className="grid gap-5 md:grid-cols-3">
          {filtered.map((c) => (
            <StaggerItem key={c._id}>
              <ComplaintCard complaint={c} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
};

export default Complaints;
