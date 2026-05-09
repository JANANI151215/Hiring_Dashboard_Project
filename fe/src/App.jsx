import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import LandingPage from "./pages/Landingpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/Reset";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import Interviews from "./pages/Interviews";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NewJob from "./pages/NewJob.jsx";
import MyApplications from "./pages/MyApplications";

import { ThemeProvider } from "./context/ThemeContext";

// 🔒 Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

// 🔒 Admin Route Wrapper
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

// 🔒 Recruiter Route Wrapper
function RecruiterRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "recruiter" && user.role !== "admin")
    return <Navigate to="/home" replace />;
  return children;
}

// 🔒 Interviewer Route Wrapper
function InterviewerRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "interviewer" && user.role !== "admin")
    return <Navigate to="/home" replace />;
  return children;
}

// 🔒 Candidate Route Wrapper
function CandidateRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "candidate" && user.role !== "admin")
    return <Navigate to="/home" replace />;
  return children;
}

// 🧭 Layout — Sidebar/Header logic
function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const noSidebarPages = ["/login", "/signup", "/forgot-password"];
  const hideSidebar =
    noSidebarPages.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/";

  if (hideSidebar || !user) {
    return <div className="min-h-screen bg-[#f9fafb]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#f9fafb] flex flex-col">
        <Header />
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

// 🚀 App Component
export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/home" replace /> : <Signup />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Candidate */}
          <Route
            path="/jobs"
            element={
              <CandidateRoute>
                <Layout>
                  <Jobs />
                </Layout>
              </CandidateRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <CandidateRoute>
                <Layout>
                  <MyApplications />
                </Layout>
              </CandidateRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/jobs/new"
            element={
              <RecruiterRoute>
                <Layout>
                  <NewJob />
                </Layout>
              </RecruiterRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <RecruiterRoute>
                <Layout>
                  <Candidates />
                </Layout>
              </RecruiterRoute>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <RecruiterRoute>
                <Layout>
                  <CandidateProfile />
                </Layout>
              </RecruiterRoute>
            }
          />

          {/* Interviewer */}
          <Route
            path="/interviews"
            element={
              <InterviewerRoute>
                <Layout>
                  <Interviews />
                </Layout>
              </InterviewerRoute>
            }
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={
              <RecruiterRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </RecruiterRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
