<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
 = json_decode(file_get_contents('php://input'));
if(!isset(->id)) sendError('ID required');
 = Database::getInstance();
 = ->prepare('UPDATE blog_posts SET title=?, slug=?, summary=?, content=?, cover_image_url=?, seo_title=?, seo_description=?, status=?, published_at=?, is_active=? WHERE id=?');
->execute([->title, ->slug, ->summary ?? '', ->content ?? '', ->cover_image_url ?? '', ->seo_title ?? '', ->seo_description ?? '', ->status ?? 'draft', ->published_at ?? null, ->is_active ?? 1, ->id]);
sendResponse(['message' => 'Post updated']);
