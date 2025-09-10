<?php
// ========================================
// ENDPOINT PARA LIMPIAR BASE DE DATOS
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
    // Verificar autenticación
    $jwt = new JWT();
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
    }
    
    $decoded = $jwt->validateToken($token);
    
    if (!$decoded || $decoded['email'] !== 'admin@easyclase.com') {
        throw new Exception('Acceso denegado');
    }
    
    $userModel = new User();
    
    // Eliminar todos los usuarios excepto el admin (ID = 1)
    $query = "DELETE FROM users WHERE id != 1";
    $stmt = $userModel->getConnection()->prepare($query);
    $result = $stmt->execute();
    
    if ($result) {
        $response = [
            'success' => true,
            'message' => 'Base de datos limpiada exitosamente. Solo se mantiene el usuario admin.'
        ];
    } else {
        throw new Exception('Error al limpiar la base de datos');
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error limpiando base de datos: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage()
    ]);
}
?>
