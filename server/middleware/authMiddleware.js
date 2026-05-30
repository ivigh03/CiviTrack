import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Protect: verify JWT ─────────────────────────────────────────────────────

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({ success: false, message: "Account is blocked" });
    }

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

// ─── Role guard ──────────────────────────────────────────────────────────────

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.user.role}`,
      });
    }
    next();
  };
};