<?php
// Script simple para inicializar 2FA
// Acceder desde: https://easyclaseapp.com/api/admin/init-2fa.php

echo "<h1>🔧 Configurando 2FA para EasyClase</h1>";

// Configuración de base de datos
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p>✅ Conectado a la base de datos</p>";
    
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
    echo "<p>✅ Tabla user_2fa creada exitosamente</p>";
    
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
    echo "<p>✅ Tabla user_2fa_logs creada exitosamente</p>";
    
    // Insertar configuración inicial para super admin
    $sql3 = "INSERT INTO user_2fa (user_id, secret, backup_codes, enabled) 
             VALUES ('admin', '', '[]', FALSE)
             ON DUPLICATE KEY UPDATE user_id = user_id";
    
    $pdo->exec($sql3);
    echo "<p>✅ Configuración inicial para admin creada</p>";
    
    echo "<h2>🎉 ¡Base de datos 2FA configurada exitosamente!</h2>";
    echo "<p><strong>Tablas creadas:</strong></p>";
    echo "<ul>";
    echo "<li>user_2fa (configuración de 2FA por usuario)</li>";
    echo "<li>user_2fa_logs (logs de acciones 2FA)</li>";
    echo "</ul>";
    echo "<p><strong>🔐 Ahora puedes usar el sistema 2FA real con Microsoft Authenticator</strong></p>";
    echo "<p><a href='/admin/super'>Ir al Super Admin Panel</a></p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Error configurando base de datos: " . $e->getMessage() . "</p>";
    echo "<p>🔧 Verifica las credenciales de conexión</p>";
}
?>
