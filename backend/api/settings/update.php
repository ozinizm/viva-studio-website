<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'), true);
if(!is_array()) sendError('Invalid data');
 = Database::getInstance();
 = ->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
foreach( as  => ) {
    if ( !== 'id') { ->execute([, ]); }
}
sendResponse(['message' => 'Settings updated']);
