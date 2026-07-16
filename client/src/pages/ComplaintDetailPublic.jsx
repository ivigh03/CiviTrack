import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThumbsUp, ThumbsDown, MapPin, ShieldCheck } from "lucide-react";
import axios, { UPLOADS_BASE_URL } from "../api/axios";
import { getComplaintById, rateComplaint } from "../api/complaintApi";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";
import ComplaintTimeline from "../components/shared/ComplaintTimeline";
import RatingForm from "../components/shared/RatingForm";

export default function ComplaintDetailPublic() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    const fetchComplaint = async () => {
      const data = await getComplaintById(id);
      setComplaint(data);
    };

    fetchComplaint();
  }, [id]);

  const handleRate = async (stars, comment) => {
    const updated = await rateComplaint(id, { stars, comment });
    setComplaint(updated);
  };

  if (!complaint) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <Card className="mx-auto max-w-2xl overflow-hidden" padding="none">
        {complaint.image && (
          <img
            src={`${UPLOADS_BASE_URL}${complaint.image}`}
            alt="complaint"
            className="h-72 w-full object-cover"
          />
        )}

        {(complaint.proofImage || complaint.staffRemark) && (
          <div className="border-b border-border bg-success/5 p-5">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
              <ShieldCheck className="h-4 w-4" />
              Resolution Proof
            </p>
            {complaint.proofImage && (
              <img
                src={`${UPLOADS_BASE_URL}${complaint.proofImage}`}
                alt="resolution proof"
                className="mb-2 h-56 w-full rounded-lg object-cover"
              />
            )}
            {complaint.staffRemark && (
              <p className="text-sm text-muted">Staff remark: {complaint.staffRemark}</p>
            )}
          </div>
        )}

        <div className="p-6">
          <h1 className="text-xl font-semibold text-foreground">{complaint.title}</h1>

          <Badge variant="primary" className="mt-2">{complaint.category}</Badge>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" />
            {complaint.address}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {complaint.userDescription}
          </p>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => handleVote("upvote")}>
              <ThumbsUp className="h-4 w-4" />
              {complaint.upvotes}
            </Button>

            <Button variant="secondary" onClick={() => handleVote("downvote")}>
              <ThumbsDown className="h-4 w-4" />
              {complaint.downvotes}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mx-auto mt-6 max-w-2xl">
        <ComplaintTimeline activityLog={complaint.activityLog || []} />
      </Card>

      {complaint.status === "resolved" && complaint.user?._id === currentUserId && (
        <Card className="mx-auto mt-6 max-w-2xl">
          {complaint.citizenRating?.stars ? (
            <div>
              <p className="mb-1 text-sm font-medium text-foreground">
                Your rating: {"★".repeat(complaint.citizenRating.stars)}
                {"☆".repeat(5 - complaint.citizenRating.stars)}
              </p>
              {complaint.citizenRating.comment && (
                <p className="text-sm text-muted">{complaint.citizenRating.comment}</p>
              )}
            </div>
          ) : (
            <RatingForm onSubmit={handleRate} />
          )}
        </Card>
      )}
    </div>
  );

  async function handleVote(type) {
    const previous = complaint;

    // ✅ OPTIMISTIC UI — bump the count instantly, reconcile/roll back below
    setComplaint((prev) => ({
      ...prev,
      upvotes: type === "upvote" ? prev.upvotes + 1 : prev.upvotes,
      downvotes: type === "downvote" ? prev.downvotes + 1 : prev.downvotes,
    }));

    try {
      const res = await axios.put(
        `/complaints/${id}/vote`,
        { type }
      );

      setComplaint(res.data.data);
    } catch (err) {
      console.error(err);
      setComplaint(previous);
    }
  }
}
