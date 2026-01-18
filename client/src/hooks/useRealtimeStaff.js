import { useEffect } from "react";
import socket from "../socket";

// Mirrors useRealtimeAdmin's pattern, but StaffDashboard keeps its
// complaints in local useState rather than Redux — so this hook takes the
// setter directly and upserts by _id instead of dispatching actions. Keeps
// a staff member's dashboard live when a complaint is auto-assigned or
// reassigned to them while they're already on the page.
export default function useRealtimeStaff(setComplaints) {
  useEffect(() => {
    const upsert = (complaint) => {
      setComplaints((prev) => {
        const index = prev.findIndex((c) => c._id === complaint._id);
        if (index === -1) return [complaint, ...prev];
        const next = [...prev];
        next[index] = complaint;
        return next;
      });
    };

    socket.on("complaint:new", upsert);
    socket.on("complaint:updated", upsert);

    return () => {
      socket.off("complaint:new", upsert);
      socket.off("complaint:updated", upsert);
    };
  }, [setComplaints]);
}
