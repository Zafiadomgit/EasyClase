import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import PremiumModal from '../components/Modal/PremiumModal';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // PRIMERO: Verificar si hay datos en localStorage
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            // Establecer usuario inmediatamente desde localStorage
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('Usuario restaurado desde localStorage:', parsedUser.name);
          }
        } catch (error) {
          console.error('Error parseando usuario guardado:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      
      // SEGUNDO: Verificar si el token es válido (en background)
      if (savedToken) {
        try {
          const response = await authService.getProfile();
          if (response && response.data && response.data.user) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            setIsAuthenticated(true);
            
            // Actualizar localStorage con datos frescos
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Token válido, perfil actualizado:', updatedUser.name);
          }
        } catch (error) {
          console.error('Error verificando perfil, pero manteniendo sesión local:', error);
          // NO hacer logout automático
          // El usuario puede seguir usando la app con datos locales
        }
      }
      
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
      // NO hacer logout automático en caso de error
      // Solo log del error y continuar
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response && response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Persistir usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Usuario logueado exitosamente:', userData.name);
        
        return response;
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response && response.data && response.data.user) {
        const newUser = response.data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Persistir usuario en localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('Usuario registrado exitosamente:', newUser.name);
        
        return response;
      } else {
        throw new Error('Respuesta de registro inválida');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setShowPremiumModal(false);
      // Limpiar localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('Usuario deslogueado exitosamente');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.data?.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        
        // Actualizar localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Perfil actualizado exitosamente');
        
        return response;
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Verificar si el usuario es profesor
  const isProfesor = () => {
    return user?.tipoUsuario === 'profesor';
  };

  // Verificar si el usuario es estudiante
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
      
      {/* Modal Premium para Profesores - Temporalmente desactivado */}
      {/*
      {user && isAuthenticated && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          user={user}
        />
      )}
      */}
    </AuthContext.Provider>
  );
};