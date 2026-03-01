<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir clase JWT
require_once '../../utils/JWT.php';

// Configuración de base de datos - Dreamhost
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
    exit();
}

try {
    // Verificar autenticación usando JWT
    $jwt = new JWT();
    $token = $jwt->getTokenFromHeader();
    
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Token de acceso requerido'
        ]);
        exit();
    }
    
    // Verificar y decodificar el token JWT
    $payload = $jwt->verifyToken($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Token inválido o expirado'
        ]);
        exit();
    }
    
    // Obtener el ID del usuario del token JWT
    $userId = $payload['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'No se pudo obtener el ID del usuario del token'
        ]);
        exit();
    }
    
    // Obtener servicios del usuario
    $stmt = $pdo->prepare("
        SELECT s.*, u.nombre as proveedor_nombre 
        FROM servicios s 
        LEFT JOIN users u ON s.proveedor = u.id 
        WHERE s.proveedor = ? 
        ORDER BY s.created_at DESC
    ");
    
    $stmt->execute([$userId]);
    $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatear respuesta
    $response = [
        'success' => true,
        'message' => 'Servicios obtenidos correctamente',
        'data' => [
            'servicios' => $servicios
        ]
    ];
    
    echo json_encode($response);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>