<?php
// Script para configurar la base de datos en Dreamhost
// Ejecutar desde: https://easyclaseapp.com/database/setup_dreamhost.php

header('Content-Type: text/html; charset=utf-8');

// Configuración de base de datos - Dreamhost
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

echo "<h1>🚀 Configuración de Base de Datos - EasyClase</h1>";
echo "<p><strong>Host:</strong> $host</p>";
echo "<p><strong>Base de datos:</strong> $dbname</p>";
echo "<p><strong>Usuario:</strong> $username</p>";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<p style='color: green;'>✅ Conexión exitosa a la base de datos</p>";
    
    // Leer el esquema SQL
    $sql = file_get_contents(__DIR__ . '/complete_schema.sql');
    
    if ($sql === false) {
        throw new Exception("No se pudo leer el archivo complete_schema.sql");
    }
    
    // Dividir el SQL en statements individuales
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    $successCount = 0;
    $errorCount = 0;
    
    echo "<h2>📋 Ejecutando esquema de base de datos...</h2>";
    
    foreach ($statements as $statement) {
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue;
        }
        
        try {
            $pdo->exec($statement);
            $successCount++;
            echo "<p style='color: green;'>✅ Statement ejecutado correctamente</p>";
        } catch (PDOException $e) {
            $errorCount++;
            echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
            echo "<p><small>Statement: " . substr($statement, 0, 100) . "...</small></p>";
        }
    }
    
    echo "<h2>📊 Resumen de ejecución:</h2>";
    echo "<p><strong>Exitosos:</strong> $successCount</p>";
    echo "<p><strong>Errores:</strong> $errorCount</p>";
    
    if ($errorCount === 0) {
        echo "<h2 style='color: green;'>🎉 ¡Base de datos configurada exitosamente!</h2>";
        echo "<p>Ahora puedes usar el sistema de clases y servicios.</p>";
    } else {
        echo "<h2 style='color: orange;'>⚠️ Configuración completada con algunos errores</h2>";
        echo "<p>Revisa los errores arriba. Algunos pueden ser normales si las tablas ya existen.</p>";
    }
    
    // Verificar tablas creadas
    echo "<h2>🔍 Verificando tablas creadas:</h2>";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "<p>📋 $table</p>";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Error de conexión: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><small>Script ejecutado el: " . date('Y-m-d H:i:s') . "</small></p>";
?>
