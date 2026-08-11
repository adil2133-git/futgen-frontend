import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthStatus as checkAuthStatusThunk,
  loginUser as loginUserThunk,
  registerUser as registerUserThunk,
  logoutUser as logoutUserThunk,
  setUser as setUserAction,
  setIsAuthenticated as setIsAuthenticatedAction,
  setError as setErrorAction,
  clearError as clearErrorAction,
  updateUser as updateUserAction,
  setLoading as setLoadingAction,
} from '../store/slices/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const publicPaths = ["/login", "/register", "/verify-otp", "/resend-otp"];
    if (publicPaths.includes(window.location.pathname)) {
      dispatch(setLoadingAction(false));
      return;
    }
    dispatch(checkAuthStatusThunk());
  }, [dispatch]);

  const checkAuthStatus = async () => {
    return dispatch(checkAuthStatusThunk());
  };

  const clearError = () => dispatch(clearErrorAction());

  const setError = (msg) => dispatch(setErrorAction(msg));

  const setUser = (userData) => dispatch(setUserAction(userData));

  const setIsAuthenticated = (status) => dispatch(setIsAuthenticatedAction(status));

  const login = async (email, password) => {
    try {
      const resultAction = await dispatch(loginUserThunk({ email, password })).unwrap();
      return {
        success: true,
        user: resultAction.user,
        isAdmin: resultAction.isAdmin
      };
    } catch (err) {
      if (err?.status === 403) {
        dispatch(setErrorAction("Your account has been blocked by admin"));
        return { success: false };
      }
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const message = await dispatch(registerUserThunk(userData)).unwrap();
      return { success: true, message };
    } catch (errMessage) {
      return { success: false, message: errMessage };
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUserThunk());
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = (updatedUserData) => {
    dispatch(updateUserAction(updatedUserData));
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