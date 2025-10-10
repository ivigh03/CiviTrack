import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatsCards from "../../components/admin/StatsCards";
import Charts from "../../components/admin/Charts";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/admin/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      
      

      <StatsCards stats={data.stats} />
      <Charts data={{ ...data.stats, ...data.charts }} />
    </div>
  );
};

export default AdminDashboard;