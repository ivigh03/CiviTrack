import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../socket";
import { dashboardUpdated } from "../features/dashboard/dashboardSlice";
import { complaintAdded, complaintUpdated } from "../features/complaints/complaintSlice";

// Mounted once (inside AdminWrapper) so every admin page shares one set of
// listeners — the server already scopes these events to the "admins" room,
// this hook just keeps Redux in sync with them.
export default function useRealtimeAdmin() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDashboardUpdate = (snapshot) => dispatch(dashboardUpdated(snapshot));
    const handleComplaintNew = (complaint) => dispatch(complaintAdded(complaint));
    const handleComplaintUpdated = (complaint) => dispatch(complaintUpdated(complaint));

    socket.on("dashboard:update", handleDashboardUpdate);
    socket.on("complaint:new", handleComplaintNew);
    socket.on("complaint:updated", handleComplaintUpdated);

    return () => {
      socket.off("dashboard:update", handleDashboardUpdate);
      socket.off("complaint:new", handleComplaintNew);
      socket.off("complaint:updated", handleComplaintUpdated);
    };
  }, [dispatch]);
}
