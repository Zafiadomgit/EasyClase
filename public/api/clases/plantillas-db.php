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

// O usar variables de entorno si están disponibles
$host = $_ENV['DB_HOST'] ?? $host;
$dbname = $_ENV['DB_NAME'] ?? $dbname;
$username = $_ENV['DB_USER'] ?? $username;
$password = $_ENV['DB_PASS'] ?? $password;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si falla la conexión, usar modo mock
    $pdo = null;
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$pathParts = explode('/', trim($path, '/'));

// Determinar la acción basada en el método y la ruta
if ($method === 'POST' && end($pathParts) === 'plantillas') {
    // Crear nueva plantilla
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Datos JSON inválidos'
        ]);
        exit();
    }
    
    // Validaciones básicas
    if (empty($input['titulo']) || empty($input['descripcion']) || empty($input['materia']) || empty($input['categoria'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Faltan campos obligatorios'
        ]);
        exit();
    }
    
    if (empty($input['precio']) || $input['precio'] < 10) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El precio debe ser mínimo $10 COP'
        ]);
        exit();
    }
    
    if ($pdo) {
        // Guardar en base de datos
        try {
            $stmt = $pdo->prepare("
                INSERT INTO plantillas_clases 
                (titulo, descripcion, materia, categoria, tipo, precio, duracion, max_estudiantes, modalidad, requisitos, objetivos, estado, profesor_id, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            
            $stmt->execute([
                $input['titulo'],
                $input['descripcion'],
                $input['materia'],
                $input['categoria'],
                $input['tipo'] ?? 'individual',
                floatval($input['precio']),
                intval($input['duracion'] ?? 1),
                $input['tipo'] === 'grupal' ? intval($input['maxEstudiantes'] ?? 1) : 1,
                'online',
                $input['requisitos'] ?? '',
                $input['objetivos'] ?? '',
                'activa',
                1 // ID del profesor (en producción deberías obtenerlo del token)
            ]);
            
            $plantillaId = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Clase creada exitosamente',
                'data' => [
                    'id' => $plantillaId,
                    'titulo' => $input['titulo'],
                    'descripcion' => $input['descripcion'],
                    'materia' => $input['materia'],
                    'categoria' => $input['categoria'],
                    'tipo' => $input['tipo'] ?? 'individual',
                    'precio' => floatval($input['precio']),
                    'duracion' => intval($input['duracion'] ?? 1),
                    'maxEstudiantes' => $input['tipo'] === 'grupal' ? intval($input['maxEstudiantes'] ?? 1) : 1,
                    'modalidad' => 'online',
                    'requisitos' => $input['requisitos'] ?? '',
                    'objetivos' => $input['objetivos'] ?? '',
                    'estado' => 'activa',
                    'profesor' => 1,
                    'createdAt' => date('c'),
                    'updatedAt' => date('c')
                ]
            ]);
            
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error guardando en base de datos: ' . $e->getMessage()
            ]);
        }
    } else {
        // Modo mock si no hay base de datos
        $plantilla = [
            'id' => time(),
            'titulo' => $input['titulo'],
            'descripcion' => $input['descripcion'],
            'materia' => $input['materia'],
            'categoria' => $input['categoria'],
            'tipo' => $input['tipo'] ?? 'individual',
            'precio' => floatval($input['precio']),
            'duracion' => intval($input['duracion'] ?? 1),
            'maxEstudiantes' => $input['tipo'] === 'grupal' ? intval($input['maxEstudiantes'] ?? 1) : 1,
            'modalidad' => 'online',
            'requisitos' => $input['requisitos'] ?? '',
            'objetivos' => $input['objetivos'] ?? '',
            'estado' => 'activa',
            'profesor' => 1,
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        echo json_encode([
            'success' => true,
            'message' => 'Clase creada exitosamente (modo mock)',
            'data' => $plantilla
        ]);
    }
    
} elseif ($method === 'GET' && in_array('plantillas', $pathParts)) {
    // Obtener plantillas
    if (in_array('mis-plantillas', $pathParts)) {
        // Mis plantillas del profesor
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM plantillas_clases WHERE profesor_id = ? AND estado = 'activa' ORDER BY created_at DESC");
                $stmt->execute([1]); // ID del profesor
                $plantillas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'plantillas' => $plantillas
                    ]
                ]);
            } catch (PDOException $e) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Error consultando base de datos: ' . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                'success' => true,
                'data' => [
                    'plantillas' => []
                ]
            ]);
        }
    } else {
        // Todas las plantillas
        echo json_encode([
            'success' => true,
            'data' => [
                'plantillas' => [],
                'pagination' => [
                    'current' => 1,
                    'pages' => 1,
                    'total' => 0
                ]
            ]
        ]);
    }
    
} elseif ($method === 'DELETE' && in_array('plantillas', $pathParts)) {
    // Eliminar plantilla
    $id = end($pathParts);
    
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("UPDATE plantillas_clases SET estado = 'inactiva' WHERE id = ? AND profesor_id = ?");
            $stmt->execute([$id, 1]); // ID del profesor
            
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Clase eliminada exitosamente'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Clase no encontrada o no tienes permisos'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error eliminando clase: ' . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Clase eliminada exitosamente (modo mock)'
        ]);
    }
    
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Ruta no encontrada'
    ]);
}
?>
