import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('cardcraft_token');
    const savedUser = localStorage.getItem('cardcraft_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cardcraft_token');
        localStorage.removeItem('cardcraft_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = response.data.data;

    localStorage.setItem('cardcraft_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('cardcraft_refresh_token', refreshToken);
    }
    localStorage.setItem('cardcraft_user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });
    const { accessToken, refreshToken, user: userData } = response.data.data;

    localStorage.setItem('cardcraft_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('cardcraft_refresh_token', refreshToken);
    }
    localStorage.setItem('cardcraft_user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('cardcraft_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('cardcraft_token');
      localStorage.removeItem('cardcraft_refresh_token');
      localStorage.removeItem('cardcraft_user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('cardcraft_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
