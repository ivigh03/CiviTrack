import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import TiltCard from "../ui/TiltCard";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Complaints",
      value: stats?.total || 0,
      icon: ClipboardList,
      tint: "text-primary",
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: CheckCircle2,
      tint: "text-success",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Clock3,
      tint: "text-warning",
    },
    {
      title: "Escalated",
      value: stats?.escalated || 0,
      icon: AlertTriangle,
      tint: "text-danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <TiltCard maxTilt={6}>
            <Card className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{card.title}</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">{card.value}</h2>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-elevated ${card.tint}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </Card>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
