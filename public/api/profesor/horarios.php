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

// Simular almacenamiento en archivo JSON (en producción usarías base de datos)
$archivoHorarios = 'horarios_profesor.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener horarios
    if (file_exists($archivoHorarios)) {
        $horarios = json_decode(file_get_contents($archivoHorarios), true);
    } else {
        $horarios = [];
    }
    
    $response = array(
        'success' => true,
        'message' => 'Horarios obtenidos correctamente',
        'data' => array(
            'horarios' => $horarios
        )
    );
    
    echo json_encode($response);
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Guardar horarios
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['horarios']) && is_array($input['horarios'])) {
        $horarios = $input['horarios'];
        
        // Guardar en archivo
        if (file_put_contents($archivoHorarios, json_encode($horarios))) {
            $response = array(
                'success' => true,
                'message' => 'Horarios guardados correctamente',
                'data' => array(
                    'horarios' => $horarios
                )
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error al guardar los horarios'
            );
        }
    } else {
        $response = array(
            'success' => false,
            'message' => 'Datos de horarios inválidos'
        );
    }
    
    echo json_encode($response);
    
} else {
    $response = array(
        'success' => false,
        'message' => 'Método no permitido'
    );
    
    echo json_encode($response);
}
?>
