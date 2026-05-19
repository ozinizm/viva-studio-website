<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->id) || !isset($data->status)) sendError('ID and status required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('UPDATE reservations SET status=?, admin_note=? WHERE id=?');
    $stmt->execute([$data->status, $data->admin_note ?? '', $data->id]);
    sendResponse(['success' => true, 'message' => 'Status updated']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
