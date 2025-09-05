<?php
// ========================================
// CONFIGURACIÓN DE BASE DE DATOS MYSQL
// ========================================

class Database {
    private $host = 'mysql.easyclaseapp.com';
    private $db_name = 'easyclasebd_v2';
    private $username = 'zafiadombd';
    private $password = 'f9ZrKNH2bNuYT8d';
    private $port = 3306;
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                )
            );
        } catch(PDOException $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }

    public function closeConnection() {
        $this->conn = null;
    }
}
?>
