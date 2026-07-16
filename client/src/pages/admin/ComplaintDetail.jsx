import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCog, Trash2, CheckCircle2, MapPin, ImageOff } from "lucide-react";
import axios, { UPLOADS_BASE_URL } from "../../api/axios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Drawer from "../../components/ui/Drawer";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { cn } from "../../lib/cn";
import ComplaintTimeline from "../../components/shared/ComplaintTimeline";

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "Assigned" },
  { key: "resolved", label: "Resolved" },
];

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    // ✅ Fetch single complaint
    axios
      .get(`/admin/complaints/${id}`)
      .then((res) => {
        setComplaint(res.data);
      })
      .catch((err) => console.log(err));

    // ✅ Fetch staff users
    axios.get("/admin/users").then((res) => {
      const staff = res.data.filter((u) => u.role === "staff");
      setStaffList(staff);
    });
  }, [id]);
  useEffect(() => {
  if (!complaint?.slaDeadline) return;

  const interval = setInterval(() => {
    const now = new Date();
    const deadline = new Date(complaint.slaDeadline);

    const diff = deadline - now;

    if (diff <= 0) {
      setTimeLeft("Expired");
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeLeft(`${hours}h ${minutes}m`);
  }, 1000);

  return () => clearInterval(interval);
}, [complaint]);

  // ✅ Prevent crash
  if (!complaint) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  const getSLATimeLeft = () => {
  if (!complaint.slaDeadline) return null;

  const now = new Date();
  const deadline = new Date(complaint.slaDeadline);

  const diff = deadline - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} hrs left`;
};

  const assignStaff = async (staffId) => {
  try {
    const res = await axios.put(
      `/admin/assign/${id}`,
      { staffId }
    );

    setComplaint(res.data);
    setShowAssign(false);

  } catch (err) {
    console.error("ASSIGN ERROR:", err);
  }
};

  const markResolved = async () => {
    await axios.put(`/admin/complaints/${id}`, {
      status: "resolved",
    });
    window.location.reload();
  };

  const deleteComplaint = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this complaint?"
    );

    if (!confirmed) return;

    await axios.delete(`/admin/complaints/${id}`);
    navigate("/admin/complaints");
  };
  const getPriorityColor = () => {
  if (complaint.priority === "high") return "bg-red-500";
  if (complaint.priority === "medium") return "bg-yellow-500";
  return "bg-green-500";
};

  const activeStep = STEPS.findIndex((s) => s.key === complaint.status);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT */}
      <Card className="md:col-span-2">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">{complaint.title}</h2>
          {complaint.slaDeadline && (
            <Badge variant={timeLeft === "Expired" ? "danger" : "success"}>SLA: {timeLeft}</Badge>
          )}
          {complaint.priority && (
            <span
              className={cn("rounded-full px-3 py-1 text-xs font-semibold text-white", getPriorityColor())}
            >
              {complaint.priority.toUpperCase()}
            </span>
          )}
        </div>

        {complaint.image ? (
          <img
            src={`${UPLOADS_BASE_URL}${complaint.image}`}
            alt=""
            className="mb-4 h-[300px] w-full rounded-xl object-cover"
          />
        ) : (
          <div className="mb-4 flex h-[300px] w-full items-center justify-center rounded-xl bg-elevated text-muted">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        <p className="text-foreground">{complaint.userDescription}</p>

        {complaint.address && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" />
            {complaint.address}
          </p>
        )}

        {(complaint.proofImage || complaint.staffRemark) && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Resolution Proof
            </p>
            {complaint.proofImage && (
              <img
                src={`${UPLOADS_BASE_URL}${complaint.proofImage}`}
                alt="Resolution proof"
                className="h-[300px] w-full rounded-xl object-cover"
              />
            )}
            {complaint.staffRemark && (
              <p className="mt-2 text-muted">Staff remark: {complaint.staffRemark}</p>
            )}
          </div>
        )}

        {/* PROGRESS TIMELINE */}
        <div className="mt-6">
          <h3 className="mb-4 font-semibold text-foreground">Progress Timeline</h3>

          <div className="flex items-center justify-between text-sm">
            {STEPS.map((step, i) => (
              <Fragment key={step.key}>
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "h-4 w-4 rounded-full",
                      activeStep >= i ? "bg-primary" : "bg-elevated"
                    )}
                  />
                  <p className="text-muted">{step.label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-1 flex-1 rounded-full transition-colors",
                      activeStep > i ? "bg-primary" : "bg-elevated"
                    )}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </Card>

      {/* RIGHT PANEL */}
      <div className="flex flex-col gap-6">
        <Card>
          <Button variant="danger" className="w-full" onClick={markResolved}>
            <CheckCircle2 className="h-4 w-4" />
            Mark as Resolved
          </Button>

          <p className="mb-2 mt-5 font-semibold text-foreground">Assigned Staff</p>
          {complaint.assignedTo ? (
            <p className="text-foreground">{complaint.assignedTo.name}</p>
          ) : (
            <p className="text-muted">Not assigned</p>
          )}

          <Button className="mt-4 w-full" onClick={() => setShowAssign(true)}>
            <UserCog className="h-4 w-4" />
            Assign / Reassign Staff
          </Button>

          <Button variant="outline" className="mt-3 w-full border-danger/40 text-danger hover:bg-danger hover:text-white" onClick={deleteComplaint}>
            <Trash2 className="h-4 w-4" />
            Delete Complaint
          </Button>
        </Card>

        {/* ACTIVITY TIMELINE */}
        <Card>
          <ComplaintTimeline activityLog={complaint.activityLog || []} />
        </Card>
      </div>

      {/* ASSIGN PANEL */}
      <Drawer open={showAssign} onOpenChange={setShowAssign} side="right" title="Assign Staff" widthClassName="w-[350px]">
        <div className="p-4">
          {staffList.length === 0 ? (
            <EmptyState title="No staff available" className="border-none bg-transparent" />
          ) : (
            <div className="space-y-1">
              {staffList.map((s) => (
                <div key={s._id} className="flex items-center justify-between border-b border-border py-3">
                  <span className="text-foreground">{s.name}</span>
                  <Button size="sm" variant="secondary" onClick={() => assignStaff(s._id)}>
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default ComplaintDetail;
