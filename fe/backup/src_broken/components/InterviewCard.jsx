import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-end items-center gap-4 p-4 bg-white shadow-md rounded-xl mb-6">
      {user && (
        <>
          {/* User info */}
          <div className="flex items-center gap-3">
            {user.profilePic ? (
              <img
                src={user.profilePic} // make sure this is a URL or base64 string
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="font-medium text-gray-800">{user.name || "User"}</span>
          </div>

          {/* Optional: Edit Profile link */}
          <Link
            to="/profile"
            className="text-blue-600 font-medium hover:underline"
          >
            Edit Profile
          </Link>

          {/* Logout button */}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
