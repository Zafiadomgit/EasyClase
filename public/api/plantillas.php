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
    // Si falla la conexión, usar modo mock
    $pdo = null;
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Verificar si se está pidiendo servicios
$isServicios = isset($_GET['tipo']) && $_GET['tipo'] === 'servicios';

// Debug temporal
error_log("DEBUG: tipo=" . ($_GET['tipo'] ?? 'no definido'));
error_log("DEBUG: isServicios=" . ($isServicios ? 'true' : 'false'));

// Determinar la acción basada en el método
if ($method === 'POST') {
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
    
    // Validaciones básicas para servicios
    if ($isServicios) {
        // Para servicios, solo validar campos esenciales
        if (empty($input['titulo']) || empty($input['descripcion']) || empty($input['categoria'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Faltan campos obligatorios: título, descripción y categoría son requeridos'
            ]);
            exit();
        }
    } else {
        // Para plantillas de clases, validar todos los campos
        if (empty($input['titulo']) || empty($input['descripcion']) || empty($input['materia']) || empty($input['categoria'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Faltan campos obligatorios'
            ]);
            exit();
        }
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
            if ($isServicios) {
                // Crear servicio en la tabla servicios
                $stmt = $pdo->prepare("
                    INSERT INTO servicios 
                    (titulo, descripcion, categoria, precio, tiempoPrevisto_valor, tiempoPrevisto_unidad, modalidad, proveedor, requisitos, objetivos, estado, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                ");
                
                $stmt->execute([
                    $input['titulo'],
                    $input['descripcion'],
                    $input['categoria'],
                    floatval($input['precio']),
                    intval($input['tiempoPrevisto']['valor'] ?? 1),
                    $input['tiempoPrevisto']['unidad'] ?? 'horas',
                    $input['modalidad'] ?? 'virtual',
                    1, // ID del proveedor (en producción deberías obtenerlo del token)
                    $input['requisitos'] ?? '',
                    $input['objetivos'] ?? '',
                    'activo'
                ]);
                
                $servicioId = $pdo->lastInsertId();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Servicio creado exitosamente',
                    'data' => [
                        'id' => $servicioId,
                        'titulo' => $input['titulo'],
                        'descripcion' => $input['descripcion'],
                        'categoria' => $input['categoria'],
                        'precio' => floatval($input['precio']),
                        'tiempoPrevisto' => [
                            'valor' => intval($input['tiempoPrevisto']['valor'] ?? 1),
                            'unidad' => $input['tiempoPrevisto']['unidad'] ?? 'horas'
                        ],
                        'modalidad' => $input['modalidad'] ?? 'virtual',
                        'requisitos' => $input['requisitos'] ?? '',
                        'objetivos' => $input['objetivos'] ?? '',
                        'estado' => 'activo',
                        'proveedor' => 1,
                        'createdAt' => date('c'),
                        'updatedAt' => date('c')
                    ]
                ]);
            } else {
                // Crear plantilla de clase
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
            }
            
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
    
} elseif ($method === 'GET') {
    // Obtener plantillas o servicios
    if ($pdo) {
        try {
            if ($isServicios) {
                error_log("DEBUG: Entrando en la lógica de servicios");
                // Verificar si la tabla servicios existe
                $stmt = $pdo->prepare("SHOW TABLES LIKE 'servicios'");
                $stmt->execute();
                $tableExists = $stmt->fetch();

                if (!$tableExists) {
                    // Crear la tabla servicios si no existe
                    $createTableSQL = "
                    CREATE TABLE IF NOT EXISTS `servicios` (
                      `id` int(11) NOT NULL AUTO_INCREMENT,
                      `titulo` varchar(255) NOT NULL,
                      `descripcion` text NOT NULL,
                      `categoria` varchar(100) NOT NULL,
                      `subcategoria` varchar(100) DEFAULT NULL,
                      `precio` decimal(10,2) NOT NULL,
                      `tiempoPrevisto_valor` int(11) DEFAULT NULL,
                      `tiempoPrevisto_unidad` enum('horas','días','semanas','meses') DEFAULT 'horas',
                      `modalidad` enum('virtual','presencial','mixta') DEFAULT 'virtual',
                      `proveedor` int(11) NOT NULL,
                      `requisitos` text DEFAULT NULL,
                      `entregables` text DEFAULT NULL,
                      `tecnologias` text DEFAULT NULL,
                      `nivelCliente` enum('principiante','intermedio','avanzado') DEFAULT 'intermedio',
                      `revisionesIncluidas` int(11) DEFAULT 2,
                      `premium` tinyint(1) DEFAULT 0,
                      `etiquetas` text DEFAULT NULL,
                      `faq` text DEFAULT NULL,
                      `fechaLimite` datetime DEFAULT NULL,
                      `estado` enum('activo','inactivo','pendiente','rechazado') DEFAULT 'activo',
                      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      PRIMARY KEY (`id`),
                      KEY `idx_proveedor` (`proveedor`),
                      KEY `idx_categoria` (`categoria`),
                      KEY `idx_estado` (`estado`),
                      KEY `idx_precio` (`precio`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    ";
                    
                    $pdo->exec($createTableSQL);
                    
                    // Insertar algunos servicios de prueba
                    $insertServicesSQL = "
                    INSERT IGNORE INTO `servicios` (
                      `titulo`, `descripcion`, `categoria`, `precio`, `proveedor`, `estado`
                    ) VALUES 
                    (
                      'Desarrollo Web con React',
                      'Aprende a crear aplicaciones web modernas con React, incluyendo hooks, context y routing.',
                      'Desarrollo Web',
                      50000.00,
                      1,
                      'activo'
                    ),
                    (
                      'Excel Avanzado',
                      'Domina Excel con fórmulas complejas, macros y análisis de datos avanzado.',
                      'Ofimática',
                      30000.00,
                      1,
                      'activo'
                    ),
                    (
                      'Diseño Gráfico con Photoshop',
                      'Curso completo de diseño gráfico usando Adobe Photoshop desde cero.',
                      'Diseño Gráfico',
                      40000.00,
                      1,
                      'activo'
                    ),
                    (
                      'Tesis Universitaria',
                      'Ayuda profesional para la redacción y estructuración de tu tesis universitaria.',
                      'Tesis y Trabajos Académicos',
                      800000.00,
                      1,
                      'activo'
                    ),
                    (
                      'Marketing Digital',
                      'Estrategia completa de marketing digital para tu negocio o proyecto.',
                      'Marketing Digital',
                      600000.00,
                      1,
                      'activo'
                    );
                    ";
                    
                    $pdo->exec($insertServicesSQL);
                }
                
                // Obtener todos los servicios activos
                $stmt = $pdo->prepare("
                    SELECT s.*, u.nombre as proveedor_nombre, u.email as proveedor_email
                    FROM servicios s 
                    LEFT JOIN users u ON s.proveedor = u.id 
                    WHERE s.estado = 'activo'
                    ORDER BY s.created_at DESC
                ");
                $stmt->execute();
                $servicios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Obtener categorías únicas
                $stmt = $pdo->prepare("SELECT DISTINCT categoria FROM servicios WHERE estado = 'activo' ORDER BY categoria");
                $stmt->execute();
                $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                // Formatear respuesta para servicios
                $response = [
                    'success' => true,
                    'message' => 'Servicios obtenidos correctamente',
                    'data' => [
                        'servicios' => $servicios,
                        'categorias' => $categorias
                    ]
                ];
                
                echo json_encode($response);
                exit;
            } else {
                // Obtener todas las plantillas activas
                $stmt = $pdo->prepare("SELECT * FROM plantillas_clases WHERE estado = 'activa' ORDER BY created_at DESC");
                $stmt->execute();
                $plantillas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            // Formatear las plantillas para el frontend
            $plantillasFormateadas = array_map(function($plantilla) {
                return [
                    'id' => $plantilla['id'],
                    'titulo' => $plantilla['titulo'],
                    'descripcion' => $plantilla['descripcion'],
                    'materia' => $plantilla['materia'],
                    'categoria' => $plantilla['categoria'],
                    'tipo' => $plantilla['tipo'],
                    'precio' => floatval($plantilla['precio']),
                    'duracion' => intval($plantilla['duracion']),
                    'max_estudiantes' => intval($plantilla['max_estudiantes']),
                    'modalidad' => $plantilla['modalidad'],
                    'requisitos' => $plantilla['requisitos'],
                    'objetivos' => $plantilla['objetivos'],
                    'estado' => $plantilla['estado'],
                    'profesor_id' => $plantilla['profesor_id'],
                    'created_at' => $plantilla['created_at'],
                    'updated_at' => $plantilla['updated_at']
                ];
            }, $plantillas);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'plantillas' => $plantillasFormateadas
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
    
} elseif ($method === 'DELETE') {
    // Eliminar plantilla
    $path = $_SERVER['REQUEST_URI'];
    $pathParts = explode('/', trim($path, '/'));
    $id = end($pathParts);
    
    // Limpiar el ID de posibles parámetros
    $id = explode('?', $id)[0];
    
    // Validar que el ID sea numérico
    if (!is_numeric($id)) {
        echo json_encode([
            'success' => false,
            'message' => 'ID de clase inválido: ' . $id
        ]);
        exit();
    }
    
    if ($pdo) {
        try {
            // Primero verificar que la clase existe
            $stmt = $pdo->prepare("SELECT id FROM plantillas_clases WHERE id = ?");
            $stmt->execute([$id]);
            $clase = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$clase) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Clase no encontrada'
                ]);
                exit();
            }
            
            // Eliminar la clase (DELETE real, no UPDATE)
            $stmt = $pdo->prepare("DELETE FROM plantillas_clases WHERE id = ?");
            $stmt->execute([$id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Clase eliminada exitosamente'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'No se pudo eliminar la clase'
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
        'message' => 'Método no permitido'
    ]);
}
?>
