import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/Sign in-bro.png";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  }); // default role candidate
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://hiring-dashboard-project.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-[#F9FAFB] via-[#EFF6FF] to-[#DBEAFE]">
      <div
        className="absolute inset-0 opacity-50 animate-[floatPattern_20s_linear_infinite]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #B3C7E6 1.2px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="absolute top-10 left-20 w-72 h-72 bg-[#C4A300]/25 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-16 right-20 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-6xl w-full bg-white/90 shadow-2xl rounded-3xl p-10 border-t-4 border-[#2563EB] backdrop-blur-xl">
        <div className="flex-1">
          <h2 className="text-4xl font-extrabold text-[#1E293B] mb-2 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-[#475569] mb-8 text-lg">
            Manage candidates, streamline recruitment, and hire smarter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#1E293B] mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-[#BFDBFE] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white/80"
              />
            </div>

            <div>
              <label className="block text-[#1E293B] mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-[#BFDBFE] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white/80"
              />
            </div>

            <div>
              <label className="block text-[#1E293B] mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-[#BFDBFE] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white/80"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-[#1E293B] mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-[#BFDBFE] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white/80"
              >
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="interviewer">Interviewer</option>
                <option value="candidate">Candidate</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#C4A300] hover:opacity-90 text-[#FFF9E5] font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-[#1E293B] font-medium">{message}</p>
          )}

          <p className="text-[#475569] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#C4A300] font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center mt-10 lg:mt-0">
          <img
            src={signupImg}
            alt="Signup illustration"
            className="w-4/5 max-w-md object-contain drop-shadow-2xl transform hover:scale-105 transition duration-500"
          />
        </div>
      </div>
    </div>
  );
}
