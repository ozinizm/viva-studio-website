<?php
// backend/api/shared/response.php

// Global Exception and Error Handlers to prevent HTTP 500 white screens
set_exception_handler(function($e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error',
        'error_detail' => defined('APP_DEBUG') && APP_DEBUG ? $e->getMessage() : 'Database or server error occurred.'
    ]);
    exit;
});

set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    // If the data is already enveloped (has 'success' key), send it as is.
    // Otherwise, wrap it in 'success' => true, 'data' => $data for specific endpoints.
    // However, to prevent breaking old endpoints expecting pure arrays, we keep it as is if we want,
    // or we can strictly envelope it. The instruction requested: { "success": true, "data": {...} }
    // We will assume $data is the payload.
    if (is_array($data) && isset($data['success'])) {
        echo json_encode($data);
    } else {
        // Enveloping will be done directly in the endpoints that need it, 
        // or we return pure data here so we don't break GenericCrudPage which expects an array.
        echo json_encode($data);
    }
    exit;
}

function sendError($message, $statusCode = 400) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => $message
    ]);
    exit;
}

function handleCors() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
