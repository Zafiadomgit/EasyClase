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

// Simular verificación de premium
$response = array(
    'success' => true,
    'message' => 'Estado premium obtenido correctamente',
    'data' => array(
        'esPremium' => true,
        'fechaVencimiento' => '2025-12-31',
        'beneficios' => array(
            'prioridadEnBusqueda' => true,
            'badgePremium' => true,
            'estadisticasAvanzadas' => true,
            'soportePrioritario' => true
        )
    )
);

echo json_encode($response);
?>
