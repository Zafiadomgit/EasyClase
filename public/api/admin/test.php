<?php
// ========================================
// ENDPOINT DE PRUEBA PARA ADMIN
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Respuesta de prueba
$response = [
    'success' => true,
    'message' => 'API de admin funcionando correctamente',
    'data' => [
        'timestamp' => date('Y-m-d H:i:s'),
        'server' => 'EasyClase Admin API',
        'version' => '1.0.0'
    ]
];

echo json_encode($response);
?>
