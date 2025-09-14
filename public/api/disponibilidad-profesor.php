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

// Configuración de base de datos - Dreamhost
$host = 'mysql.easyclaseapp.com';
$dbname = 'easyclasebd_v2';
$username = 'zafiadombd';
$password = 'f9ZrKNH2bNuYT8d';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Obtener disponibilidad del profesor
    $profesorId = $_GET['profesorId'] ?? 1;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM disponibilidad_profesores WHERE profesor_id = ?");
        $stmt->execute([$profesorId]);
        $disponibilidad = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($disponibilidad) {
            // Decodificar el JSON de horarios
            $horarios = json_decode($disponibilidad['horarios'], true);
            $disponibilidad['horarios'] = $horarios;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $disponibilidad
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error consultando disponibilidad: ' . $e->getMessage()
        ]);
    }
    
} elseif ($method === 'POST') {
    // Crear o actualizar disponibilidad
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos inválidos'
        ]);
        exit();
    }
    
    $profesorId = $input['profesorId'] ?? 1;
    $horarios = $input['horarios'] ?? [];
    
    try {
        // Verificar si ya existe
        $stmt = $pdo->prepare("SELECT id FROM disponibilidad_profesores WHERE profesor_id = ?");
        $stmt->execute([$profesorId]);
        $existe = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existe) {
            // Actualizar
            $stmt = $pdo->prepare("UPDATE disponibilidad_profesores SET horarios = ?, updated_at = NOW() WHERE profesor_id = ?");
            $stmt->execute([json_encode($horarios), $profesorId]);
        } else {
            // Crear
            $stmt = $pdo->prepare("INSERT INTO disponibilidad_profesores (profesor_id, horarios, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
            $stmt->execute([$profesorId, json_encode($horarios)]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Disponibilidad guardada exitosamente'
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error guardando disponibilidad: ' . $e->getMessage()
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
