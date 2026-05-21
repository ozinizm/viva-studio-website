<?php
// backend/api/shared/upload.php
require_once __DIR__ . '/response.php';

function handleUpload($file, $targetDir, $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $fileType = mime_content_type($file['tmp_name']);
    if (!in_array($fileType, $allowedTypes)) {
        sendError('Invalid file type: ' . $fileType, 400);
    }

    $maxSize = strpos($fileType, 'video') !== false ? 100 * 1024 * 1024 : 15 * 1024 * 1024; // 100MB video, 15MB image
    if ($file['size'] > $maxSize) {
        sendError('File too large', 400);
    }

    // Target dir based on site root (vivastudiopilates.com/uploads/...)
    $siteRoot = realpath(dirname(__DIR__, 2)) ?: dirname(__DIR__, 2);
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
            // Try 0755 first, then 0777 if it fails
            if (!@mkdir($dir, 0755, true)) {
                if (!@mkdir($dir, 0777, true) && !is_dir($dir)) {
                    sendError('Upload directory could not be created', 500);
                }
            }
        }
        
        // Ensure it is writable
        if (!is_writable($dir)) {
            @chmod($dir, 0755);
            if (!is_writable($dir)) {
                @chmod($dir, 0777);
                if (!is_writable($dir)) {
                    sendError('Upload directory could not be created', 500);
                }
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
