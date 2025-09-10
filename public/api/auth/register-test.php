<?php
// ========================================
// REGISTRO SIMPLIFICADO PARA TESTING
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
    
    if (!$input || !isset($input['nombre']) || !isset($input['email']) || !isset($input['password']) || !isset($input['tipoUsuario'])) {
        throw new Exception('Todos los campos son requeridos');
    }
    
    // Validar email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Validar contraseña
    if (strlen($input['password']) < 8) {
        throw new Exception('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Simular ID único
    $userId = rand(1000, 9999);
    
    // Crear usuario
    $newUser = [
        'id' => $userId,
        'nombre' => $input['nombre'],
        'email' => $input['email'],
        'telefono' => $input['telefono'] ?? '',
        'tipo_usuario' => $input['tipoUsuario'],
        'estado' => 'activo',
        'fecha_registro' => date('Y-m-d H:i:s')
    ];
    
    // Generar token simple
    $token = base64_encode(json_encode([
        'id' => $userId,
        'email' => $input['email'],
        'tipo_usuario' => $input['tipoUsuario'],
        'exp' => time() + (24 * 60 * 60) // 24 horas
    ]));
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente',
        'data' => [
            'user' => $newUser,
            'token' => $token
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error en register-test: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
