<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->id)) sendError('ID required');
 = Database::getInstance();
 = ->prepare('DELETE FROM gallery_items WHERE id=?');
->execute([->id]);
sendResponse(['message' => 'Deleted successfully']);
