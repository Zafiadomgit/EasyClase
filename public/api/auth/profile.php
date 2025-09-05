<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = array(
    'success' => true,
    'message' => 'Perfil obtenido correctamente',
    'data' => array(
        'user' => array(
            'id' => 1,
            'nombre' => 'Usuario',
            'email' => 'usuario@test.com',
            'tipoUsuario' => 'profesor',
            'calificacionPromedio' => 0.0,
            'telefono' => '',
            'direccion' => '',
            'bio' => '',
            'avatarUrl' => ''
        )
    )
);

echo json_encode($response);
?>
