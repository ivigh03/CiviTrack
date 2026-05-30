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

    reducers: {},

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

export default
complaintSlice.reducer;