import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchComplaints,
} from "../../features/complaints/complaintSlice";

import ComplaintCard
from "../../components/admin/ComplaintCard";

const Complaints = () => {

  const dispatch =
    useDispatch();

  // ✅ NEW STATE
  const {
    complaints = [],
    loading,
  } = useSelector(
    (state) => state.complaints
  );

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  // 🔥 FETCH
  useEffect(() => {

    dispatch(
      fetchComplaints()
    );

  }, [dispatch]);

  // ⏳ LOADING
  if (loading) {

    return (
      <p className="text-white">
        Loading...
      </p>
    );
  }

  // 🔍 FILTER
  const filtered =
    complaints

      .filter((c) =>
        c.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )

      .filter((c) =>
        statusFilter === "ALL"
          ? true
          : c.status ===
            statusFilter
      );

  return (

    <div className="text-white">

      {/* 🔥 FILTER BAR */}
      <div className="bg-white text-black rounded-xl p-4 mb-6 shadow-md flex flex-wrap gap-4 items-center">

        <input
          placeholder="Search by title..."
          className="border p-2 rounded w-[200px]"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="in-progress">
            In Progress
          </option>

          <option value="resolved">
            Resolved
          </option>

        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>

        <button
          onClick={() => {

            setSearch("");

            setStatusFilter(
              "ALL"
            );

          }}
          className="bg-purple-100 text-purple-600 px-4 py-2 rounded"
        >
          Clear
        </button>

      </div>

      {/* 📊 COUNT */}
      <p className="mb-4 text-gray-300">

        Found {
          filtered.length
        } Complaints

      </p>

      {/* 📋 GRID */}
      <div className="grid md:grid-cols-3 gap-5">

        {filtered.map((c) => (

          <ComplaintCard
            key={c._id}
            complaint={c}
          />

        ))}

      </div>

      {/* ❌ EMPTY */}
      {filtered.length === 0 && (

        <div className="text-center mt-6 text-gray-400">

          No complaints found

        </div>

      )}

    </div>
  );
};

export default Complaints;