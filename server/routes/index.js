import express from 'express';
import comprasServiciosRoutes from './comprasServicios.js';
import disponibilidadRoutes from './disponibilidad.js';
import clasesRoutes from './clases.js';
import serviciosRoutes from './servicios.js';
import profesoresRoutes from './profesores.js';
import mercadopagoRoutes from './mercadopago.js';

const router = express.Router();

// Rutas de compras de servicios
router.use('/compras-servicios', comprasServiciosRoutes);

// Rutas de disponibilidad
router.use('/disponibilidad', disponibilidadRoutes);

// Rutas de clases
router.use('/clases', clasesRoutes);

// Rutas de servicios
router.use('/servicios', serviciosRoutes);

// Rutas de profesores
router.use('/profesores', profesoresRoutes);

// Rutas de MercadoPago
router.use('/mercadopago', mercadopagoRoutes);

export default router;
