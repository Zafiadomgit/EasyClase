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
    // Verificar autenticación
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Token de acceso requerido'
        ]);
        exit();
    }
    
    // Verificar token (simplificado por ahora)
    // En una implementación real, deberías verificar el JWT aquí
    
    // Obtener servicios del usuario (simplificado - asumiendo que el usuario está autenticado)
    $stmt = $pdo->prepare("
        SELECT s.*, u.nombre as proveedor_nombre 
        FROM servicios s 
        LEFT JOIN users u ON s.proveedor = u.id 
        WHERE s.proveedor = ? 
        ORDER BY s.created_at DESC
    ");
    
    // Por ahora, usar un ID de usuario fijo para pruebas
    // En una implementación real, deberías obtener el ID del token JWT
    $userId = 1; // Esto debería venir del token JWT
    
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