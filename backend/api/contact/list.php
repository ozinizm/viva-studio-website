<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken(); // Sadece yetkili adminler erişebilir

try {
    $db = Database::getInstance();
    $stmt = $db->query('SELECT * FROM contact_requests ORDER BY created_at DESC');
    $results = $stmt->fetchAll();
    
    sendResponse(['success' => true, 'data' => $results]);
} catch (Exception $e) {
    sendError('Veritabanı hatası.', 500);
}
