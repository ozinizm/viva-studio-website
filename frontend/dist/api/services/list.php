<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT * FROM services ORDER BY sort_order ASC');
    sendResponse(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    sendError('Failed to fetch services: ' . $e->getMessage(), 500);
}
