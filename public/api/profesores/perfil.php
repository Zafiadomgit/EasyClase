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

// Obtener ID del profesor desde la URL
$profesorId = isset($_GET['id']) ? intval($_GET['id']) : 1;

// Simular datos del profesor
$profesores = array(
    1 => array(
        'id' => 1,
        'nombre' => 'Ana Rodríguez',
        'email' => 'ana.rodriguez@example.com',
        'telefono' => '+57 300 123 4567',
        'bio' => 'Senior Developer en Google. Especializada en React, Node.js y arquitectura de software. Más de 5 años de experiencia enseñando programación.',
        'especialidades' => array('Programación', 'React', 'Node.js', 'JavaScript', 'TypeScript'),
        'calificacionPromedio' => 5.0,
        'totalResenas' => 203,
        'totalClases' => 150,
        'estudiantesAyudados' => 89,
        'precioHora' => 45000,
        'esPremium' => true,
        'avatarUrl' => 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=AR',
        'disponibilidad' => array(
            'lunes' => array('09:00-12:00', '14:00-18:00'),
            'martes' => array('09:00-12:00', '14:00-18:00'),
            'miercoles' => array('09:00-12:00', '14:00-18:00'),
            'jueves' => array('09:00-12:00', '14:00-18:00'),
            'viernes' => array('09:00-12:00', '14:00-18:00')
        ),
        'reseñas' => array(
            array(
                'id' => 1,
                'estudiante' => 'Carlos M.',
                'calificacion' => 5,
                'comentario' => 'Excelente profesora, muy clara en sus explicaciones.',
                'fecha' => '2025-01-15'
            ),
            array(
                'id' => 2,
                'estudiante' => 'María L.',
                'calificacion' => 5,
                'comentario' => 'Me ayudó mucho con React, muy recomendada.',
                'fecha' => '2025-01-10'
            )
        )
    ),
    2 => array(
        'id' => 2,
        'nombre' => 'Roberto Silva',
        'email' => 'roberto.silva@example.com',
        'telefono' => '+57 300 987 6543',
        'bio' => 'Especialista en Excel y automatización. Más de 8 años ayudando a empresas a optimizar sus procesos.',
        'especialidades' => array('Excel', 'Macros', 'VBA', 'Power Query', 'Power BI'),
        'calificacionPromedio' => 4.8,
        'totalResenas' => 156,
        'totalClases' => 120,
        'estudiantesAyudados' => 67,
        'precioHora' => 40000,
        'esPremium' => true,
        'avatarUrl' => 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=RS',
        'disponibilidad' => array(
            'lunes' => array('08:00-12:00', '14:00-17:00'),
            'martes' => array('08:00-12:00', '14:00-17:00'),
            'miercoles' => array('08:00-12:00', '14:00-17:00'),
            'jueves' => array('08:00-12:00', '14:00-17:00'),
            'viernes' => array('08:00-12:00', '14:00-17:00')
        ),
        'reseñas' => array(
            array(
                'id' => 3,
                'estudiante' => 'Luis P.',
                'calificacion' => 5,
                'comentario' => 'Excelente profesor de Excel, muy paciente.',
                'fecha' => '2025-01-12'
            )
        )
    )
);

$profesor = isset($profesores[$profesorId]) ? $profesores[$profesorId] : $profesores[1];

$response = array(
    'success' => true,
    'message' => 'Perfil del profesor obtenido correctamente',
    'data' => array(
        'profesor' => $profesor
    )
);

echo json_encode($response);
?>
