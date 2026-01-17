import API from "./axios";

// 🔥 Get all complaints
export const getAllComplaints = async () => {
  const res = await API.get("/complaints");
  return res.data.data; // ⚠️ important
};

// 🔥 Get lightweight lat/lng feed for the heatmap
export const getComplaintLocations = async () => {
  const res = await API.get("/complaints/locations");
  return res.data.data;
};

export const completeComplaint = async (id, formData) => {
  const res = await API.put(
    `/complaints/${id}/complete`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
};

// 🔥 Get a single complaint by id
export const getComplaintById = async (id) => {
  const res = await API.get(`/complaints/${id}`);
  return res.data.data;
};

// 🔥 Citizen rates a resolved complaint
export const rateComplaint = async (id, { stars, comment }) => {
  const res = await API.put(`/complaints/${id}/rate`, { stars, comment });
  return res.data.data;
};