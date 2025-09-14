<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

if ($method === 'POST') {
    // Crear nueva reserva
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos inválidos'
        ]);
        exit();
    }
    
    $claseId = $input['claseId'] ?? null;
    $estudianteId = $input['estudianteId'] ?? null;
    $fecha = $input['fecha'] ?? null;
    $hora = $input['hora'] ?? null;
    $comentarios = $input['comentarios'] ?? '';
    
    // Validar datos requeridos
    if (!$claseId || !$estudianteId || !$fecha || !$hora) {
        echo json_encode([
            'success' => false,
            'message' => 'Faltan datos requeridos: claseId, estudianteId, fecha, hora'
        ]);
        exit();
    }
    
    // Validar que el ID de clase sea numérico
    if (!is_numeric($claseId)) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de clase inválido'
        ]);
        exit();
    }
    
    try {
        // Verificar que la clase existe y está activa
        $stmt = $pdo->prepare("SELECT * FROM plantillas_clases WHERE id = ? AND estado = 'activa'");
        $stmt->execute([$claseId]);
        $clase = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$clase) {
            echo json_encode([
                'success' => false,
                'message' => 'Clase no encontrada o no disponible'
            ]);
            exit();
        }
        
        // Crear la reserva
        $stmt = $pdo->prepare("
            INSERT INTO reservas_clases (clase_id, estudiante_id, fecha, hora, comentarios, estado, created_at) 
            VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
        ");
        
        $stmt->execute([$claseId, $estudianteId, $fecha, $hora, $comentarios]);
        $reservaId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Reserva creada exitosamente',
            'data' => [
                'reservaId' => $reservaId,
                'clase' => $clase
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error creando reserva: ' . $e->getMessage()
        ]);
    }
    
} elseif ($method === 'GET') {
    // Obtener reservas del estudiante
    $estudianteId = $_GET['estudianteId'] ?? null;
    
    if (!$estudianteId) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de estudiante requerido'
        ]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT r.*, p.titulo, p.descripcion, p.precio, p.duracion, p.modalidad
            FROM reservas_clases r
            JOIN plantillas_clases p ON r.clase_id = p.id
            WHERE r.estudiante_id = ?
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$estudianteId]);
        $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'reservas' => $reservas
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error consultando reservas: ' . $e->getMessage()
        ]);
    }
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
