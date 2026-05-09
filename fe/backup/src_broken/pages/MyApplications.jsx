// src/pages/MyApplications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function MyApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to view your applications.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://localhost:8080/api/jobs/my-applications",
          config
        );
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch applied jobs:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-10 overflow-hidden">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center relative z-10">
        My Applications
      </h1>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600 text-lg relative z-10">
          You have not applied to any jobs yet.
        </p>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300"
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
              <motion.button
                className="w-full py-2 rounded-xl font-semibold bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Applied
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
