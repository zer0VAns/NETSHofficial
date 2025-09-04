// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwtUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [confirmed, setConfirmed] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).confirmed : false;
  });
  const navigate = useNavigate();

  // Verificar token al cargar la aplicación
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      setUser(null);
      setToken(null);
      setConfirmed(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [token, navigate]);

  // Sincronizar localStorage con el estado
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // Actualizar estado de confirmación
  useEffect(() => {
    if (user) {
      setConfirmed(user.confirmed);
    }
  }, [user]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setConfirmed(userData.confirmed);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setConfirmed(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, confirmed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};