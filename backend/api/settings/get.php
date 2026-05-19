<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = Database::getInstance();
 = ->query('SELECT setting_key, setting_value FROM site_settings');
 = ->fetchAll();
 = [];
foreach( as ) { [['setting_key']] = ['setting_value']; }
sendResponse();
