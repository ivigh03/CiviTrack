import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";
import { UPLOADS_BASE_URL } from "../../api/axios";
import Timeline from "./Timeline";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";

export default function ComplaintCard({ complaint, handleAction }) {
  // 🔥 SAFETY (prevents crash)
  if (!complaint) return null;

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Card className="mb-4">
        {/* 🔝 TOP */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground">{complaint.title || "No Title"}</h3>
          <StatusBadge type="severity" value={complaint.severity || "medium"} />
        </div>

        {/* 📍 ADDRESS */}
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {complaint.address || "No address"}
        </p>

        {/* 📊 STATUS */}
        <p className="mt-1 text-sm text-muted">
          Status: <span className="capitalize text-foreground">{complaint.status}</span>
        </p>

        {/* 🔥 IMAGE */}
        {complaint.image && (
          <img
            src={`${UPLOADS_BASE_URL}${complaint.image}`}
            alt="complaint"
            className="mt-3 h-40 w-full rounded-lg object-cover"
          />
        )}

        {/* 🔥 TIMELINE */}
        <Timeline status={complaint.status} />

        {/* 🔥 ACTION BUTTONS */}
        {complaint.status === "pending" && (
          <Button className="mt-2" onClick={() => handleAction(complaint)}>
            Start Work
          </Button>
        )}

        {complaint.status === "in-progress" && (
          <Button className="mt-2" onClick={() => handleAction(complaint)}>
            Mark Completed
          </Button>
        )}

        {complaint.status === "resolved" && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </p>
        )}
      </Card>
    </motion.div>
  );
}
