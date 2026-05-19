<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
 = Database::getInstance();
// If public (no token), only published
 = apache_request_headers();
 = isset(['Authorization']);
if () {
     = ->query('SELECT * FROM blog_posts ORDER BY created_at DESC');
} else {
     = ->query('SELECT * FROM blog_posts WHERE status='published' AND is_active=1 ORDER BY published_at DESC');
}
sendResponse(->fetchAll());
