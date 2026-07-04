import { FolderOpen } from "lucide-react";
import ComplaintCard from "./ComplaintCard";
import EmptyState from "../ui/EmptyState";
import { SkeletonCard } from "../ui/Skeleton";
import { StaggerList, StaggerItem } from "../ui/AnimatedContainer";

export default function ComplaintList({ complaints, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No complaints found"
        description="Nothing to show here yet — check back later or adjust your filters."
      />
    );
  }

  return (
    <StaggerList className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {complaints.map((c) => (
        <StaggerItem key={c._id}>
          <ComplaintCard complaint={c} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
