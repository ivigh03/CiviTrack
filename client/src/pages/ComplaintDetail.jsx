import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MapPin, ShieldCheck } from "lucide-react";
import axios, { UPLOADS_BASE_URL } from "../api/axios";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      const res = await axios.get("/complaints");

      const found = res.data.data.find((c) => c._id === id);
      setComplaint(found);
    };

    fetchComplaint();
  }, [id]);

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
    </div>
  );

  async function handleVote(type) {
    try {
      const res = await axios.put(
        `/complaints/${id}/vote`,
        { type }
      );

      setComplaint(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }
}
