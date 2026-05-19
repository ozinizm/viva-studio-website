<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = Database::getInstance();
 = ->query('SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC');
sendResponse(->fetchAll());
