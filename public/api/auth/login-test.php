<?php
// ========================================
// LOGIN SIMPLIFICADO PARA TESTING
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
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        throw new Exception('Email y contraseña son requeridos');
    }
    
    // Usuarios de test predefinidos
    $testUsers = [
        'profesor.prueba@easyclase.com' => [
            'id' => 1,
            'nombre' => 'Profesor Prueba',
            'email' => 'profesor.prueba@easyclase.com',
            'telefono' => '3001234567',
            'password' => 'Profesor123!',
            'tipo_usuario' => 'profesor',
            'estado' => 'activo'
        ],
        'estudiante.prueba@easyclase.com' => [
            'id' => 2,
            'nombre' => 'Estudiante Prueba',
            'email' => 'estudiante.prueba@easyclase.com',
            'telefono' => '3007654321',
            'password' => 'Estudiante123!',
            'tipo_usuario' => 'estudiante',
            'estado' => 'activo'
        ],
        'admin@easyclase.com' => [
            'id' => 3,
            'nombre' => 'Super Admin',
            'email' => 'admin@easyclase.com',
            'telefono' => '3009999999',
            'password' => 'Admin123!',
            'tipo_usuario' => 'admin',
            'estado' => 'activo'
        ],
        // Usuarios adicionales para testing
        'profesor@test.com' => [
            'id' => 4,
            'nombre' => 'Profesor Test',
            'email' => 'profesor@test.com',
            'telefono' => '3001234567',
            'password' => 'Test123!',
            'tipo_usuario' => 'profesor',
            'estado' => 'activo'
        ],
        'estudiante@test.com' => [
            'id' => 5,
            'nombre' => 'Estudiante Test',
            'email' => 'estudiante@test.com',
            'telefono' => '3007654321',
            'password' => 'Test123!',
            'tipo_usuario' => 'estudiante',
            'estado' => 'activo'
        ]
    ];
    
    $email = $input['email'];
    $password = $input['password'];
    
    // Verificar si el usuario existe
    if (!isset($testUsers[$email])) {
        throw new Exception('Usuario no encontrado');
    }
    
    $user = $testUsers[$email];
    
    // Verificar contraseña
    if ($password !== $user['password']) {
        throw new Exception('Contraseña incorrecta');
    }
    
    // Verificar estado
    if ($user['estado'] !== 'activo') {
        throw new Exception('Usuario inactivo');
    }
    
    // Generar token simple (en producción usar JWT)
    $token = base64_encode(json_encode([
        'id' => $user['id'],
        'email' => $user['email'],
        'tipo_usuario' => $user['tipo_usuario'],
        'exp' => time() + (24 * 60 * 60) // 24 horas
    ]));
    
    // Preparar datos del usuario (sin contraseña)
    unset($user['password']);
    $user['fecha_registro'] = date('Y-m-d H:i:s');
    
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'data' => [
            'user' => $user,
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error en login-test: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
