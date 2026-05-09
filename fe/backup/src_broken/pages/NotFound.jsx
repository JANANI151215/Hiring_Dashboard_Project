import React from "react";
import { Link } from "react-router-dom";
import notFoundImg from "../assets/404-error.png"; // Blue + muted yellow themed image

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex justify-center items-start pt-20 bg-gradient-to-br from-[#F9FAFB] via-[#EFF6FF] to-[#DBEAFE] px-6">
      {/* Subtle decorative shapes */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-[#C4A300]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl"></div>

      {/* Main card */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-5xl w-full bg-white/90 shadow-2xl rounded-3xl p-8 border-t-4 border-[#2563EB] backdrop-blur-xl">
        {/* Illustration */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={notFoundImg}
            alt="404 illustration"
            className="w-4/5 max-w-md object-contain drop-shadow-2xl"
          />
        </div>

        {/* Text section */}
        <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
          <h1 className="text-6xl lg:text-7xl font-extrabold text-[#2563EB] mb-2 tracking-tight">
            404
          </h1>
          <p className="text-lg lg:text-xl text-[#1E293B] mb-4">
            Oops! The page you’re looking for doesn’t exist.
          </p>

          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-[#2563EB] to-[#C4A300] hover:opacity-90 text-[#FFF9E5] font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
