import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Calendar, Zap, XCircle, CheckCircle, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function InterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [editData, setEditData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    interviewerName: "",
    dateTime: "",
    status: "upcoming",
    companyName: "",
    jobTitle: "",
    interviewType: "",
    feedback: "",
  });

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.token) throw new Error("User not authenticated");
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get("https://hiring-dashboard-project.onrender.com/api/interviews", config);
      setInterviews(res.data);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
      alert("Unable to fetch interviews. Check console.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) fetchInterviews();
  }, [fetchInterviews, user]);

  const filteredInterviews = interviews.filter(
    (intv) =>
      intv.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      intv.interviewerName?.toLowerCase().includes(search.toLowerCase()) ||
      intv.status?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (intv) => {
    if (user?.role === "admin" || user?.role === "recruiter") {
      let safeDateTime = "";
      if (intv.interviewDate && !isNaN(new Date(intv.interviewDate))) {
        safeDateTime = new Date(intv.interviewDate).toISOString().slice(0, 16);
      }

      setSelectedInterview(intv);
      setEditData({
        candidateName: intv.candidateName || "",
        interviewerName: intv.interviewerName || "",
        dateTime: safeDateTime,
        status: intv.status || "upcoming",
      });
    } else {
      alert("You are not authorized to edit interviews.");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedInterview) return;

    const requiredFields = ["candidateName", "interviewerName", "dateTime"];
    for (let field of requiredFields) {
      if (!editData[field]) {
        showToastMessage(`Field "${field}" cannot be empty!`, "red");
        return;
      }
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        candidateName: editData.candidateName,
        interviewerName: editData.interviewerName,
        interviewDate: editData.dateTime,
        status: editData.status || "upcoming",
      };
      await axios.patch(
        `https://hiring-dashboard-project.onrender.com/api/interviews/${selectedInterview._id}`,
        payload,
        config
      );
      await fetchInterviews();
      showToastMessage("Interview updated successfully!", "green");
      setSelectedInterview(null);
    } catch (err) {
      console.error("Error updating interview:", err.response?.data || err.message);
      showToastMessage(err.response?.data?.error || "Failed to update interview", "red");
    }
  };

  const showToastMessage = (msg, color) => {
    setToastMessage(msg);
    setToastColor(color);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = async (id) => {
    if (user?.role === "admin" || user?.role === "recruiter" || user?.role === "interviewer") {
      if (!window.confirm("Are you sure you want to delete this interview?")) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`https://hiring-dashboard-project.onrender.com/api/interviews/${id}`, config);
        await fetchInterviews();
        showToastMessage("Interview deleted successfully!", "red");
      } catch (err) {
        console.error("Error deleting interview:", err);
        showToastMessage("Failed to delete interview", "red");
      }
    } else alert("You are not authorized to delete interviews.");
  };

  const handleAddInterview = async () => {
    const required = ["candidateName", "interviewerName", "dateTime", "companyName", "jobTitle", "interviewType"];
    for (let f of required) {
      if (!newInterview[f]) {
        showToastMessage(`Field "${f}" cannot be empty!`, "red");
        return;
      }
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...newInterview, interviewDate: newInterview.dateTime };
      await axios.post("https://hiring-dashboard-project.onrender.com/api/interviews", payload, config);
      await fetchInterviews();
      showToastMessage("Interview created successfully!", "green");
      setShowAddModal(false);
      setNewInterview({
        candidateName: "",
        interviewerName: "",
        dateTime: "",
        status: "upcoming",
        companyName: "",
        jobTitle: "",
        interviewType: "",
        feedback: "",
      });
    } catch (err) {
      console.error("Error creating interview:", err.response?.data || err.message);
      showToastMessage(err.response?.data?.error || "Failed to create interview", "red");
    }
  };

  const handleCloseModal = () => setSelectedInterview(null);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-blue-900 font-semibold">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="mr-2"
        >
          <Zap size={36} className="text-yellow-400" />
        </motion.div>
        Loading Interviews...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-10 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-white ${
              toastColor === "green" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <CheckCircle size={20} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1
        className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Calendar size={34} /> Interviews
        {(user?.role === "admin" || user?.role === "recruiter") && (
          <PlusCircle
            size={28}
            className="ml-4 text-green-500 cursor-pointer hover:text-green-600"
            onClick={() => setShowAddModal(true)}
          />
        )}
      </motion.h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by candidate, interviewer, or status..."
          className="w-full sm:w-1/2 p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-2 rounded-tl-3xl">Candidate</th>
                <th className="px-4 py-2">Interviewer</th>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-2">
                    No interviews found.
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((intv) => (
                  <tr key={intv._id} className="border-b border-gray-200 hover:bg-yellow-50">
                    <td className="px-4 py-2">{intv.candidateName}</td>
                    <td className="px-4 py-2">{intv.interviewerName}</td>
                    <td className="px-4 py-2">
                      {intv.interviewDate && !isNaN(new Date(intv.interviewDate))
                        ? new Date(intv.interviewDate).toLocaleString()
                        : "Invalid or Missing Date"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-semibold ${
                          intv.status === "upcoming"
                            ? "bg-yellow-400"
                            : intv.status === "completed"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      >
                        {intv.status?.charAt(0).toUpperCase() + intv.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {(user?.role === "admin" || user?.role === "recruiter" || user?.role === "interviewer") && (
                        <>
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() => handleEditClick(intv)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => handleDelete(intv._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">
                Edit Interview — {selectedInterview.candidateName}
              </h2>
              <button onClick={handleCloseModal}>
                <XCircle size={24} className="text-red-500 hover:text-red-700" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <label>
                <span className="font-semibold text-gray-700">Candidate Name *</span>
                <input
                  type="text"
                  value={editData.candidateName}
                  onChange={(e) => setEditData({ ...editData, candidateName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Interviewer *</span>
                <input
                  type="text"
                  value={editData.interviewerName}
                  onChange={(e) => setEditData({ ...editData, interviewerName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Date & Time *</span>
                <input
                  type="datetime-local"
                  value={editData.dateTime}
                  onChange={(e) => setEditData({ ...editData, dateTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Status</span>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Add New Interview</h2>
              <button onClick={() => setShowAddModal(false)}>
                <XCircle size={24} className="text-red-500 hover:text-red-700" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <label>
                <span className="font-semibold text-gray-700">Candidate Name *</span>
                <input
                  type="text"
                  value={newInterview.candidateName}
                  onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Interviewer *</span>
                <input
                  type="text"
                  value={newInterview.interviewerName}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Date & Time *</span>
                <input
                  type="datetime-local"
                  value={newInterview.dateTime}
                  onChange={(e) => setNewInterview({ ...newInterview, dateTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Company *</span>
                <input
                  type="text"
                  value={newInterview.companyName}
                  onChange={(e) => setNewInterview({ ...newInterview, companyName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Job Title *</span>
                <input
                  type="text"
                  value={newInterview.jobTitle}
                  onChange={(e) => setNewInterview({ ...newInterview, jobTitle: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <label>
                <span className="font-semibold text-gray-700">Interview Type *</span>
                <input
                  type="text"
                  value={newInterview.interviewType}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewType: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </label>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInterview}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Interview
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
