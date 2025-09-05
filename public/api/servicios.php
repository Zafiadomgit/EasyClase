<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Respuesta temporal para que la página de servicios funcione
$response = [
    'success' => true,
    'message' => 'Servicios obtenidos correctamente',
    'data' => [
        'servicios' => [
            [
                'id' => 1,
                'titulo' => 'Desarrollo Web con React',
                'descripcion' => 'Aprende a crear aplicaciones web modernas con React',
                'precio' => 50000,
                'categoria' => 'Programación',
                'modalidad' => 'Online',
                'profesor' => 'Carlos Mendoza',
                'calificacion' => 4.8,
                'totalVentas' => 15
            ],
            [
                'id' => 2,
                'titulo' => 'Excel Avanzado',
                'descripcion' => 'Domina Excel con fórmulas, macros y análisis de datos',
                'precio' => 30000,
                'categoria' => 'Ofimática',
                'modalidad' => 'Online',
                'profesor' => 'María García',
                'calificacion' => 4.9,
                'totalVentas' => 23
            ],
            [
                'id' => 3,
                'titulo' => 'Inglés Conversacional',
                'descripcion' => 'Mejora tu inglés hablado con conversaciones prácticas',
                'precio' => 40000,
                'categoria' => 'Idiomas',
                'modalidad' => 'Online',
                'profesor' => 'Ana Rodríguez',
                'calificacion' => 4.7,
                'totalVentas' => 18
            ]
        ],
        'categorias' => [
            'Programación',
            'Ofimática',
            'Idiomas',
            'Diseño',
            'Marketing',
            'Negocios'
        ]
    ]
];

echo json_encode($response);
?>
