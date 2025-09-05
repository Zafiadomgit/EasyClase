<?php
// ========================================
// ENDPOINT PARA CREAR USUARIO DE PRUEBA
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir clases necesarias
require_once '../models/User.php';

try {
    $userModel = new User();
    
    // Verificar si el usuario ya existe
    if ($userModel->emailExists('test@test.com')) {
        $response = [
            'success' => true,
            'message' => 'Usuario test@test.com ya existe',
            'data' => [
                'email' => 'test@test.com',
                'password' => '123456',
                'tipo' => 'estudiante'
            ]
        ];
    } else {
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
            $response = [
                'success' => true,
                'message' => 'Usuario de prueba creado exitosamente',
                'data' => [
                    'id' => $user_id,
                    'email' => 'test@test.com',
                    'password' => '123456',
                    'tipo' => 'estudiante'
                ]
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Error al crear usuario de prueba'
            ];
        }
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error creando usuario de prueba: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage()
    ]);
}
?>
