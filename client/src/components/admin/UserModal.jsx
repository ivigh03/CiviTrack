import { useState } from "react";
import { Trash2, ShieldOff, ShieldCheck } from "lucide-react";
import axios from "../../api/axios";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const UserModal = ({ user, onClose, refresh }) => {
  const [role, setRole] = useState(user.role);

  const handleUpdate = async () => {
    await axios.put(`/admin/users/${user._id}/role`, { role });
    refresh();
    onClose();
  };

  const handleDelete = async () => {
    await axios.delete(`/admin/users/${user._id}`);
    refresh();
    onClose();
  };

  const handleToggleBlock = async () => {
    await axios.put(`/admin/users/${user._id}/block`);
    refresh();
    onClose();
  };

  return (
    <Modal open onOpenChange={(open) => !open && onClose()} title="User Details">
      <div className="space-y-2 text-sm">
        <p className="text-foreground">
          <span className="text-muted">Name:</span> {user.name}
        </p>
        <p className="text-foreground">
          <span className="text-muted">Email:</span> {user.email}
        </p>

        {user.role === "citizen" && (
          <p className="text-foreground">
            <span className="text-muted">Complaints Raised:</span> {user.complaintsCount}
          </p>
        )}

        {user.role === "staff" && (
          <p className="text-foreground">
            <span className="text-muted">Complaints Resolved:</span> {user.complaintsCount}
          </p>
        )}

        {user.isBlocked && <Badge variant="danger">Blocked</Badge>}
      </div>

      {/* ROLE CHANGE */}
      <div className="mt-4">
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="citizen">Citizen</option>
        </Select>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>

          <Button
            size="sm"
            variant={user.isBlocked ? "secondary" : "outline"}
            className={!user.isBlocked ? "border-warning/40 text-warning hover:bg-warning hover:text-white" : ""}
            onClick={handleToggleBlock}
          >
            {user.isBlocked ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
            {user.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleUpdate}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
