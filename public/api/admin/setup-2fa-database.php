<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de base de datos (usar las mismas credenciales de tu proyecto)
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crear tabla user_2fa
    $sql1 = "CREATE TABLE IF NOT EXISTS user_2fa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL UNIQUE,
        secret VARCHAR(255) NOT NULL,
        backup_codes JSON NOT NULL,
        enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_enabled (enabled)
    )";
    
    $pdo->exec($sql1);
    echo "✅ Tabla user_2fa creada exitosamente\n";
    
    // Crear tabla user_2fa_logs
    $sql2 = "CREATE TABLE IF NOT EXISTS user_2fa_logs (
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
    )";
    
    $pdo->exec($sql2);
    echo "✅ Tabla user_2fa_logs creada exitosamente\n";
    
    // Insertar configuración inicial para super admin
    $sql3 = "INSERT INTO user_2fa (user_id, secret, backup_codes, enabled) 
             VALUES ('admin', '', '[]', FALSE)
             ON DUPLICATE KEY UPDATE user_id = user_id";
    
    $pdo->exec($sql3);
    echo "✅ Configuración inicial para admin creada\n";
    
    echo json_encode([
        'success' => true,
        'message' => 'Base de datos 2FA configurada exitosamente',
        'tables_created' => ['user_2fa', 'user_2fa_logs']
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error configurando base de datos: ' . $e->getMessage()
    ]);
}
?>
