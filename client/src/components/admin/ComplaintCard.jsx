import { useNavigate } from "react-router-dom";
const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();
  const getBorderColor = () => {
    if (complaint.status === "in-progress") return "border-blue-500";
    if (complaint.status === "resolved") return "border-green-500";
    if (complaint.status === "pending") return "border-orange-500";
    return "border-gray-500";
  };

  return (
    <div
      onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
      className="bg-white text-black rounded-lg shadow-md p-4 border-l-4 cursor-pointer hover:scale-105 transition"
    >
      {/* TITLE */}
      <h2 className="font-semibold text-lg text-green-600">
        {complaint.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 mt-1">
        {complaint.userDescription || "No description"}
      </p>

      {/* STATUS + LOCATION */}
      <div className="flex justify-between mt-3 text-sm">
        <p>
          Status:{" "}
          <span className="font-semibold text-blue-600">
            {complaint.status.toUpperCase()}
          </span>
        </p>
        <p>Location: {complaint.address || "N/A"}</p>
      </div>

      {/* DATE */}
      <p className="text-xs text-gray-500 mt-2">
        Created:{" "}
        {new Date(complaint.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ComplaintCard;