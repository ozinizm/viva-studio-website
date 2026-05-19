<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->title) || !isset(->slug)) sendError('Title and slug required');
 = Database::getInstance();
 = ->prepare('INSERT INTO blog_posts (title, slug, summary, content, cover_image_url, seo_title, seo_description, status, published_at, is_active) VALUES (?,?,?,?,?,?,?,?,?,?)');
->execute([->title, ->slug, ->summary ?? '', ->content ?? '', ->cover_image_url ?? '', ->seo_title ?? '', ->seo_description ?? '', ->status ?? 'draft', ->published_at ?? null, ->is_active ?? 1]);
sendResponse(['message' => 'Post created', 'id' => ->lastInsertId()]);
