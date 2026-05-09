import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext"; // ✅ import ThemeContext
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme } = useContext(ThemeContext); // ✅ get theme
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate(0);
    navigate("/login", { replace: true });
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-yellow-100";
  const textColor = theme === "dark" ? "text-yellow-400" : "text-blue-800";
  const dropdownBg = theme === "dark" ? "bg-gray-800 text-yellow-400" : "bg-white text-gray-800";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <header className={`flex justify-between items-center px-6 py-4 ${bgColor} ${textColor} shadow-md`}>
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
        <h1 className="text-3xl font-extrabold font-serif">HireEase</h1>
      </div>

      {user ? (
        <div className="relative flex items-center gap-3">
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border shadow-md ${theme === "dark" ? "bg-gray-700 border-yellow-400 text-yellow-400" : "bg-blue-700/20 border-blue-700/40 text-white"}`}>
              {initials}
            </div>
            <span className="font-medium">{user.fullName}</span>
            <ChevronDown
              className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
              size={20}
            />
          </div>

          {open && (
            <div className={`absolute right-0 top-14 w-48 rounded-xl shadow-xl border z-50 ${dropdownBg} ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <ul className="flex flex-col py-2">
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${hoverBg}`}
                    onClick={() => setOpen(false)}
                  >
                    <User size={18} /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${hoverBg}`}
                    onClick={() => setOpen(false)}
                  >
                    <Settings size={18} /> Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-2 px-4 py-2 rounded-lg ${hoverBg} text-left`}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/login"
            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${theme === "dark" ? "bg-gray-700 text-yellow-400 hover:bg-gray-800" : "bg-white text-blue-700 hover:bg-blue-100"}`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition ${theme === "dark" ? "bg-gray-700 text-yellow-400 hover:bg-gray-800" : "bg-blue-200 hover:bg-blue-300"}`}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
