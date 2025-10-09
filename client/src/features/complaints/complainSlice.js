import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchComplaintsAPI,
  updateStatusAPI,
  assignStaffAPI,
} from "./complaintAPI";

// 🔥 Fetch complaints
export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async () => {
    const res = await fetchComplaintsAPI();
    return res.data;
  }
);

// 🔄 Update status
export const updateStatus = createAsyncThunk(
  "complaints/updateStatus",
  async ({ id, status }) => {
    await updateStatusAPI(id, status);
    return { id, status };
  }
);

// 👤 Assign staff
export const assignStaff = createAsyncThunk(
  "complaints/assign",
  async ({ id, staffId }) => {
    await assignStaffAPI(id, staffId);
    return { id, staffId };
  }
);

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetch
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      // update status
      .addCase(updateStatus.fulfilled, (state, action) => {
        const c = state.data.find((x) => x._id === action.payload.id);
        if (c) c.status = action.payload.status;
      })

      // assign staff
      .addCase(assignStaff.fulfilled, (state, action) => {
        const c = state.data.find((x) => x._id === action.payload.id);
        if (c) c.assignedTo = action.payload.staffId;
      });
  },
});

export default complaintSlice.reducer;