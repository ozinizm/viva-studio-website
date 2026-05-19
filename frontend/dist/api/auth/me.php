<?php
// backend/api/auth/me.php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';

handleCors();

// verifyToken will automatically validate the Bearer token and return the payload.
// If validation fails, it calls sendError() and exits with 401.
$payload = verifyToken();

sendResponse([
    'success' => true,
    'user' => [
        'id' => $payload->user_id,
        'email' => $payload->email,
        'role' => $payload->role
    ]
]);
