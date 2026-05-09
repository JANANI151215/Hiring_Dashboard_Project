import express from "express";
import multer from "multer";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers, // ✅ Import the new controller
  checkUserExistence, // ✅ Import the new controller
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Public Routes
router.post("/register", registerUser);
router.post("/login", authUser);

// ✅ Protected Routes (logged-in users only)
router.get("/profile/:id", protect, getUserProfile);

// ✅ Update profile (supports file upload)
router.put("/profile/:id", protect, upload.single("profilePic"), updateUserProfile);

// ✅ Admin-only route to fetch all users
router.get("/all-users", protect, authorize("admin"), getAllUsers);

// ✅ New route to check if a user exists by fullName & role
router.get("/check-existence", protect, checkUserExistence);

export default router;
