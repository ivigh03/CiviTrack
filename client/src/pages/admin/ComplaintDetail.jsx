import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { UPLOADS_BASE_URL } from "../../api/axios";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    // ✅ Fetch single complaint
    axios
      .get(`/admin/complaints/${id}`)
      .then((res) => {
        setComplaint(res.data);
      })
      .catch((err) => console.log(err));

    // ✅ Fetch staff users
    axios.get("/admin/users").then((res) => {
      const staff = res.data.filter((u) => u.role === "staff");
      setStaffList(staff);
    });
  }, [id]);
  useEffect(() => {
  if (!complaint?.slaDeadline) return;

  const interval = setInterval(() => {
    const now = new Date();
    const deadline = new Date(complaint.slaDeadline);

    const diff = deadline - now;

    if (diff <= 0) {
      setTimeLeft("Expired");
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setTimeLeft(`${hours}h ${minutes}m`);
  }, 1000);

  return () => clearInterval(interval);
}, [complaint]);

  // ✅ Prevent crash
  if (!complaint) {
    return <p className="text-white">Loading...</p>;
  }
  const getSLATimeLeft = () => {
  if (!complaint.slaDeadline) return null;

  const now = new Date();
  const deadline = new Date(complaint.slaDeadline);

  const diff = deadline - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} hrs left`;
};

  const assignStaff = async (staffId) => {
  try {
    const res = await axios.put(
      `/admin/assign/${id}`,
      { staffId }
    );

    setComplaint(res.data);
    setShowAssign(false);

  } catch (err) {
    console.error("ASSIGN ERROR:", err);
  }
};

  const markResolved = async () => {
    await axios.put(`/admin/complaints/${id}`, {
      status: "resolved",
    });
    window.location.reload();
  };

  const deleteComplaint = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this complaint?"
    );

    if (!confirmed) return;

    await axios.delete(`/admin/complaints/${id}`);
    navigate("/admin/complaints");
  };
  const getPriorityColor = () => {
  if (complaint.priority === "high") return "bg-red-500";
  if (complaint.priority === "medium") return "bg-yellow-500";
  return "bg-green-500";
};

  return (
    <div className="text-white grid md:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="md:col-span-2 bg-[#1e293b] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-3">
          {complaint.title}
        </h2>
        {complaint.slaDeadline && (
  <span
  className={`text-white text-xs px-3 py-1 rounded-full ${
    timeLeft === "Expired" ? "bg-red-500" : "bg-green-500"
  }`}
>
  SLA: {timeLeft}
</span>
  
)}
<span
  className={`text-white text-xs px-3 py-1 rounded-full ml-2 ${getPriorityColor()}`}
>
  {complaint.priority?.toUpperCase()}
</span>

        {complaint.image && (
          <img
            src={`${UPLOADS_BASE_URL}${complaint.image}`}
            alt=""
            className="rounded-lg mb-4 w-full h-[300px] object-cover"
          />
        )}

        <p>{complaint.userDescription}</p>

        {(complaint.proofImage || complaint.staffRemark) && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Resolution Proof:</p>
            {complaint.proofImage && (
              <img
                src={`${UPLOADS_BASE_URL}${complaint.proofImage}`}
                alt="Resolution proof"
                className="rounded-lg w-full h-[300px] object-cover"
              />
            )}
            {complaint.staffRemark && (
              <p className="mt-2 text-gray-300">Staff remark: {complaint.staffRemark}</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-6">
  <h3 className="font-semibold mb-3">Progress Timeline</h3>

  <div className="flex items-center justify-between text-sm">

    {/* PENDING */}
    <div className="flex flex-col items-center">
      <div className={`w-4 h-4 rounded-full ${
        complaint.status === "pending" ? "bg-yellow-400" : "bg-gray-400"
      }`} />
      <p className="mt-1">Pending</p>
    </div>

    <div className="flex-1 h-1 bg-gray-600 mx-2"></div>

    {/* IN PROGRESS */}
    <div className="flex flex-col items-center">
      <div className={`w-4 h-4 rounded-full ${
        complaint.status === "in-progress" ? "bg-blue-400" : "bg-gray-400"
      }`} />
      <p className="mt-1">Assigned</p>
    </div>

    <div className="flex-1 h-1 bg-gray-600 mx-2"></div>

    {/* RESOLVED */}
    <div className="flex flex-col items-center">
      <div className={`w-4 h-4 rounded-full ${
        complaint.status === "resolved" ? "bg-green-400" : "bg-gray-400"
      }`} />
      <p className="mt-1">Resolved</p>
    </div>

  </div>
</div>

      {/* RIGHT PANEL */}
      <div className="bg-[#1e293b] p-6 rounded-xl">

        <button
          onClick={markResolved}
          className="bg-red-500 w-full py-2 rounded mb-4"
        >
          Mark as Resolved
        </button>

        <p className="mb-2 font-semibold">Assigned Staff:</p>

        {complaint.assignedTo ? (
          <p>{complaint.assignedTo.name}</p>
        ) : (
          <p className="text-gray-400">Not assigned</p>
        )}

        <button
          onClick={() => setShowAssign(true)}
          className="bg-blue-500 w-full py-2 rounded mt-4"
        >
          Assign / Reassign Staff
        </button>

        <button
          onClick={deleteComplaint}
          className="bg-red-700 w-full py-2 rounded mt-4"
        >
          Delete Complaint
        </button>
      </div>
      {/* ASSIGNMENT HISTORY */}
<div className="bg-[#1e293b] p-6 rounded-xl mt-6">
  <h3 className="font-bold text-lg mb-4">
    Assignment History
  </h3>

  {!complaint.assignmentHistory ||
  complaint.assignmentHistory.length === 0 ? (
    <p className="text-gray-400">
      No assignment history
    </p>
  ) : (
    <div className="space-y-4">
      {complaint.assignmentHistory.map(
        (item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4"
          >
            <p className="font-semibold">
              {item.action === "assigned"
                ? "📌 Assigned"
                : "🔄 Reassigned"}
            </p>

            <p>
              Staff:
              {" "}
              {item.assignedTo?.name ||
                "Unknown"}
            </p>

            <p className="text-sm text-gray-400">
              {new Date(
                item.assignedAt
              ).toLocaleString()}
            </p>
          </div>
        )
      )}
    </div>
  )}
</div>

      {/* ASSIGN PANEL */}
      {showAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">

          <div className="bg-white w-[350px] h-full p-4 overflow-y-auto">
            <h2 className="text-black font-bold mb-4">
              Assign Staff
            </h2>

            {staffList.map((s) => (
              <div
                key={s._id}
                className="flex justify-between border-b py-2"
              >
                <span className="text-black">{s.name}</span>

                <button
                  onClick={() => assignStaff(s._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Select
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowAssign(false)}
              className="mt-4 bg-gray-400 w-full py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;