import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Apply theme preference if stored
      const userData = JSON.parse(storedUser);
      if (userData.preferences?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.preferences?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    document.documentElement.classList.remove('dark');
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      updatePreferences({ theme: 'light' });
    } else {
      document.documentElement.classList.add('dark');
      updatePreferences({ theme: 'dark' });
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      if (user) {
        const updatedUser = { ...user, preferences: { ...user.preferences, ...preferences } };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Sync with backend async (don't block UI)
        api.put('/auth/profile', { preferences }).catch(e => console.error("Failed to sync theme", e));
      }
    } catch (error) {
      console.error("Theme update error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
