<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->title) || !isset(->slug)) sendError('Title and slug required');
 = Database::getInstance();
 = ->prepare('INSERT INTO services (title, slug, short_description, detail_description, category, image_url, sort_order, seo_title, seo_description, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)');
->execute([->title, ->slug, ->short_description ?? '', ->detail_description ?? '', ->category ?? '', ->image_url ?? '', ->sort_order ?? 0, ->seo_title ?? '', ->seo_description ?? '', ->is_active ?? 1]);
sendResponse(['message' => 'Service created', 'id' => ->lastInsertId()]);
