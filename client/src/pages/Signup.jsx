import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import "./AuthPremium.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const res = await dispatch(signupUser(form));

  setLoading(false);

  if (res.meta.requestStatus === "fulfilled") {
    navigate("/login"); // 🔥 redirect to login
  }
};

  return (
    <div className="premium-container">
      <form className="premium-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Join CiviTrack</p>

        <div className="input-group">
          <input required onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <label>Full Name</label>
        </div>

        <div className="input-group">
          <input type="email" required onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <label>Email</label>
        </div>

        <div className="input-group">
          <input type="password" required onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <label>Password</label>
        </div>

        <select className="role-select" onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="citizen">Citizen</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}