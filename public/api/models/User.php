<?php
// ========================================
// MODELO DE USUARIO - OPERACIONES BD
// ========================================

require_once '../config/database.php';

class User {
    private $conn;
    private $table_name = "users";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Verificar credenciales de login
    public function authenticate($email, $password) {
        try {
            $query = "SELECT id, nombre, email, password, tipo_usuario, calificacion_promedio, 
                             fecha_registro, estado, telefono, direccion, bio, avatar_url
                      FROM " . $this->table_name . " 
                      WHERE email = :email AND estado = 'activo'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch();
                
                // Verificar contraseña (hash bcrypt)
                if (password_verify($password, $user['password'])) {
                    // Remover password del array antes de devolver
                    unset($user['password']);
                    return $user;
                }
            }
            
            return false;
        } catch(PDOException $e) {
            error_log("Error en autenticación: " . $e->getMessage());
            return false;
        }
    }

    // Obtener usuario por ID
    public function getById($id) {
        try {
            $query = "SELECT id, nombre, email, tipo_usuario, calificacion_promedio, 
                             fecha_registro, estado, telefono, direccion, bio, avatar_url
                      FROM " . $this->table_name . " 
                      WHERE id = :id AND estado = 'activo'";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();

            return $stmt->fetch();
        } catch(PDOException $e) {
            error_log("Error obteniendo usuario: " . $e->getMessage());
            return false;
        }
    }

    // Crear nuevo usuario
    public function create($data) {
        try {
            $query = "INSERT INTO " . $this->table_name . " 
                      (nombre, email, password, tipo_usuario, telefono, direccion, bio, fecha_registro, estado) 
                      VALUES (:nombre, :email, :password, :tipo_usuario, :telefono, :direccion, :bio, NOW(), 'activo')";
            
            $stmt = $this->conn->prepare($query);
            
            // Hash de la contraseña
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            $stmt->bindParam(":nombre", $data['nombre']);
            $stmt->bindParam(":email", $data['email']);
            $stmt->bindParam(":password", $hashed_password);
            $stmt->bindParam(":tipo_usuario", $data['tipo_usuario']);
            $stmt->bindParam(":telefono", $data['telefono']);
            $stmt->bindParam(":direccion", $data['direccion']);
            $stmt->bindParam(":bio", $data['bio']);
            
            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            
            return false;
        } catch(PDOException $e) {
            error_log("Error creando usuario: " . $e->getMessage());
            return false;
        }
    }

    // Verificar si email existe
    public function emailExists($email) {
        try {
            $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            return $stmt->rowCount() > 0;
        } catch(PDOException $e) {
            error_log("Error verificando email: " . $e->getMessage());
            return false;
        }
    }

    // Actualizar usuario
    public function update($id, $data) {
        try {
            $query = "UPDATE " . $this->table_name . " 
                      SET nombre = :nombre, telefono = :telefono, direccion = :direccion, 
                          bio = :bio, avatar_url = :avatar_url
                      WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(":nombre", $data['nombre']);
            $stmt->bindParam(":telefono", $data['telefono']);
            $stmt->bindParam(":direccion", $data['direccion']);
            $stmt->bindParam(":bio", $data['bio']);
            $stmt->bindParam(":avatar_url", $data['avatar_url']);
            $stmt->bindParam(":id", $id);
            
            return $stmt->execute();
        } catch(PDOException $e) {
            error_log("Error actualizando usuario: " . $e->getMessage());
            return false;
        }
    }
}
?>
