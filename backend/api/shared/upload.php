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

    // Target dir based on site root (vivastudiopilates.com/uploads/...)
    $siteRoot = dirname(__DIR__, 2);
    $baseDir = $siteRoot . '/uploads/' . $targetDir;
    
    // Auto-create required folders
    $requiredDirs = [
        $siteRoot . '/uploads',
        $siteRoot . '/uploads/logos',
        $siteRoot . '/uploads/favicons',
        $siteRoot . '/uploads/hero',
        $siteRoot . '/uploads/gallery',
        $siteRoot . '/uploads/videos',
        $siteRoot . '/uploads/blog',
        $siteRoot . '/uploads/seo',
        $siteRoot . '/uploads/legal'
    ];
    
    foreach ($requiredDirs as $dir) {
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0755, true) && !is_dir($dir)) {
                sendError('Upload directory could not be created: ' . basename($dir), 500);
            }
        }
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
