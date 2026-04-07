import ComplaintCard from "./ComplaintCard";

export default function ComplaintList({ complaints }) {
  return (
    <div>
      {complaints.map((c) => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </div>
  );
}