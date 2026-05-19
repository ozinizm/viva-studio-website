<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->id)) sendError('ID required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('DELETE FROM gallery_items WHERE id=?');
    $stmt->execute([$data->id]);
    sendResponse(['success' => true, 'message' => 'Deleted successfully']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
