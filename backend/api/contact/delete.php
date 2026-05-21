<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();

// DELETE method da desteklenebilir, POST üzerinden de json ile id alınabilir.
$data = json_decode(file_get_contents('php://input'), true);
if (!$data && isset($_GET['id'])) {
    $id = intval($_GET['id']);
} else {
    $id = isset($data['id']) ? intval($data['id']) : 0;
}

if (!$id) {
    sendError('ID required');
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare('DELETE FROM contact_requests WHERE id = ?');
    $stmt->execute([$id]);
    
    sendResponse(['success' => true, 'message' => 'Talep silindi.']);
} catch (Exception $e) {
    sendError('Veritabanı hatası.', 500);
}
