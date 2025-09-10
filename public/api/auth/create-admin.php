<?php
// ========================================
// ENDPOINT PARA CREAR USUARIO ADMIN
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
    
    // Verificar si el admin ya existe
    if ($userModel->emailExists('admin@easyclase.com')) {
        $response = [
            'success' => true,
            'message' => 'Usuario admin ya existe',
            'data' => [
                'email' => 'admin@easyclase.com',
                'password' => 'Admin123!',
                'tipo' => 'admin'
            ]
        ];
    } else {
        // Datos del usuario admin
        $admin_data = [
            'nombre' => 'Super Administrador',
            'email' => 'admin@easyclase.com',
            'password' => 'Admin123!',
            'tipo_usuario' => 'admin',
            'telefono' => '3000000000',
            'direccion' => 'Sede Principal EasyClase',
            'bio' => 'Super Administrador del sistema EasyClase'
        ];
        
        // Crear usuario admin
        $user_id = $userModel->create($admin_data);
        
        if ($user_id) {
            $response = [
                'success' => true,
                'message' => 'Usuario admin creado exitosamente',
                'data' => [
                    'id' => $user_id,
                    'email' => 'admin@easyclase.com',
                    'password' => 'Admin123!',
                    'tipo' => 'admin'
                ]
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Error al crear usuario admin'
            ];
        }
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error creando usuario admin: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage()
    ]);
}
?>
