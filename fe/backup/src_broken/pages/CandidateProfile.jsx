import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

export default function CandidateProfile() {
  const { id } = useParams(); // get candidate id from URL
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "",
    score: "",
  });

  // Fetch candidate data from backend
  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await axios.get(`http://localhost:8080/api/candidates/${id}`);
        setCandidate(res.data);
        setFormData({
          name: res.data.name || "",
          role: res.data.role || "",
          status: res.data.status || "Applied",
          score: res.data.score || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchCandidate();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // send full formData including role to backend
      const res = await axios.put(`http://localhost:8080/api/candidates/${id}`, {
        name: formData.name,
        role: formData.role,
        status: formData.status,
        score: formData.score,
      });
      setCandidate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading candidate...</p>;

  if (!candidate)
    return <p className="text-center mt-20 text-red-600">Candidate not found.</p>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-yellow-50">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Candidate" : candidate.name}
          </h2>
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600">
            <X size={22} />
          </button>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <input
              type="number"
              placeholder="Score"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="applied">Applied</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
            </select>
            <button
              onClick={handleUpdate}
              className="mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p><span className="font-semibold">Role:</span> {candidate.role}</p>
            <p><span className="font-semibold">Status:</span> {candidate.status}</p>
            <p><span className="font-semibold">Score:</span> {candidate.score}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
