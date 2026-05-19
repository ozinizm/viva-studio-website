<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../shared/upload.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
if(!isset($_FILES['image'])) sendError('No image uploaded');
$path = handleUpload($_FILES['image'], 'gallery');
if(!$path) sendError('Upload failed');
try {
    $db = Database::getInstance();
    
    $media_type = $_POST['media_type'] ?? 'image';
    $video_url = $_POST['video_url'] ?? '';
    
    // Check if columns exist, if not gracefully fall back to older query
    try {
        $stmt = $db->prepare('INSERT INTO gallery_items (title, category, image_url, video_url, media_type, alt_text, sort_order) VALUES (?,?,?,?,?,?,?)');
        $stmt->execute([$_POST['title'] ?? '', $_POST['category'] ?? '', $path, $video_url, $media_type, $_POST['alt_text'] ?? '', $_POST['sort_order'] ?? 0]);
    } catch (PDOException $ex) {
        if ($ex->getCode() == '42S22') { // Column not found
            $stmt = $db->prepare('INSERT INTO gallery_items (title, category, image_url, alt_text, sort_order) VALUES (?,?,?,?,?)');
            $stmt->execute([$_POST['title'] ?? '', $_POST['category'] ?? '', $path, $_POST['alt_text'] ?? '', $_POST['sort_order'] ?? 0]);
        } else {
            throw $ex;
        }
    }
    sendResponse(['success' => true, 'message' => 'Uploaded successfully', 'url' => $path]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
