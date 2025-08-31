<?php
// ========================================
// HEADERS DE SEGURIDAD A+ PARA DREAMHOST
// Este archivo genera headers HTTP que securityheaders.com puede leer
// ========================================

// Strict-Transport-Security (HSTS)
header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');

// Content-Security-Policy (CSP) A+
$csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://easy-clase-jresq2a1d-davidpieters12-gmailcoms-projects.vercel.app https://easyclaseapp.com wss://easyclaseapp.com",
    "frame-src 'self' https://www.google.com https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
];
header('Content-Security-Policy: ' . implode('; ', $csp));

// X-Frame-Options: DENY (previene clickjacking)
header('X-Frame-Options: DENY');

// X-Content-Type-Options: nosniff (previene MIME type sniffing)
header('X-Content-Type-Options: nosniff');

// Referrer-Policy: strict-origin-when-cross-origin
header('Referrer-Policy: strict-origin-when-cross-origin');

// Permissions-Policy: Restringe permisos sensibles
header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()');

// X-XSS-Protection: 1; mode=block (protección XSS)
header('X-XSS-Protection: 1; mode=block');

// Cache-Control: no-store (previene cache de datos sensibles)
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Pragma: no-cache (compatibilidad con HTTP/1.0)
header('Pragma: no-cache');

// Expires: 0 (expiración inmediata)
header('Expires: 0');

// Content-Type: application/json
header('Content-Type: application/json; charset=utf-8');

// Respuesta JSON
echo json_encode([
    'status' => 'success',
    'message' => 'Headers de seguridad A+ aplicados correctamente',
    'timestamp' => date('c'),
    'headers_applied' => [
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'X-XSS-Protection',
        'Cache-Control'
    ]
]);
?>
