<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT * FROM reservations ORDER BY created_at DESC');
    sendResponse(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
