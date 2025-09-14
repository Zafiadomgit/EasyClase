<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Archivo de prueba para verificar tokens
$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';

echo json_encode([
    'success' => true,
    'message' => 'Archivo de prueba funcionando',
    'timestamp' => date('Y-m-d H:i:s'),
    'token_type' => $access_token ? 'PRODUCCIÓN' : 'NO_CONFIGURADO',
    'token_preview' => substr($access_token, 0, 20) . '...',
    'server_info' => [
        'php_version' => phpversion(),
        'server_time' => date('Y-m-d H:i:s'),
        'file_updated' => '2025-01-14 17:45:00'
    ]
]);
?>
