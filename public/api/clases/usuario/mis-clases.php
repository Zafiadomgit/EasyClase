<?php
// ========================================
// ENDPOINT DE CLASES DEL USUARIO
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

try {
    // TODO: Aquí iría la conexión a MySQL y validación real
    // Por ahora, mock de respuesta para testing
    
    // Simular clases del usuario
    $clases = [
        [
            'id' => 1,
            'titulo' => 'Clase de Matemáticas',
            'profesor' => 'Dr. García',
            'fecha' => '2024-09-15T14:00:00Z',
            'duracion' => 60,
            'precio' => 50000,
            'estado' => 'confirmada',
            'modalidad' => 'virtual'
        ],
        [
            'id' => 2,
            'titulo' => 'Clase de Inglés',
            'profesor' => 'Prof. Smith',
            'fecha' => '2024-09-20T16:00:00Z',
            'duracion' => 90,
            'precio' => 60000,
            'estado' => 'pendiente',
            'modalidad' => 'presencial'
        ]
    ];
    
    $response = [
        'success' => true,
        'message' => 'Clases obtenidas correctamente',
        'data' => [
            'clases' => $clases,
            'total' => count($clases),
            'confirmadas' => 1,
            'pendientes' => 1
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage()
    ]);
}
?>
