import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Complaint from "./models/Complaint.js";
import Notification from "./models/Notification.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await Promise.all([
    Complaint.deleteMany({}),
    User.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  await User.create([
    { name: "Test Citizen", email: "citizen@test.com", password: "Test@123", role: "citizen" },
    { name: "Test Staff", email: "staff@test.com", password: "Test@123", role: "staff" },
    { name: "Test Admin", email: "admin@test.com", password: "Test@123", role: "admin" },
  ]);

  console.log("Seed complete:");
  console.log("  citizen@test.com / Test@123");
  console.log("  staff@test.com   / Test@123");
  console.log("  admin@test.com   / Test@123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
