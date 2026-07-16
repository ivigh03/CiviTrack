import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../features/dashboard/dashboardSlice";
import StatsCards from "../../components/admin/StatsCards";
import Charts from "../../components/admin/Charts";
import SatisfactionStats from "../../components/admin/SatisfactionStats";
import { SkeletonCard } from "../../components/ui/Skeleton";
import PageTransition from "../../components/ui/PageTransition";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, charts, topRatedStaff, worstRatedStaff } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (!stats || !charts) {
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
      <StatsCards stats={stats} />
      <Charts data={{ ...stats, ...charts }} />
      <SatisfactionStats stats={stats} topRatedStaff={topRatedStaff} worstRatedStaff={worstRatedStaff} />
    </PageTransition>
  );
};

export default AdminDashboard;
