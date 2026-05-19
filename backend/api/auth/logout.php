<?php
require_once __DIR__ . '/../shared/response.php';
handleCors();

// For stateless JWT, logout is handled on the client side by removing the token.
// If we were using sessions or refresh tokens, we would invalidate them here.
sendResponse(['message' => 'Logged out successfully']);
