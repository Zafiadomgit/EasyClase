<?php
// ========================================
// ENDPOINT DE LOGIN PARA DREAMHOST
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }
    
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validación básica
    if (empty($email) || empty($password)) {
        throw new Exception('Email y contraseña son requeridos');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // TODO: Aquí iría la conexión a MySQL y validación real
    // Por ahora, mock de respuesta para testing
    
    // Simular validación exitosa
    if ($email === 'test@test.com' && $password === '123456') {
        $response = [
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'user' => [
                    'id' => 1,
                    'nombre' => 'Usuario Test',
                    'email' => $email,
                    'tipoUsuario' => 'estudiante'
                ],
                'token' => 'mock_jwt_token_' . time()
            ]
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'Credenciales inválidas'
        ];
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
