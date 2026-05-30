import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loginUser,
  googleLogin,
  clearError,
} from "../features/auth/authSlice";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import "./AuthPremium.css";

import socket from "../socket.js";

// ✅ ROLE → DASHBOARD
const DASH = {
  admin: "/admin",
  staff: "/staff",
  citizen: "/citizen",
};

export default function Login() {

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    loading,
    error,
    user,
  } = useSelector(
    (state) => state.auth
  );

  // ✅ REDIRECT ONLY ON LOGIN/SIGNUP
  useEffect(() => {

    if (
      user &&
      (
        location.pathname ===
          "/login" ||

        location.pathname ===
          "/signup"
      )
    ) {

      navigate(
        DASH[user.role] ||
          "/citizen",

        { replace: true }
      );
    }

  }, [
    user,
    navigate,
    location,
  ]);

  // ✅ GOOGLE RESPONSE
  const handleGoogleResponse =
    useCallback(

      async (response) => {

        const res =
          await dispatch(
            googleLogin(
              response.credential
            )
          );

        if (
          res.meta
            .requestStatus ===
          "fulfilled"
        ) {

          const {
            role,
            id,
          } = res.payload.user;

          socket.emit(
            "join",
            id
          );

          navigate(
            DASH[role] ||
              "/citizen",

            {
              replace: true,
            }
          );
        }
      },

      [dispatch, navigate]
    );

  // ✅ MOUNT GOOGLE BUTTON
  useEffect(() => {

    if (!window.google) {
      console.error(
        "Google SDK not loaded"
      );
      return;
    }

    window.google.accounts.id.initialize({

      client_id:
        import.meta.env
          .VITE_GOOGLE_CLIENT_ID,

      callback:
        handleGoogleResponse,

    });

    window.google.accounts.id.renderButton(

      document.getElementById(
        "google-btn"
      ),

      {
        theme: "outline",
        size: "large",
        width: 300,
        text: "continue_with",
      }
    );

  }, [handleGoogleResponse]);

  // ✅ NORMAL LOGIN
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const res =
        await dispatch(
          loginUser(form)
        );

      if (
        res.meta
          .requestStatus ===
        "fulfilled"
      ) {

        const {
          role,
          id,
        } = res.payload.user;

        socket.emit(
          "join",
          id
        );

        navigate(
          DASH[role] ||
            "/citizen",

          { replace: true }
        );
      }
    };

  return (

    <div className="premium-container">

      <form
        className="premium-card"
        onSubmit={handleSubmit}
      >

        <h2>
          CiviTrack
        </h2>

        <p className="subtitle">
          Welcome back
        </p>

        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

        {/* EMAIL */}
        <div className="input-group">

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => {

              dispatch(
                clearError()
              );

              setForm({
                ...form,
                email:
                  e.target.value,
              });
            }}
          />

          <label>
            Email
          </label>

        </div>

        {/* PASSWORD */}
        <div className="input-group">

          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => {

              dispatch(
                clearError()
              );

              setForm({
                ...form,
                password:
                  e.target.value,
              });
            }}
          />

          <label>
            Password
          </label>

        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

        {/* GOOGLE */}
        <div className="divider">

          <span>
            or
          </span>

        </div>

        <div
          id="google-btn"
          className="google-btn-wrapper"
        />

        {/* SIGNUP */}
        <p className="switch">

          Don't have an account?

          {" "}

          <Link to="/signup">
            Signup
          </Link>

        </p>

      </form>

    </div>
  );
}