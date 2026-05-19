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
    try {
        $stmt = $db->prepare('UPDATE services SET title=?, slug=?, short_description=?, detail_description=?, category=?, image_url=?, video_url=?, suitable_for=?, benefits=?, process=?, faq=?, sort_order=?, seo_title=?, seo_description=?, is_active=? WHERE id=?');
        $stmt->execute([
            $data->title,
            $data->slug,
            $data->short_description ?? '',
            $data->detail_description ?? '',
            $data->category ?? '',
            $data->image_url ?? '',
            $data->video_url ?? '',
            $data->suitable_for ?? '',
            $data->benefits ?? '',
            $data->process ?? '',
            $data->faq ?? '',
            $data->sort_order ?? 0,
            $data->seo_title ?? '',
            $data->seo_description ?? '',
            $data->is_active ?? 1,
            $data->id
        ]);
    } catch (PDOException $ex) {
        if ($ex->getCode() == '42S22') {
            $stmt = $db->prepare('UPDATE services SET title=?, slug=?, short_description=?, detail_description=?, category=?, image_url=?, sort_order=?, seo_title=?, seo_description=?, is_active=? WHERE id=?');
            $stmt->execute([
                $data->title,
                $data->slug,
                $data->short_description ?? '',
                $data->detail_description ?? '',
                $data->category ?? '',
                $data->image_url ?? '',
                $data->sort_order ?? 0,
                $data->seo_title ?? '',
                $data->seo_description ?? '',
                $data->is_active ?? 1,
                $data->id
            ]);
        } else {
            throw $ex;
        }
    }
    sendResponse(['success' => true, 'message' => 'Service updated']);
} catch (Exception $e) {
    sendError('Database error', 500);
}
