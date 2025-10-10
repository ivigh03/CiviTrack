const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Complaints",
      value: stats?.total || 0,
      color: "bg-blue-500",
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      color: "bg-yellow-500",
    },
    {
      title: "Escalated",
      value: stats?.escalated || 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white shadow rounded-xl p-5 flex flex-col justify-between"
        >
          <h3 className="text-gray-500 text-sm">{card.title}</h3>

          <div className="flex items-center justify-between mt-4">
            <h2 className="text-2xl font-bold">{card.value}</h2>

            <div className={`${card.color} w-10 h-10 rounded-full`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;