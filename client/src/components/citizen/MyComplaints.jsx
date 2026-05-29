import { useSelector } from "react-redux";

import ComplaintList from "../dashboard/ComplaintList";

export default function MyComplaints({
  complaints = [],
}) {

  // ✅ AUTH DATA
  const authData = useSelector(
    (state) => state.auth
  );

  const currentUser =
    authData?.user;

  // ✅ GET USER ID SAFELY
  const currentUserId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.user?.id ||
    currentUser?.user?._id;

  // ✅ FILTER USER COMPLAINTS
  const myComplaints =
    complaints.filter((c) => {

      const complaintUserId =
        c.user?._id || c.user;

      return (
        String(complaintUserId) ===
        String(currentUserId)
      );
    });

  console.log(
    "CURRENT USER:",
    currentUserId
  );

  console.log(
    "MY COMPLAINTS:",
    myComplaints
  );

  return (
    <>
      <h2>
        My Complaints (
        {myComplaints.length})
      </h2>

      <ComplaintList
        complaints={myComplaints}
      />
    </>
  );
}