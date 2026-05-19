<?php
require_once __DIR__ . '/shared/response.php';
handleCors();

$siteRoot = dirname(__DIR__); // wait, dirname(__DIR__) on backend/api/test_paths.php is root/api's parent!
$dir = __DIR__;
$dirname1 = dirname($dir, 1);
$dirname2 = dirname($dir, 2);

sendResponse([
    '__DIR__' => $dir,
    'dirname_1' => $dirname1,
    'dirname_2' => $dirname2,
    'document_root' => $_SERVER['DOCUMENT_ROOT'],
    'script_filename' => $_SERVER['SCRIPT_FILENAME']
]);
