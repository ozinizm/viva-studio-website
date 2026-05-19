<?php
require_once __DIR__ . '/../../shared/response.php';
require_once __DIR__ . '/../../shared/auth.php';
require_once __DIR__ . '/../../shared/upload.php';
require_once __DIR__ . '/../../config/database.php';
handleCors();
verifyToken();
if(!isset(['image'])) sendError('No image uploaded');
 = handleUpload(['image'], 'gallery');
if(!) sendError('Upload failed');
 = Database::getInstance();
 = ->prepare('INSERT INTO gallery_items (title, category, image_url, alt_text, sort_order) VALUES (?,?,?,?,?)');
->execute([['title'] ?? '', ['category'] ?? '', , ['alt_text'] ?? '', ['sort_order'] ?? 0]);
sendResponse(['message' => 'Uploaded successfully', 'url' => ]);
