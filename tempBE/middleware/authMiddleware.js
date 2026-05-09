import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * 🔹 Protect Middleware
 * Validates JWT and attaches user details to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if Authorization header is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in DB (excluding password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user info to request object
      req.user = {
        id: user._id, // ✅ Added alias for controllers using req.user.id
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      return next();
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ✅ If token missing
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * 🔹 Verify Token
 * Used for explicit token validation endpoints
 */
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id, // ✅ Added alias too
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("❌ Token validation failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * 🔹 Authorize Middleware
 * Restricts access based on user roles
 * Usage: authorize("admin", "recruiter")
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
