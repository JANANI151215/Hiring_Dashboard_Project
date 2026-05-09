import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Pencil, Check, X, Upload } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form fields
  useEffect(() => {
    if (user && !editMode) { // only set fields when not editing
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user, editMode]); // add dependencies to fix ESLint warning

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await axios.put(
        `https://hiring-dashboard-project.onrender.com/api/users/profile/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );

      setUser(res.data);
      setEditMode(false);
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err.message);
      alert("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFF] to-[#E8ECF8] flex justify-center items-center py-10">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10 relative overflow-hidden border-t-4 border-[#0A2342]">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28">
            <div className="w-full h-full rounded-full bg-[#0A2342]/10 flex items-center justify-center text-4xl font-bold text-[#0A2342] border border-[#0A2342]/20 shadow-md overflow-hidden">
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : user?.profilePic ? (
                <img
                  src={`https://hiring-dashboard-project.onrender.com/uploads/${user.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"
              )}
            </div>

            {editMode && (
              <label
                htmlFor="profilePic"
                className="absolute bottom-2 right-2 bg-[#7B1113] text-white p-2 rounded-full cursor-pointer hover:scale-105 transition"
              >
                <Upload size={16} />
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <h2 className="text-3xl font-bold text-[#0A2342] mt-4">
            {editMode ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-center border-b-2 border-[#0A2342] focus:outline-none px-2"
              />
            ) : (
              fullName
            )}
          </h2>
          <p className="text-gray-600">{email}</p>
        </div>

        {/* Details Section */}
        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-gray-500">Phone Number</label>
            {editMode ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-b-2 border-[#0A2342] focus:outline-none px-2 py-1"
              />
            ) : (
              <p className="text-lg text-gray-800">{phone || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500">Role</label>
            <p className="text-lg font-medium capitalize text-gray-800">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Check size={18} />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-[#0A2342] text-white px-5 py-2 rounded-lg hover:bg-[#0A2342]/90 transition"
            >
              <Pencil size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
