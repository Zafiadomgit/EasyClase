<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Obtener parámetros
    $profesorId = $_GET['profesorId'] ?? null;
    $fecha = $_GET['fecha'] ?? null;
    $hora = $_GET['hora'] ?? null;

    if (!$profesorId || !$fecha || !$hora) {
        throw new Exception('Faltan parámetros requeridos');
    }

    // Simular verificación de horario
    // En producción, esto consultaría la base de datos
    
    // Simular diferentes estados para testing
    $estadosSimulados = [
        'disponible' => 0.6,  // 60% de probabilidad de estar disponible
        'individual' => 0.2,  // 20% de probabilidad de estar individual
        'grupal' => 0.2       // 20% de probabilidad de estar grupal
    ];
    
    $random = mt_rand(1, 100);
    $acumulado = 0;
    $estado = 'disponible';
    
    foreach ($estadosSimulados as $estadoKey => $probabilidad) {
        $acumulado += $probabilidad * 100;
        if ($random <= $acumulado) {
            $estado = $estadoKey;
            break;
        }
    }
    
    $alumnosInscritos = 0;
    if ($estado === 'grupal') {
        $alumnosInscritos = mt_rand(1, 4); // 1-4 alumnos ya inscritos
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'estado' => $estado,
            'alumnosInscritos' => $alumnosInscritos,
            'profesorId' => $profesorId,
            'fecha' => $fecha,
            'hora' => $hora
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
