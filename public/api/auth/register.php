<?php
// ========================================
// ENDPOINT DE REGISTRO DE USUARIOS
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
    
    $nombre = $input['nombre'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $tipo_usuario = $input['tipoUsuario'] ?? 'estudiante';
    $telefono = $input['telefono'] ?? '';
    $direccion = $input['direccion'] ?? '';
    $bio = $input['bio'] ?? '';
    
    // Validación básica
    if (empty($nombre) || empty($email) || empty($password)) {
        throw new Exception('Nombre, email y contraseña son requeridos');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Instanciar clases
    $userModel = new User();
    $jwt = new JWT();
    
    // Verificar si el email ya existe
    if ($userModel->emailExists($email)) {
        $response = [
            'success' => false,
            'message' => 'El email ya está registrado'
        ];
    } else {
        // Crear usuario
        $user_data = [
            'nombre' => $nombre,
            'email' => $email,
            'password' => $password,
            'tipo_usuario' => $tipo_usuario,
            'telefono' => $telefono,
            'direccion' => $direccion,
            'bio' => $bio
        ];
        
        $user_id = $userModel->create($user_data);
        
        if ($user_id) {
            // Obtener usuario creado
            $user = $userModel->getById($user_id);
            
            // Generar token JWT
            $token = $jwt->generateToken($user);
            $refresh_token = $jwt->generateRefreshToken($user['id']);
            
            $response = [
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
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
                'message' => 'Error al crear el usuario'
            ];
        }
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error en registro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}
?>
