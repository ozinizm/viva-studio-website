<?php
/**
 * Uploads Migration Helper
 * Copies legacy files from api/uploads to the corrected public root uploads directory.
 * Licenses: Fikir Creative (https://fikircreative.com)
 */

require_once __DIR__ . '/shared/response.php';
handleCors();

$src = __DIR__ . '/uploads';
$dest = dirname(__DIR__, 1) . '/uploads';

function copyFolder($src, $dest) {
    if (!is_dir($src)) {
        return false;
    }
    if (!is_dir($dest)) {
        mkdir($dest, 0755, true);
    }
    $dir = opendir($src);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                copyFolder($src . '/' . $file, $dest . '/' . $file);
            } else {
                copy($src . '/' . $file, $dest . '/' . $file);
            }
        }
    }
    closedir($dir);
    return true;
}

$success = copyFolder($src, $dest);

sendResponse([
    'success' => true,
    'migrated' => $success,
    'message' => $success ? 'Legacy uploads migrated successfully to public root.' : 'No legacy uploads directory found or already migrated.',
    'src' => $src,
    'dest' => $dest
]);
