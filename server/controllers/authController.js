import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

/**
 * Builds the standard auth payload returned to the client.
 * Shape:  { token, user: { id, name, email, role, avatar } }
 * This is what gets stored in Redux + localStorage.
 */
const buildPayload = (user) => ({
  token: generateToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || null,
  },
});

// ─── SIGNUP ─────────────────────────────────────────────────────────────────

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      ...buildPayload(user),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Google-only accounts have no password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Account is blocked" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...buildPayload(user),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GOOGLE AUTH ─────────────────────────────────────────────────────────────

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; // ID token from Google

    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "Google credential missing" });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Existing user — update Google fields if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        await user.save();
      }
    } else {
      // New user — create with Google info, no password
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        role: "citizen", // default role for Google signups
      });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "Account is blocked" });
    }

    res.status(200).json({
      success: true,
      message: "Google login successful",
      ...buildPayload(user),
    });
  } catch (err) {
    console.error("Google auth error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Google authentication failed" });
  }
};

// ─── GET ME (refresh user data) ──────────────────────────────────────────────

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: buildPayload(user).user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};