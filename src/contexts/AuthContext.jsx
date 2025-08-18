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
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Verificar que el token sigue siendo válido
          try {
            const response = await authService.getProfile();
            if (response.data?.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // Token inválido, limpiar sesión
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Error verificando estado de autenticación:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Mostrar modal Premium para profesores (temporalmente desactivado)
        /*
        if (response.data.user?.tipoUsuario === 'profesor') {
          const lastShown = localStorage.getItem('premiumModalShown');
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
          
          if (!lastShown || parseInt(lastShown) < oneDayAgo) {
            setTimeout(() => {
              setShowPremiumModal(true);
            }, 3000); // Mostrar después de 3 segundos para dar tiempo a cargar
          }
        }
        */
        
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
      
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
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
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.data?.user) {
        setUser(response.data.user);
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