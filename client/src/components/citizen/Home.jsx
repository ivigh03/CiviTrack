import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ClipboardList, CheckCircle2, Clock3 } from "lucide-react";
import Card from "../ui/Card";
import TiltCard from "../ui/TiltCard";
import Button from "../ui/Button";
import GradientMesh from "../ui/GradientMesh";

export default function Home({ complaints }) {
  const navigate = useNavigate();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const pending = complaints.filter((c) => c.status === "pending").length;

  const stats = [
    { label: "Total Complaints", value: total, icon: ClipboardList, tint: "text-primary" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, tint: "text-success" },
    { label: "Pending", value: pending, icon: Clock3, tint: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <Card
        variant="glass"
        padding="lg"
        className="relative overflow-hidden"
      >
        <GradientMesh />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Report an Issue</h2>
            <p className="mt-1 text-sm text-muted">
              Spotted a civic problem? Let us know and we'll get it fixed.
            </p>
          </div>
          <Button onClick={() => navigate("/complaintForm")} size="lg">
            <Plus className="h-4 w-4" />
            New Complaint
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <TiltCard maxTilt={6}>
              <Card className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-elevated ${item.tint}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted">{item.label}</p>
                </div>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
