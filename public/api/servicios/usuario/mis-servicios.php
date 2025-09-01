<?php
// ========================================
// ENDPOINT DE SERVICIOS DEL USUARIO
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
    
    // Simular servicios del usuario
    $servicios = [
        [
            'id' => 1,
            'titulo' => 'Clase de Matemáticas',
            'descripcion' => 'Clase de matemáticas para estudiantes de secundaria',
            'precio' => 50000,
            'categoria' => 'Matemáticas',
            'estado' => 'activo',
            'fechaCreacion' => '2024-08-31T10:00:00Z'
        ],
        [
            'id' => 2,
            'titulo' => 'Clase de Inglés',
            'descripcion' => 'Clase de inglés conversacional',
            'precio' => 60000,
            'categoria' => 'Idiomas',
            'estado' => 'activo',
            'fechaCreacion' => '2024-08-30T15:30:00Z'
        ]
    ];
    
    $response = [
        'success' => true,
        'message' => 'Servicios obtenidos correctamente',
        'data' => [
            'servicios' => $servicios,
            'total' => count($servicios)
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
