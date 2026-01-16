import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { UPLOADS_BASE_URL } from "../../api/axios";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import TiltCard from "../ui/TiltCard";

export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

  if (!complaint) return null;

  return (
    <TiltCard maxTilt={5} className="group h-full">
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="h-full">
        <Card
          onClick={() => navigate(`/complaint/${complaint._id}`)}
          className="flex h-full cursor-pointer flex-col overflow-hidden transition-shadow duration-300 hover:shadow-elevated"
          padding="none"
        >
          {complaint.image ? (
            <img
              src={`${UPLOADS_BASE_URL}${complaint.image}`}
              alt={complaint.title}
              className="h-40 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-40 w-full bg-elevated" />
          )}

          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground line-clamp-1">{complaint.title}</h3>
              <StatusBadge type="status" value={complaint.status} />
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {complaint.category}
            </p>

            <p className="flex items-center gap-1.5 text-sm text-muted line-clamp-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {complaint.address}
            </p>

            <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
              <Clock className="h-3 w-3" />
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
        </Card>
      </motion.div>
    </TiltCard>
  );
}
