import React, { useState } from "react";
import { Switch } from "../components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button.jsx";
import { Sun, Moon, Bell, Shield, Plug, Save } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    autoLogout: "30m",
  });

  const handleSave = () => {
    console.log({ theme, notifications, security });
    alert("✅ Preferences saved successfully!");
  };

  // Dynamic classes based on theme
  const bgClass = theme === "light" ? "bg-[#f9fafb]" : "bg-gray-900";
  const textClass = theme === "light" ? "text-gray-800" : "text-yellow-400";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const cardBorder = theme === "light" ? "border-blue-200" : "border-gray-700";
  const headerBgLight = "bg-blue-100/50";
  const headerBgDark = "bg-gray-700/50";

  return (
    <div className={`p-6 min-h-screen ${bgClass} ${textClass}`}>
      <h1 className={`text-3xl font-semibold mb-6 ${textClass}`}>⚙️ Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🌗 Theme Section */}
        <Card className={`shadow-md rounded-2xl border ${cardBorder} ${cardBg}`}>
          <CardHeader className={`${theme === "light" ? headerBgLight : headerBgDark} rounded-t-2xl`}>
            <CardTitle className={`flex items-center gap-2 ${textClass}`}>
              <Sun className="text-yellow-500" /> Theme Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={textClass}>App Theme</span>
              <Button
                variant="outline"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`${
                  theme === "light"
                    ? "bg-white text-[#1e3a8a] hover:bg-blue-50"
                    : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                }`}
              >
                {theme === "light" ? (
                  <>
                    <Sun className="mr-2 text-yellow-500" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 text-yellow-400" /> Dark
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🔔 Notifications */}
        <Card className={`shadow-md rounded-2xl border ${cardBorder} ${cardBg}`}>
          <CardHeader className={`${theme === "light" ? "bg-yellow-50" : headerBgDark} rounded-t-2xl`}>
            <CardTitle className={`flex items-center gap-2 ${textClass}`}>
              <Bell className="text-yellow-500" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between capitalize">
                <span className={textClass}>{key} alerts</span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 🛡️ Security Settings */}
        <Card className={`shadow-md rounded-2xl border ${cardBorder} ${cardBg}`}>
          <CardHeader className={`${theme === "light" ? headerBgLight : headerBgDark} rounded-t-2xl`}>
            <CardTitle className={`flex items-center gap-2 ${textClass}`}>
              <Shield className="text-blue-600" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={textClass}>Two-Factor Authentication</span>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSecurity({ ...security, twoFactorAuth: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={textClass}>Auto Logout</span>
              <select
                value={security.autoLogout}
                onChange={(e) =>
                  setSecurity({ ...security, autoLogout: e.target.value })
                }
                className={`border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 ${
                  theme === "light"
                    ? "text-gray-800 focus:ring-blue-300"
                    : "text-yellow-400 bg-gray-700 focus:ring-yellow-400"
                }`}
              >
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 🔌 Integrations */}
        <Card className={`shadow-md rounded-2xl border ${cardBorder} ${cardBg}`}>
          <CardHeader className={`${theme === "light" ? "bg-yellow-50" : headerBgDark} rounded-t-2xl`}>
            <CardTitle className={`flex items-center gap-2 ${textClass}`}>
              <Plug className="text-yellow-500" /> Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <p className={textClass}>Connect external tools and services.</p>
            <div className="space-y-2">
              {["Google Calendar", "Slack", "ATS System"].map((service) => (
                <div key={service} className="flex items-center justify-between capitalize">
                  <span className={textClass}>{service}</span>
                  <Button
                    variant="outline"
                    className={`${
                      theme === "light"
                        ? "bg-white text-blue-700 hover:bg-blue-50"
                        : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    } text-sm`}
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          className={`${
            theme === "light"
              ? "bg-[#1e40af] hover:bg-[#1e3a8a]"
              : "bg-blue-800 hover:bg-blue-700"
          } text-yellow-400 flex items-center gap-2 px-6 py-2 rounded-lg`}
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
