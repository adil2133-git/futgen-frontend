import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const publicPaths = ["/login", "/register", "/verify-otp", "/resend-otp"];
    if (publicPaths.includes(window.location.pathname)) {
      setLoading(false); 
      return;
    }
    checkAuthStatus();
  }, []);

//   useEffect(() => {
//   checkAuthStatus();
// }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await api.get("/users/getUser");
      console.log("userDetails in thge get useer:",res.data.user)
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  console.log("local state user:",user)

  const clearError = () => setError('');

  const login = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post("/users/login", { email, password });
      const userData = res.data.user;
      await checkAuthStatus();
      return {
        success: true,
        user: userData,
        isAdmin: userData.role === "admin"
      };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      // 🔴 show blocked message on login page itself, don't let interceptor redirect
      if (err.response?.status === 403) {
        setError("Your account has been blocked by admin");
        return { success: false };
      }

      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/register", userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    setError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;