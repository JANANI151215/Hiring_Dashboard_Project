import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const noSidebarPages = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const hideSidebar = noSidebarPages.some((path) => location.pathname.startsWith(path));

  if (hideSidebar || !user) {
    // Public pages → no sidebar, simple container
    return <div className="min-h-screen bg-[#f9fafb]">{children}</div>;
  }

  // Protected pages → sidebar + header + content
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f9fafb] overflow-auto">
        <Header /> {/* Header always at top */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
