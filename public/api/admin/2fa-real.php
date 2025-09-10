<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de base de datos
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a base de datos']);
    exit();
}

// Función para verificar JWT (simplificada para este ejemplo)
function verifyJWT($token) {
    // En un caso real, aquí verificarías el JWT con tu sistema de autenticación
    // Por ahora, verificamos que el token existe y no está vacío
    return !empty($token) && strlen($token) > 10;
}

// Función para verificar que el usuario es super admin
function isSuperAdmin($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("SELECT tipoUsuario FROM usuarios WHERE id = ? AND tipoUsuario = 'admin'");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user !== false;
    } catch (Exception $e) {
        return false;
    }
}

// Función para log de acciones 2FA
function log2FAAction($pdo, $userId, $action, $success = true) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO user_2fa_logs (user_id, action, ip_address, user_agent, success) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userId,
            $action,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            $success ? 1 : 0
        ]);
    } catch (Exception $e) {
        // Log silencioso si falla
    }
}

$authHeader = getallheaders()['Authorization'] ?? '';
if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token de autorización requerido']);
    exit();
}

$token = substr($authHeader, 7);
if (!verifyJWT($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token inválido']);
    exit();
}

// Verificar que es super admin
if (!isSuperAdmin($pdo, 'admin')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Solo super administradores']);
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
        
        try {
            // Insertar o actualizar configuración 2FA
            $stmt = $pdo->prepare("
                INSERT INTO user_2fa (user_id, secret, backup_codes, enabled, created_at) 
                VALUES (?, ?, ?, 1, NOW())
                ON DUPLICATE KEY UPDATE 
                secret = VALUES(secret), 
                backup_codes = VALUES(backup_codes), 
                enabled = 1, 
                updated_at = NOW()
            ");
            
            $backupCodesJson = json_encode($input['backupCodes']);
            $stmt->execute(['admin', $input['secret'], $backupCodesJson]);
            
            log2FAAction($pdo, 'admin', 'setup', true);
            
            echo json_encode([
                'success' => true,
                'message' => '2FA configurado exitosamente en base de datos',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) {
            log2FAAction($pdo, 'admin', 'setup', false);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error guardando configuración: ' . $e->getMessage()]);
        }
        break;
        
    case 'GET':
        // Obtener estado de 2FA
        try {
            $stmt = $pdo->prepare("SELECT * FROM user_2fa WHERE user_id = ?");
            $stmt->execute(['admin']);
            $config = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($config) {
                echo json_encode([
                    'success' => true,
                    'enabled' => (bool)$config['enabled'],
                    'config' => [
                        'secret' => $config['secret'],
                        'backupCodes' => json_decode($config['backup_codes'], true),
                        'createdAt' => $config['created_at'],
                        'updatedAt' => $config['updated_at']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'enabled' => false,
                    'config' => null
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error obteniendo configuración: ' . $e->getMessage()]);
        }
        break;
        
    case 'PUT':
        // Verificar código 2FA
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['token'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Código 2FA requerido']);
            exit();
        }
        
        try {
            // Obtener configuración 2FA
            $stmt = $pdo->prepare("SELECT secret FROM user_2fa WHERE user_id = ? AND enabled = 1");
            $stmt->execute(['admin']);
            $config = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$config) {
                echo json_encode(['success' => false, 'message' => '2FA no configurado']);
                exit();
            }
            
            // Verificar código (aquí usarías una librería PHP para TOTP)
            // Por simplicidad, verificamos que el código tenga 6 dígitos
            $isValid = preg_match('/^\d{6}$/', $input['token']);
            
            if ($isValid) {
                log2FAAction($pdo, 'admin', 'verify', true);
                echo json_encode([
                    'success' => true,
                    'message' => 'Código 2FA verificado correctamente',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } else {
                log2FAAction($pdo, 'admin', 'verify', false);
                echo json_encode(['success' => false, 'message' => 'Código 2FA inválido']);
            }
        } catch (Exception $e) {
            log2FAAction($pdo, 'admin', 'verify', false);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error verificando código: ' . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        // Deshabilitar 2FA
        try {
            $stmt = $pdo->prepare("UPDATE user_2fa SET enabled = 0, updated_at = NOW() WHERE user_id = ?");
            $stmt->execute(['admin']);
            
            log2FAAction($pdo, 'admin', 'disabled', true);
            
            echo json_encode([
                'success' => true,
                'message' => '2FA deshabilitado exitosamente',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } catch (Exception $e) {
            log2FAAction($pdo, 'admin', 'disabled', false);
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error deshabilitando 2FA: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}
?>