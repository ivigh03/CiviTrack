import { motion } from "framer-motion";
import { Star, Award, Trophy, ThumbsDown } from "lucide-react";
import Card from "../ui/Card";
import TiltCard from "../ui/TiltCard";
import EmptyState from "../ui/EmptyState";
import { StaggerList, StaggerItem } from "../ui/AnimatedContainer";

const SatisfactionStats = ({ stats, topRatedStaff, worstRatedStaff }) => {
  const cards = [
    {
      title: "Average Staff Rating",
      value: stats?.avgRating != null ? `★ ${stats.avgRating}` : "No ratings yet",
      icon: Star,
      tint: "text-warning",
    },
    {
      title: "Average Resolution Quality",
      value: stats?.avgResolutionQuality != null ? `★ ${stats.avgResolutionQuality}` : "No ratings yet",
      icon: Award,
      tint: "text-primary",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Citizen Satisfaction</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <Card className="mt-4">
        <h3 className="mb-4 text-base font-semibold text-foreground">Staff Leaderboard</h3>

        {!topRatedStaff ? (
          <EmptyState icon={Star} title="No rated staff yet" className="border-none bg-transparent py-8" />
        ) : (
          <StaggerList className="space-y-4">
            <StaggerItem className="flex items-center justify-between border-l-2 border-success pl-4">
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Trophy className="h-3.5 w-3.5 text-success" />
                  Top Rated: {topRatedStaff.name}
                </p>
                <p className="text-sm text-muted">based on {topRatedStaff.ratingCount} rating{topRatedStaff.ratingCount === 1 ? "" : "s"}</p>
              </div>
              <span className="text-lg font-bold text-foreground">★ {topRatedStaff.avgRating}</span>
            </StaggerItem>

            {worstRatedStaff ? (
              <StaggerItem className="flex items-center justify-between border-l-2 border-danger pl-4">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-foreground">
                    <ThumbsDown className="h-3.5 w-3.5 text-danger" />
                    Worst Rated: {worstRatedStaff.name}
                  </p>
                  <p className="text-sm text-muted">based on {worstRatedStaff.ratingCount} rating{worstRatedStaff.ratingCount === 1 ? "" : "s"}</p>
                </div>
                <span className="text-lg font-bold text-foreground">★ {worstRatedStaff.avgRating}</span>
              </StaggerItem>
            ) : (
              <p className="text-sm text-muted">Not enough data yet for a distinct "worst rated" staff member.</p>
            )}
          </StaggerList>
        )}
      </Card>
    </div>
  );
};

export default SatisfactionStats;
