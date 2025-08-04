import React, { createContext, useState, useContext } from 'react';
import { apiLogin } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password);
      setUser(response.user); 
      localStorage.setItem('authToken', response.token);
      
      // ESTA LINHA É A MAIS IMPORTANTE:
      // Ela "devolve" os dados do utilizador para a página de Login.
      return response.user; 
    } catch (error) {
      console.error('Falha no login via contexto', error);
      throw error; 
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};