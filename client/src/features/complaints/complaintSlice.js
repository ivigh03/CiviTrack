import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getAllComplaints,
} from "../../api/complaintApi";

// 🔥 FETCH COMPLAINTS
export const fetchComplaints =
  createAsyncThunk(
    "complaints/fetch",

    async (_, thunkAPI) => {

      try {

        const data =
          await getAllComplaints();

        console.log(
          "FETCHED COMPLAINTS:",
          data
        );

        return data;

      } catch (err) {

        console.error(
          "FETCH ERROR:",
          err.response?.data ||
          err.message
        );

        return thunkAPI.rejectWithValue(
          err.response?.data
        );
      }
    }
  );

const complaintSlice =
  createSlice({

    name: "complaints",

    initialState: {
      complaints: [],
      loading: false,
      error: null,
    },

    reducers: {
      // 🔴 Pushed live over Socket.io (or optimistically, before the server
      // confirms) — unshift only if this complaint isn't already in the list.
      complaintAdded: (state, action) => {
        const exists = state.complaints.some(
          (c) => c._id === action.payload._id
        );

        if (!exists) {
          state.complaints.unshift(action.payload);
        }
      },

      // 🔴 Merge an updated complaint in place by _id (vote/assign/status/
      // escalation). Defensively pushes it if it wasn't in the list yet.
      complaintUpdated: (state, action) => {
        const index = state.complaints.findIndex(
          (c) => c._id === action.payload._id
        );

        if (index !== -1) {
          state.complaints[index] = action.payload;
        } else {
          state.complaints.unshift(action.payload);
        }
      },

      // 🔴 Roll back an optimistic add (e.g. a failed submit, or swapping a
      // temp complaint for the real one once the server responds).
      complaintRemoved: (state, action) => {
        state.complaints = state.complaints.filter(
          (c) => c._id !== action.payload
        );
      },
    },

    extraReducers: (builder) => {

      builder

        // ⏳ LOADING
        .addCase(
          fetchComplaints.pending,
          (state) => {

            state.loading = true;

          }
        )

        // ✅ SUCCESS
        .addCase(
          fetchComplaints.fulfilled,
          (state, action) => {

            state.loading = false;

            state.complaints =
              action.payload;

            console.log(
              "REDUX SAVED:",
              state.complaints
            );
          }
        )

        // ❌ ERROR
        .addCase(
          fetchComplaints.rejected,
          (state, action) => {

            state.loading = false;

            state.error =
              action.payload;

            console.error(
              "REDUX ERROR:",
              action.payload
            );
          }
        );
    },
  });

export const {
  complaintAdded,
  complaintUpdated,
  complaintRemoved,
} = complaintSlice.actions;

export default
complaintSlice.reducer;