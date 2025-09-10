<?php
// ========================================
// ENDPOINT DE SALUD PARA VERIFICAR CONECTIVIDAD
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit();
}

try {
    $response = [
        'success' => true,
        'message' => 'API de admin funcionando correctamente',
        'data' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'server' => 'EasyClase Admin API',
            'version' => '1.0.0',
            'status' => 'healthy'
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error en health check: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}
?>
