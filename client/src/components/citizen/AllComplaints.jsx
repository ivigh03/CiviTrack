import Filters from "../dashboard/Filters";
import ComplaintList from "../dashboard/ComplaintList";

export default function AllComplaints({ complaints, filters, setFilters }) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-semibold text-foreground">All Complaints</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <ComplaintList complaints={complaints} />
    </div>
  );
}
