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

require_once 'config/database.php';

try {
    // Conectar a la base de datos usando la clase Database
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        throw new Exception('No se pudo conectar a la base de datos');
    }
    
    // Obtener todos los servicios activos
    $stmt = $pdo->prepare("
        SELECT s.*, u.nombre as proveedor_nombre, u.email as proveedor_email
        FROM servicios s 
        LEFT JOIN users u ON s.proveedor = u.id 
        WHERE s.estado = 'activo'
        ORDER BY s.created_at DESC
    ");
    
    $stmt->execute();
    $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener categorías únicas
    $stmt = $pdo->prepare("SELECT DISTINCT categoria FROM servicios WHERE estado = 'activo' ORDER BY categoria");
    $stmt->execute();
    $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Formatear respuesta
    $response = [
        'success' => true,
        'message' => 'Servicios obtenidos correctamente',
        'data' => [
            'servicios' => $servicios,
            'categorias' => $categorias
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