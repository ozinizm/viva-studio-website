<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->title) || !isset($data->slug)) sendError('Title and slug required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO services (title, slug, short_description, detail_description, category, image_url, sort_order, seo_title, seo_description, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)');
    $stmt->execute([$data->title, $data->slug, $data->short_description ?? '', $data->detail_description ?? '', $data->category ?? '', $data->image_url ?? '', $data->sort_order ?? 0, $data->seo_title ?? '', $data->seo_description ?? '', $data->is_active ?? 1]);
    sendResponse(['success' => true, 'message' => 'Service created', 'id' => $db->lastInsertId()]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
