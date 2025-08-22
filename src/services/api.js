// Configuración base para las llamadas a la API
const API_BASE_URL = '/api';

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

    const response = await fetch(`${API_BASE_URL}${url}`, config);
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
    const response = await apiRequest('/auth/register', {
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
    const response = await apiRequest('/auth/login', {
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
    const url = `/servicios${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(url);
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
    return await apiRequest('/servicios', {
      method: 'POST',
      body: JSON.stringify(servicioData),
    });
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