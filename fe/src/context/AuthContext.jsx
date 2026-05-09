import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

//  Create the context
export const AuthContext = createContext();

//  Custom Hook to use AuthContext anywhere
export const useAuth = () => useContext(AuthContext);

//  Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(true); // ✅ Added loading to prevent flicker

  // Sync user and token with localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
      if (user.token) {
        localStorage.setItem("token", user.token);
        setToken(user.token);
      }
    } else {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [user]);

  //  Fetch latest user profile once on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token && user?._id) {
          const res = await axios.get(
            `https://hiring-dashboard-project.onrender.com/api/users/profile/${user._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (res.data) {
            setUser((prev) => {
              const updated = { ...res.data, token: prev?.token || token };
              return JSON.stringify(updated) === JSON.stringify(prev)
                ? prev
                : updated;
            });
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch user from backend:",
          err.response?.data || err.message
        );
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Auth functions
  const login = (userData) => {
    setUser(userData);
    if (userData.token) setToken(userData.token);
  };

  const signup = (userData) => {
    setUser(userData);
    if (userData.token) setToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
