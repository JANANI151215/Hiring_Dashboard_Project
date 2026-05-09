import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ChangePassword() {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL || "https://hiring-dashboard-project.onrender.com";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/api/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setMessage("✅ Password updated successfully! Redirecting...");
      setOldPassword("");
      setNewPassword("");

      // ⏳ Redirect to home after 2 seconds
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#DCE6FF] to-[#C9DBFF]">
      <div className="bg-white/95 p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#0A2342]">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {/* ✅ Display user email */}
          <div className="bg-[#F4F7FB] border border-[#8BA8E6] p-3 rounded-md text-gray-600">
            {user?.email || "No email found"}
          </div>

          <input
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-[#8BA8E6] bg-[#F4F7FB]"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-[#8BA8E6] bg-[#F4F7FB]"
          />

          <button
            type="submit"
            className="w-full bg-[#1E3A8A] hover:bg-[#142B6A] text-white font-semibold py-3 rounded-md transition duration-200"
          >
            Update Password
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
