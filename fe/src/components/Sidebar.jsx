import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; // ✅ import ThemeContext
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

// Base nav items
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin","recruiter","interviewer","candidate"] },
  { name: "Interviews", icon: CalendarDays, path: "/interviews", roles: ["admin","interviewer"] },
  { name: "Candidates", icon: Users, path: "/candidates", roles: ["admin","recruiter"] },
  { name: "Analytics", icon: BarChart3, path: "/analytics", roles: ["admin","recruiter"] },
  { name: "Settings", icon: Settings, path: "/settings", roles: ["admin","recruiter","interviewer","candidate"] },
];

// Admin-only links
const adminItems = [
  { name: "Admin Panel", icon: ShieldCheck, path: "/admin", roles: ["admin"] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // ✅ get theme

  const handleLogout = () => {
    logout();
    navigate(0);
    navigate("/login", { replace: true });
  };

  // Dynamic colors based on theme
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-yellow-400" : "text-gray-600";
  const hoverBg = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-blue-50";
  const activeBg = theme === "dark" ? "bg-gray-800" : "bg-blue-50";
  const activeText = theme === "dark" ? "text-yellow-400" : "text-blue-700";

  return (
    <aside className={`h-full w-64 ${bgColor} border-r ${theme === "dark" ? "border-gray-700" : "border-gray-200"} flex flex-col justify-between shadow-sm`}>
      <div className="p-6">
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-yellow-400" : "text-blue-800"}`}>
          Streamline. Track. Hire.
        </h1>
        <div className={`border-b mt-4 w-[70%] ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}></div>
      </div>

      <nav className="flex flex-col mt-4 px-3 gap-2">
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? `${activeBg} border-l-4 border-yellow-400 ${activeText}` : `${textColor} ${hoverBg}`}`}
              >
                <Icon size={18} className={active ? activeText : textColor} />
                {item.name}
              </button>
            );
          })}

        {adminItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? `${activeBg} border-l-4 border-yellow-400 ${activeText}` : `${textColor} ${hoverBg}`}`}
              >
                <Icon size={18} className={active ? activeText : textColor} />
                {item.name}
              </button>
            );
          })}
      </nav>

      <div className={`p-4 border-t mt-auto ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all ${theme === "dark" ? "text-yellow-400 hover:bg-gray-800" : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"}`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
