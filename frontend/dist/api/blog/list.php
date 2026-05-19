<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();
try {
    $db = Database::getInstance();
    $headers = apache_request_headers();
    $isAdmin = isset($headers['Authorization']);
    if ($isAdmin) {
        $stmt = $db->query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    } else {
        $stmt = $db->query("SELECT * FROM blog_posts WHERE status='published' AND is_active=1 ORDER BY published_at DESC");
    }
    sendResponse(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (Exception $e) {
    sendError('Database error', 500);
}
