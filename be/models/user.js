import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Role-based access control (RBAC)
    role: {
      type: String,
      enum: ["admin", "recruiter", "interviewer", "candidate"],
      default: "candidate",
    },

    // ✅ Additional profile fields
    phone: { type: String },
    profilePic: { type: String }, // Will store filename or URL of uploaded image

    // ✅ For password reset
    resetToken: String,
    resetTokenExpire: Date,

    // ✅ Settings field
    settings: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: { type: Boolean, default: true },
      privacy: { type: Boolean, default: false },
      apiIntegration: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
