<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$user = verifyToken();

sendResponse([
    'user' => [
        'id' => $user->user_id,
        'email' => $user->email,
        'role' => $user->role
    ]
]);
