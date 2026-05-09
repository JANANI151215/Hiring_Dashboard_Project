import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const { token } = useParams();
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();


if (password !== confirmPassword) {
  return setMessage("Passwords do not match");
}

try {
  setLoading(true);
  const res = await axios.post(`https://hiring-dashboard-project.onrender.com/api/password/reset/${token}`, { password });
  setMessage(res.data.message || "Password reset successful!");
  setTimeout(() => navigate("/login"), 2000);
} catch (err) {
  setMessage(err.response?.data?.message || "Error resetting password");
} finally {
  setLoading(false);
}


};

return ( <div className="flex items-center justify-center min-h-screen bg-gray-100"> <div className="bg-white p-8 rounded-2xl shadow-md w-96"> <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Reset Password</h2>
{message && (
<p className={`text-center mb-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
{message} </p>
)} <form onSubmit={handleSubmit}>
<input
type="password"
placeholder="New Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full border p-2 mb-3 rounded-md"
required
/>
<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="w-full border p-2 mb-4 rounded-md"
required
/> <button
         type="submit"
         disabled={loading}
         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
       >
{loading ? "Resetting..." : "Reset Password"} </button> </form> </div> </div>
);
}
