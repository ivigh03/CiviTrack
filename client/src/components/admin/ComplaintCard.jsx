const ComplaintCard = ({ complaint, onStatusChange }) => {
  const isEscalated = complaint.escalated;

  return (
    <div
      className={`p-5 rounded-xl shadow bg-white border-l-4 ${
        isEscalated ? "border-red-500" : "border-blue-500"
      }`}
    >
      {/* Title */}
      <h2 className="text-lg font-semibold">{complaint.title}</h2>

      {/* Description */}
      <p className="text-gray-600 mt-2">{complaint.description}</p>

      {/* Info */}
      <div className="flex justify-between mt-4 text-sm">
        <span>Status: {complaint.status}</span>
        <span>Category: {complaint.category}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onStatusChange(complaint._id, "IN_PROGRESS")}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Start
        </button>

        <button
          onClick={() => onStatusChange(complaint._id, "RESOLVED")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Resolve
        </button>
      </div>

      {/* Escalation */}
      {isEscalated && (
        <div className="mt-3 text-red-500 font-semibold">
          ⚠ Escalated
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;