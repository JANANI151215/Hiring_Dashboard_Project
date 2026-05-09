import express from "express";
import { getUserSettings, updateUserSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js"; // assuming you have auth middleware

const router = express.Router();

// 🔒 Routes protected by auth
router.get("/", protect, getUserSettings);
router.put("/", protect, updateUserSettings);

export default router;
