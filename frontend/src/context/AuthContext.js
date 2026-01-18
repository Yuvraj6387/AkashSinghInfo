import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      adminService
        .verifyToken()
        .then((res) => {
          setAdmin(res.data.admin);
          setError(null);
        })
        .catch((err) => {
          localStorage.removeItem('token');
          setAdmin(null);
          setError(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.login(username, password);
      localStorage.setItem('token', response.data.token);
      setAdmin(response.data.admin);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setAdmin(null);
    }
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
