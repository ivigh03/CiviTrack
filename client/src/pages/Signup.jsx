import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, googleLogin, clearError } from "../features/auth/authSlice";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./AuthPremium.css";
import socket from "../socket.js";

const DASH = { admin: "/admin", staff: "/staff", citizen: "/citizen" };

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Already logged in
  // ✅ Redirect ONLY on login/signup pages
useEffect(() => {
  if (
    user &&
    (location.pathname === "/login" ||
      location.pathname === "/signup")
  ) {
    navigate(
      DASH[user.role] || "/citizen",
      { replace: true }
    );
  }
}, [user, navigate, location]);

  // Mount Google button
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      {
  theme: "outline",
  size: "large",
  width: 300,
  text: "signup_with",
}
    );
  }, []);

  const handleGoogleResponse = useCallback(
    async (response) => {
      const res = await dispatch(googleLogin(response.credential));
      if (res.meta.requestStatus === "fulfilled") {
        const { role, id } = res.payload.user;
        socket.emit("join", id);
        navigate(DASH[role] || "/citizen", { replace: true });
      }
    },
    [dispatch, navigate]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signupUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="premium-container">
      <form className="premium-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Join CiviTrack</p>

        {error && <p className="auth-error">{error}</p>}

        <div className="input-group">
          <input
            required
            value={form.name}
            onChange={(e) => {
              dispatch(clearError());
              setForm({ ...form, name: e.target.value });
            }}
          />
          <label>Full Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => {
              dispatch(clearError());
              setForm({ ...form, email: e.target.value });
            }}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => {
              dispatch(clearError());
              setForm({ ...form, password: e.target.value });
            }}
          />
          <label>Password</label>
        </div>

        <select
          className="role-select"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="citizen">Citizen</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        {/* ── Google Sign-Up ─────────────────────────────────── */}
        <div className="divider"><span>or</span></div>
        <div id="google-signup-btn" className="google-btn-wrapper" />

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}