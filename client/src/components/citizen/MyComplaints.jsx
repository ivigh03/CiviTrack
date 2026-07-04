import ComplaintList from "../dashboard/ComplaintList";

export default function MyComplaints({ complaints = [] }) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-semibold text-foreground">
        My Complaints <span className="text-muted">({complaints.length})</span>
      </h2>

      <ComplaintList complaints={complaints} />
    </div>
  );
}
