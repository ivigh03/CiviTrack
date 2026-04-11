import API from "./axios";

// 🔥 Get all complaints
export const getAllComplaints = async () => {
  const res = await API.get("/complaints");
  return res.data.data; // ⚠️ important
};