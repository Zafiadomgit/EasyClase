<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = array(
    'success' => true,
    'message' => 'Clases obtenidas correctamente',
    'data' => array(
        'clases' => array(),
        'estadisticas' => array(
            'totalClases' => 0,
            'clasesCompletadas' => 0,
            'clasesPendientes' => 0,
            'ingresosTotales' => 0
        )
    )
);

echo json_encode($response);
?>
