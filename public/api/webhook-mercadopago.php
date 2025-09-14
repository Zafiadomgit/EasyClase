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

// Configuración de base de datos - Dreamhost
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log('Error de conexión a la base de datos: ' . $e->getMessage());
    http_response_code(500);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del webhook
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        error_log('Webhook MercadoPago: Datos inválidos');
        http_response_code(400);
        exit();
    }
    
    $type = $data['type'] ?? '';
    $action = $data['action'] ?? '';
    $data_id = $data['data']['id'] ?? '';
    
    // Log del webhook para debugging
    error_log('Webhook MercadoPago recibido: ' . json_encode($data));
    
    if ($type === 'payment' && $action === 'payment.created') {
        // Obtener información del pago - TOKEN DE PRODUCCIÓN CORRECTO
        $access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
        $payment_url = 'https://api.mercadopago.com/v1/payments/' . $data_id;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $payment_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $access_token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $payment_response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($http_code === 200) {
            $payment_data = json_decode($payment_response, true);
            
            // Verificar que el pago fue aprobado
            if ($payment_data['status'] === 'approved') {
                // Obtener datos de la reserva desde metadata
                $metadata = $payment_data['metadata'] ?? [];
                $reserva_data = json_decode($metadata['reserva_data'] ?? '{}', true);
                
                if (!empty($reserva_data)) {
                    try {
                        // Crear la reserva en la base de datos
                        $stmt = $pdo->prepare("
                            INSERT INTO reservas_clases (clase_id, estudiante_id, fecha, hora, comentarios, estado, created_at) 
                            VALUES (?, ?, ?, ?, ?, 'confirmada', NOW())
                        ");
                        
                        $stmt->execute([
                            $reserva_data['claseId'],
                            $reserva_data['estudianteId'],
                            $reserva_data['fecha'],
                            $reserva_data['hora'],
                            $reserva_data['comentarios'] ?? ''
                        ]);
                        
                        error_log('Reserva creada exitosamente después del pago: ' . $data_id);
                        
                    } catch (PDOException $e) {
                        error_log('Error creando reserva: ' . $e->getMessage());
                    }
                }
            }
        }
    }
    
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>
