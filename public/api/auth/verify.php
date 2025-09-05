<?php
// ========================================
// ENDPOINT PARA VERIFICAR TOKEN JWT
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
require_once '../utils/JWT.php';
require_once '../models/User.php';

try {
    $jwt = new JWT();
    $userModel = new User();
    
    // Verificar token desde header
    $token_data = $jwt->verifyTokenFromHeader();
    
    if ($token_data) {
        // Obtener datos del usuario
        $user = $userModel->getById($token_data['user_id']);
        
        if ($user) {
            $response = [
                'success' => true,
                'message' => 'Token válido',
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
                    'token_expires' => $token_data['exp']
                ]
            ];
        } else {
            $response = [
                'success' => false,
                'message' => 'Usuario no encontrado'
            ];
        }
    } else {
        $response = [
            'success' => false,
            'message' => 'Token inválido o expirado'
        ];
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error verificando token: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}
?>
