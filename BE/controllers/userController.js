import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// ✅ Allowed roles for RBAC
const ALLOWED_ROLES = ["admin", "recruiter", "interviewer", "candidate"];

// 🔑 JWT token generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register a new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Validate role
    const assignedRole = ALLOWED_ROLES.includes(role) ? role : "candidate";

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      role: assignedRole,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Authenticate user (login)
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: "Login successful",
    });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update user profile (supports image + phone)
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, role, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Only update role if valid
    if (role && ALLOWED_ROLES.includes(role)) {
      user.role = role;
    }

    // ✅ Handle profile picture upload
    if (req.file) {
      const newFilename = req.file.filename;

      // Ensure uploads folder exists
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      // Delete old pic if exists
      if (user.profilePic) {
        const oldPath = path.join(uploadsDir, user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.profilePic = newFilename;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profilePic: updatedUser.profilePic,
      createdAt: updatedUser.createdAt,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// ✅ Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};
export const checkUserExistence = async (req, res) => {
  try {
    const { fullName, role } = req.body;

    if (!fullName || !role) {
      return res.status(400).json({ error: "fullName and role are required" });
    }

    const user = await User.findOne({ fullName, role });
    if (!user) return res.status(404).json({ exists: false });

    return res.status(200).json({ exists: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
