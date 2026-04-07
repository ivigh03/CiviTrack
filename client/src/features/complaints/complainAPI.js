import axios from "../../services/axios";

export const fetchComplaintsAPI = () =>
  axios.get("/admin/complaints");

export const updateStatusAPI = (id, status) =>
  axios.put(`/admin/complaints/${id}`, { status });

export const assignStaffAPI = (id, staffId) =>
  axios.put(`/admin/assign/${id}`, { staffId });