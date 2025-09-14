CREATE TABLE IF NOT EXISTS reservas_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clase_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    comentarios TEXT,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clase_id) REFERENCES plantillas_clases(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES users(id) ON DELETE CASCADE
);
