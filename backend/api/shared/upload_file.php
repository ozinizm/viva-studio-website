<?php
// backend/api/shared/upload_file.php
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/upload.php';

handleCors();
verifyToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
    sendError('No file uploaded', 400);
}

$folder = $_POST['folder'] ?? 'general';
// Sanitize folder to prevent directory traversal
$folder = preg_replace('/[^a-zA-Z0-9_\-]/', '', $folder);

$path = handleUpload($_FILES['file'], $folder);

if ($path) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    $absoluteUrl = $protocol . $host . $path;
    sendResponse([
        'success' => true, 
        'url' => $path,
        'absolute_url' => $absoluteUrl
    ]);
} else {
    sendError('Upload failed', 500);
}
