<?php
// ========================================
// UTILIDADES JWT - TOKENS DE AUTENTICACIÓN
// ========================================

class JWT {
    private $secret_key = 'easyclase_secret_key_2024_super_secure';
    private $algorithm = 'HS256';
    private $expiration_time = 3600; // 1 hora

    // Generar token JWT
    public function generateToken($user_data) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => $this->algorithm
        ]);

        $payload = json_encode([
            'user_id' => $user_data['id'],
            'email' => $user_data['email'],
            'tipo_usuario' => $user_data['tipo_usuario'],
            'iat' => time(),
            'exp' => time() + $this->expiration_time
        ]);

        $base64_header = $this->base64url_encode($header);
        $base64_payload = $this->base64url_encode($payload);

        $signature = hash_hmac('sha256', 
            $base64_header . "." . $base64_payload, 
            $this->secret_key, 
            true
        );

        $base64_signature = $this->base64url_encode($signature);

        return $base64_header . "." . $base64_payload . "." . $base64_signature;
    }

    // Verificar token JWT
    public function verifyToken($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }

        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];

        // Verificar firma
        $expected_signature = hash_hmac('sha256', 
            $header . "." . $payload, 
            $this->secret_key, 
            true
        );

        if (!hash_equals($this->base64url_encode($expected_signature), $signature)) {
            return false;
        }

        // Decodificar payload
        $payload_data = json_decode($this->base64url_decode($payload), true);

        // Verificar expiración
        if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
            return false;
        }

        return $payload_data;
    }

    // Extraer token del header Authorization
    public function getTokenFromHeader() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }

    // Verificar token desde header
    public function verifyTokenFromHeader() {
        $token = $this->getTokenFromHeader();
        
        if (!$token) {
            return false;
        }
        
        return $this->verifyToken($token);
    }

    // Codificación base64url
    private function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    // Decodificación base64url
    private function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }

    // Generar refresh token
    public function generateRefreshToken($user_id) {
        $payload = json_encode([
            'user_id' => $user_id,
            'type' => 'refresh',
            'iat' => time(),
            'exp' => time() + (7 * 24 * 3600) // 7 días
        ]);

        $base64_payload = $this->base64url_encode($payload);
        $signature = hash_hmac('sha256', $base64_payload, $this->secret_key, true);
        $base64_signature = $this->base64url_encode($signature);

        return $base64_payload . "." . $base64_signature;
    }
}
?>
