import express from "express";
import { requestPasswordReset, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

// Step 1: User requests password reset (enters email)
router.post("/forgot", requestPasswordReset);

// Step 2: User submits new password using token
router.post("/reset/:token", resetPassword);

export default router;
