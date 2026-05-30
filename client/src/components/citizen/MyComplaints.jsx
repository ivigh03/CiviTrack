import { useSelector } from "react-redux";

import ComplaintList
from "../dashboard/ComplaintList";

export default function MyComplaints({
  complaints = [],
}) {

  // ✅ FULL AUTH
  const auth = useSelector(
    (state) => state.auth
  );

  // ✅ ACTUAL USER
  const currentUser =
    auth?.user?.user;

  // ✅ USER ID
  const currentUserId =
    currentUser?.id ||
    currentUser?._id;

  console.log(
    "CURRENT USER:",
    currentUser
  );

  console.log(
    "CURRENT USER ID:",
    currentUserId
  );

  // ✅ FILTER USER COMPLAINTS
  const myComplaints =
    complaints.filter((c) => {

      // complaint.user can be:
      // ObjectId OR populated object

      const complaintUserId =
        typeof c.user === "object"
          ? c.user?._id
          : c.user;

      return (
        String(
          complaintUserId
        ) ===
        String(currentUserId)
      );
    });

  console.log(
    "MY COMPLAINTS:",
    myComplaints
  );

  return (
    <>
      <h2>
        My Complaints (
        {myComplaints.length}
        )
      </h2>

      <ComplaintList
        complaints={myComplaints}
      />
    </>
  );
}