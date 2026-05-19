<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = Database::getInstance();
 = ->query('SELECT * FROM reservations ORDER BY created_at DESC');
sendResponse(->fetchAll());
