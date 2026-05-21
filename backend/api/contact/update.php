<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken(); // Sadece yetkili adminler

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    sendError('ID required');
}

$id = intval($data['id']);

try {
    $db = Database::getInstance();
    
    // Hem status hem de notes güncellenebilir
    if (isset($data['status']) && isset($data['notes'])) {
        $stmt = $db->prepare('UPDATE contact_requests SET status = ?, notes = ? WHERE id = ?');
        $stmt->execute([trim($data['status']), trim($data['notes']), $id]);
    } else if (isset($data['status'])) {
        $stmt = $db->prepare('UPDATE contact_requests SET status = ? WHERE id = ?');
        $stmt->execute([trim($data['status']), $id]);
    } else if (isset($data['notes'])) {
        $stmt = $db->prepare('UPDATE contact_requests SET notes = ? WHERE id = ?');
        $stmt->execute([trim($data['notes']), $id]);
    }
    
    sendResponse(['success' => true, 'message' => 'Talep güncellendi.']);
} catch (Exception $e) {
    sendError('Veritabanı hatası.', 500);
}
