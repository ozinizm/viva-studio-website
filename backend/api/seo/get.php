<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = Database::getInstance();
 = ->query('SELECT * FROM seo_settings');
 = ->fetchAll();
sendResponse();
