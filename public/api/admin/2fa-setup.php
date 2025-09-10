<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simular autenticación de super admin
$authHeader = getallheaders()['Authorization'] ?? '';
if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token de autorización requerido']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Configurar 2FA
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['secret']) || !isset($input['backupCodes'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos de configuración 2FA requeridos']);
            exit();
        }
        
        // Simular guardado en base de datos
        $config = [
            'userId' => 'admin',
            'secret' => $input['secret'],
            'backupCodes' => $input['backupCodes'],
            'enabled' => true,
            'createdAt' => date('Y-m-d H:i:s')
        ];
        
        // En un caso real, esto se guardaría en la base de datos
        file_put_contents('2fa_config.json', json_encode($config));
        
        echo json_encode([
            'success' => true,
            'message' => '2FA configurado exitosamente',
            'config' => $config
        ]);
        break;
        
    case 'GET':
        // Obtener estado de 2FA
        if (file_exists('2fa_config.json')) {
            $config = json_decode(file_get_contents('2fa_config.json'), true);
            echo json_encode([
                'success' => true,
                'enabled' => $config['enabled'] ?? false,
                'config' => $config
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'enabled' => false,
                'config' => null
            ]);
        }
        break;
        
    case 'DELETE':
        // Deshabilitar 2FA
        if (file_exists('2fa_config.json')) {
            unlink('2fa_config.json');
        }
        
        echo json_encode([
            'success' => true,
            'message' => '2FA deshabilitado exitosamente'
        ]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}
?>
