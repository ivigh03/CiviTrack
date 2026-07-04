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