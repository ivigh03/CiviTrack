import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import complaintReducer from "../features/complaints/complainSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
  },
});