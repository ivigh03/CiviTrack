import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, googleLogin, clearError } from "../features/auth/authSlice";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";

import { LANDING_PATH } from "../constants/roles";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import GradientMesh from "../components/ui/GradientMesh";

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
      LANDING_PATH,
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
        navigate(LANDING_PATH, { replace: true });
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <GradientMesh />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <Card variant="glass" padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="mb-2 text-center">
              <h2 className="text-xl font-bold text-foreground">Create Account</h2>
              <p className="mt-1 text-sm text-muted">Join CiviTrack</p>
            </div>

            {error && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
            )}

            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={(e) => {
                dispatch(clearError());
                setForm({ ...form, name: e.target.value });
              }}
            />

            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => {
                dispatch(clearError());
                setForm({ ...form, email: e.target.value });
              }}
            />

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => {
                dispatch(clearError());
                setForm({ ...form, password: e.target.value });
              }}
            />

            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>

            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
              {loading ? "Creating..." : "Signup"}
            </Button>

            <div className="my-1 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div id="google-signup-btn" className="flex justify-center" />

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
                Login
              </Link>
            </p>

          </form>
        </Card>
      </motion.div>
    </div>
  );
}
