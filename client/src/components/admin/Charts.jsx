import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { PieChart as PieIcon, BarChart3, LineChart as LineIcon } from "lucide-react";

const COLORS = ["#8176FF", "#34D399", "#FBBF24", "#F87171"];
const AXIS_COLOR = "#94a3b8";

const tooltipStyle = {
  background: "rgb(var(--color-surface))",
  border: "1px solid rgb(var(--color-border) / var(--border-opacity))",
  borderRadius: 12,
  color: "rgb(var(--color-foreground))",
  fontSize: 13,
};

const Charts = ({ data }) => {
  if (!data) return <p className="text-muted">No chart data</p>;

  // ✅ FIX: Use stats directly
  const pieData = [
    { name: "Resolved", value: data.resolved || 0 },
    { name: "Pending", value: data.pending || 0 },
    { name: "Escalated", value: data.escalated || 0 },
  ];

  // Dummy fallback data (until backend ready)
  const barData = data.category || [];
  const lineData = data.timeline || [];

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* PIE CHART */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <PieIcon className="h-4 w-4 text-primary" />
          Complaint Status
        </h2>

        {pieData.every((d) => d.value === 0) ? (
          <EmptyState icon={PieIcon} title="No complaints yet" className="border-none bg-transparent py-8" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* BAR CHART */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          Category Distribution
        </h2>

        {barData.length === 0 ? (
          <EmptyState icon={BarChart3} title="No category data yet" className="border-none bg-transparent py-8" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke={AXIS_COLOR} fontSize={12} />
              <YAxis stroke={AXIS_COLOR} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgb(var(--color-elevated))" }} />
              <Bar dataKey="count" fill="#8176FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* LINE CHART */}
      <Card className="lg:col-span-2">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <LineIcon className="h-4 w-4 text-primary" />
          Complaints Over Time
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.15)" />
            <XAxis dataKey="date" stroke={AXIS_COLOR} fontSize={12} />
            <YAxis stroke={AXIS_COLOR} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#8176FF" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Charts;
