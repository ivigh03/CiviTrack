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

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const Charts = ({ data }) => {
  if (!data) return <p className="text-white">No chart data</p>;

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

      {/* 📊 PIE CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Complaint Status</h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 LINE CHART */}
      <div className="bg-white p-6 rounded-xl shadow col-span-1 lg:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Complaints Over Time</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Charts;