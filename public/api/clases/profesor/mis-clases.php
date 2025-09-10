<?php
// ========================================
// ENDPOINT DE CLASES DEL PROFESOR
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
    
    // Simular clases del profesor
    $clases = [
        [
            'id' => 1,
            'titulo' => 'Clase de Matemáticas Avanzadas',
            'estudiante' => [
                'id' => 1,
                'nombre' => 'Ana García',
                'email' => 'ana@ejemplo.com'
            ],
            'fecha' => '2024-09-15',
            'hora' => '14:00',
            'duracion' => 1,
            'precio' => 50000,
            'estado' => 'programada',
            'tipo' => 'individual',
            'estudiantesInscritos' => 1,
            'ingresos' => 50000,
            'horasCompletadas' => 0
        ],
        [
            'id' => 2,
            'titulo' => 'Clase de Inglés Conversacional',
            'estudiante' => [
                'id' => 2,
                'nombre' => 'Luis Martínez',
                'email' => 'luis@ejemplo.com'
            ],
            'fecha' => '2024-09-20',
            'hora' => '16:00',
            'duracion' => 1,
            'precio' => 35000,
            'estado' => 'programada',
            'tipo' => 'grupal',
            'estudiantesInscritos' => 3,
            'ingresos' => 105000,
            'horasCompletadas' => 0
        ]
    ];
    
    $response = [
        'success' => true,
        'message' => 'Clases del profesor obtenidas correctamente',
        'clases' => $clases,
        'estadisticas' => [
            'totalClases' => count($clases),
            'clasesProgramadas' => count(array_filter($clases, fn($c) => $c['estado'] === 'programada')),
            'clasesCompletadas' => count(array_filter($clases, fn($c) => $c['estado'] === 'completada')),
            'ingresosTotales' => array_sum(array_column($clases, 'ingresos')),
            'horasTotales' => array_sum(array_column($clases, 'horasCompletadas'))
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
