<?php
// ========================================
// TEST SIMPLE PARA DASHBOARD
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
    // Datos de prueba muy simples
    $response = [
        'success' => true,
        'message' => 'Dashboard funcionando',
        'data' => [
            'totalUsers' => 25,
            'totalClasses' => 12,
            'totalRevenue' => 2500.75,
            'activeProfesors' => 8,
            'activeStudents' => 17,
            'pendingPayments' => 5,
            'completedClasses' => 10,
            'cancelledClasses' => 2
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error en test-dashboard: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
