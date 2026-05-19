<?php
// backend/api/shared/upload.php
require_once __DIR__ . '/response.php';

function handleUpload($file, $targetDir, $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm']) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $fileType = mime_content_type($file['tmp_name']);
    if (!in_array($fileType, $allowedTypes)) {
        sendError('Invalid file type: ' . $fileType, 400);
    }

    $maxSize = strpos($fileType, 'video') !== false ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB video, 5MB image
    if ($file['size'] > $maxSize) {
        sendError('File too large', 400);
    }

    // Target dir based on doc root to be safe
    // Since api is inside vivastudiopilates.com/api, uploads will be in vivastudiopilates.com/uploads
    $baseDir = __DIR__ . '/../uploads/' . $targetDir;
    
    if (!is_dir($baseDir)) {
        mkdir($baseDir, 0755, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $targetPath = $baseDir . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return '/uploads/' . $targetDir . '/' . $filename;
    }

    sendError('Failed to move uploaded file', 500);
    return null;
}
