import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Calendar, MessageCircle, FileText, Users, Lightbulb, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupItems, setPopupItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const userName = user?.fullName || (user?.email ? user.email.split("@")[0] : "Guest");
  const role = user?.role || "candidate";

  const handleCardClick = async (type) => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      let title = "";

      switch (type) {
        case "interviews":
          url = "https://hiring-dashboard-project.onrender.com/api/home/interviews/upcoming";
          title = "Upcoming Interviews";
          break;
        case "hires":
          url = "https://hiring-dashboard-project.onrender.com/api/home/candidates/hired";
          title = "Recent Hires";
          break;
        case "top":
          url = `https://hiring-dashboard-project.onrender.com/api/home/candidates/top?page=${page}`;
          title = "Top Candidates";
          break;
        default:
          return;
      }

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      if (type === "top") {
        setPopupItems(data.candidates || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setPopupItems(data || []);
      }

      setPopupTitle(title);
      setPopupVisible(true);
    } catch (error) {
      console.error("Failed to fetch popup data:", error);
      setPopupVisible(false);
    }
  };

  const handleClose = () => {
    setPopupVisible(false);
    setPopupItems([]);
  };

  // ================= ADMIN DASHBOARD =================
  if (role === "admin") {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-yellow-50 min-h-screen p-6 relative">
        {/* Greeting Section */}
        <div className="mb-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-blue-800">
              Good {timeOfDay}, {userName}! 
            </h1>
            <RoleBadge role={role} />
          </div>
          <p className="text-gray-700 mt-2 text-lg">
            Ready to streamline your recruitment workflow? Here’s what’s happening today.
          </p>
        </div>

        {/* Workflow Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <HighlightCard
            title="Upcoming Interviews"
            description="Keep track of interviews scheduled today"
            icon={<Calendar size={28} className="text-blue-600" />}
            onClick={() => handleCardClick("interviews")}
          />
          <HighlightCard
            title="Recent Hires"
            description="View your recently hired candidates"
            icon={<MessageCircle size={28} className="text-green-600" />}
            onClick={() => handleCardClick("hires")}
          />
          <HighlightCard
            title="Top Candidates"
            description="Highlight profiles worth reviewing first"
            icon={<Users size={28} className="text-yellow-500" />}
            onClick={() => handleCardClick("top")}
          />
        </div>

        {/* Recruitment Tips */}
        <div className="bg-gradient-to-r from-blue-100 via-white to-yellow-50 border border-blue-200 rounded-3xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Lightbulb className="text-yellow-400" /> Pro Recruitment Tip
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Prioritize candidates who align closely with the role requirements. Fast tracking
            high-potential applicants improves your chances of hiring the best talent.
          </p>
        </div>

        {/* Quick Actions (Admin only remaining) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Post New Job"
            description="Create a new job opening quickly"
            icon={<FileText size={28} className="text-blue-600" />}
            to="/jobs/new"
          />
          <ActionCard
            title="Candidate Shortlist"
            description="Review and shortlist applicants"
            icon={<Users size={28} className="text-yellow-500" />}
            to="/candidates"
          />
          <ActionCard
            title="Schedule Interviews"
            description="Plan interviews efficiently"
            icon={<Calendar size={28} className="text-blue-600" />}
            to="/interviews"
          />
        </div>

        {/* Popup Modal */}
        {popupVisible && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-2xl shadow-xl p-6 w-[28rem] z-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-800">{popupTitle}</h3>
              <button onClick={handleClose} className="text-gray-500 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <ul className="max-h-64 overflow-auto text-gray-700">
              {popupItems.length > 0 ? (
                popupTitle === "Top Candidates" ? (
                  popupItems.map((c, idx) => (
                    <li key={idx} className="mb-1">
                      {c.fullName} — {c.marks} marks
                    </li>
                  ))
                ) : popupTitle === "Upcoming Interviews" ? (
                  popupItems.map((i, idx) => (
                    <li key={idx} className="mb-1">
                      {i.candidateName} — {i.jobTitle} ({i.interviewDate})
                    </li>
                  ))
                ) : (
                  popupItems.map((h, idx) => (
                    <li key={idx} className="mb-1">
                      {h.fullName} — {h.jobTitle}
                    </li>
                  ))
                )
              ) : (
                <li className="text-gray-500">No data found</li>
              )}
            </ul>

            {popupTitle === "Top Candidates" && totalPages > 1 && (
              <div className="flex justify-between mt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-blue-600 disabled:text-gray-400 text-sm"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-blue-600 disabled:text-gray-400 text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ================= NON-ADMIN DASHBOARD =================
  const quickActions = [];
  if (role === "recruiter") {
    quickActions.push(
      {
        title: "Post New Job",
        desc: "Create new job openings",
        icon: <FileText size={26} className="text-blue-600" />,
        to: "/jobs/new",
      },
      {
        title: "Candidate Shortlist",
        desc: "Review applicants",
        icon: <Users size={26} className="text-yellow-600" />,
        to: "/candidates",
      },
      {
        title: "Schedule Interviews",
        desc: "Plan interviews",
        icon: <Calendar size={26} className="text-green-600" />,
        to: "/interviews",
      }
    );
  } else if (role === "interviewer") {
    quickActions.push({
      title: "View Assigned Interviews",
      desc: "Check your interview schedule",
      icon: <Calendar size={26} className="text-blue-600" />,
      to: "/interviews",
    });
  } else if (role === "candidate") {
    quickActions.push(
      {
        title: "Browse Jobs",
        desc: "Find job opportunities",
        icon: <FileText size={26} className="text-blue-600" />,
        to: "/jobs",
      },
      {
        title: "My Applications",
        desc: "Track your applications",
        icon: <Users size={26} className="text-yellow-600" />,
        to: "/my-applications",
      }
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-yellow-50 min-h-screen p-6 relative">
      <div className="mb-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-blue-800">
            Good {timeOfDay}, {userName}! 
          </h1>
          <RoleBadge role={role} />
        </div>
        <p className="text-gray-700 mt-2 text-lg">{`Welcome back to your dashboard.`}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, idx) => (
          <ActionCard
            key={idx}
            title={action.title}
            description={action.desc}
            icon={action.icon}
            to={action.to}
          />
        ))}
      </div>
    </div>
  );
}

// ================= COMPONENTS =================

// Highlight Card
function HighlightCard({ title, description, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl border-l-4 border-transparent hover:border-blue-500 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

// Quick Action Card
function ActionCard({ title, description, icon, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all border-t-4 border-transparent hover:border-yellow-500"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {icon}
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

// Role Badge Component
function RoleBadge({ role }) {
  const normalized = role?.toLowerCase();
  const colors = {
    admin: "bg-red-100 text-red-700",
    recruiter: "bg-blue-100 text-blue-700",
    interviewer: "bg-purple-100 text-purple-700",
    candidate: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm capitalize transition-colors duration-300 ${
        colors[normalized] || "bg-gray-100 text-gray-600"
      }`}
    >
      {normalized}
    </span>
  );
}
