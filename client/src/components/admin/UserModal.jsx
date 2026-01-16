import { useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white text-black rounded-xl p-6 w-[400px]"
      >

        <h2 className="text-xl font-bold mb-4 text-black">User Details</h2>

<p className="text-black"><b>Name:</b> {user.name}</p>
<p className="text-black"><b>Email:</b> {user.email}</p>
{user.role === "citizen" && (
  <p className="text-black">
    <b>Complaints Raised:</b> {user.complaintsCount}
  </p>
)}

{user.role === "staff" && (
  <p className="text-black">
    <b>Complaints Resolved:</b> {user.complaintsCount}
  </p>
)}

        {/* ROLE CHANGE */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="citizen">Citizen</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-6">

          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>

            <button
              onClick={handleToggleBlock}
              className={`px-4 py-2 rounded text-white ${
                user.isBlocked ? "bg-green-600" : "bg-yellow-600"
              }`}>
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-400 text-black px-4 py-2 rounded">
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="bg-indigo-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default UserModal;