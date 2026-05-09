import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import hiringImage from "../assets/Login-bro.png";

export default function Login() {
const navigate = useNavigate();
const { login } = useContext(AuthContext);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const handleLogin = async (e) => {
e.preventDefault();
setError("");
try {
const res = await fetch(`${BASE_URL}/api/users/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password }),
});


  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  // Save user in context and localStorage
  login(data);
  localStorage.setItem("userInfo", JSON.stringify(data));

  // ✅ Redirect to Home page
  navigate("/home");
} catch (err) {
  setError(err.message);
}


};

return ( <div className="relative min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#DCE6FF] via-[#EAF2FF] to-[#C9DBFF] text-[#0A2342] overflow-hidden">
{/* Background pattern */}
<div
className="absolute inset-0 opacity-60 animate-[floatPattern_20s_linear_infinite]"
style={{
backgroundImage:
"radial-gradient(circle at 1px 1px, #AFC8FF 1.2px, transparent 0)",
backgroundSize: "20px 20px",
}}
></div>


  {/* Illustration */}
  <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
    <img
      src={hiringImage}
      alt="Hiring illustration"
      className="max-w-md w-full drop-shadow-xl rounded-xl"
    />
  </div>

  {/* Login form */}
  <div className="flex-1 flex items-center justify-center p-10 z-10">
    <div className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#AFC8FF]">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0A2342]">
        Welcome Back
      </h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#0A2342] mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-[#F4F7FB] border border-[#8BA8E6] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A2342] mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-[#F4F7FB] border border-[#8BA8E6] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#142B6A] text-white font-semibold py-3 rounded-md transition duration-200 shadow-lg"
        >
          Login
        </button>
      </form>

      <p className="text-center text-[#3A4B6A] mt-6">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-[#B8860B] hover:text-[#DAA520] font-semibold"
        >
          Sign Up
        </Link>
      </p>

      <p className="text-center text-sm mt-2">
        <Link to="/forgot-password" className="text-[#1E3A8A] underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  </div>
</div>


);
}
