<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de MercadoPago - TOKEN DE PRODUCCIÓN CORRECTO
$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681'; // Token de producción
$url = 'https://api.mercadopago.com/checkout/preferences';

// Usar MercadoPago real
$use_mock = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos inválidos'
        ]);
        exit();
    }
    
    $titulo = $input['titulo'] ?? 'Reserva de Clase';
    $precio = floatval($input['precio'] ?? 0);
    $descripcion = $input['descripcion'] ?? 'Reserva de clase';
    $reservaData = $input['reservaData'] ?? [];
    
    // Crear preferencia de MercadoPago
    $preference = [
        'items' => [
            [
                'title' => $titulo,
                'quantity' => 1,
                'unit_price' => $precio,
                'currency_id' => 'COP'
            ]
        ],
        'back_urls' => [
            'success' => 'https://easyclaseapp.com/pago-exitoso',
            'failure' => 'https://easyclaseapp.com/pago-fallido',
            'pending' => 'https://easyclaseapp.com/pago-pendiente'
        ],
        'auto_return' => 'approved',
        'external_reference' => 'reserva_' . time(),
        'notification_url' => 'https://easyclaseapp.com/api/webhook-mercadopago.php',
        'metadata' => [
            'reserva_data' => json_encode($reservaData)
        ],
        'payment_methods' => [
            'excluded_payment_methods' => [],
            'excluded_payment_types' => [],
            'installments' => 1
        ]
    ];
    
    if ($use_mock) {
        // Modo mock para testing
        echo json_encode([
            'success' => true,
            'init_point' => 'https://easyclaseapp.com/pago-exitoso?mock=true',
            'preference_id' => 'mock_' . time()
        ]);
    } else {
        // Enviar a MercadoPago real
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preference));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $access_token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);
        
        if ($curl_error) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de conexión: ' . $curl_error
            ]);
        } elseif ($http_code === 201) {
            $data = json_decode($response, true);
            if (isset($data['init_point'])) {
                echo json_encode([
                    'success' => true,
                    'init_point' => $data['init_point'],
                    'preference_id' => $data['id']
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Respuesta inválida de MercadoPago: ' . $response
                ]);
            }
        } else {
            $error_data = json_decode($response, true);
            $error_message = isset($error_data['message']) ? $error_data['message'] : $response;
            echo json_encode([
                'success' => false,
                'message' => 'Error MercadoPago (' . $http_code . '): ' . $error_message
            ]);
        }
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
