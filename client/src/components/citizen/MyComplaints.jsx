import ComplaintList from "../dashboard/ComplaintList";

export default function MyComplaints({ complaints }) {
  return (
    <>
      <h2>My Complaints</h2>
      <ComplaintList complaints={complaints} />
    </>
  );
}