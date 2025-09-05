<?php
// ========================================
// ENDPOINT DE LOGIN PARA DREAMHOST - CON BD REAL
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

// Incluir clases necesarias
require_once '../models/User.php';
require_once '../utils/JWT.php';

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
    
    // Instanciar clases
    $userModel = new User();
    $jwt = new JWT();
    
    // Autenticar usuario
    $user = $userModel->authenticate($email, $password);
    
    if ($user) {
        // Generar token JWT
        $token = $jwt->generateToken($user);
        $refresh_token = $jwt->generateRefreshToken($user['id']);
        
        $response = [
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'user' => [
                    'id' => $user['id'],
                    'nombre' => $user['nombre'],
                    'email' => $user['email'],
                    'tipoUsuario' => $user['tipo_usuario'],
                    'calificacionPromedio' => $user['calificacion_promedio'] ?? 0,
                    'telefono' => $user['telefono'] ?? '',
                    'direccion' => $user['direccion'] ?? '',
                    'bio' => $user['bio'] ?? '',
                    'avatarUrl' => $user['avatar_url'] ?? '',
                    'fechaRegistro' => $user['fecha_registro'] ?? ''
                ],
                'token' => $token,
                'refresh_token' => $refresh_token,
                'expires_in' => 3600
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
    error_log("Error en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}
?>
