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

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit();
}

require_once '../config/database.php';

try {
    // Verificar autenticación
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Token de acceso requerido'
        ]);
        exit();
    }
    
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Datos JSON inválidos'
        ]);
        exit();
    }
    
    // Validar campos requeridos
    $requiredFields = ['titulo', 'descripcion', 'categoria', 'precio'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "El campo '$field' es requerido"
            ]);
            exit();
        }
    }
    
    // Conectar a la base de datos usando la clase Database
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        throw new Exception('No se pudo conectar a la base de datos');
    }
    
    // Preparar datos para inserción
    $servicioData = [
        'titulo' => $input['titulo'],
        'descripcion' => $input['descripcion'],
        'categoria' => $input['categoria'],
        'subcategoria' => $input['subcategoria'] ?? null,
        'precio' => floatval($input['precio']),
        'tiempoPrevisto_valor' => $input['tiempoPrevisto']['valor'] ?? null,
        'tiempoPrevisto_unidad' => $input['tiempoPrevisto']['unidad'] ?? 'horas',
        'modalidad' => $input['modalidad'] ?? 'virtual',
        'proveedor' => 1, // Por ahora usar ID fijo, debería venir del token JWT
        'requisitos' => json_encode($input['requisitos'] ?? []),
        'entregables' => json_encode($input['entregables'] ?? []),
        'tecnologias' => json_encode($input['tecnologias'] ?? []),
        'nivelCliente' => $input['nivelCliente'] ?? 'intermedio',
        'revisionesIncluidas' => $input['revisionesIncluidas'] ?? 2,
        'premium' => $input['premium'] ?? false,
        'etiquetas' => json_encode($input['etiquetas'] ?? []),
        'faq' => json_encode($input['faq'] ?? []),
        'fechaLimite' => $input['fechaLimite'] ?? null,
        'estado' => 'activo'
    ];
    
    // Insertar servicio
    $sql = "INSERT INTO servicios (
        titulo, descripcion, categoria, subcategoria, precio,
        tiempoPrevisto_valor, tiempoPrevisto_unidad, modalidad, proveedor,
        requisitos, entregables, tecnologias, nivelCliente,
        revisionesIncluidas, premium, etiquetas, faq, fechaLimite,
        estado
    ) VALUES (
        :titulo, :descripcion, :categoria, :subcategoria, :precio,
        :tiempoPrevisto_valor, :tiempoPrevisto_unidad, :modalidad, :proveedor,
        :requisitos, :entregables, :tecnologias, :nivelCliente,
        :revisionesIncluidas, :premium, :etiquetas, :faq, :fechaLimite,
        :estado
    )";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute($servicioData);
    
    if ($result) {
        $servicioId = $pdo->lastInsertId();
        
        // Obtener el servicio creado
        $stmt = $pdo->prepare("SELECT * FROM servicios WHERE id = ?");
        $stmt->execute([$servicioId]);
        $servicio = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Servicio creado exitosamente',
            'data' => $servicio
        ]);
    } else {
        throw new Exception('Error al insertar el servicio');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
