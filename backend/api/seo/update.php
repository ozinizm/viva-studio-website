<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->page_key)) sendError('page_key required');
 = Database::getInstance();
 = ->prepare('INSERT INTO seo_settings (page_key, meta_title, meta_description, og_title, og_description, og_image, canonical_url, noindex, is_active) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), og_title=VALUES(og_title), og_description=VALUES(og_description), og_image=VALUES(og_image), canonical_url=VALUES(canonical_url), noindex=VALUES(noindex), is_active=VALUES(is_active)');
->execute([->page_key, ->meta_title ?? '', ->meta_description ?? '', ->og_title ?? '', ->og_description ?? '', ->og_image ?? '', ->canonical_url ?? '', ->noindex ?? 0, ->is_active ?? 1]);
sendResponse(['message' => 'SEO Settings updated']);
