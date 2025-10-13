// Configuración base para las llamadas a la API
// En desarrollo: usa proxy local (/api)
// En producción: usa URL absoluta de Dreamhost con .php
const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || 'https://easyclaseapp.com/api'
  : '/api';

// Helper para manejar errores de la API
const handleApiError = (error) => {
  if (error.response) {
    // Error del servidor con respuesta
    throw new Error(error.response.data?.message || 'Error del servidor');
  } else if (error.request) {
    // Error de red
    throw new Error('Error de conexión. Verifica tu internet.');
  } else {
    // Error desconocido
    throw new Error('Error inesperado. Intenta de nuevo.');
  }
};

// Helper para realizar peticiones HTTP
const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Construir URL completa
    let fullUrl;
    
    if (import.meta.env.PROD) {
      // En producción: agregar .php a todas las rutas
      fullUrl = `${API_BASE_URL}${url}.php`;
    } else {
      // En desarrollo: usar proxy local
      fullUrl = `${API_BASE_URL}${url}`;
    }

    console.log('🌐 API Request URL:', fullUrl); // Debug

    const response = await fetch(fullUrl, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicios de autenticación
export const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await apiRequest('/auth/register-test', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Guardar token en localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await apiRequest('/auth/login-test', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Guardar token en localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    // Actualizar usuario en localStorage
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Servicios de usuario
export const userService = {
  // Obtener perfil del usuario
  obtenerPerfil: async () => {
    return await apiRequest('/auth/profile');
  },

  // Actualizar perfil del usuario
  actualizarPerfil: async (profileData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Cambiar contraseña
  cambiarContrasena: async (passwordData) => {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Obtener estadísticas del usuario
  obtenerEstadisticas: async () => {
    return await apiRequest('/auth/estadisticas');
  },

  // Obtener preferencias del usuario
  obtenerPreferencias: async () => {
    return await apiRequest('/auth/preferencias');
  },

  // Actualizar preferencias del usuario
  actualizarPreferencias: async (preferencias) => {
    return await apiRequest('/auth/preferencias', {
      method: 'PUT',
      body: JSON.stringify(preferencias),
    });
  },
};

// Servicios de profesores
export const profesorService = {
  // Buscar profesores
  buscarProfesores: async (filtros = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `/profesores${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(url);
  },

  // Obtener perfil de un profesor
  obtenerProfesor: async (profesorId) => {
    return await apiRequest(`/profesores/${profesorId}`);
  },

  // Obtener profesores destacados
  obtenerDestacados: async () => {
    return await apiRequest('/profesores/destacados');
  },

  // Obtener categorías
  obtenerCategorias: async () => {
    return await apiRequest('/profesores/categorias');
  },

  // Obtener balance disponible para retiro
  obtenerBalance: async () => {
    return await apiRequest('/profesores/balance');
  },

  // Crear retiro de dinero
  crearRetiro: async (monto) => {
    return await apiRequest('/profesores/retirar', {
      method: 'POST',
      body: JSON.stringify({ monto }),
    });
  },
};

// Servicios de clases
export const claseService = {
  // Solicitar una clase
  solicitarClase: async (claseData) => {
    return await apiRequest('/clases', {
      method: 'POST',
      body: JSON.stringify(claseData),
    });
  },

  // Obtener mis clases
  obtenerMisClases: async (filtros = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `/clases/mis-clases${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(url);
  },

  // Responder a una solicitud de clase (profesor)
  responderSolicitud: async (claseId, respuesta) => {
    return await apiRequest(`/clases/${claseId}/responder`, {
      method: 'PUT',
      body: JSON.stringify(respuesta),
    });
  },

  // Confirmar clase completada
  confirmarCompletada: async (claseId, notas = '') => {
    return await apiRequest(`/clases/${claseId}/completar`, {
      method: 'PUT',
      body: JSON.stringify({ notas }),
    });
  },

  // Cancelar clase
  cancelarClase: async (claseId, motivo = '') => {
    return await apiRequest(`/clases/${claseId}/cancelar`, {
      method: 'PUT',
      body: JSON.stringify({ motivo }),
    });
  },

  // Crear pago para una clase
  crearPago: async (claseId) => {
    return await apiRequest(`/clases/${claseId}/pagar`, {
      method: 'POST',
    });
  },

  // Obtener información de descuentos
  obtenerInfoDescuentos: async (categoria, profesorId) => {
    return await apiRequest(`/clases/descuentos/info?categoria=${encodeURIComponent(categoria)}&profesorId=${profesorId}`);
  },

  // Obtener historial de descuentos
  obtenerHistorialDescuentos: async () => {
    return await apiRequest('/clases/descuentos/historial');
  }
};

// Servicios de reseñas
export const reviewService = {
  // Crear una nueva reseña
  crearReview: async (reviewData) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Obtener reseñas de un profesor
  obtenerReviewsProfesor: async (profesorId, page = 1, limit = 10) => {
    return await apiRequest(`/reviews/profesor/${profesorId}?page=${page}&limit=${limit}`);
  },

  // Responder a una reseña (profesor)
  responderReview: async (reviewId, comentario) => {
    return await apiRequest(`/reviews/${reviewId}/responder`, {
      method: 'PUT',
      body: JSON.stringify({ comentario }),
    });
  },

  // Obtener mis reseñas (estudiante)
  obtenerMisReviews: async (page = 1, limit = 10) => {
    return await apiRequest(`/reviews/mis-reviews?page=${page}&limit=${limit}`);
  }
};

// Servicio para verificar el estado de la API
export const statusService = {
  checkStatus: async () => {
    return await apiRequest('/status');
  },
};

// Servicios para servicios (valga la redundancia)
export const servicioService = {
  // Obtener todos los servicios con filtros
  obtenerServicios: async (filtros = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `https://easyclaseapp.com/api/plantillas.php?tipo=servicios${queryString ? `&${queryString}` : ''}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  },

  // Obtener mis servicios
  obtenerMisServicios: async (filtros = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `/servicios/usuario/mis-servicios${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(url);
  },

  // Obtener un servicio específico
  obtenerServicio: async (servicioId) => {
    return await apiRequest(`/servicios/${servicioId}`);
  },

  // Crear un nuevo servicio
  crearServicio: async (servicioData) => {
    // Usar fetch directamente para evitar el .php automático
    const token = localStorage.getItem('token');
    const url = 'https://easyclaseapp.com/api/plantillas.php?tipo=servicios';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(servicioData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  },

  // Actualizar un servicio
  actualizarServicio: async (servicioId, servicioData) => {
    return await apiRequest(`/servicios/${servicioId}`, {
      method: 'PUT',
      body: JSON.stringify(servicioData),
    });
  },

  // Eliminar un servicio
  eliminarServicio: async (servicioId) => {
    return await apiRequest(`/servicios/${servicioId}`, {
      method: 'DELETE',
    });
  },

  // Obtener categorías de servicios
  obtenerCategorias: async () => {
    return await apiRequest('/servicios/categorias');
  },
};

export default {
  authService,
  userService,
  profesorService,
  claseService,
  servicioService,
  reviewService,
  statusService,
};