-- Tabla para almacenar configuración 2FA de usuarios
CREATE TABLE IF NOT EXISTS user_2fa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    secret VARCHAR(255) NOT NULL,
    backup_codes JSON NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_enabled (enabled)
);

-- Tabla para logs de verificación 2FA
CREATE TABLE IF NOT EXISTS user_2fa_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    action ENUM('setup', 'verify', 'backup_used', 'disabled') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Insertar configuración inicial para super admin
INSERT INTO user_2fa (user_id, secret, backup_codes, enabled) 
VALUES ('admin', '', '[]', FALSE)
ON DUPLICATE KEY UPDATE user_id = user_id;
