<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = Database::getInstance();
 = ->query('SELECT * FROM services ORDER BY sort_order ASC');
sendResponse(->fetchAll());
