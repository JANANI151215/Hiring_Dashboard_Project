import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "https://hiring-dashboard-project.onrender.com/api/applications/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch applications error:", err.response || err);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const startEditing = (app) => {
    setEditingId(app._id);
    setResume(app.resume || "");
    setCoverLetter(app.coverLetter || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setResume("");
    setCoverLetter("");
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `https://hiring-dashboard-project.onrender.com/api/applications/edit/${editingId}`,
        { resume, coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === editingId ? data.application : app))
      );
      cancelEditing();
    } catch (err) {
      console.error("Edit application error:", err.response || err);
      alert("Failed to update application");
    }
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 ? (
        <p>You have not applied for any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{app.job.title}</h2>
              <p>Company: {app.job.companyName}</p>
              <p>Location: {app.job.location}</p>
              <p>Status: {app.status}</p>

              {editingId === app._id ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Resume URL"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Cover Letter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="space-x-2">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(app)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Edit Application
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
