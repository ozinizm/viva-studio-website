<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->full_name) || !isset($data->phone)) sendError('Name and phone required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO reservations (full_name, phone, service_id, message, source_page) VALUES (?,?,?,?,?)');
    $stmt->execute([$data->full_name, $data->phone, $data->service_id ?? null, $data->message ?? '', $data->source_page ?? '']);
    sendResponse(['success' => true, 'message' => 'Reservation created']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
