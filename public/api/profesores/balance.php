<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = array(
    'success' => true,
    'message' => 'Balance obtenido correctamente',
    'data' => array(
        'balanceDisponible' => 0,
        'balancePendiente' => 0,
        'totalGanado' => 0
    )
);

echo json_encode($response);
?>
