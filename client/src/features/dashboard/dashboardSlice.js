import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",

  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/admin/dashboard");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    stats: null,
    charts: null,
    loading: false,
    error: null,
  },

  reducers: {
    // 🔴 Live snapshot pushed over Socket.io — replaces stats/charts wholesale
    // so the numbers can never drift from the server's aggregation.
    dashboardUpdated: (state, action) => {
      state.stats = action.payload.stats;
      state.charts = action.payload.charts;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.charts = action.payload.charts;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { dashboardUpdated } = dashboardSlice.actions;
export default dashboardSlice.reducer;
