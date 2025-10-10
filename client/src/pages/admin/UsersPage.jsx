import { useEffect, useState } from "react";
import axios from "../../api/axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("/admin/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  // 🔍 Filter logic
  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.role === filter);

  return (
    <div className="text-white">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">
        👤 User Management Console
      </h1>
      <p className="text-gray-400 mb-4">
        View, manage, and audit all user accounts across the system.
        Total users: <span className="text-yellow-400">{users.length}</span>
      </p>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-6">
        <FilterBtn label="Citizens" value="citizen" setFilter={setFilter} />
        <FilterBtn label="Admins" value="admin" setFilter={setFilter} />
        <FilterBtn label="Staff" value="staff" setFilter={setFilter} />
        <FilterBtn label="All" value="all" setFilter={setFilter} />
      </div>

      {/* TABLE */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-4 px-6 py-3 bg-[#334155] text-gray-300 text-sm font-semibold">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div className="text-right">Actions</div>
        </div>

        {/* TABLE BODY */}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-4 px-6 py-4 border-b border-gray-700 items-center"
          >
            <div>{user.name}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>

            {/* ROLE BADGE */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-red-500"
                    : user.role === "staff"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            {/* ACTION */}
            <div className="text-right">
              <button className="bg-indigo-500 px-4 py-1 rounded-md text-sm hover:bg-indigo-600">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterBtn = ({ label, value, setFilter }) => {
  return (
    <button
      onClick={() => setFilter(value)}
      className="px-4 py-1 rounded-md bg-[#334155] hover:bg-indigo-500 text-sm"
    >
      {label}
    </button>
  );
};

export default UsersPage;