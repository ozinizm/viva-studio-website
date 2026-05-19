<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC');
    sendResponse(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
