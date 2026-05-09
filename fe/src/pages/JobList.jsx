import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Zap, Edit2, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch jobs from backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get("https://hiring-dashboard-project.onrender.com/jobs", config);
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        alert("Unable to fetch job listings. Check console.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Filter jobs by title or department
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase())
  );

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
        Loading Job Listings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-10">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2 mb-4 sm:mb-0">
          <Briefcase size={34} /> Job Listings
        </h1>

        <Link
          to="/jobs/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Post New Job
        </Link>
      </motion.div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or department..."
          className="w-full sm:w-1/2 p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 rounded-tl-3xl">Title</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Salary</th>
                <th className="px-4 py-2 rounded-tr-3xl text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-3 text-gray-600">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    className="border-b border-gray-200 hover:bg-yellow-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{job.title}</td>
                    <td className="px-4 py-3">{job.department}</td>
                    <td className="px-4 py-3">{job.location}</td>
                    <td className="px-4 py-3 text-blue-700">{job.salaryRange}</td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
