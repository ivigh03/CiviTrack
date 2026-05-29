import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllComplaints } from "../../api/complaintApi";

// 🔥 Fetch complaints
export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async (_, thunkAPI) => {
    try {
      return await getAllComplaints();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    complaints: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default complaintSlice.reducer;