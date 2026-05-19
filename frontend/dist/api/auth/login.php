<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';

handleCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->email) || !isset($data->password)) {
    sendError('Email and password required', 400);
}

$db = Database::getInstance();
$stmt = $db->prepare("SELECT id, email, password_hash, full_name, role FROM admin_users WHERE email = ? AND is_active = 1");
$stmt->execute([$data->email]);
$user = $stmt->fetch();

if ($user && password_verify($data->password, $user['password_hash'])) {
    // Update last login
    $updateStmt = $db->prepare("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?");
    $updateStmt->execute([$user['id']]);

    $token = generateToken($user['id'], $user['email'], $user['role']);
    
    sendResponse([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['full_name'],
            'role' => $user['role']
        ]
    ]);
} else {
    sendError('Invalid email or password', 401);
}
