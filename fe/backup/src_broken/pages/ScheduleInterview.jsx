import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ScheduleInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(
          "http://localhost:8080/api/interviews",
          config
        );
        setInterviews(res.data);
      } catch (err) {
        console.error("Fetch interviews failed:", err);
        setError(
          err.response?.data?.message ||
            "Unable to fetch interviews. Check console."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <p className="text-blue-900 font-semibold text-xl">Loading interviews...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <p className="text-red-600 font-semibold text-xl">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <motion.h1
        className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Scheduled Interviews
      </motion.h1>

      {interviews.length === 0 ? (
        <p className="text-blue-900 font-medium text-lg">
          No interviews scheduled yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <motion.div
              key={interview._id}
              className="bg-white shadow-lg rounded-3xl p-6 border-t-4 border-[#2563EB] hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                {interview.jobTitle || "Untitled Job"}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Candidate:</span>{" "}
                {interview.candidateName || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Company:</span>{" "}
                {interview.companyName || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {interview.interviewDate || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Type:</span>{" "}
                {interview.interviewType || "N/A"}
              </p>
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Status:</span>{" "}
                {interview.status || "Pending"}
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#C4A300] text-white font-semibold rounded-xl hover:opacity-90 transition">
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
