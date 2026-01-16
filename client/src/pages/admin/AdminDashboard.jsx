import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatsCards from "../../components/admin/StatsCards";
import Charts from "../../components/admin/Charts";
import { SkeletonCard } from "../../components/ui/Skeleton";
import PageTransition from "../../components/ui/PageTransition";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/admin/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <PageTransition>
      <h1 className="mb-6 text-xl font-semibold text-foreground">Overview</h1>
      <StatsCards stats={data.stats} />
      <Charts data={{ ...data.stats, ...data.charts }} />
    </PageTransition>
  );
};

export default AdminDashboard;
