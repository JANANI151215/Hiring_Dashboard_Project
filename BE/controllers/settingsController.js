import User from "../models/user.js"; // adjust path if needed

// ✅ Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.settings || {});
  } catch (err) {
    console.error("❌ Error fetching settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { theme, notifications, privacy, apiIntegration } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user.settings doesn’t exist yet, initialize it
    if (!user.settings) user.settings = {};

    user.settings.theme = theme || user.settings.theme || "light";
    user.settings.notifications = notifications ?? user.settings.notifications ?? true;
    user.settings.privacy = privacy ?? user.settings.privacy ?? false;
    user.settings.apiIntegration = apiIntegration ?? user.settings.apiIntegration ?? false;

    await user.save();

    res.status(200).json({ message: "Settings updated successfully", settings: user.settings });
  } catch (err) {
    console.error("❌ Error updating settings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
