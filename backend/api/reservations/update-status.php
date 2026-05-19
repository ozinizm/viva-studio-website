<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->id) || !isset(->status)) sendError('ID and status required');
 = Database::getInstance();
 = ->prepare('UPDATE reservations SET status=?, admin_note=? WHERE id=?');
->execute([->status, ->admin_note ?? '', ->id]);
sendResponse(['message' => 'Status updated']);
