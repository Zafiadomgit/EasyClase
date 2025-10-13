-- Crear tabla servicios si no existe
CREATE TABLE IF NOT EXISTS `servicios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `subcategoria` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `tiempoPrevisto_valor` int(11) DEFAULT NULL,
  `tiempoPrevisto_unidad` enum('horas','días','semanas','meses') DEFAULT 'horas',
  `modalidad` enum('virtual','presencial','mixta') DEFAULT 'virtual',
  `proveedor` int(11) NOT NULL,
  `requisitos` text DEFAULT NULL,
  `entregables` text DEFAULT NULL,
  `tecnologias` text DEFAULT NULL,
  `nivelCliente` enum('principiante','intermedio','avanzado') DEFAULT 'intermedio',
  `revisionesIncluidas` int(11) DEFAULT 2,
  `premium` tinyint(1) DEFAULT 0,
  `etiquetas` text DEFAULT NULL,
  `faq` text DEFAULT NULL,
  `fechaLimite` datetime DEFAULT NULL,
  `estado` enum('activo','inactivo','pendiente','rechazado') DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_proveedor` (`proveedor`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_estado` (`estado`),
  KEY `idx_precio` (`precio`),
  CONSTRAINT `fk_servicios_proveedor` FOREIGN KEY (`proveedor`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos servicios de prueba si la tabla está vacía
INSERT IGNORE INTO `servicios` (
  `titulo`, `descripcion`, `categoria`, `precio`, `proveedor`, `estado`
) VALUES 
(
  'Desarrollo Web con React',
  'Aprende a crear aplicaciones web modernas con React, incluyendo hooks, context y routing.',
  'Desarrollo Web',
  50000.00,
  1,
  'activo'
),
(
  'Excel Avanzado',
  'Domina Excel con fórmulas complejas, macros y análisis de datos avanzado.',
  'Ofimática',
  30000.00,
  1,
  'activo'
),
(
  'Diseño Gráfico con Photoshop',
  'Curso completo de diseño gráfico usando Adobe Photoshop desde cero.',
  'Diseño Gráfico',
  40000.00,
  1,
  'activo'
);
