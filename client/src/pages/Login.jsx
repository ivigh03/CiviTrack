import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPremium.css";
import socket from "../socket.js";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?._id) {
    socket.emit("join", user._id);
  }
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await dispatch(loginUser(form));
    const role = res.payload?.user?.role;

    setLoading(false);

    if (role === "admin") navigate("/admin");
    else if (role === "staff") navigate("/staff");
    else navigate("/citizen");
  };

  return (
    <div className="premium-container">
      <form className="premium-card" onSubmit={handleSubmit}>
        <h2>CiviTrack</h2>
        <p className="subtitle">Welcome back</p>

        <div className="input-group">
          <input
            type="email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <label>Password</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}