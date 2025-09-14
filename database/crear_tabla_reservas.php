<?php
// Script para crear la tabla de reservas_clases
// Ejecutar desde el navegador: https://tudominio.com/database/crear_tabla_reservas.php

// Configuración de base de datos - Dreamhost
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Creando tabla reservas_clases...</h2>";
    
    $sql = "CREATE TABLE IF NOT EXISTS reservas_clases (
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
    )";
    
    $pdo->exec($sql);
    
    echo "<p style='color: green;'>✅ Tabla 'reservas_clases' creada exitosamente!</p>";
    
    // Verificar que la tabla se creó
    $stmt = $pdo->query("SHOW TABLES LIKE 'reservas_clases'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Verificación: La tabla existe en la base de datos</p>";
    } else {
        echo "<p style='color: red;'>❌ Error: La tabla no se creó correctamente</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>