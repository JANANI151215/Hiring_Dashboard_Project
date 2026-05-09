import React, { useState } from "react";
import axios from "axios";
import { FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NewJob() {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    salaryRange: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // if you use JWT
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.post("http://localhost:8080/api/jobs", job, config);

      console.log("✅ Job created:", res.data);
      navigate("/jobs", { replace: true });
    } catch (err) {
      console.error("Job creation failed:", err);
      alert("Failed to create job. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-10">
      {/* Header */}
      <motion.h1
        className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FileText size={34} /> Post a New Job
      </motion.h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-3xl p-8 border border-gray-200 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={job.department}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300"
              placeholder="e.g., IT, HR, Finance"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300"
              placeholder="e.g., Remote, Bangalore"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Salary Range
            </label>
            <input
              type="text"
              name="salaryRange"
              value={job.salaryRange}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300"
              placeholder="e.g., ₹8L - ₹12L"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300"
            rows="5"
            placeholder="Write job responsibilities, skills required, etc."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              >
                <Zap size={20} />
              </motion.div>
              Posting...
            </>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
}
