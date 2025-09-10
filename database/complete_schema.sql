-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - EASYCLASE
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipoUsuario ENUM('estudiante', 'profesor', 'admin') DEFAULT 'estudiante',
    telefono VARCHAR(20),
    fechaNacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro'),
    pais VARCHAR(50),
    codigoPais VARCHAR(10) DEFAULT '+57',
    ciudad VARCHAR(50),
    zonaHoraria VARCHAR(50) DEFAULT 'America/Bogota',
    idioma VARCHAR(10) DEFAULT 'es',
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    activo BOOLEAN DEFAULT TRUE,
    emailVerificado BOOLEAN DEFAULT FALSE,
    telefonoVerificado BOOLEAN DEFAULT FALSE,
    ultimoAcceso TIMESTAMP NULL,
    preferencias JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_tipo_usuario (tipoUsuario),
    INDEX idx_estado (estado)
);

-- Tabla de perfiles enriquecidos
CREATE TABLE IF NOT EXISTS perfiles_enriquecidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario INT NOT NULL UNIQUE,
    intereses JSON,
    objetivos JSON,
    preferenciasAprendizaje JSON,
    historialBusquedas JSON,
    clasesTomadas JSON,
    sugerenciasActualizadas TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    configuracionPrivacidad JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario),
    INDEX idx_sugerencias (sugerenciasActualizadas)
);

-- Tabla de plantillas de clases
CREATE TABLE IF NOT EXISTS plantillas_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    materia VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    tipo ENUM('individual', 'grupal') NOT NULL DEFAULT 'individual',
    precio DECIMAL(10,2) NOT NULL,
    duracion INT NOT NULL DEFAULT 1,
    max_estudiantes INT NOT NULL DEFAULT 1,
    modalidad ENUM('online', 'presencial') NOT NULL DEFAULT 'online',
    requisitos TEXT,
    objetivos TEXT,
    estado ENUM('activa', 'inactiva', 'pausada') NOT NULL DEFAULT 'activa',
    profesor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profesor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profesor (profesor_id),
    INDEX idx_estado (estado),
    INDEX idx_categoria (categoria)
);

-- Tabla de clases (reservas específicas)
CREATE TABLE IF NOT EXISTS clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante INT NOT NULL,
    profesor INT NOT NULL,
    plantilla_id INT,
    materia VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    horaInicio VARCHAR(10) NOT NULL,
    duracion INT NOT NULL,
    modalidad ENUM('online', 'presencial') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('solicitada', 'confirmada', 'rechazada', 'completada', 'cancelada') DEFAULT 'solicitada',
    
    -- Información de pago
    pagoId VARCHAR(255),
    estadoPago ENUM('pendiente', 'pagado', 'reembolsado', 'liberado') DEFAULT 'pendiente',
    montoPagado DECIMAL(10,2) DEFAULT 0,
    fechaPago TIMESTAMP NULL,
    transactionId INT,
    
    -- Sistema de Escrow
    escrowStatus ENUM('pending', 'released', 'refunded', 'disputed', 'expired'),
    escrowCreatedAt TIMESTAMP NULL,
    escrowExpiresAt TIMESTAMP NULL,
    escrowReleasedAt TIMESTAMP NULL,
    escrowReleasedBy VARCHAR(100),
    escrowRefundedAt TIMESTAMP NULL,
    escrowRefundReason TEXT,
    escrowDisputedAt TIMESTAMP NULL,
    escrowDisputedBy VARCHAR(100),
    escrowDisputeReason TEXT,
    escrowExpiredAt TIMESTAMP NULL,
    
    -- Enlaces para clase online
    enlaceReunion TEXT,
    
    -- Confirmaciones
    confirmadoPorProfesor BOOLEAN DEFAULT FALSE,
    confirmadoPorEstudiante BOOLEAN DEFAULT FALSE,
    fechaConfirmacion TIMESTAMP NULL,
    fechaComplecion TIMESTAMP NULL,
    
    -- Notas
    notasProfesor TEXT,
    notasEstudiante TEXT,
    
    -- Sistema de descuentos
    descuento_aplicado BOOLEAN DEFAULT FALSE,
    descuento_porcentaje DECIMAL(5,2),
    descuento_montoDescuento DECIMAL(10,2) DEFAULT 0,
    descuento_categoria VARCHAR(50),
    descuento_asumidoPor ENUM('profesor', 'plataforma') DEFAULT 'profesor',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (estudiante) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plantilla_id) REFERENCES plantillas_clases(id) ON DELETE SET NULL,
    INDEX idx_estudiante (estudiante),
    INDEX idx_profesor (profesor),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha)
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM(
        'Tesis y Trabajos Académicos',
        'Desarrollo Web',
        'Desarrollo de Apps',
        'Diseño Gráfico',
        'Marketing Digital',
        'Consultoría de Negocios',
        'Traducción',
        'Redacción de Contenido',
        'Asesoría Legal',
        'Contabilidad y Finanzas',
        'Fotografía',
        'Video y Edición',
        'Arquitectura y Diseño',
        'Ingeniería',
        'Otros'
    ) NOT NULL,
    subcategoria VARCHAR(100),
    precio DECIMAL(10,2) NOT NULL,
    tiempoPrevisto_valor INT NOT NULL,
    tiempoPrevisto_unidad ENUM('horas', 'días', 'semanas', 'meses') NOT NULL,
    modalidad ENUM('presencial', 'virtual', 'mixta') NOT NULL,
    proveedor INT NOT NULL,
    requisitos JSON,
    entregables JSON,
    tecnologias JSON,
    nivelCliente ENUM('principiante', 'intermedio', 'avanzado', 'experto'),
    revisionesIncluidas INT DEFAULT 2,
    premium BOOLEAN DEFAULT FALSE,
    etiquetas JSON,
    faq JSON,
    fechaLimite TIMESTAMP NULL,
    estado ENUM('activo', 'inactivo', 'pausado') DEFAULT 'activo',
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proveedor) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_proveedor (proveedor),
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado),
    INDEX idx_precio (precio)
);

-- Tabla de compras de servicios
CREATE TABLE IF NOT EXISTS compras_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicio INT NOT NULL,
    estudiante INT NOT NULL,
    profesor INT NOT NULL,
    fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaAcceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracion TIMESTAMP NULL,
    estado ENUM('pendiente', 'pagado', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
    pagoId VARCHAR(255),
    transactionId INT,
    montoPagado DECIMAL(10,2) NOT NULL,
    archivosAccedidos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (servicio) REFERENCES servicios(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_estudiante (estudiante),
    INDEX idx_profesor (profesor),
    INDEX idx_servicio (servicio),
    INDEX idx_estado (estado)
);

-- Tabla de disponibilidad de profesores
CREATE TABLE IF NOT EXISTS disponibilidad_profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profesor INT NOT NULL,
    diaSemana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    duracionClaseMinutos INT DEFAULT 60,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (profesor) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profesor (profesor),
    INDEX idx_dia (diaSemana)
);

-- Tabla de reservas de clases
CREATE TABLE IF NOT EXISTS reservas_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clase INT NOT NULL,
    estudiante INT NOT NULL,
    profesor INT NOT NULL,
    fecha DATE NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    duracion INT NOT NULL,
    precioTotal DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
    pagoId VARCHAR(255),
    transactionId INT,
    linkVideollamada TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clase) REFERENCES plantillas_clases(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_estudiante (estudiante),
    INDEX idx_profesor (profesor),
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado)
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transactionId VARCHAR(255) NOT NULL UNIQUE,
    type ENUM('pago_clase', 'retiro_profesor', 'reembolso', 'pago_servicio') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled', 'in_process') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    amountNet DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'COP',
    claseId INT,
    profesorId INT,
    estudianteId INT,
    servicioId INT,
    mercadoPagoId VARCHAR(255) NOT NULL,
    externalReference VARCHAR(255) NOT NULL,
    payer_email VARCHAR(255),
    payer_name VARCHAR(255),
    payer_identification_type VARCHAR(50),
    payer_identification_number VARCHAR(50),
    payment_method_id VARCHAR(100),
    payment_type_id VARCHAR(100),
    status_detail VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (claseId) REFERENCES clases(id) ON DELETE SET NULL,
    FOREIGN KEY (profesorId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (estudianteId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (servicioId) REFERENCES servicios(id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transactionId),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_profesor (profesorId),
    INDEX idx_estudiante (estudianteId)
);

-- Tabla de reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clase INT NOT NULL UNIQUE,
    estudiante INT NOT NULL,
    profesor INT NOT NULL,
    calificacion INT NOT NULL,
    comentario TEXT NOT NULL,
    aspectos JSON,
    recomendaria BOOLEAN DEFAULT TRUE,
    respuestaProfesor_comentario TEXT,
    respuestaProfesor_fecha TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clase) REFERENCES clases(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profesor (profesor),
    INDEX idx_estudiante (estudiante),
    INDEX idx_calificacion (calificacion)
);

-- Tabla de autenticación de dos factores
CREATE TABLE IF NOT EXISTS two_factor_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    qr_code TEXT,
    backup_codes JSON,
    is_enabled BOOLEAN DEFAULT FALSE,
    last_used TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- Insertar datos de ejemplo
INSERT INTO users (nombre, email, password, tipoUsuario, emailVerificado) VALUES
('Admin Sistema', 'admin@easyclase.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE),
('Profesor Demo', 'profesor@easyclase.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'profesor', TRUE),
('Estudiante Demo', 'estudiante@easyclase.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estudiante', TRUE);

-- Insertar plantillas de ejemplo
INSERT INTO plantillas_clases (titulo, descripcion, materia, categoria, tipo, precio, duracion, max_estudiantes, modalidad, requisitos, objetivos, estado, profesor_id) VALUES
('Curso de Excel Avanzado', 'Aprende fórmulas complejas, tablas dinámicas y automatización en Excel', 'Excel', 'Programación', 'individual', 100000, 2, 1, 'online', 'Conocimientos básicos de Excel', 'Dominar Excel avanzado para análisis de datos', 'activa', 2),
('Clase de Matemáticas Avanzadas', 'Cálculo diferencial e integral para estudiantes universitarios', 'Matemáticas', 'Ciencias', 'individual', 50000, 1, 1, 'online', 'Conocimientos de álgebra y trigonometría', 'Resolver problemas de cálculo complejos', 'activa', 2),
('Inglés Conversacional', 'Práctica de conversación en inglés para mejorar fluidez', 'Inglés', 'Idiomas', 'grupal', 35000, 1, 5, 'online', 'Nivel intermedio de inglés', 'Mejorar fluidez en conversación', 'activa', 2);

-- Insertar servicios de ejemplo
INSERT INTO servicios (titulo, descripcion, categoria, precio, tiempoPrevisto_valor, tiempoPrevisto_unidad, modalidad, proveedor, nivelCliente, estado) VALUES
('Desarrollo de Sitio Web', 'Creación completa de sitio web responsivo con HTML, CSS y JavaScript', 'Desarrollo Web', 500000, 2, 'semanas', 'virtual', 2, 'intermedio', 'activo'),
('Asesoría en Marketing Digital', 'Estrategia completa de marketing digital para tu negocio', 'Marketing Digital', 300000, 1, 'semanas', 'virtual', 2, 'principiante', 'activo');
