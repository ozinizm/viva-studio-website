<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../shared/auth.php';
require_once __DIR__ . '/../shared/upload.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
verifyToken();
$path = '';
$media_type = $_POST['media_type'] ?? 'image';
$video_url = $_POST['video_url'] ?? '';

$poster_path = null;
if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $poster_path = handleUpload($_FILES['poster'], 'gallery_posters');
}

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $path = handleUpload($_FILES['image'], 'gallery');
    if (!$path) sendError('Upload failed');
} else {
    if ($media_type === 'image' || ($media_type === 'video' && empty($video_url))) {
        sendError('Lütfen yüklenecek bir dosya seçin veya video URL girin.', 400);
    }
}
try {
    $db = Database::getInstance();
    
    // Auto-migrate poster_url column if it doesn't exist
    try {
        $db->exec("ALTER TABLE gallery_items ADD COLUMN poster_url VARCHAR(255) DEFAULT NULL");
    } catch (PDOException $e) {
        // Ignore if column already exists
    }
    // Auto-migrate orientation column if it doesn't exist
    try {
        $db->exec("ALTER TABLE gallery_items ADD COLUMN orientation VARCHAR(20) DEFAULT 'horizontal'");
    } catch (PDOException $e) {
        // Ignore if column already exists
    }
    
    $media_type = $_POST['media_type'] ?? 'image';
    $video_url = $_POST['video_url'] ?? '';
    $orientation = $_POST['orientation'] ?? 'horizontal';
    
    // Check if columns exist, if not gracefully fall back to older query
    try {
        $stmt = $db->prepare('INSERT INTO gallery_items (title, category, image_url, video_url, poster_url, media_type, alt_text, sort_order, orientation) VALUES (?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$_POST['title'] ?? '', $_POST['category'] ?? '', $path, $video_url, $poster_path, $media_type, $_POST['alt_text'] ?? '', $_POST['sort_order'] ?? 0, $orientation]);
    } catch (PDOException $ex) {
        if ($ex->getCode() == '42S22') { // Column not found
            try {
                $stmt = $db->prepare('INSERT INTO gallery_items (title, category, image_url, video_url, media_type, alt_text, sort_order) VALUES (?,?,?,?,?,?,?)');
                $stmt->execute([$_POST['title'] ?? '', $_POST['category'] ?? '', $path, $video_url, $media_type, $_POST['alt_text'] ?? '', $_POST['sort_order'] ?? 0]);
            } catch (PDOException $e) {
                $stmt = $db->prepare('INSERT INTO gallery_items (title, category, image_url, alt_text, sort_order) VALUES (?,?,?,?,?)');
                $stmt->execute([$_POST['title'] ?? '', $_POST['category'] ?? '', $path, $_POST['alt_text'] ?? '', $_POST['sort_order'] ?? 0]);
            }
        } else {
            throw $ex;
        }
    }
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $absoluteUrl = $protocol . $host . $path;
    sendResponse([
        'success' => true, 
        'message' => 'Uploaded successfully', 
        'url' => $path,
        'absolute_url' => $absoluteUrl
    ]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
