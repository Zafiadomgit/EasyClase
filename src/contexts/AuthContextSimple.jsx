import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    // Implementación simplificada - solo para diagnóstico
    console.log('Login llamado con:', credentials);
    return { success: true, message: 'Login simplificado' };
  };

  const register = async (userData) => {
    // Implementación simplificada - solo para diagnóstico
    console.log('Register llamado con:', userData);
    return { success: true, message: 'Register simplificado' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    // Implementación simplificada - solo para diagnóstico
    console.log('UpdateProfile llamado con:', profileData);
    return { success: true, message: 'UpdateProfile simplificado' };
  };

  const checkAuthStatus = async () => {
    // Implementación simplificada - solo para diagnóstico
    console.log('CheckAuthStatus llamado');
    setLoading(false);
  };

  const isProfesor = () => {
    return user?.tipoUsuario === 'profesor';
  };

  const isEstudiante = () => {
    return user?.tipoUsuario === 'estudiante';
  };

  const value = {
    // Estado
    user,
    loading,
    isAuthenticated,
    
    // Métodos
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    
    // Helpers
    isProfesor,
    isEstudiante,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
