<?php
require_once __DIR__ . '/../shared/response.php';
require_once __DIR__ . '/../config/database.php';
handleCors();

// Sadece POST desteklenir
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Invalid request method');
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || empty(trim($data['name']))) {
    sendError('Ad Soyad zorunludur.');
}
if (!isset($data['phone']) || empty(trim($data['phone']))) {
    sendError('Telefon zorunludur.');
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare('
        INSERT INTO contact_requests (name, phone, email, service, message, status) 
        VALUES (?, ?, ?, ?, ?, "new")
    ');
    
    $stmt->execute([
        trim($data['name']),
        trim($data['phone']),
        trim($data['email'] ?? ''),
        trim($data['service'] ?? ''),
        trim($data['message'] ?? '')
    ]);
    
    sendResponse(['success' => true, 'message' => 'Talebiniz başarıyla alındı.']);
} catch (Exception $e) {
    sendError('Veritabanı hatası.', 500);
}
