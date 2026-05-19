<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT * FROM seo_settings');
    $results = $stmt->fetchAll();
    sendResponse(['success' => true, 'data' => $results]);
} catch (Exception $e) {
    sendResponse(['success' => true, 'data' => []]);
}
