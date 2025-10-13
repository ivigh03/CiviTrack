const SLAIndicator = ({ createdAt }) => {
  const SLA_HOURS = 48;

  const created = new Date(createdAt);
  const now = new Date();

  const diff = (now - created) / (1000 * 60 * 60);
  const remaining = SLA_HOURS - diff;

  return (
    <div className="mt-2 text-sm">
      {remaining > 0 ? (
        <span className="text-green-500">
          {remaining.toFixed(1)}h left
        </span>
      ) : (
        <span className="text-red-500 font-semibold">
          Overdue ⚠
        </span>
      )}
    </div>
  );
};

export default SLAIndicator;