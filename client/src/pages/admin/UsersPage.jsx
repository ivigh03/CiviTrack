import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import axios from "../../api/axios";
import UserModal from "../../components/admin/UserModal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { cn } from "../../lib/cn";

const ROLE_BADGE = {
  admin: "bg-danger/15 text-danger",
  staff: "bg-info/15 text-info",
  citizen: "bg-success/15 text-success",
};

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
    <div>
      {/* HEADER */}
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold text-foreground">
        <UsersIcon className="h-5 w-5 text-primary" />
        User Management Console
      </h1>
      <p className="mb-4 text-sm text-muted">
        View, manage, and audit all user accounts across the system. Total users:{" "}
        <span className="font-semibold text-warning">{users.length}</span>
      </p>

      {/* FILTER BUTTONS */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterBtn label="All" value="all" active={filter} setFilter={setFilter} />
        <FilterBtn label="Citizens" value="citizen" active={filter} setFilter={setFilter} />
        <FilterBtn label="Staff" value="staff" active={filter} setFilter={setFilter} />
        <FilterBtn label="Admins" value="admin" active={filter} setFilter={setFilter} />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <EmptyState icon={UsersIcon} title="No users found" description="Try a different filter." />
          ) : (
            <Card padding="none" className="overflow-hidden">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-4 gap-2 bg-elevated px-4 py-3 text-sm font-semibold text-muted sm:px-6">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div className="text-right">Actions</div>
              </div>

              {/* TABLE BODY */}
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-4 items-center gap-2 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-elevated/60 sm:px-6"
                >
                  <div className="truncate text-foreground">{user.name}</div>

                  <div className="truncate text-sm text-muted">{user.email}</div>

                  {/* ROLE BADGE */}
                  <div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        ROLE_BADGE[user.role] || ROLE_BADGE.citizen
                      )}
                    >
                      {(user.role || "citizen").toUpperCase()}
                    </span>
                  </div>

                  {/* ACTION */}
                  <div className="text-right">
                    <Button size="sm" variant="secondary" onClick={() => setSelectedUser(user)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
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

const FilterBtn = ({ label, value, active, setFilter }) => {
  return (
    <button
      onClick={() => setFilter(value)}
      className={cn(
        "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
        active === value
          ? "bg-primary text-primary-foreground"
          : "bg-elevated text-muted hover:bg-elevated/70 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
};

export default UsersPage;
