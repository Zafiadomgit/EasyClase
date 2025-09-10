<?php
// ========================================
// CREAR USUARIOS DE TEST FUNCIONALES
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit();
}

try {
    // Simular base de datos en memoria
    $testUsers = [
        [
            'id' => 1,
            'nombre' => 'Profesor Test',
            'email' => 'profesor@test.com',
            'telefono' => '3001234567',
            'password' => password_hash('Test123!', PASSWORD_DEFAULT),
            'tipo_usuario' => 'profesor',
            'estado' => 'activo',
            'fecha_registro' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 2,
            'nombre' => 'Estudiante Test',
            'email' => 'estudiante@test.com',
            'telefono' => '3007654321',
            'password' => password_hash('Test123!', PASSWORD_DEFAULT),
            'tipo_usuario' => 'estudiante',
            'estado' => 'activo',
            'fecha_registro' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 3,
            'nombre' => 'Admin Test',
            'email' => 'admin@test.com',
            'telefono' => '3009999999',
            'password' => password_hash('Admin123!', PASSWORD_DEFAULT),
            'tipo_usuario' => 'admin',
            'estado' => 'activo',
            'fecha_registro' => date('Y-m-d H:i:s')
        ]
    ];
    
    // Guardar en localStorage simulado (en un archivo JSON)
    $usersFile = '../data/test-users.json';
    if (!file_exists(dirname($usersFile))) {
        mkdir(dirname($usersFile), 0755, true);
    }
    file_put_contents($usersFile, json_encode($testUsers));
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuarios de test creados exitosamente',
        'data' => [
            'usuarios' => array_map(function($user) {
                unset($user['password']); // No devolver contraseñas
                return $user;
            }, $testUsers)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error creando usuarios de test: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
