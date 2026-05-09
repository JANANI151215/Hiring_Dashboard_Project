import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2 } from "lucide-react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({}); // store edit data
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/applications/my-applications", config);
        setApplications(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleEdit = (app) => {
    setEditingId(app._id);
    setEditData({ resume: app.resume || "", coverLetter: app.coverLetter || "" });
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/applications/edit/${editingId}`,
        editData,
        config
      );
      alert(res.data.message);
      setApplications((prev) =>
        prev.map((app) => (app._id === editingId ? res.data.application : app))
      );
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading applications...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="border p-4 rounded shadow-md">
              <p><strong>Job:</strong> {app.job.title}</p>
              <p><strong>Status:</strong> {app.status}</p>

              {editingId === app._id ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Resume URL"
                    value={editData.resume}
                    onChange={(e) => setEditData({ ...editData, resume: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Cover Letter URL"
                    value={editData.coverLetter}
                    onChange={(e) => setEditData({ ...editData, coverLetter: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(app)}
                  className="flex items-center gap-1 mt-2 bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-300"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
