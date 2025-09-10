<?php
// ========================================
// API SIMPLIFICADA PARA GESTIÓN DE USUARIOS
// ========================================

// Headers de seguridad
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simular base de datos en memoria
$users = [
    [
        'id' => 1,
        'nombre' => 'Super Admin',
        'email' => 'admin@easyclase.com',
        'telefono' => '1234567890',
        'tipo_usuario' => 'admin',
        'estado' => 'activo',
        'fecha_registro' => '2024-01-01 00:00:00'
    ],
    [
        'id' => 2,
        'nombre' => 'Profesor Test',
        'email' => 'profesor@test.com',
        'telefono' => '0987654321',
        'tipo_usuario' => 'profesor',
        'estado' => 'activo',
        'fecha_registro' => '2024-01-15 10:30:00'
    ],
    [
        'id' => 3,
        'nombre' => 'Estudiante Test',
        'email' => 'estudiante@test.com',
        'telefono' => '5555555555',
        'tipo_usuario' => 'estudiante',
        'estado' => 'activo',
        'fecha_registro' => '2024-01-20 14:45:00'
    ]
];

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Obtener todos los usuarios
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
            break;
            
        case 'POST':
            // Crear nuevo usuario
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['nombre']) || !isset($input['email'])) {
                throw new Exception('Datos incompletos');
            }
            
            $newUser = [
                'id' => count($users) + 1,
                'nombre' => $input['nombre'],
                'email' => $input['email'],
                'telefono' => $input['telefono'] ?? '',
                'tipo_usuario' => $input['tipo_usuario'] ?? 'estudiante',
                'estado' => 'activo',
                'fecha_registro' => date('Y-m-d H:i:s')
            ];
            
            $users[] = $newUser;
            
            echo json_encode([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $newUser
            ]);
            break;
            
        case 'PUT':
            // Actualizar usuario
            $input = json_decode(file_get_contents('php://input'), true);
            $userId = $input['id'] ?? null;
            
            if (!$userId) {
                throw new Exception('ID de usuario requerido');
            }
            
            $userIndex = array_search($userId, array_column($users, 'id'));
            
            if ($userIndex === false) {
                throw new Exception('Usuario no encontrado');
            }
            
            // Actualizar datos
            $users[$userIndex]['nombre'] = $input['nombre'] ?? $users[$userIndex]['nombre'];
            $users[$userIndex]['email'] = $input['email'] ?? $users[$userIndex]['email'];
            $users[$userIndex]['telefono'] = $input['telefono'] ?? $users[$userIndex]['telefono'];
            $users[$userIndex]['tipo_usuario'] = $input['tipo_usuario'] ?? $users[$userIndex]['tipo_usuario'];
            $users[$userIndex]['estado'] = $input['estado'] ?? $users[$userIndex]['estado'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $users[$userIndex]
            ]);
            break;
            
        case 'DELETE':
            // Eliminar usuario
            $input = json_decode(file_get_contents('php://input'), true);
            $userId = $input['id'] ?? null;
            
            if (!$userId) {
                throw new Exception('ID de usuario requerido');
            }
            
            $userIndex = array_search($userId, array_column($users, 'id'));
            
            if ($userIndex === false) {
                throw new Exception('Usuario no encontrado');
            }
            
            // No permitir eliminar al admin
            if ($users[$userIndex]['email'] === 'admin@easyclase.com') {
                throw new Exception('No se puede eliminar al super admin');
            }
            
            unset($users[$userIndex]);
            $users = array_values($users); // Reindexar array
            
            echo json_encode([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente'
            ]);
            break;
            
        default:
            throw new Exception('Método no permitido');
    }
    
} catch (Exception $e) {
    error_log("Error en users-simple: " . $e->getMessage());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
