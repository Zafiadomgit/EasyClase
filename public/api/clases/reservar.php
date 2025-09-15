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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar datos de reserva (no guardar aún)
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['profesorId']) && isset($input['fecha']) && isset($input['hora']) && isset($input['tipoAgenda'])) {
        // Validar que el horario esté disponible
        $profesorId = $input['profesorId'];
        $fecha = $input['fecha'];
        $hora = $input['hora'];
        $tipoAgenda = $input['tipoAgenda'];
        
        // Simular validación de disponibilidad
        $disponible = true; // En producción, consultar BD
        
        if ($disponible) {
            $response = array(
                'success' => true,
                'message' => 'Datos de reserva validados correctamente',
                'data' => array(
                    'profesorId' => $profesorId,
                    'fecha' => $fecha,
                    'hora' => $hora,
                    'tipoAgenda' => $tipoAgenda,
                    'validado' => true
                )
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'El horario seleccionado ya no está disponible'
            );
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Datos de reserva incompletos'
        );
    }
} else {
    // Obtener información de reserva
    $claseId = isset($_GET['id']) ? intval($_GET['id']) : 1;
    
    $response = array(
        'success' => true,
        'message' => 'Información de clase obtenida correctamente',
        'data' => array(
            'clase' => array(
                'id' => $claseId,
                'profesor' => array(
                    'id' => 1,
                    'nombre' => 'Ana Rodríguez',
                    'especialidades' => array('Programación', 'React', 'Node.js'),
                    'calificacionPromedio' => 5.0,
                    'totalResenas' => 203,
                    'precioHora' => 10,
                    'esPremium' => true
                ),
                'disponibilidad' => array(
                    'lunes' => array('09:00-12:00', '14:00-18:00'),
                    'martes' => array('09:00-12:00', '14:00-18:00'),
                    'miercoles' => array('09:00-12:00', '14:00-18:00'),
                    'jueves' => array('09:00-12:00', '14:00-18:00'),
                    'viernes' => array('09:00-12:00', '14:00-18:00')
                )
            )
        )
    );
}

echo json_encode($response);
?>
