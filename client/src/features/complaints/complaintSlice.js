import { createSlice } from "@reduxjs/toolkit";
import dummyComplaints from "../../data/dummyComplaints";

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    complaints: dummyComplaints,
  },
});

export default complaintSlice.reducer;