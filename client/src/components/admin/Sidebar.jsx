import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Complaints", path: "/admin/complaints" },
    { name: "Heatmap", path: "/admin/heatmap" },
    { name: "Notifications", path: "/admin/notifications" },
    { name: "SLA", path: "/admin/sla" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">

      {/* LOGO */}
      <h2 className="text-2xl font-bold mb-8">CiviTrack</h2>

      {/* MENU */}
      <ul className="space-y-3 list-none p-0">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;