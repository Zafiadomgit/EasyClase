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

// Respuesta temporal para que el Dashboard funcione
$response = [
    'success' => true,
    'message' => 'Balance obtenido correctamente',
    'data' => [
        'balanceDisponible' => 0
    ]
];

echo json_encode($response);
?>
