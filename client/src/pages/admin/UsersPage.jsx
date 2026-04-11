import { useEffect, useState } from "react";
import axios from "../../api/axios";
import UserModal from "../../components/admin/UserModal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch users
  const fetchUsers = () => {
    setLoading(true);
    axios.get("/admin/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
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
        Total users:{" "}
        <span className="text-yellow-400">{users.length}</span>
      </p>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <FilterBtn label="Citizens" value="citizen" setFilter={setFilter} />
        <FilterBtn label="Admins" value="admin" setFilter={setFilter} />
        <FilterBtn label="Staff" value="staff" setFilter={setFilter} />
        <FilterBtn label="All" value="all" setFilter={setFilter} />
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-white">Loading users...</p>
      ) : (
        <>
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
                className="grid grid-cols-4 px-6 py-4 border-b border-gray-700 items-center hover:bg-[#2d3b55] transition"
              >
                <div>{user.name}</div>

                <div className="text-gray-400 text-sm">
                  {user.email}
                </div>

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
                    {(user.role || "citizen").toUpperCase()}
                  </span>
                </div>

                {/* ACTION */}
                <div className="text-right">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-indigo-500 px-4 py-1 rounded-md text-sm hover:bg-indigo-600 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              No users found
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={fetchUsers}
        />
      )}

    </div>
  );
};

const FilterBtn = ({ label, value, setFilter }) => {
  return (
    <button
      onClick={() => setFilter(value)}
      className="px-4 py-1 rounded-md bg-[#334155] hover:bg-indigo-500 text-sm transition"
    >
      {label}
    </button>
  );
};

export default UsersPage;