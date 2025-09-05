<?php
// ========================================
// SCRIPT PARA CREAR USUARIO DE PRUEBA
// ========================================

require_once '../config/database.php';
require_once '../models/User.php';

try {
    $userModel = new User();
    
    // Verificar si el usuario ya existe
    if ($userModel->emailExists('test@test.com')) {
        echo "Usuario test@test.com ya existe\n";
        exit();
    }
    
    // Datos del usuario de prueba
    $user_data = [
        'nombre' => 'Usuario Test',
        'email' => 'test@test.com',
        'password' => '123456',
        'tipo_usuario' => 'estudiante',
        'telefono' => '3001234567',
        'direccion' => 'Calle Test #123',
        'bio' => 'Usuario de prueba para testing'
    ];
    
    // Crear usuario
    $user_id = $userModel->create($user_data);
    
    if ($user_id) {
        echo "Usuario de prueba creado exitosamente\n";
        echo "ID: " . $user_id . "\n";
        echo "Email: test@test.com\n";
        echo "Password: 123456\n";
        echo "Tipo: estudiante\n";
    } else {
        echo "Error al crear usuario de prueba\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
