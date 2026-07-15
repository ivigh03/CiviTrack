import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, ImageOff } from "lucide-react";
import { UPLOADS_BASE_URL } from "../../api/axios";
import Card from "../ui/Card";
import TiltCard from "../ui/TiltCard";
import StatusBadge from "../ui/StatusBadge";

const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();
  const getBorderColor = () => {
    if (complaint.status === "in-progress") return "border-blue-500";
    if (complaint.status === "resolved") return "border-green-500";
    if (complaint.status === "pending") return "border-orange-500";
    return "border-gray-500";
  };

  return (
    <TiltCard maxTilt={4}>
      <Card
        padding="none"
        onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
        className="cursor-pointer overflow-hidden transition-shadow hover:shadow-elevated"
      >
        {complaint.image ? (
          <img
            src={`${UPLOADS_BASE_URL}${complaint.image}`}
            alt={complaint.title}
            className="h-36 w-full object-cover"
          />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-elevated text-muted">
            <ImageOff className="h-6 w-6" />
          </div>
        )}

        <div className="p-4">
          <h2 className="truncate font-semibold text-foreground">{complaint.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {complaint.userDescription || "No description"}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <StatusBadge type="status" value={complaint.status} />
            <span className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" />
              {complaint.address || "N/A"}
            </span>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs text-muted">
            <Calendar className="h-3 w-3" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </TiltCard>
  );
};

export default ComplaintCard;
