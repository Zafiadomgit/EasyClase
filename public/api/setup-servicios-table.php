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

require_once 'config/database.php';

try {
    // Conectar a la base de datos usando la clase Database
    $database = new Database();
    $pdo = $database->getConnection();
    
    if (!$pdo) {
        throw new Exception('No se pudo conectar a la base de datos');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Conectado a la base de datos correctamente'
    ]);
    
    // SQL para crear la tabla servicios
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
      KEY `idx_precio` (`precio`),
      CONSTRAINT `fk_servicios_proveedor` FOREIGN KEY (`proveedor`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    // Ejecutar la creación de la tabla
    $pdo->exec($createTableSQL);
    
    // Insertar servicios de prueba si la tabla está vacía
    $countSQL = "SELECT COUNT(*) FROM servicios";
    $count = $pdo->query($countSQL)->fetchColumn();
    
    if ($count == 0) {
        $insertSQL = "
        INSERT INTO `servicios` (
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
        )
        ";
        
        $pdo->exec($insertSQL);
        
        echo json_encode([
            'success' => true,
            'message' => 'Tabla servicios creada e inicializada con datos de prueba',
            'servicios_insertados' => 3
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Tabla servicios ya existe y tiene datos',
            'servicios_existentes' => $count
        ]);
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
