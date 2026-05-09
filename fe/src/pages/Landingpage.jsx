import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, BarChart3, Users, ShieldCheck } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-yellow-50 text-gray-900 overflow-hidden">
      {/* 🌄 Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1950&q=80')",
        }}
      ></div>

      {/* 💫 Gradient Overlays for warmth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-white/40 to-yellow-100/50"></div>

      {/* 🔵 Floating Accent Shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/40 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/50 blur-[120px] rounded-full" />

      {/* 🏠 HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[90vh] px-6">
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-500"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Smarter Hiring Starts Here
        </motion.h1>

        <motion.p
          className="text-gray-700 text-lg sm:text-xl max-w-2xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Transform the way your team hires — with intuitive tracking, analytics,
          and collaboration, all in one elegant dashboard.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-400 hover:text-white rounded-xl font-semibold text-lg shadow-md transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </motion.div>
      </section>

      {/* 💼 FEATURES SECTION */}
      <section className="relative z-10 py-20 px-6 sm:px-12 bg-white/80 backdrop-blur-md">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-blue-700 mb-12">
          Everything You Need to Hire Better
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Users className="text-blue-600 w-10 h-10 mb-3" />}
            title="Team Collaboration"
            desc="Let HR, managers, and recruiters work together seamlessly."
          />
          <FeatureCard
            icon={<Briefcase className="text-blue-600 w-10 h-10 mb-3" />}
            title="Job Management"
            desc="Create, manage, and track openings with organized pipelines."
          />
          <FeatureCard
            icon={<BarChart3 className="text-blue-600 w-10 h-10 mb-3" />}
            title="Analytics"
            desc="View hiring performance metrics in real time with clear visual charts."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-blue-600 w-10 h-10 mb-3" />}
            title="Secure Platform"
            desc="Your company’s data is safe with top-level encryption and privacy."
          />
        </div>
      </section>

      {/* 🌟 CTA SECTION */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-center text-white">
        <motion.h3
          className="text-3xl sm:text-4xl font-semibold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Ready to Simplify Your Hiring Process?
        </motion.h3>
        <motion.button
          onClick={() => navigate("/signup")}
          className="px-10 py-3 bg-yellow-400 text-blue-900 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform hover:shadow-yellow-300/40"
          whileHover={{ scale: 1.05 }}
        >
          Get Started for Free
        </motion.button>
      </section>

      {/*  FOOTER */}
      <footer className="relative z-10 text-center py-6 text-gray-600 bg-blue-50 border-t border-blue-200">
        © {new Date().getFullYear()} HireTrack — Crafted with 💙 by JANANI.
        Contact us : jananijeyabalan15@gmail.com
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    className="bg-white shadow-md rounded-2xl p-8 text-center hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
    whileHover={{ scale: 1.05 }}
  >
    {icon}
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
);
