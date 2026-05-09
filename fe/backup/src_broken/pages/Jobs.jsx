import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch all jobs
        const res = await axios.get("http://localhost:8080/api/jobs");
        setJobs(res.data);

        // Fetch applied jobs if token exists
        const token = localStorage.getItem("token");
        if (token) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const appliedRes = await axios.get(
            "http://localhost:8080/api/applications/my-applications",
            config
          );

          // Store applied job IDs
          setAppliedJobs(appliedRes.data.map((job) => job._id));
        }
      } catch (err) {
        console.error("Fetch jobs error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first to apply.");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `http://localhost:8080/api/jobs/${jobId}/apply`,
        {},
        config
      );

      alert(res.data.message || "Applied successfully!");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      console.error("Apply error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <p className="text-xl font-semibold animate-pulse text-blue-800">
          Loading jobs...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-10 overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        className="absolute w-72 h-72 bg-blue-300 rounded-full opacity-20 top-[-50px] left-[-50px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-yellow-300 rounded-full opacity-20 bottom-[-80px] right-[-80px]"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-40 h-40 bg-blue-200 rounded-full opacity-30 top-[30%] right-[-30px]"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center relative z-10">
        Current Job Openings
      </h1>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600 text-lg relative z-10">
          No jobs posted yet. Stay tuned!
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
          {jobs.map((job) => {
            const hasApplied = appliedJobs.includes(job._id);

            return (
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
                  <p className="text-gray-600 mb-2">
                    Department: {job.department}
                  </p>
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
                  whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-2 rounded-xl font-semibold transition-colors ${
                    hasApplied
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-yellow-400 text-blue-900 hover:bg-yellow-300"
                  }`}
                  onClick={() => !hasApplied && handleApply(job._id)}
                  disabled={hasApplied}
                >
                  {hasApplied ? "Applied" : "Apply Now"}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
