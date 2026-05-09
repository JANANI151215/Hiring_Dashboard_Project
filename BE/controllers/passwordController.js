import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Step 1: Handle password reset request (generate token)
export const requestPasswordReset = async (req, res) => {
const { email } = req.body;

try {
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: "User not found" });


// Generate a reset token valid for 10 minutes
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

// In a real app, you'd email this link — for now, we return it in response
const resetLink = `http://localhost:5173/reset-password/${token}`;

res.status(200).json({
  message: "Password reset link generated successfully",
  resetLink, // 👈 this helps you test directly in frontend
});


} catch (error) {
res.status(500).json({ message: "Server error", error: error.message });
}
};

// Step 2: Handle actual password reset using token
export const resetPassword = async (req, res) => {
const { token } = req.params;
const { password } = req.body;

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);
if (!user) return res.status(404).json({ message: "User not found" });


const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
await user.save();

res.status(200).json({ message: "Password reset successful. You can now log in." });


} catch (error) {
if (error.name === "TokenExpiredError") {
return res.status(400).json({ message: "Reset link has expired" });
}
res.status(400).json({ message: "Invalid token" });
}
};
