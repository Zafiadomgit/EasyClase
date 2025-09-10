<?php
// ========================================
// API SIMPLIFICADA PARA DASHBOARD
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
    // Datos simulados para el dashboard
    $response = [
        'success' => true,
        'data' => [
            'totalUsers' => 15,
            'totalClasses' => 8,
            'totalRevenue' => 1250.50,
            'activeProfesors' => 5,
            'activeStudents' => 10,
            'pendingPayments' => 3,
            'completedClasses' => 6,
            'cancelledClasses' => 2
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Error en dashboard-simple: " . $e->getMessage());
    
    // Datos por defecto en caso de error
    $response = [
        'success' => true,
        'data' => [
            'totalUsers' => 0,
            'totalClasses' => 0,
            'totalRevenue' => 0,
            'activeProfesors' => 0,
            'activeStudents' => 0,
            'pendingPayments' => 0,
            'completedClasses' => 0,
            'cancelledClasses' => 0
        ]
    ];
    
    echo json_encode($response);
}
?>
