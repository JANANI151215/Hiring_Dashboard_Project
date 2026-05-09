import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  Users,
  Briefcase,
  BarChart3,
  AlertCircle,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get("https://hiring-dashboard-project.onrender.com/api/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch candidate analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-blue-800 text-lg font-semibold">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="mb-3"
        >
          <Zap size={40} className="text-yellow-400" />
        </motion.div>
        Loading candidate analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center text-red-600">
        <AlertCircle size={40} className="mb-2" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  // === Data Computation ===
  const normalizedCandidates = candidates.map((c) => ({
    ...c,
    status: c.status
      ? c.status.trim().charAt(0).toUpperCase() +
        c.status.trim().slice(1).toLowerCase()
      : "Applied",
  }));

  const statusCounts = normalizedCandidates.reduce((acc, c) => {
    acc[c.status || "Unknown"] = (acc[c.status || "Unknown"] || 0) + 1;
    return acc;
  }, {});

  const totalCandidates = normalizedCandidates.length;

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
    percentage: ((statusCounts[key] / totalCandidates) * 100).toFixed(1),
  }));

  const roleCounts = normalizedCandidates.reduce((acc, c) => {
    const role = c.role || "Unassigned";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const roleData = Object.keys(roleCounts).map((key) => ({
    name: key,
    count: roleCounts[key],
  }));

  const averageScore =
    normalizedCandidates.length > 0
      ? (
          normalizedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) /
          normalizedCandidates.length
        ).toFixed(1)
      : 0;

  const COLORS = ["#1e3a8a", "#fcd34d", "#2563eb", "#cbd5e1", "#475569"];

  // Custom label: show only percentage inside the slice
  const renderLabel = ({ percentage }) => `${percentage}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-10 overflow-x-hidden">
      {/* HEADER */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BarChart3 className="text-blue-800" size={34} />
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
          Analytics
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 mb-10 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Explore real-time analytics on candidate status, hiring trends, and
        performance metrics — elegantly visualized with your preferred palette.
      </motion.p>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <SummaryCard
          title="Total Candidates"
          icon={<Users className="text-blue-900" />}
          value={totalCandidates}
          color="from-blue-100 to-blue-200"
        />
        <SummaryCard
          title="Average Score"
          icon={<TrendingUp className="text-blue-900" />}
          value={averageScore}
          color="from-yellow-100 to-yellow-200"
        />
        <SummaryCard
          title="Unique Roles"
          icon={<Briefcase className="text-blue-900" />}
          value={Object.keys(roleCounts).length}
          color="from-blue-50 to-yellow-100"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* STATUS PIE CHART */}
        <motion.div
          className="bg-white rounded-3xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Users className="text-yellow-500" size={22} /> Candidate Status
          </h2>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={130}
                innerRadius={60}
                paddingAngle={5}
                label={renderLabel} // show percentage only
                labelLine={false}   // remove the sticks
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ marginTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ROLE BAR CHART */}
        <motion.div
          className="bg-white rounded-3xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Briefcase className="text-yellow-500" size={22} /> Role Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={roleData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: "#334155" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#334155" }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#1e3a8a"
                radius={[10, 10, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* FUN FACT */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            <Star className="text-yellow-400" /> Did You Know?
          </h3>
          <p className="mt-2 text-lg opacity-90">
            {averageScore > 7
              ? "Your candidates are performing above average — great talent pool!"
              : "You might want to strengthen candidate screening for higher scores."}
          </p>
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="bg-yellow-400/20 p-4 rounded-full"
        >
          <Zap size={50} className="text-yellow-300" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* === Summary Card Component === */
function SummaryCard({ title, icon, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`flex items-center justify-between bg-gradient-to-r ${color} text-blue-900 rounded-3xl p-6 shadow-md border border-gray-200`}
    >
      <div>
        <p className="text-lg font-medium opacity-80">{title}</p>
        <h2 className="text-4xl font-bold mt-1 tracking-tight">{value}</h2>
      </div>
      <div className="bg-white rounded-full p-3 shadow-sm">{icon}</div>
    </motion.div>
  );
}
