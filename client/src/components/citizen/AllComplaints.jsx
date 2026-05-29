import Filters from "../dashboard/Filters";
import ComplaintList from "../dashboard/ComplaintList";

export default function AllComplaints({ complaints, filters, setFilters }) {
  return (
    <>
      <h2>All Complaints</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <ComplaintList complaints={complaints} />
    </>
  );
}