import User from '../models/User.js';
import Clase from '../models/Clase.js';
import Transaction from '../models/Transaction.js';
import Servicio from '../models/Servicio.js';
import PerfilEnriquecido from '../models/PerfilEnriquecido.js';
import Review from '../models/Review.js';

// Configurar asociaciones entre modelos
export const setupAssociations = () => {
  // Usuario tiene muchas clases como estudiante
  User.hasMany(Clase, {
    foreignKey: 'estudiante',
    as: 'clasesComoEstudiante'
  });
  Clase.belongsTo(User, {
    foreignKey: 'estudiante',
    as: 'usuarioEstudiante'
  });

  // Usuario tiene muchas clases como profesor
  User.hasMany(Clase, {
    foreignKey: 'profesor',
    as: 'clasesComoProfesor'
  });
  Clase.belongsTo(User, {
    foreignKey: 'profesor',
    as: 'usuarioProfesor'
  });

  // Usuario tiene muchos servicios
  User.hasMany(Servicio, {
    foreignKey: 'proveedor',
    as: 'servicios'
  });
  Servicio.belongsTo(User, {
    foreignKey: 'proveedor',
    as: 'usuarioProveedor'
  });

  // Usuario tiene un perfil enriquecido
  User.hasOne(PerfilEnriquecido, {
    foreignKey: 'usuario',
    as: 'perfilEnriquecido'
  });
  PerfilEnriquecido.belongsTo(User, {
    foreignKey: 'usuario',
    as: 'usuarioPerfil'
  });

  // Clase tiene muchas transacciones
  Clase.hasMany(Transaction, {
    foreignKey: 'claseId',
    as: 'transacciones'
  });
  Transaction.belongsTo(Clase, {
    foreignKey: 'claseId',
    as: 'clase'
  });

  // Usuario tiene muchas transacciones como estudiante
  User.hasMany(Transaction, {
    foreignKey: 'estudianteId',
    as: 'transaccionesComoEstudiante'
  });
  Transaction.belongsTo(User, {
    foreignKey: 'estudianteId',
    as: 'estudiante'
  });

  // Usuario tiene muchas transacciones como profesor
  User.hasMany(Transaction, {
    foreignKey: 'profesorId',
    as: 'transaccionesComoProfesor'
  });
  Transaction.belongsTo(User, {
    foreignKey: 'profesorId',
    as: 'profesor'
  });

  // Clase tiene una review
  Clase.hasOne(Review, {
    foreignKey: 'clase',
    as: 'review'
  });
  Review.belongsTo(Clase, {
    foreignKey: 'clase',
    as: 'claseReview'
  });

  // Usuario tiene muchas reviews como estudiante
  User.hasMany(Review, {
    foreignKey: 'estudiante',
    as: 'reviewsComoEstudiante'
  });
  Review.belongsTo(User, {
    foreignKey: 'estudiante',
    as: 'usuarioEstudianteReview'
  });

  // Usuario tiene muchas reviews como profesor
  User.hasMany(Review, {
    foreignKey: 'profesor',
    as: 'reviewsComoProfesor'
  });
  Review.belongsTo(User, {
    foreignKey: 'profesor',
    as: 'usuarioProfesorReview'
  });

  console.log('✅ Asociaciones entre modelos configuradas correctamente');
};

export default setupAssociations;
