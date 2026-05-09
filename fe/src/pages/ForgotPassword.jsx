import React, { useState } from "react";
import { Link } from "react-router-dom";
import resetImage from "../assets/Forgot password-pana.png";

export default function ForgotPassword() {
const [email, setEmail] = useState("");
const [showToast, setShowToast] = useState(false);

const handleSubmit = (e) => {
e.preventDefault();
if (email.trim() !== "") {
setShowToast(true);
setTimeout(() => setShowToast(false), 3000);
setEmail("");
}
};

return ( <div className="relative min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#EAF2FF] via-[#FDFCF8] to-[#DCE6FF] text-[#0A2342] overflow-hidden">
<div
className="absolute inset-0 opacity-50 animate-[floatPattern_20s_linear_infinite]"
style={{
backgroundImage:
"radial-gradient(circle at 1px 1px, #AFC8FF 1.5px, transparent 0)",
backgroundSize: "22px 22px",
}}
></div>


  <div className="absolute top-16 left-10 w-80 h-80 bg-[#0A2342]/15 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD369]/20 rounded-full blur-3xl animate-pulse"></div>

  <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
    <img
      src={resetImage}
      alt="Reset Password Illustration"
      className="max-w-md w-full drop-shadow-[0_0_35px_rgba(0,0,0,0.15)] rounded-xl"
    />
  </div>

  <div className="flex-1 flex items-center justify-center p-10 z-10">
    <div className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#AFC8FF] relative">
      <h2 className="text-3xl font-bold mb-4 text-center text-[#0A2342]">
        Forgot Password?
      </h2>
      <p className="text-[#3A4B6A] mb-8 text-center">
        Don’t worry! Enter your email and we’ll send you a link to reset
        your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#0A2342] mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-[#F4F7FB] border border-[#8BA8E6] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#FFD369] hover:opacity-90 text-white font-semibold py-3 rounded-md transition duration-200 shadow-lg"
        >
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-[#3A4B6A] mt-6">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="text-[#B8860B] hover:text-[#DAA520] font-semibold"
        >
          Back to Login
        </Link>
      </p>

      {showToast && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0A2342] text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInOut">
          ✅ Reset link sent successfully!
        </div>
      )}
    </div>
  </div>

  <style>{`
    @keyframes floatPattern {
      0% { background-position: 0 0; }
      50% { background-position: 15px 15px; }
      100% { background-position: 0 0; }
    }
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; transform: translateY(20px); }
      10%, 90% { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeInOut {
      animation: fadeInOut 3s ease-in-out;
    }
  `}</style>
</div>

);
}
