<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = json_decode(file_get_contents('php://input'));
if(!isset(->full_name) || !isset(->phone)) sendError('Name and phone required');
 = Database::getInstance();
 = ->prepare('INSERT INTO reservations (full_name, phone, service_id, message, source_page) VALUES (?,?,?,?,?)');
->execute([->full_name, ->phone, ->service_id ?? null, ->message ?? '', ->source_page ?? '']);
sendResponse(['message' => 'Reservation created']);
