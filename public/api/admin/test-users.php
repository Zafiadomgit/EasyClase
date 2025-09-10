<?php
// ========================================
// TEST SIMPLE PARA USUARIOS
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Simular usuarios de prueba
        $users = [
            [
                'id' => 1,
                'nombre' => 'Super Admin',
                'email' => 'admin@easyclase.com',
                'telefono' => '1234567890',
                'tipo_usuario' => 'admin',
                'estado' => 'activo',
                'fecha_registro' => '2024-01-01 00:00:00'
            ],
            [
                'id' => 2,
                'nombre' => 'Profesor Test',
                'email' => 'profesor@test.com',
                'telefono' => '0987654321',
                'tipo_usuario' => 'profesor',
                'estado' => 'activo',
                'fecha_registro' => '2024-01-15 10:30:00'
            ],
            [
                'id' => 3,
                'nombre' => 'Estudiante Test',
                'email' => 'estudiante@test.com',
                'telefono' => '5555555555',
                'tipo_usuario' => 'estudiante',
                'estado' => 'activo',
                'fecha_registro' => '2024-01-20 14:45:00'
            ]
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $users
        ]);
        
    } else {
        // Para otros métodos, devolver éxito
        echo json_encode([
            'success' => true,
            'message' => 'Operación completada'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error en test-users: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
