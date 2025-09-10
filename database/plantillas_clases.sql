-- Tabla para plantillas de clases
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
    
    INDEX idx_profesor (profesor_id),
    INDEX idx_estado (estado),
    INDEX idx_categoria (categoria)
);

-- Insertar algunas plantillas de ejemplo
INSERT INTO plantillas_clases (titulo, descripcion, materia, categoria, tipo, precio, duracion, max_estudiantes, modalidad, requisitos, objetivos, estado, profesor_id) VALUES
('Curso de Excel Avanzado', 'Aprende fórmulas complejas, tablas dinámicas y automatización en Excel', 'Excel', 'Programación', 'individual', 100000, 2, 1, 'online', 'Conocimientos básicos de Excel', 'Dominar Excel avanzado para análisis de datos', 'activa', 1),
('Clase de Matemáticas Avanzadas', 'Cálculo diferencial e integral para estudiantes universitarios', 'Matemáticas', 'Ciencias', 'individual', 50000, 1, 1, 'online', 'Conocimientos de álgebra y trigonometría', 'Resolver problemas de cálculo complejos', 'activa', 1),
('Inglés Conversacional', 'Práctica de conversación en inglés para mejorar fluidez', 'Inglés', 'Idiomas', 'grupal', 35000, 1, 5, 'online', 'Nivel intermedio de inglés', 'Mejorar fluidez en conversación', 'activa', 1);
