import { motion } from "framer-motion";
import { ClipboardList, Loader2, Clock3, CheckCircle2 } from "lucide-react";
import Card from "../ui/Card";
import TiltCard from "../ui/TiltCard";

export default function OverviewCards({ complaints = [] }) {
  const assigned = complaints.filter(c => c.status === "pending").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;
  const completed = complaints.filter(c => c.status === "resolved").length;

  const stats = [
    { label: "Assigned", value: assigned, icon: ClipboardList, tint: "text-primary" },
    { label: "In Progress", value: inProgress, icon: Loader2, tint: "text-info" },
    { label: "Pending", value: assigned, icon: Clock3, tint: "text-warning" },
    { label: "Completed", value: completed, icon: CheckCircle2, tint: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <TiltCard maxTilt={6}>
            <Card className="flex flex-col items-center gap-2 text-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-elevated ${item.tint}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted">{item.label}</p>
            </Card>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
}
