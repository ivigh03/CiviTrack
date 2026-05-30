import ComplaintList from "../dashboard/ComplaintList";

export default function MyComplaints({
  complaints = [],
}) {

  console.log(
    "MY COMPLAINTS RECEIVED:",
    complaints
  );

  return (

    <div>

      {/* ✅ TITLE */}
      <h2
        style={{
          marginBottom: "20px",
          color: "white",
        }}
      >
        My Complaints (
        {complaints.length}
        )
      </h2>

      {/* ✅ EMPTY STATE */}
      {complaints.length === 0 ? (

        <p
          style={{
            color: "white",
          }}
        >
          No complaints found
        </p>

      ) : (

        // ✅ SHOW LIST
        <ComplaintList
          complaints={complaints}
        />

      )}

    </div>
  );
}