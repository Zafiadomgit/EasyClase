import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import notificationScheduler from '../services/notificationSchedulerService.js';

// Generar JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Registro de usuario
export const register = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { nombre, email, codigoPais, telefono, password, tipoUsuario } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
      nombre,
      email,
      codigoPais: codigoPais || '+57', // Colombia por defecto
      telefono,
      password,
      tipoUsuario
    });

    // Enviar correo de bienvenida
    try {
      if (newUser.tipoUsuario === 'profesor') {
        await notificationScheduler.sendImmediateNotification('welcome_professor', { profesor: newUser });
      } else {
        await notificationScheduler.sendImmediateNotification('welcome', { user: newUser });
      }
    } catch (emailError) {
      console.error('Error enviando correo de bienvenida:', emailError);
      // No fallar el registro si falla el correo
    }

    // Generar token
    const token = generateToken(newUser.id); // Cambiar _id por id

    // Respuesta sin la contraseña
    const userResponse = newUser.toPublicJSON(); // Cambiar getPublicProfile por toPublicJSON

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ 
      where: { 
        email: email, 
        activo: true
      } 
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id); // Cambiar _id por id

    // Enviar notificación de login
    try {
      const loginInfo = {
        device: req.headers['user-agent'] || 'No especificado',
        location: req.ip || 'No especificada'
      };
      await notificationScheduler.sendImmediateNotification('login_notification', { user, loginInfo });
    } catch (emailError) {
      console.error('Error enviando notificación de login:', emailError);
      // No fallar el login si falla el correo
    }

    // Respuesta sin la contraseña
    const userResponse = user.toPublicJSON(); // Cambiar getPublicProfile por toPublicJSON

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario actual
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userResponse = user.tipoUsuario === 'profesor' 
      ? user.getTeacherProfile() 
      : user.getPublicProfile();

    res.json({
      success: true,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const updateData = { ...req.body };
    
    // No permitir actualizar ciertos campos
    delete updateData.email;
    delete updateData.password;
    delete updateData.tipoUsuario;
    delete updateData.id;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar usuario
    await user.update(updateData);

    const userResponse = user.tipoUsuario === 'profesor' 
      ? user.getTeacherProfile() 
      : user.getPublicProfile();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
        message: 'Error interno del servidor'
    });
  }
};

// Verificar token (middleware)
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Verificar que el usuario existe y está activo
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Obtener preferencias del usuario
export const obtenerPreferencias = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Estructura de preferencias por defecto
    const preferenciasPorDefecto = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        classReminders: true,
        paymentNotifications: true,
        marketingEmails: false
      },
      language: {
        language: 'es',
        timezone: 'America/Bogota',
        currency: 'COP',
        dateFormat: 'DD/MM/YYYY'
      },
      theme: {
        theme: 'light',
        fontSize: 'medium',
        colorScheme: 'default'
      }
    };

    // Combinar preferencias guardadas con las por defecto
    const preferencias = {
      notifications: { ...preferenciasPorDefecto.notifications, ...user.preferencias?.notifications },
      language: { ...preferenciasPorDefecto.language, ...user.preferencias?.language },
      theme: { ...preferenciasPorDefecto.theme, ...user.preferencias?.theme }
    };

    res.json({
      success: true,
      data: preferencias
    });
  } catch (error) {
    console.error('Error obteniendo preferencias:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar preferencias del usuario
export const actualizarPreferencias = async (req, res) => {
  try {
    const userId = req.userId;
    const { notifications, language, theme } = req.body;

    // Validar que vengan las preferencias
    if (!notifications && !language && !theme) {
      return res.status(400).json({ message: 'Debes proporcionar al menos un tipo de preferencia' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Inicializar preferencias si no existen
    if (!user.preferencias) {
      user.preferencias = {};
    }

    // Actualizar preferencias
    if (notifications) {
      user.preferencias.notifications = { ...user.preferencias.notifications, ...notifications };
    }
    if (language) {
      user.preferencias.language = { ...user.preferencias.language, ...language };
    }
    if (theme) {
      user.preferencias.theme = { ...user.preferencias.theme, ...theme };
    }

    await user.update({ preferencias: user.preferencias });

    res.json({
      success: true,
      message: 'Preferencias actualizadas exitosamente',
      data: user.preferencias
    });
  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};