import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  BarChart2,
  RefreshCcw,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);

  const userName =
    user?.fullName || user?.name || (user?.email ? user.email.split("@")[0] : "Guest");

  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    interviews: 0,
    hired: 0,
  });
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);

  // ✅ Fetch dashboard stats (wrapped in useCallback to avoid ESLint warning)
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://hiring-dashboard-project.onrender.com/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        jobs: res.data.jobs,
        candidates: res.data.candidates,
        interviews: res.data.interviews,
        hired: res.data.hired,
      });

      const trendData = res.data.weeklyTrend?.map((d) => d.applicants) || [];
      setWeeklyTrend(trendData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
  }, [token]);

  // ✅ Initial fetch + periodic refresh every 5s
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // ✅ Handle popup card clicks
  const handleCardClick = async (type) => {
    try {
      if (type === "interviews") return;

      let url = "";
      switch (type) {
        case "jobs":
          url = "https://hiring-dashboard-project.onrender.com/api/jobs";
          break;
        case "candidates":
          url = "https://hiring-dashboard-project.onrender.com/api/candidates";
          break;
        case "hired":
          url = "https://hiring-dashboard-project.onrender.com/api/candidates?hired=true";
          break;
        default:
          return;
      }

      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      let items = [];
      if (type === "jobs") items = res.data.map((j) => j.title);
      else items = res.data.map((i) => i.fullName || i.name);

      setPopupTitle(type.charAt(0).toUpperCase() + type.slice(1));
      setPopupItems(items);
      setPopupVisible(true);
    } catch (err) {
      console.error("Failed to fetch names:", err);
      setPopupItems([]);
      setPopupTitle("");
      setPopupVisible(false);
    }
  };

  if (loading) return <div className="p-6 text-blue-700">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div
      className="min-h-screen p-6 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1650&q=80')",
      }}
    >
      {/* ✅ Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* ✅ Main Dashboard Content */}
      <div className="relative z-10">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-10 bg-white/70 px-6 py-4 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Dashboard Insights</h1>
            <p className="text-gray-900 mt-1">
              Hello,{" "}
              <span className="text-yellow-800 font-semibold">{userName}</span>! Track your
              recruitment progress and insights today.
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCcw size={16} /> Refresh Now
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Jobs Posted"
            value={stats.jobs}
            icon={<Briefcase />}
            color="blue"
            onClick={() => handleCardClick("jobs")}
          />
          <StatCard
            title="Candidates"
            value={stats.candidates}
            icon={<Users />}
            color="yellow"
            onClick={() => handleCardClick("candidates")}
          />
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={<Calendar />}
            color="blue"
            onClick={() => handleCardClick("interviews")}
          />
          <StatCard
            title="Hired"
            value={stats.hired}
            icon={<CheckCircle />}
            color="yellow"
            onClick={() => handleCardClick("hired")}
          />
        </div>

        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-600 mb-10">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <BarChart2 className="text-blue-600" /> Weekly Recruitment Trend
          </h2>
          <Line
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Applicants",
                  data: weeklyTrend,
                  borderColor: "#2563EB",
                  backgroundColor: "#3B82F680",
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-r from-blue-100 via-white to-yellow-50 border border-blue-200 rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3">
            Performance Insights 🌟
          </h2>
          <p className="text-gray-900 leading-relaxed">
            Candidate engagement is up 18% compared to last week. Interviews were completed on time,
            and hiring approvals are streamlined. Focus on top candidates for faster recruitment.
          </p>
        </div>

        {/* Popup for Jobs, Candidates, Hired */}
        {popupVisible && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-xl shadow-lg p-6 w-80 z-50">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">{popupTitle}</h3>
            <ul className="max-h-60 overflow-auto">
              {popupItems.length > 0 ? (
                popupItems.map((name, idx) => (
                  <li key={idx} className="text-gray-700 mb-1">{name}</li>
                ))
              ) : (
                <li className="text-gray-500">No items found</li>
              )}
            </ul>
            <button
              onClick={() => setPopupVisible(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Stat Card Component
function StatCard({ title, value, icon, color, onClick }) {
  const colorMap = {
    blue: { border: "border-blue-600", text: "text-blue-800", icon: "text-blue-600" },
    yellow: { border: "border-yellow-500", text: "text-yellow-700", icon: "text-yellow-500" },
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white shadow-md rounded-2xl p-6 border-t-4 ${colorMap[color].border} hover:shadow-lg transition`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <div className={colorMap[color].icon}>{icon}</div>
      </div>
      <p className={`text-3xl font-bold mt-2 ${colorMap[color].text}`}>{value}</p>
    </div>
  );
}
