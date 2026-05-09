import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Search, UserPlus, Users, Grid, List, X } from "lucide-react";

export default function Candidates() {
  useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    role: "candidate",
    status: "applied",
    score: "",
  });

  // Fetch candidates
  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get("http://localhost:8080/api/candidates");
        setCandidates(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add candidate
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email) {
      alert("Name and Email are required!");
      return;
    }

    try {
      const payload = {
        name: newCandidate.name.trim(),
        email: newCandidate.email.trim().toLowerCase(),
        role: "candidate",
        status: newCandidate.status,
        score: newCandidate.score,
      };

      const res = await axios.post(
        "http://localhost:8080/api/candidates",
        payload
      );

      const addedCandidate = res.data._id
        ? res.data
        : { ...payload, _id: Date.now().toString() };

      setCandidates((prev) => [...prev, addedCandidate]);
      setNewCandidate({
        name: "",
        email: "",
        role: "candidate",
        status: "applied",
        score: "",
      });
      setIsModalOpen(false);
      alert("Candidate added successfully!");
    } catch (err) {
      console.error("Error adding candidate:", err.response?.data || err.message);
      alert("Error adding candidate! Check console for details.");
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      alert("Candidate deleted successfully!");
    } catch (err) {
      console.error("Error deleting candidate:", err.response?.data || err.message);
      alert("Error deleting candidate! Check console for details.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-700 font-medium">
        Loading candidates...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          <Users size={30} className="text-blue-700" />
          Candidate Insights
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage, review, and track your candidates efficiently.
        </p>
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none bg-white/70 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition"
          >
            <UserPlus size={18} />
          </button>

          {/* View toggle */}
          <button
            onClick={() => setView("table")}
            className={`p-2 rounded-lg border ${
              view === "table"
                ? "bg-blue-100 border-blue-400"
                : "bg-white border-gray-300"
            } hover:bg-blue-50 transition shadow-sm`}
          >
            <List size={18} className={view === "table" ? "text-blue-700" : "text-gray-500"} />
          </button>

          <button
            onClick={() => setView("card")}
            className={`p-2 rounded-lg border ${
              view === "card"
                ? "bg-blue-100 border-blue-400"
                : "bg-white border-gray-300"
            } hover:bg-blue-50 transition shadow-sm`}
          >
            <Grid size={18} className={view === "card" ? "text-blue-700" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* Table or Card View */}
      {view === "table" ? (
        <CandidateTable
          candidates={filteredCandidates}
          searchTerm={searchTerm}
          navigate={navigate}
          onDelete={handleDeleteCandidate}
        />
      ) : (
        <CandidateCards
          candidates={filteredCandidates}
          searchTerm={searchTerm}
          navigate={navigate}
          onDelete={handleDeleteCandidate}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
          <div
            className="relative bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fadeIn"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.7), rgba(230,240,255,0.35))",
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-blue-700 transition"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Add New Candidate
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-blue-300 bg-white/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Email"
                className="border border-blue-300 bg-white/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Score (frontend only)"
                className="border border-blue-300 bg-white/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                value={newCandidate.score}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, score: e.target.value })
                }
              />
              <select
                className="border border-blue-300 bg-white/50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                value={newCandidate.status}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, status: e.target.value })
                }
              >
                <option value="applied">Applied</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
              </select>
              <button
                onClick={handleAddCandidate}
                className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md transition"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* === Candidate Table === */
function CandidateTable({ candidates, searchTerm, navigate, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-blue-600">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-50">
          <tr className="text-left text-gray-700">
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Role</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6">Score</th>
            <th className="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <tr key={candidate._id} className="hover:bg-blue-50 transition border-b">
                <td className="py-3 px-6 font-medium text-gray-800">{candidate.name}</td>
                <td className="py-3 px-6 text-gray-700">{candidate.role}</td>
                <td className="py-3 px-6">
                  <StatusBadge status={candidate.status} />
                </td>
                <td className="py-3 px-6 font-medium text-gray-800">{candidate.score}</td>
                <td className="py-3 px-6 flex gap-2">
                  <button
                    onClick={() => navigate(`/candidates/${candidate._id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => onDelete(candidate._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500 italic">
                No candidates found for "{searchTerm}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* === Candidate Cards === */
function CandidateCards({ candidates, searchTerm, navigate, onDelete }) {
  return candidates.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <div
          key={candidate._id}
          className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-600 hover:shadow-2xl transition"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
            <StatusBadge status={candidate.status} />
          </div>
          <p className="text-gray-700 mb-2">{candidate.role}</p>
          <p className="text-sm text-gray-500 mb-4">
            Score: <span className="font-semibold text-blue-700">{candidate.score}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/candidates/${candidate._id}`)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md transition text-sm"
            >
              Review
            </button>
            <button
              onClick={() => onDelete(candidate._id)}
              className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl hover:bg-red-200 shadow-sm transition text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 italic mt-10">
      No candidates found for "{searchTerm}"
    </p>
  );
}

/* === Status Badge (fixed color logic) === */
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  const styles = {
    hired: "bg-green-100 text-green-700",
    interviewed: "bg-blue-100 text-blue-700",
    applied: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-700",
    shortlisted: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
