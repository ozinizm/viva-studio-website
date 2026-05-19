<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->page_key)) sendError('page_key required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('INSERT INTO seo_settings (page_key, meta_title, meta_description, og_title, og_description, og_image, canonical_url, noindex, is_active) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), og_title=VALUES(og_title), og_description=VALUES(og_description), og_image=VALUES(og_image), canonical_url=VALUES(canonical_url), noindex=VALUES(noindex), is_active=VALUES(is_active)');
    $stmt->execute([$data->page_key, $data->meta_title ?? '', $data->meta_description ?? '', $data->og_title ?? '', $data->og_description ?? '', $data->og_image ?? '', $data->canonical_url ?? '', $data->noindex ?? 0, $data->is_active ?? 1]);
    sendResponse(['success' => true, 'message' => 'SEO Settings updated']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
