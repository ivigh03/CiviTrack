import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Optional — null for Google-only accounts
    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["citizen", "staff", "admin"],
      default: "citizen",
    },

    // ── Google OAuth ──────────────────────────────
    googleId: {
      type: String,
      default: null,
    },

    // ── Profile ───────────────────────────────────
    phone: String,

    avatar: String,

    // ── Staff fields ──────────────────────────────
    specialization: {
      type: String,
      enum: ["garbage", "water", "road", "electricity", "general"],
      default: "general",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],

    resolvedCount: {
      type: Number,
      default: 0,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password only when it is set/changed
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password — returns false if no password set (Google-only)
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);