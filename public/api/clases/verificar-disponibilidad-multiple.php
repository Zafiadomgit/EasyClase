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
    $horaInicio = $_GET['horaInicio'] ?? null;
    $cantidadHoras = $_GET['cantidadHoras'] ?? 1;

    if (!$profesorId || !$fecha || !$horaInicio) {
        throw new Exception('Faltan parámetros requeridos');
    }

    // Convertir hora de inicio a minutos para facilitar cálculos
    $horaInicioMinutos = convertirHoraAMinutos($horaInicio);
    $cantidadHoras = (int)$cantidadHoras;
    
    // Verificar disponibilidad para cada hora consecutiva
    $horariosDisponibles = [];
    $maxHorasDisponibles = 0;
    
    for ($i = 1; $i <= 4; $i++) {
        $horaActualMinutos = $horaInicioMinutos + (($i - 1) * 60); // Cada hora son 60 minutos
        $horaActual = convertirMinutosAHora($horaActualMinutos);
        
        // Verificar si esta hora está disponible
        $disponible = verificarHoraDisponible($profesorId, $fecha, $horaActual);
        
        if ($disponible) {
            $maxHorasDisponibles = $i;
            $horariosDisponibles[] = [
                'hora' => $horaActual,
                'disponible' => true
            ];
        } else {
            $horariosDisponibles[] = [
                'hora' => $horaActual,
                'disponible' => false
            ];
            break; // Si una hora no está disponible, no podemos continuar
        }
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'maxHorasDisponibles' => $maxHorasDisponibles,
            'horariosDisponibles' => $horariosDisponibles,
            'horaInicio' => $horaInicio,
            'cantidadHorasSolicitadas' => $cantidadHoras,
            'puedeReservar' => $cantidadHoras <= $maxHorasDisponibles
        ]
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Función para convertir hora (HH:MM) a minutos
function convertirHoraAMinutos($hora) {
    list($horas, $minutos) = explode(':', $hora);
    return (int)$horas * 60 + (int)$minutos;
}

// Función para convertir minutos a hora (HH:MM)
function convertirMinutosAHora($minutos) {
    $horas = floor($minutos / 60);
    $mins = $minutos % 60;
    return sprintf('%02d:%02d', $horas, $mins);
}

// Función para verificar si una hora específica está disponible
function verificarHoraDisponible($profesorId, $fecha, $hora) {
    // Simular verificación de disponibilidad
    // En producción, esto consultaría la base de datos real
    
    // Simular diferentes estados para testing
    $estadosSimulados = [
        'disponible' => 0.7,  // 70% de probabilidad de estar disponible
        'individual' => 0.15, // 15% de probabilidad de estar individual
        'grupal' => 0.15      // 15% de probabilidad de estar grupal
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
    
    return $estado === 'disponible';
}
?>
