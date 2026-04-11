import jwt from "jsonwebtoken";
import  User  from "../models/User.js";

// 🔑 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🟢 SIGNUP
// ❗ CHANGED: removed `next` (not needed right now)
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // 🔑 Token
    const token = generateToken(user);

    // ✅ RESPONSE
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    // ❗ CHANGED: removed next(err)
    // ✅ Direct error response (simpler & safe)
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 🔵 LOGIN
// ❗ CHANGED: removed `next`
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔐 Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔑 Token
    const token = generateToken(user);

    // ✅ RESPONSE
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    // ❗ CHANGED: removed next(err)
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};