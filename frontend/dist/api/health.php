<?php
// backend/api/health.php
require_once __DIR__ . '/shared/response.php';

handleCors();

$status = [
    'success' => true,
    'api' => 'online',
    'database' => 'connected'
];

try {
    require_once __DIR__ . '/config/database.php';
    $db = Database::getInstance();
    $stmt = $db->query("SELECT 1");
    $stmt->fetch();
} catch (Exception $e) {
    $status['success'] = false;
    $status['database'] = 'error';
    // Do not leak stack trace or connection string
}

sendResponse($status);
