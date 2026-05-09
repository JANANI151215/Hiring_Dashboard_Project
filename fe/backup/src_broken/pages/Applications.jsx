import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login to view your applications.");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(
          "http://localhost:8080/api/applications/mine",
          config
        );

        setApplications(res.data); // Expecting array of { job, appliedAt }
      } catch (err) {
        console.error("Failed to fetch applications:", err.response?.data || err);
        alert("Unable to fetch applications. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <p className="text-xl font-semibold animate-pulse text-blue-800">
          Loading your applications...
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <p className="text-xl text-gray-600">You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
        My Job Applications
      </h1>

      <motion.div
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {applications.map(({ job, appliedAt }) => (
          <motion.div
            key={job._id}
            className="bg-white p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 20px 40px rgba(59,130,246,0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
              <Briefcase size={20} /> {job.title}
            </div>
            {job.department && (
              <p className="text-gray-600 mb-2">Department: {job.department}</p>
            )}
            {job.location && (
              <p className="flex items-center gap-1 text-gray-500 mb-2">
                <MapPin size={16} /> {job.location}
              </p>
            )}
            {job.salaryRange && (
              <p className="flex items-center gap-1 text-gray-500 mb-2">
                <DollarSign size={16} /> {job.salaryRange}
              </p>
            )}
            {job.description && (
              <p className="text-gray-700 mb-4">{job.description}</p>
            )}
            <p className="text-gray-500 font-medium text-sm">
              Applied on: {new Date(appliedAt).toLocaleDateString()}
            </p>
            <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded-xl font-semibold cursor-not-allowed">
              Applied
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
