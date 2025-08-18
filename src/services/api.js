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
};

// Servicio para verificar el estado de la API
export const statusService = {
  checkStatus: async () => {
    return await apiRequest('/status');
  },
};

export default {
  authService,
  profesorService,
  claseService,
  statusService,
};