// ApplyPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ApplyPage() {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://hiring-dashboard-project.onrender.com/api/interviews/apply",
        { jobTitle, companyName, candidateId: user._id, candidateName: user.fullName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Application submitted successfully!");
    } catch (err) {
      alert("Failed to apply. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-4">Apply for a Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="p-3 border rounded-lg w-full"
          required
        />
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="p-3 border rounded-lg w-full"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
