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
    // Si falla la conexión, usar modo mock
    $pdo = null;
}

// Obtener parámetros de búsqueda
$categoria = $_GET['categoria'] ?? '';
$busqueda = $_GET['busqueda'] ?? '';
$precioMin = $_GET['precioMin'] ?? '';
$precioMax = $_GET['precioMax'] ?? '';

if ($pdo) {
    try {
        // Construir consulta SQL
        $sql = "SELECT * FROM plantillas_clases WHERE estado = 'activa'";
        $params = [];
        
        if (!empty($categoria)) {
            $sql .= " AND categoria = ?";
            $params[] = $categoria;
        }
        
        if (!empty($busqueda)) {
            $sql .= " AND (titulo LIKE ? OR descripcion LIKE ? OR materia LIKE ?)";
            $searchTerm = "%$busqueda%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        if (!empty($precioMin)) {
            $sql .= " AND precio >= ?";
            $params[] = floatval($precioMin);
        }
        
        if (!empty($precioMax)) {
            $sql .= " AND precio <= ?";
            $params[] = floatval($precioMax);
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $clases = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Formatear las clases para el frontend
        $clasesFormateadas = array_map(function($clase) {
            return [
                'id' => $clase['id'],
                'titulo' => $clase['titulo'],
                'descripcion' => $clase['descripcion'],
                'materia' => $clase['materia'],
                'categoria' => $clase['categoria'],
                'tipo' => $clase['tipo'],
                'precio' => floatval($clase['precio']),
                'duracion' => intval($clase['duracion']),
                'maxEstudiantes' => intval($clase['max_estudiantes']),
                'modalidad' => $clase['modalidad'],
                'requisitos' => $clase['requisitos'],
                'objetivos' => $clase['objetivos'],
                'estado' => $clase['estado'],
                'profesor' => [
                    'id' => $clase['profesor_id'],
                    'nombre' => 'Profesor Demo',
                    'email' => 'profesor@easyclase.com',
                    'precioPorHora' => floatval($clase['precio']),
                    'calificacionPromedio' => 4.5
                ],
                'createdAt' => $clase['created_at'],
                'updatedAt' => $clase['updated_at']
            ];
        }, $clases);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'clases' => $clasesFormateadas,
                'pagination' => [
                    'current' => 1,
                    'pages' => 1,
                    'total' => count($clasesFormateadas)
                ]
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error consultando base de datos: ' . $e->getMessage()
        ]);
    }
} else {
    // Modo mock
    echo json_encode([
        'success' => true,
        'data' => [
            'clases' => [],
            'pagination' => [
                'current' => 1,
                'pages' => 1,
                'total' => 0
            ]
        ]
    ]);
}
?>
