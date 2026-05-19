<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
$data = json_decode(file_get_contents('php://input'));
if(!isset($data->id)) sendError('ID required');
try {
    $db = Database::getInstance();
    $stmt = $db->prepare('UPDATE blog_posts SET title=?, slug=?, summary=?, content=?, cover_image_url=?, seo_title=?, seo_description=?, status=?, published_at=?, is_active=? WHERE id=?');
    $stmt->execute([$data->title, $data->slug, $data->summary ?? '', $data->content ?? '', $data->cover_image_url ?? '', $data->seo_title ?? '', $data->seo_description ?? '', $data->status ?? 'draft', $data->published_at ?? null, $data->is_active ?? 1, $data->id]);
    sendResponse(['success' => true, 'message' => 'Post updated']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
