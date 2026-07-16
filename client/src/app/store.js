import { configureStore }
from "@reduxjs/toolkit";

import authReducer
from "../features/auth/authSlice";

import complaintReducer
from "../features/complaints/complaintSlice";

import dashboardReducer
from "../features/dashboard/dashboardSlice";

export const store =
  configureStore({
    reducer: {
      auth: authReducer,
      complaints:
        complaintReducer,
      dashboard:
        dashboardReducer,
    },
  });