import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users as UsersIcon } from "lucide-react";
import axios from "../../api/axios";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";

const AXIS_COLOR = "#94a3b8";

const tooltipStyle = {
  background: "rgb(var(--color-surface))",
  border: "1px solid rgb(var(--color-border) / var(--border-opacity))",
  borderRadius: 12,
  color: "rgb(var(--color-foreground))",
  fontSize: 13,
};

const StaffPerformance = () => {
  const [staff, setStaff] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/admin/staff-performance")
      .then((res) => {
        setStaff(res.data.staff);
        setMonthlyTrend(res.data.monthlyTrend);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
        <TrendingUp className="h-5 w-5 text-primary" />
        Staff Performance
      </h1>
      <p className="mb-6 text-sm text-muted">
        Resolution speed, workload, and citizen ratings across all staff members.
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Monthly Resolved Complaints
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.15)" />
                <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={12} />
                <YAxis stroke={AXIS_COLOR} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#8176FF" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {staff.length === 0 ? (
            <EmptyState icon={UsersIcon} title="No staff members yet" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((s) => (
                <Card key={s.staffId}>
                  <h3 className="mb-1 text-base font-semibold text-foreground">{s.name}</h3>
                  <p className="mb-4 text-xs uppercase tracking-wide text-muted">{s.specialization}</p>

                  <dl className="space-y-2 text-sm">
                    <Row label="Avg. Resolution Time" value={s.avgResolutionTimeHours != null ? `${s.avgResolutionTimeHours}h` : "N/A"} />
                    <Row label="Total Resolved" value={s.totalResolved} />
                    <Row label="Pending" value={s.pending} />
                    <Row label="Escalated" value={s.escalated} />
                    <Row label="Rating" value={s.avgRating != null ? `★ ${s.avgRating}` : "No ratings"} />
                    <Row label="Completion %" value={s.completionPercent != null ? `${s.completionPercent}%` : "N/A"} />
                  </dl>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <dt className="text-muted">{label}</dt>
    <dd className="font-medium text-foreground">{value}</dd>
  </div>
);

export default StaffPerformance;
