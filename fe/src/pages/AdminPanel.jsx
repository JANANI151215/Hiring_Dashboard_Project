import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Briefcase, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    admin: 0,
    recruiter: 0,
    interviewer: 0,
    candidate: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // ✅ Updated backend port
        const BASE_URL = "http://localhost:8080";

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch stats
        const statsRes = await axios.get(`${BASE_URL}/api/admin/stats`, config);
        setStats(statsRes.data);

        // Fetch recent users
        const usersRes = await axios.get(`${BASE_URL}/api/admin/recent-users`, config);
        setRecentUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        alert("Failed to load admin data. Check console.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-blue-900 font-semibold">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="mr-2"
        >
          <Zap size={36} className="text-yellow-400" />
        </motion.div>
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-10">
      <motion.h1
        className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BarChart3 size={34} /> Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <Card title="Total Users" value={stats.totalUsers} icon={<Users className="text-blue-900" />} color="from-blue-100 to-blue-200" />
        <Card title="Admins" value={stats.admin} icon={<Briefcase className="text-blue-900" />} color="from-yellow-100 to-yellow-200" />
        <Card title="Recruiters" value={stats.recruiter} icon={<Briefcase className="text-blue-900" />} color="from-blue-50 to-yellow-100" />
        <Card title="Interviewers" value={stats.interviewer} icon={<Briefcase className="text-blue-900" />} color="from-yellow-50 to-blue-100" />
      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Users className="text-yellow-500" size={22} /> Recent Registrations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 rounded-tl-3xl">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2 rounded-tr-3xl">Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center px-4 py-2">No users found.</td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 hover:bg-yellow-50 cursor-pointer"
                    onClick={() => (window.location.href = `/profile/${user._id}`)}
                  >
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex items-center justify-between bg-gradient-to-r ${color} text-blue-900 rounded-3xl p-6 shadow-md border border-gray-200`}
    >
      <div>
        <p className="text-lg font-medium opacity-80">{title}</p>
        <h2 className="text-4xl font-bold mt-1 tracking-tight">{value}</h2>
      </div>
      <div className="bg-white rounded-full p-3 shadow-sm">{icon}</div>
    </motion.div>
  );
}
