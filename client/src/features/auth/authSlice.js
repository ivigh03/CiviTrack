/**
 * Auth State Shape (CANONICAL):
 * {
 *   auth: {
 *     token: string | null,
 *     user: { id, name, email, role, avatar } | null,
 *     loading: boolean,
 *     error: string | null,
 *   }
 * }
 *
 * Access in components:
 *   const { user, token } = useSelector(state => state.auth);
 *   user.role  ✅  (never user.user.role)
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// ─── Persist helpers ─────────────────────────────────────────────────────────

const saveToStorage = (payload) => {
  localStorage.setItem("auth", JSON.stringify(payload));
};

const clearStorage = () => {
  localStorage.removeItem("auth");
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data; // { success, token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/signup", data);
      return res.data; // { success, token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Signup failed" }
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/google",
  async (credential, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/google", { credential });
      return res.data; // { success, token, user }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Google login failed" }
      );
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const stored = loadFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: stored.token,
    user: stored.user,   // { id, name, email, role, avatar }
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      clearStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── shared fulfilled handler ─────────────────────────────────────────────
    const onFulfilled = (state, action) => {
      const { token, user } = action.payload;
      state.loading = false;
      state.error = null;
      state.token = token;
      state.user = user;           // flat: { id, name, email, role, avatar }
      saveToStorage({ token, user });
    };

    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, onFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        // After signup, redirect to login — don't auto-login
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      })

      // GOOGLE
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, onFulfilled)
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google login failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;