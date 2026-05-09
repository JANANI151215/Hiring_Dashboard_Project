console.log("1️⃣ index.js loaded");

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Import Routes
import interviewRoutes from "./routes/interviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { getAnalytics } from "./controllers/interviewController.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import connectDB from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js"; // ✅ Added missing import

console.log("2️⃣ dotenv imported");
dotenv.config();
console.log("3️⃣ .env loaded");

// ✅ Initialize app
const app = express();
connectDB();

// ✅ Middleware must come before routes
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.get("/api/analytics", getAnalytics);
app.use("/api/password", passwordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/applications", applicationRoutes); // ✅ Added safely here

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hiring_dashboard";
console.log("🔌 Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Root API check route
app.get("/", (req, res) => {
  res.send("🚀 API is running successfully!");
});

// ✅ 404 Handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
