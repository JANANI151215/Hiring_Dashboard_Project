import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar,
  FileText,
  Users,
  Lightbulb,
  X,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle] = useState(""); // ⚡ Removed unused setPopupTitle
  const [popupItems, setPopupItems] = useState([]);

  const userName =
    user?.fullName || user?.name || (user?.email ? user.email.split("@")[0] : "Guest");
  const role = user?.role || "candidate";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  // 🏷️ Dynamic role badge
  const getBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border border-red-300 shadow-red-200";
      case "recruiter":
        return "bg-blue-100 text-blue-700 border border-blue-300 shadow-blue-200";
      case "interviewer":
        return "bg-purple-100 text-purple-700 border border-purple-300 shadow-purple-200";
      case "candidate":
        return "bg-green-100 text-green-700 border border-green-300 shadow-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300 shadow-gray-200";
    }
  };

  const getGreetingMessage = () => {
    switch (role) {
      case "admin":
        return "You have full control over users, jobs, and analytics.";
      case "recruiter":
        return "Review candidates, manage job postings, and streamline hiring.";
      case "interviewer":
        return "Prepare for your upcoming interviews today!";
      case "candidate":
        return "Track your job applications and prepare for interviews.";
      default:
        return "Welcome to the recruitment portal!";
    }
  };

  const getQuickActions = () => {
    switch (role) {
      case "admin":
        return [
          {
            title: "Manage Users",
            desc: "Add or remove system users",
            icon: <Shield size={26} className="text-red-600" />,
            to: "/admin",
          },
          {
            title: "View Analytics",
            desc: "System-wide analytics",
            icon: <FileText size={26} className="text-blue-600" />,
            to: "/analytics",
          },
        ];
      case "recruiter":
        return [
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
          },
        ];
      case "interviewer":
        return [
          {
            title: "View Assigned Interviews",
            desc: "Check your interview schedule",
            icon: <Calendar size={26} className="text-blue-600" />,
            to: "/interviews",
          },
        ];
      case "candidate":
        return [
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
          },
        ];
      default:
        return [];
    }
  };

  const handleClose = () => {
    setPopupVisible(false);
    setPopupItems([]);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-yellow-50 min-h-screen p-6 relative">
      {/* Greeting Section */}
      <div className="mb-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-bold text-blue-800">
            Good {timeOfDay}, {userName}! 👋
          </h1>

          {/* 🏷️ Animated Role Badge */}
          <span
            className={`ml-4 px-4 py-1 rounded-full text-sm font-semibold capitalize border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-current ${getBadgeStyle(
              role
            )}`}
          >
            {role}
          </span>
        </div>

        <p className="text-gray-700 mt-2 text-lg">{getGreetingMessage()}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {getQuickActions().map((action, idx) => (
          <ActionCard
            key={idx}
            title={action.title}
            description={action.desc}
            icon={action.icon}
            to={action.to}
          />
        ))}
      </div>

      {/* Recruitment Tip */}
      <div className="bg-gradient-to-r from-blue-100 via-white to-yellow-50 border border-blue-200 rounded-3xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Lightbulb className="text-yellow-400" /> Pro Tip
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Strong collaboration between recruiters and interviewers helps speed
          up hiring and improves candidate experience.
        </p>
      </div>

      {/* Popup Modal (if needed later) */}
      {popupVisible && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-2xl shadow-xl p-6 w-[28rem] z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-blue-800">
              {popupTitle}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
          <ul className="max-h-64 overflow-auto text-gray-700">
            {popupItems.length > 0 ? (
              popupItems.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li className="text-gray-500">No data found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

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
