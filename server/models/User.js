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

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["citizen", "staff", "admin"],
      default: "citizen",
    },

    // 🔥 NEW FIELDS START HERE

    // 📞 Contact
    phone: String,

    // 🖼 Profile image
    avatar: String,

    // 🧑‍🔧 Staff specialization
    specialization: {
      type: String,
      enum: ["garbage", "water", "road", "electricity", "general"],
      default: "general",
    },

    // 🟢 Staff availability
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // 📊 Track assigned complaints
    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],

    // ⭐ Performance tracking (optional but powerful)
    resolvedCount: {
      type: Number,
      default: 0,
    },

    // 🚫 Account control
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 🔥 NEW FIELDS END
  },
  { timestamps: true }
);

// 🔐 Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);