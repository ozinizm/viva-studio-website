<?php
// backend/api/shared/auth.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/response.php';

function base64UrlEncode($text) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
}

function generateToken($userId, $email, $role) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'exp' => time() + (86400 * 30) // 30 days
    ]);

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, defined('JWT_SECRET') ? JWT_SECRET : 'fallback_secret', true);
    $base64UrlSignature = base64UrlEncode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyToken() {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        sendError('Unauthorized - No token provided', 401);
    }

    $token = $matches[1];
    $tokenParts = explode('.', $token);
    
    if (count($tokenParts) != 3) {
        sendError('Unauthorized - Invalid token format', 401);
    }

    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
    $signatureProvided = $tokenParts[2];

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, defined('JWT_SECRET') ? JWT_SECRET : 'fallback_secret', true);
    $base64UrlSignature = base64UrlEncode($signature);

    if ($base64UrlSignature !== $signatureProvided) {
        sendError('Unauthorized - Invalid token signature', 401);
    }

    $payloadObj = json_decode($payload);
    if ($payloadObj->exp < time()) {
        sendError('Unauthorized - Token expired', 401);
    }

    return $payloadObj;
}
